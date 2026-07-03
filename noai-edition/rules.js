/* ════════════════════════════════════════════════════════════════════
   FEP COMPASS (No-AI edition) — deterministic rules engine
   Maps the Analyst form's structured inputs (who / what / from / to /
   currency / amount) plus follow-up yes-no answers onto hand-authored
   verdicts derived from the FEP Notice text in kb.js. No model, no
   network — pure boolean logic and arithmetic.

   Every citation string in RULE_CITES is copied from a real ref in
   kb.js NOTICES/CHUNKS and must pass verifyCitation() — enforced by
   test/run-rules-test.js. Never add a citation here that does not
   resolve to a provision already in kb.js.

   Loaded as a plain <script> in the browser (before app.js) and as a
   CommonJS module by the Node test harness — keep both paths valid:
   no window/document references, and keep module.exports in sync.
   ════════════════════════════════════════════════════════════════════ */
'use strict';

/* Static, curated reference rates to MYR — NOT live. The CSP forbids any
   network call, so this table is manually maintained (shared with app.js's
   indicative FX estimate display). */
const RM_RATES = { MYR:1, USD:4.70, EUR:5.10, GBP:5.95, SGD:3.48, JPY:0.031, CNY:0.65, AUD:3.10 };
function rmEquivalent(amount, ccy) {
  const r = RM_RATES[ccy];
  const n = Number(amount);
  return r && Number.isFinite(n) ? n * r : null;
}
const fmtCap = n => 'RM' + Number(n).toLocaleString('en-MY');

/* Party classes — keys must match app.js AF_WHO_OPTIONS verbatim. */
const WHO_KIND = {
  'Resident Individual': 'ri',
  'Joint Account — two or more Resident Individuals': 'jr',
  'Joint Account — Resident & Non-Resident Individual': 'jm',
  'Resident Entity (company)': 're',
  'Non-Resident Individual': 'nri',
  'Non-Resident Entity': 'nre',
  'Licensed Onshore Bank (LOB)': 'lob',
};
const isResident = k => k === 'ri' || k === 'jr' || k === 'jm' || k === 're';
const isJoint = k => k === 'jr' || k === 'jm';
const isNonResident = k => k === 'nri' || k === 'nre';

/* Every citation used by the engine — each must resolve against kb.js via
   verifyCitation() (audited by test/run-rules-test.js). */
const RULE_CITES = {
  n1p1:     'Notice 1, Part A, Para 1(1)',
  n1p2:     'Notice 1, Part A, Para 2',
  n1p6:     'Notice 1, Part B, Para 6(1)',
  n1p14:    'Notice 1, Part C, Para 14',
  n1faqR7:  'Notice 1 — Buying and Selling of FX by Resident, FAQ Q7',
  n2pA1:    'Notice 2, Part A, Para 1',
  n2pA2:    'Notice 2, Part A, Para 2',
  n2pA3:    'Notice 2, Part A, Para 3',
  n2pA4:    'Notice 2, Part A, Para 4',
  n2pB6:    'Notice 2, Part B, Para 6',
  n2pB8:    'Notice 2, Part B, Para 8',
  n2pB9:    'Notice 2, Part B, Para 9',
  n2pB10:   'Notice 2, Part B, Para 10',
  n2pD14:   'Notice 2, Part D, Para 14',
  n2pD16:   'Notice 2, Part D, Para 16',
  n2pD17:   'Notice 2, Part D, Para 17',
  n2pF19:   'Notice 2, Part F, Para 19',
  n2pG20:   'Notice 2, Part G, Para 20',
  n2pG21:   'Notice 2, Part G, Para 21',
  n2pG22:   'Notice 2, Part G, Para 22',
  n2pG23:   'Notice 2, Part G, Para 23',
  n3pA1:    'Notice 3, Part A, Para 1',
  n3pA2:    'Notice 3, Part A, Para 2',
  n3pB3:    'Notice 3, Part B, Para 3',
  n3pB4:    'Notice 3, Part B, Para 4',
  n3pC5:    'Notice 3, Part C, Para 5',
  n3faqQ17: 'Notice 3 — Investing in Foreign Currency Asset by Resident, FAQ Q17',
  n3faqNR1: 'Notice 3 — Investing in Malaysia by Non-Resident, FAQ Q1',
  n4pB2:    'Notice 4, Part B, Para 2',
  n4pC4:    'Notice 4, Part C, Para 4',
  n4pC5:    'Notice 4, Part C, Para 5',
  n4pE8:    'Notice 4, Part E, Para 8',
  n4faqQ7:  'Notice 4 — Payment in Foreign Currency by Resident, FAQ Q7',
  n5pA1:    'Notice 5, Part A, Para 1',
  n5pA23:   'Notice 5, Part A, Para 2-3',
  n5pB4:    'Notice 5, Part B, Para 4',
  n6myrImp: 'Notice 6, G.N. 38691/2013 — Ringgit (Import)',
  n6myrExp: 'Notice 6, G.N. 38691/2013 — Ringgit (Export)',
  n6fcy:    'Notice 6, G.N. 38691/2013 — Foreign Currency',
  n7p1c:    'Notice 7, Part A, Para 1(c)',
  n7appC:   'Notice 7, Appendix C',
  n7pC4:    'Notice 7, Part C, Para 4',
  n7pC5:    'Notice 7, Part C, Para 5',
  n7faqQ8:  'Notice 7 — Export of Goods, FAQ Q8',
};

const DRB_HINT = 'DRB = any Ringgit borrowing from another Resident, EXCLUDING one (1) housing loan and one (1) vehicle loan — exactly one of each at the same time is still excluded. More than one of either loan type (counted separately), or any other Resident-to-Resident Ringgit borrowing, counts as DRB.';

