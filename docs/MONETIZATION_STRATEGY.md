# FEP Compass — Monetization & Marketing Strategy

> Companion doc to `README.md`. Written for a 100% client-side PWA (no backend, no auth,
> no billing today) that serves Malaysian banking/compliance officers and corporates
> navigating FEP Notices 1–7 (effective 1 Oct 2025).

---

## 1. Where we start from

Today the app is intentionally infra-free: static HTML/CSS/JS, BYOK (bring your own Gemini
key) or local Ollama, everything stored in `localStorage` on one device. That's great for
trust (no data leaves the user's browser/device) but it means **there is currently nothing
to subscribe to** — anyone can already use it for free forever with their own free Gemini
key, or fully offline with Ollama.

To sell subscriptions, the value being sold has to be things the user *can't* get for free
today:

1. **No API key hassle** — a managed AI backend so users don't need to create/manage a
   Gemini key.
2. **Cross-device sync** — sessions, activity log, dashboard limits, declarations
   currently live only in one browser's `localStorage`.
3. **Team/compliance-desk features** — shared audit trail, multi-seat admin, branded
   exports.
4. **Higher-tier models / higher limits** — e.g. `gemini-2.5-pro` for complex cases,
   higher daily caps.
5. **Priority support + faster updates** when BNM amends a Notice.

This means monetization requires a small backend (auth + billing + a metered AI proxy).
The good news: this can be a thin serverless layer (Cloudflare Workers/Supabase + Stripe)
that sits *alongside* the existing client-side app — the BYOK/Ollama paths stay exactly as
they are for privacy-conscious users (a strong selling point for banks).

---

## 2. Recommended model: Freemium, BYOK-preserving

| Tier | Price | Who it's for | What's included |
|---|---|---|---|
| **Free** | RM0 | Anyone, individual officers trying it out | Unlimited Notices/FAQ hub, glossary, "Am I Affected?" wizards, Dashboard, OCR/PDF readers (all run locally — zero AI cost). **AI Advisor & Compliance Analyst: 10 managed requests/day**, OR **unlimited if you connect your own Gemini/Ollama key** (current behaviour, unchanged) |
| **Pro** (individual) | **RM39/month** (~US$9) or **RM390/year** (2 months free) | Individual compliance officers, FX dealers, freelance consultants | Unlimited managed AI (fair-use ~300/day), access to `gemini-2.5-pro` for complex cases, cross-device cloud sync of sessions/activity/declarations, priority email support, early access when new Notices drop |
| **Team / Compliance Desk** | **RM29/seat/month**, 5-seat minimum (RM145/month) | Bank compliance departments, corporate treasury teams | Everything in Pro + shared team audit trail (manager visibility across officers), admin console (seat mgmt, usage reports), bank-branded "Save as PDF" exports, onboarding session |
| **Enterprise** | Custom (from ~RM2,500/month, annual contract) | Whole-bank rollouts, regulated institutions | Everything in Team + on-prem/Ollama deployment package, SSO (SAML), white-label, custom integration with internal compliance systems, dedicated account manager |

**Why this shape works for *this* app specifically:**
- The educational/reference content (Notices, FAQs, glossary, decision trees, OCR/PDF
  tools) is **zero marginal cost** (pure client-side compute) — keep it unlimited and free.
  It's also your best lead-gen/SEO asset.
- BYOK/Ollama stays free and unlimited forever — this is a *trust* signal for banks
  ("we're not holding your data hostage to make you pay") and costs you nothing.
- The thing people will actually pay for is **convenience** (no key setup) and
  **team/compliance workflow** features — which map cleanly to Pro/Team/Enterprise.

---

## 3. Is a 10 requests/day free tier reasonable?

**Yes — with one important framing: it's 10 *managed* (no-key-needed) AI requests/day,
not a cap on the whole app.**

**Cost math** (Gemini 2.5 Flash, current pricing ≈ $0.30/M input tokens, $2.50/M output
incl. thinking tokens). A typical Advisor/Analyst call with the RAG system prompt + 6
retrieved provisions + history ≈ 4,000 input tokens, and a JSON verdict with a 4,096
thinking budget ≈ 1,500–2,500 output tokens → roughly **$0.005–0.01 per query**.

- 10 free queries/day, fully used every day ≈ **$1.50–3/month per active free user** in
  API cost. That's affordable even with a modest free→paid conversion rate, and most free
  users won't max it out daily.
- If a free user *does* hit the cap daily, that's a strong buying signal (heavy user) —
  exactly who should convert to Pro.

**Benchmarking:** 5–20 AI actions/day is the typical free-tier band for AI-assisted SaaS
tools (most sit around 10–15). 10/day is squarely in the "useful enough to build a habit,
limited enough to create upgrade pressure" zone.

**Refinements I'd make:**
1. **Don't gate the reference tools** — only the two AI-calling features (AI Advisor,
   Compliance Analyst) count against the 10/day. The OCR/PDF readers' *local* extraction
   stays unlimited; only "Send to Analyst" (which triggers an AI call) counts.
