# CHANGELOG — Quorum Decision Panel

## v0.4.8 — Auth + Profiles
*2026-05-30*

- Login page (public/login.html): Quorum design system, local fonts (Syne + IBM Plex Mono served from /public/fonts/)
- Cookie-based authentication: express-session + connect-sqlite3, sessions persisted in SQLite
- New table: users (id, username, password_hash, is_admin, active_profile_id, created_at)
- New table: profiles (id, user_id, name, content, created_at)
- Admin seed on first boot (ADMIN_USER / ADMIN_PASS from .env, one-shot if users table is empty)
- Orphan data migration: history and favourites rows without user_id assigned to user_id = 1
- requireAuth and requireAdmin middleware on all API routes
- All data (history, favourites, agents) scoped by user_id
- Auth routes: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me, POST /api/auth/update
- Profile routes: GET/POST/PUT/DELETE /api/profiles + PATCH activate/deactivate
- Admin routes: GET/POST/DELETE /api/admin/users, PATCH /api/admin/users/:id/password
- index.html: auth check on boot, redirect to /login if unauthenticated
- index.html: profile injector — active profile prepended to every agent system prompt
- index.html: Settings > Admin — Sign out, account update (username/password), user management (admin only), password reset for other users, collapsible sections
- index.html: Settings > Profiles — profile CRUD, active profile selector
- index.html: avatar shows first letter of username
- index.html: model dropdown no longer opens automatically on page load
- Font files served locally to avoid Google Fonts dependency on LAN-only deployments

## v0.4.7 — Settings drawer with tabs + page footer
*2026-05-30*

- Settings drawer replaced with tabbed version: Prefs, Profiles, Agents, Admin
- Prefs tab: language toggle and light/dark theme toggle
- Dark theme implemented (Slate dark palette, toggled via `data-theme="dark"` on `<html>`)
- Profiles / Agents / Admin tabs: scaffold with "Coming soon" placeholder
- User footer added to Settings drawer (avatar circle + username, placeholder for v0.4.8)
- Page footer added: avatar + username left, GitHub icon + version right
- Page footer font-size 11px; GitHub icon links to https://github.com/cerocca/quorum
- Settings drawer font fixed: system-ui instead of Syne on row labels and toggle buttons
- Layout max-width 1400px, side padding 32px (landed in v0.4.6 session, documented here)

## v0.4.6 — Run cost tracking
*2026-05-30*

- `callProxy()` now returns `{ text, cost }` instead of plain text; reads `usage.cost` from OpenRouter response (fallback to 0)
- `sessionCost` accumulated across all phases (1, 2, 3, 4)
- Total run cost displayed near the New decision / Export buttons after run completes; same visual style as reset/export buttons (non-clickable), aligned right via `justify-content: space-between`
- `cost` column added to SQLite `history` table via `ALTER TABLE` with `PRAGMA table_info` guard (safe on existing DB)
- Cost saved per session in both JSON data blob and dedicated column
- Cost included in markdown export as `**Cost:**` field after `**Model:**`
- Cost shown in history drawer entry metadata (monospace, fallback to empty if absent)
- All repo files must be in English (CHANGELOG, TODO, CLAUDE.md, SETUP.md, commit messages)
- Layout: max-width 1400px, side padding 32px

## v0.4.5 — Migrazione SQLite per history e favourites
*2026-05-28*

- Dockerfile: aggiunto build toolchain alpine (python3, make, g++) per compilare better-sqlite3
- package.json: dipendenza better-sqlite3 ^9.4.3
- server.js: inizializzazione DB SQLite in /app/data/quorum.db con tabelle history, favourites, agents; createRequire per compatibilità ESM
- Route REST: GET/POST/DELETE /api/history, GET/POST/DELETE /api/favourites, GET/POST/DELETE /api/agents
- docker-compose.yml: volume ./data:/app/data
- Frontend: sostituiti tutti gli accessi localStorage per history e favourites con fetch verso le nuove API; cache client-side (historyCache, favouritesCache) con aggiornamento ottimistico
- migrateFromLocalStorage(): controlla se DB è vuoto, importa dati da localStorage, poi rimuove le chiavi

## v0.4.1 — Mobile fix, UI polish, token limits
*2026-05-28*

- Mobile layout: header grid, icon-only buttons, full-width model input, inline tag chip
- Model favourites: auto-load on page start, starred models always pinned at top
- Status indicators: dots replaced with ✓/⟳/✕ icons on agent cards
- Done-state badge: reverted to neutral color, only icon signals completion
- Font: system-ui applied to input labels and textareas
- Header buttons: grouped right in .header-actions
- max_tokens increased: 1200 for Phase 1/4, 2000 for Phase 2/3
- Model search slash bug fixed
- History and Settings drawers: full-width on mobile

## v0.4 — Light theme, UI copy, history & export
*2026-05-27*

- Applied light theme replacing dark theme
- Hero tagline and model lede added
- Agent descriptions and bias labels rewritten
- Judge card descriptions updated (Analyst / Sentinel)
- All 6 agent bias labels made unique (contrarian, risk-first, feasibility, opportunity, horizon, harm-aware)
- Bias badges styled as rounded pills
- Section and input labels set to bold
- Active card text color fixed (no yellow on text)
- Agent names always black
- Engagement tier: Quick 2-3 agents, Full 3-5, descriptions updated
- Font switched to system-ui for agent output and hero lede
- Session export: markdown download after completed run
- History drawer: localStorage, max 50 sessions, verdict pill, single/multi delete
- Restore session from history with scroll to pipeline
- public/ mounted as bind volume in docker-compose.yml

## v0.3 — Agent bias, Judge modes, Pre-mortem, Engagement tier
*2026-05-26*

- Bias property added to all 6 agents (skeptic / advocate / investigative)
- Agent system prompts rewritten with declared bias framing
- Bias badge on each agent card
- Judge modes: Analyst and Sentinel
- Judge mode selector in UI
- Phase 4: Pre-mortem
- Engagement tier: Quick (3 agents, phase 1+3) vs Full (all phases)
- Collapsible agent output cards

## v0.2 — Docker stack
*2026-05-26*

- server.js: Express proxy for /api/chat and /api/models → OpenRouter
- package.json, Dockerfile, docker-compose.yml
- Port 3003, restart: unless-stopped

## v0.1 — Frontend standalone
*2026-05-26*

- public/index.html: single-file frontend, 3-phase pipeline, model selector
- .gitignore, .env.example
