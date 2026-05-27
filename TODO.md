# TODO.md — Quorum Decision Panel

Legenda: `[ ]` aperto · `[x]` completato · `[~]` in corso · `[-]` scartato

---

## v3 — Engagement tier + Storico

- [ ] **Engagement tier**: toggle Quick (3 agenti, no cross-critique) vs Full (5 agenti, tutte le fasi)
- [ ] Export singola sessione in testo/markdown (TBD)
- [ ] Selettore lingua ITA/ENG — traduzione UI e prompt degli agenti
- [ ] Storico sessioni: salvataggio locale (localStorage) di decisioni precedenti con risposta completa
- [ ] Visualizzazione storico nella UI (lista compatta, click per riaprire)
- [ ] Funzione cancella: singola voce o svuota tutto

---

## Backlog / idee non schedulate

- [ ] Agente custom: nome, bias e system prompt definibili dall'utente
- [ ] Colore tag agente: configurabile per agente, gestito insieme all'agente custom
- [ ] Confronto tra due decisioni in parallelo
- [ ] Modalità "Devil's Panel" — tutti gli agenti con bias skeptic
- [ ] Integrazione webhook (es. notifica Telegram al termine)
- [ ] Persistenza server-side con SQLite — con import una-tantum da localStorage
- [ ] Supporto multi-utente (autenticazione base, fuori scope LAN-only per ora)
- [ ] Bias per agente selezionabile dall'utente (toggle skeptic/advocate/investigative su ogni card) — valutare se aggiunge valore o confusione
- [ ] Company profile: persistent context per user — requires authentication first
- [ ] Quick mode agent swap: deseleziona uno → selezionane un altro senza passare a Full
- [ ] Solo mode: interroga un singolo agente, output semplificato senza verdetto — valutare impatto sull'identità del tool

---

## Scartati

- [-] Gating automatico agenti (tier deciso manualmente dall'utente)
- [-] Team lead gerarchici (troppo overkill)
- [-] Export PPTX/DOCX (non prioritario)
- [-] Supporto provider LLM multipli (solo OpenRouter)
