# CLAUDE.md

Code-editing context for AI assistants working in this repository. For the
product walkthrough see `README.md`.

## Overview

FEP Compass **No-AI edition** — a fork of FEP-Compass-AiAdvisor with all AI
involvement removed. 100% client-side vanilla HTML/CSS/JS, no build step, no
dependencies, no backend, **no AI provider and no network calls**. Verdicts
come from a deterministic rules engine (`rules.js`); retrieval is in-browser
BM25 (`kb.js`).

**Disclaimer baked into the product**: educational guidance only, not legal
advice — verify complex cases with the FEP Authority. Preserve this framing
in any user-facing copy.

## Running / developing

- Open `index.html` directly, or `python -m http.server 8000`.
- Node ≥18 is only needed for the test harness (`npm test`) — the harness is
  fully offline (no Ollama, no API keys).

## Repository map

| File | Purpose |
|---|---|
| `rules.js` | Deterministic verdict engine: `WHO_KIND`, `RULE_CITES` (every citation the engine can emit), `RULE_QUESTIONS`, per-transaction-type eval functions, `evaluateRules()`. Dual-loaded (browser global + CommonJS) like `kb.js`. |
| `kb.js` | Knowledge base + retrieval: `NOTICES` N1–N7, `GLOSSARY`, `CHUNKS`, `retrieve()` (BM25 + N2/N3 anchor injection), citation-grounding helpers (`verifyCitation` etc.). Unchanged from the upstream repo. |
| `app.js` | App logic: `ST` state, 4-view UI, `QUICKCHECK` trees, `RULE_RUN`/`renderRulesCheck()` (Analyst rules flow), `referenceResultBlock()`/`sendChat()` (Reference Search), `verdictCard()` with runtime `verifyCitation()` check. |
| `index.html` | Shell; CSP allowlist (no AI endpoints in `connect-src`); loads `kb.js` → `rules.js` → `app.js` in that order. |
| `sw.js` | Service worker. **Bump `CACHE` whenever any `SHELL` file changes.** |
| `test/run-rules-test.js` | Offline harness: (1) audits every `RULE_CITES` entry via `verifyCitation()`; (2) runs `test/rules-scenarios.js` (68 structured scenarios) asserting exact verdict + citation. Writes `test/last-run-report.json`. |

## Architecture

**Rules flow** — Analyst form (structured pickers) → `evaluateRules({who,
what, from, to, ccy, amt, answers})` → either `{ask}` (render one yes/no
follow-up at a time, QUICKCHECK-style), `{verdict}` (render via
`verdictCard()`), or `{covered:false}` (honest fallback to a `retrieve()`
reference lookup). `RULE_RUN` in `app.js` holds the in-progress run.

**Amount caps** — compared via `cmpCap()` in `rules.js` using the static
`RM_RATES` table. Exactly-at-cap is WITHIN the cap. Unknown currencies get
an explicit "verify manually" CONDITIONAL verdict, never a silent guess.

**State** — same "default constant + localStorage merge" pattern as
upstream (`fep_sess`, `fep_activity`, `fep_draft`, `fep_nav`). `fep_cfg`
and `fep_ai_ack` no longer exist (still purged by Clear-all-data).

## Hard rules

- **Never invent a FEP citation.** Every string in `RULE_CITES` must
  resolve against `kb.js` via `verifyCitation()` — `npm test` gate 1 fails
  otherwise. New rules may only cite provisions already in `kb.js`.
- **Do not reintroduce network calls or AI providers.** The CSP
  `connect-src` deliberately allows no AI endpoint; `sw.js` has no
  provider bypass. This constraint is the point of the fork.
- `rules.js` and `kb.js` are dual-loaded (browser + Node): no
  `window`/`document` inside them; keep `module.exports` in sync.
- **Run `npm test` after any change to** `rules.js`, `kb.js` provisions,
  `retrieve()`, or the citation helpers. Add scenarios to
  `test/rules-scenarios.js` for any new rule branch.
- DRB counting and joint-account limits remain the most failure-prone
  domain logic — the DRB hint text in `RULE_QUESTIONS` and the at-cap /
  per-person threshold arithmetic must not drift from the `kb.js` text.

## Conventions

Same as upstream: camelCase functions, UPPER_SNAKE_CASE module constants,
kebab-case ids/classes; `N1`…`N7` in code, `Notice 1`…`Notice 7` in copy;
no build step — evergreen-browser JS only, `<script>` tag order matters.

## Git conventions

- Branches: `claude/<short-description>-<random-suffix>`, based off `main`.
- Commits: short, imperative mood.
