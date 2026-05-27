# Quorum

![License](https://img.shields.io/github/license/cerocca/quorum)
![Last Commit](https://img.shields.io/github/last-commit/cerocca/quorum)
![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)
![Node](https://img.shields.io/badge/node-20--alpine-339933?logo=node.js&logoColor=white)
![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-6366f1)

A multi-agent decision panel powered by OpenRouter. Analyze complex decisions through parallel AI perspectives.

---

## What is Quorum?

When facing an important decision, you'd normally ask different people for advice — a skeptic, an optimist, a domain expert, a lawyer. Quorum does the same thing with AI.

You describe your decision. Quorum sends it in parallel to 6 specialized agents, each with a declared bias and a distinct perspective. They respond independently, then a Judge synthesizes everything into a final verdict: **GO / NO-GO / CONDITIONAL**.

---

## How it works

### The agents

| Agent | Bias | Role |
|---|---|---|
| Devil's Advocate | skeptic | Dismantles every assumption |
| Risk Assessor | investigative | Surfaces failure modes and tail risks |
| Domain Expert | investigative | Evaluates technical and operational feasibility |
| Optimist | advocate | Finds undervalued upside and opportunities |
| Strategist | advocate | Evaluates long-term strategic alignment |
| Ethicist | skeptic | Flags compliance, ethical and reputational risks |

Select 3 to 5 agents before running.

### The pipeline

| Phase | What happens |
|---|---|
| 1 — Agent analysis | All selected agents analyze the decision in parallel |
| 2 — Cross-critique | A Judge moderates: finds consensus, disagreements, blind spots |
| 3 — Synthesis | Final verdict with confidence %, top risks, next step |
| 4 — Pre-mortem | Each agent imagines the decision failed in 12 months — what caused it? |

### Judge modes

- **Analyst** — balanced synthesis, weighs all inputs equally
- **Sentinel** — risk-first, defaults to NO-GO under uncertainty

---

## Stack

| Component | Choice |
|---|---|
| Frontend | Single-file HTML/CSS/JS |
| Backend | Node.js + Express (OpenRouter proxy) |
| LLM provider | OpenRouter (any model, selectable from UI) |
| Container | Docker + docker-compose |
| Default port | 3003 |

---

## Setup

See [SETUP.md](./SETUP.md) for full installation instructions.

Quick start:

```bash
git clone https://github.com/cerocca/quorum ~/quorum
cd ~/quorum
cp .env.example .env
# add your OpenRouter key to .env
docker compose up -d --build
```

Open `http://localhost:3003` (or `http://<your-server>:3003` on LAN).

---

## Roadmap

### v0.5 — planned
- ITA/ENG language selector
- Company profile: persistent context injected into every call

### Backlog
- Custom agent: user-defined name, bias and system prompt
- Side-by-side comparison of two decisions
- Devil's Panel mode: all agents with skeptic bias
- Telegram webhook notification on completion
- Server-side persistence with SQLite
