import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const PORT = process.env.PORT || 3003;
const OR_KEY = process.env.OR_KEY;
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'google/gemini-2.5-flash-preview-05-20';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new Database(join(__dirname, 'data', 'quorum.db'));

// ── Schema ────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS favourites (
    model_id TEXT PRIMARY KEY
  );
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Migrations ────────────────────────────────────────────
const histCols = db.prepare('PRAGMA table_info(history)').all();
if (!histCols.find(c => c.name === 'cost')) {
  db.exec('ALTER TABLE history ADD COLUMN cost REAL DEFAULT 0');
}
if (!histCols.find(c => c.name === 'user_id')) {
  db.exec('ALTER TABLE history ADD COLUMN user_id INTEGER REFERENCES users(id)');
}

const favCols = db.prepare('PRAGMA table_info(favourites)').all();
if (!favCols.find(c => c.name === 'user_id')) {
  db.exec('ALTER TABLE favourites ADD COLUMN user_id INTEGER REFERENCES users(id)');
}

const agentCols = db.prepare('PRAGMA table_info(agents)').all();
if (!agentCols.find(c => c.name === 'user_id')) {
  db.exec('ALTER TABLE agents ADD COLUMN user_id INTEGER REFERENCES users(id)');
}

const userCols = db.prepare('PRAGMA table_info(users)').all();
if (!userCols.find(c => c.name === 'active_profile_id')) {
  db.exec('ALTER TABLE users ADD COLUMN active_profile_id INTEGER REFERENCES profiles(id) ON DELETE SET NULL');
}

// ── Seed admin ────────────────────────────────────────────
const { cnt } = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
if (cnt === 0) {
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'changeme';
  const hash = bcrypt.hashSync(adminPass, 12);
  db.prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 1)').run(adminUser, hash);
  console.log(`Admin user created: ${adminUser}`);
}

// ── Migrate orphaned rows ─────────────────────────────────
db.exec('UPDATE history SET user_id = 1 WHERE user_id IS NULL');
db.exec('UPDATE favourites SET user_id = 1 WHERE user_id IS NULL');
db.exec('UPDATE agents SET user_id = 1 WHERE user_id IS NULL');

// ── Session middleware ────────────────────────────────────
app.use(session({
  store: new SQLiteStore({ database: 'quorum.db', dir: '/app/data', table: 'sessions' }),
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, rolling: true },
}));

app.use(express.json());

// ── Login page (before static, no auth) ──────────────────
app.get('/login', (req, res) => res.sendFile('login.html', { root: './public' }));

app.use(express.static(join(__dirname, 'public')));

// ── Auth middleware ───────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.status(403).json({ error: 'Forbidden' });
}

// ── Auth routes ───────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.userId = user.id;
  req.session.isAdmin = user.is_admin === 1;
  res.json({ ok: true, username: user.username, isAdmin: user.is_admin === 1, activeProfileId: user.active_profile_id });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

app.post('/api/auth/update', requireAuth, (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) return res.status(400).json({ error: 'Nothing to update' });
  const sets = []; const params = [];
  if (username) {
    const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, req.session.userId);
    if (existing) return res.status(409).json({ error: 'Username already taken' });
    sets.push('username = ?'); params.push(username);
  }
  if (password) {
    sets.push('password_hash = ?'); params.push(bcrypt.hashSync(password, 12));
  }
  params.push(req.session.userId);
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...params);
  const user = db.prepare('SELECT username FROM users WHERE id = ?').get(req.session.userId);
  res.json({ ok: true, username: user.username });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = db.prepare('SELECT username, is_admin, active_profile_id FROM users WHERE id = ?').get(req.session.userId);
  res.json({ username: user.username, isAdmin: user.is_admin === 1, activeProfileId: user.active_profile_id });
});

// ── Models ────────────────────────────────────────────────
app.get('/api/models', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${OR_KEY}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    if (err.name === 'AbortError') return res.status(504).json({ error: 'timeout' });
    res.status(502).json({ error: err.message });
  }
});

// ── Chat ──────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.model) body.model = DEFAULT_MODEL;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OR_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await response.json();
    if (response.status === 429) return res.status(429).json({ error: 'rate_limit', detail: data });
    if (response.status === 404) return res.status(404).json({ error: 'model_not_found', detail: data });
    res.status(response.status).json(data);
  } catch (err) {
    if (err.name === 'AbortError') return res.status(504).json({ error: 'timeout' });
    res.status(502).json({ error: err.message });
  }
});

// ── History ───────────────────────────────────────────────
app.get('/api/history', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT data, cost FROM history WHERE user_id = ? ORDER BY created_at DESC').all(req.session.userId);
  res.json(rows.map(r => { const s = JSON.parse(r.data); if (!s.cost && r.cost) s.cost = r.cost; return s; }));
});

