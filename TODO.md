# TODO.md — Quorum Decision Panel

Legenda: `[ ]` aperto · `[x]` completato · `[~]` in corso · `[-]` scartato

---

## v0.5 — Lingua, preferiti, agente custom

- [ ] Agente custom: form in Settings > Agents — nome, bias, colore, system prompt. Appare come settima card selezionabile.
- [ ] Agente custom: modello opzionale per-agente — override del modello globale per singolo agente (mix di modelli nella stessa run)
- [ ] Bias per agente selezionabile dall'utente (toggle skeptic/advocate/investigative su ogni card) — valutare se aggiunge valore o confusione- [ ] Quick mode agent swap: deseleziona uno e selezionane un altro senza passare a Full → PRIMA CAPIRE COSA FA


---

## Backlog / idee non schedulate

- [ ] Confronto tra due decisioni in parallelo
- [ ] Modalità "Devil's Panel" — tutti gli agenti con bias skeptic
- [ ] Integrazione webhook (es. notifica Telegram al termine)
- [ ] Supporto multi-utente (autenticazione base, fuori scope LAN-only per ora)
- [ ] Company profile: persistent context per user — requires authentication first
- [ ] Solo mode: interroga un singolo agente, output semplificato senza verdetto — valutare impatto sull'identità del tool

---

## Scartati

- [-] Gating automatico agenti (tier deciso manualmente dall'utente)
- [-] Team lead gerarchici (troppo overkill)
- [-] Export PPTX/DOCX (non prioritario)
- [-] Supporto provider LLM multipli (solo OpenRouter)
