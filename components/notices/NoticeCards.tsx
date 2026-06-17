'use client';

import { NOTICES } from '@/lib/fep-data';
import { useNoticesUi } from '@/lib/notices-ui-context';

export function NoticeCards({ hidden }: { hidden?: boolean }) {
  const { openNotice, openQuickCheck } = useNoticesUi();

  return (
    <div className="notice-cards" style={hidden ? { display: 'none' } : undefined}>
      {Object.values(NOTICES).map((n) => (
        <article className="notice-card" key={n.id}>
          <div className="nc-top">
            <div className="nc-num">{n.id}</div>
            <div className="nc-title">{n.title}</div>
          </div>
          <div className="nc-desc">{n.desc}</div>
          <div className="nc-meta">
            {n.secs.length} provisions{n.faqs?.length ? ` · ${n.faqs.length} FAQs` : ''} · effective 1 Oct 2025
          </div>
          <div className="nc-actions">
            <button className="btn primary act-explore" onClick={() => openNotice(n.id)}>
              <i className="ti ti-book-2" /> Explore
            </button>
            <button className="btn act-check" onClick={() => openQuickCheck(n.id)}>
              <i className="ti ti-help-hexagon" /> Am I Affected?
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
