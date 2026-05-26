import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

export default function TopBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="topbar no-print" role="banner">
      <div className="topbar-inner container">
        <div className="brand">
          <Link to="/inquiries" className="brand-link">IDBMI Inquiry</Link>
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
          <Link to="/inquiries" onClick={() => setOpen(false)}>All Student</Link>
          <Link to="/inquiries/new" onClick={() => setOpen(false)}>New Form</Link>
          <Link to="/courses" onClick={() => setOpen(false)}>Courses</Link>
          <button type="button" onClick={signOut} className="logout-button">Logout</button>
        </nav>
      </div>
    </header>
  );
}
