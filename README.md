# FEP Compass — Malaysia's Foreign Exchange Policy AI Advisor (v2.0)

A modern, minimalist, education-first web app for **banking officers** (and companies needing AI FEP tooling) covering **Malaysia's Foreign Exchange Policy (FEP) Notices 1–7** (effective 1 October 2025).

100% client-side — plain HTML + CSS + vanilla JavaScript. No build step, no backend. Open `index.html` and it runs.

> **Disclaimer:** Educational guidance only — not legal advice. Always verify complex cases with the FEP Authority — the official source link is in **Settings**.

---

## App structure

```
┌──────────────────────────────────────────────────────────────┐
│  Desktop: left sidebar nav   ·   Mobile: bottom tab bar      │
├──────────────┬───────────────────────────────────────────────┤
│ 1 FEP Notices│ Educational hub (default landing page):       │
│   (hub)      │ N1–N7 cards → Provisions/FAQs accordions,     │
│              │ "Am I Affected?" wizards, searchable, glossary │
│ 2 Dashboard  │ Limit utilisation rings · pending declarations│
│              │ quick actions · notices at a glance ·         │
│              │ recent activity / audit log                   │
│ 3 Smart Tools│ a) Document & Image Reader (OCR, Tesseract.js)│
│   (engine)   │ b) PDF Reader & Validator (pdf.js)            │
│              │ c) AI Compliance Analyst (structured form +   │
│              │    BM25 RAG + Gemini/Ollama verdict)          │
│ 4 AI Advisor │ Free-form chat, notice-scoped retrieval,      │
│              │ structured verdict cards with FEP citations   │
│ 5 Settings   │ Provider config (Gemini cloud / Ollama local),│
│              │ official source link, data management, about │
└──────────────┴───────────────────────────────────────────────┘
```

## Screen-by-screen walkthrough (wireframe text)

