'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NOTICES, type Notice } from '@/lib/fep-data';
import { logActivity } from '@/lib/activity';
import { useNoticesUi } from '@/lib/notices-ui-context';
import { Accordion } from './Accordion';

function NoticeOverlayBody({
  notice,
  modalFocusRef,
  openQuickCheck,
  closeAll,
}: {
  notice: Notice;
  modalFocusRef?: string;
  openQuickCheck: (id: number) => void;
  closeAll: () => void;
}) {
  const router = useRouter();
  const hasFaqs = !!notice.faqs?.length;
  const [tab, setTab] = useState<'prov' | 'faq'>(
    hasFaqs && modalFocusRef && notice.faqs!.some((f) => f.ref === modalFocusRef) ? 'faq' : 'prov'
  );

  useEffect(() => {
    logActivity('notice', `Viewed Notice ${notice.short} — ${notice.title}`);
  }, [notice.id, notice.short, notice.title]);

  return (
    <div className="overlay open" id="notice-overlay" onClick={(e) => e.target === e.currentTarget && closeAll()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="modal-tag">
              NOTICE {notice.id} · {notice.secs.length} PROVISIONS{hasFaqs ? ` · ${notice.faqs!.length} FAQS` : ''}
            </div>
            <div className="modal-name">{notice.title}</div>
          </div>
          <button className="modal-close" onClick={closeAll}>
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          {hasFaqs ? (
            <>
              <div className="nm-tabs">
                <button type="button" className={`npill${tab === 'prov' ? ' on' : ''}`} onClick={() => setTab('prov')}>
                  Provisions ({notice.secs.length})
                </button>
                <button type="button" className={`npill${tab === 'faq' ? ' on' : ''}`} onClick={() => setTab('faq')}>
                  FAQs ({notice.faqs!.length})
                </button>
              </div>
              <div className={`nm-panel${tab !== 'prov' ? ' hidden' : ''}`}>
                <div className="sec-hdr">Tap any provision to expand · dotted terms have definitions</div>
                <Accordion list={notice.secs} focusRef={modalFocusRef} />
              </div>
              <div className={`nm-panel${tab !== 'faq' ? ' hidden' : ''}`}>
                <div className="sec-hdr">Frequently asked questions — tap to expand</div>
                <Accordion list={notice.faqs!} focusRef={modalFocusRef} />
              </div>
            </>
          ) : (
            <>
              <div className="sec-hdr">Tap any provision to expand · dotted terms have definitions</div>
              <Accordion list={notice.secs} focusRef={modalFocusRef} />
            </>
          )}
        </div>
        <div className="modal-foot">
          <button
            className="btn"
            onClick={() => {
              closeAll();
              openQuickCheck(notice.id);
            }}
          >
            <i className="ti ti-help-hexagon" /> Am I Affected?
          </button>
          <button
            className="btn primary"
            onClick={() => {
              closeAll();
              router.push(`/advisor?notice=${notice.id}`);
            }}
          >
            <i className="ti ti-message-dots" /> Ask Advisor
          </button>
        </div>
      </div>
    </div>
  );
}

export function NoticeOverlay() {
  const { modalNoticeId, modalFocusRef, openQuickCheck, closeAll } = useNoticesUi();
  const notice = modalNoticeId ? NOTICES[modalNoticeId] : null;

  if (!notice) return <div className="overlay" id="notice-overlay" />;

  return (
    <NoticeOverlayBody
      key={notice.id}
      notice={notice}
      modalFocusRef={modalFocusRef}
      openQuickCheck={openQuickCheck}
      closeAll={closeAll}
    />
  );
}
