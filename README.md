# FPH Exam – Simulatore Esame Farmacista Specialista

App web mobile-first per eseguire simulazioni dell'esame **FPH Farmacia Officinale** (Farmacista Specialista Svizzero).

---

## Riepilogo progetto

### Cosa è stato fatto
1. **Analisi dell'esame reale** — letto il PDF d'esempio (`completo_FPH Fragen April 2023-1.pdf`) per capire formato e difficoltà delle domande originali
2. **Generazione domande con AI** — usato Google NotebookLM (Gemini) per generare 101 domande in italiano, basate sui notebook di studio di Marialucia
3. **File JSON validato** — `esame_fph_100_domande.json` (101 domande, 101 KB)
4. **App web** — simulatore React/Vite con quiz interattivo, statistiche, revisione risposte
5. **Script di automazione** — `genera_esame.py` + `config_esame.json` per rigenerare l'esame in ~10 minuti con un solo comando

### Struttura file chiave

```
fph-exam/
├── esame_fph_100_domande.json   ← 101 domande pronte per l'app
├── config_esame.json            ← mappa ruoli → notebook → argomenti
├── genera_esame.py              ← script per rigenerare le domande
├── genera_simulazione.py        ← script per caricare JSON nell'app
├── roles/                       ← domande divise per ruolo
│   ├── ruolo1.json              (7 dom – Validazione ricette)
│   ├── ruolo2.json              (3 dom – Fitoterapia)
│   ├── ruolo3.json              (3 dom – Medicina complementare)
│   ├── ruolo4a.json             (10 dom – Farmacia clinica: respiratorio)
│   ├── ruolo4b.json             (10 dom – Farmacia clinica: dolore/neurologia)
│   ├── ruolo4c.json             (10 dom – Farmacia clinica: cardiovascolare)
│   ├── ruolo4d.json             (10 dom – Farmacia clinica: dermatologia/ginecologia)
│   ├── ruolo4e.json             (10 dom – Farmacia clinica: gastroenterologia)
│   ├── ruolo5.json              (10 dom – Anamnesi e terapia)
│   ├── ruolo6.json              (7 dom  – Preparazione medicinali)
│   ├── ruolo7.json              (7 dom  – Risultati di laboratorio)
│   ├── ruolo8.json              (7 dom  – Situazioni d'emergenza)
│   └── ruolo9.json              (7 dom  – Vaccinazioni e prelievi)
└── src/                         ← app React
```

---

## Come rigenerare le domande

**Comando completo (tutto in automatico, ~10 min):**
```bash
cd "/Users/gianmichele/Desktop/esame marialucia"
source venv/bin/activate
python3 fph-exam/genera_esame.py
```

**Rigenerare solo un batch:**
```bash
python3 fph-exam/genera_esame.py --ruolo ruolo4c
```

**Assemblare senza rigenerare (unisce i file esistenti in `roles/`):**
```bash
python3 fph-exam/genera_esame.py --solo-assembla
```

**Usare un config diverso (per un esame su altri argomenti):**
```bash
python3 fph-exam/genera_esame.py --config fph-exam/config_esame_v2.json
```

> Le domande sono generate da **Google NotebookLM (Gemini)** basandosi sui documenti caricati nei notebook di Marialucia — non da conoscenza generica.

---

## Come aggiornare l'app con nuove domande

1. Genera il nuovo JSON con `genera_esame.py`
2. Sostituisci `esame_fph_100_domande.json` con il file generato
3. Lancia lo script di simulazione:
   ```bash
   python3 genera_simulazione.py
   ```
4. Pubblica su Netlify:
   ```bash
   git add src/data/tests/ && git commit -m "nuova simulazione" && git push
   ```
   Netlify rideploya automaticamente.

---

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
| | **Totale** | **101** |

**Soglia superamento: 67/101 (≈ 67%) — Tempo: 3h 30min**

> Nota: la distribuzione originale somma a 101, non 100. Il file JSON riflette questo.

---

## Tipi di domanda supportati

| Tipo | Descrizione | Formato risposta |
|------|-------------|-----------------|
| `multipla_scelta` | 4 opzioni (A/B/C/D), 1 corretta | `"B"` |
| `kprim` | 4 affermazioni (1/2/3/4), ognuna Vero/Falso | `"VFFV"` |

---

## Formato JSON sorgente

```json
{
  "domande": [
    {
      "numero": 1,
      "ruolo": 4,
      "tema": "Farmacia Clinica - Cardiovascolare",
      "tipo": "multipla_scelta",
      "domanda": "Testo della domanda...",
      "opzioni": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "risposta_corretta": "B",
      "motivazione": "Spiegazione dettagliata..."
    },
    {
      "numero": 2,
      "ruolo": 1,
      "tema": "Validazione ricette",
      "tipo": "kprim",
      "domanda": "Valuta le seguenti affermazioni:",
      "opzioni": { "1": "...", "2": "...", "3": "...", "4": "..." },
      "risposta_corretta": "VFFV",
      "motivazione": "Spiegazione dettagliata..."
    }
  ]
}
```

---

## Stack tecnico

- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Dati:** localStorage (nessun DB, nessun backend)
- **Generazione domande:** Google NotebookLM (Gemini) via CLI `notebooklm`
- **Deploy:** Netlify (auto-deploy su push a main)

## Sviluppo locale

```bash
npm install
npm run dev
```
