#!/usr/bin/env node
/* FEP Compass — automated citation/reasoning stress test, run against a local
   Ollama instance (the same way the AI Compliance Analyst calls it — see
   `callOllama` in app.js). Requires kb.js's real retrieval + system prompt,
   so a wrong verdict or a hallucinated paragraph reference fails the run
   instead of just looking plausible.

   Usage:
     node test/run-stress-test.js [--notice N] [--model NAME] [--url URL] [--verbose]

   Prerequisites: a running Ollama instance with the target model pulled, e.g.
     ollama pull qwen2.5:7b */
'use strict';

const path = require('path');
const fs = require('fs');
const kb = require(path.join(__dirname, '..', 'kb.js'));
const scenarios = require(path.join(__dirname, 'scenarios.js'));

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const OLLAMA_URL = flag('url', 'http://localhost:11434');
const MODEL = flag('model', 'qwen2.5:7b');
const NOTICE_FILTER = flag('notice', null);
const VERBOSE = args.includes('--verbose');

const VALID_VERDICTS = ['PERMITTED', 'NOT_PERMITTED', 'CONDITIONAL', 'REQUIRES_APPROVAL'];

/* ─── mirrors app.js's repairJSON/parseResp exactly, so a response that the
   real app would accept (or reject) is judged the same way here ─── */
function repairJSON(s) {
  let inStr = false, escNext = false; const stack = [];
  for (const ch of s) {
    if (escNext) { escNext = false; continue; }
    if (inStr) {
      if (ch === '\\') escNext = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') stack.pop();
  }
  let out = s;
  if (inStr) out += '"';
  out = out
    .replace(/,\s*"(?:[^"\\]|\\.)*"\s*:?\s*$/, '')
    .replace(/(\{\s*)"(?:[^"\\]|\\.)*"\s*:?\s*$/, '$1')
    .replace(/[,:]\s*$/, '');
  while (stack.length) out += stack.pop() === '{' ? '}' : ']';
  return out;
}
function parseResp(raw) {
  if (!raw) return { ok: false, raw: '' };
  const tryParse = s => { try { const p = JSON.parse(s); if (p && VALID_VERDICTS.includes(p.verdict)) return p; } catch (_) {} return null; };
  let p = tryParse(raw.trim());
  let truncated = false;
  if (!p) {
    const m = raw.replace(/```json\s*|\s*```/g, '').match(/\{[\s\S]*/);
    if (m) {
      p = tryParse(m[0]);
      if (!p) { p = tryParse(repairJSON(m[0].trim())); truncated = !!p; }
    }
  }
  if (p) return { ok: true, partial: truncated, data: p };
  const f = {};
  ['verdict', 'summary', 'explanation', 'citation', 'warning', 'nextStep'].forEach(k => {
    f[k] = (raw.match(new RegExp(`"${k}"\\s*:\\s*"([^"]*)`)) || [])[1];
  });
  if (f.verdict && VALID_VERDICTS.includes(f.verdict) && f.summary) return { ok: true, partial: true, data: { ...f, explanation: f.explanation || 'See raw response.', conditions: [] } };
  return { ok: false, raw };
}

/* ─── citation grounding checks ───
   Refs are structured ({type, num, sub, end}) rather than exact strings, so a
   parent reference like "Para 1" correctly matches a real child ref like
   "Para 1(1)", and "Para 9" matches a real range like "Para 9-10". */
function extractRefTokens(text) {
  const tokens = [];
  const lower = String(text || '').toLowerCase();
  let m;
  const paraRe = /para\.?\s*(\d+)(?:\((\d+)\))?(?:-(\d+))?/g;
  while ((m = paraRe.exec(lower))) {
    tokens.push({ type: 'para', num: Number(m[1]), sub: m[2] != null ? Number(m[2]) : null, end: m[3] != null ? Number(m[3]) : null });
  }
  const faqRe = /faq\s*q\.?\s*(\d+)/g;
  while ((m = faqRe.exec(lower))) tokens.push({ type: 'faq', num: Number(m[1]) });
  return tokens;
}
function tokensMatch(a, b) {
  if (a.type !== b.type) return false;
  if (a.type === 'faq') return a.num === b.num;
  const aEnd = a.end != null ? a.end : a.num;
  const bEnd = b.end != null ? b.end : b.num;
  const numsOverlap = (b.num >= a.num && b.num <= aEnd) || (a.num >= b.num && a.num <= bEnd);
  if (!numsOverlap) return false;
  if (a.sub != null && b.sub != null) return a.sub === b.sub;
  return true;
}
function tokensOverlap(citedTokens, realTokens) {
  return citedTokens.some(c => realTokens.some(r => tokensMatch(c, r)));
}
function extractNoticeNumbers(text) {
  const nums = new Set();
  const re = /\bn(?:otice)?\.?\s*(\d)\b/gi;
  let m;
  while ((m = re.exec(String(text || '')))) nums.add(Number(m[1]));
  return nums;
}
const REF_TOKENS_BY_NOTICE = {};
for (const c of kb.CHUNKS) {
  if (!REF_TOKENS_BY_NOTICE[c.noticeId]) REF_TOKENS_BY_NOTICE[c.noticeId] = [];
  REF_TOKENS_BY_NOTICE[c.noticeId].push(...extractRefTokens(c.ref));
}

function buildAnalystQuery(s) {
  const parts = [`WHO: ${s.who}`, `WHAT: ${s.what}`];
  if (s.where) parts.push(`WHERE: ${s.where}`);
  if (s.why) parts.push(`WHY: ${s.why}`);
  if (s.amount) parts.push(`AMOUNT: ${s.currency || ''} ${Number(s.amount).toLocaleString()}`.trim());
  if (s.context) parts.push(`CONTEXT: ${s.context}`);
  return parts.join('\n');
}

async function callOllama(query, chunks) {
  const messages = [{ role: 'system', content: kb.buildSystemPrompt(chunks) }, { role: 'user', content: query }];
  const res = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.05, stream: false }),
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Model "${MODEL}" not found. Run: ollama pull ${MODEL}`);
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error?.message || `Ollama error ${res.status}`);
  }
  const d = await res.json();
  return d.choices?.[0]?.message?.content || '';
}

async function preflight() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/version`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error(`\nCannot reach Ollama at ${OLLAMA_URL} (${err.message}).`);
    console.error(`Start it with \`ollama serve\` and ensure the model is pulled: ollama pull ${MODEL}\n`);
    process.exit(1);
  }
}

