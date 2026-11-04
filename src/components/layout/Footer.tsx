import { Link } from 'react-router-dom';
import { services } from '../../data/site';
import '../../styles/redesign.css';

export function Footer() {
  return (
    <div className="rv">
      <footer className="rv-ftr">
        <div className="rv-wrap">
          <div className="rv-ftr__top">
            <div>
              <Link to="/" className="rv-logo" aria-label="Reverion Tech home">
                <img src="/ReverionTech.png" alt="" width={36} height={36} />
                <span>REVERION TECH</span>
              </Link>
              <p style={{ marginTop: 16, fontWeight: 700, color: 'var(--navy)' }}>Engineering What’s Next.</p>
              <p style={{ fontSize: '.875rem' }}>AI-powered. Human-led.</p>
            </div>
            <div className="rv-ftr__cols">
              <div>
                <h4>Services</h4>
                {services.map((s) => (
                  <Link key={s.slug} to={`/services#${s.slug}`}>{s.title}</Link>
                ))}
              </div>
              <div>
                <h4>Company</h4>
                <Link to="/about">About</Link>
                <Link to="/solutions">Solutions</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/insights">Insights</Link>
                <Link to="/partners">Partners</Link>
                <Link to="/our-team">Our Team</Link>
                <Link to="/contact">Contact</Link>
              </div>
              <div>
                <h4>Offices</h4>
                <p><strong>Main Office</strong><br />212 N. 2nd St. Ste 100<br />Richmond, KY 40475, USA</p>
                <p><strong>Philippines</strong><br />Davao City 8000</p>
                <a href="mailto:hello@reveriontech.com">hello@reveriontech.com</a>
              </div>
            </div>
          </div>
          <div className="rv-ftr__bot">
            <p>© 2026 Reverion Tech. All rights reserved.</p>
            <div>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/auth">Client Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
