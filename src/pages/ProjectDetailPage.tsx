import { Link, Navigate, useParams } from 'react-router-dom';
import { Page, Sec, Wrap, Cta, NetworkArt } from '../components/site/parts';
import { siteProjects } from '../data/site';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const p = siteProjects.find((x) => x.slug === slug);
  if (!p) return <Navigate to="/projects" replace />;
  // Two client projects plus one concept, as in the design.
  const others = siteProjects.filter((x) => x.slug !== p.slug);
  const more = [...others.filter((x) => !x.concept).slice(0, 2), ...others.filter((x) => x.concept).slice(0, 1)];

  return (
    <Page>
      <section className="rv-sec dark" style={{ paddingBottom: 0 }}>
        <Wrap>
          <Link to="/projects" className="rv-link" style={{ display: 'inline-block', marginBottom: 40 }}>← All projects</Link>
          <p className="rv-eyebrow">{p.category} · {p.concept ? 'Concept project' : 'Case study'}</p>
          <h1 className="rv-h1" style={{ color: '#fff', marginBottom: 20, maxWidth: '18ch' }}>{p.title}</h1>
          <p className="rv-lead" style={{ marginBottom: 40 }}>{p.lead ?? p.summary}</p>
          <dl className="rv-dl" style={{ marginBottom: 56 }}>
            <div><dt>Client</dt><dd>{p.concept ? 'Concept project' : p.client}</dd></div>
            <div><dt>Service</dt><dd>{p.category}</dd></div>
            {p.industry && <div><dt>Industry</dt><dd>{p.industry}</dd></div>}
            <div><dt>Year</dt><dd>[YEAR]</dd></div>
            {p.href && <div><dt>Live site</dt><dd><a href={p.href} target="_blank" rel="nofollow noopener noreferrer" style={{ color: 'var(--cyan)' }}>Visit ↗</a></dd></div>}
          </dl>
          {p.image ? (
            <img src={p.image} alt={`${p.client} interface`} style={{ width: '100%', aspectRatio: '16 / 7.5', objectFit: 'cover', objectPosition: 'top', borderRadius: '12px 12px 0 0', display: 'block' }} />
          ) : (
            <div style={{ position: 'relative', height: 300, borderRadius: '12px 12px 0 0', background: 'linear-gradient(135deg,#032E32,#061C25)', border: '1px solid #17414a', borderBottom: 0, overflow: 'hidden' }}>
              <NetworkArt />
            </div>
          )}
        </Wrap>
      </section>

      <Sec>
        <div className="rv-split">
          <div className="rv-stack" style={{ flex: '2 1 560px', display: 'flex', flexDirection: 'column', gap: 48 }}>
            <div><p className="rv-eyebrow">The challenge</p><p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--navy)' }}>{p.challenge}</p></div>
            <div><p className="rv-eyebrow">The solution</p><p style={{ fontSize: '1.0625rem', lineHeight: 1.7 }}>{p.solution}</p></div>
            <div><p className="rv-eyebrow">Technical implementation</p><p style={{ fontSize: '1.0625rem', lineHeight: 1.7 }}>[ARCHITECTURE, INTEGRATIONS AND KEY ENGINEERING DECISIONS]</p></div>
          </div>
          <aside style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {p.tech.length > 0 && (
              <div className="rv-card" style={{ background: 'var(--alt)' }}>
                <p className="rv-label" style={{ color: 'var(--navy)' }}>Technologies</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{p.tech.map((t) => <span key={t} className="rv-chip">{t}</span>)}</div>
              </div>
            )}
            <div className="rv-card dk">
              <p className="rv-label" style={{ color: 'var(--cyan)' }}>Results</p>
              <p style={{ color: '#fff', fontWeight: 600 }}>[VERIFIED RESULT]</p>
              <p style={{ color: '#fff', fontWeight: 600 }}>[VERIFIED RESULT]</p>
              <p className="small" style={{ color: '#8fa5aa' }}>Results shown only where confirmed with the client.</p>
            </div>
          </aside>
        </div>
      </Sec>

      <Sec tone="alt">
        <h2 className="rv-h2" style={{ fontSize: '1.75rem', marginBottom: 32 }}>More Projects</h2>
        <div className="rv-grid">
          {more.map((m) => (
            <Link key={m.slug} to={`/projects/${m.slug}`} className="rv-card" style={{ padding: '1.5rem', gap: 8 }}>
              <p className="rv-label" style={{ marginBottom: 0, letterSpacing: '.12em' }}>{m.category}{m.concept ? ' · Concept' : ''}</p>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.35 }}>{m.concept ? m.title : `${m.client} — ${m.title.replace(/ System$/, '')}`}</h3>
            </Link>
          ))}
        </div>
      </Sec>

      <Cta title="Have a Similar Challenge?" />
    </Page>
  );
}
