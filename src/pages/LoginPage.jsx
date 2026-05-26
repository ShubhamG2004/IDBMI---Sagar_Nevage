import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'reset'
  const [notice, setNotice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message || 'Unable to sign in. Please check your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) {
        setError(resetError.message || 'Unable to send reset email. Please contact support.');
        return;
      }

      setNotice('If an account exists for that email, a password reset link was sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-hero" aria-hidden="true">
          <div className="login-hero-badge">IDEMI</div>
          <h1>Inquiry Management Portal</h1>
          <p>Access the student inquiry records, course catalog, and print-ready forms from one place.</p>
          <div className="login-hero-stats">
            <div><strong>Secure</strong><span>Supabase Auth</span></div>
            <div><strong>Fast</strong><span>Form workflow</span></div>
            <div><strong>Simple</strong><span>Reset support</span></div>
          </div>
        </section>

        <div className="login-container card">
          <div className="login-form">
            <div className="login-brand">
              <div className="login-brand-mark">I</div>
              <div>
                <p className="login-kicker">Welcome back</p>
                <h2>{mode === 'login' ? 'Sign in' : 'Reset password'}</h2>
              </div>
            </div>

            {error && <div className="page-error">{error}</div>}
            {notice && <div className="notice">{notice}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                  <label htmlFor="email">Email address</label>
                  <input type="email" id="email" name="email" placeholder="you@example.com" required />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" placeholder="Enter your password" required />
                </div>
                <div className="auth-actions">
                  <button type="submit" className="btn" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
                  <button type="button" className="link-button" onClick={() => { setMode('reset'); setError(''); setNotice(''); }}>Forgot password?</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleReset} className="auth-form">
                <div className="input-group">
                  <label htmlFor="email">Email address</label>
                  <input type="email" id="email" name="email" placeholder="you@example.com" required />
                </div>
                <div className="auth-actions">
                  <button type="submit" className="btn" disabled={loading}>{loading ? 'Sending...' : 'Send reset email'}</button>
                  <button type="button" className="link-button" onClick={() => { setMode('login'); setError(''); setNotice(''); }}>Back to login</button>
                </div>
              </form>
            )}

            <p className="login-footnote">Use the email address registered in Supabase Auth.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
