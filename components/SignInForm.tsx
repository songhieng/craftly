'use client';

import { FormEvent, useState } from 'react';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email or Telegram handle.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    // Prototype: store session and redirect
    setTimeout(() => {
      localStorage.setItem(
        'ai-creative-cambodia-session',
        JSON.stringify({ email, signedInAt: new Date().toISOString(), role: 'client' }),
      );
      window.location.href = '/brief';
    }, 800);
  }

  function handleGuest() {
    localStorage.setItem(
      'ai-creative-cambodia-session',
      JSON.stringify({ email: 'guest', signedInAt: new Date().toISOString(), role: 'guest' }),
    );
    window.location.href = '/brief';
  }

  return (
    <main className="signin-page">
      <style>{css}</style>

      {/* ── Top strip ─────────────────────────────────── */}
      <div className="signin-strip">
        <a href="/" className="back">AI Creative Cambodia</a>
        <span>Client portal</span>
        <a href="/admin" className="admin-link">Studio board</a>
      </div>

      <div className="signin-body">
        {/* ── Left editorial column ─────────────────── */}
        <div className="signin-editorial">
          <div className="kicker">
            <span className="kicker-rule" />
            Client access
          </div>

          <h1>
            Sign in<em>.</em>
          </h1>

          <p className="editorial-lead">
            Access your creative briefs, track production progress, and communicate
            with the studio — all in one place.
          </p>

          <ul className="feature-list">
            <li>
              <span className="feat-icon">✦</span>
              Submit and manage creative briefs
            </li>
            <li>
              <span className="feat-icon">✦</span>
              Track job status across every platform
            </li>
            <li>
              <span className="feat-icon">✦</span>
              Approve or request revisions on AI drafts
            </li>
            <li>
              <span className="feat-icon">✦</span>
              Download final assets with Khmer overlays
            </li>
          </ul>

          <div className="editorial-note">
            <strong>New client?</strong> You don't need an account to submit your
            first brief — just{' '}
            <a href="/brief">start a brief directly</a> and the studio will follow up.
          </div>
        </div>

        {/* ── Right form card ───────────────────────── */}
        <div className="signin-card">
          <div className="card-kicker">Sign in to your account</div>
          <div className="card-sub">
            Use your email address or Telegram handle registered with the studio.
          </div>

          <form className="signin-form" onSubmit={handleSubmit} noValidate>
            <label>
              Email or Telegram
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com  or  @yourhandle"
                autoComplete="username"
                disabled={loading}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
            </label>

            {error && <div className="form-error" role="alert">{error}</div>}

            <div className="forgot-row">
              <a href="/brief" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? (
                <span className="btn-inner">
                  <span className="spinner" />
                  Signing in…
                </span>
              ) : (
                <span className="btn-inner">
                  Sign in
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button type="button" className="btn-guest" onClick={handleGuest} disabled={loading}>
            Continue as guest
          </button>

          <p className="card-footer-note">
            Guest access lets you submit a brief without an account. The studio will
            contact you via Telegram or email to confirm your order.
          </p>

          <div className="card-bottom">
            <span>Don&rsquo;t have an account?</span>
            <a href="/brief">Start a brief →</a>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   Styles — same design system as BriefForm
   ───────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Noto+Serif+Khmer:wght@400;500;700&display=swap');

:root {
  --cream: #F2EAD3;
  --paper: #FBF6E7;
  --ink:   #15201A;
  --forest:#1B3F2A;
  --signal:#DD4A14;
  --mute:  #6F6B5C;
  --line:  rgba(21,32,26,.2);
  --serif: 'Instrument Serif', serif;
  --news:  'Newsreader', serif;
  --sans:  'Geist', system-ui, sans-serif;
  --mono:  'Geist Mono', monospace;
}

*, *::before, *::after { box-sizing: border-box; }

body { margin: 0; background: var(--cream); color: var(--ink); }

.signin-page {
  min-height: 100vh;
  background: var(--cream);
  font-family: var(--sans);
  position: relative;
}

/* Grain overlay */
.signin-page::before {
  content: "";
  position: fixed; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.08 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: .45;
  mix-blend-mode: multiply;
}

/* ── Strip ────────────────────────────────── */
.signin-strip {
  position: relative; z-index: 1;
  border-bottom: 1px solid rgba(21,32,26,.5);
  padding: 9px 28px;
  display: flex; align-items: center; justify-content: space-between;
  font-family: var(--mono); font-size: 11px;
  letter-spacing: .08em; text-transform: uppercase;
}
.signin-strip a { color: inherit; text-decoration: none; }
.back { color: var(--forest) !important; }
.back:hover, .admin-link:hover { color: var(--signal) !important; }

/* ── Page body ────────────────────────────── */
.signin-body {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: 0;
  min-height: calc(100vh - 40px);
}

/* ── Editorial column ─────────────────────── */
.signin-editorial {
  padding: 72px 56px 72px 40px;
  border-right: 1px solid rgba(21,32,26,.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.kicker {
  font-family: var(--mono);
  font-size: 11px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--mute);
  display: flex; gap: 14px; align-items: center;
  margin-bottom: 28px;
}
.kicker-rule {
  width: 42px; height: 1px;
  background: rgba(21,32,26,.5);
}

h1 {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(72px, 9vw, 140px);
  line-height: .88;
  letter-spacing: -.035em;
  color: var(--forest);
  margin: 0 0 32px;
}
h1 em { color: var(--signal); font-style: italic; }

.editorial-lead {
  font-family: var(--news);
  font-weight: 300;
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.5;
  color: var(--ink);
  max-width: 480px;
  margin: 0 0 36px;
}

.feature-list {
  list-style: none;
  margin: 0 0 36px;
  padding: 0;
  display: grid;
  gap: 13px;
  border-top: 1px solid var(--line);
  padding-top: 28px;
}
.feature-list li {
  display: flex; align-items: baseline; gap: 12px;
  font-size: 14px; color: var(--ink); line-height: 1.4;
}
.feat-icon {
  color: var(--signal);
  font-size: 10px;
  flex-shrink: 0;
}

.editorial-note {
  font-family: var(--news);
  font-size: 14.5px; line-height: 1.5;
  color: var(--mute);
  border-left: 2px solid var(--signal);
  padding-left: 14px;
  max-width: 460px;
}
.editorial-note a { color: var(--forest); text-decoration: underline; }
.editorial-note a:hover { color: var(--signal); }

/* ── Form card ────────────────────────────── */
.signin-card {
  background: var(--paper);
  border-left: 1px solid rgba(21,32,26,.5);
  padding: 56px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
}

.card-kicker {
  font-family: var(--mono);
  font-size: 11px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--signal);
  margin-bottom: 8px;
}

.card-sub {
  font-family: var(--news);
  font-size: 15px; line-height: 1.45; color: var(--mute);
  margin-bottom: 32px;
}

.signin-form {
  display: grid;
  gap: 18px;
  margin-bottom: 6px;
}

.signin-form label {
  display: grid;
  gap: 7px;
  font-family: var(--mono); font-size: 10.5px;
  letter-spacing: .12em; text-transform: uppercase; color: var(--mute);
}

.signin-form input {
  width: 100%;
  border: 1px solid rgba(21,32,26,.28);
  border-radius: 8px;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--sans); font-size: 15px;
  letter-spacing: 0; text-transform: none;
  padding: 13px 14px;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.signin-form input:focus {
  border-color: var(--signal);
  box-shadow: 0 0 0 3px rgba(221,74,20,.12);
}
.signin-form input:disabled { opacity: .6; cursor: not-allowed; }

.form-error {
  background: rgba(221,74,20,.08);
  border: 1px solid rgba(221,74,20,.3);
  border-radius: 7px;
  padding: 10px 13px;
  font-size: 13px;
  color: var(--signal);
}

.forgot-row {
  display: flex; justify-content: flex-end;
  margin-top: -6px;
}
.forgot-link {
  font-family: var(--mono); font-size: 10px;
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--mute); text-decoration: none;
}
.forgot-link:hover { color: var(--signal); }

/* Sign in button */
.btn-signin {
  width: 100%;
  border: 0;
  border-radius: 999px;
  padding: 15px 20px;
  background: var(--signal);
  color: var(--paper);
  font-family: var(--sans); font-size: 15px; font-weight: 600;
  cursor: pointer;
  transition: background .18s, transform .1s;
  margin-top: 4px;
}
.btn-signin:hover:not(:disabled) { background: #B53A0E; }
.btn-signin:active:not(:disabled) { transform: scale(.98); }
.btn-signin:disabled { opacity: .65; cursor: not-allowed; }

.btn-inner {
  display: inline-flex; align-items: center;
  justify-content: center; gap: 10px;
}

/* Spinner */
.spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(251,246,231,.4);
  border-top-color: var(--paper);
  border-radius: 50%;
  animation: spin .7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Divider */
.divider {
  display: flex; align-items: center; gap: 14px;
  margin: 22px 0 18px;
  font-family: var(--mono); font-size: 10px;
  letter-spacing: .1em; text-transform: uppercase; color: var(--mute);
}
.divider::before, .divider::after {
  content: ""; flex: 1;
  height: 1px; background: rgba(21,32,26,.2);
}

/* Guest button */
.btn-guest {
  width: 100%;
  border: 1px solid rgba(21,32,26,.4);
  border-radius: 999px;
  padding: 13px 20px;
  background: transparent;
  color: var(--ink);
  font-family: var(--sans); font-size: 14.5px; font-weight: 500;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}
.btn-guest:hover:not(:disabled) {
  background: rgba(21,32,26,.05);
  border-color: rgba(21,32,26,.6);
}
.btn-guest:disabled { opacity: .6; cursor: not-allowed; }

.card-footer-note {
  font-size: 12.5px; line-height: 1.5; color: var(--mute);
  margin: 14px 0 0; text-align: center;
}

.card-bottom {
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  font-size: 13.5px; color: var(--mute);
}
.card-bottom a {
  color: var(--forest); font-weight: 500; text-decoration: none;
}
.card-bottom a:hover { color: var(--signal); }

/* ── Responsive ───────────────────────────── */
@media (max-width: 900px) {
  .signin-body { grid-template-columns: 1fr; }
  .signin-editorial {
    padding: 48px 28px 40px;
    border-right: none;
    border-bottom: 1px solid rgba(21,32,26,.5);
    justify-content: flex-start;
  }
  .signin-card { padding: 40px 28px 56px; border-left: none; }
  h1 { font-size: clamp(64px, 14vw, 120px); margin-bottom: 24px; }
}

@media (max-width: 600px) {
  .signin-strip { padding: 9px 16px; font-size: 10px; flex-wrap: wrap; gap: 4px; }
  .signin-editorial { padding: 36px 16px 32px; }
  .signin-card { padding: 32px 16px 48px; }
  h1 { font-size: clamp(60px, 17vw, 100px); }
  .card-kicker { font-size: 10px; }
  .signin-form input { font-size: 16px; } /* prevent iOS zoom */
}
`;
