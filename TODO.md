# TODO.md — Quorum Decision Panel

Legenda: `[ ]` aperto · `[x]` completato · `[~]` in corso · `[-]` scartato

---

## v1 — Frontend standalone

- [ ] Creare repo `~/quorum/` su Sibilla e inizializzare git
- [ ] Creare struttura cartelle (`public/`, file di progetto)
- [ ] Scrivere `index.html` nel repo (basato sul prototipo concordato)
- [ ] Scrivere `.gitignore`, `.env.example`
- [ ] Test manuale pipeline completa (3 fasi, tutti gli agenti)
- [ ] Test model selector (caricamento lista, selezione, fallback)
- [ ] Scrivere `SETUP.md` e `CHANGELOG.md` (entry v1)
- [ ] Primo commit: `v1 — frontend standalone funzionante`

---

## v2 — Bias agenti + Judge modes + Pre-mortem + Stack Docker

### Chiusura sessione
- [ ] Commit: `v2 — bias agenti, judge modes, pre-mortem, stack Docker`

---

## v3 — Engagement tier + Company profile + Storico

- [ ] **Engagement tier**: toggle Quick (3 agenti, no cross-critique) vs Full (5 agenti, tutte le fasi)
- [ ] **Company profile**: campo testo persistente (localStorage) iniettato come contesto in ogni chiamata
- [ ] Export singola sessione in testo/markdown (TBD)
- [ ] Selettore lingua ITA/ENG — traduzione UI e prompt degli agenti
- [ ] Storico sessioni: salvataggio locale (localStorage) di decisioni precedenti con risposta completa
- [ ] Visualizzazione storico nella UI (lista compatta, click per riaprire)
- [ ] Funzione cancella: singola voce o svuota tutto

---

## Backlog / idee non schedulate

- [ ] Agente custom: nome, bias e system prompt definibili dall'utente
- [ ] Confronto tra due decisioni in parallelo
- [ ] Modalità "Devil's Panel" — tutti gli agenti con bias skeptic
- [ ] Integrazione webhook (es. notifica Telegram al termine)
- [ ] Persistenza server-side con SQLite (alternativa a localStorage)
- [ ] Supporto multi-utente (autenticazione base, fuori scope LAN-only per ora)
- [ ] Bias per agente selezionabile dall'utente (toggle skeptic/advocate/investigative su ogni card) — valutare se aggiunge valore o confusione

---

## Scartati

- [-] Gating automatico agenti (tier deciso manualmente dall'utente)
- [-] Team lead gerarchici (troppo overkill)
- [-] Export PPTX/DOCX (non prioritario)
- [-] Supporto provider LLM multipli (solo OpenRouter)
