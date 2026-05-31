# CLAUDE.md — Quorum

## What is Quorum
Multi-agent web app for evaluating complex decisions.
Pipeline: agent analysis → cross-critique → synthesis → pre-mortem.
LLM provider: OpenRouter (only — no direct Anthropic support).
Deploy target: self-hosted server, Docker, typically LAN-only.

---

## Workflow roles

### claude.ai (prompt engineer)
- Architecture and design decisions
- Writing precise prompts for Claude Code
- Updating project .md files
- Reviewing results and iterating

### Claude Code (executor)
- Writing and editing files in the repo
- Git management (commit, branch, push)
- Docker build and container management
- Local testing on the server

**Rule**: Claude Code does not decide architecture. It executes precise instructions from claude.ai. If an instruction is ambiguous, it asks before proceeding.

---

## Repo structure

```
quorum/
├── CLAUDE.md          ← this file
├── CHANGELOG.md       ← version history
├── SETUP.md           ← installation and configuration
├── TODO.md            ← open tasks and backlog
├── README.md          ← public-facing project description
├── LICENSE            ← MIT
├── .env               ← secrets (never commit)
├── .env.example       ← public template
├── .gitignore
├── server.js          ← Express proxy: /api/* → OpenRouter + auth + SQLite
├── Dockerfile
├── docker-compose.yml
├── package.json
├── data/              ← SQLite volume (gitignored)
│   ├── quorum.db      ← main database
│   └── sessions       ← session store
└── public/
    ├── index.html     ← main single-file frontend
    └── login.html     ← login page
```

---

## Tech stack

| Component | Choice |
|---|---|
| Frontend | Single-file HTML/CSS/JS in public/ |
| Backend | Node.js + Express |
| Auth | express-session + connect-sqlite3 + bcrypt |
| Database | SQLite via better-sqlite3 at /app/data/quorum.db |
| LLM provider | OpenRouter (single provider) |
| Container | Docker + docker-compose |
| Port | 3003 |
| Restart policy | unless-stopped |
| Fonts | Google Fonts (Syne + IBM Plex Mono) |

---

## Claude Code operating rules

1. **Touch only necessary files** — no unrequested refactoring
2. **Minimal, safe changes** — backward compatibility always
3. **Show diff or full file** before applying changes to existing files
4. **Never commit .env** — only .env.example
5. **Flag risks** before destructive actions (rm, override, etc.)
6. **Ubuntu Server + Docker ready commands** — no abstractions
7. **Real paths** — use ~/quorum/, /app/data/, etc.
8. **Repo language: English** — all repo files (CHANGELOG, TODO, CLAUDE.md, SETUP.md, README.md, commit messages) must be in English. Conversations with claude.ai may be in Italian.

---

## Session close process (pre-commit)

Session close means: manual tests passed, everything working.
Only then Claude Code should:

1. Update CHANGELOG.md with session changes
2. Update TODO.md — mark completed, add newly emerged tasks
3. Update SETUP.md if setup/config instructions changed
4. Update CLAUDE.md if architecture or conventions changed
5. **Stop here.** The final commit (git add, git commit, git push) is always run by the user from the terminal.

**Commit message format**: v{X.Y.Z} — short description in English
Example: v0.4.8 — auth, profiles, login page, local fonts, admin password reset

---

## Environment variables

OR_KEY=sk-or-...               # OpenRouter API key
SESSION_SECRET=...             # Session signing secret
ADMIN_USER=admin               # Initial admin username (seed, one-shot)
ADMIN_PASS=changeme            # Initial admin password (seed, one-shot)
DEFAULT_MODEL=                 # Server-side model fallback
PORT=3003

---

## Useful commands

```bash
cd ~/quorum
docker compose up -d --build   # build and start
docker compose logs -f         # follow logs
docker compose down            # stop
ss -tlnp | grep 3003           # verify port
```

---

## Current version

v0.5.1 — Profile export/import, dynamic version
See CHANGELOG.md for full history.