/* Follow-up yes/no questions the engine may need. One is asked at a time. */
const RULE_QUESTIONS = {
  drb:          { text: 'Does the Resident have any Domestic Ringgit Borrowing (DRB)?', hint: DRB_HINT },
  drbJoint:     { text: 'Does ANY of the joint accountholders have Domestic Ringgit Borrowing (DRB)?', hint: DRB_HINT },
  drbRes:       { text: 'Does the Resident accountholder have any Domestic Ringgit Borrowing (DRB)?', hint: DRB_HINT },
  drbGroup:     { text: 'Does the entity — or any Resident entity in a parent-subsidiary relationship with it — have Domestic Ringgit Borrowing (DRB)?', hint: 'A Resident entity is deemed to have DRB when a parent-subsidiary-related Resident entity has DRB. Facilities used solely for sundry or employees’ expenses, and borrowing from a Resident Direct Shareholder or parent-subsidiary-related entity, do not count.' },
  fxCounterparty: { text: 'Is the FX transaction undertaken with a Licensed Onshore Bank (LOB) or a licensed money changer?', hint: 'Licensed money changers may only transact on Spot Basis (Notice 1 Part C).' },
  fwdLob:       { text: 'Is the forward / hedging contract entered into with a Licensed Onshore Bank (LOB)?', hint: 'For a Non-Resident, an Appointed Overseas Office (AOO) of a LOB’s banking group also qualifies.' },
  fwdUnderlying:{ text: 'Is there a Firm Commitment or eligible Anticipatory underlying supporting the hedge?', hint: 'A documented obligation, right to receive, or a projected transaction supported by track record. For a Non-Resident, Financial Account Transactions may only be hedged on a Firm Commitment basis.' },
  lenderFamilyEmployer: { text: 'Is the lender a Non-Resident Immediate Family Member, or the borrower’s employer in Malaysia?', hint: 'Immediate Family Member = legal spouse, parent, legitimate child (incl. legally adopted) or legitimate sibling.' },
  lenderFamily: { text: 'Is the lender the borrower’s Immediate Family Member?', hint: 'Legal spouse, parent, legitimate child (incl. legally adopted) or legitimate sibling.' },
  lenderNRFI:   { text: 'Is the lender a Non-Resident Financial Institution (NRFI) — e.g. an overseas bank or a Labuan bank?' },
  lenderGroupNR:{ text: 'Is the lender a Non-Resident within the borrower’s Group (including a Non-Resident Direct Shareholder) — and NOT a NRFI or an SPV used to obtain borrowing from outside the Group?' },
  lenderLobGroup:{ text: 'Is the lender a LOB, an entity within the borrower’s Group, or the borrower’s Direct Shareholder (excluding a NRFI or an SPV used to borrow from outside the Group)?' },
  lenderLOB:    { text: 'Is the lender a Licensed Onshore Bank (LOB)?' },
  borrowerResident: { text: 'Does the guarantee secure a Borrowing obtained by a Resident?' },
  srcAbroad:    { text: 'Is the investment funded with foreign currency sourced from outside Malaysia (excluding Export of Goods proceeds), or with approved foreign currency borrowing under Notice 2?' },
  srcRealEstate:{ text: 'Is the investment real estate outside Malaysia for education, employment or migration — for the investor’s own or an Immediate Family Member’s accommodation?', hint: 'Documentary evidence (e.g. enrolment letter, PR/conditional approval) is required as part of the onshore bank’s due diligence.' },
  srcDIA:       { text: 'Is the investment funded by LOB foreign-currency borrowing for a Direct Investment Abroad (at least 10% equity ownership or control)?' },
  payDerivative:{ text: 'Is the payment for exchange-rate derivatives, derivatives referenced to Ringgit, or FCY-denominated derivatives offered by a Resident (other than approved under Notice 1 or Notice 5)?' },
  subscriberNR: { text: 'Is the security being issued to a Non-Resident?' },
  issuerMDB:    { text: 'Is the issuer a Multilateral Development Bank or a Qualified Development Financial Institution?' },
  expSixMonths: { text: 'Will the FULL value of the proceeds be received in Malaysia (into a Ringgit account or Trade FCA with a LOB) within 6 months of the shipment date, allowing only Appendix A deductions?' },
  expAppendixC: { text: 'Does an approved circumstance apply — buyer in financial difficulty; buyer cancels, delays or disputes payment; FX restrictions in the buyer’s country; quality/quantity claims; fraud; consignment sale; or testing-and-commissioning terms of up to 24 months?' },
};

/* ── result builders ── */
function ask(id) { return { covered: true, ask: { id, ...RULE_QUESTIONS[id] } }; }
function verdict(v, summary, explanation, citeKey, opts = {}) {
  return { covered: true, verdict: {
    verdict: v, summary, explanation,
    citation: RULE_CITES[citeKey],
    conditions: opts.conditions || [],
    warning: opts.warning || null,
    nextStep: opts.nextStep || 'No filing required',
  } };
}
function notCovered(note) { return { covered: false, note: note || null }; }

/* Compares the transaction amount's RM equivalent against a Ringgit cap.
   Returns 'within' | 'over' | 'unknown' (unknown = currency not in the
   static rate table, so the user must verify manually). An amount exactly
   equal to the cap is WITHIN the cap, not over it. */
function cmpCap(ctx, capRM) {
  if (ctx.rm == null) return 'unknown';
  return ctx.rm <= capRM ? 'within' : 'over';
}
function rmNote(ctx) {
  if (ctx.ccy === 'MYR' || ctx.rm == null) return '';
  return ` (≈ ${fmtCap(Math.round(ctx.rm))} at the indicative rate of ${ctx.ccy} 1 = RM${RM_RATES[ctx.ccy]} — not a live rate)`;
}
function unknownRateVerdict(capRM, citeKey, scope) {
  return verdict('CONDITIONAL',
    `Allowed within ${fmtCap(capRM)} equivalent — verify the RM equivalent manually`,
    `The applicable cap is ${fmtCap(capRM)} equivalent ${scope}. The currency entered is not in this app's static rate table, so the RM equivalent could not be computed — convert the amount at a current market rate and compare it against the cap yourself.`,
    citeKey,
    { conditions: [
        `At or below ${fmtCap(capRM)} equivalent: allowed without FEP Authority approval.`,
        `Above ${fmtCap(capRM)} equivalent: prior approval from the FEP Authority is required for the excess.`,
      ],
      warning: 'This is a deterministic rule lookup, not legal advice — verify complex cases with the FEP Authority.' });
}

/* ── Notice 1 — buy/sell FX (spot) ── */
function evalFxSpot(ctx) {
  if (ctx.kind === 'lob') {
    return verdict('PERMITTED', 'Permitted — FX dealing is the LOB’s licensed business',
      'A Licensed Onshore Bank is the licensed counterparty the FEP framework channels FX dealings through: Residents and Non-Residents are allowed to buy or sell foreign currency with a LOB on Spot Basis.',
      'n1p1');
  }
  const a = ctx.a.fxCounterparty;
  if (a === undefined) return ask('fxCounterparty');
  if (!a) {
    if (isResident(ctx.kind)) {
      return verdict('NOT_PERMITTED', 'Not permitted — Residents may only deal FX with a LOB or licensed money changer',
        'A Resident may only buy or sell foreign currency with a Licensed Onshore Bank or a licensed money changer. Dealing directly with any other counterparty (e.g. a Non-Resident or an unlicensed dealer) is not permitted.',
        'n1faqR7',
        { nextStep: 'Redirect the transaction to a LOB or a licensed money changer.' });
    }
    return verdict('NOT_PERMITTED', 'Not permitted — Non-Residents must deal via a LOB or AOO',
      'A Non-Resident is allowed to buy or sell foreign currency against Ringgit on Spot Basis with a LOB or an Appointed Overseas Office. Other channels are not covered by Notice 1’s permissions.',
      'n1p6',
      { nextStep: 'Redirect the transaction to a LOB or an AOO.' });
  }
  if (isResident(ctx.kind)) {
    return verdict('PERMITTED', 'Permitted — spot FX with a licensed counterparty',
      'A Resident is allowed to buy or sell foreign currency against Ringgit (or against another foreign currency) on Spot Basis with a LOB, and on Spot Basis with a licensed money changer.',
      'n1p1',
      { conditions: ['Forward Basis transactions must be with a LOB on a Firm Commitment or Anticipatory basis — licensed money changers may only transact on Spot Basis (Notice 1 Part C, Para 14).'] });
  }
  return verdict('PERMITTED', 'Permitted — spot FX with a LOB or AOO',
    'A Non-Resident is allowed to buy or sell foreign currency against Ringgit on Spot Basis with a LOB or an Appointed Overseas Office.',
    'n1p6');
}

