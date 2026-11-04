import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Page, Eyebrow, Wrap, Cta } from '../components/site/parts';
import { services } from '../data/site';

const pillars = [
  ['Build', 'We design and engineer digital products and technology platforms.'],
  ['Automate', 'We harness AI, automation and orchestration to streamline business operations.'],
  ['Secure & Scale', 'We build reliable infrastructure and secure technology environments.'],
];

export function ServicesPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [hash]);

  return (
    <Page>
      <section className="rv-sec dark">
        <Wrap>
          <Eyebrow>SERVICES</Eyebrow>
          <h1 className="rv-h1" style={{ color: '#fff', marginBottom: 24 }}>Intelligent Technology. Engineered for Business.</h1>
          <p className="rv-lead">Three connected capabilities, delivered by one engineering team. We start with the business outcome, then choose the technology.</p>
          <div className="rv-pillars">
            {pillars.map(([t, d]) => (<div key={t}><h2>{t}</h2><p>{d}</p></div>))}
          </div>
        </Wrap>
      </section>

      {services.map((s, i) => {
        const dark = i === 1;
        return (
          <section key={s.slug} id={s.slug} className={`rv-sec ${dark ? 'dark deep' : i % 2 ? 'alt' : ''}`} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <Wrap>
              <div className="rv-service" style={{ borderTop: i === 0 ? 0 : undefined }}>
                <div className="rv-service__a rv-stack">
                  <p className="rv-mono" style={{ color: dark ? 'var(--cyan)' : 'var(--teal2)' }}>{String(i + 1).padStart(2, '0')} · /services/{s.slug}</p>
                  <h2 className="rv-h2">{s.title}</h2>
                  <p className="rv-lead" style={{ fontSize: '1.0625rem' }}>{s.lead}</p>
                  <Link to="/contact" className="rv-link">{s.cta} →</Link>
                </div>
                <div className="rv-service__b">
                  <div className={dark ? 'dark' : ''}><p className="rv-label">Problems we solve</p><ul className="rv-list">{s.problems.map((p) => <li key={p}>{p}</li>)}</ul></div>
                  <div className={dark ? 'dark' : ''}><p className="rv-label">What we deliver</p><ul className="rv-list">{s.delivers.map((p) => <li key={p}>{p}</li>)}</ul></div>
                </div>
              </div>
            </Wrap>
          </section>
        );
      })}

      <Cta title="Build Better. Work Smarter. Scale Further." secondary={['See Solutions', '/solutions']} />
    </Page>
  );
}
