import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/redesign.css';

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Projects', to: '/projects' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
];

export function Header() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="rv">
      <header className="rv-hdr">
        <div className="rv-hdr__in">
          <Link to="/" className="rv-logo" aria-label="Reverion Tech home">
            <img src="/ReverionTech.png" alt="" width={36} height={36} />
            <span>REVERION TECH</span>
          </Link>
          <nav className="rv-nav" aria-label="Main">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="rv-hdr__act">
            {isAuthenticated && <Link to="/dashboard" className="rv-link">Dashboard</Link>}
            <Link to="/contact" className="rv-btn primary">Start a Project</Link>
            <button
              type="button"
              className="rv-menu-btn"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {open ? <><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>
        <nav className={`rv-mobile ${open ? 'open' : ''}`} aria-label="Mobile">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}>{l.label}</Link>
          ))}
          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/contact" className="rv-btn primary">Start a Project</Link>
        </nav>
      </header>
    </div>
  );
}
