import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage({ session }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || 'Unable to update password. Please request a new reset link.');
        return;
      }

      setNotice('Password updated successfully. Redirecting...');
      window.setTimeout(() => navigate('/inquiries', { replace: true }), 900);
    } finally {
      setLoading(false);
    }
  };

  if (session === undefined) {
    return <div className="page-status">Loading...</div>;
  }

  return (
    <main className="login-page">
      <div className="reset-card card">
        <div className="login-brand reset-brand">
          <div className="login-brand-mark">I</div>
          <div>
            <p className="login-kicker">Account recovery</p>
            <h2>Set new password</h2>
          </div>
        </div>

        {!session ? (
          <div className="auth-form">
            <div className="page-error">
              This reset link is invalid or expired. Please request a new password reset email.
            </div>
            <Link className="btn reset-link" to="/login">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="page-error">{error}</div>}
            {notice && <div className="notice">{notice}</div>}

            <div className="input-group">
              <label htmlFor="password">New password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
