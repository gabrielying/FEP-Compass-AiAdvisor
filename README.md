# FEP Compass — A Malaysia's Foreign Exchange Policy Ai Advisor (v2.0)

A modern, minimalist, education-first web app for **banking officers** (and companies needing AI FEP tooling) covering **Bank Negara Malaysia's Foreign Exchange Policy (FEP) Notices 1–7** (effective 1 October 2025).

100% client-side — plain HTML + CSS + vanilla JavaScript. No build step, no backend. Open `index.html` and it runs.

> **Disclaimer:** Educational guidance only — not legal advice. Always verify complex cases at the official source: <https://www.bnm.gov.my/fep/policies/notices>

---

## App structure

```
┌──────────────────────────────────────────────────────────────┐
│  Desktop: left sidebar nav   ·   Mobile: bottom tab bar      │
├──────────────┬───────────────────────────────────────────────┤
│ 1 Dashboard  │ Limit utilisation rings · pending declarations│
│              │ quick actions · notices at a glance           │
│ 2 FEP Notices│ Educational hub: N1–N7 cards → accordion      │
│   (hub)      │ provisions, "Am I Affected?" wizards,         │
│              │ full-notice links, searchable, glossary       │
│ 3 Smart Tools│ a) Document & Image Reader (OCR, Tesseract.js)│
│   (engine)   │ b) PDF Reader & Validator (pdf.js)            │
│              │ c) AI Compliance Analyst (structured form +   │
│              │    BM25 RAG + Gemini/Ollama verdict)          │
│ 4 AI Advisor │ Free-form chat, notice-scoped retrieval,      │
│              │ structured verdict cards with BNM citations   │
│ 5 Settings   │ Provider config (Gemini cloud / Ollama local),│
│              │ data management, about                        │
└──────────────┴───────────────────────────────────────────────┘
```

## Screen-by-screen walkthrough (wireframe text)

### 1 · Dashboard
- **Header** — time-aware greeting + one-line mission statement.
- **FEP Limit Utilisation** — three SVG progress rings: Individual FCY investment (RM1M/yr, Notice 3), Individual FCY borrowing (RM10M, Notice 2), Entity FCY investment (RM50M/yr group basis, Notice 3). Rings turn amber at 70%, red at 90%. Click a ring → inline editor to update the utilised amount (persisted to `localStorage`).
- **Pending Declarations** — checklist (e.g. "export proceeds 6-month window"); add / complete / remove.
- **Quick Actions** — 4 deep links: Ask the Advisor, Scan a Document, Compliance Check, Browse Notices.
- **Notices at a Glance** — 7 mini-tiles, each opening the notice detail sheet.

### 2 · FEP Notices (Educational Hub)
- **Global provision search** — substring + BM25 fallback across all 60+ provisions, highlighted matches, click-through to the exact provision.
- **Notice cards (N1–N7)** — number badge, plain-English description, provision count, and three actions:
  - **Explore** → bottom sheet (mobile) / centered modal (desktop) with accordion provisions; regulatory jargon (Resident, NRFI, DRB…) is auto-linked to tap-for-definition tooltips.
  - **Am I Affected?** → 2–3 question yes/no decision tree per notice ending in a colour-coded result (green = fine / amber = limits engaged / blue = check details) with a one-tap handoff to the AI Advisor.
  - **Full Notice** → official BNM notices page (source PDFs).
- **Glossary** — 18 key FEP terms as tappable chips.

### 3 · Smart Tools (the engine)
- **Document & Image Reader** — drag-drop or camera upload → on-device OCR (Tesseract.js, lazy-loaded from CDN) with live progress → extracted text with **currencies/amounts highlighted**, entity chips, and "potential FEP touchpoint" chips that map detected keywords to Notices 1–7.
- **PDF Reader & Validator** — drag-drop a PDF → text extraction (pdf.js, first 10 pages) → same entity detection, plus **validator flags** ("this document references export proceeds, 6 months — review against Notice 7").
- **AI Compliance Analyst** — structured intake designed for precise RAG retrieval:
  `WHO` (party type) · `WHAT` (transaction type) · `WHERE` (countries) · `WHY` (purpose, 160 chars) · `AMOUNT` (+ currency) · optional context (400 chars).
  Both readers can **Send to Analyst**, attaching a 900-char document extract as an evidence chip. Output: verdict card — `PERMITTED / NOT PERMITTED / CONDITIONAL / REQUIRES APPROVAL` — with explanation, conditions, warning, **exact BNM citation**, **suggested next step / filing** (e.g. registration or report via bnm.my/fep) and the retrieved provisions listed for audit. Without an AI key it degrades gracefully to a pure reference lookup.

### 4 · AI Advisor
Free-form chat with notice-scope pills (All / N1–N7), sample prompts, Enter-to-send, structured verdict cards, and a session history sheet (last 30 conversations, restorable).

### Interactive flow: readers → analyst
```
Upload image/PDF ─→ OCR / text extraction ─→ entity & keyword detection
      │                                            │
      └── "Send to AI Analyst" ────────────────────┘
                     │
        evidence chip + structured WHO/WHAT/WHERE/WHY/AMOUNT form
                     │
        BM25 retrieval over Notices 1–7 (top 6 provisions)
                     │
        Gemini / Ollama → JSON verdict → card + citation + next step
```

## AI setup (optional — reference features work without it)

| Provider | Steps |
|---|---|
| **Gemini** (cloud, free tier) | Get a key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) → Settings → Gemini → paste → Save |
| **Ollama** (local, offline) | `ollama pull qwen2.5:7b` → Settings → Ollama → Save |

Keys are stored only in the browser's `localStorage`. Retrieval (BM25), OCR and PDF parsing all run client-side.

## Run locally

```
git clone <this repo>
cd bnm-fep-advisor
# open index.html directly, or serve it:
python -m http.server 8000   # → http://localhost:8000
```

## Design system

- Deep navy (`#0a1f3d`) + emerald/teal (`#0d9488`) — secure yet modern; automatic dark mode.
- Plus Jakarta Sans type scale (11.5 → 30 px), JetBrains Mono for references and figures.
- Soft-shadow cards, 13–18 px radii, hover lift animations, reduced-motion support.
- Breakpoints: ≤860 px bottom-tab mobile layout · >860 px sidebar desktop layout.
