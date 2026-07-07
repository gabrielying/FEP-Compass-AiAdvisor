/* ════════════════════════════════════════════════════════════════════
   FEP COMPASS v2.0 — application logic
   Knowledge base · BM25 RAG · AI compliance analyst
   ════════════════════════════════════════════════════════════════════ */
'use strict';

/* ━━━ QUICK-CHECK DECISION TREES (“Am I Affected?”) ━━━ */
const QUICKCHECK = {
  1: { start:'a', nodes:{
      a:{ q:'Are you (or your customer) exchanging foreign currency against Ringgit or another currency?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 1 governs buying/selling foreign currency, forwards and gold dealings. If no currency exchange or hedging is involved, look at Notices 2–7 instead.' } },
      b:{ q:'Is the transaction with a Licensed Onshore Bank (LOB) or licensed money changer?', yes:'c', no:{ type:'warn', t:'Affected — review counterparty', d:'FX dealings must generally be carried out with a LOB, an Appointed Overseas Office or a licensed money changer. Dealing through other channels may breach Notice 1. Ask the AI Advisor with your specifics.' } },
      c:{ q:'Is it a forward / hedging contract (settlement beyond spot)?', yes:{ type:'info', t:'Affected — forward rules apply', d:'Forwards require a Firm Commitment or Anticipatory basis and must be unwound if the commitment ceases. Non-Residents face extra restrictions (N1 Part B, Para 12). Institutional investors may need Dynamic Hedging registration.' }, no:{ type:'ok', t:'Affected, but generally permitted', d:'Spot dealings with a LOB or licensed money changer are broadly permitted for both Residents and Non-Residents (N1 Paras 1, 6, 14).' } },
  }},
  2: { start:'a', nodes:{
      a:{ q:'Does the arrangement involve borrowing, lending or a guarantee across Resident / Non-Resident lines?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Purely domestic Ringgit lending between Residents is outside Notice 2\'s cross-border scope (but may count as Domestic Ringgit Borrowing for Notice 3 limits).' } },
      b:{ q:'Is the borrower a Resident individual / sole proprietor?', yes:{ type:'warn', t:'Affected — individual limits apply', d:'Ringgit borrowing from a Non-Resident is capped at RM1 million aggregate (unlimited from immediate family/employer). Foreign currency borrowing is capped at RM10 million equivalent from a LOB or Non-Resident (N2 Part A).' }, no:'c' },
      c:{ q:'Is the borrower a Resident company borrowing in foreign currency from outside its Group?', yes:{ type:'warn', t:'Affected — RM100M group limit', d:'FCY borrowing from a Non-Resident outside the Group, an NRFI or an out-of-group SPV is capped at RM100 million equivalent on a group basis (N2 Part B, Para 10). Borrowing from a LOB, Group entity or direct shareholder is unlimited.' }, no:{ type:'info', t:'Affected — check the matching provision', d:'Non-Resident borrowing and guarantees have their own permissions (N2 Parts D–G). Open Notice 2 and find the row matching your borrower and lender, or ask the AI Advisor.' } },
  }},
  3: { start:'a', nodes:{
      a:{ q:'Is a Resident investing in a foreign-currency asset (shares, property, deposits, funds abroad)?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 3 only governs Resident investment in Foreign Currency Assets. Non-Resident investment into Malaysia is generally a Notice 4 (payments) matter.' } },
      b:{ q:'Does the investor have any Domestic Ringgit Borrowing (e.g. business loans; excluding one housing & one vehicle loan)?', yes:'c', no:{ type:'ok', t:'Affected, but unlimited', d:'A Resident without Domestic Ringgit Borrowing may invest any amount in FCY assets, onshore or offshore (N3 Paras 1 & 3).' } },
      c:{ q:'Will the investment be funded by converting Ringgit (or Trade FCA / swapping Ringgit assets)?', yes:{ type:'warn', t:'Affected — annual conversion limits', d:'With DRB, conversion-funded investment is capped per calendar year: RM1 million equivalent for individuals, RM50 million equivalent for entities on a group basis (N3 Paras 2 & 4). Exceeding the cap needs FEP Authority approval — track it on your Dashboard.' }, no:{ type:'ok', t:'Affected, but generally permitted', d:'Investment funded from FCY earned abroad (except export proceeds) or approved FCY borrowing is allowed in any amount (N3 Paras 2(a) & 4(a)).' } },
  }},
  4: { start:'a', nodes:{
      a:{ q:'Is a payment being made or received between a Resident and a Non-Resident (or in foreign currency between Residents)?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Ringgit payments between Residents in Malaysia are not restricted by Notice 4.' } },
      b:{ q:'Is the payment in foreign currency from a Resident to a Non-Resident?', yes:{ type:'ok', t:'Affected, but broadly permitted', d:'FCY payments from a Resident to a Non-Resident are allowed for ANY purpose except certain derivative transactions (N4 Para 5). Note: investment-type payments still count toward Notice 3 limits.' }, no:'c' },
      c:{ q:'Is a Non-Resident receiving or paying Ringgit in Malaysia?', yes:{ type:'info', t:'Affected — purpose test applies', d:'Ringgit payments involving Non-Residents are allowed for listed purposes: income/expenses in Malaysia, trade settlement, Ringgit assets, family transfers (N4 Paras 2–3). Repatriation must be in foreign currency (Para 8).' }, no:{ type:'info', t:'Affected — check FCY-between-Residents rules', d:'FCY payments between Residents are only permitted for listed purposes — family, education/employment/migration abroad, LOB transactions, global supply chain operations (N4 Para 4).' } },
  }},
  5: { start:'a', nodes:{
      a:{ q:'Is someone issuing, subscribing to or transferring securities or financial instruments (bonds, sukuk, shares, derivatives)?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 5 only covers issuance and dealing in securities and financial instruments.' } },
      b:{ q:'Is the issuer a Resident issuing in Ringgit to Non-Residents, or anyone issuing FCY instruments in Malaysia?', yes:{ type:'info', t:'Affected — generally permitted with conditions', d:'Resident issuance of Ringgit securities to Non-Residents and FCY securities to anyone is permitted; debt securities must also comply with Notice 2 borrowing limits (N5 Part A). Exchange-rate-linked instruments trigger Notice 1.' }, no:{ type:'info', t:'Affected — check the issuer-specific rule', d:'MDB/QDFI Ringgit issuances, LOB instruments and Bursa products each have their own provision (N5 Parts A–B). Open Notice 5 or ask the AI Advisor.' } },
  }},
  6: { start:'a', nodes:{
      a:{ q:'Is physical cash (notes) being carried, couriered or posted across the Malaysian border?', yes:'b', no:{ type:'ok', t:'Not affected', d:'Notice 6 only covers physical import/export of currency. Electronic transfers fall under Notice 4.' } },
      b:{ q:'Is Ringgit being taken OUT of Malaysia?', yes:{ type:'warn', t:'Affected — strict RM1,000 cap', d:'A traveller may take out at most RM1,000 in Ringgit notes per trip — amounts above that are NOT permitted under any circumstances. Foreign currency above RM30,000 equivalent must be declared to Customs.' }, no:{ type:'info', t:'Affected — declaration thresholds', d:'Bringing Ringgit IN above RM10,000 or foreign currency above RM30,000 equivalent must be declared to the Royal Malaysian Customs Department. Failure to declare is a violation.' } },
  }},
  7: { start:'a', nodes:{
      a:{ q:'Is a Malaysian (Resident) business exporting goods out of Malaysia?', yes:'b', no:{ type:'ok', t:'Likely not affected', d:'Notice 7 applies to Resident exporters of goods. Services exports and Non-Resident shipments are outside its scope.' } },
      b:{ q:'Will payment be received within 6 months of shipment, in full value, into a Ringgit account or Trade FCA in Malaysia?', yes:'c', no:{ type:'warn', t:'Affected — timing/value rules engaged', d:'Proceeds beyond 6 months are only allowed in approved circumstances (up to 24 months — buyer difficulties, disputes, consignment, testing). Proceeds still outstanding after 24 months must be reported to the FEP Authority within 21 days after year-end (N7 Paras 1(c) & 5).' } },
      c:{ q:'Did annual gross exports exceed RM250 million equivalent last year?', yes:{ type:'info', t:'Affected — reporting obligation', d:'Large exporters (>RM250M/year) must submit reports to the FEP Authority via bnm.my/fep as and when required (N7 Para 4). Day-to-day receipts look compliant.' }, no:{ type:'ok', t:'Affected, and compliant pattern', d:'Receiving full value within 6 months into a Ringgit account or Trade FCA with a LOB matches the standard Notice 7 obligations. Keep records of any deductions (Appendix A).' } },
  }},
};

/* ━━━ STATE ━━━ */
const DEFAULT_CFG = { provider:'gemini', apiKey:'', model:'gemini-2.5-flash', ollamaUrl:'http://localhost:11434', ollamaModel:'qwen2.5:7b' };

/* Shared Daily Challenge leaderboard (Supabase REST) — fixed, zero-config.
   LB_KEY is the project's public publishable key (safe to ship in the client);
   writes are protected server-side by RLS in supabase/leaderboard.sql. */
const LB_URL = 'https://toglryukfdjybzgtdjzn.supabase.co';
const LB_KEY = 'sb_publishable_Rx8jmd5sJ3SMHBIU0M9T8A_Lv4vhp4P';

/* In-progress analyst-form + chat-input text — a page reload (F5, or the mobile
   pull-to-refresh in initPullToRefresh()) must not discard anything a user typed but
   hadn't submitted yet, so this mirrors the form fields into localStorage on every edit. */
const DEFAULT_DRAFT = {
  who:'', what:'', from:'', fromOther:'', to:'', toOther:'',
  why:'', ccy:'', ccyOther:'', amt:'', ctx:'', chat:'',
};

/* Last tab/tool the user was viewing — a reload returns here by default (Smart Tools /
   Analyst is the fallback for a brand-new visitor with nothing saved yet). An in-progress
   draft (see DEFAULT_DRAFT above) still overrides this in restoreDraft(), since showing the
   user their unsaved work takes priority over returning them to their last-viewed tab. */
const DEFAULT_NAV = { tab:'tools', toolTab:'analyst' };

/* Daily FEP Challenge — local play record. `history` entries
   ({ date, challengeNo, qid, correct, ms }) are capped at MAX_GAME_HISTORY and
   deliberately shaped as the payload a future shared (Supabase) leaderboard
   submission would POST, so phase 2 needs no migration. Streak counts
   consecutive calendar days answered CORRECTLY. */
const DEFAULT_GAME = { history: [], streak: 0, bestMs: null, team: '', clientId: '' };
const MAX_GAME_HISTORY = 90;

/* ━━━ AI COMPLIANCE ANALYST — picker options ━━━ */
const AF_WHO_OPTIONS = [
  'Resident Individual',
  'Joint Account — two or more Resident Individuals',
  'Joint Account — Resident & Non-Resident Individual',
  'Resident Entity (company)',
  'Non-Resident Individual',
  'Non-Resident Entity',
  'Licensed Onshore Bank (LOB)',
];
const AF_WHAT_GROUPS = [
  { group:'Other', items:['Other'] },
  { group:'FX dealing', items:['Buy / sell foreign currency', 'Forward / hedging contract'] },
  { group:'Borrowing & lending', items:['Borrowing', 'Lending', 'Financial guarantee'] },
  { group:'Investment', items:['Investment in foreign currency asset', 'Issue securities / financial instrument'] },
  { group:'Cross-border movement', items:['Payment or receipt', 'Carry cash across the border', 'Export of goods (proceeds)'] },
];
const FX_COUNTRIES = [
  'Other', 'Malaysia', 'Australia', 'Brunei', 'Cambodia', 'Canada', 'China', 'Germany', 'Hong Kong',
  'India', 'Indonesia', 'Japan', 'Laos', 'Myanmar', 'Netherlands', 'New Zealand', 'Philippines',
  'Singapore', 'South Korea', 'Switzerland', 'Taiwan', 'Thailand', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Vietnam',
];
/* AI Compliance Analyst — currency select options; 'Other' reveals a free-text/ISO-code fallback */
const AF_CCY_OPTIONS = ['Other', 'MYR', 'USD', 'EUR', 'GBP', 'SGD', 'JPY', 'CNY', 'AUD'];

/* Static, curated reference rates to MYR — NOT live. The CSP connect-src in index.html
   forbids any live FX-rate API call, so this table is manually maintained and must be
   updated by hand if rates drift materially from these indicative values. */
const FX_RATES_TO_MYR = { MYR:1, USD:4.70, EUR:5.10, GBP:5.95, SGD:3.48, JPY:0.031, CNY:0.65, AUD:3.10 };

/* Standard ISO-4217 alpha-3 currency codes (active list) — used to validate the
   currency "Other" free-text fallback. */
const ISO_CURRENCY_CODES = [
  'AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN',
  'BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BRL','BSD','BTN','BWP','BYN','BZD',
  'CAD','CDF','CHF','CLP','CNY','COP','CRC','CUP','CVE','CZK',
  'DJF','DKK','DOP','DZD',
  'EGP','ERN','ETB','EUR',
  'FJD','FKP',
  'GBP','GEL','GHS','GIP','GMD','GNF','GTQ','GYD',
  'HKD','HNL','HTG','HUF',
  'IDR','ILS','INR','IQD','IRR','ISK',
  'JMD','JOD','JPY',
  'KES','KGS','KHR','KMF','KPW','KRW','KWD','KYD','KZT',
  'LAK','LBP','LKR','LRD','LSL','LYD',
  'MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRU','MUR','MVR','MWK','MXN','MYR','MZN',
  'NAD','NGN','NIO','NOK','NPR','NZD',
  'OMR',
  'PAB','PEN','PGK','PHP','PKR','PLN','PYG',
  'QAR',
  'RON','RSD','RUB','RWF',
  'SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLE','SOS','SRD','SSP','STN','SYP','SZL',
  'THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS',
  'UAH','UGX','USD','UYU','UZS',
  'VES','VND','VUV',
  'WST',
  'XAF','XCD','XOF','XPF',
  'YER',
  'ZAR','ZMW','ZWL',
];
/* Common lowercase currency names/nicknames -> ISO code, for the "Other" free-text fallback */
const CURRENCY_NAME_ALIASES = {
  'ringgit':'MYR', 'dollar':'USD', 'us dollar':'USD', 'pound':'GBP', 'sterling':'GBP',
  'euro':'EUR', 'yen':'JPY', 'yuan':'CNY', 'renminbi':'CNY', 'sing dollar':'SGD',
  'singapore dollar':'SGD', 'aussie dollar':'AUD',
};

/* ~195 UN-recognized country names (standard English short names) — used to validate
   the From/To country "Other" free-text fallback. */
