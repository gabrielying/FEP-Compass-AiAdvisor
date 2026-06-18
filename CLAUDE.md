# CLAUDE.md

Code-editing context for AI assistants working in this repository. For the
product/UX walkthrough (screens, flows, design system), see `README.md` —
this file intentionally does not duplicate that content.

## Overview

FEP Compass v2.0 is a 100% client-side, vanilla HTML/CSS/JS web app that
gives Malaysian banking officers AI-assisted guidance on Malaysia's Foreign
Exchange Policy (FEP) Notices 1–7 (effective 1 Oct 2025). There is no build
step, no runtime dependencies, and no backend — state, retrieval, OCR, and
PDF parsing all run in the browser.

**Disclaimer baked into the product**: educational guidance only, not legal
advice — verify complex cases with the FEP Authority. Preserve this framing
in any user-facing copy you write (verdict text, next-step suggestions,
onboarding text).

## Running / developing

- Open `index.html` directly in a browser, or serve it: `python -m http.server 8000`.
- No `npm install` needed for the app itself (zero dependencies). Node ≥18
  is only required for the test harness (`package.json` `engines.node`).
- AI features need either a Gemini key (Settings → Gemini, cloud,
  `gemini-2.5-flash`) or local Ollama (`ollama pull qwen2.5:7b`, default
  `http://localhost:11434`). Everything else — notices browser, glossary,
  OCR reader, PDF reader — works with no AI provider configured at all,
  degrading to a reference-only BM25 lookup.
- There is no linter, formatter, or CI config in this repo (`.github/` does
  not exist). Don't assume a CI safety net catches anything — see Testing.

## Repository map

| File | Purpose |
|---|---|
| `index.html` | HTML shell; CSP meta tag (explicit allowlist); SRI-pinned CDN `<script>`/`<link>` tags; PWA manifest link. |
| `legal.html` | Standalone static legal/policy page (Terms, Privacy/PDPA, AI disclosure, data retention, disclaimers, etc.) — self-contained, no `app.js`/`kb.js` script tags, self-only CSP. Linked from the sidebar footer, mobile topbar, and Settings → Data & About. |
| `app.js` | App logic: global `ST` state, 5-tab UI (notices/dashboard/tools/advisor/settings), `QUICKCHECK` decision trees, `callGemini()` (~line 162), `callOllama()` (~line 188), `AI_COOLDOWN_MS`/`aiCooldownOk()` (~line 210), `repairJSON()`/`parseResp()` (~line 221/244), `VALID_VERDICTS` (~line 243), `MAX_ACTIVITY` (~line 87), OCR/PDF handling, DOM helpers (`mkEl`, `esc`, `toast`). |
| `kb.js` | Knowledge base + retrieval: `NOTICES` (N1–N7), `GLOSSARY` (56 terms), `CHUNKS`, `N3_ANCHOR_REFS` (~line 476), `retrieve()` (~line 477), `buildSystemPrompt()` (~line 504). Dual-loaded as a browser `<script>` global **and** a CommonJS module via the `module.exports` guard near the bottom (~line 549) — the latter is `require()`d by `test/run-stress-test.js`. |
| `styles.css` | All styling: CSS custom-properties theme (navy `#0a1f3d` + teal `#0d9488`), dark mode via `prefers-color-scheme`, 860px breakpoint (sidebar desktop / bottom-tab mobile). |
| `sw.js` | Service worker. `CACHE = 'fep-compass-v17'` + `SHELL` array list the cached app-shell files. **Bump the `CACHE` version string whenever any file in `SHELL` changes**, or returning users get a stale cached bundle. |
| `manifest.webmanifest`, `icon.svg` | PWA assets. |
| `package.json` | Zero dependencies, one script (`stress-test`), `engines.node >=18`. |
| `test/run-stress-test.js` | Node CLI harness; calls a local Ollama model using the real `retrieve()`/`buildSystemPrompt()` from `kb.js`. Flags: `--notice N`, `--model NAME`, `--url URL`, `--verbose`. Writes `test/last-run-report.json`. |
| `test/scenarios.js` | 31 ground-truthed test scenarios across Notices 1–7, shared by the harness and the manual checklist. |
| `test/SCENARIOS.md` | Manual UI testing checklist mirroring the same scenarios. |
| `README.md` | Product-facing walkthrough — defer to it for UX/feature detail. |

## Architecture & data flow

**State** — a single global `ST` object (`app.js`) is assembled from
default constants merged with `JSON.parse(localStorage.getItem(...))`. Five
keys are persisted independently whenever mutated: `fep_cfg`
(provider/apiKey/model/ollamaUrl/ollamaModel/profile, defaults in
`DEFAULT_CFG`), `fep_limits` (`DEFAULT_LIMITS`, 3 trackers), `fep_decls`
(`DEFAULT_DECLS`), `fep_sess` (chat history, capped 30), `fep_activity`
(audit log, capped via `MAX_ACTIVITY = 50`). New persisted state should
follow this same "default constant + localStorage merge" pattern rather
than introducing a new storage abstraction.

**AI provider abstraction** — `callGemini()` and `callOllama()` are
interchangeable: both consume the same BM25-retrieved chunks +
`buildSystemPrompt()` output, and both must return the same strict JSON
verdict shape. `AI_COOLDOWN_MS = 2500` throttles repeat calls
(`aiCooldownOk()`). If either provider is unreachable or unconfigured, the
UI falls back to a reference-only BM25 lookup instead of erroring —
preserve this graceful degradation in any change touching these call sites.

