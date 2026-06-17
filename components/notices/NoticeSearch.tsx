'use client';

import { useMemo, useState } from 'react';
import { CHUNKS, type Chunk } from '@/lib/fep-data';
import { retrieve } from '@/lib/bm25';
import { useNoticesUi } from '@/lib/notices-ui-context';
import { NoticeCards } from './NoticeCards';

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const re = new RegExp(`(${escapeRegExp(q)})`, 'gi');
  const parts = text.split(re);
  return parts.map((part, i) => (re.test(part) && i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

export function NoticeSearch() {
  const [q, setQ] = useState('');
  const { openNotice } = useNoticesUi();

  const results: Chunk[] = useMemo(() => {
    const trimmed = q.trim();
    if (!trimmed) return [];
    const ql = trimmed.toLowerCase();
    let r = CHUNKS.filter((c) => (c.title + ' ' + c.body + ' ' + c.noticeName + ' ' + c.ref).toLowerCase().includes(ql));
    if (!r.length) r = retrieve(trimmed, 'all', 8);
    return r;
  }, [q]);

  const trimmed = q.trim();

  return (
    <>
      <div className="search-box" id="notices-search">
        <i className="ti ti-search search-icon" />
        <input
          id="notices-q"
          type="search"
          placeholder='Search all provisions — e.g. "export proceeds 6 months", "RM10 million borrowing"…'
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className={`search-clear${trimmed ? ' visible' : ''}`} onClick={() => setQ('')} title="Clear">
          <i className="ti ti-x" />
        </button>
      </div>

      <div id="notices-results">
        {trimmed &&
          (results.length ? (
            <>
              <div className="sec-hdr">
                {results.length} matching provision{results.length !== 1 ? 's' : ''}
              </div>
              {results.slice(0, 20).map((c) => (
                <div className="result-card" key={`${c.noticeId}-${c.ref}`} onClick={() => openNotice(c.noticeId, c.ref)}>
                  <span className="rtag">{c.noticeName}</span>
                  <span className="rref">{c.ref}</span>
                  <div className="rtitle">{highlight(c.title, trimmed)}</div>
                  <div className="rexcerpt">{highlight(c.body, trimmed)}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-center">
              <i className="ti ti-mood-sad" />
              <p>No provisions match &ldquo;{trimmed}&rdquo;.</p>
            </div>
          ))}
      </div>

      <NoticeCards hidden={!!trimmed} />
    </>
  );
}
