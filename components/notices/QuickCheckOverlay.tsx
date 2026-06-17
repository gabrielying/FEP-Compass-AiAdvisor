'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NOTICES, QUICKCHECK, type QuickCheckOutcome, type QuickCheckTree, type Notice } from '@/lib/fep-data';
import { logActivity } from '@/lib/activity';
import { useNoticesUi } from '@/lib/notices-ui-context';

const ICONS: Record<QuickCheckOutcome['type'], string> = {
  ok: 'ti-circle-check',
  warn: 'ti-alert-triangle',
  info: 'ti-info-circle',
};

function QuickCheckOverlayBody({ notice, qc, closeAll }: { notice: Notice; qc: QuickCheckTree; closeAll: () => void }) {
  const router = useRouter();
  const [nodeKey, setNodeKey] = useState(qc.start);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<QuickCheckOutcome | null>(null);

  function answer(key: 'yes' | 'no') {
    const node = qc.nodes[nodeKey];
    const next = node[key];
    if (typeof next === 'string') {
      setStep((s) => s + 1);
      setNodeKey(next);
    } else {
      setResult(next);
      logActivity('check', `"Am I Affected?" (Notice ${notice.short}) → ${next.t}`);
    }
  }

  function restart() {
    setStep(1);
    setNodeKey(qc.start);
    setResult(null);
  }

  return (
    <div className="overlay open" id="qc-overlay" onClick={(e) => e.target === e.currentTarget && closeAll()}>
      <div className="modal modal-sm" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="modal-tag">AM I AFFECTED?</div>
            <div className="modal-name">
              Notice {notice.id} — {notice.title}
            </div>
          </div>
          <button className="modal-close" onClick={closeAll}>
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          {result ? (
            <>
              <div className={`qc-result ${result.type}`}>
                <strong>
                  <i className={`ti ${ICONS[result.type]}`} style={{ verticalAlign: '-2px' }} /> {result.t}
                </strong>
                {result.d}
              </div>
              <div className="qc-restart qc-opts">
                <button className="btn" onClick={restart}>
                  <i className="ti ti-rotate" /> Start over
                </button>
                <button
                  className="btn primary"
                  onClick={() => {
                    closeAll();
                    router.push(`/advisor?notice=${notice.id}`);
                  }}
                >
                  <i className="ti ti-message-dots" /> Ask the Advisor
                </button>
              </div>
            </>
          ) : (
            nodeKey && (
              <>
                <div className="qc-step">QUESTION {step}</div>
                <div className="qc-q">{qc.nodes[nodeKey].q}</div>
                <div className="qc-opts">
                  <button className="btn primary" onClick={() => answer('yes')}>
                    Yes
                  </button>
                  <button className="btn" onClick={() => answer('no')}>
                    No
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export function QuickCheckOverlay() {
  const { quickCheckNoticeId, closeAll } = useNoticesUi();
  const notice = quickCheckNoticeId ? NOTICES[quickCheckNoticeId] : null;
  const qc = quickCheckNoticeId ? QUICKCHECK[quickCheckNoticeId] : null;

  if (!notice || !qc) return <div className="overlay" id="qc-overlay" />;

  return <QuickCheckOverlayBody key={quickCheckNoticeId} notice={notice} qc={qc} closeAll={closeAll} />;
}
