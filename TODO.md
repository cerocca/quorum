# TODO — Quorum

Legend: `[ ]` open · `[x]` done · `[~]` in progress · `[-]` discarded

---

## v0.5.0 — Custom agents

- [ ] Bias list expanded: add `empirical` (orange chip) and `custom` (grey chip, placeholder for future custom bias)
- [ ] Custom agent form in Agents tab: name, bias (from fixed list), colour (free, independent from bias), system prompt, optional model override
- [ ] Custom agents appear in agent grid alongside the 6 built-in ones
- [ ] Custom agents scoped by user_id, persisted in SQLite (table `agents` already scaffolded)
- [ ] Model override for custom agents only — built-in agents always use the global model
- [ ] Settings > Agents: view built-in agent config (name, bias, full system prompt, expandable)
- [ ] Settings > Agents: export all built-in agent prompts as .md
- [ ] Settings > Agents: collapsible prompt-writing guide (how to write agent system prompts, with examples from built-ins)
- [ ] Settings > Agents: download guide as .md

---

## Backlog

- [ ] Compare two decisions in parallel
- [ ] Devil's Panel mode — all agents with skeptic bias
- [ ] Telegram webhook notification on run complete
- [ ] Solo mode: query a single agent, no verdict

---

## Discarded

- [-] Automatic agent gating (decided manually by user)
- [-] Hierarchical team leads (overkill)
- [-] PPTX/DOCX export (not a priority)
- [-] Multiple LLM provider support (OpenRouter only)
