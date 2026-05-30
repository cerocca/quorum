# Quorum

![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)
![Node](https://img.shields.io/badge/node-20--alpine-339933?logo=node.js&logoColor=white)
![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-6366f1)
![SQLite](https://img.shields.io/badge/database-SQLite-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

A multi-agent decision panel powered by OpenRouter. Analyze complex decisions through parallel AI perspectives.

---

## What is Quorum?

When facing an important decision, you'd normally ask different people for advice — a skeptic, an optimist, a domain expert, a lawyer. Quorum does the same thing with AI.

You describe your decision. Quorum sends it in parallel to specialized agents, each with a declared bias and a distinct perspective. They respond independently, then a Judge synthesizes everything into a final verdict: **GO / NO-GO / CONDITIONAL**.

---

## How it works

### The agents

| Agent | Bias | Role |
|---|---|---|
| Devil's Advocate | contrarian | Dismantles every assumption |
| Risk Assessor | risk-first | Surfaces failure modes and tail risks |
| Domain Expert | feasibility | Evaluates technical and operational feasibility |
| Optimist | opportunity | Finds undervalued upside and opportunities |
| Strategist | horizon | Evaluates long-term strategic alignment |
| Ethicist | harm-aware | Flags compliance, ethical and reputational risks |

Select 3 to 5 agents before running. Each agent's bias is declared and hardcoded into its system prompt.

### The pipeline

| Phase | What happens |
|---|---|
| 1 — Agent analysis | Selected agents analyze the decision in parallel |
| 2 — Cross-critique | A Judge moderates: finds consensus, disagreements, blind spots |
| 3 — Synthesis | Final verdict with confidence %, top risks, next step |
| 4 — Pre-mortem | Each agent imagines the decision failed in 12 months |

Phases 2 and 4 are skipped in Quick tier (fast ruling, 2–3 agents).

### Judge modes

- **Analyst** — balanced synthesis, weighs all inputs equally
- **Sentinel** — risk-first, defaults to NO-GO under uncertainty

---

## Stack

| Component | Choice |
|---|---|
| Frontend | Single-file HTML/CSS/JS |
| Backend | Node.js + Express (OpenRouter proxy) |
| Database | SQLite (sessions, history, profiles) |
| Auth | Cookie-based sessions |
| LLM provider | OpenRouter (any model, selectable from UI) |
| Container | Docker + docker-compose |
| Default port | 3003 |

---

## Quick start

```bash
git clone https://github.com/your-org/quorum ~/quorum
cd ~/quorum
cp .env.example .env
# edit .env — add OR_KEY, set ADMIN_USER and ADMIN_PASS
docker compose up -d --build
```

Open `http://localhost:3003`. You will be redirected to the login page on first visit.

See [SETUP.md](./SETUP.md) for full installation and configuration details.

---

## License

MIT — see [LICENSE](./LICENSE).
