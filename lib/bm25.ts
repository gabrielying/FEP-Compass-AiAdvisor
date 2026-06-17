// Ported verbatim from legacy/app.js — BM25 retrieval engine over FEP notice chunks.
import { CHUNKS, type Chunk } from './fep-data';

const STOPS = new Set(
  'the a an and or but in on at to for of with by from is are was were be been have has had do does did will would could should may might must shall can any all this that these those it its they them their which who whom where when how what why not no nor into as if so then than though although because while after before since until upon via per'.split(
    ' ',
  ),
);
const tok = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPS.has(w));

interface Bm25Doc {
  tf: Record<string, number>;
  len: number;
}
interface Bm25Index {
  N: number;
  df: Record<string, number>;
  docs: Bm25Doc[];
  avgdl: number;
}

let BM25: Bm25Index | null = null;

function buildBM25(): void {
  const N = CHUNKS.length;
  const df: Record<string, number> = {};
  const docs = CHUNKS.map((c) => {
    const terms = tok(c.title + ' ' + c.body + ' ' + c.noticeName + ' ' + c.ref);
    const tf: Record<string, number> = {};
    terms.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
    return { tf, len: terms.length };
  });
  docs.forEach((d) => Object.keys(d.tf).forEach((t) => (df[t] = (df[t] || 0) + 1)));
  BM25 = { N, df, docs, avgdl: docs.reduce((s, d) => s + d.len, 0) / N };
}

/* Notice 3's core DRB-gated investment limits (Part A/B, Para 1-4) are the foundation
   every Notice 3 FAQ assumes the reader already has — but their short, generic wording
   ("ANY amount" / "RM1 million") scores low on BM25 against scenario-style queries, so
   they often lose out to FAQs that mention the query's literal keywords (e.g. "housing
   loan"). Anchor them in whenever Notice 3 is relevant, so the model always sees the
   UNLIMITED (without DRB) and capped (with DRB) provisions side by side. */
const N3_ANCHOR_REFS = ['Part A, Para 1', 'Part A, Para 2', 'Part B, Para 3', 'Part B, Para 4'];

export function retrieve(query: string, noticeFilter: string = 'all', k = 5): Chunk[] {
  if (!BM25) buildBM25();
  const { N, df, docs, avgdl } = BM25!;
  const K1 = 1.5;
  const B = 0.75;
  const qterms = tok(query);
  if (!qterms.length) return CHUNKS.slice(0, k);
  const ranked = CHUNKS.map((c, i) => {
    if (noticeFilter !== 'all' && c.noticeId !== parseInt(noticeFilter, 10)) return { c, s: -1 };
    const { tf, len } = docs[i];
    let s = 0;
    qterms.forEach((t) => {
      const f = tf[t] || 0;
      if (!f) return;
      const idf = Math.log((N - (df[t] || 0) + 0.5) / ((df[t] || 0) + 0.5) + 1);
      s += (idf * (f * (K1 + 1))) / (f + K1 * (1 - B + (B * len) / avgdl));
    });
    return { c, s };
  })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  const top = ranked.slice(0, k).map((x) => x.c);
  if (top.some((c) => c.noticeId === 3)) {
    const anchors = CHUNKS.filter(
      (c) =>
        c.noticeId === 3 &&
        N3_ANCHOR_REFS.includes(c.ref) &&
        !top.some((t) => t.noticeId === c.noticeId && t.ref === c.ref),
    );
    return [...anchors, ...top];
  }
  return top;
}
