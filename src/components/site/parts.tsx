import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import '../../styles/redesign.css';

export function Page({ children }: { children: ReactNode }) {
  return <div className="rv">{children}</div>;
}

export function Wrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rv-wrap ${className}`}>{children}</div>;
}

export function Sec({ tone = '', id, children, label }: { tone?: '' | 'alt' | 'dark' | 'deep' | 'teal'; id?: string; children: ReactNode; label?: string }) {
  return (
    <section id={id} aria-label={label} className={`rv-sec ${tone === 'deep' ? 'dark deep' : tone}`}>
      <div className="rv-wrap">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="rv-eyebrow">{children}</p>;
}

export function Arrow() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function Cta({ title, primary = ['Start a Project', '/contact'], secondary, text }: { title: string; primary?: [string, string]; secondary?: [string, string]; text?: string }) {
  return (
    <Sec tone="teal">
      <div className="rv-head" style={{ marginBottom: 0, alignItems: 'center' }}>
        <div style={{ maxWidth: '40rem' }}>
          <h2 className="rv-h2" style={{ maxWidth: '22ch' }}>{title}</h2>
          {text && <p style={{ marginTop: 16, fontSize: '1.125rem' }}>{text}</p>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link to={primary[1]} className="rv-btn cyan">{primary[0]}</Link>
          {secondary && <Link to={secondary[1]} className="rv-btn ghost-dark">{secondary[0]}</Link>}
        </div>
      </div>
    </Sec>
  );
}

export function NetworkArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 300" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <g stroke="#00DDEB" strokeOpacity="0.5">
        <line x1="60" y1="80" x2="200" y2="150" /><line x1="200" y1="150" x2="340" y2="70" />
        <line x1="200" y1="150" x2="300" y2="240" /><line x1="200" y1="150" x2="90" y2="230" />
      </g>
      <g fill="#061C25" stroke="#00DDEB" strokeWidth="1.5">
        <circle cx="60" cy="80" r="6" /><circle cx="340" cy="70" r="6" /><circle cx="300" cy="240" r="6" />
        <circle cx="90" cy="230" r="6" /><circle cx="200" cy="150" r="12" />
      </g>
    </svg>
  );
}
