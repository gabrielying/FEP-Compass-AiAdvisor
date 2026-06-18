# AI Compliance Analyst — manual test plan

This is the human-readable companion to `test/run-stress-test.js`. Both files
share the same 31 scenarios (`test/scenarios.js`) and the same ground truth —
the real provision text in `kb.js` — so a verdict or citation that fails one
should fail the other.

Use this document to **manually** exercise the AI Compliance Analyst (Smart
Tools tab → AI Compliance Analyst) against a configured AI provider (Gemini or
Ollama), entering each scenario's WHO/WHAT/WHERE/WHY/AMOUNT/CONTEXT into the
form and checking the resulting verdict card against the "Expect" column.

For an automated run against a local Ollama model instead, see
`test/run-stress-test.js` (run `npm run stress-test`).

## How to judge a result

1. **Verdict** — must be one of the listed acceptable verdicts.
2. **Citation** — must name the correct Notice, and the cited paragraph/FAQ
   must be one that genuinely exists in that Notice (not a hallucinated
   number).
3. **No phantom limits** — where a scenario lists "must not mention", the
   explanation/citation should NOT bring up that figure (it signals the model
   misapplied a cap that doesn't govern this case).

---

## Notice 1 — Dealings in Currency, Gold and Other Precious Metals

### n1-01 — Spot FX with a LOB to settle an import payment

| Field | Value |
|---|---|
| WHO | Resident company (importer) |
| WHAT | Buying USD against Ringgit on a spot basis with a Licensed Onshore Bank to settle an import payment |
| AMOUNT | USD 500,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1

**Rationale:** Part A, Para 1: a Resident may buy/sell FCY vs Ringgit on spot basis with a LOB for its own account.

---

### n1-02 — Forward FX contract with an unlicensed money changer

| Field | Value |
|---|---|
| WHO | Resident trading company |
| WHAT | Entering a 3-month forward contract to sell EUR against Ringgit with a local currency dealer that is NOT a Licensed Onshore Bank, to hedge an anticipated export receivable |

**Expect:** verdict in `[NOT_PERMITTED]`

**Rationale:** Forward Basis transactions must be undertaken with a LOB (Part A, Para 1) — an unlicensed counterparty is not permitted for forwards.

---

### n1-03 — Unregistered institutional investor using Dynamic Hedging

| Field | Value |
|---|---|
| WHO | Resident Institutional Investor (asset manager), NOT registered under the Dynamic Hedging Framework |
| WHAT | Enter plain vanilla forward contracts to sell FCY against Ringgit, hedging up to 100% of its FCY-denominated securities, without documentary evidence |

**Expect:** verdict in `[REQUIRES_APPROVAL]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2 requires one-off FEP Authority registration under the Dynamic Hedging Framework before this is allowed.

---

### n1-04 — FCY-vs-FCY spot deal with a LOB

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Buying USD against EUR on a spot basis with a Licensed Onshore Bank |
| AMOUNT | USD 20,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part A, Para 5: a Resident may buy/sell FCY against another FCY with a LOB.

---

## Notice 2 — Borrowing, Lending and Guarantee

### n2-01 — Individual Ringgit borrowing from a Non-Resident friend, within RM1M cap

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Borrowing RM800,000 in Ringgit from a Non-Resident friend (not an immediate family member or employer) |
| AMOUNT | RM 800,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Must NOT mention:** RM10 million, RM100 million

**Rationale:** Part A, Para 2 allows a Resident Individual to borrow up to RM1 million in aggregate in Ringgit from a Non-Resident (excl. NRFI) — RM800,000 is within that cap.

---

### n2-02 — Individual Ringgit borrowing from a Non-Resident friend, exceeding RM1M cap

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Borrowing RM1.5 million in Ringgit from a Non-Resident friend (not an immediate family member or employer) |
| AMOUNT | RM 1,500,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2 caps such Ringgit borrowing at RM1 million aggregate — RM1.5 million exceeds it.

---

### n2-03 — Entity FCY borrowing from its Direct Shareholder

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing USD80 million equivalent in Foreign Currency from its Non-Resident Direct Shareholder (parent company) |
| AMOUNT | USD 80,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para9

**Must NOT mention:** RM100 million

**Rationale:** Part B, Para 9(b): FCY borrowing from a Direct Shareholder is unlimited — the RM100 million cap (Para 10) only applies to borrowing from outside the Group/NRFI/out-of-group SPV.

---

### n2-04 — Entity FCY borrowing from an unrelated Non-Resident, exceeding RM100M cap

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing USD120 million equivalent in Foreign Currency from a Non-Resident company outside its Group (not a LOB, not a Direct Shareholder, not a Group entity) |
| AMOUNT | USD 120,000,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para10

**Rationale:** Part B, Para 10 caps FCY borrowing from outside the Group at RM100 million equivalent on a group basis — USD120 million well exceeds it.

---

### n2-05 — Individual Ringgit borrowing from an immediate family member

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Borrowing RM2 million in Ringgit from his Non-Resident spouse |
| AMOUNT | RM 2,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1

**Must NOT mention:** RM1 million

**Rationale:** Part A, Para 1: Ringgit borrowing from a Non-Resident Immediate Family Member is unlimited — the RM1 million cap (Para 2) does not apply here.

---

## Notice 3 — Investment in Foreign Currency Asset

### n3-01 — Regression: one housing loan + one vehicle loan together is still WITHOUT DRB

| Field | Value |
|---|---|
| WHO | Resident individual with exactly ONE outstanding housing loan AND exactly ONE outstanding vehicle loan at the same time, and no other Ringgit borrowing from any Resident |
| WHAT | Converting RM1.5 million from Ringgit to invest in foreign-listed stocks |
| AMOUNT | RM 1,500,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1

**Must NOT mention:** RM1 million, RM2 million

**Rationale:** One housing loan + one vehicle loan is the excluded DRB combination, NOT "more than one" of either type — this Resident is WITHOUT DRB, so Part A Para 1 (UNLIMITED) governs, not the RM1M Para 2 cap.

---

### n3-02 — Two housing loans triggers DRB, RM1M cap exceeded

| Field | Value |
|---|---|
| WHO | Resident individual with TWO outstanding housing loans and no other Ringgit borrowing |
| WHAT | Converting RM1.2 million from Ringgit to invest in a foreign currency fixed deposit |
| AMOUNT | RM 1,200,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para2

**Rationale:** TWO housing loans (more than one of the same type) gives this Resident DRB, so the RM1 million/year conversion cap (Part A, Para 2(c)) applies and is exceeded.

---

### n3-03 — No Ringgit borrowing at all — unlimited investment

| Field | Value |
|---|---|
| WHO | Resident individual with no Ringgit borrowing of any kind |
| WHAT | Converting RM5 million from Ringgit to invest in foreign-listed stocks |
| AMOUNT | RM 5,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1

**Must NOT mention:** RM1 million

**Rationale:** Part A, Para 1: a Resident Individual without DRB may invest any amount in FCY assets.

---

### n3-04 — Joint investment, neither party has DRB — must stay unlimited

| Field | Value |
|---|---|
| WHO | Two Resident individuals, joint accountholders, NEITHER of whom has any Domestic Ringgit Borrowing |
| WHAT | Jointly converting RM3 million from their joint Ringgit account into a joint foreign currency fixed deposit |
| AMOUNT | RM 3,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1

**Must NOT mention:** RM1 million, RM2 million

**Rationale:** With no DRB on either side, Part A Para 1 (UNLIMITED) governs the whole joint investment — the RM1M/RM2M joint-FCA FAQ only engages when at least one party has DRB.

---

### n3-05 — Joint investment, one party has DRB — RM2M combined cap exceeded

| Field | Value |
|---|---|
| WHO | Two Resident individuals, joint accountholders; one has DRB (two outstanding vehicle loans), the other has none |
| WHAT | Jointly converting RM2.5 million from their joint Ringgit account into a joint foreign currency fixed deposit |
| AMOUNT | RM 2,500,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** q7

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q7: DRB in any one joint party caps the WHOLE joint investment at RM1M per person / RM2M combined for two parties — RM2.5 million exceeds it.

---

### n3-06 — Entity with DRB using LOB FCY borrowing for Direct Investment Abroad

| Field | Value |
|---|---|
| WHO | Resident company with Domestic Ringgit Borrowing |
| WHAT | Using RM80 million equivalent of Foreign Currency borrowing obtained from a Licensed Onshore Bank to fund a Direct Investment Abroad (acquiring 25% equity in a foreign company) |
| AMOUNT | RM 80,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para4

**Must NOT mention:** RM50 million

**Rationale:** Part B, Para 4(b): LOB FCY borrowing used for DIA is unlimited — the RM50 million/year cap (Para 4(c)) only applies to conversion-funded, non-DIA investment.

---

## Notice 4 — Payment and Receipt

### n4-01 — FCY payment from Resident to Non-Resident for an import

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Paying USD300,000 to a Non-Resident supplier in Foreign Currency to settle an import of goods |
| AMOUNT | USD 300,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part C, Para 5: a Resident may pay a Non-Resident in FCY for any purpose except a short list of derivative transactions — an import settlement is not on that list.

---

### n4-02 — FCY payment between two Residents for an unlisted domestic purpose

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Paying another Resident individual in US Dollars for rental of a holiday home in Malaysia (both parties are Malaysian residents, no family relationship, no LOB or Global Supply Chain involvement) |
| AMOUNT | USD 10,000 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para4

**Rationale:** Part C, Para 4 only permits FCY payment between Residents for a specific listed set of purposes (family, education/employment/migration abroad, LOB dealings, Global Supply Chain, etc.) — domestic holiday-home rent is not on that list.

---

### n4-03 — Non-Resident repatriating Ringgit-asset divestment proceeds

| Field | Value |
|---|---|
| WHO | Non-Resident individual |
| WHAT | Repatriating proceeds from the sale of a Ringgit-denominated asset out of Malaysia, converting the proceeds into Foreign Currency before transfer |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para8

**Rationale:** Part E, Para 8: a Non-Resident may repatriate funds from Malaysia provided repatriation is in FCY and the Ringgit-to-FCY conversion follows Notice 1 Part B.

---

### n4-04 — Ringgit payment to a Non-Resident from a court judgement

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Making a Ringgit payment to a Non-Resident in Malaysia arising from a court judgement, where the underlying transaction complies with the FEP Notices |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para3

**Rationale:** Part B, Para 3 permits Ringgit payment/receipt for a court judgement where the underlying transaction is FEP-compliant.

---

## Notice 5 — Securities and Financial Instruments

### n5-01 — Resident issuing a Ringgit bond to a Non-Resident

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Issuing a Ringgit-denominated corporate bond in Malaysia to a Non-Resident institutional investor |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para1

**Rationale:** Part A, Para 1(a): permitted, but as a debt security issuance it must also comply with Notice 2 borrowing limits.

---

### n5-02 — Non-Resident issuing an FCY bond in Malaysia

| Field | Value |
|---|---|
| WHO | Non-Resident company |
| WHAT | Issuing a Foreign Currency-denominated bond in Malaysia to any investor |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2-3: a Non-Resident may issue an FCY-denominated security in Malaysia to any person.

---

### n5-03 — Bursa Malaysia offering an exchange-rate-linked Ringgit instrument

| Field | Value |
|---|---|
| WHO | Bursa Malaysia |
| WHAT | Offering a Non-Resident a Ringgit-denominated structured note whose payout is linked to the USD/MYR exchange rate |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para8

**Rationale:** Part B, Para 8 explicitly excludes exchange-rate-referenced financial instruments from what Bursa Malaysia may offer Non-Residents.

---

### n5-04 — Resident subscribing to a Notice-5 security

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Subscribing to a Ringgit-denominated corporate bond issued under Notice 5, subject to compliance with Notices 2, 3 and 4 |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para9

**Rationale:** Part C, Para 9-10: subscription is permitted subject to compliance with Notices 2, 3 and 4.

---

## Notice 6 — Import and Export of Currency

### n6-01 — Strict cap: traveller exporting RM5,000 cash

| Field | Value |
|---|---|
| WHO | Traveller (Resident) leaving Malaysia |
| WHAT | Carrying RM5,000 in Ringgit currency notes out of Malaysia on departure |
| AMOUNT | RM 5,000 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** ringgit (export)

**Rationale:** A traveller may take out at most RM1,000 in Ringgit notes per trip — amounts above that are NOT permitted under any circumstances (no approval pathway exists for this one).

---

### n6-02 — Within cap: traveller exporting RM800 cash

| Field | Value |
|---|---|
| WHO | Traveller (Resident) leaving Malaysia |
| WHAT | Carrying RM800 in Ringgit currency notes out of Malaysia on departure |
| AMOUNT | RM 800 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** ringgit (export)

**Rationale:** RM800 is within the RM1,000 per-trip cap on exporting Ringgit notes.

---

### n6-03 — Undeclared Ringgit import above threshold

| Field | Value |
|---|---|
| WHO | Traveller entering Malaysia |
| WHAT | Bringing RM15,000 in Ringgit currency notes into Malaysia without declaring it to Customs on arrival |
| AMOUNT | RM 15,000 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** ringgit (import)

**Rationale:** Import of Ringgit above RM10,000 must be declared to Customs — bringing it in undeclared is not permitted.

---

### n6-04 — Undeclared FCY export above threshold

| Field | Value |
|---|---|
| WHO | Traveller (Resident) leaving Malaysia |
| WHAT | Taking USD10,000 in foreign currency notes out of Malaysia without declaring it to the Royal Malaysian Customs Department |
| AMOUNT | USD 10,000 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** foreign currency

**Rationale:** Amounts exceeding RM30,000 equivalent in FCY must be declared to Customs; USD10,000 (well above that, at typical exchange rates) taken out undeclared is a violation.

---

## Notice 7 — Export of Goods

### n7-01 — Compliant export proceeds receipt

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Receiving the full value of export proceeds within 4 months of shipment, credited into a Trade FCA maintained with a Licensed Onshore Bank |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(a) or para1(c)

**Rationale:** Part A, Para 1(a)/(c): full-value receipt within 6 months into a Ringgit account or Trade FCA with a LOB is the standard compliant pattern.

---

### n7-02 — Export proceeds overdue beyond 6 months, no approved exception

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Export proceeds still not received 8 months after shipment date, and none of the approved Appendix C circumstances (buyer difficulties, disputes, consignment, testing) apply |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para1(c)

**Rationale:** Part A, Para 1(c): proceeds must be received within 6 months, extendable to 24 months ONLY in approved Appendix C circumstances — none apply here.

---

### n7-03 — Large exporter has not filed the required report

| Field | Value |
|---|---|
| WHO | Resident exporter with annual gross exports of RM300 million in the preceding year |
| WHAT | Has not submitted any report to the FEP Authority despite exceeding the RM250 million reporting threshold |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para4

**Rationale:** Part C, Para 4: exporters with annual gross exports above RM250 million must report to the FEP Authority as and when required — not having reported is non-compliant.

---

### n7-04 — Outstanding proceeds beyond 24 months, not notified

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Export proceeds still outstanding 25 months after shipment, and the exporter has not notified the FEP Authority of the outstanding amount |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part C, Para 5: proceeds outstanding beyond 24 months must be notified to the FEP Authority within 21 days after year-end — failing to notify is non-compliant.

---

