import { Link } from 'react-router-dom';
import type { SiteProject } from '../../data/site';

/** Light-ground project card used on /projects. */
export function ProjectCard({ p, headingLevel = 'h2' }: { p: SiteProject; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <Link to={`/projects/${p.slug}`} className={`rv-proj${p.concept ? ' concept' : ''}`}>
      {p.image ? (
        <img className="rv-proj__img" src={p.image} alt={`${p.client} interface`} loading="lazy" />
      ) : (
        <div className={`rv-proj__ph${p.ground === 'teal' ? ' teal' : ''}`}>
          <p>{p.client}</p>
          {p.concept && <span className="rv-badge">CONCEPT</span>}
        </div>
      )}
      <div className="rv-proj__b">
        <p className="cat">{p.category} · {p.concept ? 'Concept project' : p.client}</p>
        <H>{p.title}</H>
        <p>{p.summary}</p>
        {p.tech.length > 0 && <p className="rv-mono">{p.tech.join(' · ')}</p>}
      </div>
    </Link>
  );
}

/** Dark-ground featured card used on the home page: challenge / solution / results. */
export function FeaturedProjectCard({ p }: { p: SiteProject }) {
  return (
    <Link to={`/projects/${p.slug}`} className={`rv-feat${p.concept ? ' concept' : ''}`}>
      {p.image && p.featuredImage && <img src={p.image} alt={`${p.client} interface`} loading="lazy" />}
      <div className="rv-feat__b">
        {p.concept ? (
          <p className="cat">{p.category} <span>CONCEPT PROJECT</span></p>
        ) : (
          <p className="cat">{p.category} · {p.client}</p>
        )}
        <h3>{p.title}</h3>
        {p.featuredImage ? (
          <p>{p.featuredSummary ?? p.summary}</p>
        ) : (
          <>
            <p><strong>Challenge</strong> — {p.challenge}</p>
            <p><strong>{p.concept ? 'Approach' : 'Solution'}</strong> — {p.solution}</p>
          </>
        )}
        {!p.concept && <p className="res"><strong>Results</strong> — [VERIFIED RESULT]</p>}
        {p.tech.length > 0 && <p className="rv-mono">{p.tech.join(' · ')}</p>}
      </div>
    </Link>
  );
}
