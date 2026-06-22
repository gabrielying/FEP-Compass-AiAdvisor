# AI Compliance Analyst — manual test plan

This is the human-readable companion to `test/run-stress-test.js`. Both files
share the same 150 scenarios (`test/scenarios.js`) and the same ground truth —
the real provision text in `kb.js` — so a verdict or citation that fails one
should fail the other.

Per-notice breakdown (150 total): Notices 1, 5, 6 — 10 scenarios each (lower
transaction volume); Notices 2 and 7 — 30 scenarios each; Notices 3 and 4 —
27 and 33 respectively (a citation-grounding fix moved 3 scenarios from
Notice 3 to Notice 4, since their cited authority was actually Notice 4's
FAQ Q7).

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

### n1-05 — Resident unwinding a Forward Basis contract whose Firm Commitment was a Portfolio Investment

| Field | Value |
|---|---|
| WHO | Resident asset management company |
| WHAT | Attempting to unwind a Forward Basis transaction with a Licensed Onshore Bank where the underlying Firm Commitment is a Portfolio Investment (tradable equity holding below 10%) |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para1

**Rationale:** Part A, Para 1(2): a Resident may unwind a Forward Basis transaction with any LOB EXCEPT where the Firm Commitment is a Portfolio Investment — that specific unwind is excluded.

---

### n1-06 — Registered Resident Institutional Investor unwinding a Dynamic Hedging forward

| Field | Value |
|---|---|
| WHO | Resident Institutional Investor, registered under the Dynamic Hedging Framework |
| WHAT | Unwinding a plain vanilla forward contract entered under the Dynamic Hedging Framework, with a Licensed Onshore Bank |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2(2): a registered Resident Institutional Investor may unwind its Para 2(1) Dynamic Hedging forward contract with any LOB.

---

### n1-07 — Spot FX deal with a Licensed Money Changer, within MSBA scope

| Field | Value |
|---|---|
| WHO | Resident individual traveller |
| WHAT | Buying USD against Ringgit on a spot basis with a Licensed Money Changer in accordance with the MSBA |
| AMOUNT | USD 3,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para14

**Rationale:** Part C, Para 14: a Resident or Non-Resident may buy/sell FCY against Ringgit on Spot Basis with a Licensed Money Changer per the MSBA.

---

### n1-08 — Resident Entity transacting FX on behalf of a Group entity that is a Financial Institution

| Field | Value |
|---|---|
| WHO | Resident Entity (treasury centre) acting for a Group entity that is itself a licensed bank |
| WHAT | Buying Foreign Currency against Ringgit with a LOB on behalf of a Group entity that is a Financial Institution |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para3

**Rationale:** Part A, Para 3 only permits a Resident Entity to transact FX on behalf of a Group Principal that is NOT a Financial Institution or NRFI — here the Principal is a Financial Institution, so the exemption does not apply.

---

### n1-09 — Non-Resident Institutional Investor exceeding the Dynamic Hedging buy-side threshold

| Field | Value |
|---|---|
| WHO | Non-Resident Institutional Investor, registered under the Dynamic Hedging Framework |
| WHAT | Buying FCY against Ringgit forward contracts amounting to 40% of its Ringgit-denominated asset exposure (which only permits up to 25% on the buy side) |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para7

**Rationale:** Part B, Para 7: a registered Non-Resident Institutional Investor may buy FCY against Ringgit up to only 25% of its Ringgit-asset exposure (selling is capped at 100%) — 40% exceeds the buy-side limit.

---

### n1-10 — Importing gold bars into Malaysia

| Field | Value |
|---|---|
| WHO | Resident bullion trading company |
| WHAT | Importing gold bars into Malaysia for resale |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para16

**Rationale:** Part D, Para 16(b): a person is allowed to import gold or other precious metals.

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

### n2-06 — Individual Ringgit borrowing from employer in Malaysia

| Field | Value |
|---|---|
| WHO | Resident individual employee |
| WHAT | Borrowing RM3 million in Ringgit from his employer in Malaysia for use in Malaysia, per the employment contract terms |
| AMOUNT | RM 3,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1

**Must NOT mention:** RM1 million

**Rationale:** Part A, Para 1(b): Ringgit borrowing from an employer in Malaysia for use in Malaysia is unlimited, subject to employment contract terms.

---

### n2-07 — Boundary: individual Ringgit borrowing exactly at the RM1M cap

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Borrowing exactly RM1,000,000 in aggregate in Ringgit from a Non-Resident friend (not immediate family, not employer, not NRFI) |
| AMOUNT | RM 1,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2 allows up to RM1 million in aggregate — exactly RM1,000,000 is within (not exceeding) that cap.

---

### n2-08 — Individual FCY borrowing from immediate family member, unlimited

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Borrowing USD5 million equivalent in Foreign Currency from his Immediate Family Member (brother) |
| AMOUNT | USD 5,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para3

**Must NOT mention:** RM10 million

**Rationale:** Part A, Para 3: FCY borrowing from an Immediate Family Member is unlimited — the RM10 million cap (Para 4) does not apply.

---

### n2-09 — Individual FCY borrowing from a LOB, within RM10M cap

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Borrowing RM8 million equivalent in Foreign Currency from a Licensed Onshore Bank |
| AMOUNT | RM 8,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para4

**Rationale:** Part A, Para 4: a Resident Individual may borrow up to RM10 million equivalent in aggregate in FCY from a LOB or Non-Resident — RM8 million is within that cap.

---

### n2-10 — Individual FCY borrowing from a Non-Resident, exceeding RM10M cap

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Borrowing USD15 million equivalent in Foreign Currency from a Non-Resident business partner (not family, not a LOB) |
| AMOUNT | USD 15,000,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para4

**Rationale:** Part A, Para 4 caps FCY borrowing by a Resident Individual at RM10 million equivalent in aggregate — USD15 million equivalent exceeds it.

---

### n2-11 — Individual refinancing existing approved Ringgit borrowing

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Refinancing the outstanding principal and accrued interest of a previously-approved RM1 million Ringgit borrowing from a Non-Resident friend, on the same terms |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part A, Para 5: a Resident Individual may refinance outstanding approved Borrowing under paragraphs 1 to 4, subject to compliance with the respective paragraph.

---

### n2-12 — Entity Ringgit borrowing from a Non-Resident Direct Shareholder for Real Sector Activity

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing RM50 million in Ringgit from its Non-Resident Direct Shareholder to finance a manufacturing plant expansion (Real Sector Activity) in Malaysia |
| AMOUNT | RM 50,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para6

**Must NOT mention:** RM1 million

**Rationale:** Part B, Para 6: Ringgit borrowing from a Non-Resident within the Group (including a Direct Shareholder) to finance Real Sector Activity in Malaysia is unlimited.

---

### n2-13 — Entity Ringgit borrowing via non-tradable Corporate Bond issued to an out-of-Group Non-Resident

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Issuing a non-tradable Ringgit-denominated Corporate Bond to a Non-Resident Entity outside its Group (not a NRFI exemption) |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para7

**Rationale:** Part B, Para 7 excludes a non-tradable Ringgit Corporate Bond or Sukuk issued to a Non-Resident Entity outside the Resident Entity's Group (or a NRFI) from the general permission.

---

### n2-14 — Entity Ringgit borrowing from an external Non-Resident, within RM1M cap

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing RM900,000 in Ringgit for use in Malaysia from a Non-Resident company outside its Group, excluding a NRFI |
| AMOUNT | RM 900,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para8

**Rationale:** Part B, Para 8(a): a Resident Entity may borrow up to RM1 million in aggregate in Ringgit for use in Malaysia from a Non-Resident excluding a NRFI — RM900,000 is within that cap.

