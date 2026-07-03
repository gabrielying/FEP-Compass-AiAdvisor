# FEP Compass — No-AI edition (testing fork)

A fork of [FEP Compass](https://github.com/gabrielying/FEP-Compass-AiAdvisor) that removes **all AI involvement**. Verdicts come from a deterministic, hand-authored rules engine; lookups use local BM25 search. There are no API keys, no cloud calls, no local model — the app is 100% client-side vanilla HTML/CSS/JS and works fully offline.

> **Disclaimer (unchanged from the original):** educational guidance only, not legal advice — verify complex cases with the FEP Authority.

## What replaced the AI

| Feature | AI edition | This edition |
|---|---|---|
| Compliance Analyst | Gemini / Ollama verdict over RAG chunks | **Deterministic rules engine** (`rules.js`): structured form inputs + follow-up yes/no questions → verdict + real citation |
| AI Advisor chat | LLM chat with JSON verdicts | **Reference Search**: local BM25 over every provision/FAQ in Notices 1–7 |
| Citation grounding | Post-hoc check on model output | Rules cite only refs that exist in `kb.js`; the test harness fails the build if any citation doesn't resolve |
| Settings → AI Provider | Gemini key / Ollama URL | Removed — nothing to configure |

Everything else — Notices browser, glossary, Quick-Check wizards, dashboard, activity log, PWA offline support — is unchanged.

## How the rules engine works

1. The Analyst form collects **structured inputs**: who (7 party types), what (9 transaction types), from/to country, currency, amount.
2. `evaluateRules()` in `rules.js` walks a hand-authored decision tree for that (who, what) combination, asking follow-up yes/no questions one at a time (DRB status, counterparty licensing, funding source, timing…), exactly like the Quick-Check wizards.
3. Amount thresholds (RM1M / RM2M-joint / RM10M / RM50M / RM100M / RM1k / RM10k / RM30k / RM250M) are compared arithmetically, using a static indicative rate table for non-MYR amounts. An amount exactly at a cap counts as within it.
4. The result is one of `PERMITTED / NOT_PERMITTED / CONDITIONAL / REQUIRES_APPROVAL` with an explanation, conditions, and a citation **copied verbatim from a real provision in `kb.js`** — or an honest "no deterministic rule covers this combination", falling back to a reference lookup.

Same inputs + same answers ⇒ same verdict, every time.

## Running

Open `index.html` in a browser, or serve it:

```
python -m http.server 8000
```

No install, no configuration.

## Testing

```
npm test        # node >= 18, fully offline — no Ollama, no network
```

`test/run-rules-test.js` runs two gates:

1. **Citation audit** — every citation string the engine can emit must resolve to a real provision in `kb.js` via the same `verifyCitation()` the app uses at runtime.
2. **Scenario battery** — `test/rules-scenarios.js` (68 scenarios across Notices 1–7) asserts the exact verdict and citation for every rule branch, including at-cap boundaries, currency conversion, joint-account DRB, and not-covered fallbacks.

A report is written to `test/last-run-report.json`.

## Files

| File | Purpose |
|---|---|
| `rules.js` | **New** — deterministic verdict engine + follow-up questions + citation table |
| `kb.js` | Knowledge base (Notices 1–7, glossary, BM25 retrieval, citation grounding) — unchanged from the original |
| `app.js` | App logic — AI provider layer removed; Analyst wired to the rules engine; Advisor tab is now Reference Search |
| `index.html` | Shell — CSP no longer allows any AI endpoint; loads `rules.js` |
| `test/` | Offline rules-engine harness + scenario battery |
