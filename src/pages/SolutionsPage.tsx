import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Page, Eyebrow, Wrap, Cta } from '../components/site/parts';
import { solutionPages } from '../data/site';

// Card grounds follow the design: navy, light, white, deep teal, light.
const grounds = ['navy', 'alt', 'outline', 'deep', 'alt'] as const;

export function SolutionsPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [hash]);

  return (
    <Page>
      <section className="rv-sec" style={{ padding: '6rem 0 4rem' }}>
        <Wrap>
          <Eyebrow>SOLUTIONS</Eyebrow>
          <h1 className="rv-h1" style={{ marginBottom: 24, maxWidth: '18ch', fontSize: 'clamp(2.5rem, 6vw, 4.25rem)' }}>Built Around Real Business Needs.</h1>
          <p className="rv-lead" style={{ marginBottom: '2.5rem', maxWidth: '42rem' }}>Start with the problem you need solved. Each solution combines the right engineering, automation and infrastructure — no more, no less.</p>
          <nav className="rv-filter pills" aria-label="Solutions">
            {solutionPages.map((s) => (<a key={s.id} href={`#${s.id}`}>{s.title}</a>))}
          </nav>
        </Wrap>
      </section>

      <section className="rv-sec" style={{ padding: '0 0 6rem' }}>
        <Wrap>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {solutionPages.map((s, i) => {
              const g = grounds[i % grounds.length];
              const dark = g === 'navy' || g === 'deep';
              return (
                <article key={s.id} id={s.id} className={`rv-sol ${g}`}>
                  <div className="rv-sol__a">
                    <p className="rv-mono">{s.n}</p>
                    <h2>{s.title}</h2>
                    <p>{s.lead}</p>
                    <Link to="/contact" className={`rv-btn ${dark ? 'cyan' : 'primary'}`}>{s.cta}</Link>
                  </div>
                  <div className="rv-sol__b">
                    <div><p className="l">The problem</p><p>{s.problem}</p></div>
                    <div><p className="l">What we build</p><ul>{s.build.map((b) => <li key={b}>{b}</li>)}</ul></div>
                    <div><p className="l">The benefit</p><p>{s.benefit}</p><p className="tags">{s.tags}</p></div>
                  </div>
                </article>
              );
            })}
          </div>
        </Wrap>
      </section>

      <Cta
        title="Don’t See Your Challenge?"
        text="Describe it. We’ll tell you honestly whether technology can help."
        primary={['Talk to Our Team', '/contact']}
      />
    </Page>
  );
}
