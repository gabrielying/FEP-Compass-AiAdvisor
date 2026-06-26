# FEP Compass — Project Requirements Document

**Status:** Built and functional. Blocked on internal review of AI-tooling
usage; no decision received after one week.

---

## 1. Problem Statement

Malaysian banking officers handling foreign-exchange transactions need to
check each transaction against Bank Negara Malaysia's Foreign Exchange
Policy (FEP) Notices 1–7 (effective 1 Oct 2025). Today that means manually
searching dense regulatory PDFs under time pressure. FEP Compass gives
officers fast, citation-grounded guidance against the actual Notice text,
either with or without AI assistance.

## 2. Goals / Non-Goals

**Goals**
- Speed up first-pass FEP compliance checks for banking officers.
- Ground every answer in real, citable Notice paragraphs/FAQs — never
  invented text.
- Work usefully even with **zero** AI configured.

**Non-Goals**
- Not a system of record, not an audit trail of regulatory decisions.
- Not a replacement for sign-off by a compliance officer, legal counsel, or
  the FEP Authority on complex or high-value cases.
- Not legal advice — this is explicit and repeated throughout the product.

## 3. Target Users

Banking officers and similar professional users who need a fast first
read on FEP applicability before escalating to compliance/legal.

## 4. Product Overview

Five tabs: **Notices** (browse N1–N7 + glossary), **Dashboard**, **Tools**
(structured Quick-Check decision trees), **AI Advisor** (free-form chat),
**Settings** (AI provider configuration, data controls).

Everything except the AI Advisor and the AI-assisted Compliance Analyst
works with **no AI provider configured at all** — the app falls back to a
reference-only BM25 lookup against the real Notice text. AI is an optional
accelerant on top of a tool that's already useful without it.

## 5. System Architecture

- 100% client-side: plain HTML/CSS/vanilla JS, **no backend server**, no
  build step, no runtime dependencies.
- All persisted state (AI provider config, FEP limit trackers,
  declarations, chat history, activity log) lives only in the browser's
  `localStorage`.
- Retrieval: an in-memory BM25 search over the Notice text (`kb.js`)
  surfaces the relevant provisions; a citation-grounding check verifies
  any AI-generated citation actually traces to a real Notice
  paragraph/FAQ before it's shown to the user — if it can't be matched,
  the UI flags it as an "unverified citation" rather than presenting it
  as authoritative.
- Optional AI step: the retrieved chunks plus the user's query are sent to
  whichever AI provider is configured (see §7) to produce a structured
  verdict. If no provider is configured, or the model is unreachable,
  the app degrades to the BM25 result instead of erroring.

## 6. Data Handling & Security Posture

Quoting the app's own published policy (`legal.html`, which ships with the
app and is linked from Settings):

> "FEP Compass is a 100% client-side application. There is no backend
> server. No part of this app transmits your data to any server operated
> by the developer, because no such server exists."

> "There is no analytics, telemetry, tracking pixel or third-party
> advertising script anywhere in this codebase."

Additional controls, verifiable directly in the code:
- **CSP allowlist** (`index.html`): `connect-src` is restricted to
  Google's Gemini endpoint, `localhost`/`127.0.0.1` (Ollama), and the
  jsDelivr CDN the app's signed assets load from — nothing else.
- **SRI pinning**: every CDN `<script>`/`<link>` carries a SHA-384
  integrity hash.
- **Data retention**: nothing server-side (there is no server). Locally,
  chat history is capped at 30 entries and the activity log at 50; a
  user can wipe all local data from Settings at any time.
- **PDPA framing**: because processing is entirely on-device and nothing
  is collected or transmitted to the developer, the developer does not
  act as a "data user" under Malaysia's PDPA 2010 with respect to app
  usage.

## 7. The Three Operating Modes

This is the section a policy reviewer needs most, because "AI tooling" is
not actually one thing in this app — it's three distinct configurations
with very different risk profiles:

