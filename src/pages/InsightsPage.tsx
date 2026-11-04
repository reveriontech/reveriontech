import { useState } from 'react';
import { Page, Sec, Eyebrow, NetworkArt, Wrap } from '../components/site/parts';
import { insightTopics } from '../data/site';

export function InsightsPage() {
  const [topic, setTopic] = useState('All');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const cards = insightTopics.slice(1).filter((t) => topic === 'All' || t === topic);

  return (
    <Page>
      <section className="rv-sec" style={{ padding: '6rem 0 3rem' }}>
        <Wrap>
        <Eyebrow>INSIGHTS</Eyebrow>
        <h1 className="rv-h1" style={{ marginBottom: 24 }}>Perspectives on Technology and Engineering.</h1>
        <p className="rv-lead" style={{ marginBottom: '2.5rem', maxWidth: '42rem' }}>Practical guides for business leaders on AI adoption, automation, software and infrastructure.</p>
        <div className="rv-filter" role="group" aria-label="Topics">
          {['All', ...insightTopics].map((t) => (<button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>))}
        </div>
        </Wrap>
      </section>

      <section className="rv-sec" style={{ padding: '1rem 0 6rem' }}>
        <Wrap>
        {(topic === 'All' || topic === insightTopics[0]) && (
          <div className="rv-art">
            <div className="rv-art__v"><NetworkArt /></div>
            <div className="rv-art__t">
              <p className="rv-eyebrow on-dark" style={{ marginBottom: 0 }}>FEATURED · AI IN BUSINESS OPERATIONS</p>
              <h2>[FEATURED ARTICLE TITLE]</h2>
              <p>[ONE-SENTENCE SUMMARY OF THE ARTICLE]</p>
              <p className="small" style={{ color: '#8fa5aa' }}>[AUTHOR] · [DATE] · [READ TIME]</p>
            </div>
          </div>
        )}
        <div className="rv-grid">
          {cards.map((t) => (
            <article key={t} className="rv-card rv-ph-card">
              <p className="rv-eyebrow" style={{ marginBottom: 0 }}>{t}</p>
              <h3 className="rv-h3">[ARTICLE TITLE]</h3>
              <p className="small grow">[DATE] · [READ TIME]</p>
            </article>
          ))}
        </div>
        {topic !== 'All' && topic !== insightTopics[0] && cards.length === 0 && <p>No articles in this topic yet.</p>}
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