const WORLD_COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia',
  'Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium',
  'Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad',
  'Chile','China','Colombia','Comoros','Congo','Costa Rica',"Cote d'Ivoire",'Croatia','Cuba','Cyprus',
  'Czechia','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji',
  'Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea',
  'Guinea-Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran',
  'Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
  'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania',
  'Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania',
  'Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique',
  'Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria',
  'North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea',
  'Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
  'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore',
  'Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain',
  'Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania',
  'Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan',
  'Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];
/* Static, curated quick-fill scenarios — deliberately NOT derived from the fep_activity log,
   which is unstructured free text users are told to keep PII out of. */
const QUICKFILL_SCENARIOS = [
  { label:'Resident sending funds abroad', who:'Resident Individual', what:'Payment or receipt', from:'Malaysia', to:'United Kingdom' },
  { label:'Non-resident repatriating proceeds', who:'Non-Resident Individual', what:'Investment in foreign currency asset', from:'Malaysia', to:'Singapore' },
  { label:'Inbound FDI / equity investment', who:'Non-Resident Entity', what:'Investment in foreign currency asset', from:'Singapore', to:'Malaysia' },
  { label:'Resident foreign-currency borrowing', who:'Resident Entity (company)', what:'Borrowing', from:'Malaysia', to:'Other' },
];

/* timestamp of this page load — used only to scope "this session" dashboard stats; not persisted */
const APP_LOAD_TS = Date.now();

const NAV_RESTORE = { ...DEFAULT_NAV, ...JSON.parse(localStorage.getItem('fep_nav')||'{}') };
const ST = {
  tab: NAV_RESTORE.tab,
  cfg: { ...DEFAULT_CFG, ...JSON.parse(localStorage.getItem('fep_cfg')||'{}') },
  sessions: JSON.parse(localStorage.getItem('fep_sess')||'[]'),
  activity: JSON.parse(localStorage.getItem('fep_activity')||'[]'),
  draft: { ...DEFAULT_DRAFT, ...JSON.parse(localStorage.getItem('fep_draft')||'{}') },
  game: { ...DEFAULT_GAME, ...JSON.parse(localStorage.getItem('fep_game')||'{}') },
  activityFilter:'all', activitySearch:'',
  msgs: [], loading:false, advisorFilter:'all',
  toolTab: NAV_RESTORE.toolTab, modalNotice:null,
  settingsScreen:'hub', // More tab hub-and-spoke: 'hub' | 'ai' | 'games' | 'data' | 'about' (transient)
};
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const saveDraft = () => save('fep_draft', ST.draft);
const saveNav = () => save('fep_nav', { tab: ST.tab, toolTab: ST.toolTab });
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtRM = n => 'RM ' + Number(n||0).toLocaleString('en-MY');

function mkEl(tag, cls, html) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (html !== undefined) el.innerHTML = html;
  return el;
}

/* Levenshtein edit distance between two strings (case-insensitive). Used for
   lightweight, non-blocking "did you mean…" suggestions on free-text fallback inputs. */
function levenshtein(a, b) {
  a = String(a||'').toLowerCase(); b = String(b||'').toLowerCase();
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({length:n+1}, (_,j) => j);
  for (let i=1; i<=m; i++) {
    const cur = [i];
    for (let j=1; j<=n; j++) {
      cur[j] = a[i-1] === b[j-1] ? prev[j-1] : 1 + Math.min(prev[j-1], prev[j], cur[j-1]);
    }
    prev = cur;
  }
  return prev[n];
}
/* Returns the candidate in `candidates` closest to `input` (case-insensitive) if within
   maxDistance edits, else null. Exact case-insensitive matches return immediately. */
function suggestClosest(input, candidates, maxDistance) {
  const needle = String(input||'').trim().toLowerCase();
  if (!needle) return null;
  const exact = candidates.find(c => String(c).toLowerCase() === needle);
  if (exact) return exact;
  let best = null, bestDist = Infinity;
  candidates.forEach(c => {
    const d = levenshtein(needle, c);
    if (d < bestDist) { bestDist = d; best = c; }
  });
  return bestDist <= maxDistance ? best : null;
}
function toast(msg) {
  const t = $('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.classList.add('hidden'), 2600);
}

/* ━━━ ACTIVITY / AUDIT LOG ━━━ */
const MAX_ACTIVITY = 50;
const ACTIVITY_ICONS = {
  advisor:'ti-message-dots', analyst:'ti-checkup-list',
  limit:'ti-gauge', declaration:'ti-clipboard-check', notice:'ti-book-2', check:'ti-help-hexagon',
  game:'ti-trophy',
};
const ACTIVITY_LABELS = {
  advisor:'Advisor', analyst:'Analyst',
  limit:'Limits', declaration:'Declarations', notice:'Notices', check:'Am I Affected?',
  game:'Daily Challenge',
};
function logActivity(type, text) {
  ST.activity.unshift({ id: Date.now()+'_'+Math.random().toString(36).slice(2), ts: Date.now(), type, text });
  if (ST.activity.length > MAX_ACTIVITY) ST.activity = ST.activity.slice(0, MAX_ACTIVITY);
  save('fep_activity', ST.activity);
  if (ST.tab === 'dashboard') renderActivity();
}
function renderActivityFilters() {
  const bar = $('activity-filters'); if (!bar) return;
  const types = [...new Set(ST.activity.map(a => a.type))];
  bar.innerHTML = '';
  if (types.length < 2) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  const mkPill = (id, label) => {
    const b = mkEl('button', 'npill'+(ST.activityFilter===id?' on':''), esc(label));
    b.addEventListener('click', () => { ST.activityFilter = id; renderActivity(); });
    return b;
  };
  bar.appendChild(mkPill('all','All'));
  types.forEach(t => bar.appendChild(mkPill(t, ACTIVITY_LABELS[t] || t)));
}
function renderActivity() {
  const ul = $('activity-list'); if (!ul) return;
  renderActivityFilters();
  ul.innerHTML = '';
  let items = ST.activity;
  if (ST.activityFilter !== 'all') items = items.filter(a => a.type === ST.activityFilter);
  const q = ST.activitySearch.trim().toLowerCase();
  if (q) items = items.filter(a => a.text.toLowerCase().includes(q));
  if (!items.length) {
    const msg = ST.activity.length ? 'No activity matches your search or filter.' : 'No activity recorded yet — actions across the app will appear here.';
    ul.appendChild(mkEl('li','activity-empty', msg));
    return;
  }
  items.forEach(a => {
    const li = mkEl('li','activity-item');
    li.innerHTML = `<i class="ti ${ACTIVITY_ICONS[a.type] || 'ti-circle'}"></i>
      <div class="activity-body"><div class="activity-text">${esc(a.text)}</div><div class="activity-ts">${new Date(a.ts).toLocaleString('en-MY')}</div></div>`;
    ul.appendChild(li);
  });
}
function exportActivity() {
  if (!ST.activity.length) return toast('No activity to export');
  const header = 'Timestamp,Type,Description\n';
  const rows = ST.activity.map(a => {
    const ts = new Date(a.ts).toISOString();
    const text = '"' + a.text.replace(/"/g, '""') + '"';
    return `${ts},${a.type},${text}`;
  }).join('\n');
  const blob = new Blob([header + rows], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `fep-compass-activity-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(link); link.click(); link.remove();
  URL.revokeObjectURL(url);
  toast('Activity log exported');
}

/* wrap glossary terms in text with clickable chips */
function linkTerms(html) {
  const terms = Object.keys(GLOSSARY).sort((a,b)=>b.length-a.length);
  const re = new RegExp('\\b(' + terms.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|') + ')\\b', 'g');
  return html.replace(re, m => `<button class="term" data-term="${esc(m)}">${esc(m)}</button>`);
}

/* ━━━ AI PROVIDERS ━━━ */

async function callGemini(query, chunks, history=[]) {
  const { apiKey, model } = ST.cfg;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method:'POST', headers:{'Content-Type':'application/json', 'x-goog-api-key':apiKey},
    body: JSON.stringify({
      system_instruction:{ parts:[{ text: buildSystemPrompt(chunks) }] },
      contents:[...history.map(m=>({ role:m.role==='assistant'?'model':'user', parts:[{text:m.content}] })), { role:'user', parts:[{text:query}] }],
      generationConfig:{
        temperature:0.05, maxOutputTokens:8192, responseMimeType:'application/json',
        // The DRB / joint-limit rules (system prompt rules 7-10) need genuine multi-step
        // reasoning — counting loan types separately, applying the one-housing/one-vehicle
        // exclusion, then the arithmetic check. Disabling thinking made 2.5-flash fall back to
        // shallow "has a loan -> has DRB" pattern-matching (e.g. wrongly flagging a daughter
        // with one housing + one car loan as having DRB). Give flash a dedicated thinking
        // budget instead, and keep maxOutputTokens generous so the JSON still never truncates.
        ...(model.includes('flash') ? { thinkingConfig:{ thinkingBudget:4096 } } : {})
      }
    })
  });
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || `Gemini API error ${res.status}`); }
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

const isLocalOllamaUrl = url => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(String(url||'').trim());

async function callOllama(query, chunks, history=[]) {
  const { ollamaUrl, ollamaModel } = ST.cfg;
  if (!isLocalOllamaUrl(ollamaUrl)) throw new Error('Ollama URL must start with http://localhost: or http://127.0.0.1:');
  const messages = [{ role:'system', content: buildSystemPrompt(chunks) },
    ...history.map(m=>({ role:m.role==='assistant'?'assistant':'user', content:m.content })),
    { role:'user', content: query }];
  const res = await fetch(`${ollamaUrl}/v1/chat/completions`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ model: ollamaModel, messages, temperature:0.05, stream:false })
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Model "${ollamaModel}" not found. Run: ollama pull ${ollamaModel}`);
    const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || `Ollama error ${res.status}`);
  }
  const d = await res.json();
  return d.choices?.[0]?.message?.content || '';
}

const callAI = (q, chunks, hist) => ST.cfg.provider === 'ollama' ? callOllama(q, chunks, hist) : callGemini(q, chunks, hist);
const aiConfigured = () => ST.cfg.provider === 'ollama' || !!ST.cfg.apiKey;

/* lightweight client-side throttle — guards against accidental rapid-fire AI requests */
const AI_COOLDOWN_MS = 2500;
let lastAiCallAt = 0;
function aiCooldownOk() {
  const now = Date.now();
  if (now - lastAiCallAt < AI_COOLDOWN_MS) { toast('Please wait a moment before sending another request'); return false; }
  lastAiCallAt = now;
  return true;
}

/* One-time acknowledgement gate shown before the first AI verdict — the officer
   must confirm the educational-only / verify-independently framing once per
   browser. Resolves true to proceed, false if cancelled/dismissed. */
const AI_ACK_KEY = 'fep_ai_ack';
function ensureAiAck() {
  if (localStorage.getItem(AI_ACK_KEY)) return Promise.resolve(true);
  return new Promise(resolve => {
    const ov = $('ack-overlay'), accept = $('ack-accept'), cancel = $('ack-cancel');
    let done = false;
    const settle = (val, persist) => {
      if (done) return; done = true;
      if (persist) localStorage.setItem(AI_ACK_KEY, '1');
      ov.classList.remove('open');
      accept.removeEventListener('click', onAccept);
      cancel.removeEventListener('click', onCancel);
      ov.removeEventListener('click', onBackdrop);
      document.removeEventListener('keydown', onKey);
      resolve(val);
    };
    const onAccept = () => settle(true, true);
    const onCancel = () => settle(false, false);
    const onBackdrop = e => { if (e.target === ov) settle(false, false); };
    const onKey = e => { if (e.key === 'Escape') settle(false, false); };
    accept.addEventListener('click', onAccept);
    cancel.addEventListener('click', onCancel);
    ov.addEventListener('click', onBackdrop);
    document.addEventListener('keydown', onKey);
    ov.classList.add('open');
  });
}

