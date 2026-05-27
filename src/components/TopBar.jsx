import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

export default function TopBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    const shouldSignOut = window.confirm('Sign out now?');
    if (!shouldSignOut) return;

    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  return (
    <header className="topbar no-print" role="banner">
      <div className="topbar-inner container">
        <div className="brand">
          <Link to="/dashboard" className="brand-link">IDEMI Inquiry</Link>
        </div>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((s) => !s)}
        >
          ☰
        </button>

        <nav className={`topnav ${open ? 'open' : ''}`} role="navigation">
          <div className="topnav-links">
            <Link to="/dashboard" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/inquiries" onClick={() => setOpen(false)}>All Student</Link>
            <Link to="/inquiries/new" onClick={() => setOpen(false)}>New Form</Link>
            <Link to="/courses" onClick={() => setOpen(false)}>Courses</Link>
          </div>
          <div className="topnav-divider" aria-hidden="true" />
          <button type="button" onClick={signOut} className="logout-button">Sign out</button>
        </nav>
      </div>
    </header>
  );
}