app.post('/api/history', requireAuth, (req, res) => {
  const s = req.body;
  db.prepare('INSERT OR REPLACE INTO history (id, data, cost, created_at, user_id) VALUES (?, ?, ?, ?, ?)').run(s.id, JSON.stringify(s), s.cost || 0, s.id, req.session.userId);
  res.json({ ok: true });
});

app.delete('/api/history/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM history WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
  res.json({ ok: true });
});

// ── Favourites ────────────────────────────────────────────
app.get('/api/favourites', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT model_id FROM favourites WHERE user_id = ?').all(req.session.userId);
  res.json(rows.map(r => r.model_id));
});

app.post('/api/favourites', requireAuth, (req, res) => {
  const { model_id } = req.body;
  db.prepare('INSERT OR IGNORE INTO favourites (model_id, user_id) VALUES (?, ?)').run(model_id, req.session.userId);
  res.json({ ok: true });
});

app.delete('/api/favourites/*', requireAuth, (req, res) => {
  const modelId = req.params[0];
  db.prepare('DELETE FROM favourites WHERE model_id = ? AND user_id = ?').run(modelId, req.session.userId);
  res.json({ ok: true });
});

// ── Agents ────────────────────────────────────────────────
app.get('/api/agents', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT data FROM agents WHERE user_id = ?').all(req.session.userId);
  res.json(rows.map(r => JSON.parse(r.data)));
});

app.post('/api/agents', requireAuth, (req, res) => {
  const agent = req.body;
  db.prepare('INSERT OR REPLACE INTO agents (id, data, user_id) VALUES (?, ?, ?)').run(agent.id, JSON.stringify(agent), req.session.userId);
  res.json({ ok: true });
});

app.delete('/api/agents/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM agents WHERE id = ? AND user_id = ?').run(req.params.id, req.session.userId);
  res.json({ ok: true });
});

// ── Profiles ──────────────────────────────────────────────
app.get('/api/profiles', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM profiles WHERE user_id = ? ORDER BY created_at ASC').all(req.session.userId);
  res.json(rows);
});

app.post('/api/profiles', requireAuth, (req, res) => {
  const { name, content } = req.body;
  const result = db.prepare('INSERT INTO profiles (user_id, name, content) VALUES (?, ?, ?)').run(req.session.userId, name, content || '');
  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(result.lastInsertRowid);
  res.json(profile);
});

app.put('/api/profiles/:id', requireAuth, (req, res) => {
  const profile = db.prepare('SELECT id FROM profiles WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!profile) return res.status(404).json({ error: 'Not found' });
  const { name, content } = req.body;
  db.prepare('UPDATE profiles SET name = ?, content = ? WHERE id = ?').run(name, content, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/profiles/:id', requireAuth, (req, res) => {
  const profile = db.prepare('SELECT id FROM profiles WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!profile) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM profiles WHERE id = ?').run(req.params.id);
  const user = db.prepare('SELECT active_profile_id FROM users WHERE id = ?').get(req.session.userId);
  if (user.active_profile_id == req.params.id) {
    db.prepare('UPDATE users SET active_profile_id = NULL WHERE id = ?').run(req.session.userId);
  }
  res.json({ ok: true });
});

// deactivate must come before /:id/activate to avoid route shadowing
app.patch('/api/profiles/deactivate', requireAuth, (req, res) => {
  db.prepare('UPDATE users SET active_profile_id = NULL WHERE id = ?').run(req.session.userId);
  res.json({ ok: true });
});

app.patch('/api/profiles/:id/activate', requireAuth, (req, res) => {
  const profile = db.prepare('SELECT id FROM profiles WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!profile) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE users SET active_profile_id = ? WHERE id = ?').run(req.params.id, req.session.userId);
  res.json({ ok: true });
});

// ── Admin ─────────────────────────────────────────────────
app.get('/api/admin/users', requireAuth, requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, username, is_admin, created_at FROM users ORDER BY created_at ASC').all();
  res.json(users);
});

app.post('/api/admin/users', requireAuth, requireAdmin, (req, res) => {
  const { username, password, isAdmin } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  const result = db.prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)').run(username, hash, isAdmin ? 1 : 0);
  const user = db.prepare('SELECT id, username, is_admin FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.json(user);
});

app.delete('/api/admin/users/:id', requireAuth, requireAdmin, (req, res) => {
  if (req.session.userId === parseInt(req.params.id)) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.patch('/api/admin/users/:id/password', requireAuth, requireAdmin, (req, res) => {
  if (req.session.userId === parseInt(req.params.id)) {
    return res.status(400).json({ error: 'Use /api/auth/update to change your own password' });
  }
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  const hash = bcrypt.hashSync(password, 12);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Quorum listening on :${PORT}`));
