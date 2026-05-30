# Quorum v0.5.0 — Custom Agents

## What's new

### Custom agents
Build your own agents alongside the 6 built-in ones. Each custom agent has a name (EN + ITA), description, bias, colour, system prompt, and an optional model override — so you can assign a different LLM to a specific agent while the rest use the global model.

Custom agents are persisted in SQLite, scoped by user, and fully editable after creation.

### Built-in agent viewer
Settings > Agents now shows the full configuration of every built-in agent — name, bias, and complete system prompt — expandable inline. Export all prompts as a single markdown file for reference or inspiration.

### Prompt writing guide
A collapsible guide in Settings > Agents explains how to write effective agent system prompts, with examples drawn from the built-ins. Downloadable as .md.

### Bias chip redesign
All 8 bias labels now have distinct colours:
- `contrarian` — red
- `risk-first` — orange
- `feasibility` — blue
- `opportunity` — yellow-green
- `horizon` — purple
- `harm-aware` — teal
- `empirical` — pink (new)
- `custom` — grey (new, placeholder)

## Bug fixes
- Custom agent edit was silently creating a new agent instead of updating the existing one

## Infrastructure
- Google Fonts restored (Syne + IBM Plex Mono) — local TTF files removed from repo
