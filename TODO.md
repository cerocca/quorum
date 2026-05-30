# TODO.md — Quorum Decision Panel

Legend: `[ ]` open · `[x]` done · `[~]` in progress · `[-]` discarded

---

## v0.4.7 — Settings drawer with tabs
- [x] Replace current Settings drawer with tabbed version: Prefs, Profiles, Agents, Admin
- [x] Prefs tab: language toggle + light/dark theme toggle
- [x] Profiles tab: empty scaffold, "Coming soon"
- [x] Agents tab: empty scaffold, "Coming soon"
- [x] Admin tab: empty scaffold, "Coming soon"
- [x] Dark theme (Slate palette) wired to theme toggle
- [x] User footer in Settings drawer (avatar + username placeholder)
- [x] Page footer (avatar + username, GitHub link, version)

---

## v0.4.8 — Auth + Profiles
- [ ] Login page: username + password, cookie session
- [ ] User table in SQLite: id, username, password_hash, is_admin
- [ ] All data scoped by user_id: history, favourites, profiles
- [ ] Profile CRUD: name + free text, shown in Profiles tab
- [ ] Active profile selector before run (last used remembered)
- [ ] Profile injected into agent system prompts at run time
- [ ] Profile saved with session in history

---

## v0.5.0 — Custom agents
- [ ] Custom agent form in Agents tab: name, bias, colour, system prompt, optional model override
- [ ] Custom agents appear in agent grid alongside the 6 built-in ones
- [ ] Full CRUD via /api/agents

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