/* ── Notice 1 — forward / hedging ── */
function evalForward(ctx) {
  const lob = ctx.a.fwdLob;
  if (lob === undefined) return ask('fwdLob');
  if (!lob) {
    return verdict('NOT_PERMITTED', 'Not permitted — forwards must be with a LOB' + (isNonResident(ctx.kind) ? ' or AOO' : ''),
      'Forward Basis transactions involving Ringgit must be undertaken with a Licensed Onshore Bank' + (isNonResident(ctx.kind) ? ' or an Appointed Overseas Office' : '') + '. An unlicensed counterparty (e.g. an offshore dealer or unlicensed money changer) is not permitted for forwards.',
      isNonResident(ctx.kind) ? 'n1p6' : 'n1p1',
      { nextStep: 'Redirect the hedge to a LOB' + (isNonResident(ctx.kind) ? ' or AOO.' : '.') });
  }
  const und = ctx.a.fwdUnderlying;
  if (und === undefined) return ask('fwdUnderlying');
  if (und) {
    if (isResident(ctx.kind)) {
      return verdict('PERMITTED', 'Permitted — forward with a LOB on a supported underlying',
        'A Resident is allowed to buy or sell foreign currency against Ringgit on Forward Basis with a LOB on a Firm Commitment or Anticipatory basis.',
        'n1p1',
        { conditions: [
            'The forward must be terminated if the Firm Commitment ceases to exist or the anticipated transaction does not materialise.',
            'An over-hedged position must be cancelled.',
          ] });
    }
    return verdict('PERMITTED', 'Permitted — forward with a LOB/AOO on a supported underlying',
      'A Non-Resident is allowed to transact on Forward Basis with a LOB or AOO for Current Account Transactions (Firm Commitment or Anticipatory basis) or Financial Account Transactions (Firm Commitment basis only).',
      'n1p6',
      { conditions: [
          'Financial Account Transactions (e.g. investment flows) may only be hedged on a Firm Commitment basis.',
          'The forward must be terminated if the Firm Commitment ceases or the anticipated transaction does not materialise.',
        ] });
  }
  return verdict('REQUIRES_APPROVAL', 'Registration required — no underlying commitment for the hedge',
    'Hedging without documentary evidence of an underlying is only available to Institutional Investors registered with the FEP Authority under the Dynamic Hedging Framework (one-off registration). Without that registration — or an underlying commitment — the forward is not covered by Notice 1’s permissions.',
    'n1p2',
    { warning: 'Forwards without any underlying can amount to speculation on the Ringgit, which the FEP framework does not permit.',
      nextStep: 'If eligible, complete the one-off Dynamic Hedging Framework registration via https://bnm.my/fep; otherwise obtain an underlying commitment before hedging.' });
}

