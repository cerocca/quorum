# TODO.md — Quorum Decision Panel

Legend: `[ ]` open · `[x]` done · `[~]` in progress · `[-]` discarded

---

## v0.5 — Language, favourites, custom agent

- [ ] Custom agent: form in Settings > Agents — name, bias, colour, system prompt. Appears as a seventh selectable card.
- [ ] Custom agent: optional per-agent model — override the global model for a single agent (mix models in the same run)
- [ ] Per-agent bias selectable by user (toggle skeptic/advocate/investigative on each card) — evaluate whether it adds value or confusion
- [ ] Quick mode agent swap: deselect one and select another without switching to Full → UNDERSTAND BEHAVIOUR FIRST

---

## Backlog / unscheduled ideas

- [ ] Compare two decisions in parallel
- [ ] "Devil's Panel" mode — all agents with skeptic bias
- [ ] Webhook integration (e.g. Telegram notification on run complete)
- [ ] Multi-user support (basic auth, out of scope for LAN-only for now)
- [ ] Company profile: multiple named profiles selectable per run (no auth required, single-user LAN)
- [ ] Company profile: persistent context per user — requires authentication first
- [ ] Solo mode: query a single agent, simplified output without verdict — evaluate impact on tool identity

---

## Discarded

- [-] Automatic agent gating (tier decided manually by user)
- [-] Hierarchical team leads (too much overkill)
- [-] PPTX/DOCX export (not a priority)
- [-] Multiple LLM provider support (OpenRouter only)