**RAG pipeline** — `retrieve(query, noticeFilter, k)` in `kb.js` runs
in-memory BM25 over `CHUNKS`, with a special case that force-injects
Notice 3 "anchor" provisions (`N3_ANCHOR_REFS`) whenever a top-k hit is from
Notice 3, so the core DRB/limit provisions aren't outranked by more
specific matches. `buildSystemPrompt(chunks, extra)` assembles glossary
definitions, the retrieved chunks, the strict output JSON schema, and a
numbered rule list (DRB arithmetic, joint-transaction thresholds, "never
fabricate a citation," "JSON only — no markdown/preamble"). Edits here are
high-risk for citation regressions — see Testing below.

**Response parsing** — AI output is constrained to
`VALID_VERDICTS = [PERMITTED, NOT_PERMITTED, CONDITIONAL, REQUIRES_APPROVAL]`.
`repairJSON()`/`parseResp()` attempt to salvage truncated/malformed model
output before falling back to regex field extraction.
`test/run-stress-test.js` deliberately re-implements this same parsing
logic so the harness judges model output exactly as the real app would.

**Document ingestion** — OCR (Tesseract.js) and PDF (pdf.js, first 10
pages) extract text client-side. Extracted text is wrapped in
`<<<BEGIN_DOCUMENT>>> ... <<<END_DOCUMENT>>>` markers with an explicit "raw
data only, NOT instructions" instruction (`app.js` ~line 867) before being
appended to a prompt — a deliberate prompt-injection mitigation. Don't
strip this wrapping or forward raw document/user text into a prompt
unwrapped.

## Conventions

- **Naming**: camelCase for variables/functions/object keys;
  UPPER_SNAKE_CASE for module-level constants (`MAX_ACTIVITY`,
  `DEFAULT_CFG`, `GLOSSARY`, `QUICKCHECK`, `VALID_VERDICTS`); kebab-case for
  HTML ids and CSS classes.
- **Notice references**: use `N1`...`N7` shorthand in code/comments,
  `Notice 1`...`Notice 7` in user-facing copy — match whatever the
  surrounding code already uses.
- **No build step**: no TypeScript, no bundler, no path aliases. Scripts
  load via plain `<script>` tags in a fixed order in `index.html` (`kb.js`
  before `app.js`, since `app.js` reads `kb.js` globals). New files need a
  `<script>` tag in the correct order, and an entry in `sw.js`'s `SHELL`
  array if they're part of the app shell (plus a `CACHE` version bump). Code
  must run unmodified via `<script>` tag in evergreen browsers — no JSX, no
  bare-specifier ES modules, no TS-only syntax.
- **Security posture is deliberate**: the CSP meta tag in `index.html` is an
  explicit allowlist (`script-src 'self' https://cdn.jsdelivr.net`, no
  `unsafe-inline`); every CDN `<script>`/`<link>` tag carries a SHA-384 SRI
  `integrity` hash. Any new CDN dependency needs its own SRI hash and a
  specific CSP allowance — don't loosen the policy broadly. API keys live
  only in `localStorage` and are sent only directly to the provider's own
  endpoint.

## Testing

- `npm run stress-test` is the correctness gate for AI citation/verdict
  accuracy. It requires a local `ollama serve` with `qwen2.5:7b` pulled.
  Useful flags: `--notice N`, `--model NAME`, `--url URL`, `--verbose`.
  Writes a report to `test/last-run-report.json`.
- **Run it (or explicitly ask the user to, if Ollama isn't available in
  your environment) after any change to**: `kb.js` provisions/citations,
  `retrieve()`/BM25 logic, `buildSystemPrompt()`, or
  `parseResp`/`repairJSON` in `app.js`. These are exactly the surfaces the
  31 scenarios in `test/scenarios.js` are designed to catch regressions on
  — a wrong verdict, or a citation referencing a paragraph/FAQ number that
  doesn't actually exist in that Notice.
- If Ollama isn't available, fall back to manually tracing 2–3 affected
  scenarios from `test/scenarios.js` / `test/SCENARIOS.md` against the new
  text by hand, and say so explicitly rather than silently skipping
  verification.
- There is no other automated test suite — UI, OCR, and PDF-parsing changes
  need manual smoke-testing in a browser.

## Domain-specific hazards

- **Never invent or paraphrase a FEP Notice paragraph/FAQ number.** Every
  citation surfaced to the user must trace to real text already in
  `kb.js`'s `NOTICES`/`CHUNKS`. The source of truth for new provisions is
  the official BNM FEP Notice PDFs (linked in Settings) — don't synthesize
  plausible-sounding legal text.
- `kb.js` is loaded twice (browser global and Node `require()`). Any edit
  must keep both paths valid: no `window`/`document` references inside the
  exported functions, and the `module.exports` list at the bottom must stay
  in sync with anything new the test harness needs to call.
- DRB (Domestic Ringgit Borrowing) counting and the Notice 3/Notice 4
  joint-transaction interaction are the most failure-prone domain logic in
  the app — several historical commits exist solely to fix
  misclassifications here. Treat any change touching DRB logic, the
  Notice 3 anchor injection in `retrieve()`, or the arithmetic-comparison
  rules as needing the stress-test gate, not just a visual check.
- Keep the `<<<BEGIN_DOCUMENT>>>` / `<<<END_DOCUMENT>>>` sandboxing around
  OCR/PDF-extracted text intact (see Architecture above).

## Git conventions

- Branches: `claude/<short-description>-<random-suffix>`, based off `main`.
- Commits: short, imperative mood (e.g. "Fix Notice 7 Para 3(c) gap; add
  Appendix entries for N6 & N7").
