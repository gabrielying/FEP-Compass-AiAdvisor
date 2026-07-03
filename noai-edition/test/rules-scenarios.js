/* FEP Compass (No-AI edition) — deterministic rules-engine scenario battery.
   Each scenario feeds the Analyst form's structured inputs plus follow-up
   answers into evaluateRules() and asserts the exact verdict and citation
   key. Ground truth is taken from the FEP Notice text in kb.js.

   expect: 'ask:<questionId>'  → engine must request that follow-up question
   expect: 'notCovered'        → engine must decline (reference lookup fallback)
   expect: '<VERDICT>'         → final verdict; expectCite = RULE_CITES key */
'use strict';

const INV = 'Investment in foreign currency asset';
const RI = 'Resident Individual';
const RE = 'Resident Entity (company)';
const JR = 'Joint Account — two or more Resident Individuals';
const JM = 'Joint Account — Resident & Non-Resident Individual';
const NRI = 'Non-Resident Individual';
const NRE = 'Non-Resident Entity';
const LOB = 'Licensed Onshore Bank (LOB)';

const base = { from: 'Malaysia', to: 'Singapore', ccy: 'MYR', amt: 100000 };
const s = (id, title, input, answers, expect, expectCite) =>
  ({ id, title, input: { ...base, ...input }, answers: answers || {}, expect, expectCite });

