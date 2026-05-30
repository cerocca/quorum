# CLAUDE.md — Quorum Decision Panel

## Cos'è Quorum
Webapp multi-agent per la valutazione di decisioni complesse.
Pipeline: agent analysis → cross-critique → synthesis → pre-mortem.
Provider LLM: OpenRouter (unico, nessun supporto Anthropic diretto).
Deploy target: Sibilla (Ubuntu Server, Docker, LAN-only).

---

## Ruoli nel workflow

### claude.ai (prompt engineer)
- Architettura e decisioni di design
- Scrittura di prompt precisi e completi per Claude Code
- Aggiornamento dei file `.md` di progetto
- Review dei risultati e iterazione

### Claude Code (Sibilla — esecutore)
- Scrittura e modifica di file reali nel repo
- Gestione git (commit, branch, push)
- Build e gestione container Docker
- Test locali su Sibilla

**Regola**: Claude Code non decide l'architettura. Esegue istruzioni precise ricevute da claude.ai. Se un'istruzione è ambigua, chiede prima di procedere.

---

## Struttura del repo

```
quorum/
├── CLAUDE.md          ← questo file
├── CHANGELOG.md       ← storia delle versioni
├── SETUP.md           ← istruzioni di installazione e configurazione
├── TODO.md            ← task aperti e backlog
├── .env               ← OR_KEY, DEFAULT_MODEL (non committare)
├── .env.example       ← template pubblico
├── .gitignore
├── server.js          ← proxy Express: /api/chat, /api/models → OpenRouter
├── Dockerfile
├── docker-compose.yml
├── data/              ← volume SQLite (non committare quorum.db)
│   └── quorum.db      ← generato a runtime, in .gitignore
└── public/
    ├── index.html     ← frontend single-file
    ├── login.html     ← login page
    └── fonts/         ← local font files (not committed — downloaded at deploy time)
```

---

## Stack tecnico

| Componente | Scelta |
|---|---|
| Frontend | Single-file HTML/CSS/JS in `public/` |
| Backend | Node.js + Express (proxy OpenRouter) |
| LLM provider | OpenRouter (unico) |
| Database | SQLite via better-sqlite3, file `/app/data/quorum.db` |
| Container | Docker + docker-compose |
| Porta | 3003 (verificare conflitti su Sibilla) |
| Restart policy | `unless-stopped` |
| Config | `.env` con `OR_KEY` e `DEFAULT_MODEL` |

---

## Regole operative per Claude Code

1. **Tocca solo i file necessari** — niente refactor non richiesti
2. **Modifiche minime e sicure** — backward compatibility sempre
3. **Mostra diff o file completo** prima di applicare modifiche a file esistenti
4. **Non committare `.env`** — solo `.env.example`
5. **Evidenzia rischi** prima di azioni distruttive (rm, override, ecc.)
6. **Comandi pronti per Ubuntu Server + Docker** — niente astrazioni
7. **Percorsi reali** — usa `~/quorum/`, `/etc/nginx/`, ecc.
8. **Lingua repo: inglese** — tutti i file del repo (CHANGELOG.md, TODO.md, CLAUDE.md, SETUP.md, README.md, commit message) devono essere in inglese. Le conversazioni con claude.ai possono restare in italiano.

---

## Processo di chiusura sessione (pre-commit)

Per chiusura sessione si intende: **test manuali passati, tutto funzionante**.
Solo a quel punto Claude Code deve:

1. Aggiornare `CHANGELOG.md` con le modifiche della sessione
2. Aggiornare `TODO.md` — segnare completati, aggiungere nuovi emersi
3. Aggiornare `SETUP.md` se sono cambiate istruzioni di setup/config
4. Aggiornare `CLAUDE.md` se sono cambiate architettura o convenzioni
5. **Fermarsi qui.** Il commit finale (`git add`, `git commit`, `git push`) lo esegue sempre l'utente da terminale.

**Commit message format**: `v{X.Y.Z} — descrizione breve in italiano`
Esempio: `v0.4.5 — migrazione SQLite per history e favourites`

---

## Variabili d'ambiente

```env
OR_KEY=sk-or-...          # API key OpenRouter
DEFAULT_MODEL=google/gemini-2.5-flash-preview-05-20
PORT=3003
SESSION_SECRET=change-me-in-production
ADMIN_USER=admin
ADMIN_PASS=changeme
```

`DEFAULT_MODEL` è il fallback lato server se il client non specifica un modello.
Il modello è selezionabile dalla UI — la selezione ha sempre precedenza.

---

## Comandi utili

```bash
# Build e avvio
cd ~/quorum
docker compose up -d --build

# Log
docker compose logs -f

# Stop
docker compose down

# Verifica porta
ss -tlnp | grep 3003
```

---

## Versioni

Vedi `CHANGELOG.md` per la storia completa.
Versione corrente: **v0.4.8** — Auth + Profiles.

---

## Note Sibilla

- Hardware: Intel Core i3-6100T, 8GB RAM, 256GB SSD, no GPU
- Docker installato, altri container attivi — verificare conflitti di porta
- LAN-only: nessuna esposizione esterna necessaria
- OpenRouter: outbound port 443 sufficiente