/* Repair truncated JSON: close an unterminated string, drop a dangling
   key/value fragment, then close unbalanced brackets in nesting order. */
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
    .replace(/,\s*"(?:[^"\\]|\\.)*"\s*:?\s*$/, '')      // dangling ,"key" or ,"key":
    .replace(/(\{\s*)"(?:[^"\\]|\\.)*"\s*:?\s*$/, '$1') // {"key": with no value yet
    .replace(/[,:]\s*$/, '');                           // bare trailing comma/colon
  while (stack.length) out += stack.pop() === '{' ? '}' : ']';
  return out;
}
const VALID_VERDICTS = ['PERMITTED','NOT_PERMITTED','CONDITIONAL','REQUIRES_APPROVAL'];
function parseResp(raw) {
  if (!raw) return { ok:false, raw:'' };
  const tryParse = s => { try { const p = JSON.parse(s); if (p && VALID_VERDICTS.includes(p.verdict)) return p; } catch(_){} return null; };
  let p = tryParse(raw.trim());
  let truncated = false;
  if (!p) {
    const m = raw.replace(/```json\s*|\s*```/g,'').match(/\{[\s\S]*/);
    if (m) {
      p = tryParse(m[0]);
      if (!p) { p = tryParse(repairJSON(m[0].trim())); truncated = !!p; }
    }
  }
  if (p) return { ok:true, partial:truncated, data:p };
  // regex salvage — tolerate a missing closing quote at end-of-string
  const f = {};
  ['verdict','summary','explanation','citation','warning','nextStep'].forEach(k => {
    f[k] = (raw.match(new RegExp(`"${k}"\\s*:\\s*"([^"]*)`))||[])[1];
  });
  if (f.verdict && VALID_VERDICTS.includes(f.verdict) && f.summary) return { ok:true, partial:true, data:{ ...f, explanation: f.explanation||'See raw response.', conditions:[] } };
  return { ok:false, raw };
}

/* ━━━ VERDICT CARD ━━━ */
const VCFG = {
  PERMITTED:         { cls:'permitted',         icon:'ti-circle-check',  label:'PERMITTED' },
  NOT_PERMITTED:     { cls:'not-permitted',     icon:'ti-circle-x',      label:'NOT PERMITTED' },
  CONDITIONAL:       { cls:'conditional',       icon:'ti-alert-circle',  label:'CONDITIONAL' },
  REQUIRES_APPROVAL: { cls:'requires-approval', icon:'ti-lock',          label:'REQUIRES APPROVAL' },
};
function verdictCard(data, chunks, isPartial, inputRows) {
  const vc = VCFG[data.verdict] || VCFG.CONDITIONAL;
  const card = mkEl('div','vcard');
  card._printChunks = chunks;
  card._printInputRows = inputRows;
  card.appendChild(mkEl('div','vcard-head',
    `<span class="vbadge ${vc.cls}"><i class="ti ${vc.icon}"></i>${vc.label}</span><span class="vsummary">${esc(data.summary)}</span>`));
  const body = mkEl('div','vbody', `<div class="vlabel">Explanation</div><p>${esc(data.explanation)}</p>`);
  if (data.conditions?.length)
    body.innerHTML += `<div class="vlabel mt-10">Conditions</div>` +
      data.conditions.map(c=>`<div class="vcond"><i class="ti ti-point-filled"></i><span>${esc(c)}</span></div>`).join('');
  if (data.warning && data.warning !== 'null')
    body.innerHTML += `<div class="vwarn"><i class="ti ti-alert-triangle icon-sp-r"></i>${esc(data.warning)}</div>`;
  if (data.nextStep && data.nextStep !== 'null')
    body.innerHTML += `<div class="vnext"><i class="ti ti-arrow-guide icon-sp-r"></i><strong>Next step:</strong> ${esc(data.nextStep)}</div>`;
  if (isPartial)
    body.innerHTML += `<div class="vwarn mt-8">Response partially parsed — some fields may be incomplete.</div>`;
  card.appendChild(body);
  if (data.citation) {
    const leaked = /section title|ref copied verbatim|[\[\]]/i.test(data.citation);
    const grounded = !leaked && verifyCitation(data.citation).grounded;
    let citeHtml = `<div class="vlabel">FEP Citation</div><div class="vcite-text">${esc(data.citation)}</div>`;
    if (!grounded)
      citeHtml += `<div class="vwarn mt-8"><i class="ti ti-alert-triangle icon-sp-r"></i>Unverified citation — this reference could not be matched to a provision in the knowledge base. Confirm against the official FEP Notice before relying on it.</div>`;
    card.appendChild(mkEl('div','vcite',citeHtml));
  }
  if (chunks?.length) {
    const srcs = mkEl('div','vsources'); const seen = new Set();
    chunks.forEach(c => { const k = `${c.noticeName} ${c.ref}`; if (!seen.has(k)) { seen.add(k); srcs.appendChild(mkEl('span','vsrc-tag',esc(k))); } });
    card.appendChild(srcs);
  }
  const foot = mkEl('div','vfoot');
  const printBtn = mkEl('button','vprint-btn','<i class="ti ti-printer"></i> Save as PDF');
  printBtn.addEventListener('click', () => printVerdict(card));
  foot.appendChild(printBtn);
  card.appendChild(foot);
  return card;
}
/* render the WHO/WHAT/WHERE/WHY/AMOUNT/CONTEXT (or chat question) for the print area */
function printInputBlock(rows) {
  const w = mkEl('div','print-input');
  w.appendChild(mkEl('div','sec-hdr','Compliance check input'));
  rows.forEach(([label, value]) => w.appendChild(mkEl('div','print-input-row', `<strong>${esc(label)}:</strong> ${esc(value)}`)));
  return w;
}
/* clone a verdict card into the dedicated print area and trigger the browser's print/Save-as-PDF dialog */
function printVerdict(card) {
  const area = $('print-area');
  const clone = card.cloneNode(true);
  clone.querySelectorAll('.vfoot').forEach(el => el.remove());
  area.innerHTML = `<div class="print-head">
    <h1>FEP Compass — Compliance Verdict</h1>
    <p>Generated ${esc(new Date().toLocaleString('en-MY'))} · Educational guidance only — not legal advice. Verify complex cases with the FEP Authority.</p>
  </div>`;
  if (card._printInputRows?.length) area.appendChild(printInputBlock(card._printInputRows));
  area.appendChild(clone);
  if (card._printChunks?.length) area.appendChild(provisionList(card._printChunks, 'Provisions used for this check'));
  document.body.classList.add('printing');
  window.print();
}
window.addEventListener('afterprint', () => document.body.classList.remove('printing'));
function rawCard(raw) {
  const w = mkEl('div','');
  w.appendChild(mkEl('div','msg-raw-label','<i class="ti ti-alert-circle"></i>Raw AI response — could not parse a structured verdict'));
  w.appendChild(mkEl('div','msg-raw', esc(raw)));
  return w;
}
function provisionList(chunks, title='Most relevant provisions (reference lookup)') {
  const w = mkEl('div','');
  w.appendChild(mkEl('div','sec-hdr', title));
  chunks.forEach(c => {
    const card = mkEl('div','result-card',
      `<span class="rtag">${c.noticeName}</span><span class="rref">${esc(c.ref)}</span>
       <div class="rtitle">${esc(c.title)}</div><div class="rexcerpt">${esc(c.body)}</div>`);
    w.appendChild(card);
  });
  return w;
}
/* shown when an AI call fails — degrade to a reference-only lookup instead of a bare error */
function aiFallbackBlock(err, chunks) {
  const w = mkEl('div','');
  w.appendChild(mkEl('div','error-msg','<i class="ti ti-wifi-off"></i> AI unavailable: ' + esc(err.message)));
  if (chunks?.length) {
    w.appendChild(mkEl('div','vwarn', 'Showing the most relevant FEP provisions below for reference — review manually or retry once the AI provider is reachable.'));
    w.appendChild(provisionList(chunks, 'Reference results (AI unavailable)'));
  }
  return w;
}

/* ━━━ NAVIGATION ━━━ */
function switchTab(tab) {
  ST.tab = tab;
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-'+tab));
  document.querySelectorAll('.side-link, .bb-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'settings') openSettingsScreen('hub'); // always land on the More hub
  saveNav();
}
document.querySelectorAll('.side-link, .bb-tab').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => {
  switchTab(b.dataset.go);
  if (b.dataset.tool) switchTool(b.dataset.tool);
}));
['brand-jump-sidebar', 'brand-jump-topbar'].forEach(id => $(id).addEventListener('click', () => switchTab('tools')));

/* ━━━ DASHBOARD ━━━ */
function renderDashNotices() {
  const wrap = $('dash-notices'); wrap.innerHTML = '';
  Object.values(NOTICES).forEach(n => {
    const b = mkEl('button','mini-notice',`<div class="mn-tag">NOTICE ${n.id}</div><div class="mn-t">${esc(n.title)}</div>`);
    b.addEventListener('click', () => openNotice(n.id));
    wrap.appendChild(b);
  });
}
function renderDashStats() {
  const wrap = $('dash-stats'); if (!wrap) return;
  wrap.innerHTML = '';
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const queriesSession = ST.activity.filter(a => a.type === 'advisor' && a.ts >= APP_LOAD_TS).length;
  const checksMonth = ST.activity.filter(a => (a.type === 'analyst' || a.type === 'check') && a.ts >= monthStart).length;
  const noticesBrowsed = new Set(ST.activity.filter(a => a.type === 'notice').map(a => a.text)).size;
  const stats = [
    { icon:'ti-message-dots', label:'Queries this session', v: queriesSession },
    { icon:'ti-checkup-list', label:'Checks run this month', v: checksMonth },
    { icon:'ti-books', label:'Notices browsed', v: noticesBrowsed },
  ];
  stats.forEach(s => {
    wrap.appendChild(mkEl('div','dash-stat',
      `<i class="ti ${s.icon}"></i><div class="ds-body"><div class="ds-v">${s.v}</div><div class="ds-l">${esc(s.label)}</div></div>`));
  });
}
function renderDashboard() {
  const h = new Date().getHours();
  $('greeting').textContent = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  renderDashStats(); renderLeaderboard(); renderActivity();
  retryPendingSubmits();
}

/* ━━━ DAILY FEP CHALLENGE ━━━ */
const GAME_LETTERS = ['A', 'B', 'C', 'D'];
const fmtGameMs = ms => { const s = Math.round(ms/1000); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); };
const todayGameEntry = () => ST.game.history.find(h => h.date === challengeDateKey());

function recordGameResult(entry, pick, ms) {
  const date = challengeDateKey();
  const correct = pick === entry.answer;
  const h = { date, challengeNo: challengeNumber(date), qid: entry.id, pick, correct, ms, team: ST.game.team, submitted: false };
  ST.game.history.unshift(h);
  if (ST.game.history.length > MAX_GAME_HISTORY) ST.game.history = ST.game.history.slice(0, MAX_GAME_HISTORY);
  if (!correct) ST.game.streak = 0;
  else {
    const yesterday = ST.game.history.find(x => x.date === challengeDateKey(new Date(Date.now() - 864e5)));
    ST.game.streak = yesterday && yesterday.correct ? ST.game.streak + 1 : 1;
    if (ST.game.bestMs == null || ms < ST.game.bestMs) ST.game.bestMs = ms;
  }
  save('fep_game', ST.game);
  submitScore(h); // fire-and-forget; retried on later dashboard visits if it fails
  logActivity('game', `Daily Challenge — ${correct ? 'correct' : 'incorrect'} in ${fmtGameMs(ms)}${ST.game.team ? ` (Team ${ST.game.team})` : ''}`);
  return correct;
}

/* ── shared institution leaderboard (Supabase REST; degrades gracefully) ── */
const LB_HEADERS = { apikey: LB_KEY, Authorization: 'Bearer ' + LB_KEY };
let LB_CACHE = { ts: 0, rows: null };
const LB_TTL_MS = 5 * 60 * 1000;

function gameClientId() {
  if (!ST.game.clientId) {
    ST.game.clientId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2);
    save('fep_game', ST.game);
  }
  return ST.game.clientId;
}

