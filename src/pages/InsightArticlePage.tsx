import { Link, Navigate, useParams } from 'react-router-dom';
import { Page, Sec, Wrap, Cta } from '../components/site/parts';
import { Markdown } from '../components/site/Markdown';
import { formatDate, getInsight, insights } from '../lib/insights';

export function InsightArticlePage() {
  const { slug } = useParams();
  const a = getInsight(slug);
  if (!a) return <Navigate to="/insights" replace />;
  const more = insights.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <Page>
      <title>{`${a.metaTitle} | Reverion Tech`}</title>
      <meta name="description" content={a.metaDescription} />

      <section className="rv-sec dark" style={{ padding: '4rem 0 4.5rem' }}>
        <Wrap>
          <Link to="/insights" className="rv-link" style={{ display: 'inline-block', marginBottom: 40 }}>← All insights</Link>
          <p className="rv-eyebrow">{a.category}</p>
          <h1 className="rv-h1" style={{ fontSize: 'clamp(2.25rem, 4.6vw, 3.5rem)', lineHeight: 1.08, maxWidth: '24ch', marginBottom: 24 }}>{a.title}</h1>
          <p className="rv-lead" style={{ marginBottom: 28 }}>{a.excerpt}</p>
          <p style={{ fontSize: '.875rem', color: '#8fa5aa' }}>
            <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.readMinutes} min read · Reverion Tech
          </p>
        </Wrap>
      </section>

      <section className="rv-sec" style={{ padding: '4.5rem 0 5rem' }}>
        <Wrap>
          <article style={{ maxWidth: '46rem', margin: '0 auto' }}>
            <Markdown source={a.body} />
          </article>
        </Wrap>
      </section>

      <Sec tone="alt">
        <h2 className="rv-h2" style={{ fontSize: '1.75rem', marginBottom: 32 }}>More Insights</h2>
        <div className="rv-grid">
          {more.map((m) => (
            <Link key={m.slug} to={`/insights/${m.slug}`} className="rv-card rv-ph-card">
              <p className="rv-eyebrow" style={{ marginBottom: 0 }}>{m.category}</p>
              <h3 className="rv-h3" style={{ fontSize: '1.25rem', lineHeight: 1.35 }}>{m.title}</h3>
              <p className="small grow">{formatDate(m.date)} · {m.readMinutes} min read</p>
            </Link>
          ))}
        </div>
      </Sec>

      <Cta title="Let’s Build Something That Moves Your Business Forward." secondary={['Talk to Our Team', '/contact']} />
    </Page>
  );
}
