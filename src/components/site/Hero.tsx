import { Link } from 'react-router-dom';
import type { CSSProperties, PointerEvent } from 'react';
import { Wrap, Arrow } from './parts';
import { marquee } from '../../data/site';

// Six capability nodes around the core, at 60° steps on a 200px ring (viewBox 600×600, centre 300,300).
const nodes = [
  { label: 'Apps', x: 300, y: 100, lx: 300, ly: 58, a: 'middle' },
  { label: 'AI', x: 473.2, y: 200, lx: 508, ly: 186, a: 'start' },
  { label: 'Data', x: 473.2, y: 400, lx: 508, ly: 422, a: 'start' },
  { label: 'Cloud', x: 300, y: 500, lx: 300, ly: 550, a: 'middle' },
  { label: 'Security', x: 126.8, y: 400, lx: 92, ly: 422, a: 'end' },
  { label: 'Automation', x: 126.8, y: 200, lx: 92, ly: 186, a: 'end' },
] as const;

function EngineArt() {
  const hex = nodes.map((n) => `${n.x},${n.y}`).join(' ');
  return (
    <svg className="rv-eng" viewBox="0 0 600 600" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="rv-core-glow">
          <stop offset="0" stopColor="#00DDEB" stopOpacity=".35" />
          <stop offset="1" stopColor="#00DDEB" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="290" stroke="#00DDEB" strokeOpacity=".08" />
      <g className="spin rev">
        <circle cx="300" cy="300" r="250" stroke="#00DDEB" strokeOpacity=".18" strokeDasharray="1 10" strokeLinecap="round" />
        <circle cx="300" cy="50" r="3" fill="#00DDEB" />
        <circle cx="550" cy="300" r="2" fill="#00DDEB" fillOpacity=".6" />
      </g>
      <polygon points={hex} stroke="#00DDEB" strokeOpacity=".22" strokeDasharray="4 8" />
      <g className="spin">
        <circle cx="300" cy="300" r="128" stroke="#00DDEB" strokeOpacity=".3" strokeDasharray="2 9" />
        <circle cx="428" cy="300" r="3.5" fill="#00DDEB" />
      </g>
      <g stroke="#00DDEB" strokeOpacity=".35">
        {nodes.map((n) => <line key={n.label} x1="300" y1="300" x2={n.x} y2={n.y} />)}
      </g>
      <g stroke="#00DDEB" strokeWidth="2.5" strokeLinecap="round">
        {nodes.map((n, i) => (
          <line key={n.label} className="sig" style={{ '--s': `${i * 0.55}s` } as CSSProperties} x1="300" y1="300" x2={n.x} y2={n.y} />
        ))}
      </g>
      <circle cx="300" cy="300" r="150" fill="url(#rv-core-glow)" />
      {nodes.map((n, i) => (
        <g key={n.label}>
          <circle className="node" style={{ '--s': `${i * 0.5}s` } as CSSProperties} cx={n.x} cy={n.y} r="11" fill="#061C25" stroke="#00DDEB" strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="3.5" fill="#00DDEB" />
          <text x={n.lx} y={n.ly} textAnchor={n.a} fontFamily="Manrope, sans-serif" fontSize="13" fontWeight="700" letterSpacing="2.4" fill="#8fa5aa">{n.label.toUpperCase()}</text>
        </g>
      ))}
      <g className="core">
        <circle cx="300" cy="300" r="58" fill="#032E32" stroke="#00DDEB" strokeWidth="2" />
        <text x="300" y="316" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="46" fill="#00DDEB">R</text>
      </g>
    </svg>
  );
}

const how = [
  { n: '01', title: 'Build', what: 'Software Engineering', text: 'Web, mobile and enterprise products engineered around how your business operates.', to: '/services#software-engineering' },
  { n: '02', title: 'Automate', what: 'AI & Intelligent Automation', text: 'AI agents, voice assistants and orchestrated workflows — with people in the loop.', to: '/services#ai-automation' },
  { n: '03', title: 'Secure & Scale', what: 'Cloud, DevOps & Security', text: 'Reliable infrastructure, automated releases and security by design.', to: '/services#cloud-devops' },
];

const words = ['Engineering', 'what’s', 'next.'];

/** Track the pointer as CSS custom properties (no React state, so no re-renders). */
function trackPointer(e: PointerEvent<HTMLElement>, x: string, y: string) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty(x, `${e.clientX - r.left}px`);
  el.style.setProperty(y, `${e.clientY - r.top}px`);
}

export function Hero() {
  return (
    <section className="rv-hero" aria-labelledby="hero-title" onPointerMove={(e) => trackPointer(e, '--mx', '--my')}>
      <div className="rv-hero__grid" aria-hidden="true" />
      <div className="rv-hero__spot" aria-hidden="true" />
      <div className="rv-hero__scan" aria-hidden="true" />
      <div className="rv-hero__art"><EngineArt /></div>

      <Wrap className="rv-hero__in">
        <p className="rv-hero__eyebrow rv-rise"><span className="rv-dot" />AI-powered technology engineering</p>
        <h1 id="hero-title">
          {words.map((w, i) => (
            <span key={w}>
              <span className="w"><span className={i === words.length - 1 ? 'next' : undefined} style={{ '--i': i } as CSSProperties}>{w}</span></span>
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </h1>
        <div className="rv-hero__row">
          <p className="rv-hero__sub rv-rise" style={{ '--d': '.45s' } as CSSProperties}>
            <strong>Intelligent technology. Engineered for business.</strong>
            We design intelligent software, automate complex operations, and build secure digital systems that help businesses move forward.
          </p>
          <div className="rv-hero__cta rv-rise" style={{ '--d': '.55s' } as CSSProperties}>
            <Link to="/contact" className="rv-btn cyan">Start a Project <Arrow /></Link>
            <Link to="/services" className="rv-btn ghost-dark">Explore Our Services</Link>
            <p className="rv-hero__motto">AI-powered. Human-led.</p>
          </div>
        </div>
      </Wrap>

      <Wrap className="rv-how">
        <p className="rv-how__label rv-rise" style={{ '--d': '.7s' } as CSSProperties}>This is how</p>
        <div className="rv-how__grid">
          {how.map((c, i) => (
            <Link
              key={c.n}
              to={c.to}
              className="rv-how__card rv-rise"
              style={{ '--d': `${0.8 + i * 0.1}s` } as CSSProperties}
              onPointerMove={(e) => trackPointer(e, '--cx', '--cy')}
            >
              <span className="top"><span className="rv-mono">{c.n}</span><span className="go"><Arrow /></span></span>
              <h2>{c.title}</h2>
              <span className="what">{c.what}</span>
              <p className="d">{c.text}</p>
            </Link>
          ))}
        </div>
      </Wrap>

      <div className="rv-marquee-wrap" aria-label="Capabilities">
        <div className="rv-marquee">
          {[0, 1].map((k) => marquee.map((m) => (
            <span key={`${k}-${m}`} aria-hidden={k === 1 || undefined} style={{ display: 'flex', gap: 32 }}>{m}<span className="d">◆</span></span>
          )))}
        </div>
      </div>
    </section>
  );
}