async function submitScore(h) {
  if (!h.team || h.submitted) return;
  try {
    const res = await fetch(`${LB_URL}/rest/v1/challenge_scores?on_conflict=client_id,played_on`, {
      method: 'POST',
      headers: { ...LB_HEADERS, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates' },
      body: JSON.stringify({ played_on: h.date, team: h.team, correct: h.correct, ms: h.ms, client_id: gameClientId() }),
    });
    if (res.ok || res.status === 409) {
      submitScore._lastErr = null;
      h.submitted = true; save('fep_game', ST.game);
      LB_CACHE.ts = 0;
      if (ST.tab === 'dashboard') renderLeaderboard();
    } else {
      // include PostgREST's own error message so the on-screen note pinpoints the cause
      let msg = 'HTTP ' + res.status;
      try {
        const j = await res.json();
        if (j && (j.message || j.code)) msg += ` — ${[j.code, j.message].filter(Boolean).join(': ')}`;
      } catch (_) { /* non-JSON body */ }
      submitScore._lastErr = msg;
      if (ST.tab === 'dashboard') renderLeaderboard(); // surface the pending-sync note
    }
  } catch (e) { submitScore._lastErr = 'network unreachable'; /* stays pending */ }
}
function retryPendingSubmits() {
  ST.game.history.filter(h => !h.submitted && h.team).slice(0, 5).forEach(submitScore);
}

async function fetchLeaderboard() {
  if (LB_CACHE.rows && Date.now() - LB_CACHE.ts < LB_TTL_MS) return LB_CACHE.rows;
  // rpc call — challenge_leaderboard is a security-definer FUNCTION (not a view),
  // per Supabase's linter guidance; STABLE, so PostgREST accepts a plain GET.
  // A 404 means the DB still has the older view schema — fall back to reading it.
  let res = await fetch(`${LB_URL}/rest/v1/rpc/challenge_leaderboard`, { headers: LB_HEADERS });
  if (res.status === 404) res = await fetch(`${LB_URL}/rest/v1/challenge_leaderboard?select=*`, { headers: LB_HEADERS });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const rows = await res.json();
  LB_CACHE = { ts: Date.now(), rows };
  return rows;
}

const LB_MEDALS = ['🥇', '🥈', '🥉'];
function renderLeaderboard() {
  const wrap = $('dash-leaderboard'); if (!wrap) return;
  const syncNote = () => {
    const pending = ST.game.history.filter(h => !h.submitted && h.team).length;
    if (!pending) return;
    wrap.appendChild(mkEl('div','lb-empty',
      `⏳ ${pending} of your result${pending > 1 ? 's have' : ' has'}n't reached the shared board yet${
        submitScore._lastErr ? ` (last attempt failed: ${esc(submitScore._lastErr)})` : ''
      } — it retries automatically each time you open the Dashboard.`));
  };
  wrap.innerHTML = '<div class="lb-empty">Loading team standings…</div>';
  fetchLeaderboard().then(rows => {
    wrap.innerHTML = '';
    if (!rows.length) {
      wrap.appendChild(mkEl('div','lb-empty','No team scores yet — play today\'s challenge and put your institution on the board!'));
      syncNote();
      return;
    }
    const sorted = [...rows].sort((a, b) => (b.points - a.points) || ((a.avg_ms ?? Infinity) - (b.avg_ms ?? Infinity)));
    const list = mkEl('ol','lb-list');
    sorted.slice(0, 10).forEach((r, i) => {
      const acc = r.plays ? Math.round(r.points / r.plays * 100) : 0;
      const li = mkEl('li','lb-row' + (r.team === ST.game.team ? ' mine' : ''),
        `<span class="lb-rank">${LB_MEDALS[i] || (i + 1)}</span>
         <span class="lb-team">${esc(r.team)}</span>
         <span class="lb-meta">${r.points} pts · ${acc}% of ${r.plays}${r.avg_ms != null ? ' · ø ' + fmtGameMs(r.avg_ms) : ''}</span>`);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    wrap.appendChild(mkEl('div','card-hint','Points = correct answers across all officers of an institution · ø = average time on correct answers · anonymous, updates every few minutes.'));
    syncNote();
  }).catch(() => {
    wrap.innerHTML = '';
    wrap.appendChild(mkEl('div','lb-empty','Team standings are unreachable right now — check your connection and revisit the dashboard to retry.'));
    syncNote();
  });
}

/* institution (team) picker — used on the dashboard card and the game intro */
function teamPickerEl(onJoined) {
  const box = mkEl('div','team-pick');
  box.appendChild(mkEl('p','card-hint','Pick your institution to join its team — every correct answer scores a point for your bank on the leaderboard.'));
  const row = mkEl('div','game-row');
  const sel = mkEl('select','set-inp team-select');
  sel.innerHTML = '<option value="">Select your institution…</option>' +
    LFI_TEAMS.map(t => `<option value="${esc(t)}"${t === ST.game.team ? ' selected' : ''}>${esc(t)}</option>`).join('');
  const join = mkEl('button','btn primary','<i class="ti ti-users-group"></i> Join team');
  join.addEventListener('click', () => {
    if (!sel.value) return toast('Select your institution first');
    ST.game.team = sel.value; save('fep_game', ST.game);
    toast(`Joined Team ${sel.value}`);
    if (onJoined) onJoined();
  });
  row.appendChild(sel); row.appendChild(join);
  box.appendChild(row);
  return box;
}

function shareChallengeResult() {
  const today = todayGameEntry(); if (!today) return;
  const streak = ST.game.streak > 1 ? ` · 🔥 ${ST.game.streak}-day streak` : '';
  const team = ST.game.team ? ` · Team ${ST.game.team}` : '';
  const text = `🧭 FEP Daily Challenge — ${today.correct ? '✅ Correct' : '❌ Missed'} in ${fmtGameMs(today.ms)}${streak}${team}`;
  const done = () => toast('Result copied — paste it anywhere');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed — ' + text); }
  ta.remove();
}

function renderDashChallenge() {
  const wrap = $('dash-challenge'); if (!wrap) return;
  wrap.innerHTML = '';
  const today = todayGameEntry();
  const played = ST.game.history.length;
  const correct = ST.game.history.filter(h => h.correct).length;
  if (!ST.game.team) { wrap.appendChild(teamPickerEl(renderDashChallenge)); return; }
  const pills = mkEl('div','game-pills');
  [['ti-building-bank','Team', ST.game.team],
   ['ti-flame','Streak', ST.game.streak + (ST.game.streak === 1 ? ' day' : ' days')],
   ['ti-stopwatch','Best time', ST.game.bestMs != null ? fmtGameMs(ST.game.bestMs) : '—'],
   ['ti-target','Accuracy', played ? Math.round(correct / played * 100) + '% of ' + played : '—'],
  ].forEach(([icon, l, v]) => pills.appendChild(mkEl('span','npill',`<i class="ti ${icon}"></i> ${esc(l)}: ${esc(v)}`)));
  const change = mkEl('button','ghost-btn','Change team');
  change.addEventListener('click', () => { ST.game.team = ''; save('fep_game', ST.game); renderDashChallenge(); });
  pills.appendChild(change);
  wrap.appendChild(pills);
  if (today) {
    wrap.appendChild(mkEl('div', 'qc-result ' + (today.correct ? 'ok' : 'warn'),
      `<strong><i class="ti ${today.correct ? 'ti-circle-check' : 'ti-alert-triangle'} icon-sp"></i> Today's challenge — ${today.correct ? 'Correct' : 'Missed'} in ${fmtGameMs(today.ms)}</strong>Next challenge tomorrow. Every question is grounded in the real FEP Notices — tap Review to re-read the provision.`));
    const row = mkEl('div','game-row');
    const share = mkEl('button','btn primary','<i class="ti ti-copy"></i> Share result');
    share.addEventListener('click', shareChallengeResult);
    const review = mkEl('button','btn','<i class="ti ti-book-2"></i> Review answer');
    review.addEventListener('click', openDailyChallenge);
    row.appendChild(share); row.appendChild(review);
    wrap.appendChild(row);
  } else {
    wrap.appendChild(mkEl('p','card-hint',
      `One real FEP scenario a day, drawn from Notices 2, 3, 4 &amp; 7 — pick the right treatment against the clock. Every correct answer scores a point for Team ${esc(ST.game.team)}.`));
    const row = mkEl('div','game-row');
    const play = mkEl('button','btn primary lg','<i class="ti ti-player-play"></i> Play today\'s challenge');
    play.addEventListener('click', openDailyChallenge);
    row.appendChild(play);
    wrap.appendChild(row);
  }
}

function openDailyChallenge() {
  const entry = dailyQuestion();
  $('game-name').textContent = new Date().toLocaleDateString('en-MY') + (ST.game.team ? ` · Team ${ST.game.team}` : '');
  const body = $('game-body');
  let t0 = 0, timerEl = null, timerId = null;
  const stopTimer = () => { if (timerId) { clearInterval(timerId); timerId = null; } };
  openDailyChallenge._cleanup = stopTimer;

  const renderIntro = () => {
    body.innerHTML = '';
    body.appendChild(mkEl('div','qc-step','ONE QUESTION · NOTICES 2 / 3 / 4 / 7'));
    if (!ST.game.team) {
      body.appendChild(mkEl('div','qc-q','First, join your institution\'s team — your result counts toward its leaderboard score.'));
      body.appendChild(teamPickerEl(renderIntro));
      return;
    }
    body.appendChild(mkEl('div','qc-q','Ready? One real FEP scenario, four options at most, one right answer. The timer starts when you hit Start.'));
    body.appendChild(mkEl('p','card-hint','Educational guidance only, not legal advice — verify complex cases with the FEP Authority.'));
    const row = mkEl('div','qc-opts');
    const start = mkEl('button','btn primary','<i class="ti ti-player-play"></i> Start');
    start.addEventListener('click', renderQuestion);
    row.appendChild(start);
    body.appendChild(row);
  };

  const renderQuestion = () => {
    body.innerHTML = '';
    t0 = Date.now();
    const head = mkEl('div','game-qhead');
    head.appendChild(mkEl('div','qc-step',`NOTICE ${entry.notice} · ${entry.type === 'verdict' ? 'PICK THE FEP TREATMENT' : 'QUIZ'}`));
    timerEl = mkEl('div','game-timer','0:00');
    head.appendChild(timerEl);
    body.appendChild(head);
    timerId = setInterval(() => { timerEl.textContent = fmtGameMs(Date.now() - t0); }, 250);
    body.appendChild(mkEl('div','qc-q', esc(entry.q)));
    const opts = mkEl('div','game-opts');
    entry.opts.forEach((opt, i) => {
      const b = mkEl('button','btn game-opt',`<span class="game-letter">${GAME_LETTERS[i]}</span> ${esc(opt)}`);
      b.addEventListener('click', () => {
        stopTimer();
        const ms = Date.now() - t0;
        recordGameResult(entry, i, ms);
        renderDashChallenge();
        renderResult();
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
  };

  const renderResult = () => {
    body.innerHTML = '';
    stopTimer();
    const today = todayGameEntry(); if (!today) return renderIntro();
    const ok = today.correct;
    const pickText = today.pick != null && entry.opts[today.pick] != null
      ? `You picked ${GAME_LETTERS[today.pick]} — ${esc(entry.opts[today.pick])}.<br>` : '';
    body.appendChild(mkEl('div', 'qc-result ' + (ok ? 'ok' : 'warn'),
      `<strong><i class="ti ${ok ? 'ti-circle-check' : 'ti-alert-triangle'} icon-sp"></i> ${ok ? 'Correct!' : 'Not quite'} — ${fmtGameMs(today.ms)}${ST.game.streak > 1 ? ` · 🔥 ${ST.game.streak}-day streak` : ''}</strong>
      ${pickText}Answer: <b>${GAME_LETTERS[entry.answer]} — ${esc(entry.opts[entry.answer])}</b>`));
    body.appendChild(mkEl('div','game-cite',
      `<i class="ti ti-book-2"></i> <b>Notice ${entry.notice} — ${esc(entry.ref)}</b><br>${esc(entry.rationale)}`));
    body.appendChild(mkEl('p','card-hint','Educational guidance only, not legal advice — verify complex cases with the FEP Authority.'));
    const row = mkEl('div','qc-restart qc-opts');
    const share = mkEl('button','btn primary','<i class="ti ti-copy"></i> Share result');
    share.addEventListener('click', shareChallengeResult);
    const read = mkEl('button','btn','<i class="ti ti-book-2"></i> Open Notice ' + entry.notice);
    read.addEventListener('click', () => { closeOverlays(); openNotice(entry.notice); });
    row.appendChild(share); row.appendChild(read);
    body.appendChild(row);
  };

  if (todayGameEntry()) renderResult(); else renderIntro();
  openOverlay('game-overlay');
}
// dashboard Quick Action → jump straight into today's challenge
const qaChallenge = $('qa-challenge');
if (qaChallenge) qaChallenge.addEventListener('click', () => { switchTab('settings'); openSettingsScreen('games','fwd'); });
$('activity-clear').addEventListener('click', () => {
  ST.activity = []; save('fep_activity', ST.activity); renderActivity(); toast('Activity log cleared');
});
$('activity-export').addEventListener('click', exportActivity);
$('activity-search').addEventListener('input', e => {
  ST.activitySearch = e.target.value; renderActivity();
});

/* ━━━ NOTICES HUB ━━━ */
function renderNoticeCards() {
  const wrap = $('notices-cards'); wrap.innerHTML = '';
  Object.values(NOTICES).forEach(n => {
    const card = mkEl('article','notice-card');
    card.innerHTML = `
      <div class="nc-top"><div class="nc-num">${n.id}</div><div class="nc-title">${esc(n.title)}</div></div>
      <div class="nc-desc">${esc(n.desc)}</div>
      <div class="nc-meta">${n.secs.length} provisions${faqTotal(n) ? ' · ' + faqTotal(n) + ' FAQs' : ''} · effective 1 Oct 2025</div>
      <div class="nc-actions">
        <button class="btn primary act-explore"><i class="ti ti-book-2"></i> Explore</button>
        <button class="btn act-check"><i class="ti ti-help-hexagon"></i> Am I Affected?</button>
      </div>`;
    card.querySelector('.act-explore').addEventListener('click', () => openNotice(n.id));
    card.querySelector('.act-check').addEventListener('click', () => openQuickCheck(n.id));
    wrap.appendChild(card);
  });
}
function renderGlossary() {
  const g = $('glossary'); g.innerHTML = '';
  Object.keys(GLOSSARY).forEach(t => g.appendChild(mkEl('button','term', esc(t))).setAttribute('data-term', t));
}
function renderNoticeSearch() {
  const q = $('notices-q').value.trim();
  $('notices-clear').classList.toggle('visible', !!q);
  const out = $('notices-results'); out.innerHTML = '';
  $('notices-cards').style.display = q ? 'none' : '';
  if (!q) return;
  const ql = q.toLowerCase();
  let results = CHUNKS.filter(c => (c.title+' '+c.body+' '+c.noticeName+' '+c.ref).toLowerCase().includes(ql));
  if (!results.length) results = retrieve(q, 'all', 8);
  if (!results.length) { out.appendChild(mkEl('div','empty-center',`<i class="ti ti-mood-sad"></i><p>No provisions match “${esc(q)}”.</p>`)); return; }
  out.appendChild(mkEl('div','sec-hdr',`${results.length} matching provision${results.length!==1?'s':''}`));
  const hl = t => q ? esc(t).replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>') : esc(t);
  results.slice(0,20).forEach(c => {
    const card = mkEl('div','result-card',
      `<span class="rtag">${c.noticeName}</span><span class="rref">${esc(c.ref)}</span>
       <div class="rtitle">${hl(c.title)}</div><div class="rexcerpt">${hl(c.body)}</div>`);
    card.addEventListener('click', () => openNotice(c.noticeId, c.ref));
    out.appendChild(card);
  });
}
$('notices-q').addEventListener('input', renderNoticeSearch);
$('notices-clear').addEventListener('click', () => { $('notices-q').value=''; renderNoticeSearch(); });

/* notice detail modal */
/* render an accordion of {ref,title,body} entries (provisions or FAQs) into a container */
function renderAccordion(list, container, focusRef, sub) {
  list.forEach(s => {
    const composed = sub ? faqCiteRef(sub, s.ref) : s.ref;
    const prov = mkEl('div','prov');
    const head = mkEl('button','prov-head',
      `<span class="prov-ref">${esc(s.ref)}</span><span class="prov-title">${esc(s.title)}</span><i class="ti ti-chevron-down prov-chev"></i>`);
    const bwrap = mkEl('div','prov-body');
    bwrap.appendChild(mkEl('div','prov-body-inner', linkTerms(esc(s.body))));
    head.addEventListener('click', () => {
      const open = prov.classList.toggle('open');
      bwrap.style.maxHeight = open ? bwrap.scrollHeight + 'px' : '0';
    });
    prov.appendChild(head); prov.appendChild(bwrap);
    container.appendChild(prov);
    if (focusRef && (s.ref === focusRef || composed === focusRef)) setTimeout(() => { head.click(); prov.scrollIntoView({behavior:'smooth', block:'center'}); }, 250);
  });
}
function openNotice(id, focusRef) {
  const n = NOTICES[id]; if (!n) return;
  ST.modalNotice = id;
  const faqGroups = n.faqs || [];
  const faqCount = faqTotal(n);
  const hasFaqs = faqCount > 0;
  $('nm-tag').textContent = `NOTICE ${n.id} · ${n.secs.length} PROVISIONS${hasFaqs ? ' · ' + faqCount + ' FAQS' : ''}`;
  $('nm-name').textContent = n.title;
  const body = $('nm-body'); body.innerHTML = '';

  if (hasFaqs) {
    const tabs = mkEl('div','nm-tabs');
    const provBtn = mkEl('button','npill on', `Provisions (${n.secs.length})`);
    const faqBtn = mkEl('button','npill', `FAQs (${faqCount})`);
    tabs.appendChild(provBtn); tabs.appendChild(faqBtn);
    body.appendChild(tabs);

    const provWrap = mkEl('div','nm-panel');
    provWrap.appendChild(mkEl('div','sec-hdr','Tap any provision to expand · dotted terms have definitions'));
    renderAccordion(n.secs, provWrap, focusRef);

    const faqWrap = mkEl('div','nm-panel hidden');
    faqWrap.appendChild(mkEl('div','sec-hdr','Frequently asked questions — tap to expand'));
    faqGroups.forEach(g => {
      faqWrap.appendChild(mkEl('div','sec-hdr sec-hdr-sub', esc(g.subcategory)));
      renderAccordion(g.items, faqWrap, focusRef, g.subcategory);
    });

    body.appendChild(provWrap); body.appendChild(faqWrap);

    const showTab = (tab) => {
      provWrap.classList.toggle('hidden', tab !== 'prov');
      faqWrap.classList.toggle('hidden', tab !== 'faq');
      provBtn.classList.toggle('on', tab === 'prov');
      faqBtn.classList.toggle('on', tab === 'faq');
    };
    provBtn.addEventListener('click', () => showTab('prov'));
    faqBtn.addEventListener('click', () => showTab('faq'));
    if (focusRef && faqGroups.some(g => g.items.some(f => f.ref === focusRef || faqCiteRef(g.subcategory, f.ref) === focusRef))) showTab('faq');
  } else {
    body.appendChild(mkEl('div','sec-hdr','Tap any provision to expand · dotted terms have definitions'));
    renderAccordion(n.secs, body, focusRef);
  }

  openOverlay('notice-overlay');
  logActivity('notice', `Viewed Notice ${n.short} — ${n.title}`);
}
$('nm-ask').addEventListener('click', () => {
  closeOverlays();
  ST.advisorFilter = String(ST.modalNotice);
  renderAdvisorPills(); switchTab('tools'); switchTool('advisor');
});
$('nm-check').addEventListener('click', () => { closeOverlays(); openQuickCheck(ST.modalNotice); });

/* quick-check wizard */
function openQuickCheck(id) {
  const n = NOTICES[id], qc = QUICKCHECK[id]; if (!n || !qc) return;
  $('qc-name').textContent = `Notice ${id} — ${n.title}`;
  let step = 1;
  const render = nodeKey => {
    const body = $('qc-body'); body.innerHTML = '';
    const node = qc.nodes[nodeKey];
    body.appendChild(mkEl('div','qc-step',`QUESTION ${step}`));
    body.appendChild(mkEl('div','qc-q', esc(node.q)));
    const opts = mkEl('div','qc-opts');
    [['Yes','yes'],['No','no']].forEach(([lbl,key]) => {
      const b = mkEl('button','btn'+(key==='yes'?' primary':''), lbl);
      b.addEventListener('click', () => {
        const next = node[key];
        if (typeof next === 'string') { step++; render(next); }
        else showResult(next);
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
  };
  const showResult = res => {
    const body = $('qc-body'); body.innerHTML = '';
    const icon = res.type==='ok' ? 'ti-circle-check' : res.type==='warn' ? 'ti-alert-triangle' : 'ti-info-circle';
    body.appendChild(mkEl('div',`qc-result ${res.type}`,`<strong><i class="ti ${icon} icon-sp"></i> ${esc(res.t)}</strong>${esc(res.d)}`));
    logActivity('check', `"Am I Affected?" (Notice ${n.short}) → ${res.t}`);
    const row = mkEl('div','qc-restart qc-opts');
    const again = mkEl('button','btn','<i class="ti ti-rotate"></i> Start over');
    again.addEventListener('click', () => { step=1; render(qc.start); });
    const ask = mkEl('button','btn primary','<i class="ti ti-message-dots"></i> Ask the Advisor');
    ask.addEventListener('click', () => { closeOverlays(); ST.advisorFilter = String(id); renderAdvisorPills(); switchTab('tools'); switchTool('advisor'); });
    row.appendChild(again); row.appendChild(ask);
    body.appendChild(row);
  };
  render(qc.start);
  openOverlay('qc-overlay');
}

/* ━━━ OVERLAYS & TERM POPOVER ━━━ */
function openOverlay(id) { $(id).classList.add('open'); }
function closeOverlays() {
  document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));
  if (openDailyChallenge._cleanup) openDailyChallenge._cleanup(); // stop a mid-question game timer
}
document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) closeOverlays(); }));
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeOverlays));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeOverlays(); hideTermPop(); } });