### 1 · FEP Notices (Educational Hub) — default landing page
- **Onboarding checklist** — first-run only, a dismissible card with 3 quick-start steps: explore a notice, try "Am I Affected?", and connect an AI provider (with a note that Gemini's free tier has a daily request limit, and Ollama is unlimited/offline).
- **Global provision search** — substring + BM25 fallback across all provisions and FAQs, highlighted matches, click-through to the exact provision or FAQ.
- **Notice cards (N1–N7)** — number badge, plain-English description, provision (and FAQ, where available) counts, and two actions:
  - **Explore** → bottom sheet (mobile) / centered modal (desktop). Notices with official FAQs (N1, N2, N3, N4, N7) show a **Provisions / FAQs tab switcher**, each an accordion; regulatory jargon (Resident, NRFI, DRB…) is auto-linked to tap-for-definition tooltips throughout.
  - **Am I Affected?** → 2–3 question yes/no decision tree per notice ending in a colour-coded result (green = fine / amber = limits engaged / blue = check details) with a one-tap handoff to the AI Advisor.
- **Glossary** — 56 key FEP terms (from the FEP Notices and the official Preamble & Interpretation definitions) as tappable chips.
- The official source (FEP Authority notices page) is linked once, in **Settings** — not repeated on every notice.

### 2 · Dashboard
- **Header** — time-aware greeting + one-line mission statement.
- **Profile** (set in Settings) — Individual / Entity / Both. Filters which limit rings appear here, since individuals and entities are subject to different FEP limits.
- **FEP Limit Utilisation** — up to three SVG progress rings, filtered by Profile: Individual FCY investment (RM1M/yr, Notice 3), Individual FCY borrowing (RM10M, Notice 2), Entity FCY investment (RM50M/yr group basis, Notice 3). Rings turn amber at 70%, red at 90%. Click a ring → inline editor to update the utilised amount (persisted to `localStorage`).
- **Pending Declarations** — checklist (e.g. "export proceeds 6-month window"); add / complete / remove.
- **Quick Actions** — 4 deep links: Ask the Advisor, Scan a Document, Compliance Check, Browse Notices.
- **Notices at a Glance** — 7 mini-tiles, each opening the notice detail sheet.
- **Recent Activity** — local audit trail (last 50 events) of advisor queries, compliance checks, document scans, notice lookups and limit/declaration changes, with timestamps. Searchable, filterable by type (once 2+ types are logged), **exportable as CSV**, and a "Clear" action. Stored only in `localStorage` on this device.

### 3 · Smart Tools (the engine)
- **Document & Image Reader** — drag-drop or camera upload → on-device OCR (Tesseract.js, lazy-loaded from CDN) with live progress → extracted text with **currencies/amounts highlighted**, entity chips, and "potential FEP touchpoint" chips that map detected keywords to Notices 1–7.
- **PDF Reader & Validator** — drag-drop a PDF → text extraction (pdf.js, first 10 pages) → same entity detection, plus **validator flags** ("this document references export proceeds, 6 months — review against Notice 7").
- **AI Compliance Analyst** — structured intake designed for precise RAG retrieval:
  `WHO` (party type) · `WHAT` (transaction type) · `WHERE` (countries) · `WHY` (purpose, 160 chars) · `AMOUNT` (+ currency) · optional context (1000 chars).
  Both readers can **Send to Analyst**, attaching a 900-char document extract as an evidence chip. Output: verdict card — `PERMITTED / NOT PERMITTED / CONDITIONAL / REQUIRES APPROVAL` — with explanation, conditions, warning, **exact FEP Notice citation**, **suggested next step / filing** (e.g. registration or report to the FEP Authority), the retrieved provisions listed for audit, and a **"Save as PDF"** button (print stylesheet) for compliance files. Without an AI key, or if the AI provider is unreachable, it degrades gracefully to a reference-only lookup of the most relevant provisions.

### 4 · AI Advisor
Free-form chat with notice-scope pills (All / N1–N7), sample prompts, Enter-to-send, structured verdict cards (each with **"Save as PDF"**), and a session history sheet (last 30 conversations, restorable). If the configured AI provider is unreachable, the Advisor falls back to showing the top BM25-retrieved provisions as a reference-only answer instead of just erroring.

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
cd FEP-Compass-AiAdvisor
# open index.html directly, or serve it:
python -m http.server 8000   # → http://localhost:8000
```

## Testing the AI Advisor's citations

The AI Compliance Analyst's value depends on it citing a **real, correctly-applicable**
FEP provision — not a plausible-sounding hallucination. `test/` has a 31-scenario
battery across all 7 Notices (ground-truthed directly against the provision text
in `kb.js`), in two forms:

- **Automated** (`npm run stress-test`) — calls a local Ollama model exactly the
  way the app does (same `retrieve()` + `buildSystemPrompt()` + request shape +
  `parseResp`/`repairJSON`), then checks the verdict, that the citation names the
  right Notice, and that the cited paragraph/FAQ number actually exists in that
  Notice (catching hallucinated references). Requires `ollama serve` and a pulled
  model (`ollama pull qwen2.5:7b`).
  ```
  npm run stress-test                       # all 31 scenarios, qwen2.5:7b
  node test/run-stress-test.js --notice 3   # just Notice 3
  node test/run-stress-test.js --model llama3.1 --verbose
  ```
  Writes a full report to `test/last-run-report.json`.
- **Manual** (`test/SCENARIOS.md`) — the same scenarios as a checklist for running
  through the live UI by hand (Smart Tools → AI Compliance Analyst), useful for
  testing Gemini or spot-checking a model the harness doesn't support.

## Design system

- Deep navy (`#0a1f3d`) + emerald/teal (`#0d9488`) — secure yet modern; automatic dark mode.
- Plus Jakarta Sans type scale (11.5 → 30 px), JetBrains Mono for references and figures.
- Soft-shadow cards, 13–18 px radii, hover lift animations, reduced-motion support.
- Breakpoints: ≤860 px bottom-tab mobile layout · >860 px sidebar desktop layout.