/* ── Notice 2 — borrowing ── */
function evalBorrowing(ctx) {
  const myr = ctx.ccy === 'MYR';
  if (ctx.kind === 'ri' || isJoint(ctx.kind)) {
    if (myr) {
      const fam = ctx.a.lenderFamilyEmployer;
      if (fam === undefined) return ask('lenderFamilyEmployer');
      if (fam) {
        return verdict('PERMITTED', 'Permitted — unlimited Ringgit borrowing from immediate family or employer',
          'A Resident Individual is allowed to borrow in Ringgit in ANY amount from a Non-Resident Immediate Family Member, or from an employer in Malaysia for use in Malaysia subject to the employment contract terms.',
          'n2pA1');
      }
      const nrfi = ctx.a.lenderNRFI;
      if (nrfi === undefined) return ask('lenderNRFI');
      if (nrfi) {
        return verdict('NOT_PERMITTED', 'Not permitted — Ringgit borrowing from a NRFI',
          'The RM1 million Ringgit borrowing allowance for a Resident Individual explicitly EXCLUDES borrowing from a Non-Resident Financial Institution — this includes overseas banks and Labuan banks.',
          'n2pA2');
      }
      const c = cmpCap(ctx, 1e6);
      if (c === 'unknown') return unknownRateVerdict(1e6, 'n2pA2', 'in aggregate for Ringgit borrowing by a Resident Individual from a Non-Resident (excluding NRFI)');
      if (c === 'within') {
        return verdict('CONDITIONAL', `Allowed within the RM1 million aggregate cap${rmNote(ctx)}`,
          `A Resident Individual, sole proprietor or General Partnership may borrow in Ringgit up to RM1 million IN AGGREGATE from a Non-Resident (excluding a NRFI). The amount entered${rmNote(ctx)} does not exceed the cap.`,
          'n2pA2',
          { conditions: [
              'The funds must be used in Malaysia.',
              'The RM1 million cap is an aggregate across the individual and any sole proprietorship or General Partnership they own — count existing Ringgit borrowing from Non-Residents toward it.',
            ] });
      }
      return verdict('REQUIRES_APPROVAL', `Exceeds the RM1 million aggregate cap${rmNote(ctx)}`,
        `The amount entered${rmNote(ctx)} exceeds the RM1 million aggregate cap on Ringgit borrowing by a Resident Individual from a Non-Resident (excluding NRFI). Borrowing beyond the cap requires prior written approval from the FEP Authority.`,
        'n2pA2',
        { nextStep: 'Apply to the FEP Authority via https://bnm.my/fep before drawing down.' });
    }
    const fam = ctx.a.lenderFamily;
    if (fam === undefined) return ask('lenderFamily');
    if (fam) {
      return verdict('PERMITTED', 'Permitted — unlimited FCY borrowing from an Immediate Family Member',
        'A Resident Individual is allowed to borrow in Foreign Currency in ANY amount from his Immediate Family Member.',
        'n2pA3');
    }
    const c = cmpCap(ctx, 10e6);
    if (c === 'unknown') return unknownRateVerdict(10e6, 'n2pA4', 'in aggregate for foreign currency borrowing by a Resident Individual from a LOB or Non-Resident');
    if (c === 'within') {
      return verdict('CONDITIONAL', `Allowed within the RM10 million equivalent aggregate cap${rmNote(ctx)}`,
        `A Resident Individual, sole proprietor or General Partnership may borrow in Foreign Currency up to RM10 million equivalent IN AGGREGATE from a LOB or a Non-Resident. The amount entered${rmNote(ctx)} does not exceed the cap.`,
        'n2pA4',
        { conditions: ['The RM10 million cap aggregates FCY borrowing across the individual and any sole proprietorship or General Partnership they own.'] });
    }
    return verdict('REQUIRES_APPROVAL', `Exceeds the RM10 million equivalent aggregate cap${rmNote(ctx)}`,
      `The amount entered${rmNote(ctx)} exceeds the RM10 million equivalent aggregate cap on foreign currency borrowing by a Resident Individual from a LOB or Non-Resident. The excess requires prior written approval from the FEP Authority.`,
      'n2pA4',
      { nextStep: 'Apply to the FEP Authority via https://bnm.my/fep before drawing down.' });
  }
  if (ctx.kind === 're') {
    if (myr) {
      const grp = ctx.a.lenderGroupNR;
      if (grp === undefined) return ask('lenderGroupNR');
      if (grp) {
        return verdict('CONDITIONAL', 'Allowed in any amount — Ringgit borrowing from a Non-Resident within the Group',
          'A Resident Entity is allowed to borrow in Ringgit in ANY amount from a Non-Resident within its Group (including a Non-Resident Direct Shareholder), excluding a NRFI or a Non-Resident SPV used to obtain borrowing from outside the Group.',
          'n2pB6',
          { conditions: ['The borrowing must finance Real Sector Activity in Malaysia (production or consumption of goods and services, excluding activities of a financial nature).'] });
      }
      const c = cmpCap(ctx, 1e6);
      if (c === 'unknown') return unknownRateVerdict(1e6, 'n2pB8', 'in aggregate for Ringgit borrowing by a Resident Entity from a Non-Resident outside its Group (excluding NRFI)');
      if (c === 'within') {
        return verdict('CONDITIONAL', `Allowed within the RM1 million aggregate cap${rmNote(ctx)}`,
          `A Resident Entity may borrow in Ringgit for use in Malaysia up to RM1 million in aggregate from a Non-Resident (excluding a NRFI). The amount entered${rmNote(ctx)} does not exceed the cap. Borrowing from a Multilateral Development Bank or Qualified DFI is unlimited under the same paragraph.`,
          'n2pB8',
          { conditions: [
              'The funds must be used in Malaysia.',
              'The RM1 million cap aggregates Ringgit borrowing across Resident Entities in a parent-subsidiary relationship.',
            ] });
      }
      return verdict('REQUIRES_APPROVAL', `Exceeds the RM1 million aggregate cap${rmNote(ctx)}`,
        `The amount entered${rmNote(ctx)} exceeds the RM1 million aggregate cap on Ringgit borrowing by a Resident Entity from a Non-Resident outside its Group (excluding NRFI). Beyond the cap, prior written approval from the FEP Authority is required — unless the borrowing is restructured through a permitted route (e.g. issuance of Ringgit Corporate Bond/Sukuk under Part B Para 7, or a Group lender under Para 6).`,
        'n2pB8',
        { nextStep: 'Apply to the FEP Authority via https://bnm.my/fep, or restructure via a permitted route (Group lender, or Ringgit Corporate Bond/Sukuk issuance).' });
    }
    const lg = ctx.a.lenderLobGroup;
    if (lg === undefined) return ask('lenderLobGroup');
    if (lg) {
      return verdict('PERMITTED', 'Permitted — unlimited FCY borrowing from a LOB, Group entity or Direct Shareholder',
        'A Resident Entity is allowed to borrow in Foreign Currency in ANY amount from a LOB, an entity within its Group, or its Direct Shareholder.',
        'n2pB9',
        { warning: 'The unlimited allowance does NOT extend to a NRFI or a Non-Resident SPV used to obtain borrowing from outside the Group — those lenders fall under the RM100 million cap (Part B, Para 10).' });
    }
    const c = cmpCap(ctx, 100e6);
    if (c === 'unknown') return unknownRateVerdict(100e6, 'n2pB10', 'in aggregate for foreign currency borrowing by a Resident Entity from outside its Group (or from a NRFI/SPV)');
    if (c === 'within') {
      return verdict('CONDITIONAL', `Allowed within the RM100 million equivalent aggregate cap${rmNote(ctx)}`,
        `A Resident Entity may borrow in Foreign Currency up to RM100 million equivalent IN AGGREGATE from a Non-Resident outside its Group, a NRFI, or a Non-Resident SPV used to borrow from outside the Group. The amount entered${rmNote(ctx)} does not exceed the cap.`,
        'n2pB10',
        { conditions: ['The RM100 million cap is computed on a parent-subsidiary group basis — count existing FCY borrowing across the group toward it.'] });
    }
    return verdict('REQUIRES_APPROVAL', `Exceeds the RM100 million equivalent aggregate cap${rmNote(ctx)}`,
      `The amount entered${rmNote(ctx)} exceeds the RM100 million equivalent group-aggregate cap on foreign currency borrowing by a Resident Entity from outside its Group. The excess requires prior written approval from the FEP Authority.`,
      'n2pB10',
      { nextStep: 'Apply to the FEP Authority via https://bnm.my/fep before drawing down.' });
  }
  if (isNonResident(ctx.kind)) {
    if (myr) {
      const lob = ctx.a.lenderLOB;
      if (lob === undefined) return ask('lenderLOB');
      if (lob) {
        return verdict('CONDITIONAL', 'Allowed — Ringgit borrowing from a LOB for specific purposes',
          'A Non-Resident is allowed to borrow in Ringgit from a LOB: in any amount for trade financing of goods/services settled with a Resident; up to an overdraft of max 2 business days (no roll-over) to avoid Bursa/RENTAS settlement failure; or up to RM10 million via repurchase or sell-buy-back agreement.',
          'n2pD16',
          { conditions: ['The borrowing must fall within one of the listed purposes — general-purpose Ringgit credit from a LOB to a Non-Resident is not on the list.'] });
      }
      return verdict('CONDITIONAL', 'Allowed — Ringgit borrowing from a Resident for Real Sector Activity',
        'A Non-Resident (excluding a NRFI) is allowed to borrow in Ringgit in any amount from a Resident to finance Real Sector Activity in Malaysia, or from a Resident stockbroker for margin financing on Bursa Malaysia. A Non-Resident Individual may additionally borrow any amount from an Immediate Family Member, a licensed insurer (up to the policy’s cash surrender value) or a Malaysian employer (Part D, Para 13).',
        'n2pD14',
        { conditions: ['The Ringgit funds must finance Real Sector Activity in Malaysia (or fall under one of the other listed permissions).'] });
    }
    return verdict('CONDITIONAL', 'Allowed — FCY borrowing by a Non-Resident',
      'A Non-Resident is allowed to borrow in Foreign Currency in any amount from a LOB, a Resident Immediate Family Member, or another Non-Resident in Malaysia. Borrowing from any other Resident is allowed only up to that Resident lender’s investment limits under Parts A and B of Notice 3.',
      'n2pD17',
      { conditions: ['If the lender is a Resident (other than a LOB or Immediate Family Member), the loan counts as the lender’s investment in Foreign Currency Asset and is subject to the lender’s Notice 3 limits.'] });
  }
  return notCovered();
}