function hideTermPop() { $('term-pop').classList.add('hidden'); }
document.addEventListener('click', e => {
  const t = e.target.closest('.term');
  const pop = $('term-pop');
  if (!t) { if (!e.target.closest('.term-pop')) hideTermPop(); return; }
  const term = t.dataset.term;
  const def = GLOSSARY[term] || GLOSSARY[Object.keys(GLOSSARY).find(k=>k.toLowerCase()===term.toLowerCase())];
  if (!def) return;
  $('tp-name').textContent = term;
  $('tp-def').textContent = def;
  pop.classList.remove('hidden');
  const r = t.getBoundingClientRect(), pw = Math.min(320, window.innerWidth-24);
  pop.style.maxWidth = pw+'px';
  let x = Math.min(Math.max(12, r.left), window.innerWidth - pw - 12);
  let y = r.bottom + 8;
  if (y + pop.offsetHeight > window.innerHeight - 12) y = r.top - pop.offsetHeight - 8;
  pop.style.left = x+'px'; pop.style.top = Math.max(12,y)+'px';
});

/* ━━━ SMART TOOLS — shared ━━━ */
function switchTool(tool) {
  ST.toolTab = tool;
  document.querySelectorAll('.tool-tab').forEach(b => b.classList.toggle('active', b.dataset.tool === tool));
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.toggle('active', p.id === 'tool-'+tool));
  saveNav();
}
document.querySelectorAll('.tool-tab').forEach(b => b.addEventListener('click', () => switchTool(b.dataset.tool)));

/* ━━━ AI compliance analyst ━━━ */

function selectWho(val) {
  $('af-who').value = val;
  updateAfSummary();
  updateAfReqHint();
}
/* selectFrom/selectTo/selectWhat remain the canonical value-setters — applyQuickfill()
   calls them directly, and the native <select>/"Other" text-input change listeners below
   also route through them so every code path keeps .value in sync with the summary/hint. */
function selectWhat(val) {
  $('af-what').value = val;
  updateAfSummary();
  updateAfReqHint();
}
function selectFrom(val) {
  $('af-from').value = val;
  updateAfSummary();
  updateAfReqHint();
}
function selectTo(val) {
  $('af-to').value = val;
  updateAfSummary();
  updateAfReqHint();
}

/* Resolved custom "Other" currency text — kept out of $('af-ccy').value (which stays the
   literal string 'Other' while that option is selected) so downstream code can tell "Other,
   unresolved" apart from a fully-typed custom code. */
let afCcyCustomValue = '';
/* Resolved custom "Other" From/To country text — same rationale as afCcyCustomValue above:
   assigning an arbitrary string to a <select>'s .value is a no-op per the HTML spec unless
   that string matches an existing <option> value, so a user-typed custom country must be
   tracked separately rather than written back into $('af-from'/'af-to').value. */
let afFromCustomValue = '';
let afToCustomValue = '';
/* True once the user has attempted to submit the analyst form at least once while it was
   incomplete — drives the inline per-field "required" error UI (see updateAfFieldErrors()
   below) so errors only appear after a failed submit, not while the user is still filling
   the form in for the first time. Reset back to false once every required field is filled,
   and explicitly by clearAnalystForm(). */
let afSubmitAttempted = false;
/* Maps each afFieldsReady().fields key to the id of the DOM input that should receive focus
   / the has-error styling for that field — af-err-<key> holds the matching inline message,
   see updateAfFieldErrors()/setAfFieldError(). */
const AF_FIELD_INPUT_IDS = { who: 'af-who', what: 'af-what', from: 'af-from', to: 'af-to', why: 'af-why', amount: 'af-amt' };
/* Returns the effective currency code to use in the query/summary/submit: the select's
   value unless it's the literal 'Other', in which case the resolved custom text (or the
   literal 'Other' if nothing has been typed yet). */
function effectiveCcy() {
  const v = $('af-ccy').value;
  return v === 'Other' ? (afCcyCustomValue || 'Other') : v;
}
/* Returns the effective From/To country to use in the query/summary/submit — mirrors
   effectiveCcy() above. */
function effectiveFrom() {
  const v = $('af-from').value;
  return v === 'Other' ? (afFromCustomValue || 'Other') : v;
}
function effectiveTo() {
  const v = $('af-to').value;
  return v === 'Other' ? (afToCustomValue || 'Other') : v;
}

function updateAfSummary() {
  const who = $('af-who').value, what = $('af-what').value;
  const ccy = effectiveCcy(), amtRaw = $('af-amt').value.replace(/,/g, '');
  const parts = [];
  if (who) parts.push(who);
  if (what) parts.push(what);
  if (amtRaw) {
    const n = Number(amtRaw);
    parts.push(`${ccy} ${Number.isFinite(n) ? n.toLocaleString() : amtRaw}`);
  }
  const summary = $('af-summary');
  summary.textContent = parts.join(' · ');
  summary.classList.toggle('hidden', parts.length === 0);
}

/* Indicative RM-equivalent display next to the Amount field — uses only the static
   FX_RATES_TO_MYR table (no live rate lookups; see comment above that constant). */
function updateAfFxEstimate() {
  const el = $('af-fx-estimate'); if (!el) return;
  const ccy = effectiveCcy();
  const amtRaw = $('af-amt').value.replace(/,/g, '');
  const rate = FX_RATES_TO_MYR[ccy];
  const n = Number(amtRaw);
  if (amtRaw && Number.isFinite(n) && n > 0 && rate) {
    const rm = n * rate;
    el.textContent = `≈ RM ${rm.toLocaleString('en-MY', { maximumFractionDigits:2 })} (indicative)`;
    el.classList.remove('hidden');
  } else {
    el.textContent = '';
    el.classList.add('hidden');
  }
}

/* ── init-time <select> renderers for Who / What / From / To / Currency ── */
/* Every analyst-form <select> starts on this disabled placeholder — none of them
   pre-select a real option (e.g. the first list entry), so the field stays genuinely
   empty until the user actively picks something. */
function addPlaceholderOption(sel, text) {
  const opt = document.createElement('option');
  opt.value = ''; opt.textContent = text; opt.disabled = true; opt.selected = true;
  sel.appendChild(opt);
}
function renderWhoSelect() {
  const sel = $('af-who'); if (!sel) return;
  sel.innerHTML = '';
  addPlaceholderOption(sel, 'Select party…');
  AF_WHO_OPTIONS.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item; opt.textContent = item;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', function () { selectWho(this.value); updateAfReqHint(); });
}
function renderWhatSelect() {
  const sel = $('af-what'); if (!sel) return;
  sel.innerHTML = '';
  addPlaceholderOption(sel, 'Select type…');
  AF_WHAT_GROUPS.forEach(({ group, items }) => {
    const og = document.createElement('optgroup');
    og.label = group;
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item; opt.textContent = item;
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });
  sel.addEventListener('change', function () { selectWhat(this.value); updateAfReqHint(); });
}
function renderCcySelect() {
  const sel = $('af-ccy'); if (!sel) return;
  sel.innerHTML = '';
  addPlaceholderOption(sel, 'Currency…');
  AF_CCY_OPTIONS.forEach(code => {
    const opt = document.createElement('option');
    opt.value = code; opt.textContent = code;
    sel.appendChild(opt);
  });
}
/* Shared renderer for the From/To country <select>s. */
function renderCountrySelect(selectId) {
  const sel = $(selectId); if (!sel) return;
  sel.innerHTML = '';
  addPlaceholderOption(sel, 'Select country…');
  FX_COUNTRIES.forEach(country => {
    const opt = document.createElement('option');
    opt.value = country; opt.textContent = country;
    sel.appendChild(opt);
  });
}

/* Wires a From/To country <select> + its "Other" free-text fallback row. `setCustom` persists
   the user-typed custom country text (see afFromCustomValue/afToCustomValue above) since
   assigning it back into the <select>'s .value would silently no-op. */
function wireCountryField(selectId, otherInputId, otherHintId, selectFn, setCustom) {
  const sel = $(selectId), otherRow = sel ? sel.parentElement.querySelector('.other-input-row') : null;
  const otherInput = $(otherInputId), hint = $(otherHintId);
  if (!sel || !otherInput || !hint) return;
  sel.addEventListener('change', function () {
    if (this.value === 'Other') {
      otherRow?.classList.remove('hidden');
      otherInput.focus();
      setCustom('');
      updateAfReqHint();
    } else {
      otherRow?.classList.add('hidden');
      hint.textContent = '';
      setCustom('');
      selectFn(this.value);
    }
  });
  otherInput.addEventListener('input', function () {
    const val = this.value.trim().slice(0, 60);
    setCustom(val);
    updateAfSummary();
    updateAfReqHint();
    if (!val) { hint.textContent = ''; return; }
    const exact = WORLD_COUNTRIES.find(c => c.toLowerCase() === val.toLowerCase());
    if (exact) { hint.textContent = ''; hint.classList.remove('warn'); return; }
    const suggestion = suggestClosest(val, WORLD_COUNTRIES, 2);
    if (suggestion) {
      hint.innerHTML = '';
      hint.classList.add('warn');
      hint.append('Did you mean ');
      const link = mkEl('button', 'form-hint-link', esc(suggestion));
      link.type = 'button';
      link.addEventListener('click', () => {
        otherInput.value = suggestion;
        setCustom(suggestion);
        updateAfSummary();
        updateAfReqHint();
        hint.textContent = ''; hint.classList.remove('warn');
      });
      hint.appendChild(link);
      hint.append('?');
    } else {
      hint.textContent = 'Unrecognized country name — please check the spelling';
      hint.classList.add('warn');
    }
  });
}

/* Wires the Currency <select> + its "Other" free-text fallback row (ISO code / common name). */
function wireCcyField() {
  const sel = $('af-ccy'), otherRow = sel ? sel.parentElement.parentElement.querySelector('.other-input-row') : null;
  const otherInput = $('af-ccy-other'), hint = $('af-ccy-other-hint');
  if (!sel || !otherInput || !hint) return;
  sel.addEventListener('change', function () {
    if (this.value === 'Other') {
      otherRow?.classList.remove('hidden');
      otherInput.focus();
      afCcyCustomValue = '';
      updateAfReqHint();
    } else {
      otherRow?.classList.add('hidden');
      hint.textContent = '';
      afCcyCustomValue = '';
      updateAfSummary();
      updateAfFxEstimate();
      updateAfReqHint();
    }
  });
  otherInput.addEventListener('input', function () {
    const typed = this.value.trim();
    const upper = typed.toUpperCase();
    let resolved = '';
    if (ISO_CURRENCY_CODES.includes(upper)) {
      resolved = upper;
      hint.textContent = ''; hint.classList.remove('warn');
    } else if (CURRENCY_NAME_ALIASES[typed.toLowerCase()]) {
      resolved = CURRENCY_NAME_ALIASES[typed.toLowerCase()];
      hint.textContent = ''; hint.classList.remove('warn');
    } else {
      resolved = typed;
      if (!typed) { hint.textContent = ''; hint.classList.remove('warn'); }
      else {
        const suggestion = suggestClosest(upper, ISO_CURRENCY_CODES, 1);
        if (suggestion) {
          hint.innerHTML = '';
          hint.classList.add('warn');
          hint.append('Did you mean ');
          const link = mkEl('button', 'form-hint-link', esc(suggestion));
          link.type = 'button';
          link.addEventListener('click', () => {
            otherInput.value = suggestion;
            afCcyCustomValue = suggestion;
            hint.textContent = ''; hint.classList.remove('warn');
            updateAfSummary(); updateAfFxEstimate(); updateAfReqHint();
          });
          hint.appendChild(link);
          hint.append('?');
        } else {
          hint.textContent = 'Unrecognized currency — please check the code/name';
          hint.classList.add('warn');
        }
      }
    }
    afCcyCustomValue = resolved;
    updateAfSummary();
    updateAfFxEstimate();
    updateAfReqHint();
  });
}

/* Every field on the analyst form is required before the health-check can run — a field
   left on its "Other" option with no typed text yet does not count as filled, mirroring
   the effectiveCcy/effectiveFrom/effectiveTo fallback-to-literal-'Other' behavior. */
function afFieldsReady() {
  const who = $('af-who').value;
  const what = $('af-what').value;
  const fromSel = $('af-from').value;
  const fromOk = !!fromSel && (fromSel !== 'Other' || !!afFromCustomValue.trim());
  const toSel = $('af-to').value;
  const toOk = !!toSel && (toSel !== 'Other' || !!afToCustomValue.trim());
  const why = $('af-why').value.trim();
  const ccySel = $('af-ccy').value;
  const ccyOk = !!ccySel && (ccySel !== 'Other' || !!afCcyCustomValue.trim());
  const amtRaw = $('af-amt').value.replace(/,/g, '');
  const amtN = Number(amtRaw);
  const amtOk = amtRaw !== '' && Number.isFinite(amtN) && amtN >= 0;

  const missing = [];
  if (!who) missing.push('who is transacting');
  if (!what) missing.push('the transaction type');
  if (!fromOk) missing.push('the originating country (From)');
  if (!toOk) missing.push('the destination country (To)');
  if (!why) missing.push('why (purpose)');
  if (!ccyOk) missing.push('the currency');
  if (!amtOk) missing.push('the amount');
  return {
    ready: missing.length === 0,
    missing,
    fields: { who: !!who, what: !!what, from: fromOk, to: toOk, why: !!why, amount: ccyOk && amtOk },
  };
}