---

### n2-15 — Entity Ringgit borrowing from a Multilateral Development Bank, unlimited

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing RM200 million in Ringgit for use in Malaysia from a Multilateral Development Bank |
| AMOUNT | RM 200,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para8

**Must NOT mention:** RM1 million

**Rationale:** Part B, Para 8(b): Ringgit borrowing in any amount from a Multilateral Development Bank or Qualified Development Financial Institution is unlimited.

---

### n2-16 — Entity FCY borrowing from an Entity within its Group, unlimited

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing USD60 million equivalent in Foreign Currency from a sister company within its Group (not a NRFI, not a SPV) |
| AMOUNT | USD 60,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para9

**Must NOT mention:** RM100 million

**Rationale:** Part B, Para 9(b): FCY borrowing in any amount from an Entity within the Resident Entity's Group is unlimited (excluding a NRFI or out-of-Group SPV, which fall under the Para 10 cap instead).

---

### n2-17 — Boundary: entity FCY borrowing exactly at the RM100M cap from an unrelated Non-Resident

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing exactly RM100 million equivalent in aggregate in Foreign Currency from a Non-Resident outside its Group |
| AMOUNT | RM 100,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para10

**Rationale:** Part B, Para 10 caps FCY borrowing from outside the Group at RM100 million equivalent in aggregate — exactly RM100 million is within (not exceeding) that cap.

---

### n2-18 — Entity FCY borrowing from a NRFI, exceeding RM100M cap

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Borrowing RM150 million equivalent in Foreign Currency from a Non-Resident Financial Institution (NRFI) |
| AMOUNT | RM 150,000,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para10

**Rationale:** Part B, Para 10(b) caps FCY borrowing from a NRFI at RM100 million equivalent in aggregate on a group basis — RM150 million exceeds it.

---

### n2-19 — Entity refinancing outstanding approved FCY borrowing

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Refinancing the outstanding principal and accrued profit of a previously-approved FCY borrowing from a LOB, subject to compliance with the original paragraph requirements |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para11

**Rationale:** Part B, Para 11: a Resident Entity may refinance outstanding approved Borrowing under paragraphs 6 to 10, subject to compliance with the respective paragraph.

---

### n2-20 — Debt swap: Ringgit debt into FCY debt with a LOB, FCY delivered for FCY-asset investment

| Field | Value |
|---|---|
| WHO | Resident company with Domestic Ringgit Borrowing |
| WHAT | Swapping its existing Ringgit debt into Foreign Currency debt with a Licensed Onshore Bank, with FCY delivered at inception that is then used to invest in a Foreign Currency Asset |

**Expect:** verdict in `[CONDITIONAL]`

**Expect citation to reference:** para12

**Rationale:** Part C, Para 12: swapping Ringgit debt into FCY debt with a LOB is treated as FCY Borrowing, but any FCY delivered at inception and used for FCY Asset investment must comply with Notice 3 for a Resident with DRB.

---

### n2-21 — Non-Resident individual borrowing Ringgit from Resident employer in Malaysia

| Field | Value |
|---|---|
| WHO | Non-Resident individual employee |
| WHAT | Borrowing RM500,000 in Ringgit from his employer in Malaysia for use in Malaysia |
| AMOUNT | RM 500,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para13

**Rationale:** Part D, Para 13(c): a Non-Resident Individual may borrow Ringgit in any amount from an employer in Malaysia for use in Malaysia.

---

### n2-22 — Non-Resident borrowing Ringgit from a Resident for Real Sector Activity

| Field | Value |
|---|---|
| WHO | Non-Resident company (not a NRFI) |
| WHAT | Borrowing RM40 million in Ringgit from a Resident lender to finance Real Sector Activity (a manufacturing facility) in Malaysia |
| AMOUNT | RM 40,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para14

**Rationale:** Part D, Para 14(a): a Non-Resident excluding a NRFI may borrow Ringgit in any amount from a Resident to finance Real Sector Activity in Malaysia.

---

### n2-23 — Non-Resident borrowing Ringgit from a Resident stockbroker for margin financing

| Field | Value |
|---|---|
| WHO | Non-Resident investor |
| WHAT | Obtaining Ringgit margin financing from a Resident stockbroking company to purchase Bursa Malaysia-listed shares |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para14

**Rationale:** Part D, Para 14(b): a Non-Resident may borrow Ringgit from a Resident stockbroker for margin financing on Bursa Malaysia.

---

### n2-24 — Non-Resident overdraft from a LOB exceeding the 2-business-day limit

| Field | Value |
|---|---|
| WHO | Non-Resident custodian bank |
| WHAT | Maintaining a Ringgit overdraft facility with a LOB for 5 business days to avoid a Bursa Malaysia settlement failure, with no roll-over requested |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para16

**Rationale:** Part D, Para 16(b) permits such an overdraft only up to a maximum of 2 business days with no roll-over — 5 business days exceeds the permitted window.

---

### n2-25 — Non-Resident repo borrowing from a LOB, within RM10M cap

| Field | Value |
|---|---|
| WHO | Non-Resident investor |
| WHAT | Borrowing RM7 million in Ringgit from a LOB via a repurchase agreement |
| AMOUNT | RM 7,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para16

**Rationale:** Part D, Para 16(c): a Non-Resident may borrow up to RM10 million via a repurchase or sale-buy-back agreement with a LOB — RM7 million is within that cap.

---

### n2-26 — Non-Resident FCY borrowing from a Resident, beyond Notice 3 limits

| Field | Value |
|---|---|
| WHO | Non-Resident company |
| WHAT | Borrowing RM60 million equivalent in Foreign Currency from a Resident entity that itself has Domestic Ringgit Borrowing and is subject to the RM50 million annual Notice 3 investment cap |
| AMOUNT | RM 60,000,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para17

**Rationale:** Part D, Para 17(b): FCY borrowing by a Non-Resident from a Resident (other than a LOB or Immediate Family Member) is capped at the limits set out in Notice 3 Parts A/B — RM60 million exceeds the lending Resident's RM50 million annual cap.

---

### n2-27 — LOB obtaining a Financial Guarantee for its own account, any amount

| Field | Value |
|---|---|
| WHO | Licensed Onshore Bank |
| WHAT | Obtaining a Financial Guarantee of RM500 million in Ringgit for its own account from a Non-Resident bank |
| AMOUNT | RM 500,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para20

**Rationale:** Part G, Para 20(a): a LOB may obtain a Financial Guarantee in any amount in Ringgit or FCY for its own account.

---

### n2-28 — Non-bank Resident guarantor giving a Financial Guarantee for a Non-Resident SPV borrowing, ultimately utilised by the guarantor

| Field | Value |
|---|---|
| WHO | Resident company (non-bank guarantor) |
| WHAT | Giving a Financial Guarantee to secure FCY borrowing obtained by a Non-Resident SPV, where the borrowing proceeds are ultimately utilised by the Resident guarantor itself |

**Expect:** verdict in `[CONDITIONAL, REQUIRES_APPROVAL]`

**Expect citation to reference:** para22

**Rationale:** Part G, Para 22(a): where the underlying Borrowing secured by the Financial Guarantee is ultimately utilised by the Resident guarantor, it is deemed Borrowing by the Resident guarantor, subject to the Notice 2 external borrowing limits.

---

### n2-29 — Resident giving a Non-Financial Guarantee (performance bond) to a Non-Resident, any amount

