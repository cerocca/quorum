# TODO.md — Quorum Decision Panel

Legenda: `[ ]` aperto · `[x]` completato · `[~]` in corso · `[-]` scartato

---

## v0.5 — Lingua, preferiti, agente custom

- [x] **Engagement tier**: Quick (2-3 agenti, fase 1+3) vs Full (3-5 agenti, tutte le fasi)
- [x] Export singola sessione in testo/markdown — done in v2.2
- [x] Storico sessioni: salvataggio locale (localStorage) di decisioni precedenti con risposta completa
- [x] Visualizzazione storico nella UI (lista compatta, click per riaprire)
- [x] Funzione cancella: singola voce o svuota tutto
- [x] Settings drawer scaffold (Preferences, Agents, Data) con placeholder "Coming soon"
- [ ] Selettore lingua ITA/ENG — traduzione UI e prompt degli agenti
- [ ] Model preferiti: stella sul dropdown, salvataggio localStorage, sezione preferiti in cima alla lista
- [ ] Agente custom: form in Settings > Agents — nome, bias, colore, system prompt. Appare come settima card selezionabile.
- [ ] Agente custom: modello opzionale per-agente — override del modello globale per singolo agente (mix di modelli nella stessa run)

---

## Backlog / idee non schedulate

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