/* Hides a field's red "required" asterisk once it's been filled in, so the * is only ever
   shown for fields the user still needs to complete — see afFieldsReady() for the per-field
   filled/unfilled state this reflects. */
function updateAfReqMarks(fields) {
  Object.entries(fields).forEach(([key, filled]) => {
    const mark = $(`af-req-${key}`);
    if (mark) mark.classList.toggle('hidden', filled);
  });
}

function updateAfReqHint() {
  const { ready, missing, fields } = afFieldsReady();
  const hint = $('af-req-hint');
  updateAfReqMarks(fields);
  updateAfFieldErrors(fields);
  if (ready) {
    hint.textContent = 'Ready to check compliance';
    hint.classList.add('ok');
  } else if (afSubmitAttempted) {
    // The banner + per-field "This field is required." messages already cover this —
    // avoid showing the same list a third time mid-form.
    hint.textContent = '';
    hint.classList.remove('ok');
  } else {
    hint.classList.remove('ok');
    hint.textContent = 'Still need: ' + missing.join(', ');
  }
}

/* Toggles the has-error styling + inline "This field is required." message on a single
   analyst-form field, keyed the same way as afFieldsReady().fields — see AF_FIELD_INPUT_IDS. */
function setAfFieldError(key, hasError) {
  const input = $(AF_FIELD_INPUT_IDS[key]);
  const wrap = input ? input.closest('.field') : null;
  if (wrap) wrap.classList.toggle('has-error', hasError);
  const msg = $('af-err-' + key);
  if (msg) msg.classList.toggle('hidden', !hasError);
}

/* Drives the inline per-field "required" error UI (banner + per-field has-error/message)
   from the current afFieldsReady() fields snapshot. Only shows anything once the user has
   attempted a submit while the form was incomplete (afSubmitAttempted) — runs unconditionally
   (not gated by an early return) so stale error state is correctly cleared as the user fixes
   fields one by one. */
function updateAfFieldErrors(fields) {
  const missingKeys = Object.keys(fields).filter(k => !fields[k]);
  const showErrors = afSubmitAttempted && missingKeys.length > 0;
  const banner = $('af-error-banner');
  if (banner) banner.classList.toggle('hidden', !showErrors);
  Object.keys(AF_FIELD_INPUT_IDS).forEach(key => {
    const isError = showErrors && missingKeys.includes(key);
    setAfFieldError(key, isError);
  });
  if (missingKeys.length === 0) afSubmitAttempted = false;
}

function renderQuickfillChips() {
  const row = $('qf-row'); row.innerHTML = '';
  QUICKFILL_SCENARIOS.forEach(scenario => {
    const chip = mkEl('button', 'npill', esc(scenario.label));
    chip.type = 'button';
    chip.addEventListener('click', () => applyQuickfill(scenario));
    row.appendChild(chip);
  });
}
/* Reflects a value into a From/To <select> plus its "Other" free-text row (if present), then
   calls the matching canonical setter — keeps the visible select/other-row in sync with
   quick-fill scenarios exactly as the old chip-sheet flow did. A literal 'Other' scenario
   value (see QUICKFILL_SCENARIOS) reveals the other-row with the text input left empty,
   matching old chip-sheet behavior — it does not fabricate a country name. Since `value` is
   always a known option (a real country or the literal 'Other') for every quick-fill
   scenario, any previously-typed custom text is stale and is cleared via `setCustom('')` —
   the visible "Other" text <input> and its hint are cleared too, so no stale typed text
   lingers alongside the reset internal tracker. */
function applyFieldValue(selectId, value, selectFn, setCustom, otherInputId, otherHintId) {
  const sel = $(selectId);
  const otherRow = sel ? sel.parentElement.querySelector('.other-input-row') : null;
  if (sel) {
    const known = [...sel.options].some(o => o.value === value);
    sel.value = known ? value : 'Other';
    if (otherRow) otherRow.classList.toggle('hidden', known && value !== 'Other');
  }
  const otherInput = otherInputId ? $(otherInputId) : null;
  const hint = otherHintId ? $(otherHintId) : null;
  if (otherInput) otherInput.value = '';
  if (hint) { hint.textContent = ''; hint.classList.remove('warn'); }
  setCustom('');
  selectFn(value);
}
function applyQuickfill(scenario) {
  selectWho(scenario.who);
  selectWhat(scenario.what);
  applyFieldValue('af-from', scenario.from, selectFrom, v => { afFromCustomValue = v; }, 'af-from-other', 'af-from-other-hint');
  applyFieldValue('af-to', scenario.to, selectTo, v => { afToCustomValue = v; }, 'af-to-other', 'af-to-other-hint');
  updateAfSummary();
}

wireCcyField();

/* Mirrors every analyst-form field into ST.draft/localStorage on each edit — see
   DEFAULT_DRAFT above and restoreDraft() near INIT for the read side. */
function persistAnalystDraft() {
  Object.assign(ST.draft, {
    who: $('af-who').value, what: $('af-what').value,
    from: $('af-from').value, fromOther: $('af-from-other').value,
    to: $('af-to').value, toOther: $('af-to-other').value,
    why: $('af-why').value,
    ccy: $('af-ccy').value, ccyOther: $('af-ccy-other').value,
    amt: $('af-amt').value,
    ctx: $('af-ctx').value,
  });
  saveDraft();
}
$('analyst-form').addEventListener('input', persistAnalystDraft);
$('analyst-form').addEventListener('change', persistAnalystDraft);

/* Live thousands-separator formatting for the amount field, e.g. 800000 -> 800,000.00 */
$('af-amt').addEventListener('input', e => {
  const el = e.target;
  const cursorFromEnd = el.value.length - el.selectionStart;
  const clean = el.value.replace(/[^\d.]/g, '');
  const firstDot = clean.indexOf('.');
  const intPart = firstDot === -1 ? clean : clean.slice(0, firstDot);
  const decPart = firstDot === -1 ? '' : '.' + clean.slice(firstDot + 1).replace(/\./g, '').slice(0, 2);
  const formattedInt = intPart ? Number(intPart).toLocaleString('en-US') : '';
  el.value = formattedInt + decPart;
  const pos = Math.max(0, el.value.length - cursorFromEnd);
  el.setSelectionRange(pos, pos);
  updateAfSummary();
  updateAfFxEstimate();
  updateAfReqHint();
});

$('af-why').addEventListener('input', updateAfReqHint);