function evaluate(scenario, parsed) {
  const checks = [];
  if (!parsed.ok) {
    checks.push({ name: 'parseable', pass: false, detail: 'Response was not valid/repairable JSON' });
    return checks;
  }
  const { verdict, citation = '', explanation = '' } = parsed.data;
  checks.push({
    name: 'verdict', pass: scenario.expectVerdict.includes(verdict),
    detail: `expected one of [${scenario.expectVerdict.join(', ')}], got "${verdict}"`,
  });

  const citedNotices = extractNoticeNumbers(citation);
  checks.push({
    name: 'citation-notice', pass: citedNotices.has(scenario.notice),
    detail: citedNotices.size ? `citation references Notice ${[...citedNotices].join(',')}, expected Notice ${scenario.notice}` : `citation "${citation}" does not mention any Notice number`,
  });

  const citedTokens = extractRefTokens(citation);
  const realTokens = REF_TOKENS_BY_NOTICE[scenario.notice] || [];
  const grounded = citedTokens.length === 0 ? false : tokensOverlap(citedTokens, realTokens);
  checks.push({
    name: 'citation-grounded', pass: grounded,
    detail: citedTokens.length === 0 ? `could not extract a Para/FAQ reference from citation "${citation}"` : `citation tokens [${citedTokens.map(t => t.type + t.num + (t.sub != null ? `(${t.sub})` : '')).join(',')}] vs real Notice ${scenario.notice} refs`,
  });

  if (scenario.expectRefHints) {
    const hay = citation.toLowerCase();
    const hit = scenario.expectRefHints.some(h => {
      const hintTokens = extractRefTokens(h);
      return hintTokens.length ? tokensOverlap(citedTokens, hintTokens) : hay.includes(h);
    });
    checks.push({ name: 'citation-hint', pass: hit, detail: `expected citation to reference one of [${scenario.expectRefHints.join(', ')}], got "${citation}"` });
  }
  if (scenario.mustNotMention) {
    const hay = (explanation + ' ' + citation).toLowerCase();
    const bad = scenario.mustNotMention.find(s => hay.includes(s.toLowerCase()));
    checks.push({ name: 'must-not-mention', pass: !bad, detail: bad ? `explanation/citation unexpectedly mentions "${bad}"` : 'ok' });
  }
  return checks;
}

async function main() {
  await preflight();
  const list = NOTICE_FILTER ? scenarios.filter(s => String(s.notice) === String(NOTICE_FILTER)) : scenarios;
  if (!list.length) { console.error(`No scenarios match --notice ${NOTICE_FILTER}`); process.exit(1); }

  console.log(`FEP Compass stress test — ${list.length} scenario(s) · model=${MODEL} · url=${OLLAMA_URL}\n`);

  const results = [];
  for (const s of list) {
    const query = buildAnalystQuery(s);
    const chunks = kb.retrieve(`${s.who} ${s.what} ${s.why || ''} ${s.context || ''}`, 'all', 6);
    let raw = '', error = null;
    try {
      raw = await callOllama(query, chunks);
    } catch (err) {
      error = err.message;
    }
    const parsed = error ? { ok: false, raw: '' } : parseResp(raw);
    const checks = error ? [{ name: 'request', pass: false, detail: error }] : evaluate(s, parsed);
    const pass = checks.every(c => c.pass);
    results.push({ scenario: s, pass, checks, raw, parsed });

    console.log(`${pass ? 'PASS' : 'FAIL'}  ${s.id}  ${s.title}`);
    if (!pass || VERBOSE) {
      for (const c of checks) if (!c.pass || VERBOSE) console.log(`       [${c.pass ? 'ok' : 'x '}] ${c.name}: ${c.detail}`);
      if (parsed.ok && (VERBOSE || !pass)) {
        console.log(`       verdict=${parsed.data.verdict}  citation="${parsed.data.citation}"`);
      }
    }
  }

  const passed = results.filter(r => r.pass).length;
  console.log(`\n${passed}/${results.length} scenarios passed.`);
  if (passed < results.length) {
    console.log('\nFailed scenarios:');
    for (const r of results.filter(r => !r.pass)) console.log(`  - ${r.scenario.id}: ${r.scenario.title}`);
  }

  const reportPath = path.join(__dirname, 'last-run-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results.map(r => ({
    id: r.scenario.id, title: r.scenario.title, pass: r.pass,
    checks: r.checks, verdict: r.parsed.ok ? r.parsed.data.verdict : null,
    citation: r.parsed.ok ? r.parsed.data.citation : null, raw: r.raw,
  })), null, 2));
  console.log(`Full report written to ${path.relative(process.cwd(), reportPath)}`);

  process.exit(passed === results.length ? 0 : 1);
}

main();