| Field | Value |
|---|---|
| WHO | Resident construction company |
| WHAT | Giving a performance bond (Non-Financial Guarantee) of USD20 million to a Non-Resident project owner to secure supply of construction services |
| AMOUNT | USD 20,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para25

**Rationale:** Part G, Para 25: a Resident may give a Non-Financial Guarantee (e.g. a performance bond) in any amount in FCY or Ringgit to a Non-Resident.

---

### n2-30 — Payment to a Non-Resident lender under a called-up Non-Financial Guarantee, paid in Ringgit

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Paying a Non-Resident lender in Ringgit, instead of Foreign Currency, after its Non-Financial Guarantee is called upon (the guarantee was not issued for use in Malaysia) |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para26

**Rationale:** Part G, Para 26: payment to a Non-Resident under a Non-Financial Guarantee must be made in Foreign Currency, UNLESS the guarantee was for use in Malaysia (in which case Ringgit or FCY is allowed) — here it was not for use in Malaysia, so Ringgit payment is not permitted.

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

### n3-07 — Boundary: individual WITH DRB converting exactly RM1,000,000 — at the cap

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing (two outstanding vehicle loans) |
| WHAT | Converting exactly RM1,000,000 from Ringgit to invest in foreign-listed stocks this calendar year, with no other FC asset investment so far this year |
| AMOUNT | RM 1,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2(c): a Resident Individual with DRB may convert up to RM1 million equivalent per calendar year — exactly RM1,000,000 is within (not exceeding) that cap.

---

### n3-08 — Boundary: individual WITH DRB converting RM1,000,001 — RM1 over the cap

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing (two outstanding housing loans) |
| WHAT | Converting RM1,000,001 from Ringgit to invest in a foreign currency fixed deposit this calendar year, with no other FC asset investment so far this year |
| AMOUNT | RM 1,000,001 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2(c): the RM1 million per calendar year cap for a Resident Individual with DRB is exceeded by RM1, however marginal — the conversion is not permitted without approval.

---

### n3-09 — Individual with DRB using offshore FCY funds (not from conversion) for unlimited investment

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing (three outstanding vehicle loans) |
| WHAT | Investing RM8 million equivalent in foreign-listed stocks using Foreign Currency funds already held outside Malaysia (not Export of Goods proceeds, not from Ringgit conversion) |
| AMOUNT | RM 8,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Must NOT mention:** RM1 million

**Rationale:** Part A, Para 2(a): a Resident Individual with DRB may invest any amount using FCY funds from outside Malaysia (excluding Export of Goods proceeds) — the RM1 million cap (2(c)) only applies to Ringgit-conversion-sourced investment.

---

### n3-10 — Individual with DRB buying real estate abroad for own accommodation while studying

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing (two outstanding housing loans), studying abroad |
| WHAT | Purchasing real estate outside Malaysia for his own accommodation while pursuing full-time education abroad, with documentary evidence of enrolment |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Must NOT mention:** RM1 million

**Rationale:** Part A, Para 2(b): real estate abroad for own/immediate-family accommodation for education, employment or migration purposes is unlimited — the RM1 million conversion cap does not apply.

---

### n3-11 — Individual with DRB buying real estate abroad for a non-family friend

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing (two outstanding vehicle loans) |
| WHAT | Purchasing real estate outside Malaysia for the accommodation of a close friend (not an Immediate Family Member) who is migrating abroad |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** q5

**Rationale:** Notice 3 FAQ Q5: a Resident individual may only purchase property abroad for their own account or Immediate Family Members under the permitted purposes — a non-family friend does not qualify.

---

### n3-12 — Entity with DRB converting Ringgit, within RM50M/year cap

| Field | Value |
|---|---|
| WHO | Resident company with Domestic Ringgit Borrowing |
| WHAT | Converting RM35 million from Ringgit this calendar year to invest in foreign-listed equities for non-DIA purposes |
| AMOUNT | RM 35,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para4

**Rationale:** Part B, Para 4(c): a Resident Entity with DRB may convert up to RM50 million equivalent per calendar year for non-DIA purposes — RM35 million is within that cap.

---

### n3-13 — Boundary: entity with DRB converting exactly RM50,000,000 — at the cap

| Field | Value |
|---|---|
| WHO | Resident company with Domestic Ringgit Borrowing |
| WHAT | Converting exactly RM50,000,000 from Ringgit this calendar year for non-DIA foreign currency asset investment, with no other conversion so far this year |
| AMOUNT | RM 50,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para4

**Rationale:** Part B, Para 4(c): the RM50 million per calendar year cap is exactly met, not exceeded, so the conversion remains permitted.

---

### n3-14 — Boundary: entity with DRB converting RM50,000,001 — RM1 over the cap

| Field | Value |
|---|---|
| WHO | Resident company with Domestic Ringgit Borrowing |
| WHAT | Converting RM50,000,001 from Ringgit this calendar year for non-DIA foreign currency asset investment, with no other conversion so far this year |
| AMOUNT | RM 50,000,001 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para4

**Rationale:** Part B, Para 4(c): the RM50 million per calendar year cap is exceeded by RM1, so only the amount exceeding the cap requires prior BNM approval (per FAQ Q17) — without approval the excess is not permitted.

---

### n3-15 — Entity with DRB exceeding the RM50M cap — partial approval pathway

| Field | Value |
|---|---|
| WHO | Resident company with Domestic Ringgit Borrowing |
| WHAT | Converting RM65 million from Ringgit this calendar year for non-DIA investment in foreign currency assets |
| AMOUNT | RM 65,000,000 |

**Expect:** verdict in `[REQUIRES_APPROVAL, NOT_PERMITTED]`

**Expect citation to reference:** q17

**Rationale:** Notice 3 FAQ Q17: only the amount exceeding the RM50 million annual aggregate limit requires prior BNM approval — RM65 million exceeds the cap by RM15 million, which needs approval.

---

### n3-16 — Entity without DRB, unlimited offshore investment

| Field | Value |
|---|---|
| WHO | Resident company with no Domestic Ringgit Borrowing of any kind |
| WHAT | Converting RM200 million from Ringgit to invest in a portfolio of foreign-listed bonds |
| AMOUNT | RM 200,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para3

**Must NOT mention:** RM50 million

**Rationale:** Part B, Para 3: a Resident Entity without DRB may invest in FCY Asset up to any amount.

---

### n3-17 — LOB investing in FCY Asset for its own account, unlimited

| Field | Value |
|---|---|
| WHO | Licensed Onshore Bank |
| WHAT | Investing RM500 million equivalent in Foreign Currency Asset for its own proprietary trading account |
| AMOUNT | RM 500,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part C, Para 5: a LOB may invest in Foreign Currency Asset up to any amount for its own account.

---

### n3-18 — SC-licensed fund manager investing FCY Asset onshore on behalf of clients, unlimited

| Field | Value |
|---|---|
| WHO | Resident Entity licensed by the Securities Commission Malaysia for fund management |
| WHAT | Investing RM300 million in Foreign Currency Asset onshore on behalf of its Resident clients |
| AMOUNT | RM 300,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para6

**Rationale:** Part C, Para 6: a SC-licensed Entity may invest in Foreign Currency Asset ONSHORE on behalf of its clients up to ANY amount.

---

### n3-19 — Licensed insurer investing offshore for a Resident client WITH DRB, exceeding the 50% NAV limit

| Field | Value |
|---|---|
| WHO | Licensed insurer |
| WHAT | Investing 70% of the NAV of an investment-linked fund offshore on behalf of a Resident client with DRB, where none of paragraphs 2(a), 2(c)(i)-(ii), 4(a) or 4(c)(i)-(iii) can be ascertained to apply |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para7