/* ── Notice 2 — lending ── */
function evalLending(ctx) {
  return verdict('CONDITIONAL', 'Allowed where the corresponding borrowing is itself permitted',
    'A person is allowed to lend in Ringgit or Foreign Currency to a Resident or Non-Resident for any corresponding Borrowing approved under Notice 2 (or otherwise approved in writing by the FEP Authority). The lending permission therefore mirrors the borrower’s side.',
    'n2pF19',
    { conditions: [
        'Verify the borrower’s side: run a "Borrowing" check from the borrower’s perspective — the loan is only permitted if that borrowing is within Notice 2’s allowances.',
        'A Resident lending Foreign Currency to a Non-Resident should also check Notice 3 — the loan can constitute an investment in Foreign Currency Asset subject to the lender’s limits.',
      ] });
}

/* ── Notice 2 — financial guarantee ── */
function evalGuarantee(ctx) {
  if (ctx.kind === 'lob') {
    return verdict('PERMITTED', 'Permitted — a LOB may give or obtain Financial Guarantees in any amount',
      'A LOB is allowed to obtain a Financial Guarantee in any amount in Ringgit or FCY for its own account, and to give a Financial Guarantee in any amount on behalf of its banking group or client.',
      'n2pG20');
  }
  if (isNonResident(ctx.kind)) {
    return verdict('PERMITTED', 'Permitted — a Non-Resident guarantor may secure a borrowing in any amount',
      'A Resident lender is allowed to obtain a Financial Guarantee in any amount in FCY or Ringgit from a Non-Resident guarantor to secure a Borrowing obtained by a Resident or Non-Resident borrower. Where the underlying Borrowing is approved under Notice 2, the guarantee securing it is deemed approved.',
      'n2pG23');
  }
  const br = ctx.a.borrowerResident;
  if (br === undefined) return ask('borrowerResident');
  if (br) {
    return verdict('PERMITTED', 'Permitted — Resident guarantor securing a Resident’s borrowing',
      'A Resident guarantor is allowed to give a Financial Guarantee in any amount in Ringgit or FCY to secure any Borrowing obtained by a Resident, as approved under Notice 2.',
      'n2pG21',
      { conditions: ['The underlying Borrowing itself must be permitted under Notice 2 — run a "Borrowing" check for the borrower if in doubt.'] });
  }
  return verdict('CONDITIONAL', 'Allowed with two deeming exceptions — Resident guarantor securing a Non-Resident’s borrowing',
    'A non-bank Resident guarantor may give a Financial Guarantee in any amount to secure a Non-Resident’s Borrowing, EXCEPT in two deemed situations that pull the arrangement back under the Resident’s own limits.',
    'n2pG22',
    { conditions: [
        'The underlying borrowing must NOT be ultimately utilised by the Resident guarantor — otherwise it is deemed the guarantor’s own Borrowing, subject to Notice 2 limits.',
        'The Resident must NOT have arranged to repay the FCY borrowing other than under a call-upon in event of default — otherwise it is deemed an investment in FCY Asset, subject to Notice 3 limits.',
      ] });
}

