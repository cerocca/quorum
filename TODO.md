# TODO — Quorum

Legend: `[ ]` open · `[x]` done · `[~]` in progress · `[-]` discarded

---

## v0.5.0 — Custom agents

- [x] Bias list expanded: add `empirical` (orange chip) and `custom` (grey chip, placeholder for future custom bias)
- [x] Custom agent form in Agents tab: name, bias (from fixed list), colour (free, independent from bias), system prompt, optional model override
- [x] Custom agents appear in agent grid alongside the 6 built-in ones
- [x] Custom agents scoped by admin, persisted in SQLite (table `agents`); GET returns to all authenticated users
- [x] Model override for custom agents only — built-in agents always use the global model
- [x] Settings > Agents: view built-in agent config (name, bias, full system prompt, expandable)
- [x] Settings > Agents: export all built-in agent prompts as .md
- [x] Settings > Agents: collapsible prompt-writing guide (how to write agent system prompts, with examples from built-ins)
- [x] Settings > Agents: download guide as .md

---

## Backlog

- [ ] Custom agent colour: apply agent-level colour override to bias chip in agent grid (currently colour picker is saved but ignored — chip uses BIAS_CHIP map colour)
- [ ] Compare two decisions in parallel
- [ ] Devil's Panel mode — all agents with skeptic bias
- [ ] Telegram webhook notification on run complete
- [ ] Solo mode: query a single agent, no verdict
- [ ] Profile language: support EN + ITA fields (like custom agents) and inject the correct version based on active UI language

---

## Discarded

- [-] Automatic agent gating (decided manually by user)
- [-] Hierarchical team leads (overkill)
- [-] PPTX/DOCX export (not a priority)
- [-] Multiple LLM provider support (OpenRouter only)
