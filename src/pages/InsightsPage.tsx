import { useState } from 'react';
import { Page, Sec, Eyebrow, NetworkArt, Wrap } from '../components/site/parts';
import { Link } from 'react-router-dom';
import { insights, formatDate } from '../lib/insights';

// The earliest article leads the page; topics come from the articles that exist.
const [featured, ...rest] = insights;
const topics = [...new Set(insights.map((a) => a.category))];

export function InsightsPage() {
  const [topic, setTopic] = useState('All');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const showFeatured = featured && (topic === 'All' || topic === featured.category);
  const cards = rest.filter((a) => topic === 'All' || a.category === topic);

  return (
    <Page>
      <section className="rv-sec" style={{ padding: '6rem 0 3rem' }}>
        <Wrap>
        <Eyebrow>INSIGHTS</Eyebrow>
        <h1 className="rv-h1" style={{ marginBottom: 24 }}>Perspectives on Technology and Engineering.</h1>
        <p className="rv-lead" style={{ marginBottom: '2.5rem', maxWidth: '42rem' }}>Practical guides for business leaders on AI adoption, automation, software and infrastructure.</p>
        <div className="rv-filter" role="group" aria-label="Topics">
          {['All', ...topics].map((t) => (<button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>))}
        </div>
        </Wrap>
      </section>

      <section className="rv-sec" style={{ padding: '1rem 0 6rem' }}>
        <Wrap>
        {showFeatured && (
          <Link to={`/insights/${featured.slug}`} className="rv-art">
            <div className="rv-art__v"><NetworkArt /></div>
            <div className="rv-art__t">
              <p className="rv-eyebrow on-dark" style={{ marginBottom: 0 }}>Featured · {featured.category}</p>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <p className="small" style={{ color: '#8fa5aa' }}>Reverion Tech · <time dateTime={featured.date}>{formatDate(featured.date)}</time> · {featured.readMinutes} min read</p>
            </div>
          </Link>
        )}
        {cards.length > 0 && (
          <div className="rv-grid">
            {cards.map((a) => (
              <Link key={a.slug} to={`/insights/${a.slug}`} className="rv-card rv-ph-card">
                <p className="rv-eyebrow" style={{ marginBottom: 0 }}>{a.category}</p>
                <h3 className="rv-h3" style={{ fontSize: '1.25rem', lineHeight: 1.35 }}>{a.title}</h3>
                <p className="small grow"><time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readMinutes} min read</p>
              </Link>
            ))}
          </div>
        )}
        </Wrap>
      </section>

      <Sec tone="alt">
        <div className="rv-head" style={{ marginBottom: 0, alignItems: 'center' }}>
          <div style={{ maxWidth: '36rem' }}>
            <h2 className="rv-h2" style={{ fontSize: '1.75rem' }}>Get New Insights by Email</h2>
            <p style={{ marginTop: 10 }}>Occasional, practical articles. No spam; unsubscribe anytime.</p>
          </div>
          {done ? (
            <p role="status" style={{ color: 'var(--navy)', fontWeight: 600 }}>Thanks — we’ll be in touch.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }} className="rv-form" style={{ gridTemplateColumns: '1fr auto', flex: '0 1 460px' }}>
              <label className="rv-sr" htmlFor="ins-email">Business email</label>
              <input id="ins-email" type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="rv-btn primary">Subscribe</button>
            </form>
          )}
        </div>
      </Sec>
    </Page>
  );
}