/* ── Notice 3 — investment in FCY asset ── */
function evalInvestment(ctx) {
  if (ctx.kind === 'lob') {
    return verdict('PERMITTED', 'Permitted — unlimited own-account investment',
      'A LOB, licensed insurer or licensed takaful operator may invest in Foreign Currency Asset up to ANY amount for its own account.',
      'n3pC5');
  }
  if (isNonResident(ctx.kind)) {
    return verdict('PERMITTED', 'Permitted — Non-Residents invest in Malaysia freely',
      'A Non-Resident is free to invest in any form of Ringgit Asset in Malaysia, and free to repatriate divestment proceeds, profits, dividends or other income from those investments.',
      'n3faqNR1',
      { conditions: ['Repatriation of funds from Malaysia must be made in Foreign Currency, with any Ringgit conversion undertaken per Notice 1 Part B (Notice 4, Part E, Para 8).'] });
  }
  if (ctx.kind === 're') {
    const drb = ctx.a.drbGroup;
    if (drb === undefined) return ask('drbGroup');
    if (!drb) {
      return verdict('PERMITTED', 'Permitted — unlimited: Resident Entity without DRB',
        'A Resident Entity WITHOUT Domestic Ringgit Borrowing is allowed to invest in Foreign Currency Asset up to ANY amount. No RM limit applies.',
        'n3pB3',
        { warning: 'DRB is assessed on a group basis — if any parent-subsidiary-related Resident entity later takes on DRB, the RM50 million cap starts to apply.' });
    }
    const abroad = ctx.a.srcAbroad;
    if (abroad === undefined) return ask('srcAbroad');
    if (abroad) {
      return verdict('PERMITTED', 'Permitted — unlimited: funded from FCY abroad or approved FCY borrowing',
        'A Resident Entity with DRB may invest ANY amount in Foreign Currency Asset when the investment is funded with foreign currency from outside Malaysia (excluding Export of Goods proceeds) or approved FCY borrowing — sub-clause (a). The RM50 million cap only applies to Ringgit-conversion-sourced investment.',
        'n3pB4');
    }
    const dia = ctx.a.srcDIA;
    if (dia === undefined) return ask('srcDIA');
    if (dia) {
      return verdict('PERMITTED', 'Permitted — unlimited: LOB FCY borrowing for Direct Investment Abroad',
        'A Resident Entity with DRB may invest ANY amount using LOB foreign-currency borrowing for a Direct Investment Abroad (at least 10% equity ownership or control) — sub-clause (b). The RM50 million cap does not apply to this funding route.',
        'n3pB4');
    }
    const c = cmpCap(ctx, 50e6);
    if (c === 'unknown') return unknownRateVerdict(50e6, 'n3pB4', 'per calendar year for a Resident Entity with DRB investing from conversion of Ringgit (group aggregate)');
    if (c === 'within') {
      return verdict('CONDITIONAL', `Allowed within the RM50 million annual cap${rmNote(ctx)}`,
        `A Resident Entity WITH DRB may invest up to RM50 million equivalent per calendar year in Foreign Currency Asset from conversion of Ringgit, Trade FCA funds, LOB FCY borrowing for non-DIA purposes, or swapping of Ringgit-denominated assets. The amount entered${rmNote(ctx)} does not exceed the cap.`,
        'n3pB4',
        { conditions: ['The RM50 million cap is an annual aggregate computed on a parent-subsidiary group basis — count the group’s other FCY-asset investments this calendar year toward it.'] });
    }
    return verdict('REQUIRES_APPROVAL', `Exceeds the RM50 million annual cap${rmNote(ctx)}`,
      `The amount entered${rmNote(ctx)} exceeds the RM50 million equivalent annual group-aggregate cap for a Resident Entity with DRB investing from conversion of Ringgit. Only the amount exceeding the cap requires prior approval from the FEP Authority.`,
      'n3faqQ17',
      { nextStep: 'Apply to the FEP Authority via https://bnm.my/fep for the excess before investing.' });
  }
  if (isJoint(ctx.kind)) {
    const qid = ctx.kind === 'jr' ? 'drbJoint' : 'drbRes';
    const drb = ctx.a[qid];
    if (drb === undefined) return ask(qid);
    if (!drb) {
      return verdict('PERMITTED', 'Permitted — unlimited: no joint accountholder has DRB',
        'When NO party to the joint investment has Domestic Ringgit Borrowing, the investment is governed entirely by Notice 3 Part A Para 1: any amount, onshore or offshore. No RM limit applies.',
        'n3pA1');
    }
    const c = cmpCap(ctx, 2e6);
    if (c === 'unknown') return unknownRateVerdict(2e6, 'n4faqQ7', 'combined per calendar year for two joint accountholders (RM1 million per person) where any party has DRB');
    if (c === 'within') {
      return verdict('CONDITIONAL', `Allowed within the joint RM1 million-per-person annual limit${rmNote(ctx)}`,
        `Because at least one joint party has DRB, Ringgit conversion for the joint investment is capped at RM1 million per accountholder per calendar year — RM2 million combined for two holders. The amount entered${rmNote(ctx)} does not exceed the combined threshold.`,
        'n4faqQ7',
        { conditions: [
            'The limit is RM1 million per accountholder per calendar year — for more than two joint holders, scale the combined threshold accordingly.',
            'Count each holder’s other FCY-asset investments this calendar year toward their RM1 million share.',
          ] });
    }
    return verdict('REQUIRES_APPROVAL', `Exceeds the joint RM1 million-per-person annual limit${rmNote(ctx)}`,
      `Because at least one joint party has DRB, the joint investment is capped at RM1 million per accountholder per calendar year (RM2 million combined for two holders). The amount entered${rmNote(ctx)} exceeds that combined threshold, so the excess requires prior approval from the FEP Authority.`,
      'n4faqQ7',
      { warning: 'If there are more than two joint accountholders, recompute the combined threshold at RM1 million per person before concluding.',
        nextStep: 'Apply to the FEP Authority via https://bnm.my/fep for the excess before investing.' });
  }
  // Resident Individual
  const drb = ctx.a.drb;
  if (drb === undefined) return ask('drb');
  if (!drb) {
    return verdict('PERMITTED', 'Permitted — unlimited: Resident Individual without DRB',
      'A Resident Individual WITHOUT Domestic Ringgit Borrowing is allowed to invest in Foreign Currency Asset up to ANY amount, onshore and offshore. No RM limit applies.',
      'n3pA1',
      { warning: 'Reminder: exactly one (1) housing loan and one (1) vehicle loan at the same time is still WITHOUT DRB — only more than one of either loan type, or other Resident-to-Resident Ringgit borrowing, triggers DRB.' });
  }
  const abroad = ctx.a.srcAbroad;
  if (abroad === undefined) return ask('srcAbroad');
  if (abroad) {
    return verdict('PERMITTED', 'Permitted — unlimited: funded from FCY abroad or approved FCY borrowing',
      'A Resident Individual with DRB may invest ANY amount when the investment is funded with foreign currency from outside Malaysia (excluding Export of Goods proceeds) or approved FCY borrowing under Notice 2 — sub-clause (a). The RM1 million cap only applies to Ringgit-conversion-sourced investment.',
      'n3pA2');
  }
  const re = ctx.a.srcRealEstate;
  if (re === undefined) return ask('srcRealEstate');
  if (re) {
    return verdict('PERMITTED', 'Permitted — unlimited: real estate abroad for education, employment or migration',
      'A Resident Individual with DRB may invest ANY amount in real estate outside Malaysia for education, employment or migration — for their own or an Immediate Family Member’s accommodation only — sub-clause (b). The RM1 million cap does not apply.',
      'n3pA2',
      { conditions: ['Documentary evidence (e.g. enrolment letter, citizenship/PR or conditional approval documents) is required as part of the onshore bank’s due diligence.'] });
  }
  const c = cmpCap(ctx, 1e6);
  if (c === 'unknown') return unknownRateVerdict(1e6, 'n3pA2', 'per calendar year for a Resident Individual with DRB investing from conversion of Ringgit');
  if (c === 'within') {
    return verdict('CONDITIONAL', `Allowed within the RM1 million annual cap${rmNote(ctx)}`,
      `A Resident Individual WITH DRB may invest up to RM1 million equivalent per calendar year in Foreign Currency Asset from conversion of Ringgit, Trade FCA funds, or swapping of Ringgit-denominated financial assets. The amount entered${rmNote(ctx)} does not exceed the cap.`,
      'n3pA2',
      { conditions: ['The RM1 million cap is an annual aggregate including any sole proprietorship or General Partnership owned by the same individual — count other FCY-asset investments this calendar year toward it.'] });
  }
  return verdict('REQUIRES_APPROVAL', `Exceeds the RM1 million annual cap${rmNote(ctx)}`,
    `The amount entered${rmNote(ctx)} exceeds the RM1 million equivalent annual cap for a Resident Individual with DRB investing from conversion of Ringgit. The excess requires prior approval from the FEP Authority (applications typically take up to 14 business days).`,
    'n3pA2',
    { nextStep: 'Apply to the FEP Authority via https://bnm.my/fep for the excess before investing.' });
}

/* ── Notice 5 — issue securities / financial instruments ── */
function evalSecurities(ctx) {
  const myr = ctx.ccy === 'MYR';
  if (ctx.kind === 'lob') {
    return verdict('PERMITTED', 'Permitted — LOB issuance of financial instruments',
      'A LOB is allowed to issue or offer a Financial Instrument denominated in Ringgit in Malaysia to a Non-Resident, or denominated in Foreign Currency to any person.',
      'n5pB4',
      { conditions: [
          'A Ringgit-denominated instrument may only be issued to a NON-RESIDENT under this permission — issuing the same Ringgit instrument to a Resident is not covered.',
          'An instrument referenced to exchange rates must comply with Notice 1.',
        ] });
  }
  if (isNonResident(ctx.kind)) {
    if (!myr) {
      return verdict('PERMITTED', 'Permitted — Non-Resident FCY security issuance in Malaysia',
        'A Non-Resident is allowed to issue a security denominated in Foreign Currency in Malaysia to any person.',
        'n5pA23');
    }
    const mdb = ctx.a.issuerMDB;
    if (mdb === undefined) return ask('issuerMDB');
    if (mdb) {
      return verdict('CONDITIONAL', 'Allowed — MDB/Qualified DFI Ringgit debt issuance',
        'A Multilateral Development Bank or Qualified Development Financial Institution may issue a Ringgit debt security in Malaysia to any person, subject to compliance with Notice 2.',
        'n5pA23',
        { conditions: ['The issuance must comply with Notice 2 (Borrowing) — the proceeds are Ringgit borrowing for use in Malaysia.'] });
    }
    return verdict('NOT_PERMITTED', 'Not permitted — Ringgit issuance by an ordinary Non-Resident',
      'Notice 5’s permission for Ringgit debt issuance in Malaysia by a Non-Resident is limited to a Multilateral Development Bank or Qualified Development Financial Institution. An ordinary Non-Resident issuer is outside that closed list; a Non-Resident may instead issue securities denominated in Foreign Currency in Malaysia.',
      'n5pA23');
  }
  // Resident issuer
  if (!myr) {
    return verdict('PERMITTED', 'Permitted — Resident FCY security issuance to any person',
      'A Resident is allowed to issue a security denominated in Foreign Currency to any person.',
      'n5pA1',
      { conditions: ['Where the issuance involves a DEBT security, the Resident issuer must comply with Notice 2 (Borrowing) — FCY Corporate Bond/Sukuk subscription by another Resident is additionally subject to Notice 3.'] });
  }
  const nr = ctx.a.subscriberNR;
  if (nr === undefined) return ask('subscriberNR');
  if (nr) {
    return verdict('PERMITTED', 'Permitted — Resident Ringgit security issuance to a Non-Resident',
      'A Resident is allowed to issue a security denominated in Ringgit in Malaysia to a Non-Resident.',
      'n5pA1',
      { conditions: ['Where the issuance involves a DEBT security (e.g. bonds, sukuk, redeemable preference shares), the Resident issuer must comply with Notice 2’s borrowing rules.'] });
  }
  return notCovered('A Resident issuing a Ringgit security to another Resident is a purely domestic capital-market matter — the FEP Notices do not restrict it. Refer to Securities Commission requirements instead.');
}