2. **Always offer the BYOK escape hatch** — show a banner at 8/10 used: *"2 free AI
   requests left today — connect your own free Gemini key for unlimited, or upgrade to
   Pro."* This converts frustration into either a key signup (still good — keeps them in
   the product) or a Pro upgrade.
3. **Daily reset, not monthly pool** — daily resets feel generous ("fresh 10 tomorrow")
   and are simpler to communicate than a monthly bucket.
4. **Show the counter proactively** in the AI Advisor/Analyst UI (e.g. "7/10 today") so
   it never feels like a surprise wall — surprise limits are the #1 cause of churn/anger
   in freemium AI products.

---

## 4. Marketing plan

### 4.1 Target segments (in priority order)
1. **Bank FX/compliance officers** — Maybank, CIMB, Public Bank, RHB, Hong Leong, AmBank,
   and other Licensed Onshore Banks (LOBs) processing cross-border FX transactions daily
   under the new Oct 2025 Notices.
2. **Corporate treasury/finance teams** — exporters/importers and MNCs with regional ops
   that need quick FEP answers for trade finance, intercompany loans, FCY accounts.
3. **Compliance consultants & trainers** — independent advisors, training providers
   (AICB/IBBM-affiliated), and boutique regulatory consultancies who could become
   referral partners or resell Team licenses to clients.

### 4.2 Positioning / messaging
> **"Ask Malaysia's new FX rules a question, get a citation-backed answer in seconds —
> built specifically for FEP Notices 1–7 (effective 1 Oct 2025), works offline for
> sensitive data."**

Key differentiators to hammer in every message:
- **Citation-backed, notice-specific** — not generic ChatGPT; every verdict cites the
  exact Part/Para/FAQ.
- **Privacy-first option** — Ollama mode means a bank can run it fully offline/on-prem;
  no FX transaction data ever leaves their network. This is a *huge* objection-killer for
  regulated institutions and should be a headline feature in B2B sales conversations.
- **Built for the Oct 2025 rule change** — timeliness/urgency angle: "the rules just
  changed, your team needs to get up to speed fast."

### 4.3 Channels & tactics

| Channel | Tactic |
|---|---|
| **LinkedIn (organic)** | Short explainer posts on what changed in each Notice (1 per week for first 2 months), tagged toward Malaysian banking/compliance audiences. Founder-led posts perform best for niche B2B. |
| **LinkedIn (paid)** | Narrow targeting: job titles "Compliance Officer", "FX Dealer", "Trade Finance", "Treasury" + location Malaysia. Small budget (RM500–1,000/mo) test campaigns driving to a free-tier signup. |
| **SEO / content** | Publish the Notices/FAQ/glossary hub as public web pages (it already exists in-app) — these rank for searches like "FEP Notice 3 2025 explained", "Malaysia FCY investment limit individual". Free organic traffic + lead magnet. |
| **Direct B2B outreach** | Targeted email/InMail to compliance heads at the LOBs above, offering a free Team-tier pilot (e.g. 90 days) in exchange for feedback + a case study/testimonial. |
| **Partnerships** | AICB/IBBM and other CPD/training providers — co-branded webinar "Navigating the new FEP Notices" with the tool as the demo. Referral commission for consultants who bring in Team/Enterprise clients. |
| **Communities** | Malaysian fintech/compliance Telegram/WhatsApp groups, BNM-watcher forums — share the free reference tool as a genuinely useful resource (soft-sell). |
| **Referral program** | Existing Pro users get 1 free month for each paid referral — compliance officers know peers at other banks, this travels well in a small professional community. |
| **PWA distribution** | "Add to Home Screen" install prompts in-app once a user has used the tool 3+ times — turns casual visitors into habitual users (and habitual users convert better). |