module.exports = [
  // ── Notice 3 — investment ──
  s('inv-ask-drb', 'RI investment with no answers asks the DRB question', { who: RI, what: INV }, {}, 'ask:drb'),
  s('inv-ri-nodrb', 'RI without DRB — unlimited', { who: RI, what: INV, amt: 5e6 }, { drb: false }, 'PERMITTED', 'n3pA1'),
  s('inv-ri-drb-within', 'RI with DRB, RM800k conversion — within cap', { who: RI, what: INV, amt: 800000 }, { drb: true, srcAbroad: false, srcRealEstate: false }, 'CONDITIONAL', 'n3pA2'),
  s('inv-ri-drb-atcap', 'RI with DRB, exactly RM1,000,000 — at-cap is within, not exceeding', { who: RI, what: INV, amt: 1000000 }, { drb: true, srcAbroad: false, srcRealEstate: false }, 'CONDITIONAL', 'n3pA2'),
  s('inv-ri-drb-over', 'RI with DRB, RM1.5M conversion — exceeds cap', { who: RI, what: INV, amt: 1500000 }, { drb: true, srcAbroad: false, srcRealEstate: false }, 'REQUIRES_APPROVAL', 'n3pA2'),
  s('inv-ri-drb-usd-over', 'RI with DRB, USD250k ≈ RM1.175M — conversion pushes it over', { who: RI, what: INV, ccy: 'USD', amt: 250000 }, { drb: true, srcAbroad: false, srcRealEstate: false }, 'REQUIRES_APPROVAL', 'n3pA2'),
  s('inv-ri-drb-abroad', 'RI with DRB funded from FCY abroad — sub-clause (a) unlimited', { who: RI, what: INV, amt: 9e6 }, { drb: true, srcAbroad: true }, 'PERMITTED', 'n3pA2'),
  s('inv-ri-drb-realestate', 'RI with DRB, education real estate — sub-clause (b) unlimited', { who: RI, what: INV, amt: 3e6 }, { drb: true, srcAbroad: false, srcRealEstate: true }, 'PERMITTED', 'n3pA2'),
  s('inv-jr-nodrb', 'Joint residents, nobody has DRB — unlimited under Para 1', { who: JR, what: INV, amt: 3e6 }, { drbJoint: false }, 'PERMITTED', 'n3pA1'),
  s('inv-jr-drb-within', 'Joint residents, one has DRB, RM1.8M — within RM2M combined', { who: JR, what: INV, amt: 1800000 }, { drbJoint: true }, 'CONDITIONAL', 'n4faqQ7'),
  s('inv-jr-drb-over', 'Joint residents, one has DRB, RM2.5M — exceeds RM2M combined', { who: JR, what: INV, amt: 2500000 }, { drbJoint: true }, 'REQUIRES_APPROVAL', 'n4faqQ7'),
  s('inv-jm-nodrb', 'Resident+NR joint, Resident has no DRB — unlimited', { who: JM, what: INV, amt: 4e6 }, { drbRes: false }, 'PERMITTED', 'n3pA1'),
  s('inv-re-nodrb', 'Entity without group DRB — unlimited', { who: RE, what: INV, amt: 80e6 }, { drbGroup: false }, 'PERMITTED', 'n3pB3'),
  s('inv-re-drb-within', 'Entity with DRB, RM30M conversion — within RM50M cap', { who: RE, what: INV, amt: 30e6 }, { drbGroup: true, srcAbroad: false, srcDIA: false }, 'CONDITIONAL', 'n3pB4'),
  s('inv-re-drb-over', 'Entity with DRB, RM60M conversion — only excess needs approval', { who: RE, what: INV, amt: 60e6 }, { drbGroup: true, srcAbroad: false, srcDIA: false }, 'REQUIRES_APPROVAL', 'n3faqQ17'),
  s('inv-re-dia', 'Entity with DRB, LOB FCY borrowing for DIA — sub-clause (b) unlimited', { who: RE, what: INV, amt: 200e6 }, { drbGroup: true, srcAbroad: false, srcDIA: true }, 'PERMITTED', 'n3pB4'),
  s('inv-nr', 'Non-Resident investing in Malaysia — free, repatriate in FCY', { who: NRI, what: INV, from: 'Singapore', to: 'Malaysia' }, {}, 'PERMITTED', 'n3faqNR1'),
  s('inv-lob', 'LOB own-account investment — unlimited', { who: LOB, what: INV, amt: 500e6 }, {}, 'PERMITTED', 'n3pC5'),

  // ── Notice 1 — FX dealings ──
  s('fx-lob', 'RI spot FX with a LOB', { who: RI, what: 'Buy / sell foreign currency', ccy: 'USD', amt: 50000 }, { fxCounterparty: true }, 'PERMITTED', 'n1p1'),
  s('fx-unlicensed', 'RI FX directly with a Non-Resident — not permitted', { who: RI, what: 'Buy / sell foreign currency', ccy: 'USD', amt: 50000 }, { fxCounterparty: false }, 'NOT_PERMITTED', 'n1faqR7'),
  s('fx-nr-unlicensed', 'NR FX outside LOB/AOO — not permitted', { who: NRI, what: 'Buy / sell foreign currency', ccy: 'USD', amt: 50000 }, { fxCounterparty: false }, 'NOT_PERMITTED', 'n1p6'),
  s('fwd-nonlob', 'Forward with an unlicensed dealer — not permitted', { who: RE, what: 'Forward / hedging contract', ccy: 'EUR', amt: 1e6 }, { fwdLob: false }, 'NOT_PERMITTED', 'n1p1'),
  s('fwd-underlying', 'Forward with LOB on a firm commitment', { who: RE, what: 'Forward / hedging contract', ccy: 'EUR', amt: 1e6 }, { fwdLob: true, fwdUnderlying: true }, 'PERMITTED', 'n1p1'),
  s('fwd-nounderlying', 'Forward with LOB, no underlying — dynamic hedging registration path', { who: RE, what: 'Forward / hedging contract', ccy: 'USD', amt: 5e6 }, { fwdLob: true, fwdUnderlying: false }, 'REQUIRES_APPROVAL', 'n1p2'),

  // ── Notice 2 — borrowing / lending / guarantee ──
  s('bor-ri-myr-family', 'RI Ringgit borrowing from NR immediate family — unlimited', { who: RI, what: 'Borrowing', ccy: 'MYR', amt: 5e6 }, { lenderFamilyEmployer: true }, 'PERMITTED', 'n2pA1'),
  s('bor-ri-myr-nrfi', 'RI Ringgit borrowing from a Labuan bank (NRFI) — not permitted', { who: RI, what: 'Borrowing', ccy: 'MYR', amt: 500000 }, { lenderFamilyEmployer: false, lenderNRFI: true }, 'NOT_PERMITTED', 'n2pA2'),
  s('bor-ri-myr-within', 'RI Ringgit RM800k from external NR — within RM1M', { who: RI, what: 'Borrowing', ccy: 'MYR', amt: 800000 }, { lenderFamilyEmployer: false, lenderNRFI: false }, 'CONDITIONAL', 'n2pA2'),
  s('bor-ri-myr-over', 'RI Ringgit RM2M from external NR — exceeds RM1M', { who: RI, what: 'Borrowing', ccy: 'MYR', amt: 2e6 }, { lenderFamilyEmployer: false, lenderNRFI: false }, 'REQUIRES_APPROVAL', 'n2pA2'),
  s('bor-ri-fcy-family', 'RI FCY borrowing from immediate family — unlimited', { who: RI, what: 'Borrowing', ccy: 'USD', amt: 5e6 }, { lenderFamily: true }, 'PERMITTED', 'n2pA3'),
  s('bor-ri-fcy-within', 'RI FCY USD2M ≈ RM9.4M — within RM10M', { who: RI, what: 'Borrowing', ccy: 'USD', amt: 2e6 }, { lenderFamily: false }, 'CONDITIONAL', 'n2pA4'),
  s('bor-ri-fcy-over', 'RI FCY USD3M ≈ RM14.1M — exceeds RM10M', { who: RI, what: 'Borrowing', ccy: 'USD', amt: 3e6 }, { lenderFamily: false }, 'REQUIRES_APPROVAL', 'n2pA4'),
  s('bor-re-myr-group', 'Entity Ringgit from NR within Group — real sector, any amount', { who: RE, what: 'Borrowing', ccy: 'MYR', amt: 20e6 }, { lenderGroupNR: true }, 'CONDITIONAL', 'n2pB6'),
  s('bor-re-myr-over', 'Entity Ringgit RM5M from external NR — exceeds RM1M', { who: RE, what: 'Borrowing', ccy: 'MYR', amt: 5e6 }, { lenderGroupNR: false }, 'REQUIRES_APPROVAL', 'n2pB8'),
  s('bor-re-fcy-group', 'Entity FCY from Direct Shareholder — unlimited', { who: RE, what: 'Borrowing', ccy: 'USD', amt: 30e6 }, { lenderLobGroup: true }, 'PERMITTED', 'n2pB9'),
  s('bor-re-fcy-within', 'Entity FCY USD20M ≈ RM94M from external NR — within RM100M', { who: RE, what: 'Borrowing', ccy: 'USD', amt: 20e6 }, { lenderLobGroup: false }, 'CONDITIONAL', 'n2pB10'),
  s('bor-re-fcy-over', 'Entity FCY USD30M ≈ RM141M from external NR — exceeds RM100M', { who: RE, what: 'Borrowing', ccy: 'USD', amt: 30e6 }, { lenderLobGroup: false }, 'REQUIRES_APPROVAL', 'n2pB10'),
  s('bor-nre-myr-lob', 'NR entity Ringgit borrowing from a LOB — listed purposes', { who: NRE, what: 'Borrowing', ccy: 'MYR', amt: 5e6 }, { lenderLOB: true }, 'CONDITIONAL', 'n2pD16'),
  s('bor-nri-fcy', 'NR individual FCY borrowing', { who: NRI, what: 'Borrowing', ccy: 'USD', amt: 1e6 }, {}, 'CONDITIONAL', 'n2pD17'),
  s('lend-any', 'Lending mirrors the borrower-side permission', { who: RE, what: 'Lending', ccy: 'MYR', amt: 1e6 }, {}, 'CONDITIONAL', 'n2pF19'),
  s('guar-lob', 'LOB financial guarantee — any amount', { who: LOB, what: 'Financial guarantee', ccy: 'USD', amt: 50e6 }, {}, 'PERMITTED', 'n2pG20'),
  s('guar-res-res', 'Resident guarantor securing a Resident borrowing', { who: RE, what: 'Financial guarantee', ccy: 'MYR', amt: 10e6 }, { borrowerResident: true }, 'PERMITTED', 'n2pG21'),
  s('guar-res-nr', 'Resident guarantor securing a NR borrowing — deeming exceptions', { who: RE, what: 'Financial guarantee', ccy: 'USD', amt: 10e6 }, { borrowerResident: false }, 'CONDITIONAL', 'n2pG22'),
  s('guar-nr', 'Non-Resident guarantor for a Resident lender', { who: NRE, what: 'Financial guarantee', ccy: 'USD', amt: 10e6 }, {}, 'PERMITTED', 'n2pG23'),

  // ── Notice 5 — securities ──
  s('sec-res-fcy', 'Resident issuing an FCY security to any person', { who: RE, what: 'Issue securities / financial instrument', ccy: 'USD', amt: 10e6 }, {}, 'PERMITTED', 'n5pA1'),
  s('sec-res-myr-nr', 'Resident issuing a Ringgit security to a Non-Resident', { who: RE, what: 'Issue securities / financial instrument', ccy: 'MYR', amt: 10e6 }, { subscriberNR: true }, 'PERMITTED', 'n5pA1'),
  s('sec-res-myr-res', 'Resident issuing Ringgit security to a Resident — outside FEP scope', { who: RE, what: 'Issue securities / financial instrument', ccy: 'MYR', amt: 10e6 }, { subscriberNR: false }, 'notCovered'),
  s('sec-nre-myr', 'Ordinary NR entity issuing Ringgit debt in Malaysia — closed list', { who: NRE, what: 'Issue securities / financial instrument', ccy: 'MYR', amt: 10e6 }, { issuerMDB: false }, 'NOT_PERMITTED', 'n5pA23'),
  s('sec-nre-mdb', 'MDB issuing Ringgit debt security — allowed subject to Notice 2', { who: NRE, what: 'Issue securities / financial instrument', ccy: 'MYR', amt: 100e6 }, { issuerMDB: true }, 'CONDITIONAL', 'n5pA23'),
  s('sec-lob', 'LOB issuing financial instruments', { who: LOB, what: 'Issue securities / financial instrument', ccy: 'MYR', amt: 10e6 }, {}, 'PERMITTED', 'n5pB4'),

  // ── Notice 4 — payments ──
  s('pay-res-fcy-cross', 'Resident FCY payment to a NR abroad — any purpose', { who: RI, what: 'Payment or receipt', ccy: 'USD', amt: 20000, from: 'Malaysia', to: 'United Kingdom' }, { payDerivative: false }, 'PERMITTED', 'n4pC5'),
  s('pay-res-fcy-deriv', 'Resident FCY payment for a Ringgit-referenced derivative — carve-out', { who: RI, what: 'Payment or receipt', ccy: 'USD', amt: 20000, from: 'Malaysia', to: 'United Kingdom' }, { payDerivative: true }, 'REQUIRES_APPROVAL', 'n4pC5'),
  s('pay-res-fcy-domestic', 'FCY payment between Residents in Malaysia — closed list', { who: RE, what: 'Payment or receipt', ccy: 'USD', amt: 100000, from: 'Malaysia', to: 'Malaysia' }, { payDerivative: false }, 'CONDITIONAL', 'n4pC4'),
  s('pay-res-myr-cross', 'Resident Ringgit settlement with a NR', { who: RE, what: 'Payment or receipt', ccy: 'MYR', amt: 100000, from: 'Malaysia', to: 'Singapore' }, {}, 'CONDITIONAL', 'n4pB2'),
  s('pay-res-myr-domestic', 'Ringgit payment between Residents — not an FEP matter', { who: RI, what: 'Payment or receipt', ccy: 'MYR', amt: 100000, from: 'Malaysia', to: 'Malaysia' }, {}, 'notCovered'),
  s('pay-nr-myr', 'NR Ringgit payment in Malaysia — listed purposes via External Account', { who: NRI, what: 'Payment or receipt', ccy: 'MYR', amt: 50000, from: 'Malaysia', to: 'Malaysia' }, {}, 'CONDITIONAL', 'n4pB2'),
  s('pay-nr-repat', 'NR repatriating funds abroad in FCY', { who: NRI, what: 'Payment or receipt', ccy: 'USD', amt: 500000, from: 'Malaysia', to: 'Singapore' }, {}, 'PERMITTED', 'n4pE8'),

  // ── Notice 6 — cash across the border ──
  s('cash-myr-out-ok', 'Carrying RM800 out — within RM1,000', { who: RI, what: 'Carry cash across the border', ccy: 'MYR', amt: 800, from: 'Malaysia', to: 'Thailand' }, {}, 'PERMITTED', 'n6myrExp'),
  s('cash-myr-out-over', 'Carrying RM5,000 out — hard cap, no declaration route', { who: RI, what: 'Carry cash across the border', ccy: 'MYR', amt: 5000, from: 'Malaysia', to: 'Thailand' }, {}, 'NOT_PERMITTED', 'n6myrExp'),
  s('cash-myr-in-ok', 'Bringing RM9,000 in — at/below RM10,000, no declaration', { who: RI, what: 'Carry cash across the border', ccy: 'MYR', amt: 9000, from: 'Singapore', to: 'Malaysia' }, {}, 'PERMITTED', 'n6myrImp'),
  s('cash-myr-in-declare', 'Bringing RM15,000 in — declare to customs', { who: RI, what: 'Carry cash across the border', ccy: 'MYR', amt: 15000, from: 'Singapore', to: 'Malaysia' }, {}, 'CONDITIONAL', 'n6myrImp'),
  s('cash-fcy-ok', 'USD5,000 ≈ RM23.5k — below RM30k, no declaration', { who: NRI, what: 'Carry cash across the border', ccy: 'USD', amt: 5000, from: 'Malaysia', to: 'Thailand' }, {}, 'PERMITTED', 'n6fcy'),
  s('cash-fcy-declare', 'USD10,000 ≈ RM47k — above RM30k, must declare', { who: NRI, what: 'Carry cash across the border', ccy: 'USD', amt: 10000, from: 'Malaysia', to: 'Thailand' }, {}, 'CONDITIONAL', 'n6fcy'),
  s('cash-noborder', 'No Malaysian border crossing — Notice 6 does not apply', { who: RI, what: 'Carry cash across the border', ccy: 'USD', amt: 5000, from: 'Singapore', to: 'Thailand' }, {}, 'notCovered'),

  // ── Notice 7 — export proceeds ──
  s('exp-within6', 'Full value into Trade FCA within 6 months', { who: RE, what: 'Export of goods (proceeds)', ccy: 'USD', amt: 1e6, from: 'Malaysia', to: 'China' }, { expSixMonths: true }, 'PERMITTED', 'n7p1c'),
  s('exp-appc', 'Buyer dispute — up to 24 months under Appendix C', { who: RE, what: 'Export of goods (proceeds)', ccy: 'USD', amt: 1e6, from: 'Malaysia', to: 'China' }, { expSixMonths: false, expAppendixC: true }, 'CONDITIONAL', 'n7appC'),
  s('exp-late', 'Late proceeds without an approved circumstance — approval before 6 months', { who: RE, what: 'Export of goods (proceeds)', ccy: 'USD', amt: 1e6, from: 'Malaysia', to: 'China' }, { expSixMonths: false, expAppendixC: false }, 'REQUIRES_APPROVAL', 'n7faqQ8'),
  s('exp-nr', 'Non-Resident shipment — outside Notice 7 scope', { who: NRE, what: 'Export of goods (proceeds)', ccy: 'USD', amt: 1e6, from: 'Malaysia', to: 'China' }, {}, 'notCovered'),

  // ── engine mechanics ──
  s('other-notcovered', '"Other" transaction type has no deterministic rule', { who: RI, what: 'Other' }, {}, 'notCovered'),
];