/* ── Notice 4 — payment or receipt ── */
function evalPayment(ctx) {
  const myr = ctx.ccy === 'MYR';
  const crossBorder = ctx.from !== ctx.to && (ctx.from === 'Malaysia' || ctx.to === 'Malaysia' || ctx.from !== 'Malaysia');
  if (isNonResident(ctx.kind)) {
    if (myr) {
      return verdict('CONDITIONAL', 'Allowed for listed purposes — Ringgit payments by a Non-Resident in Malaysia',
        'A Non-Resident is allowed to make or receive payment in Ringgit in Malaysia for: any purpose between Immediate Family Members; income earned or expenses incurred in Malaysia; or settlement of trade in goods/services, a Ringgit Asset, or a commodity murabahah transaction. Ringgit receipts flow through the Non-Resident’s External Account.',
        'n4pB2',
        { conditions: [
            'The purpose must fall within the listed categories — other purposes need FEP Authority approval.',
            'The Non-Resident needs an External Account (Ringgit account with a Malaysian financial institution) to receive Ringgit.',
          ] });
    }
    if (ctx.to !== 'Malaysia') {
      return verdict('PERMITTED', 'Permitted — repatriation of funds from Malaysia in foreign currency',
        'A Non-Resident is allowed to repatriate funds from Malaysia — including income earned and proceeds from divestment of Ringgit Assets — provided the repatriation is made in Foreign Currency, with any Ringgit conversion undertaken per Notice 1 Part B.',
        'n4pE8');
    }
    return verdict('PERMITTED', 'Permitted — foreign currency payment involving a Non-Resident',
      'Foreign currency payments between Non-Residents in Malaysia are allowed for any purpose, and a Resident may make or receive FCY payment to/from a Non-Resident for any purpose subject to the derivative carve-outs in Notice 4 Part C Para 5.',
      'n4pC5',
      { warning: 'Payments for exchange-rate derivatives, Ringgit-referenced derivatives, or FCY derivatives offered by a Resident are excluded unless approved under Notice 1/Notice 5.' });
  }
  // Resident payer/receiver
  if (myr) {
    if (crossBorder) {
      return verdict('CONDITIONAL', 'Allowed for listed purposes — Ringgit settlement with a Non-Resident',
        'Ringgit payments between a Resident and a Non-Resident are allowed for the purposes listed in Notice 4 Part B Para 2 — settlement of trade in goods or services, a Ringgit Asset, income earned or expenses incurred in Malaysia, or any purpose between Immediate Family Members — with the Non-Resident side flowing through an External Account.',
        'n4pB2',
        { conditions: ['The purpose must fall within the listed categories; the Non-Resident counterparty receives/pays via an External Account.'] });
    }
    return notCovered('Ringgit payments between Residents in Malaysia are not restricted by the FEP Notices — no FEP verdict applies.');
  }
  const deriv = ctx.a.payDerivative;
  if (deriv === undefined) return ask('payDerivative');
  if (deriv) {
    return verdict('REQUIRES_APPROVAL', 'Approval needed — payment falls in a derivative carve-out',
      'Foreign currency payments between a Resident and a Non-Resident are allowed for ANY purpose EXCEPT: FCY-denominated derivatives offered by a Resident (unless approved under Notice 5), derivatives referenced to Ringgit, or Exchange Rate Derivatives offered by a Non-Resident (unless approved under Notice 1). This payment falls within a carve-out, so it needs the relevant approval first.',
      'n4pC5',
      { nextStep: 'Check the specific product’s approval status under Notice 1 / Notice 5, or apply to the FEP Authority via https://bnm.my/fep.' });
  }
  if (crossBorder) {
    return verdict('PERMITTED', 'Permitted — FCY payment between a Resident and a Non-Resident',
      'A Resident is allowed to make or receive foreign currency payment to/from a Non-Resident for ANY purpose (outside the derivative carve-outs).',
      'n4pC5',
      { warning: 'Investment-type payments (e.g. remitting funds abroad to buy assets) still count toward the payer’s Notice 3 investment limits — run an "Investment in foreign currency asset" check if applicable.' });
  }
  return verdict('CONDITIONAL', 'Allowed for listed purposes — FCY payment between Residents',
    'Foreign currency payments between Residents are limited to a closed list: any purpose between Immediate Family Members; education, employment or migration outside Malaysia; transactions with a LOB or licensed international takaful operator; settlement of Specified Exchange derivatives or commodity murabahah; miscellaneous expenses abroad; and domestic trade within Global Supply Chain operations.',
    'n4pC4',
    { conditions: ['The purpose must fall within the closed list — FCY payment between Residents for any other purpose requires FEP Authority approval.'] });
}