| Mode | What happens | Data leaves the device? |
|---|---|---|
| **No AI** | Reference-only BM25 lookup against Notice text. Default with nothing configured. | Never. No AI model is involved at all. |
| **Local AI (Ollama)** | Query + retrieved chunks sent to a model the user/org runs themselves. The app validates the URL must be `http://localhost:*` or `http://127.0.0.1:*` — it will not call anything else. | No. Stays on the machine/network running Ollama. |
| **Cloud AI (Gemini)** | Query + retrieved chunks sent directly from the browser to `generativelanguage.googleapis.com` using a user-supplied API key, stored only in `localStorage`. Governed by Google's own terms, not the developer's. | Yes — to Google, directly, with no developer-run intermediary. |

**Flag for reviewers:** if the current policy prohibits *any* AI tooling
regardless of where it runs, then Local AI (Ollama) still requires a
formal exception even though no data leaves company-controlled
infrastructure. Worth confirming whether that's the intended scope, or
whether the policy is really aimed at the cloud/3rd-party-API case.

## 8. Known Limitations & Disclaimers

- Disclaimer shown throughout the product: *"Educational guidance only —
  not legal advice. Verify complex cases with the FEP Authority."*
- AI verdicts are probabilistic model output over retrieved text — they
  can be incomplete, stale relative to the latest BNM circulars, or wrong.
  Unverified citations are flagged in the UI rather than presented as fact.
- No automated CI in this repo. Correctness for AI verdicts/citations is
  checked via a manual stress-test harness (`npm run stress-test`) against
  150 ground-truthed scenarios, run against a local Ollama model.

## 9. Open Questions for Whoever Reviews This

1. Does the "no 3rd-party AI" policy distinguish self-hosted/local models
   (Ollama, run on org-controlled infrastructure) from 3rd-party cloud
   APIs (Gemini)? Or is it intended to cover both equally?
2. Who is the actual decision-maker for an AI-tooling exception request —
   InfoSec, Compliance/Legal, or someone else? (This has been unclear for
   a week, which is part of why this is stuck.)
3. Is there a sandbox/non-production environment where this could be
   piloted under lighter-weight approval than a production rollout?
4. If full approval isn't feasible soon, would a **no-AI / local-Ollama-
   only** v1 (deferring the Gemini cloud path entirely) be an easier yes?

---

## Appendix: Recommended Approval Path & Escalation Plan

This has been pending one week with no response or a dismissal without
real engagement. That pattern — long document, no named owner, no
deadline — tends to stall indefinitely on its own. Concrete next steps:

1. **Stop re-sending the same long ask.** Send a short, direct message
   (email, not chat, so there's a timestamped record) to a **specific
   named person**, with this PRD attached as backup, asking one question:
   *"Can you make this decision, or tell me who can, by [specific date —
   e.g. 5 business days from now]?"* A request with no named recipient and
   no deadline is easy to deprioritize indefinitely; a named decision-maker
   and a date are much harder to ignore.
2. **Lower the bar with a scoped v1 ask.** Rather than asking for blanket
   approval of "AI tooling," ask for approval of the **no-AI / local-
   Ollama-only** configuration first (§7 above), explicitly deferring the
   cloud-Gemini question to a later phase. A smaller, well-bounded ask is
   easier for a reviewer to say yes to than an open-ended one.
3. **Set an explicit follow-up cadence and stick to it.** If there's no
   response in 3–5 business days, escalate one level — the original
   recipient's manager, or whoever formally owns security/AI policy —
   and say plainly: *"This has been pending since [date] with no
   response."* Don't let a second silence reset the clock back to zero.
4. **If it's still unresolved after ~2 weeks total**, stop treating it as
   a status update and bring it to your own manager explicitly as a
   blocker: *"I need help getting a decision on X — I've followed up
   twice over two weeks with no response."* That reframes it from "FYI"
   to "I need you to unstick this," which is a different and more
   actionable ask.
5. **Keep a paper trail.** Each follow-up should reference the date of
   the previous one. If this ends up needing escalation, a visible
   timeline of "asked on X, followed up on Y, escalated on Z" is far more
   persuasive than a vague "I've been trying for weeks."