$('analyst-form').addEventListener('submit', async e => {
  e.preventDefault();
  const { ready, fields } = afFieldsReady();
  if (!ready) {
    afSubmitAttempted = true;
    updateAfReqHint();
    const firstInvalidKey = Object.keys(fields).find(k => !fields[k]);
    if (firstInvalidKey) $(AF_FIELD_INPUT_IDS[firstInvalidKey])?.focus();
    $('af-error-banner')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  const who = $('af-who').value, what = $('af-what').value;
  const from = effectiveFrom().trim().slice(0, 60), to = effectiveTo().trim().slice(0, 60);
  const where = from && to ? `${from} → ${to}` : (from || to || '');
  const why = $('af-why').value.trim().slice(0, 160);
  const ccy = effectiveCcy(), ctx = $('af-ctx').value.trim().slice(0, 1000);

  let amt = $('af-amt').value.replace(/,/g, '');
  amt = Math.min(Number(amt), 1e15);

  const parts = [`WHO: ${who}`];
  parts.push(`WHAT: ${what}`);
  if (where) parts.push(`WHERE: ${where}`);
  if (why) parts.push(`WHY: ${why}`);
  if (amt) parts.push(`AMOUNT: ${ccy} ${Number(amt).toLocaleString()}`);
  if (ctx) parts.push(`CONTEXT: ${ctx}`);
  const query = parts.join('\n');

  const inputRows = [['Who is transacting', who]];
  inputRows.push(['Transaction type', what]);
  if (where) inputRows.push(['Where', where]);
  if (why) inputRows.push(['Why', why]);
  if (amt) inputRows.push(['Amount', `${ccy} ${Number(amt).toLocaleString()}`]);
  if (ctx) inputRows.push(['Additional context', ctx]);

  const out = $('analyst-out'); out.innerHTML = '';
  out.appendChild(mkEl('div','sec-hdr','Compliance health-check'));
  const chunks = retrieve(`${who} ${what} ${why} ${ctx}`, 'all', 6);

  if (!aiConfigured()) {
    out.appendChild(mkEl('div','error-msg','No AI provider configured — showing a reference lookup instead. Add a Gemini key or enable Ollama in Settings for full AI verdicts.'));
    out.appendChild(provisionList(chunks));
    return;
  }
  if (!(await ensureAiAck())) { out.innerHTML = ''; return; }
  if (!aiCooldownOk()) return;
  const load = mkEl('div','loading','<span class="dot"></span><span class="dot"></span><span class="dot"></span>');
  out.appendChild(load);
  $('analyst-run').disabled = true;
  try {
    const raw = await callAI(query, chunks, []);
    load.remove();
    const p = parseResp(raw);
    if (p.ok) out.appendChild(verdictCard(p.data, chunks, p.partial, inputRows));
    else out.appendChild(rawCard(p.raw));
    out.appendChild(provisionList(chunks, 'Provisions used for this check'));
    logActivity('analyst', `Compliance check: ${who} — ${what} → ${p.ok ? (VCFG[p.data.verdict]?.label || p.data.verdict) : 'unparsed response'}`);
  } catch (err) {
    load.remove();
    out.appendChild(aiFallbackBlock(err, chunks));
    logActivity('analyst', `Compliance check: ${who} — ${what} → AI unavailable, showed reference provisions`);
  } finally {
    $('analyst-run').disabled = false;
    updateAfReqHint();
    out.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }
});

/* Resets every analyst-form field (and its saved draft) back to empty — leaves the chat
   draft (a separate, unrelated field on ST.draft) untouched. */
function clearAnalystForm() {
  ['af-who', 'af-what', 'af-from', 'af-to', 'af-ccy'].forEach(id => { $(id).value = ''; });
  ['af-why', 'af-amt', 'af-ctx', 'af-from-other', 'af-to-other', 'af-ccy-other'].forEach(id => { $(id).value = ''; });
  ['af-from-other-hint', 'af-to-other-hint', 'af-ccy-other-hint'].forEach(id => {
    const hint = $(id); hint.textContent = ''; hint.classList.remove('warn');
  });
  document.querySelectorAll('#analyst-form .other-input-row').forEach(row => row.classList.add('hidden'));
  afFromCustomValue = ''; afToCustomValue = ''; afCcyCustomValue = '';
  updateAfSummary();
  updateAfFxEstimate();
  afSubmitAttempted = false;
  updateAfReqHint();
  $('analyst-out').innerHTML = '';
  Object.assign(ST.draft, DEFAULT_DRAFT, { chat: ST.draft.chat });
  saveDraft();
  toast('Form cleared');
}
$('analyst-clear').addEventListener('click', clearAnalystForm);

/* ━━━ ADVISOR CHAT ━━━ */
function renderAdvisorPills() {
  const bar = $('advisor-pills'); bar.innerHTML = '';
  [{id:'all',label:'All Notices'}, ...Object.values(NOTICES).map(n=>({id:String(n.id),label:n.short+' · '+n.title.split(',')[0].split(' and ')[0]}))].forEach(p => {
    const b = mkEl('button','npill'+(ST.advisorFilter===p.id?' on':''), esc(p.label));
    b.addEventListener('click', () => { ST.advisorFilter = p.id; renderAdvisorPills(); });
    bar.appendChild(b);
  });
  $('advisor-scope').textContent = 'Scope: ' + (ST.advisorFilter==='all' ? 'All Notices' : 'Notice '+ST.advisorFilter);
}
const SAMPLES = [
  'Can a resident individual with a housing loan invest RM1.5 million in Singapore stocks?',
  'My customer wants to carry RM5,000 cash to Bangkok — allowed?',
  'A Malaysian company is borrowing USD 30 million from its parent in Japan. Any limits?',
  'Exporter received only 80% of proceeds after freight deductions — compliant with Notice 7?',
];
function renderAdvisorEmpty() {
  const m = $('msgs'); m.innerHTML = '';
  const empty = mkEl('div','empty-center',
    `<i class="ti ti-message-chatbot"></i><h3>Ask the FEP Advisor</h3>
     <p>Describe the transaction — <strong>who</strong> is transacting, <strong>what</strong> they're doing, <strong>where</strong>, <strong>why</strong> and the <strong>amount</strong>. You'll get a structured verdict with FEP citations.</p>`);
  const s = mkEl('div','samples');
  SAMPLES.forEach(q => {
    const b = mkEl('button','sample', esc(q));
    b.addEventListener('click', () => { $('chat-inp').value = q; $('send-btn').disabled = false; sendChat(); });
    s.appendChild(b);
  });
  empty.appendChild(s);
  m.appendChild(empty);
}
function pushUserMsg(text) { $('msgs').appendChild(mkEl('div','msg-user', esc(text))); }

/* ━━━ TOPIC-RELEVANCE GATE (chat input only) ━━━
   Rejects off-topic queries client-side, before any AI call. Built entirely from
   already-loaded kb.js globals (GLOSSARY, NOTICES) plus a small generic FX/banking
   allowlist — does not modify kb.js or its exports.
   Two-bucket allowlist: single-word terms go in a `tokens` Set (exact-match against
   query words length >=4); multi-word/hyphenated terms (e.g. "write-off", "money
   changer") are normalized and kept whole in a `phrases` array, matched as a
   substring of the normalized query — this avoids a short common word inside a
   hyphenated term (e.g. "write" from "write-off") spuriously matching unrelated
   queries like "write a haiku".
   The retrieve() fallback is gated to queries with >=2 distinct content words, and
   requires >=2 of those words to literally appear in the same retrieved chunk's
   title/body/kw — a single coincidentally shared common word is no longer enough. */
const STOPWORDS = new Set([
  'what','where','when','which','who','whom','whose','why','how',
  'like','about','today','tonight','right','story','write','short',
  'long','good','great','nice','capital','please','could','would',
  'should','really','very','just','that','this','these','those',
  'your','tell','give','recommend','favorite','favourite','translate',
  'weather','time','morning','afternoon','evening','night',
]);
let _topicTokens = null;
let _topicPhrases = null;
function buildTopicSets() {
  if (_topicTokens) return;
  const tokens = new Set();
  const phrases = [];
  const addPhrase = phrase => {
    const norm = String(phrase).toLowerCase().trim().replace(/[-/]+/g, ' ').replace(/\s+/g, ' ');
    if (/\s/.test(norm)) {
      if (norm.length >= 3) phrases.push(norm);
    } else if (norm.length >= 3) {
      tokens.add(norm);
    }
  };
  Object.keys(GLOSSARY).forEach(addPhrase);
  Object.values(NOTICES).forEach(n => (n.kw || []).forEach(addPhrase));
  [
    'remit','remittance','transfer','payment','loan','invest','currency','ringgit',
    'forex','fx','border','export','import','customs','bank','account','resident',
    'nonresident','ecf','drb','hedge','ecb','borrow','lend','guarantee','proceeds',
    'declare','declaration','repatriate','onshore','offshore','sukuk','bond','dealer',
    'money changer','authority','compliance','transaction','overseas','abroad',
  ].forEach(addPhrase);
  _topicTokens = tokens;
  _topicPhrases = phrases;
}
function isOnTopicQuery(query) {
  buildTopicSets();
  const raw = String(query || '').toLowerCase().trim();
  const normalized = raw.replace(/[-/]+/g, ' ').replace(/\s+/g, ' ');
  const qWords = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  const qTokens = qWords.filter(w => w.length >= 4 && !STOPWORDS.has(w));

  if (qTokens.some(t => _topicTokens.has(t))) return true;
  if (_topicPhrases.some(p => normalized.includes(p))) return true;

  if (qTokens.length < 2) return false;
  try {
    const chunks = retrieve(query, 'all', 3);
    if (!chunks || !chunks.length) return false;
    const qSet = new Set(qTokens);
    return chunks.some(c => {
      const text = `${c.title || ''} ${c.body || ''} ${(c.kw || []).join(' ')}`.toLowerCase();
      let hits = 0;
      qSet.forEach(t => { if (text.includes(t)) hits++; });
      return hits >= 2;
    });
  } catch { return false; }
}

async function sendChat() {
  const inp = $('chat-inp');
  const q = inp.value.trim().slice(0, 600);
  if (!q || ST.loading) return;
  if (!isOnTopicQuery(q)) { toast('Please ask about a forex transaction, remittance, or FEP compliance topic.'); return; }
  if (!aiConfigured()) { toast('Configure an AI provider in Settings first'); switchTab('settings'); openSettingsScreen('ai','fwd'); return; }
  if (!(await ensureAiAck())) return;
  if (!aiCooldownOk()) return;
  if (!ST.msgs.length) $('msgs').innerHTML = '';
  inp.value = ''; $('send-btn').disabled = true;
  pushUserMsg(q);
  ST.msgs.push({ role:'user', content:q });
  const m = $('msgs');
  const load = mkEl('div','loading','<span class="dot"></span><span class="dot"></span><span class="dot"></span>');
  m.appendChild(load); m.scrollTop = m.scrollHeight;
  ST.loading = true;
  const chunks = retrieve(q, ST.advisorFilter, 5);
  try {
    const raw = await callAI(q, chunks, ST.msgs.slice(0,-1));
    load.remove();
    const wrap = mkEl('div','msg-ai');
    const p = parseResp(raw);
    if (p.ok) { wrap.appendChild(verdictCard(p.data, chunks, p.partial, [['Question', q]])); ST.msgs.push({ role:'assistant', content: JSON.stringify(p.data) }); }
    else { wrap.appendChild(rawCard(p.raw)); ST.msgs.push({ role:'assistant', content: raw }); }
    m.appendChild(wrap);
    logActivity('advisor', `Advisor query: "${q.slice(0,70)}${q.length>70?'…':''}" → ${p.ok ? (VCFG[p.data.verdict]?.label || p.data.verdict) : 'unparsed response'}`);
    // persist session
    const sess = ST.sessions.find(s => s.id === ST.sessId);
    if (sess) { sess.msgs = ST.msgs; sess.q = ST.msgs[0].content; }
    else ST.sessions.unshift({ id: ST.sessId, q, ts: Date.now(), msgs: ST.msgs });
    ST.sessions = ST.sessions.slice(0, 30);
    save('fep_sess', ST.sessions);
  } catch (err) {
    load.remove();
    const wrap = mkEl('div','msg-ai');
    wrap.appendChild(aiFallbackBlock(err, chunks));
    m.appendChild(wrap);
    logActivity('advisor', `Advisor query: "${q.slice(0,70)}${q.length>70?'…':''}" → AI unavailable, showed reference provisions`);
  } finally {
    ST.loading = false;
    m.scrollTop = m.scrollHeight;
  }
}
ST.sessId = Date.now().toString();
$('chat-inp').addEventListener('input', e => {
  $('send-btn').disabled = !e.target.value.trim();
  ST.draft.chat = e.target.value;
  saveDraft();
});
$('chat-inp').addEventListener('keydown', e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
$('send-btn').addEventListener('click', sendChat);
$('new-chat-btn').addEventListener('click', () => { ST.msgs = []; ST.sessId = Date.now().toString(); renderAdvisorEmpty(); });
$('history-btn').addEventListener('click', () => {
  const body = $('hist-body'); body.innerHTML = '';
  if (!ST.sessions.length) body.appendChild(mkEl('div','empty-center','<i class="ti ti-history"></i><p>No saved conversations yet.</p>'));
  ST.sessions.forEach(s => {
    const card = mkEl('div','sess-card',`<div class="sess-q">${esc(s.q)}</div><div class="sess-ts">${new Date(s.ts).toLocaleString('en-MY')}</div>`);
    card.addEventListener('click', () => {
      closeOverlays();
      ST.msgs = s.msgs.slice(); ST.sessId = s.id;
      const m = $('msgs'); m.innerHTML = '';
      ST.msgs.forEach(msg => {
        if (msg.role === 'user') pushUserMsg(msg.content);
        else {
          const wrap = mkEl('div','msg-ai');
          const p = parseResp(msg.content);
          if (p.ok) wrap.appendChild(verdictCard(p.data, null, p.partial)); else wrap.appendChild(rawCard(msg.content));
          m.appendChild(wrap);
        }
      });
      switchTab('tools'); switchTool('advisor');
    });
    body.appendChild(card);
  });
  if (ST.sessions.length) {
    const clr = mkEl('button','clr-btn','<i class="ti ti-trash"></i> Clear all history');
    clr.addEventListener('click', () => { ST.sessions = []; save('fep_sess', []); closeOverlays(); toast('History cleared'); });
    body.appendChild(clr);
  }
  openOverlay('hist-overlay');
});

/* ━━━ SETTINGS ━━━ */
const GEMINI_MODELS = [
  { id:'gemini-2.5-flash', note:'fast · recommended' },
  { id:'gemini-2.5-pro', note:'strongest reasoning' },
  { id:'gemini-2.0-flash', note:'legacy fallback' },
];
/* ━━━ SETTINGS / MORE (hub-and-spoke) ━━━
   The More tab is a hub of navigation-only cards; each card pushes a
   sub-screen (AI Provider / Daily Challenge / Data & Privacy / About) with a
   back arrow returning to the hub. Legal & Policies stays the standalone
   legal.html page. Which screen is open is transient (not persisted) —
   switching to the tab always lands on the hub. */
const SETTINGS_HUB_CARDS = [
  { id:'ai',    icon:'ti-cpu',         title:'AI Provider' },
  { id:'games', icon:'ti-puzzle',      title:'Daily Challenge' },
  { id:'data',  icon:'ti-shield-lock', title:'Data & Privacy' },
  { id:'legal', icon:'ti-file-text',   title:'Legal & Policies', href:'legal.html' },
  { id:'about', icon:'ti-info-circle', title:'About' },
];
const SETTINGS_SCREEN_TITLES = { ai:'AI Provider', games:'Daily Challenge', data:'Data & Privacy', about:'About' };

/* Sub-screens participate in browser history via a #more/<screen> hash entry,
   so the hardware back button / edge-swipe on mobile returns to the More hub
   instead of leaving the app. `fromHistory` marks renders triggered by
   popstate itself, which must not push/replace again. */
const MORE_HASH = '#more/';
function openSettingsScreen(screen, dir, fromHistory) {
  ST.settingsScreen = screen;
  renderSettings(dir);
  if (fromHistory) return;
  if (screen === 'hub') {
    // drop any stale sub-screen hash without adding a history entry
    if (location.hash.startsWith(MORE_HASH)) history.replaceState(null, '', location.pathname + location.search);
  } else {
    history.pushState({ moreScreen: screen }, '', MORE_HASH + screen);
  }
}
window.addEventListener('popstate', () => {
  if (ST.tab !== 'settings') return; // stale #more entry popped while on another tab — ignore
  const m = location.hash.startsWith(MORE_HASH) ? location.hash.slice(MORE_HASH.length) : null;
  if (m && SETTINGS_SCREEN_TITLES[m]) openSettingsScreen(m, 'fwd', true);
  else if (ST.settingsScreen !== 'hub') openSettingsScreen('hub', 'back', true);
});

/* Brand compass needle rotated to point west — the shared "go back" mark on every sub-screen */
const COMPASS_BACK_SVG = `<svg class="set-back-compass" viewBox="0 0 512 512" aria-hidden="true">
  <circle cx="256" cy="256" r="170" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="36"/>
  <path d="M344 168 L286 286 L168 344 L226 226 Z" transform="rotate(-135 256 256)"/>
</svg>`;

function renderSettings(dir) {
  const el = $('settings-content'); el.innerHTML = '';
  const screen = ST.settingsScreen || 'hub';
  const wrap = mkEl('div', 'set-screen' + (dir ? ' slide-' + dir : ''));
  el.appendChild(wrap);
  if (screen === 'hub') return renderSettingsHub(wrap);

  const head = mkEl('header','subscreen-head');
  const back = mkEl('button','set-back', COMPASS_BACK_SVG + '<span>Back to app</span>');
  back.setAttribute('aria-label','Back to More');
  back.addEventListener('click', () => {
    // unwind the pushed #more entry so in-app back and hardware back stay in sync
    if (location.hash.startsWith(MORE_HASH)) history.back();
    else openSettingsScreen('hub','back');
  });
  head.appendChild(back);
  head.appendChild(mkEl('h1', null, esc(SETTINGS_SCREEN_TITLES[screen] || 'More')));
  wrap.appendChild(head);

  if (screen === 'ai') renderAiProviderScreen(wrap);
  else if (screen === 'games') renderGamesScreen(wrap);
  else if (screen === 'data') renderDataPrivacyScreen(wrap);
  else if (screen === 'about') renderAboutScreen(wrap);
}

function renderSettingsHub(wrap) {
  const head = mkEl('header','page-head',
    `<h1>More</h1>
     <p class="page-sub">Educational guidance only — not legal advice. Verify complex cases with the FEP Authority.</p>`);
  wrap.appendChild(head);
  const nav = mkEl('nav','set-nav');
  nav.setAttribute('aria-label','Settings sections');
  SETTINGS_HUB_CARDS.forEach(cd => {
    const inner = `<span class="set-nav-icon"><i class="ti ${cd.icon}"></i></span>
      <span class="set-nav-title">${esc(cd.title)}</span>
      <i class="ti ti-chevron-right set-nav-chev"></i>`;
    let card;
    if (cd.href) {
      card = mkEl('a','set-nav-card', inner);
      card.href = cd.href; card.target = '_blank'; card.rel = 'noopener';
    } else {
      card = mkEl('button','set-nav-card', inner);
      card.addEventListener('click', () => openSettingsScreen(cd.id,'fwd'));
    }
    nav.appendChild(card);
  });
  wrap.appendChild(nav);
}

function renderGamesScreen(wrap) {
  const card = mkEl('article','card',
    `<div class="card-head"><h2><i class="ti ti-trophy"></i> Daily FEP Challenge</h2></div>
     <div id="dash-challenge" class="dash-challenge"></div>`);
  wrap.appendChild(card);
  renderDashChallenge();
  wrap.appendChild(mkEl('p','hint',
    'Team scores are pooled anonymously per institution and shown on the Dashboard leaderboard. Only the institution name, whether the answer was correct, and the time taken are shared — never who played.'));
}

function renderDataPrivacyScreen(wrap) {
  const card = mkEl('div','card');
  card.innerHTML = `<div class="card-head"><h2><i class="ti ti-shield-lock"></i> Data &amp; Privacy</h2></div>
    <p class="hint mb-12">Everything FEP Compass stores — provider settings, chat history, the activity log and challenge record — lives only in this browser's localStorage. Nothing leaves this device unless a cloud AI provider (Gemini) is configured, in which case your queries are sent to Google. Do not enter customer-identifying or other confidential data.</p>
    <div class="btn-row mt-0">
      <button class="btn" id="clear-data"><i class="ti ti-trash"></i> Clear all local data</button>
    </div>`;
  wrap.appendChild(card);
  const clearBtn = card.querySelector('#clear-data');
  clearBtn.addEventListener('click', () => {
    if (!clearBtn.dataset.armed) {
      clearBtn.dataset.armed = '1';
      clearBtn.innerHTML = '<i class="ti ti-alert-triangle"></i> Tap again to erase everything';
      setTimeout(() => { delete clearBtn.dataset.armed; clearBtn.innerHTML = '<i class="ti ti-trash"></i> Clear all local data'; }, 3500);
      return;
    }
    ['fep_cfg','fep_sess','fep_limits','fep_decls','fep_activity','fep_draft','fep_nav','fep_game','fep_onboarded','fep_ai_ack','fep_setup_guide_seen'].forEach(k => localStorage.removeItem(k));
    location.reload();
  });
}

function renderAboutScreen(wrap) {
  const card = mkEl('div','card');
  card.innerHTML = `<div class="card-head"><h2><i class="ti ti-info-circle"></i> About FEP Compass</h2></div>
    <p class="hint mb-12">FEP Compass v2.0 · Notices N1–N7 effective 1 Oct 2025 · Educational guidance only, not legal advice.
    Official source: <a href="${FEP_OFFICIAL_URL}" target="_blank" rel="noopener">bnm.gov.my/fep/policies/notices</a></p>
    <div class="btn-row mt-0">
      <button class="btn" id="replay-guide"><i class="ti ti-refresh"></i> Replay setup guide</button>
    </div>`;
  wrap.appendChild(card);
  card.querySelector('#replay-guide').addEventListener('click', () => {
    localStorage.removeItem(FIRST_RUN_GUIDE_KEY);
    renderFirstRunStep('welcome');
  });
}

function renderAiProviderScreen(el) {
  const c = ST.cfg;

  const sec = mkEl('div','card');
  sec.innerHTML = `<div class="card-head"><h2><i class="ti ti-plug-connected"></i> AI Provider</h2></div>
  <div class="provider-opts">
    <button class="popt ${c.provider==='gemini'?'on':''}" data-p="gemini"><span class="popt-id">Gemini</span><span class="popt-note">Cloud · free API key from Google AI Studio</span></button>
    <button class="popt ${c.provider==='ollama'?'on':''}" data-p="ollama"><span class="popt-id">Ollama</span><span class="popt-note">Local · fully offline, no API key</span></button>
  </div>
  <div id="prov-fields"></div>
  <div class="btn-row">
    <button class="btn primary" id="set-save"><i class="ti ti-device-floppy"></i> Save</button>
    <button class="btn" id="set-test"><i class="ti ti-wifi"></i> Test Connection</button>
    <span id="set-status" class="status-info"></span>
  </div>
  <div class="info-box">
    <strong>Gemini:</strong> create a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">aistudio.google.com/app/apikey</a>, paste it above and Save.<br>
    <strong>Ollama:</strong> install from <a href="https://ollama.com" target="_blank" rel="noopener">ollama.com</a>, run <code>ollama pull qwen2.5:7b</code>, then select Ollama. Keys are stored only in this browser (localStorage) — never sent anywhere except directly to Google's API. Anyone with access to this device/browser profile (or a malicious browser extension) could read it, so avoid saving a key on shared or untrusted computers.
  </div>`;
  el.appendChild(mkEl('p','page-sub mb-12','Connect an AI provider for the Advisor and Compliance Analyst. Reference search works without any setup.'));
  el.appendChild(sec);

  const fields = sec.querySelector('#prov-fields');
  const renderFields = () => {
    if (c.provider === 'gemini') {
      fields.innerHTML = `
        <div class="set-field"><label class="set-lbl">Gemini API Key</label>
          <input class="set-inp" id="f-key" type="password" placeholder="AIzaSy…" value="${esc(c.apiKey)}"></div>
        <div class="set-field"><label class="set-lbl">Model</label><div class="model-opts">${
          GEMINI_MODELS.map(mo=>`<button class="mopt ${c.model===mo.id?'on':''}" data-m="${mo.id}"><span class="mopt-id">${mo.id}</span><span class="mopt-note">${mo.note}</span></button>`).join('')
        }</div></div>`;
      fields.querySelectorAll('.mopt').forEach(b => b.addEventListener('click', () => { c.model = b.dataset.m; renderFields(); }));
      fields.querySelector('#f-key').addEventListener('input', e => c.apiKey = e.target.value.trim());
    } else {
      fields.innerHTML = `
        <div class="set-field"><label class="set-lbl">Ollama URL</label>
          <input class="set-inp" id="f-url" value="${esc(c.ollamaUrl)}"></div>
        <div class="set-field"><label class="set-lbl">Model</label>
          <input class="set-inp" id="f-model" value="${esc(c.ollamaModel)}">
          <div class="hint">Pull first: <code>ollama pull qwen2.5:7b</code></div></div>`;
      fields.querySelector('#f-url').addEventListener('input', e => c.ollamaUrl = e.target.value.trim());
      fields.querySelector('#f-model').addEventListener('input', e => c.ollamaModel = e.target.value.trim());
    }
  };
  renderFields();
  sec.querySelectorAll('.popt').forEach(b => b.addEventListener('click', () => {
    c.provider = b.dataset.p;
    sec.querySelectorAll('.popt').forEach(x => x.classList.toggle('on', x.dataset.p === c.provider));
    renderFields();
  }));
  sec.querySelector('#set-save').addEventListener('click', () => {
    if (c.provider === 'ollama' && !isLocalOllamaUrl(c.ollamaUrl)) return toast('Ollama URL must start with http://localhost: or http://127.0.0.1:');
    save('fep_cfg', c); toast('Settings saved');
  });
  sec.querySelector('#set-test').addEventListener('click', async () => {
    const st = sec.querySelector('#set-status');
    if (c.provider === 'ollama' && !isLocalOllamaUrl(c.ollamaUrl)) { st.className = 'status-err'; st.textContent = 'Ollama URL must start with http://localhost: or http://127.0.0.1:'; return; }
    st.className = 'status-info'; st.textContent = 'Testing…';
    try {
      const raw = await callAI('Reply with exactly: {"verdict":"PERMITTED","summary":"connection ok","explanation":"test","citation":"","conditions":[],"warning":null,"nextStep":"No filing required"}', CHUNKS.slice(0,1), []);
      st.className = raw ? 'status-ok' : 'status-err';
      st.textContent = raw ? '✓ Connected' : 'Empty response';
    } catch (err) { st.className = 'status-err'; st.textContent = err.message; }
  });
}

/* ━━━ ONBOARDING (first-run walkthrough) ━━━ */
const ONBOARDING_KEY = 'fep_onboarded';
function initOnboarding() {
  if (localStorage.getItem(ONBOARDING_KEY)) return;
  const card = $('onboarding-card');
  card.classList.remove('hidden');
  card.querySelectorAll('.onboarding-step').forEach(b => b.addEventListener('click', () => {
    const step = b.dataset.step;
    if (step === 'explore') openNotice(1);
    else if (step === 'check') openQuickCheck(1);
    else if (step === 'settings') { switchTab('settings'); openSettingsScreen('ai','fwd'); }
    dismissOnboarding();
  }));
  $('onboarding-dismiss').addEventListener('click', dismissOnboarding);
}
function dismissOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, '1');
  $('onboarding-card').classList.add('hidden');
}