/* ── Notice 6 — carry cash across the border ── */
function evalCash(ctx) {
  const exporting = ctx.from === 'Malaysia' && ctx.to !== 'Malaysia';
  const importing = ctx.to === 'Malaysia' && ctx.from !== 'Malaysia';
  if (!exporting && !importing) {
    return notCovered('Notice 6 governs physical currency crossing the MALAYSIAN border — set From or To to Malaysia to run this check.');
  }
  if (ctx.ccy === 'MYR') {
    if (exporting) {
      if (ctx.amt <= 1000) {
        return verdict('PERMITTED', 'Permitted — Ringgit notes within the RM1,000 export limit',
          'A traveller leaving Malaysia is allowed to carry out Ringgit currency notes up to RM1,000 per trip. The amount entered is within the limit.',
          'n6myrExp');
      }
      return verdict('NOT_PERMITTED', 'Not permitted — Ringgit notes above RM1,000 cannot be taken out',
        'Export of Ringgit currency notes above RM1,000 per trip is NOT PERMITTED under any circumstances — there is no declaration route that makes a larger amount lawful. Carry foreign currency (declaring above RM30,000 equivalent) or remit the funds electronically instead.',
        'n6myrExp',
        { nextStep: 'Reduce Ringgit notes to RM1,000 or below; move the balance via bank remittance or foreign currency notes (declared if above RM30,000 equivalent).' });
    }
    if (ctx.amt <= 10000) {
      return verdict('PERMITTED', 'Permitted — Ringgit notes within the RM10,000 import threshold',
        'A traveller entering Malaysia may bring in Ringgit currency notes; declaration to customs is only required for amounts above RM10,000. The amount entered is at or below the threshold, so no declaration is needed.',
        'n6myrImp');
    }
    return verdict('CONDITIONAL', 'Allowed with customs declaration — Ringgit import above RM10,000',
      'Import of Ringgit currency notes above RM10,000 must be declared to the Royal Malaysian Customs Department upon arrival. Bringing the amount in without declaration is not permitted.',
      'n6myrImp',
      { conditions: ['Declare the full amount to customs on arrival.'],
        nextStep: 'Complete the customs currency declaration on arrival.' });
  }
  const c = cmpCap(ctx, 30000);
  if (c === 'unknown') {
    return verdict('CONDITIONAL', 'Declare if above RM30,000 equivalent — verify the RM equivalent manually',
      'Foreign currency notes may be carried across the Malaysian border with no upper limit, but amounts exceeding RM30,000 equivalent must be declared to the Royal Malaysian Customs Department. The currency entered is not in this app’s static rate table — convert the amount at a current market rate and compare against RM30,000.',
      'n6fcy',
      { conditions: ['At or below RM30,000 equivalent: no declaration needed.', 'Above RM30,000 equivalent: customs declaration is mandatory — failure to declare is a violation.'] });
  }
  if (c === 'within') {
    return verdict('PERMITTED', `Permitted — foreign currency within the RM30,000 declaration threshold${rmNote(ctx)}`,
      `A traveller may bring foreign currency notes ${exporting ? 'out of' : 'into'} Malaysia with no upper limit; declaration is only required above RM30,000 equivalent. The amount entered${rmNote(ctx)} is at or below the threshold, so no declaration is needed.`,
      'n6fcy');
  }
  return verdict('CONDITIONAL', `Allowed with customs declaration — above RM30,000 equivalent${rmNote(ctx)}`,
    `There is no upper limit on carrying foreign currency notes ${exporting ? 'out of' : 'into'} Malaysia, but the amount entered${rmNote(ctx)} exceeds RM30,000 equivalent, so it MUST be declared to the Royal Malaysian Customs Department. Failure to declare is a violation.`,
    'n6fcy',
    { conditions: ['Declare the full amount to the Royal Malaysian Customs Department.'],
      nextStep: 'Complete the customs currency declaration when crossing the border.' });
}

/* ── Notice 7 — export of goods proceeds ── */
function evalExport(ctx) {
  if (isNonResident(ctx.kind)) {
    return notCovered('Notice 7 applies to RESIDENT exporters of goods — a Non-Resident’s shipments are outside its scope.');
  }
  const six = ctx.a.expSixMonths;
  if (six === undefined) return ask('expSixMonths');
  const bigExporter = ctx.rm != null && ctx.rm > 250e6;
  if (six) {
    return verdict('PERMITTED', 'Permitted — proceeds received in full value within 6 months',
      'A Resident exporter must receive its Export of Goods proceeds in Malaysia — in Ringgit or Foreign Currency, into a Ringgit account or Trade FCA with a LOB — in full value and no later than 6 months from the date of shipment. The stated arrangement meets those requirements.',
      'n7p1c',
      { conditions: [
          'Only Appendix A deductions (e.g. agency commission, freight/insurance, quality claims, short-shipment) may reduce the received value.',
          ...(bigExporter ? ['Annual gross exports above RM250 million trigger the Part C Para 4 reporting obligation to the FEP Authority — submit reports via https://bnm.my/fep as and when required.'] : []),
        ],
        nextStep: bigExporter ? 'If annual gross exports exceed RM250 million, submit Export of Goods reports via https://bnm.my/fep as required (Notice 7, Part C, Para 4).' : 'No filing required' });
  }
  const appC = ctx.a.expAppendixC;
  if (appC === undefined) return ask('expAppendixC');
  if (appC) {
    return verdict('CONDITIONAL', 'Allowed up to 24 months — an approved circumstance applies',
      'Where an Appendix C circumstance applies (buyer difficulties, cancellation/delay/dispute, FX restrictions in the buyer’s country, quality claims, fraud, consignment sale, or testing-and-commissioning terms), the Resident exporter may receive proceeds up to 24 months from the date of shipment without prior FEP Authority approval.',
      'n7appC',
      { conditions: [
          'Document the circumstance — the onshore bank’s due diligence will require evidence.',
          'If proceeds are STILL outstanding after 24 months from shipment, notify the FEP Authority within 21 days after the end of the calendar year via https://bnm.my/fep (Notice 7, Part C, Para 5).',
        ] });
  }
  return verdict('REQUIRES_APPROVAL', 'Approval needed — proceeds beyond 6 months without an approved circumstance',
    'Receiving export proceeds later than 6 months from shipment, where no Appendix C circumstance applies, requires approval from the FEP Authority — and the application must be submitted BEFORE the 6-month period expires.',
    'n7faqQ8',
    { warning: 'Credit terms granted to the buyer cannot exceed 6 months from shipment unless an Appendix C circumstance or FEP Authority approval covers the extension.',
      nextStep: 'Apply to the FEP Authority via https://bnm.my/fep before the 6-month window from the shipment date closes.' });
}

/* WHAT-option → rule function. Keys must match app.js AF_WHAT_GROUPS verbatim. */
const RULES = {
  'Buy / sell foreign currency': evalFxSpot,
  'Forward / hedging contract': evalForward,
  'Borrowing': evalBorrowing,
  'Lending': evalLending,
  'Financial guarantee': evalGuarantee,
  'Investment in foreign currency asset': evalInvestment,
  'Issue securities / financial instrument': evalSecurities,
  'Payment or receipt': evalPayment,
  'Carry cash across the border': evalCash,
  'Export of goods (proceeds)': evalExport,
};

/* Entry point. input = { who, what, from, to, ccy, amt, answers }.
   Returns one of:
   - { covered:false, note }                        → no deterministic rule; show reference lookup
   - { covered:true, ask:{ id, text, hint } }       → a follow-up yes/no answer is needed
   - { covered:true, verdict:{ verdict, summary, explanation, citation, conditions, warning, nextStep } } */
function evaluateRules(input) {
  const kind = WHO_KIND[input.who];
  const fn = RULES[input.what];
  if (!kind || !fn) return notCovered();
  const ctx = {
    kind,
    who: input.who, what: input.what,
    from: input.from, to: input.to,
    ccy: input.ccy, amt: Number(input.amt) || 0,
    rm: rmEquivalent(input.amt, input.ccy),
    a: input.answers || {},
  };
  return fn(ctx);
}

/* ━━━ NODE / COMMONJS EXPORT (no-op in the browser) ━━━ */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RM_RATES, rmEquivalent, WHO_KIND, RULE_CITES, RULE_QUESTIONS,
    RULES, evaluateRules,
  };
}