### 4.4 Launch sequencing (first 90 days)
1. **Weeks 1–2:** Ship the metered free tier + Pro paywall (see roadmap below). Soft
   launch to existing users/network — gather feedback on the 10/day limit and pricing.
2. **Weeks 3–6:** Content push — publish FEP Notice explainer posts/pages, start LinkedIn
   organic + SEO content. Begin outreach to 10–15 target compliance departments offering
   free Team pilots.
3. **Weeks 7–12:** Run first paid LinkedIn campaign batch, host/co-host one webinar with a
   training partner, collect first testimonials/case studies from pilot banks, convert
   pilots to paid Team contracts.

### 4.5 Simple revenue model (illustrative)
- 1,000 free users (driven by SEO + LinkedIn + word of mouth in compliance circles)
- 3–5% convert to Pro → 30–50 × RM39 = **RM1,170–1,950/month**
- 2–3 Team pilots convert to paid (5 seats each) → 2–3 × RM145 = **RM290–435/month**
- 1 Enterprise deal in year one → **RM2,500+/month**

Even modest numbers (~RM4,000–5,000/month combined) comfortably cover Supabase + Cloudflare
+ Stripe fees + Gemini free-tier costs, with the Team/Enterprise side being where real
upside lives given the narrow but high-value B2B audience.

---

## 5. Technical roadmap to enable this (phased)

**Phase 1 — Minimal paywall infra**
- Auth: Supabase Auth (email magic link) — lightweight, generous free tier.
- Billing: Stripe Checkout + Customer Portal + webhook handler (Cloudflare Worker or
  Supabase Edge Function) — handles subscriptions, upgrades, cancellations.
- Managed AI proxy: a Worker that holds *your* Gemini key, checks the caller's plan +
  daily usage counter (Supabase Postgres row per user/day), forwards to Gemini, returns
  the response. BYOK path in `app.js` (`callGemini`/`callOllama`) stays untouched.
- UI: Settings gets a "Sign in" + "Upgrade to Pro" section; AI Advisor/Analyst show a
  small "X/10 free today" counter when on the free managed tier.

**Phase 2 — Sync & Team features**
- Sync `fep_sess`, `fep_activity`, `fep_limits`, `fep_decls` to the backend for signed-in
  Pro+ users (still keep `localStorage` as the offline cache/fallback).
- Team admin console: seat invites, per-seat usage dashboard for compliance managers.

**Phase 3 — Enterprise**
- Packaged on-prem/Ollama deployment guide, SSO (SAML via Supabase or WorkOS), white-label
  theming, dedicated support SLA.

---

## 6. Risks & mitigations
- **API cost overrun on free tier** → hard per-user daily counter enforced server-side
  (not just client-side), use `gemini-2.5-flash` (not pro) for the free managed tier.
- **Regulatory liability** → keep the existing disclaimer prominent; Pro/Team tiers should
  reinforce "educational guidance, verify with FEP Authority for complex cases" in exported
  PDFs too.
- **Banks' data-residency concerns** → lead with the Ollama/on-prem option in enterprise
  sales — it's the strongest objection-handler you have.
- **Low free→paid conversion** → the 10/day cap + visible counter + BYOK escape hatch
  (Section 3) is designed specifically to make the upgrade moment obvious without feeling
  punitive.