/* ━━━ FIRST-RUN SETUP GUIDE (separate from the onboarding nudge card above) ━━━
   A one-time, step-by-step modal: welcome → get a Gemini key → paste it (or
   skip) → if no key was provided, a "skipped" step explains what's limited →
   PII/legal consent gate → done. Step navigation is name-based (not a flat
   index) since the flow branches conditionally: Skip on the "gemini" step
   jumps straight to "skipped", bypassing "paste" entirely; "paste" itself
   only falls through to "skipped" when left blank. Only the "seen" flag is
   persisted; the current step is transient. Mirrors ensureAiAck()'s
   open/cleanup shape. */
const FIRST_RUN_GUIDE_KEY = 'fep_setup_guide_seen';
function initFirstRunGuide() {
  if (!localStorage.getItem(FIRST_RUN_GUIDE_KEY)) renderFirstRunStep('welcome');
}
function renderFirstRunStep(step) {
  const ov = $('firstrun-overlay');
  ov.querySelectorAll('.fr-step').forEach(el => el.classList.toggle('hidden', el.dataset.frStep !== step));

  const next = $('fr-next'), skip = $('fr-skip'), agree = $('fr-agree'), keyInp = $('fr-key'), consentChk = $('fr-consent-check');
  next.classList.add('hidden'); skip.classList.add('hidden'); agree.classList.add('hidden');

  let nextStep = null;
  if (step === 'welcome') {
    next.classList.remove('hidden'); next.innerHTML = 'Get started';
    nextStep = 'gemini';
  } else if (step === 'gemini') {
    next.classList.remove('hidden'); next.innerHTML = 'Next';
    skip.classList.remove('hidden');
    nextStep = 'paste';
  } else if (step === 'paste') {
    next.classList.remove('hidden'); next.innerHTML = 'Next';
  } else if (step === 'skipped') {
    next.classList.remove('hidden'); next.innerHTML = 'Continue';
    nextStep = 'consent';
  } else if (step === 'consent') {
    agree.classList.remove('hidden');
    agree.disabled = !consentChk.checked;
  } else if (step === 'done') {
    next.classList.remove('hidden'); next.innerHTML = 'Finish';
    const c = ST.cfg;
    $('fr-done-msg').textContent = c.apiKey
      ? "You're all set — your Gemini key is saved in Settings."
      : "You're all set. Add a Gemini key (or switch to local Ollama) anytime in Settings → AI Provider.";
  }

  const onNext = () => {
    if (step === 'paste') {
      const v = keyInp.value.trim();
      if (v) { ST.cfg.apiKey = v; save('fep_cfg', ST.cfg); renderSettings(); }
      cleanup();
      renderFirstRunStep(v ? 'consent' : 'skipped');
      return;
    }
    cleanup();
    renderFirstRunStep(nextStep);
  };
  const onSkip = () => { cleanup(); renderFirstRunStep('skipped'); };
  const onAgree = () => { cleanup(); renderFirstRunStep('done'); };
  const onFinish = () => {
    localStorage.setItem(FIRST_RUN_GUIDE_KEY, '1');
    cleanup();
    ov.classList.remove('open');
  };
  const onConsentChange = () => { agree.disabled = !consentChk.checked; };
  const onBackdrop = e => { if (e.target === ov) { cleanup(); ov.classList.remove('open'); } };
  const onKey = e => { if (e.key === 'Escape') { cleanup(); ov.classList.remove('open'); } };

  function cleanup() {
    next.removeEventListener('click', step === 'done' ? onFinish : onNext);
    skip.removeEventListener('click', onSkip);
    agree.removeEventListener('click', onAgree);
    consentChk.removeEventListener('change', onConsentChange);
    ov.removeEventListener('click', onBackdrop);
    document.removeEventListener('keydown', onKey);
  }

  if (step === 'done') next.addEventListener('click', onFinish);
  else next.addEventListener('click', onNext);
  skip.addEventListener('click', onSkip);
  agree.addEventListener('click', onAgree);
  consentChk.addEventListener('change', onConsentChange);
  ov.addEventListener('click', onBackdrop);
  document.addEventListener('keydown', onKey);

  ov.classList.add('open');
}

/* ━━━ PWA — offline service worker (https / localhost only) ━━━ */
if ('serviceWorker' in navigator &&
    (location.protocol === 'https:' || ['localhost','127.0.0.1'].includes(location.hostname))) {
  navigator.serviceWorker.register('sw.js').catch(() => {/* file:// or unsupported — app still works online */});
}

/* ━━━ APP LOADER — hides once the initial render below has finished, with a short minimum
   display time (against APP_LOAD_TS, set at the very top of this file) so the spin is
   actually visible even when init runs in a few milliseconds ━━━ */
function hideAppLoader() {
  const loader = $('app-loader');
  if (!loader) return;
  const wait = Math.max(0, 400 - (Date.now() - APP_LOAD_TS));
  setTimeout(() => {
    loader.classList.add('loaded');
    loader.addEventListener('transitionend', () => loader.remove(), { once:true });
  }, wait);
}

/* ━━━ PULL-TO-REFRESH (mobile) — the app shell (.view) has overscroll-behavior:contain,
   so the browser's native pull-to-refresh never reaches the document; this reproduces it
   with a real location.reload(), which restoreDraft() below makes safe to do mid-form. ━━━ */
function initPullToRefresh() {
  const PULL_MAX = 90, PULL_TRIGGER = 55;
  const wrap = $('ptr-indicator'), compass = $('ptr-compass');
  const needle = compass ? compass.querySelector('.ptr-needle') : null;
  if (!wrap || !compass || !needle) return;
  let startY = 0, dragging = false, ready = false;

  function scrollerAtTop() {
    const view = document.querySelector('.view.active');
    if (!view) return false;
    const msgs = view.querySelector('.msgs');
    const scroller = (msgs && msgs.offsetParent !== null) ? msgs : view;
    return scroller.scrollTop <= 0;
  }
  function reset() {
    wrap.classList.remove('visible', 'ready', 'spin');
    wrap.style.transform = ''; needle.style.transform = '';
  }

  document.addEventListener('touchstart', e => {
    dragging = window.matchMedia('(max-width: 860px)').matches &&
      e.touches.length === 1 && !document.querySelector('.overlay.open') && scrollerAtTop();
    if (dragging) { startY = e.touches[0].clientY; ready = false; }
  }, { passive:true });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    if (!scrollerAtTop()) { dragging = false; reset(); return; }
    const dy = e.touches[0].clientY - startY;
    if (dy <= 0) { reset(); return; }
    const pull = Math.min(dy * 0.5, PULL_MAX);
    ready = pull >= PULL_TRIGGER;
    wrap.classList.add('visible');
    wrap.classList.toggle('ready', ready);
    wrap.style.transform = `translate(-50%, ${pull - 60}px)`;
    needle.style.transform = `rotate(${dy}deg)`;
  }, { passive:true });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    if (ready) {
      wrap.classList.add('spin');
      needle.style.transform = '';
      setTimeout(() => location.reload(), 300);
    } else {
      reset();
    }
  });
}

/* ━━━ DRAFT RESTORE — repopulates the analyst form + chat input from ST.draft; must run
   after the <select>s below are populated so their values can actually be set ━━━ */
function restoreOtherField(selectId, otherInputId, value, otherValue, setCustom) {
  if (!value) return;
  const sel = $(selectId);
  sel.value = value;
  if (value === 'Other') {
    sel.parentElement.querySelector('.other-input-row')?.classList.remove('hidden');
    if (otherValue) { $(otherInputId).value = otherValue; setCustom(otherValue); }
  }
}
function restoreCcyField(value, otherValue) {
  if (!value) return;
  const sel = $('af-ccy');
  sel.value = value;
  if (value === 'Other') {
    sel.parentElement.parentElement.querySelector('.other-input-row')?.classList.remove('hidden');
    if (otherValue) { $('af-ccy-other').value = otherValue; afCcyCustomValue = otherValue; }
  }
}
function hasAnalystDraft(d) {
  return !!(d.who || d.what || d.from || d.to || d.why || d.ccy || d.amt || d.ctx);
}
function restoreDraft() {
  const d = ST.draft;
  if (d.who) $('af-who').value = d.who;
  if (d.what) $('af-what').value = d.what;
  if (d.why) $('af-why').value = d.why;
  if (d.amt) $('af-amt').value = d.amt;
  if (d.ctx) $('af-ctx').value = d.ctx;
  restoreOtherField('af-from', 'af-from-other', d.from, d.fromOther, v => { afFromCustomValue = v; });
  restoreOtherField('af-to', 'af-to-other', d.to, d.toOther, v => { afToCustomValue = v; });
  restoreCcyField(d.ccy, d.ccyOther);
  updateAfSummary();
  updateAfFxEstimate();
  updateAfReqHint();

  if (d.chat) { $('chat-inp').value = d.chat; $('send-btn').disabled = !d.chat.trim(); }

  // jump back to wherever the in-progress draft actually lives, so restoring it is visible
  if (hasAnalystDraft(d)) { switchTab('tools'); switchTool('analyst'); }
  else if (d.chat && d.chat.trim()) { switchTab('tools'); switchTool('advisor'); }
}

/* ━━━ INIT ━━━ */
renderDashboard();
renderDashNotices();
renderNoticeCards();
renderGlossary();
renderAdvisorPills();
renderAdvisorEmpty();
// a #more/<screen> hash only ever refers to an in-session history entry — after a
// reload it's stale (the More tab always lands on the hub), so drop it up front
if (location.hash.startsWith(MORE_HASH)) history.replaceState(null, '', location.pathname + location.search);
renderSettings();
buildBM25();
renderQuickfillChips();
renderWhoSelect();
renderWhatSelect();
renderCcySelect();
renderCountrySelect('af-from');
renderCountrySelect('af-to');
wireCountryField('af-from', 'af-from-other', 'af-from-other-hint', selectFrom, v => { afFromCustomValue = v; });
wireCountryField('af-to', 'af-to-other', 'af-to-other-hint', selectTo, v => { afToCustomValue = v; });
// sync the DOM to whichever tab/tool was last visited (the baked-in HTML default is just the
// fallback for a brand-new visitor) — restoreDraft() below may still override this if there's
// an in-progress draft, since showing unsaved work takes priority over the last-viewed tab
switchTab(ST.tab);
switchTool(ST.toolTab);
restoreDraft();
initOnboarding();
initFirstRunGuide();
initPullToRefresh();
hideAppLoader();
