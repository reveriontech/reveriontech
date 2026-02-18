import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import '../../styles/layout.css';

const navLinks = [
  { label: 'Home', to: '/' },
  {
    label: 'Our Work',
    children: [
      { label: 'Portfolio', to: '/portfolio' },
      { label: 'Solutions', to: '/solutions' },
    ],
  },
  { label: 'Services', to: '/#services' },
  {
    label: 'About Us',
    children: [
      { label: 'About Us', to: '/about' },
      { label: 'Partners', to: '/partners' },
    ],
  },
  { label: 'Contact Us', to: '/contact' },
];

type NavLink = (typeof navLinks)[number];
function isDropdown(link: NavLink): link is NavLink & { children: { label: string; to: string }[] } {
  return 'children' in link && Array.isArray((link as { children?: unknown }).children);
}

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleNavClick = (to: string) => {
    setMobileOpen(false);
    if (to.startsWith('/#') && location.pathname === '/') {
      const id = to.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          ReverionTech
          {/* <span className="header__logo-sub">ReverionTechnology</span> */}
        </Link>

        <nav className="header__nav">
          {navLinks.map((link) =>
            isDropdown(link) ? (
              <div
                key={link.label}
                className="header__dropdown"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className={`header__link header__link--trigger ${openDropdown === link.label || link.children.some((c) => location.pathname === c.to) ? 'header__link--active' : ''}`}
                  aria-expanded={openDropdown === link.label}
                  aria-haspopup="true"
                >
                  {link.label}
                </button>
                <div className={`header__dropdown-menu ${openDropdown === link.label ? 'header__dropdown-menu--open' : ''}`}>
                  {link.children.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`header__dropdown-item ${location.pathname === item.to ? 'header__link--active' : ''}`}
                      onClick={() => { handleNavClick(item.to); setOpenDropdown(null); }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`header__link ${location.pathname === link.to ? 'header__link--active' : ''}`}
                onClick={() => handleNavClick(link.to)}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" to="/dashboard">
                Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" to="/auth">
              <Icon name="user" size={16} />
            </Button>
          )}
          <button className="header__search-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
          <button className="header__search-btn" aria-label="Search">
            <Icon name="search" size={18} />
          </button>
          <button
            className="header__menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileOpen ? 'close' : 'dashboard'} size={22} />
          </button>
        </div>
      </div>

      <nav className={`header__mobile-nav ${mobileOpen ? 'header__mobile-nav--open' : ''}`}>
        {navLinks.map((link) =>
          isDropdown(link) ? (
            <div key={link.label} className="header__mobile-dropdown">
              <span className="header__link header__link--mobile-label">{link.label}</span>
              {link.children.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="header__link header__dropdown-item--mobile"
                  onClick={() => handleNavClick(item.to)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={link.to}
              to={link.to}
              className="header__link"
              onClick={() => handleNavClick(link.to)}
            >
              {link.label}
            </Link>
          )
        )}
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="header__link" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
            <button className="header__link" onClick={() => { logout(); setMobileOpen(false); }} style={{ textAlign: 'left' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="header__link" onClick={() => setMobileOpen(false)}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
