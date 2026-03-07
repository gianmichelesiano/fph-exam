# FPH Exam – Simulatore Esame Farmacista Specialista

App web mobile-first per eseguire simulazioni dell'esame **FPH Farmacia Officinale** (Farmacista Specialista Svizzero).

## Funzionalità

- Lista test con stato (non iniziato / in corso / completato + punteggio)
- Esecuzione quiz con navigazione avanti/indietro e dot-navigator
- Timer countdown configurabile per test
- Revisione risposte a fine test con motivazioni
- Pagina statistiche: media globale, performance per area, argomenti da ripassare
- Progressi salvati in localStorage (nessun backend)
- Ottimizzata per mobile

## Tipi di domanda supportati

| Tipo | Descrizione |
|------|-------------|
| `multipla_scelta` | 4 opzioni, 1 sola corretta (A/B/C/D) |
| `vero_falso` | 4 affermazioni, ognuna Vero o Falso |
| `kprim` | 4 affermazioni con risposta in formato `"VFFV"` |

## Struttura esame

| Ruolo | Area | Domande |
|-------|------|---------|
| 1 | Validazione ricette e piani terapeutici | 7 |
| 2 | Fitoterapia | 3 |
| 3 | Medicina complementare | 3 |
| 4 | Farmacia Clinica | 50 |
| 5 | Anamnesi e terapia | 10 |
| 6 | Preparazione di medicinali | 7 |
| 7 | Risultati di laboratorio | 7 |
| 8 | Situazioni d'emergenza | 7 |
| 9 | Vaccinazioni e prelievi | 7 |

**Soglia superamento: 67/100 (≈ 67%) — Tempo: 3h 30min**

## Stack tecnico

- React + Vite
- Tailwind CSS
- React Router
- localStorage (nessun DB, nessun backend)

## Aggiornare il test

1. Sostituire `esame_fph_100_domande.json` con il file aggiornato
2. Eseguire lo script:
   ```bash
   python3 genera_simulazione.py
   ```
3. Pubblicare:
   ```bash
   git add src/data/tests/ && git commit -m "nuova simulazione" && git push
   ```
   Netlify rideploya automaticamente.

## Formato JSON sorgente

```json
{
  "domande": [
    {
      "ruolo": 4,
      "tema": "Farmacia Clinica",
      "tipo": "multipla_scelta",
      "domanda": "Testo della domanda...",
      "opzioni": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "risposta_corretta": "B",
      "motivazione": "Spiegazione..."
    },
    {
      "ruolo": 1,
      "tema": "Validazione ricette",
      "tipo": "kprim",
      "domanda": "Valuta le seguenti affermazioni:",
      "opzioni": { "1": "...", "2": "...", "3": "...", "4": "..." },
      "risposta_corretta": "VFFV",
      "motivazione": "Spiegazione..."
    }
  ]
}
```

## Sviluppo locale

```bash
npm install
npm run dev
```
