import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3003;
const OR_KEY = process.env.OR_KEY;
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'google/gemini-2.5-flash-preview-05-20';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new Database(join(__dirname, 'data', 'quorum.db'));
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
`);

const histCols = db.prepare("PRAGMA table_info(history)").all();
if (!histCols.find(c => c.name === 'cost')) {
  db.exec("ALTER TABLE history ADD COLUMN cost REAL DEFAULT 0");
}

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

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
app.get('/api/history', (req, res) => {
  const rows = db.prepare('SELECT data, cost FROM history ORDER BY created_at DESC').all();
  res.json(rows.map(r => { const s = JSON.parse(r.data); if (!s.cost && r.cost) s.cost = r.cost; return s; }));
});

app.post('/api/history', (req, res) => {
  const session = req.body;
  db.prepare('INSERT OR REPLACE INTO history (id, data, cost, created_at) VALUES (?, ?, ?, ?)').run(session.id, JSON.stringify(session), session.cost || 0, session.id);
  res.json({ ok: true });
});

app.delete('/api/history/:id', (req, res) => {
  db.prepare('DELETE FROM history WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── Favourites ────────────────────────────────────────────
app.get('/api/favourites', (req, res) => {
  const rows = db.prepare('SELECT model_id FROM favourites').all();
  res.json(rows.map(r => r.model_id));
});

app.post('/api/favourites', (req, res) => {
  const { model_id } = req.body;
  db.prepare('INSERT OR IGNORE INTO favourites (model_id) VALUES (?)').run(model_id);
  res.json({ ok: true });
});

app.delete('/api/favourites/*', (req, res) => {
  const modelId = req.params[0];
  db.prepare('DELETE FROM favourites WHERE model_id = ?').run(modelId);
  res.json({ ok: true });
});

// ── Agents ────────────────────────────────────────────────
app.get('/api/agents', (req, res) => {
  const rows = db.prepare('SELECT data FROM agents').all();
  res.json(rows.map(r => JSON.parse(r.data)));
});

app.post('/api/agents', (req, res) => {
  const agent = req.body;
  db.prepare('INSERT OR REPLACE INTO agents (id, data) VALUES (?, ?)').run(agent.id, JSON.stringify(agent));
  res.json({ ok: true });
});

app.delete('/api/agents/:id', (req, res) => {
  db.prepare('DELETE FROM agents WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Quorum listening on :${PORT}`));
