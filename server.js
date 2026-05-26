import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = process.env.PORT || 3003;
const OR_KEY = process.env.OR_KEY;
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'google/gemini-2.5-flash-preview-05-20';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

app.listen(PORT, () => console.log(`Quorum listening on :${PORT}`));
