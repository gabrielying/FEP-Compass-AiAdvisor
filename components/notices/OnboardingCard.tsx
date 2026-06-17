'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNoticesUi } from '@/lib/notices-ui-context';

const ONBOARDING_KEY = 'fep_onboarded';

export function OnboardingCard() {
  const [visible, setVisible] = useState(false);
  const { openNotice, openQuickCheck } = useNoticesUi();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing visibility with localStorage, unavailable during SSR/render
    if (!localStorage.getItem(ONBOARDING_KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setVisible(false);
  }

  function step(name: 'explore' | 'check' | 'settings') {
    if (name === 'explore') openNotice(1);
    else if (name === 'check') openQuickCheck(1);
    else router.push('/settings');
    dismiss();
  }

  if (!visible) return null;

  return (
    <section className="card onboarding-card" id="onboarding-card">
      <div className="card-head">
        <h2>
          <i className="ti ti-sparkles" /> New here? Start with these
        </h2>
        <button className="modal-close" onClick={dismiss} title="Dismiss">
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="onboarding-steps">
        <button className="onboarding-step" onClick={() => step('explore')}>
          <i className="ti ti-book-2" />
          <div>
            <strong>Explore a Notice</strong>
            <span>Tap &ldquo;Explore&rdquo; on any FEP Notice card below to see its provisions in plain language.</span>
          </div>
        </button>
        <button className="onboarding-step" onClick={() => step('check')}>
          <i className="ti ti-help-hexagon" />
          <div>
            <strong>Try &ldquo;Am I Affected?&rdquo;</strong>
            <span>Answer 2–3 quick questions for an instant compliance read on a transaction.</span>
          </div>
        </button>
        <button className="onboarding-step" onClick={() => step('settings')}>
          <i className="ti ti-key" />
          <div>
            <strong>Connect an AI provider</strong>
            <span>
              Add a free Gemini key (or use local Ollama) in Settings to unlock the AI Advisor and Compliance Analyst. Note:
              Gemini&apos;s free tier has a limited number of requests per day — if you hit that limit, the app falls back to
              reference-only results, or switch to local Ollama for unlimited offline use.
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
