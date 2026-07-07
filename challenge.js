/* FEP Compass v2.0 — Daily FEP Challenge question bank + daily-pick logic
   Loaded by index.html AFTER kb.js and BEFORE app.js (app.js reads these globals).
   Also require()-able in Node (see the module.exports guard at the bottom), so the
   citation/shape of every entry can be machine-checked against kb.js.

   ━━━ HOW TO ADD A QUESTION (copy-paste an entry and edit) ━━━
   Every entry in CHALLENGE_BANK uses one unified a/b/c/d multiple-choice shape:

     {
       id: 'mcq-n3-99',       // any unique string
       notice: 3,             // 2 | 3 | 4 | 7 — the FEP Notice the question is about
       type: 'mcq',           // 'verdict' (pick the FEP treatment) or 'mcq' (general quiz)
       q: 'Question text…',
       opts: ['…', '…', '…', '…'],  // 2-4 options, shown as A/B/C/D in the given order
       answer: 0,             // index into opts of the correct option
       ref: 'Part A, Para 1', // MUST be a real Ref that exists in kb.js CHUNKS for that
                              // notice — copy it verbatim from kb.js; NEVER invent or
                              // paraphrase a Para/FAQ number (citation-grounding rule)
       rationale: 'Why — grounded in the actual Notice text.',
     }

   Validate after editing:
     node -e "require('./challenge.js')"   (syntax + dual-load)
   plus the ref check in this repo's test notes: every entry must satisfy
     verifyCitation('Notice ' + e.notice + ' ' + e.ref).grounded === true
   using verifyCitation from kb.js.

   The 'verdict' entries below are generated from the ground-truthed scenarios in
   test/scenarios.js (Notices 2/3/4/7, single-verdict ones), with each citation
   resolved to the real chunk ref in kb.js. */
'use strict';

/* Day 1 of the game — challenge numbers count up from this date. */
const CHALLENGE_EPOCH = '2026-07-01';

