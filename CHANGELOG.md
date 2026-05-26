# CHANGELOG — Quorum Decision Panel

## v2 — Agent bias, Judge modes, Pre-mortem
*2026-05-26*

- Added bias property to all 6 agents (skeptic / advocate / investigative)
- Rewrote all agent system prompts with declared bias framing
- Added bias badge on each agent card (color-coded)
- Added JUDGE_MODES: Analyst (balanced) and Sentinel (risk-first, default NO-GO)
- Added Judge mode selector in UI
- Added Phase 4: Pre-mortem — each agent answers what caused the failure in 12 months
- resetPanel() updated to clear Phase 4 outputs

## v2-infra — Docker stack
*2026-05-26*

- Added `server.js`: Express proxy for `/api/chat` and `/api/models` → OpenRouter
  - `OR_KEY` and `DEFAULT_MODEL` loaded from `.env`
  - `model` field passed through from client body; falls back to `DEFAULT_MODEL` if missing
  - Error handling: rate limit (429), model not found (404), timeout (10s models / 30s chat)
- Added `package.json` (ESM, dependency: express)
- Added `Dockerfile` (node:20-alpine, port 3003)
- Added `docker-compose.yml` (port 3003, env_file, restart: unless-stopped)

## v1 — Frontend standalone
*2026-05-26*

- Added `public/index.html`: single-file frontend, 3-phase pipeline, model selector
- Added `.gitignore` (node_modules, .env, .DS_Store)
- Added `.env.example` with OR_KEY, DEFAULT_MODEL, PORT
