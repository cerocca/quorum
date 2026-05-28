# CHANGELOG — Quorum Decision Panel

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
