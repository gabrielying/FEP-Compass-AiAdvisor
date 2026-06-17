'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (signInError) {
      setStatus('error');
      setError(signInError.message);
      return;
    }
    setStatus('sent');
  }

  return (
    <div className="page narrow" style={{ maxWidth: 420, margin: '4rem auto' }}>
      <header className="page-head">
        <h1>FEP Compass</h1>
        <p className="page-sub">Sign in with your work email to continue.</p>
      </header>

      {status === 'sent' ? (
        <p className="card-hint">Check {email} for a sign-in link.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="email"
              required
              placeholder="you@bank.com.my"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="btn-row">
            <button type="submit" disabled={status === 'sending'} className="btn primary">
              {status === 'sending' ? 'Sending…' : 'Send magic link'}
            </button>
          </div>
          {status === 'error' && <p className="card-hint">{error}</p>}
        </form>
      )}
    </div>
  );
}
