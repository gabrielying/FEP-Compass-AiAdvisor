#!/usr/bin/env node
/* FEP Compass (No-AI edition) — deterministic rules-engine test harness.
   Fully offline; no model, no network. Two gates:

   1. CITATION AUDIT — every citation string in rules.js RULE_CITES must
      resolve to a real provision in kb.js via the same verifyCitation()
      the app uses at runtime. A citation that fails here would render an
      "Unverified citation" warning in the UI — treated as a hard failure.

   2. SCENARIO BATTERY — test/rules-scenarios.js drives evaluateRules()
      with structured inputs + follow-up answers and asserts the exact
      verdict and citation key (or the expected ask / not-covered result).

   Run: npm test   (or: node test/run-rules-test.js)
   Writes test/last-run-report.json. Exits non-zero on any failure. */
'use strict';

const path = require('path');
const fs = require('fs');
const { verifyCitation } = require(path.join(__dirname, '..', 'kb.js'));
const { RULE_CITES, evaluateRules } = require(path.join(__dirname, '..', 'rules.js'));
const SCENARIOS = require(path.join(__dirname, 'rules-scenarios.js'));

const failures = [];
let passCount = 0;
const check = (id, ok, detail) => {
  if (ok) { passCount++; return; }
  failures.push({ id, detail });
  console.error(`  FAIL ${id}: ${detail}`);
};

console.log('── Gate 1: citation audit ──');
for (const [key, cite] of Object.entries(RULE_CITES)) {
  const { grounded } = verifyCitation(cite);
  check(`cite:${key}`, grounded, `"${cite}" does not resolve to a provision in kb.js`);
}
console.log(`${Object.keys(RULE_CITES).length} citations audited.`);

console.log('── Gate 2: scenario battery ──');
for (const sc of SCENARIOS) {
  const res = evaluateRules({ ...sc.input, answers: sc.answers });
  if (sc.expect === 'notCovered') {
    check(sc.id, res && res.covered === false, `expected notCovered, got ${JSON.stringify(res && (res.ask ? 'ask:' + res.ask.id : res.verdict && res.verdict.verdict))}`);
    continue;
  }
  if (sc.expect.startsWith('ask:')) {
    const want = sc.expect.slice(4);
    check(sc.id, !!(res && res.ask && res.ask.id === want), `expected ask ${want}, got ${JSON.stringify(res && (res.ask ? 'ask:' + res.ask.id : res.covered === false ? 'notCovered' : res.verdict && res.verdict.verdict))}`);
    continue;
  }
  if (!res || !res.covered || !res.verdict) {
    check(sc.id, false, `expected verdict ${sc.expect}, got ${JSON.stringify(res && (res.ask ? 'ask:' + res.ask.id : 'notCovered'))}`);
    continue;
  }
  const v = res.verdict;
  check(sc.id + ':verdict', v.verdict === sc.expect, `expected ${sc.expect}, got ${v.verdict}`);
  if (sc.expectCite) {
    check(sc.id + ':cite', v.citation === RULE_CITES[sc.expectCite], `expected citation ${RULE_CITES[sc.expectCite]}, got ${v.citation}`);
    const { grounded } = verifyCitation(v.citation);
    check(sc.id + ':grounded', grounded, `citation "${v.citation}" is not grounded in kb.js`);
  }
}
console.log(`${SCENARIOS.length} scenarios run.`);

const report = {
  ranAt: new Date().toISOString(),
  citations: Object.keys(RULE_CITES).length,
  scenarios: SCENARIOS.length,
  checksPassed: passCount,
  checksFailed: failures.length,
  failures,
};
fs.writeFileSync(path.join(__dirname, 'last-run-report.json'), JSON.stringify(report, null, 2));

console.log(`\n${passCount} checks passed, ${failures.length} failed.`);
process.exit(failures.length ? 1 : 0);