**Rationale:** Part C, Para 7-8(b): a licensed insurer may invest offshore on behalf of a Resident client WITH DRB up to only 50% of the NAV (aggregated at insurer level) unless the higher exception paragraphs apply — 70% exceeds the 50% limit here.

---

### n3-20 — Licensed insurer investing offshore for a Non-Resident client, unlimited

| Field | Value |
|---|---|
| WHO | Licensed insurer |
| WHAT | Investing 100% of the NAV of an investment-linked fund offshore on behalf of a Non-Resident client |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para7

**Rationale:** Part C, Para 7-8(a): a licensed insurer may invest offshore on behalf of a client who is a Non-Resident up to the full NAV of the fund.

---

### n3-21 — SC-licensed fund manager investing offshore for a Resident client WITH DRB, within 50% NAV limit

| Field | Value |
|---|---|
| WHO | Resident Entity licensed by SC Malaysia for fund management |
| WHAT | Investing 45% of the total funds offshore in conventional (non-Shariah) FCY assets on behalf of a Resident client with DRB |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para9

**Rationale:** Part C, Para 9-10: a SC-licensed fund manager may invest offshore on behalf of a Resident client WITH DRB up to 50% of the total funds (aggregated at the Resident Entity's level) — 45% is within that limit.

---

### n3-24 — DRB combination edge case: one vehicle loan plus a sundry-expense credit card facility — still WITHOUT DRB

| Field | Value |
|---|---|
| WHO | Resident individual with exactly ONE outstanding vehicle loan and a credit card facility used solely for sundry office expenses, no other Ringgit borrowing |
| WHAT | Converting RM3 million from Ringgit to invest in a foreign currency fixed deposit |
| AMOUNT | RM 3,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1

**Must NOT mention:** RM1 million

**Rationale:** Notice 3 FAQ Q15 (entity DRB logic, applying the same sundry-expense exclusion via the DRB definition) and the DRB glossary: one vehicle loan plus a credit/financing facility used solely for sundry expenses does not constitute DRB — this Resident remains WITHOUT DRB under Part A, Para 1 (UNLIMITED).

---

### n3-25 — DRB combination edge case: TWO vehicle loans (no housing loan) triggers DRB

| Field | Value |
|---|---|
| WHO | Resident individual with exactly TWO outstanding vehicle loans and no other Ringgit borrowing |
| WHAT | Converting RM4 million from Ringgit to invest in foreign-listed stocks |
| AMOUNT | RM 4,000,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para2

**Rationale:** Notice 3 FAQ Q3: having more than one (1) vehicle loan means the Resident individual is deemed to have DRB — this triggers the RM1 million/year cap (Para 2(c)), which RM4 million exceeds.

---

### n3-26 — Resident entity deemed to have DRB via its parent-subsidiary Resident Group

| Field | Value |
|---|---|
| WHO | Resident subsidiary company with NO Ringgit borrowing of its own, but whose Resident parent (same parent-subsidiary Group) has Domestic Ringgit Borrowing |
| WHAT | Converting RM60 million from Ringgit this calendar year to invest in foreign currency assets |
| AMOUNT | RM 60,000,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** q15

**Rationale:** Notice 3 FAQ Q15: a Resident entity is deemed to have DRB when another Resident entity with which it has a parent-subsidiary relationship has DRB — the RM50 million/year aggregate cap therefore applies across the Group, and RM60 million exceeds it.

---

### n3-27 — Resident entity borrowing from its Resident Direct Shareholder — excluded from DRB

| Field | Value |
|---|---|
| WHO | Resident company that has borrowed Ringgit solely from its Resident Direct Shareholder, and has no other Ringgit borrowing |
| WHAT | Converting RM30 million from Ringgit to invest in foreign-listed equities |
| AMOUNT | RM 30,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q15

**Must NOT mention:** RM50 million

**Rationale:** Notice 3 FAQ Q15(a): borrowing obtained from a Resident Direct Shareholder or another Resident entity with a parent-subsidiary relationship is NOT considered DRB — this Resident remains WITHOUT DRB and unlimited under Part B, Para 3.

---

### n3-28 — Resident with DRB transferring digital assets from a registered DAX to an offshore wallet, within RM1M cap

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing (two outstanding housing loans) |
| WHAT | Transferring RM700,000 worth of digital assets from a registered Malaysian digital asset exchange (DAX) to an offshore digital wallet |
| AMOUNT | RM 700,000 |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** q9

**Rationale:** Notice 3 FAQ Q9: transferring digital assets from a registered DAX to an offshore wallet is subject to the investment in FC asset limit for a Resident with DRB — RM700,000 is within the RM1 million annual cap.

---

### n3-29 — Resident purchasing digital assets on a registered DAX settled in Ringgit, no investment limit

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing |
| WHAT | Purchasing RM2 million worth of digital assets on a registered Malaysian digital asset exchange (DAX), settled entirely in Ringgit with no transfer offshore |
| AMOUNT | RM 2,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q8

**Must NOT mention:** RM1 million

**Rationale:** Notice 3 FAQ Q8: a Resident is free to purchase digital assets on a registered DAX in Malaysia without any investment limit, as long as it is settled in Ringgit.

---

### n3-30 — Resident individual with DRB investing in a non-exchange-rate derivative via margin account, near the cap

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing (two outstanding vehicle loans) |
| WHAT | Remitting RM950,000 this calendar year to a margin account with a Non-Resident futures broker to trade equity options (a non-exchange-rate derivative), with no other FC asset investment so far this year |
| AMOUNT | RM 950,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q13

**Rationale:** Notice 3 FAQ Q13: the investment amount for non-exchange-rate derivatives is computed on total remittance to the margin account, subject to the RM1 million annual aggregate limit — RM950,000 is within that cap.

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

### n4-05 — Non-Resident individual Ringgit payment to a Resident Immediate Family Member

| Field | Value |
|---|---|
| WHO | Non-Resident individual |
| WHAT | Paying RM200,000 in Ringgit to his Resident sister (Immediate Family Member) in Malaysia for any purpose |
| AMOUNT | RM 200,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q1

**Rationale:** Notice 4 "Payment in Ringgit by Non-Resident" FAQ Q1: a Non-Resident individual may pay a Resident Immediate Family Member in Ringgit or FCY for any purpose.

---

### n4-06 — Non-Resident receiving Ringgit payment without an External Account

| Field | Value |
|---|---|
| WHO | Non-Resident company |
| WHAT | Attempting to receive a Ringgit payment from a Resident counterparty without maintaining an External Account |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** q2

**Rationale:** Notice 4 "Payment in Ringgit by Non-Resident" FAQ Q2: a Non-Resident must maintain an External Account to receive a Ringgit payment — without one, the receipt is not permitted.

---

### n4-07 — Non-Resident transferring funds between two of its own External Accounts

| Field | Value |
|---|---|
| WHO | Non-Resident individual |
| WHAT | Transferring RM500,000 in Ringgit from his External Account at one LOB to another External Account he holds at a different LOB |
| AMOUNT | RM 500,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q3

**Rationale:** Notice 4 "Payment in Ringgit by Non-Resident" FAQ Q3: a Non-Resident may transfer Ringgit between his own multiple External Accounts.

---

### n4-08 — Resident Entity paying another Resident in FCY for education abroad of an employee's child

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Paying a Resident education agent in Foreign Currency on behalf of an employee, for the employee's child's education abroad |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para4

**Rationale:** Part C, Para 4: FCY payment between Residents is permitted for purposes including education abroad of an Immediate Family Member.

---

### n4-09 — Resident paying another Resident in FCY for a Global Supply Chain pass-through obligation

| Field | Value |
|---|---|
| WHO | Resident manufacturing company |
| WHAT | Paying a Resident vendor in Foreign Currency for goods supplied as part of a Global Supply Chain arrangement, where the vendor itself has a FCY obligation to an upstream Non-Resident supplier |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para4

**Rationale:** Part C, Para 4 and footnote 2: a Resident may pay another Resident in FCY for Global Supply Chain pass-through payments where genuine upstream FCY obligations exist.

---

### n4-10 — Resident paying a Resident vendor in FCY purely on preference, no FC obligation and locally-sourced goods

| Field | Value |
|---|---|
| WHO | Resident retail company |
| WHAT | Paying a Resident vendor in US Dollars for locally-sourced goods, where the vendor has no Foreign Currency obligations of its own and the goods are not part of any cross-border supply chain |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** q11

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q11: where there are no underlying FC obligations and the goods are locally sourced, this does not qualify as Global Supply Chain — payment must be made in Ringgit.

---

### n4-11 — Resident converting Ringgit to FCY specifically to pay under a Global Supply Chain arrangement

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Converting Ringgit to US Dollars in order to make a payment to a Resident vendor under a Global Supply Chain arrangement |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** q10

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q10: a Resident cannot convert Ringgit to FCY to pay under Global Supply Chain — the FCY must come from a Trade FCA or FCY trade financing facility.

---

### n4-12 — Resident paying for ancillary services in FCY where genuine FC obligations and FC proceeds exist

| Field | Value |
|---|---|
| WHO | Resident logistics company |
| WHAT | Paying a Resident freight forwarder in Foreign Currency for ancillary logistics services, where the Resident company has genuine FC obligations abroad and holds FC proceeds from exports |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q12

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q12: FCY settlement for ancillary services is allowed where FC obligations exist abroad and the payer has FC proceeds available.

---

### n4-13 — Resident hedging a commodity exposure directly with a Non-Resident counterparty, within underlying exposure

| Field | Value |
|---|---|
| WHO | Resident commodity trading company |
| WHAT | Entering a commodity derivative directly with a Non-Resident counterparty to hedge crude palm oil exposure, with the notional amount matching its underlying physical exposure |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q14

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q14: a Resident may hedge commodity exposure via a Resident futures broker or directly with a Non-Resident counterparty, up to the underlying exposure.

---

### n4-14 — Resident entity entering an FX contract directly with a Non-Resident counterparty

| Field | Value |
|---|---|
| WHO | Resident trading company |
| WHAT | Entering a foreign exchange forward contract directly with a Non-Resident bank counterparty, bypassing any Licensed Onshore Bank or licensed money changer |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** q16

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q16: a Resident entity cannot enter an FX contract directly with a Non-Resident counterparty — it must transact via a LOB or licensed money changer (per Notice 1).

---

### n4-15 — NRFI making a Ringgit payment on behalf of a customer under remittance business licence

| Field | Value |
|---|---|
| WHO | Non-Resident Financial Institution licensed for remittance business |
| WHAT | Making a Ringgit payment in Malaysia on behalf of its remittance customer, under its remittance business licence |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para7

**Rationale:** Part D, Para 7: a person licensed for remittance business may make or receive a payment on behalf of its customers in the ordinary course of that licensed business.

---

### n4-16 — NR Intermediary providing Ringgit financing to its NR client for Ringgit Asset purchase

| Field | Value |
|---|---|
| WHO | Non-Resident Intermediary (custodian) |
| WHAT | Extending Ringgit financing to its Non-Resident client to fund the client's purchase of Ringgit-denominated securities |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para12

**Rationale:** Part F, Para 12: a NR Intermediary or NRFI is prohibited from providing Ringgit financing to its clients.

---

### n4-17 — NRFI making Ringgit payment for NR client trade settlement via External Account

| Field | Value |
|---|---|
| WHO | Non-Resident Financial Institution |
| WHAT | Making a Ringgit payment via its External Account to settle a Ringgit Asset trade on behalf of its Non-Resident client |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para10

**Rationale:** Part F, Para 10: a NRFI may make Ringgit payments for the purpose of settling its NR client's trade, via the External Account.

---

### n4-18 — Resident individual maintaining a Foreign Currency Account jointly with a LOB

| Field | Value |
|---|---|
| WHO | Resident individual |
| WHAT | Opening and maintaining a Foreign Currency Account jointly with his spouse, with a Licensed Onshore Bank |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para14

**Rationale:** Part F, Para 14: a Resident Individual may maintain a FCA with a LOB or NRFI, solely or jointly — but per footnote 5, if a joint accountholder has DRB, Notice 3 Part A applies to the joint funding.

---

### n4-19 — Resident individual with DRB transferring FC funds between his own two FCAs

| Field | Value |
|---|---|
| WHO | Resident individual with Domestic Ringgit Borrowing |
| WHAT | Transferring Foreign Currency funds from one of his own Foreign Currency Accounts to another of his own Foreign Currency Accounts |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para15

**Rationale:** Part F, Para 15: a Resident Individual may transfer FC funds between his own FCAs, subject to Notice 3 Part A where relevant (e.g. if the funds originated from Ringgit conversion and DRB applies).

---

### n4-20 — Resident Entity maintaining a Foreign Currency Account, subject to Notice 3

| Field | Value |
|---|---|
| WHO | Resident company with Domestic Ringgit Borrowing |
| WHAT | Maintaining a Foreign Currency Account funded via Ringgit conversion exceeding the RM50 million annual cap, without BNM approval |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para16

**Rationale:** Part F, Para 16: a Resident Entity's FCA is subject to Notice 3 Part B — funding it via Ringgit conversion beyond the RM50 million/year cap for an Entity with DRB is not permitted without approval.

---

### n4-21 — Resident Intermediary failing to segregate Resident and Non-Resident client funds in its FCA

| Field | Value |
|---|---|
| WHO | Resident Intermediary (custodian/broker) |
| WHAT | Commingling Resident and Non-Resident client funds within a single Foreign Currency Account, with no segregation |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para17

**Rationale:** Part F, Para 17: a Resident Intermediary must segregate Resident and Non-Resident client funds within its FCA — commingling is not permitted.

---

### n4-22 — Non-Resident maintaining a Foreign Currency Account in Malaysia

| Field | Value |
|---|---|
| WHO | Non-Resident individual |
| WHAT | Opening and maintaining a Foreign Currency Account with a Licensed Onshore Bank in Malaysia |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para18

**Rationale:** Part F, Para 18: a Non-Resident may maintain a Foreign Currency Account in Malaysia.

---

### n4-23 — NR Intermediary custodian Ringgit payment for settlement of a Ringgit Asset, on behalf of NR client

| Field | Value |
|---|---|
| WHO | Non-Resident Intermediary acting as custodian |
| WHAT | Making a Ringgit payment to settle the purchase of a Ringgit-denominated bond on behalf of its Non-Resident client |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para11

**Rationale:** Part F, Para 11: a NR Intermediary or NRFI acting as custodian may make Ringgit payments for the settlement of Ringgit Asset transactions on behalf of NR clients.

---

### n4-24 — NR Intermediary custodian failing Appendix compliance requirements

| Field | Value |
|---|---|
| WHO | Non-Resident Intermediary acting as custodian |
| WHAT | Making Ringgit payments for client trade settlement without complying with the recordkeeping and reporting requirements set out in the relevant Appendix |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** para13

**Rationale:** Part F, Para 13: a NR Intermediary or NRFI custodian must comply with the Appendix requirements — failing to do so means the payment activity is not properly permitted.

---

### n4-25 — External Account payment made without documentary evidence of FEP compliance

| Field | Value |
|---|---|
| WHO | Non-Resident individual |
| WHAT | Making a payment from his External Account without providing the LOB any documentary evidence that the underlying transaction complies with the FEP Notices |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para9

**Rationale:** Part F, Para 9 and footnote 4: payments from an External Account require documentary evidence of compliance with the FEP Notices — without it, the payment should not proceed.

---

### n4-26 — Resident entering a Ringgit-referenced derivative with a Non-Resident without Notice 1 approval

| Field | Value |
|---|---|
| WHO | Resident company |
| WHAT | Entering a derivative contract with a Non-Resident counterparty that is referenced to the Ringgit exchange rate, without any approval or registration under Notice 1 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part C, Para 5(b): FCY payment to/from a Non-Resident is excluded where it relates to a Ringgit-referenced derivative, unless approved — no approval exists here.

---

### n4-27 — Non-Resident entering an Exchange Rate Derivative without Notice 1 approval

| Field | Value |
|---|---|
| WHO | Non-Resident hedge fund |
| WHAT | Entering an Exchange Rate Derivative transaction and making an FCY payment in connection with it, without being registered or approved under Notice 1 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part C, Para 5(c): FCY payment to/from a Non-Resident is excluded where it relates to an Exchange Rate Derivative by that Non-Resident, unless approved under Notice 1 — no such approval exists here.

---

### n4-28 — Two Non-Residents making an FCY payment between each other, any purpose

| Field | Value |
|---|---|
| WHO | Two Non-Resident companies |
| WHAT | Making a Foreign Currency payment of USD2 million between each other, for the purchase of equipment located overseas |
| AMOUNT | USD 2,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para6

**Rationale:** Part C, Para 6: a Non-Resident may pay another Non-Resident in FCY for any purpose.

---

### n4-29 — Resident individual receiving a misc-expense reimbursement abroad from a friend

| Field | Value |
|---|---|
| WHO | Resident individual travelling abroad |
| WHAT | Receiving a Foreign Currency reimbursement of miscellaneous travel expenses from a friend who is also a Resident, while both are temporarily overseas |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q2

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q2: a Resident may receive an FCY advance or reimbursement of miscellaneous expenses from another Resident while abroad.

---

### n4-30 — Resident paying for a foreign currency unit trust subscription in the fund's base currency

| Field | Value |
|---|---|
| WHO | Resident individual investor |
| WHAT | Paying subscription monies for a Foreign Currency-denominated unit trust fund, in the fund's base currency, to a Resident fund management company |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q4

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q4: FC unit trust subscription, redemption and fee payments may be made in the fund's base currency.

---

### n4-31 — Joint investment, one party has DRB — RM2M combined cap exceeded

| Field | Value |
|---|---|
| WHO | Two Resident individuals, joint accountholders; one has DRB (two outstanding vehicle loans), the other has none |
| WHAT | Jointly converting RM2.5 million from their joint Ringgit account into a joint foreign currency fixed deposit |
| AMOUNT | RM 2,500,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** q7

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q7: DRB in any one joint party caps the WHOLE joint investment at RM1M per person / RM2M combined for two parties — RM2.5 million exceeds it.

---

### n4-32 — Joint individuals, both with DRB — RM2M combined cap, within limit

| Field | Value |
|---|---|
| WHO | Two Resident individuals, joint accountholders, BOTH of whom have Domestic Ringgit Borrowing (each has two outstanding housing loans) |
| WHAT | Jointly converting RM1.8 million from their joint Ringgit account into a joint foreign currency fixed deposit this calendar year |
| AMOUNT | RM 1,800,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q7

**Rationale:** Notice 4 "Payment in Foreign Currency by Resident" FAQ Q7: DRB in a joint party caps the WHOLE joint investment at RM2 million combined for two parties — RM1.8 million is within that combined cap.

---

### n4-33 — Boundary: joint investment with DRB, exactly at the RM2M combined cap

| Field | Value |
|---|---|
| WHO | Two Resident individuals, joint accountholders; one has DRB (two outstanding vehicle loans) |
| WHAT | Jointly converting exactly RM2,000,000 from their joint Ringgit account into a joint foreign currency fixed deposit this calendar year |
| AMOUNT | RM 2,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q7

**Rationale:** Notice 4 FAQ Q7: the combined cap for a 2-party joint investment where one party has DRB is RM2 million — exactly RM2,000,000 is within (not exceeding) that combined threshold.

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

### n5-05 — LOB issuing a Ringgit financial instrument to a Resident

| Field | Value |
|---|---|
| WHO | Licensed Onshore Bank |
| WHAT | Issuing a Ringgit-denominated structured deposit (Financial Instrument) to a Resident individual client |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para4

**Rationale:** Part B, Para 4(a): a LOB may only issue a Ringgit-denominated Financial Instrument in Malaysia to a Non-Resident, not to a Resident.

---

### n5-06 — LOB dealing in a Ringgit interest rate derivative with a Non-Resident

| Field | Value |
|---|---|
| WHO | Licensed Onshore Bank |
| WHAT | Dealing in a Ringgit-denominated interest rate derivative with a Non-Resident counterparty directly (no exchange rate feature) |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part B, Para 5: a LOB may deal in a Ringgit-denominated interest rate derivative or profit rate Islamic derivative with a Non-Resident counterparty.

---

### n5-07 — Multilateral Development Bank issuing a Ringgit debt security in Malaysia

| Field | Value |
|---|---|
| WHO | Multilateral Development Bank |
| WHAT | Issuing a Ringgit-denominated debt security in Malaysia to any investor, subject to compliance with Notice 2 |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2-3: a Multilateral Development Bank or Qualified DFI may issue a Ringgit debt security in Malaysia to any person, subject to Notice 2.

---

### n5-08 — Resident licensed insurer offering a Ringgit insurance product linked to a Financial Instrument, to a Non-Resident

| Field | Value |
|---|---|
| WHO | Resident licensed insurer |
| WHAT | Issuing an insurance product linked to a Ringgit-denominated Financial Instrument, offered to a Non-Resident |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para7

**Rationale:** Part B, Para 7: a Resident licensed insurer or takaful operator may issue or offer an insurance/takaful product linked to a Ringgit-denominated Financial Instrument to a Non-Resident.

---

### n5-09 — Licensed international Islamic bank issuing an FCY Islamic Financial Instrument

| Field | Value |
|---|---|
| WHO | Licensed international Islamic bank |
| WHAT | Issuing an Islamic Financial Instrument denominated in Foreign Currency to any person, not referenced to exchange rate |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para6

**Rationale:** Part B, Para 6: a licensed international Islamic bank may issue an FCY-denominated Islamic Financial Instrument to any person.

---

### n5-10 — Non-Resident transferring a Notice-5 security in Malaysia without checking Notice 2/3/4 compliance

| Field | Value |
|---|---|
| WHO | Non-Resident institutional investor |
| WHAT | Transferring a Ringgit-denominated security issued under Notice 5 to another Non-Resident, without regard to Notice 2, 3 or 4 compliance |

**Expect:** verdict in `[CONDITIONAL, REQUIRES_APPROVAL]`

**Expect citation to reference:** para9

**Rationale:** Part C, Para 9-10: subscription or transfer of a Notice-5 security is permitted only subject to compliance with Notices 2, 3 and 4 — it is not unconditional.

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

### n6-05 — Boundary: traveller exporting exactly RM1,000 cash

| Field | Value |
|---|---|
| WHO | Traveller (Resident) leaving Malaysia |
| WHAT | Carrying exactly RM1,000 in Ringgit currency notes out of Malaysia on departure |
| AMOUNT | RM 1,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** ringgit (export)

**Rationale:** RM1,000 is exactly at the per-trip cap on exporting Ringgit notes, which is permitted (the cap is "up to RM1,000").

---

### n6-06 — Boundary: traveller exporting RM1,001 cash

| Field | Value |
|---|---|
| WHO | Traveller (Resident) leaving Malaysia |
| WHAT | Carrying RM1,001 in Ringgit currency notes out of Malaysia on departure |
| AMOUNT | RM 1,001 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** ringgit (export)

**Rationale:** RM1,001 is RM1 above the RM1,000 per-trip cap on exporting Ringgit notes — not permitted under any circumstances.

---

### n6-07 — Boundary: traveller importing exactly RM10,000 cash, undeclared

| Field | Value |
|---|---|
| WHO | Traveller entering Malaysia |
| WHAT | Bringing exactly RM10,000 in Ringgit currency notes into Malaysia without declaring it to Customs on arrival |
| AMOUNT | RM 10,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** ringgit (import)

**Rationale:** Declaration is only required for import of Ringgit ABOVE RM10,000 — exactly RM10,000 does not trigger the declaration requirement.

---

### n6-08 — Boundary: traveller importing RM10,001 cash, undeclared

| Field | Value |
|---|---|
| WHO | Traveller entering Malaysia |
| WHAT | Bringing RM10,001 in Ringgit currency notes into Malaysia without declaring it to Customs on arrival |
| AMOUNT | RM 10,001 |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** ringgit (import)

**Rationale:** RM10,001 exceeds the RM10,000 declarable threshold for Ringgit import — bringing it in undeclared is not permitted.

---

### n6-09 — Boundary: traveller exporting FCY just below the RM30,000-equivalent declaration threshold, undeclared

| Field | Value |
|---|---|
| WHO | Traveller (Resident) leaving Malaysia |
| WHAT | Taking the equivalent of RM29,000 in foreign currency notes out of Malaysia without declaring it to the Royal Malaysian Customs Department |
| AMOUNT | RM 29,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** foreign currency

**Rationale:** Declaration is only mandatory above RM30,000 equivalent in Foreign Currency — RM29,000 equivalent taken out undeclared does not breach the threshold.

---

### n6-10 — Boundary: traveller importing FCY just above the RM30,000-equivalent declaration threshold, declared

| Field | Value |
|---|---|
| WHO | Traveller entering Malaysia |
| WHAT | Bringing in the equivalent of RM31,000 in foreign currency notes into Malaysia, properly declared to the Royal Malaysian Customs Department on arrival |
| AMOUNT | RM 31,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** foreign currency

**Rationale:** There is no upper limit on FCY import; declaration above RM30,000 equivalent is mandatory and has been properly made here, so the import is permitted.

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

### n7-05 — Boundary: export proceeds received exactly at the 6-month mark

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Receiving the full value of export proceeds exactly 6 months after the shipment date, credited into a Ringgit account with a Licensed Onshore Bank |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(c)

**Rationale:** Part A, Para 1(c): the standard repatriation window is 6 months from shipment date — receipt exactly at 6 months is within (not exceeding) that window.

---

### n7-06 — Boundary: export proceeds received one day past the 6-month mark, no approved exception

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Receiving export proceeds 1 day after the standard 6-month repatriation window has lapsed, with none of the Appendix C circumstances applicable |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para1(c)

**Rationale:** Part A, Para 1(c): the 6-month standard window is exceeded by 1 day with no approved Appendix C exception in play — this is technically non-compliant absent an extension.

---

### n7-07 — Extension to 24 months due to buyer financial difficulties

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Export proceeds outstanding 14 months after shipment because the Non-Resident buyer is experiencing genuine financial difficulties, with documentary evidence |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para1(c)

**Rationale:** Part A, Para 1(c) and Appendix C(1): buyer financial difficulties is an approved circumstance extending the repatriation window up to 24 months — 14 months is within that extended window.

---

### n7-08 — Boundary: export proceeds outstanding exactly at 24 months, buyer dispute ongoing

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Export proceeds still outstanding exactly 24 months after shipment due to a genuine quality dispute raised by the Non-Resident buyer, with supporting documentation |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** para1(c)

**Rationale:** Part A, Para 1(c) and Appendix C(1): a quality/quantity claim dispute is an approved circumstance, and the extension period maxes out at 24 months — exactly 24 months is within (not exceeding) that ceiling.

---

### n7-09 — Boundary: export proceeds outstanding at 24 months and 1 day, dispute resolved, no notification made

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Export proceeds still outstanding 24 months and 1 day after shipment; the underlying dispute has since been resolved, but the exporter has not notified the FEP Authority |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** para5

**Rationale:** Part C, Para 5: once outstanding beyond 24 months, the exporter must notify the FEP Authority within 21 days after calendar year-end — not having notified breaches this obligation regardless of the underlying dispute being resolved.

---

### n7-10 — Consignment sale with 24-month credit term, fully compliant

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Exporting goods on a consignment sale basis with an agreed 24-month credit term to the Non-Resident consignee, receiving full proceeds within that 24-month window |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(c)

**Rationale:** Part A, Para 1(c) and Appendix C(2): consignment sale arrangements may have credit terms up to 24 months — receipt within that window is compliant.

---

### n7-11 — Goods exported for testing and commissioning, proceeds received within 24 months

| Field | Value |
|---|---|
| WHO | Resident exporter (industrial equipment manufacturer) |
| WHAT | Exporting machinery for overseas testing and commissioning under a 20-month credit term, receiving full proceeds within that period |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(c)

**Rationale:** Part A, Para 1(c) and Appendix C(2): goods exported for testing or commissioning may carry credit terms up to 24 months — 20 months is within that window.

---

### n7-12 — Deduction of agency commission and freight from export proceeds

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Receiving export proceeds net of agency commission, advertising expenses, and freight and insurance charges, in line with the sale contract |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(b)

**Rationale:** Part A, Para 1(b) and Appendix A(a)/(b): agency commission, advertising, handling, freight and insurance are approved deductions from full export proceeds value.

---

### n7-13 — Deduction for a quantity/quality claim by the foreign buyer

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Receiving export proceeds reduced by an agreed discount to settle the Non-Resident buyer's legitimate quality claim on a shipment |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(b)

**Rationale:** Part A, Para 1(b) and Appendix A(e): a deduction for a quality or quantity claim by the buyer is an approved deduction from the full export proceeds value.

---

### n7-14 — Write-off of export proceeds where the Non-Resident buyer is under liquidation

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Writing off export proceeds owed by a Non-Resident buyer that has since entered liquidation, with documentary evidence of the liquidation proceedings |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(b)

**Rationale:** Part A, Para 1(b) and Appendix A(j)/Appendix B(b): write-off is an approved offsetting arrangement where the buyer is under liquidation.

---

### n7-15 — Goods not for sale: personal effects exported, exempt from receipt obligation

| Field | Value |
|---|---|
| WHO | Resident individual relocating overseas |
| WHAT | Exporting personal effects and household items as part of relocation abroad, with no sale or export proceeds expected |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2 and Appendix D(b): personal effects not for sale are exempt from the export-proceeds receipt obligation entirely.

---

### n7-16 — Goods exported under a border trade agreement, exempt from receipt obligation

| Field | Value |
|---|---|
| WHO | Resident trader |
| WHAT | Exporting goods to a neighbouring country under a recognised border trade agreement arrangement |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2 and Appendix D(a): goods exported under a border trade agreement are exempt from the standard export-proceeds receipt obligation.

---

### n7-17 — Goods exported for exhibition and reimported afterwards, exempt from receipt obligation

| Field | Value |
|---|---|
| WHO | Resident manufacturer |
| WHAT | Exporting goods to an overseas trade exhibition with the clear intention of reimporting them into Malaysia after the exhibition concludes, no sale involved |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para2

**Rationale:** Part A, Para 2 and Appendix D(b): goods exported for exhibition and reimported are exempt from the export-proceeds receipt obligation.

---

### n7-18 — Toll manufacturing arrangement treated as export of goods

| Field | Value |
|---|---|
| WHO | Resident toll manufacturer |
| WHAT | Processing raw materials owned by a Non-Resident principal into finished goods, then shipping the goods overseas under a toll manufacturing arrangement |

**Expect:** verdict in `[PERMITTED, CONDITIONAL]`

**Expect citation to reference:** q4

**Rationale:** Notice 7 "Export of Goods" FAQ Q4: a toll manufacturing arrangement is treated as export of goods and is subject to the Notice 7 receipt and repatriation requirements.

---

### n7-19 — Resident retaining export proceeds in a Trade FCA with no time limit

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Retaining USD2 million of export proceeds in a Trade Foreign Currency Account with a Licensed Onshore Bank for over 3 years, without converting to Ringgit |
| AMOUNT | USD 2,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q10

**Rationale:** Notice 7 "Export of Goods" FAQ Q10: there is no time limit on retaining export proceeds in a Trade FCA once properly received within the repatriation window.

---

### n7-20 — Resident exporter opening multiple Trade FCAs

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Opening and maintaining three separate Trade Foreign Currency Accounts with different Licensed Onshore Banks for different export contracts |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q15

**Rationale:** Notice 7 "Export of Goods" FAQ Q15: a Resident exporter may open multiple Trade FCAs.

---

### n7-21 — Trade FCA funds used for Foreign Currency Asset investment, subject to Notice 3

| Field | Value |
|---|---|
| WHO | Resident exporter with Domestic Ringgit Borrowing |
| WHAT | Using retained Trade FCA export proceeds of RM3 million equivalent to invest in foreign-listed equities, with no other FC asset investment so far this year |
| AMOUNT | RM 3,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q16

**Rationale:** Notice 7 "Export of Goods" FAQ Q16: export proceeds retained in FC may be used to invest in FC assets, but remain subject to the Notice 3 investment limit for a Resident with DRB — here the funds are FCY-sourced (not Ringgit-converted), so the cap does not bite this transaction.

---

### n7-22 — Resident without export proceeds converting Ringgit to FCY for an import obligation

| Field | Value |
|---|---|
| WHO | Resident company with no export proceeds of its own |
| WHAT | Converting Ringgit to US Dollars with a Licensed Onshore Bank to settle an outstanding import payment obligation |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q17

**Rationale:** Notice 7 "Export of Goods" FAQ Q17: a Resident without export proceeds may still convert Ringgit to FCY for import payment or FCY Borrowing repayment obligations.

---

### n7-23 — Fund transfer from Trade FCA to Investment FCA, subject to Notice 3

| Field | Value |
|---|---|
| WHO | Resident exporter with Domestic Ringgit Borrowing |
| WHAT | Transferring RM55 million equivalent from a Trade FCA into an Investment FCA this calendar year, exceeding the RM50 million annual conversion cap with no approval |
| AMOUNT | RM 55,000,000 |

**Expect:** verdict in `[NOT_PERMITTED, REQUIRES_APPROVAL]`

**Expect citation to reference:** q18

**Rationale:** Notice 7 "Export of Goods" FAQ Q18: transfer from a Trade FCA to an Investment FCA is subject to the Notice 3 investment limit — RM55 million exceeds the RM50 million annual cap for an Entity with DRB.

---

### n7-24 — Fund transfer from Investment FCA back to Trade FCA, unrestricted

| Field | Value |
|---|---|
| WHO | Resident exporter with Domestic Ringgit Borrowing |
| WHAT | Transferring RM80 million equivalent from an Investment FCA back into a Trade FCA |
| AMOUNT | RM 80,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q18

**Must NOT mention:** RM50 million

**Rationale:** Notice 7 "Export of Goods" FAQ Q18: transfer from an Investment FCA back to a Trade FCA is unrestricted, unlike the reverse direction.

---

### n7-25 — Offsetting export proceeds against import payment obligations

| Field | Value |
|---|---|
| WHO | Resident trading company that both exports and imports goods |
| WHAT | Offsetting RM4 million of export proceeds receivable against RM4 million of import payments owed to the same overseas counterparty group, with supporting documentation |
| AMOUNT | RM 4,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** para1(b)

**Rationale:** Part A, Para 1(b) and Appendix B(a): offsetting export proceeds against import payment obligations is an approved arrangement.

---

### n7-26 — Offsetting export proceeds against an anticipated future FC obligation not yet incurred

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Offsetting export proceeds against an FC obligation that has not yet been incurred, but is merely anticipated for a future transaction |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** q12

**Rationale:** Notice 7 "Export of Goods" FAQ Q12: offsetting is only permitted against FC obligations already incurred under a Firm Commitment — not merely anticipated future obligations.

---

### n7-27 — Offsetting export proceeds directly against an overseas investment

| Field | Value |
|---|---|
| WHO | Resident exporter |
| WHAT | Attempting to offset export proceeds receivable directly against the cost of an overseas property investment, without any LOB-facilitated trade financing arrangement |

**Expect:** verdict in `[NOT_PERMITTED]`

**Expect citation to reference:** q14

**Rationale:** Notice 7 "Export of Goods" FAQ Q14: export proceeds cannot be offset against overseas investments or direct commodity hedging with a Non-Resident counterparty.

---

### n7-28 — Offsetting export proceeds against FCY Borrowing repayment via Trade Master Card-style global offsetting

| Field | Value |
|---|---|
| WHO | Resident exporter within a multinational Group |
| WHAT | Offsetting export proceeds against the repayment of FCY Borrowing obtained under Notice 2, using a global offsetting arrangement administered by the Group treasury centre |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q11

**Rationale:** Notice 7 "Export of Goods" FAQ Q11: detailed approved offsetting arrangements include offsetting against FCY Borrowing repayment under Notice 2, including via global offsetting / TMC structures.

---

### n7-29 — Export of services mistakenly treated as subject to the 6-month repatriation rule

| Field | Value |
|---|---|
| WHO | Resident IT consulting company |
| WHAT | Providing consulting services to an overseas client and receiving payment 9 months after invoicing, with no goods shipment involved |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q3

**Must NOT mention:** 6 months, 24 months

**Rationale:** Notice 7 "Export of Goods" FAQ Q3: the repatriation timeline obligations under Notice 7 apply only to export of goods, not export of services or merchanting trade — there is no 6-month deadline for this service payment.

---

### n7-30 — Boundary: exporter with annual gross exports just under the RM250M reporting threshold

| Field | Value |
|---|---|
| WHO | Resident exporter with annual gross exports of exactly RM249 million in the preceding year |
| WHAT | Not having submitted any report to the FEP Authority regarding its export activities |
| AMOUNT | RM 249,000,000 |

**Expect:** verdict in `[PERMITTED]`

**Expect citation to reference:** q19

**Must NOT mention:** RM250 million

**Rationale:** Notice 7 "Export of Goods" FAQ Q19: the reporting obligation is triggered only for exporters with annual gross exports ABOVE RM250 million — RM249 million does not trigger the requirement.

---