const CHALLENGE_BANK = [
  {
    id: 'mcq-n3-01', notice: 3, type: 'mcq',
    q: 'Under Notice 3, up to how much may a Resident Individual WITHOUT Domestic Ringgit Borrowing invest in Foreign Currency Assets (onshore and offshore)?',
    opts: ['RM1 million equivalent per calendar year', 'RM50 million equivalent per calendar year', 'Any amount', 'RM250 million equivalent per calendar year'],
    answer: 2,
    ref: 'Part A, Para 1',
    rationale: 'Notice 3 Part A, Para 1: a Resident Individual, sole proprietorship or General Partnership WITHOUT Domestic Ringgit Borrowing (DRB) is allowed to invest in Foreign Currency Asset up to ANY amount, both onshore and offshore.',
  },
  {
    id: 'mcq-n3-02', notice: 3, type: 'mcq',
    q: 'A Resident Individual WITH Domestic Ringgit Borrowing invests abroad using funds converted from Ringgit. Under Notice 3, what is the annual cap?',
    opts: ['RM1 million equivalent per calendar year', 'RM2 million equivalent per calendar year', 'RM50 million equivalent per calendar year', 'No limit'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Notice 3 Part A, Para 2(c): a Resident Individual WITH DRB may invest up to RM1 million equivalent per calendar year from conversion of Ringgit, Trade FCA, or swapping of a Ringgit-denominated financial asset — computed in aggregate with any sole proprietorship or General Partnership the same individual owns.',
  },
  {
    id: 'mcq-n3-03', notice: 3, type: 'mcq',
    q: 'A Resident Entity WITH Domestic Ringgit Borrowing invests in Foreign Currency Assets using funds converted from Ringgit. Under Notice 3, what is the annual cap, and on what basis is it computed?',
    opts: ['RM1 million, per entity', 'RM50 million equivalent per calendar year, on a parent-subsidiary group basis', 'RM50 million equivalent per calendar year, per entity individually', 'Unlimited, as long as the funds are converted with a LOB'],
    answer: 1,
    ref: 'Part B, Para 4',
    rationale: 'Notice 3 Part B, Para 4(c): a Resident Entity WITH DRB may invest up to RM50 million equivalent per calendar year from conversion of Ringgit (or Trade FCA, LOB FCY Borrowing for non-DIA purposes, or swaps of Ringgit-denominated assets), computed on a parent-subsidiary group basis.',
  },
  {
    id: 'mcq-n2-01', notice: 2, type: 'mcq',
    q: 'Under Notice 2, how much may a Resident Individual borrow in Ringgit, in aggregate, from a Non-Resident (excluding a Non-Resident Financial Institution) for use in Malaysia?',
    opts: ['RM100,000', 'RM1 million', 'RM10 million', 'Ringgit borrowing from a Non-Resident is never allowed'],
    answer: 1,
    ref: 'Part A, Para 2',
    rationale: 'Notice 2 Part A, Para 2: a Resident Individual, sole proprietor or General Partnership is allowed to borrow in Ringgit up to RM1 million in aggregate for use in Malaysia from a Non-Resident excluding a NRFI.',
  },
  {
    id: 'mcq-n7-01', notice: 7, type: 'mcq',
    q: 'Under Notice 7, where must a Resident exporter receive the proceeds of its Export of Goods?',
    opts: ['In any offshore account of its choosing', 'In Malaysia — in Ringgit or Foreign Currency, placed in a Ringgit account or Trade FCA with a LOB', 'Only in Ringgit, cash', 'In a foreign bank account, provided BNM is notified'],
    answer: 1,
    ref: 'Part A, Para 1(a)',
    rationale: 'Notice 7 Part A, Para 1(a): a Resident exporter SHALL receive the proceeds of its Export of Goods in Malaysia — in Ringgit or Foreign Currency, placed in a Ringgit account or Trade FCA maintained with a LOB.',
  },
  {
    id: 'mcq-n7-02', notice: 7, type: 'mcq',
    q: 'A Resident exporter has still not received export proceeds 24 months after the date of shipment. Under Notice 7, what must it do?',
    opts: ['Nothing — the obligation lapses after 24 months', 'Notify the FEP Authority on the outstanding proceeds within 21 days after the end of each calendar year', 'Write the proceeds off in its accounts', 'Physically re-import the goods'],
    answer: 1,
    ref: 'Part C, Para 5',
    rationale: 'Notice 7 Part C, Para 5: where export proceeds are not received within 24 months from the date of shipment, the Resident exporter shall notify the FEP Authority on the outstanding proceeds within twenty-one (21) days after the end of each calendar year via bnm.my/fep.',
  },
  {
    id: 'mcq-n7-03', notice: 7, type: 'mcq',
    q: 'Which Resident exporters fall under Notice 7 Part C\'s export reporting requirement?',
    opts: ['Every Resident exporter, regardless of size', 'Exporters with annual gross exports exceeding RM250 million (as and when required by the FEP Authority)', 'Exporters with annual gross exports exceeding RM50 million', 'Only exporters invoicing in Foreign Currency'],
    answer: 1,
    ref: 'Export of Goods — FAQ Q19',
    rationale: 'Notice 7 FAQ Q19: a Resident exporter that meets the requirement in Part C (e.g. annual gross export exceeding RM250 million) shall submit a report on Export of Goods as and when required by the FEP Authority — the requirement is communicated via a letter from the FEP Authority.',
  },
  {
    id: 'mcq-n4-01', notice: 4, type: 'mcq',
    q: 'Two Resident individuals convert Ringgit into a joint foreign currency fixed deposit, and ONE of them has Domestic Ringgit Borrowing. What is the total annual conversion limit for the joint investment?',
    opts: ['RM1 million (shared between both)', 'RM2 million (RM1 million per person per annum)', 'Unlimited, because one party has no DRB', 'RM50 million'],
    answer: 1,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q7',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q7: Ringgit conversion for a joint investment is subject to the RM1 million in aggregate PER PERSON per annum prudential limit so long as one joint party is a Resident with DRB — for two persons, RM2 million per annum in total.',
  },
  {
    id: 'mcq-n4-02', notice: 4, type: 'mcq',
    q: 'Under Notice 4, a Resident may pay another Resident in Foreign Currency for which of the following?',
    opts: ['Any purpose whatsoever, without restriction', 'Any purpose between Immediate Family Members, or for education, employment or migration outside Malaysia', 'No purpose — FCY payment between Residents is always prohibited', 'Only with case-by-case BNM approval'],
    answer: 1,
    ref: 'Part C, Para 4',
    rationale: 'Notice 4 Part C, Para 4: a Resident may make/receive FCY payment to/from another Resident for (a) any purpose between Immediate Family Members, (b) education, employment or migration outside Malaysia, and certain other listed purposes (LOB transactions, Specified Exchange derivatives, commodity murabahah, miscellaneous expenses abroad, Global Supply Chain domestic trade).',
  },
  {
    id: 'dq-n2-01', notice: 2, type: 'verdict',
    q: 'Resident individual — Borrowing RM800,000 in Ringgit from a Non-Resident friend (not an immediate family member or employer). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2 allows a Resident Individual to borrow up to RM1 million in aggregate in Ringgit from a Non-Resident (excl. NRFI) — RM800,000 is within that cap.',
  },
  {
    id: 'dq-n2-03', notice: 2, type: 'verdict',
    q: 'Resident company — Borrowing USD80 million equivalent in Foreign Currency from its Non-Resident Direct Shareholder (parent company) (amount: USD 80,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 9',
    rationale: 'Part B, Para 9(b): FCY borrowing from a Direct Shareholder is unlimited — the RM100 million cap (Para 10) only applies to borrowing from outside the Group/NRFI/out-of-group SPV.',
  },
  {
    id: 'dq-n2-05', notice: 2, type: 'verdict',
    q: 'Resident individual — Borrowing RM2 million in Ringgit from his Non-Resident spouse (amount: RM 2,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1',
    rationale: 'Part A, Para 1: Ringgit borrowing from a Non-Resident Immediate Family Member is unlimited — the RM1 million cap (Para 2) does not apply here.',
  },
  {
    id: 'dq-n2-06', notice: 2, type: 'verdict',
    q: 'Resident individual employee — Borrowing RM3 million in Ringgit from his employer in Malaysia for use in Malaysia, per the employment contract terms (amount: RM 3,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1',
    rationale: 'Part A, Para 1(b): Ringgit borrowing from an employer in Malaysia for use in Malaysia is unlimited, subject to employment contract terms.',
  },
  {
    id: 'dq-n2-07', notice: 2, type: 'verdict',
    q: 'Resident individual — Borrowing exactly RM1,000,000 in aggregate in Ringgit from a Non-Resident friend (not immediate family, not employer, not NRFI). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2 allows up to RM1 million in aggregate — exactly RM1,000,000 is within (not exceeding) that cap.',
  },
  {
    id: 'dq-n2-08', notice: 2, type: 'verdict',
    q: 'Resident individual — Borrowing USD5 million equivalent in Foreign Currency from his Immediate Family Member (brother) (amount: USD 5,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 3',
    rationale: 'Part A, Para 3: FCY borrowing from an Immediate Family Member is unlimited — the RM10 million cap (Para 4) does not apply.',
  },
  {
    id: 'dq-n2-09', notice: 2, type: 'verdict',
    q: 'Resident individual — Borrowing RM8 million equivalent in Foreign Currency from a Licensed Onshore Bank (amount: RM 8,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 4',
    rationale: 'Part A, Para 4: a Resident Individual may borrow up to RM10 million equivalent in aggregate in FCY from a LOB or Non-Resident — RM8 million is within that cap.',
  },
  {
    id: 'dq-n2-11', notice: 2, type: 'verdict',
    q: 'Resident individual — Refinancing the outstanding principal and accrued interest of a previously-approved RM1 million Ringgit borrowing from a Non-Resident friend, on the same terms. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 5',
    rationale: 'Part A, Para 5: a Resident Individual may refinance outstanding approved Borrowing under paragraphs 1 to 4, subject to compliance with the respective paragraph.',
  },
  {
    id: 'dq-n2-12', notice: 2, type: 'verdict',
    q: 'Resident company — Borrowing RM50 million in Ringgit from its Non-Resident Direct Shareholder to finance a manufacturing plant expansion (Real Sector Activity) in Malaysia (amount: RM 50,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 6',
    rationale: 'Part B, Para 6: Ringgit borrowing from a Non-Resident within the Group (including a Direct Shareholder) to finance Real Sector Activity in Malaysia is unlimited.',
  },
  {
    id: 'dq-n2-13', notice: 2, type: 'verdict',
    q: 'Resident company — Issuing a non-tradable Ringgit-denominated Corporate Bond to a Non-Resident Entity outside its Group (not a NRFI exemption). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part B, Para 7',
    rationale: 'Part B, Para 7 excludes a non-tradable Ringgit Corporate Bond or Sukuk issued to a Non-Resident Entity outside the Resident Entity\'s Group (or a NRFI) from the general permission.',
  },
  {
    id: 'dq-n2-14', notice: 2, type: 'verdict',
    q: 'Resident company — Borrowing RM900,000 in Ringgit for use in Malaysia from a Non-Resident company outside its Group, excluding a NRFI. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 8',
    rationale: 'Part B, Para 8(a): a Resident Entity may borrow up to RM1 million in aggregate in Ringgit for use in Malaysia from a Non-Resident excluding a NRFI — RM900,000 is within that cap.',
  },
  {
    id: 'dq-n2-15', notice: 2, type: 'verdict',
    q: 'Resident company — Borrowing RM200 million in Ringgit for use in Malaysia from a Multilateral Development Bank (amount: RM 200,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 8',
    rationale: 'Part B, Para 8(b): Ringgit borrowing in any amount from a Multilateral Development Bank or Qualified Development Financial Institution is unlimited.',
  },
  {
    id: 'dq-n2-16', notice: 2, type: 'verdict',
    q: 'Resident company — Borrowing USD60 million equivalent in Foreign Currency from a sister company within its Group (not a NRFI, not a SPV) (amount: USD 60,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 9',
    rationale: 'Part B, Para 9(b): FCY borrowing in any amount from an Entity within the Resident Entity\'s Group is unlimited (excluding a NRFI or out-of-Group SPV, which fall under the Para 10 cap instead).',
  },
  {
    id: 'dq-n2-17', notice: 2, type: 'verdict',
    q: 'Resident company — Borrowing exactly RM100 million equivalent in aggregate in Foreign Currency from a Non-Resident outside its Group (amount: RM 100,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 10',
    rationale: 'Part B, Para 10 caps FCY borrowing from outside the Group at RM100 million equivalent in aggregate — exactly RM100 million is within (not exceeding) that cap.',
  },
  {
    id: 'dq-n2-19', notice: 2, type: 'verdict',
    q: 'Resident company — Refinancing the outstanding principal and accrued profit of a previously-approved FCY borrowing from a LOB, subject to compliance with the original paragraph requirements. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 11',
    rationale: 'Part B, Para 11: a Resident Entity may refinance outstanding approved Borrowing under paragraphs 6 to 10, subject to compliance with the respective paragraph.',
  },
  {
    id: 'dq-n2-21', notice: 2, type: 'verdict',
    q: 'Non-Resident individual employee — Borrowing RM500,000 in Ringgit from his employer in Malaysia for use in Malaysia. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part D, Para 13',
    rationale: 'Part D, Para 13(c): a Non-Resident Individual may borrow Ringgit in any amount from an employer in Malaysia for use in Malaysia.',
  },
  {
    id: 'dq-n2-22', notice: 2, type: 'verdict',
    q: 'Non-Resident company (not a NRFI) — Borrowing RM40 million in Ringgit from a Resident lender to finance Real Sector Activity (a manufacturing facility) in Malaysia (amount: RM 40,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part D, Para 14',
    rationale: 'Part D, Para 14(a): a Non-Resident excluding a NRFI may borrow Ringgit in any amount from a Resident to finance Real Sector Activity in Malaysia.',
  },
  {
    id: 'dq-n2-23', notice: 2, type: 'verdict',
    q: 'Non-Resident investor — Obtaining Ringgit margin financing from a Resident stockbroking company to purchase Bursa Malaysia-listed shares. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part D, Para 14',
    rationale: 'Part D, Para 14(b): a Non-Resident may borrow Ringgit from a Resident stockbroker for margin financing on Bursa Malaysia.',
  },
  {
    id: 'dq-n2-24', notice: 2, type: 'verdict',
    q: 'Non-Resident custodian bank — Maintaining a Ringgit overdraft facility with a LOB for 5 business days to avoid a Bursa Malaysia settlement failure, with no roll-over requested. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part D, Para 16',
    rationale: 'Part D, Para 16(b) permits such an overdraft only up to a maximum of 2 business days with no roll-over — 5 business days exceeds the permitted window.',
  },
  {
    id: 'dq-n2-25', notice: 2, type: 'verdict',
    q: 'Non-Resident investor — Borrowing RM7 million in Ringgit from a LOB via a repurchase agreement (amount: RM 7,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part D, Para 16',
    rationale: 'Part D, Para 16(c): a Non-Resident may borrow up to RM10 million via a repurchase or sale-buy-back agreement with a LOB — RM7 million is within that cap.',
  },
  {
    id: 'dq-n2-27', notice: 2, type: 'verdict',
    q: 'Licensed Onshore Bank — Obtaining a Financial Guarantee of RM500 million in Ringgit for its own account from a Non-Resident bank (amount: RM 500,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part G, Para 20',
    rationale: 'Part G, Para 20(a): a LOB may obtain a Financial Guarantee in any amount in Ringgit or FCY for its own account.',
  },
  {
    id: 'dq-n2-29', notice: 2, type: 'verdict',
    q: 'Resident construction company — Giving a performance bond (Non-Financial Guarantee) of USD20 million to a Non-Resident project owner to secure supply of construction services (amount: USD 20,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part G, Para 25',
    rationale: 'Part G, Para 25: a Resident may give a Non-Financial Guarantee (e.g. a performance bond) in any amount in FCY or Ringgit to a Non-Resident.',
  },
  {
    id: 'dq-n2-30', notice: 2, type: 'verdict',
    q: 'Resident company — Paying a Non-Resident lender in Ringgit, instead of Foreign Currency, after its Non-Financial Guarantee is called upon (the guarantee was not issued for use in Malaysia). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part G, Para 26',
    rationale: 'Part G, Para 26: payment to a Non-Resident under a Non-Financial Guarantee must be made in Foreign Currency, UNLESS the guarantee was for use in Malaysia (in which case Ringgit or FCY is allowed) — here it was not for use in Malaysia, so Ringgit payment is not permitted.',
  },
  {
    id: 'dq-n3-01', notice: 3, type: 'verdict',
    q: 'Resident individual with exactly ONE outstanding housing loan AND exactly ONE outstanding vehicle loan at the same time, and no other Ringgit borrowing from any Resident — Converting RM1.5 million from Ringgit to invest in foreign-listed stocks (amount: RM 1,500,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1',
    rationale: 'One housing loan + one vehicle loan is the excluded DRB combination, NOT "more than one" of either type — this Resident is WITHOUT DRB, so Part A Para 1 (UNLIMITED) governs, not the RM1M Para 2 cap.',
  },
  {
    id: 'dq-n3-03', notice: 3, type: 'verdict',
    q: 'Resident individual with no Ringgit borrowing of any kind — Converting RM5 million from Ringgit to invest in foreign-listed stocks (amount: RM 5,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1',
    rationale: 'Part A, Para 1: a Resident Individual without DRB may invest any amount in FCY assets.',
  },
  {
    id: 'dq-n3-04', notice: 3, type: 'verdict',
    q: 'Two Resident individuals, joint accountholders, NEITHER of whom has any Domestic Ringgit Borrowing — Jointly converting RM3 million from their joint Ringgit account into a joint foreign currency fixed deposit (amount: RM 3,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1',
    rationale: 'With no DRB on either side, Part A Para 1 (UNLIMITED) governs the whole joint investment — the RM1M/RM2M joint-FCA FAQ only engages when at least one party has DRB.',
  },
  {
    id: 'dq-n3-06', notice: 3, type: 'verdict',
    q: 'Resident company with Domestic Ringgit Borrowing — Using RM80 million equivalent of Foreign Currency borrowing obtained from a Licensed Onshore Bank to fund a Direct Investment Abroad (acquiring 25% equity in a foreign company) (amount: RM 80,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 4',
    rationale: 'Part B, Para 4(b): LOB FCY borrowing used for DIA is unlimited — the RM50 million/year cap (Para 4(c)) only applies to conversion-funded, non-DIA investment.',
  },
  {
    id: 'dq-n3-07', notice: 3, type: 'verdict',
    q: 'Resident individual with Domestic Ringgit Borrowing (two outstanding vehicle loans) — Converting exactly RM1,000,000 from Ringgit to invest in foreign-listed stocks this calendar year, with no other FC asset investment so far this year. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2(c): a Resident Individual with DRB may convert up to RM1 million equivalent per calendar year — exactly RM1,000,000 is within (not exceeding) that cap.',
  },
  {
    id: 'dq-n3-09', notice: 3, type: 'verdict',
    q: 'Resident individual with Domestic Ringgit Borrowing (three outstanding vehicle loans) — Investing RM8 million equivalent in foreign-listed stocks using Foreign Currency funds already held outside Malaysia (not Export of Goods proceeds, not from Ringgit conversion) (amount: RM 8,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2(a): a Resident Individual with DRB may invest any amount using FCY funds from outside Malaysia (excluding Export of Goods proceeds) — the RM1 million cap (2(c)) only applies to Ringgit-conversion-sourced investment.',
  },
  {
    id: 'dq-n3-10', notice: 3, type: 'verdict',
    q: 'Resident individual with Domestic Ringgit Borrowing (two outstanding housing loans), studying abroad — Purchasing real estate outside Malaysia for his own accommodation while pursuing full-time education abroad, with documentary evidence of enrolment. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2(b): real estate abroad for own/immediate-family accommodation for education, employment or migration purposes is unlimited — the RM1 million conversion cap does not apply.',
  },
  {
    id: 'dq-n3-11', notice: 3, type: 'verdict',
    q: 'Resident individual with Domestic Ringgit Borrowing (two outstanding vehicle loans) — Purchasing real estate outside Malaysia for the accommodation of a close friend (not an Immediate Family Member) who is migrating abroad. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Investing in Foreign Currency Asset by Resident — FAQ Q5',
    rationale: 'Notice 3 FAQ Q5: a Resident individual may only purchase property abroad for their own account or Immediate Family Members under the permitted purposes — a non-family friend does not qualify.',
  },
  {
    id: 'dq-n3-12', notice: 3, type: 'verdict',
    q: 'Resident company with Domestic Ringgit Borrowing — Converting RM35 million from Ringgit this calendar year to invest in foreign-listed equities for non-DIA purposes (amount: RM 35,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 4',
    rationale: 'Part B, Para 4(c): a Resident Entity with DRB may convert up to RM50 million equivalent per calendar year for non-DIA purposes — RM35 million is within that cap.',
  },
  {
    id: 'dq-n3-13', notice: 3, type: 'verdict',
    q: 'Resident company with Domestic Ringgit Borrowing — Converting exactly RM50,000,000 from Ringgit this calendar year for non-DIA foreign currency asset investment, with no other conversion so far this year. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 4',
    rationale: 'Part B, Para 4(c): the RM50 million per calendar year cap is exactly met, not exceeded, so the conversion remains permitted.',
  },
  {
    id: 'dq-n3-16', notice: 3, type: 'verdict',
    q: 'Resident company with no Domestic Ringgit Borrowing of any kind — Converting RM200 million from Ringgit to invest in a portfolio of foreign-listed bonds (amount: RM 200,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 3',
    rationale: 'Part B, Para 3: a Resident Entity without DRB may invest in FCY Asset up to any amount.',
  },
  {
    id: 'dq-n3-17', notice: 3, type: 'verdict',
    q: 'Licensed Onshore Bank — Investing RM500 million equivalent in Foreign Currency Asset for its own proprietary trading account (amount: RM 500,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 5',
    rationale: 'Part C, Para 5: a LOB may invest in Foreign Currency Asset up to any amount for its own account.',
  },
  {
    id: 'dq-n3-18', notice: 3, type: 'verdict',
    q: 'Resident Entity licensed by the Securities Commission Malaysia for fund management — Investing RM300 million in Foreign Currency Asset onshore on behalf of its Resident clients (amount: RM 300,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 6',
    rationale: 'Part C, Para 6: a SC-licensed Entity may invest in Foreign Currency Asset ONSHORE on behalf of its clients up to ANY amount.',
  },
  {
    id: 'dq-n3-20', notice: 3, type: 'verdict',
    q: 'Licensed insurer — Investing 100% of the NAV of an investment-linked fund offshore on behalf of a Non-Resident client. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 7-8',
    rationale: 'Part C, Para 7-8(a): a licensed insurer may invest offshore on behalf of a client who is a Non-Resident up to the full NAV of the fund.',
  },
  {
    id: 'dq-n3-21', notice: 3, type: 'verdict',
    q: 'Resident Entity licensed by SC Malaysia for fund management — Investing 45% of the total funds offshore in conventional (non-Shariah) FCY assets on behalf of a Resident client with DRB. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 9-10',
    rationale: 'Part C, Para 9-10: a SC-licensed fund manager may invest offshore on behalf of a Resident client WITH DRB up to 50% of the total funds (aggregated at the Resident Entity\'s level) — 45% is within that limit.',
  },
  {
    id: 'dq-n3-24', notice: 3, type: 'verdict',
    q: 'Resident individual with exactly ONE outstanding vehicle loan and a credit card facility used solely for sundry office expenses, no other Ringgit borrowing — Converting RM3 million from Ringgit to invest in a foreign currency fixed deposit (amount: RM 3,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1',
    rationale: 'Notice 3 FAQ Q15 (entity DRB logic, applying the same sundry-expense exclusion via the DRB definition) and the DRB glossary: one vehicle loan plus a credit/financing facility used solely for sundry expenses does not constitute DRB — this Resident remains WITHOUT DRB under Part A, Para 1 (UNLIMITED).',
  },
  {
    id: 'dq-n3-27', notice: 3, type: 'verdict',
    q: 'Resident company that has borrowed Ringgit solely from its Resident Direct Shareholder, and has no other Ringgit borrowing — Converting RM30 million from Ringgit to invest in foreign-listed equities (amount: RM 30,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Investing in Foreign Currency Asset by Resident — FAQ Q15',
    rationale: 'Notice 3 FAQ Q15(a): borrowing obtained from a Resident Direct Shareholder or another Resident entity with a parent-subsidiary relationship is NOT considered DRB — this Resident remains WITHOUT DRB and unlimited under Part B, Para 3.',
  },
  {
    id: 'dq-n3-29', notice: 3, type: 'verdict',
    q: 'Resident individual with Domestic Ringgit Borrowing — Purchasing RM2 million worth of digital assets on a registered Malaysian digital asset exchange (DAX), settled entirely in Ringgit with no transfer offshore (amount: RM 2,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Investing in Foreign Currency Asset by Resident — FAQ Q8',
    rationale: 'Notice 3 FAQ Q8: a Resident is free to purchase digital assets on a registered DAX in Malaysia without any investment limit, as long as it is settled in Ringgit.',
  },
  {
    id: 'dq-n3-30', notice: 3, type: 'verdict',
    q: 'Resident individual with Domestic Ringgit Borrowing (two outstanding vehicle loans) — Remitting RM950,000 this calendar year to a margin account with a Non-Resident futures broker to trade equity options (a non-exchange-rate derivative), with no other FC asset investment so far this year. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Investing in Foreign Currency Asset by Resident — FAQ Q13',
    rationale: 'Notice 3 FAQ Q13: the investment amount for non-exchange-rate derivatives is computed on total remittance to the margin account, subject to the RM1 million annual aggregate limit — RM950,000 is within that cap.',
  },
  {
    id: 'dq-n4-01', notice: 4, type: 'verdict',
    q: 'Resident company — Paying USD300,000 to a Non-Resident supplier in Foreign Currency to settle an import of goods. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 5',
    rationale: 'Part C, Para 5: a Resident may pay a Non-Resident in FCY for any purpose except a short list of derivative transactions — an import settlement is not on that list.',
  },
  {
    id: 'dq-n4-02', notice: 4, type: 'verdict',
    q: 'Resident individual — Paying another Resident individual in US Dollars for rental of a holiday home in Malaysia (both parties are Malaysian residents, no family relationship, no LOB or Global Supply Chain involvement) (amount: USD 10,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part C, Para 4',
    rationale: 'Part C, Para 4 only permits FCY payment between Residents for a specific listed set of purposes (family, education/employment/migration abroad, LOB dealings, Global Supply Chain, etc.) — domestic holiday-home rent is not on that list.',
  },
  {
    id: 'dq-n4-04', notice: 4, type: 'verdict',
    q: 'Resident company — Making a Ringgit payment to a Non-Resident in Malaysia arising from a court judgement, where the underlying transaction complies with the FEP Notices. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part B, Para 3',
    rationale: 'Part B, Para 3 permits Ringgit payment/receipt for a court judgement where the underlying transaction is FEP-compliant.',
  },
  {
    id: 'dq-n4-05', notice: 4, type: 'verdict',
    q: 'Non-Resident individual — Paying RM200,000 in Ringgit to his Resident sister (Immediate Family Member) in Malaysia for any purpose. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q1',
    rationale: 'Notice 4 "Payment in Ringgit by Non-Resident" FAQ Q1: a Non-Resident individual may pay a Resident Immediate Family Member in Ringgit or FCY for any purpose.',
  },
  {
    id: 'dq-n4-06', notice: 4, type: 'verdict',
    q: 'Non-Resident company — Attempting to receive a Ringgit payment from a Resident counterparty without maintaining an External Account. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q2',
    rationale: 'Notice 4 "Payment in Ringgit by Non-Resident" FAQ Q2: a Non-Resident must maintain an External Account to receive a Ringgit payment — without one, the receipt is not permitted.',
  },
  {
    id: 'dq-n4-07', notice: 4, type: 'verdict',
    q: 'Non-Resident individual — Transferring RM500,000 in Ringgit from his External Account at one LOB to another External Account he holds at a different LOB. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q3',
    rationale: 'Notice 4 "Payment in Ringgit by Non-Resident" FAQ Q3: a Non-Resident may transfer Ringgit between his own multiple External Accounts.',
  },
  {
    id: 'dq-n4-08', notice: 4, type: 'verdict',
    q: 'Resident company — Paying a Resident education agent in Foreign Currency on behalf of an employee, for the employee\'s child\'s education abroad. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 4',
    rationale: 'Part C, Para 4: FCY payment between Residents is permitted for purposes including education abroad of an Immediate Family Member.',
  },
  {
    id: 'dq-n4-09', notice: 4, type: 'verdict',
    q: 'Resident manufacturing company — Paying a Resident vendor in Foreign Currency for goods supplied as part of a Global Supply Chain arrangement, where the vendor itself has a FCY obligation to an upstream Non-Resident supplier. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 4',
    rationale: 'Part C, Para 4 and footnote 2: a Resident may pay another Resident in FCY for Global Supply Chain pass-through payments where genuine upstream FCY obligations exist.',
  },
  {
    id: 'dq-n4-10', notice: 4, type: 'verdict',
    q: 'Resident retail company — Paying a Resident vendor in US Dollars for locally-sourced goods, where the vendor has no Foreign Currency obligations of its own and the goods are not part of any cross-border supply chain. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q11',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q11: where there are no underlying FC obligations and the goods are locally sourced, this does not qualify as Global Supply Chain — payment must be made in Ringgit.',
  },
  {
    id: 'dq-n4-11', notice: 4, type: 'verdict',
    q: 'Resident company — Converting Ringgit to US Dollars in order to make a payment to a Resident vendor under a Global Supply Chain arrangement. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q10',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q10: a Resident cannot convert Ringgit to FCY to pay under Global Supply Chain — the FCY must come from a Trade FCA or FCY trade financing facility.',
  },
  {
    id: 'dq-n4-12', notice: 4, type: 'verdict',
    q: 'Resident logistics company — Paying a Resident freight forwarder in Foreign Currency for ancillary logistics services, where the Resident company has genuine FC obligations abroad and holds FC proceeds from exports. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q12',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q12: FCY settlement for ancillary services is allowed where FC obligations exist abroad and the payer has FC proceeds available.',
  },
  {
    id: 'dq-n4-13', notice: 4, type: 'verdict',
    q: 'Resident commodity trading company — Entering a commodity derivative directly with a Non-Resident counterparty to hedge crude palm oil exposure, with the notional amount matching its underlying physical exposure. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q14',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q14: a Resident may hedge commodity exposure via a Resident futures broker or directly with a Non-Resident counterparty, up to the underlying exposure.',
  },
  {
    id: 'dq-n4-14', notice: 4, type: 'verdict',
    q: 'Resident trading company — Entering a foreign exchange forward contract directly with a Non-Resident bank counterparty, bypassing any Licensed Onshore Bank or licensed money changer. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q16',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q16: a Resident entity cannot enter an FX contract directly with a Non-Resident counterparty — it must transact via a LOB or licensed money changer (per Notice 1).',
  },
  {
    id: 'dq-n4-15', notice: 4, type: 'verdict',
    q: 'Non-Resident Financial Institution licensed for remittance business — Making a Ringgit payment in Malaysia on behalf of its remittance customer, under its remittance business licence. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part D, Para 7',
    rationale: 'Part D, Para 7: a person licensed for remittance business may make or receive a payment on behalf of its customers in the ordinary course of that licensed business.',
  },
  {
    id: 'dq-n4-16', notice: 4, type: 'verdict',
    q: 'Non-Resident Intermediary (custodian) — Extending Ringgit financing to its Non-Resident client to fund the client\'s purchase of Ringgit-denominated securities. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part F, Para 12',
    rationale: 'Part F, Para 12: a NR Intermediary or NRFI is prohibited from providing Ringgit financing to its clients.',
  },
  {
    id: 'dq-n4-17', notice: 4, type: 'verdict',
    q: 'Non-Resident Financial Institution — Making a Ringgit payment via its External Account to settle a Ringgit Asset trade on behalf of its Non-Resident client. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part F, Para 10',
    rationale: 'Part F, Para 10: a NRFI may make Ringgit payments for the purpose of settling its NR client\'s trade, via the External Account.',
  },
  {
    id: 'dq-n4-21', notice: 4, type: 'verdict',
    q: 'Resident Intermediary (custodian/broker) — Commingling Resident and Non-Resident client funds within a single Foreign Currency Account, with no segregation. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part F, Para 17',
    rationale: 'Part F, Para 17: a Resident Intermediary must segregate Resident and Non-Resident client funds within its FCA — commingling is not permitted.',
  },
  {
    id: 'dq-n4-22', notice: 4, type: 'verdict',
    q: 'Non-Resident individual — Opening and maintaining a Foreign Currency Account with a Licensed Onshore Bank in Malaysia. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part F, Para 18',
    rationale: 'Part F, Para 18: a Non-Resident may maintain a Foreign Currency Account in Malaysia.',
  },
  {
    id: 'dq-n4-23', notice: 4, type: 'verdict',
    q: 'Non-Resident Intermediary acting as custodian — Making a Ringgit payment to settle the purchase of a Ringgit-denominated bond on behalf of its Non-Resident client. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part F, Para 11',
    rationale: 'Part F, Para 11: a NR Intermediary or NRFI acting as custodian may make Ringgit payments for the settlement of Ringgit Asset transactions on behalf of NR clients.',
  },
  {
    id: 'dq-n4-25', notice: 4, type: 'verdict',
    q: 'Non-Resident individual — Making a payment from his External Account without providing the LOB any documentary evidence that the underlying transaction complies with the FEP Notices. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part F, Para 9',
    rationale: 'Part F, Para 9 and footnote 4: payments from an External Account require documentary evidence of compliance with the FEP Notices — without it, the payment should not proceed.',
  },
  {
    id: 'dq-n4-26', notice: 4, type: 'verdict',
    q: 'Resident company — Entering a derivative contract with a Non-Resident counterparty that is referenced to the Ringgit exchange rate, without any approval or registration under Notice 1. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part C, Para 5',
    rationale: 'Part C, Para 5(b): FCY payment to/from a Non-Resident is excluded where it relates to a Ringgit-referenced derivative, unless approved — no approval exists here.',
  },
  {
    id: 'dq-n4-27', notice: 4, type: 'verdict',
    q: 'Non-Resident hedge fund — Entering an Exchange Rate Derivative transaction and making an FCY payment in connection with it, without being registered or approved under Notice 1. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part C, Para 5',
    rationale: 'Part C, Para 5(c): FCY payment to/from a Non-Resident is excluded where it relates to an Exchange Rate Derivative by that Non-Resident, unless approved under Notice 1 — no such approval exists here.',
  },
  {
    id: 'dq-n4-28', notice: 4, type: 'verdict',
    q: 'Two Non-Resident companies — Making a Foreign Currency payment of USD2 million between each other, for the purchase of equipment located overseas (amount: USD 2,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part C, Para 6',
    rationale: 'Part C, Para 6: a Non-Resident may pay another Non-Resident in FCY for any purpose.',
  },
  {
    id: 'dq-n4-29', notice: 4, type: 'verdict',
    q: 'Resident individual travelling abroad — Receiving a Foreign Currency reimbursement of miscellaneous travel expenses from a friend who is also a Resident, while both are temporarily overseas. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q2',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q2: a Resident may receive an FCY advance or reimbursement of miscellaneous expenses from another Resident while abroad.',
  },
  {
    id: 'dq-n4-30', notice: 4, type: 'verdict',
    q: 'Resident individual investor — Paying subscription monies for a Foreign Currency-denominated unit trust fund, in the fund\'s base currency, to a Resident fund management company. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q4',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q4: FC unit trust subscription, redemption and fee payments may be made in the fund\'s base currency.',
  },
  {
    id: 'dq-n4-32', notice: 4, type: 'verdict',
    q: 'Two Resident individuals, joint accountholders, BOTH of whom have Domestic Ringgit Borrowing (each has two outstanding housing loans) — Jointly converting RM1.8 million from their joint Ringgit account into a joint foreign currency fixed deposit this calendar year (amount: RM 1,800,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q7',
    rationale: 'Notice 4 "Payment in Foreign Currency by Resident" FAQ Q7: DRB in a joint party caps the WHOLE joint investment at RM2 million combined for two parties — RM1.8 million is within that combined cap.',
  },
  {
    id: 'dq-n4-33', notice: 4, type: 'verdict',
    q: 'Two Resident individuals, joint accountholders; one has DRB (two outstanding vehicle loans) — Jointly converting exactly RM2,000,000 from their joint Ringgit account into a joint foreign currency fixed deposit this calendar year. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Payment in Foreign Currency by Resident — FAQ Q7',
    rationale: 'Notice 4 FAQ Q7: the combined cap for a 2-party joint investment where one party has DRB is RM2 million — exactly RM2,000,000 is within (not exceeding) that combined threshold.',
  },
  {
    id: 'dq-n7-01', notice: 7, type: 'verdict',
    q: 'Resident exporter — Receiving the full value of export proceeds within 4 months of shipment, credited into a Trade FCA maintained with a Licensed Onshore Bank. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(a)',
    rationale: 'Part A, Para 1(a)/(c): full-value receipt within 6 months into a Ringgit account or Trade FCA with a LOB is the standard compliant pattern.',
  },
  {
    id: 'dq-n7-02', notice: 7, type: 'verdict',
    q: 'Resident exporter — Export proceeds still not received 8 months after shipment date, and none of the approved Appendix C circumstances (buyer difficulties, disputes, consignment, testing) apply. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part A, Para 1(c)',
    rationale: 'Part A, Para 1(c): proceeds must be received within 6 months, extendable to 24 months ONLY in approved Appendix C circumstances — none apply here.',
  },
  {
    id: 'dq-n7-04', notice: 7, type: 'verdict',
    q: 'Resident exporter — Export proceeds still outstanding 25 months after shipment, and the exporter has not notified the FEP Authority of the outstanding amount. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part C, Para 5',
    rationale: 'Part C, Para 5: proceeds outstanding beyond 24 months must be notified to the FEP Authority within 21 days after year-end — failing to notify is non-compliant.',
  },
  {
    id: 'dq-n7-05', notice: 7, type: 'verdict',
    q: 'Resident exporter — Receiving the full value of export proceeds exactly 6 months after the shipment date, credited into a Ringgit account with a Licensed Onshore Bank. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(c)',
    rationale: 'Part A, Para 1(c): the standard repatriation window is 6 months from shipment date — receipt exactly at 6 months is within (not exceeding) that window.',
  },
  {
    id: 'dq-n7-06', notice: 7, type: 'verdict',
    q: 'Resident exporter — Receiving export proceeds 1 day after the standard 6-month repatriation window has lapsed, with none of the Appendix C circumstances applicable. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part A, Para 1(c)',
    rationale: 'Part A, Para 1(c): the 6-month standard window is exceeded by 1 day with no approved Appendix C exception in play — this is technically non-compliant absent an extension.',
  },
  {
    id: 'dq-n7-09', notice: 7, type: 'verdict',
    q: 'Resident exporter — Export proceeds still outstanding 24 months and 1 day after shipment; the underlying dispute has since been resolved, but the exporter has not notified the FEP Authority. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Part C, Para 5',
    rationale: 'Part C, Para 5: once outstanding beyond 24 months, the exporter must notify the FEP Authority within 21 days after calendar year-end — not having notified breaches this obligation regardless of the underlying dispute being resolved.',
  },
  {
    id: 'dq-n7-10', notice: 7, type: 'verdict',
    q: 'Resident exporter — Exporting goods on a consignment sale basis with an agreed 24-month credit term to the Non-Resident consignee, receiving full proceeds within that 24-month window. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(c)',
    rationale: 'Part A, Para 1(c) and Appendix C(2): consignment sale arrangements may have credit terms up to 24 months — receipt within that window is compliant.',
  },
  {
    id: 'dq-n7-11', notice: 7, type: 'verdict',
    q: 'Resident exporter (industrial equipment manufacturer) — Exporting machinery for overseas testing and commissioning under a 20-month credit term, receiving full proceeds within that period. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(c)',
    rationale: 'Part A, Para 1(c) and Appendix C(2): goods exported for testing or commissioning may carry credit terms up to 24 months — 20 months is within that window.',
  },
  {
    id: 'dq-n7-12', notice: 7, type: 'verdict',
    q: 'Resident exporter — Receiving export proceeds net of agency commission, advertising expenses, and freight and insurance charges, in line with the sale contract. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(b)',
    rationale: 'Part A, Para 1(b) and Appendix A(a)/(b): agency commission, advertising, handling, freight and insurance are approved deductions from full export proceeds value.',
  },
  {
    id: 'dq-n7-13', notice: 7, type: 'verdict',
    q: 'Resident exporter — Receiving export proceeds reduced by an agreed discount to settle the Non-Resident buyer\'s legitimate quality claim on a shipment. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(b)',
    rationale: 'Part A, Para 1(b) and Appendix A(e): a deduction for a quality or quantity claim by the buyer is an approved deduction from the full export proceeds value.',
  },
  {
    id: 'dq-n7-14', notice: 7, type: 'verdict',
    q: 'Resident exporter — Writing off export proceeds owed by a Non-Resident buyer that has since entered liquidation, with documentary evidence of the liquidation proceedings. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(b)',
    rationale: 'Part A, Para 1(b) and Appendix A(j)/Appendix B(b): write-off is an approved offsetting arrangement where the buyer is under liquidation.',
  },
  {
    id: 'dq-n7-15', notice: 7, type: 'verdict',
    q: 'Resident individual relocating overseas — Exporting personal effects and household items as part of relocation abroad, with no sale or export proceeds expected. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2 and Appendix D(b): personal effects not for sale are exempt from the export-proceeds receipt obligation entirely.',
  },
  {
    id: 'dq-n7-16', notice: 7, type: 'verdict',
    q: 'Resident trader — Exporting goods to a neighbouring country under a recognised border trade agreement arrangement. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2 and Appendix D(a): goods exported under a border trade agreement are exempt from the standard export-proceeds receipt obligation.',
  },
  {
    id: 'dq-n7-17', notice: 7, type: 'verdict',
    q: 'Resident manufacturer — Exporting goods to an overseas trade exhibition with the clear intention of reimporting them into Malaysia after the exhibition concludes, no sale involved. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 2',
    rationale: 'Part A, Para 2 and Appendix D(b): goods exported for exhibition and reimported are exempt from the export-proceeds receipt obligation.',
  },
  {
    id: 'dq-n7-19', notice: 7, type: 'verdict',
    q: 'Resident exporter — Retaining USD2 million of export proceeds in a Trade Foreign Currency Account with a Licensed Onshore Bank for over 3 years, without converting to Ringgit (amount: USD 2,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q10',
    rationale: 'Notice 7 "Export of Goods" FAQ Q10: there is no time limit on retaining export proceeds in a Trade FCA once properly received within the repatriation window.',
  },
  {
    id: 'dq-n7-20', notice: 7, type: 'verdict',
    q: 'Resident exporter — Opening and maintaining three separate Trade Foreign Currency Accounts with different Licensed Onshore Banks for different export contracts. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q15',
    rationale: 'Notice 7 "Export of Goods" FAQ Q15: a Resident exporter may open multiple Trade FCAs.',
  },
  {
    id: 'dq-n7-21', notice: 7, type: 'verdict',
    q: 'Resident exporter with Domestic Ringgit Borrowing — Using retained Trade FCA export proceeds of RM3 million equivalent to invest in foreign-listed equities, with no other FC asset investment so far this year (amount: RM 3,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q16',
    rationale: 'Notice 7 "Export of Goods" FAQ Q16: export proceeds retained in FC may be used to invest in FC assets, but remain subject to the Notice 3 investment limit for a Resident with DRB — here the funds are FCY-sourced (not Ringgit-converted), so the cap does not bite this transaction.',
  },
  {
    id: 'dq-n7-22', notice: 7, type: 'verdict',
    q: 'Resident company with no export proceeds of its own — Converting Ringgit to US Dollars with a Licensed Onshore Bank to settle an outstanding import payment obligation. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q17',
    rationale: 'Notice 7 "Export of Goods" FAQ Q17: a Resident without export proceeds may still convert Ringgit to FCY for import payment or FCY Borrowing repayment obligations.',
  },
  {
    id: 'dq-n7-24', notice: 7, type: 'verdict',
    q: 'Resident exporter with Domestic Ringgit Borrowing — Transferring RM80 million equivalent from an Investment FCA back into a Trade FCA (amount: RM 80,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q18',
    rationale: 'Notice 7 "Export of Goods" FAQ Q18: transfer from an Investment FCA back to a Trade FCA is unrestricted, unlike the reverse direction.',
  },
  {
    id: 'dq-n7-25', notice: 7, type: 'verdict',
    q: 'Resident trading company that both exports and imports goods — Offsetting RM4 million of export proceeds receivable against RM4 million of import payments owed to the same overseas counterparty group, with supporting documentation (amount: RM 4,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Part A, Para 1(b)',
    rationale: 'Part A, Para 1(b) and Appendix B(a): offsetting export proceeds against import payment obligations is an approved arrangement.',
  },
  {
    id: 'dq-n7-26', notice: 7, type: 'verdict',
    q: 'Resident exporter — Offsetting export proceeds against an FC obligation that has not yet been incurred, but is merely anticipated for a future transaction. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Export of Goods — FAQ Q12',
    rationale: 'Notice 7 "Export of Goods" FAQ Q12: offsetting is only permitted against FC obligations already incurred under a Firm Commitment — not merely anticipated future obligations.',
  },
  {
    id: 'dq-n7-27', notice: 7, type: 'verdict',
    q: 'Resident exporter — Attempting to offset export proceeds receivable directly against the cost of an overseas property investment, without any LOB-facilitated trade financing arrangement. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 1,
    ref: 'Export of Goods — FAQ Q14',
    rationale: 'Notice 7 "Export of Goods" FAQ Q14: export proceeds cannot be offset against overseas investments or direct commodity hedging with a Non-Resident counterparty.',
  },
  {
    id: 'dq-n7-28', notice: 7, type: 'verdict',
    q: 'Resident exporter within a multinational Group — Offsetting export proceeds against the repayment of FCY Borrowing obtained under Notice 2, using a global offsetting arrangement administered by the Group treasury centre. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q11',
    rationale: 'Notice 7 "Export of Goods" FAQ Q11: detailed approved offsetting arrangements include offsetting against FCY Borrowing repayment under Notice 2, including via global offsetting / TMC structures.',
  },
  {
    id: 'dq-n7-29', notice: 7, type: 'verdict',
    q: 'Resident IT consulting company — Providing consulting services to an overseas client and receiving payment 9 months after invoicing, with no goods shipment involved. What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q3',
    rationale: 'Notice 7 "Export of Goods" FAQ Q3: the repatriation timeline obligations under Notice 7 apply only to export of goods, not export of services or merchanting trade — there is no 6-month deadline for this service payment.',
  },
  {
    id: 'dq-n7-30', notice: 7, type: 'verdict',
    q: 'Resident exporter with annual gross exports of exactly RM249 million in the preceding year — Not having submitted any report to the FEP Authority regarding its export activities (amount: RM 249,000,000). What is the FEP treatment?',
    opts: ['Permitted', 'Not permitted', 'Requires FEP Authority approval'],
    answer: 0,
    ref: 'Export of Goods — FAQ Q19',
    rationale: 'Notice 7 "Export of Goods" FAQ Q19: the reporting obligation is triggered only for exporters with annual gross exports ABOVE RM250 million — RM249 million does not trigger the requirement.',
  },
];

/* ━━━ DAILY SELECTION (pure — no window/document; shared with Node checks) ━━━ */

/* Local-date key, e.g. '2026-07-07'. Matches how the dashboard scopes "this month". */
function challengeDateKey(d) {
  const x = d instanceof Date ? d : new Date();
  const p = n => String(n).padStart(2, '0');
  return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate());
}

/* Days since CHALLENGE_EPOCH + 1 → "FEP Daily Challenge #N". */
function challengeNumber(dateKey) {
  const key = dateKey || challengeDateKey();
  const toUTC = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.floor((toUTC(key) - toUTC(CHALLENGE_EPOCH)) / 86400000) + 1;
}

/* FNV-1a hash of the date key → 32-bit seed. */
function hashDateKey(key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* mulberry32 — tiny deterministic PRNG, seeded per-day. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The one question everyone gets on a given local date. */
function dailyQuestion(dateKey) {
  const key = dateKey || challengeDateKey();
  const rnd = mulberry32(hashDateKey(key));
  return CHALLENGE_BANK[Math.floor(rnd() * CHALLENGE_BANK.length)];
}

/* ━━━ NODE / COMMONJS EXPORT (no-op in the browser) ━━━ */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHALLENGE_EPOCH, CHALLENGE_BANK,
    challengeDateKey, challengeNumber, dailyQuestion,
    hashDateKey, mulberry32,
  };
}
