import { useState } from 'react';
import { Page, Wrap, Eyebrow, Cta } from '../components/site/parts';
import { ProjectCard } from '../components/site/ProjectCard';
import { projectCategories, siteProjects } from '../data/site';

export function ProjectsPage() {
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? siteProjects : siteProjects.filter((p) => p.category === cat);
  return (
    <Page>
      <section className="rv-sec dark" style={{ padding: '6rem 0 4.5rem' }}>
        <Wrap>
          <Eyebrow>PROJECTS</Eyebrow>
          <h1 className="rv-h1" style={{ marginBottom: 24, fontSize: 'clamp(2.5rem, 6vw, 4.25rem)' }}>Engineering in Action.</h1>
          <p className="rv-lead" style={{ maxWidth: '42rem' }}>Selected client work, including private infrastructure and healthcare applications. Every case study shows the challenge, the solution, how it was built, and verified results.</p>
        </Wrap>
      </section>
      <section className="rv-sec" style={{ padding: '3.5rem 0 6rem' }}>
        <Wrap>
          <div className="rv-filter" role="group" aria-label="Filter projects" style={{ marginBottom: '2.5rem' }}>
            {['All', ...projectCategories].map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          {list.length ? (
            <div className="rv-proj-grid">{list.map((p) => <ProjectCard key={p.slug} p={p} />)}</div>
          ) : (
            <p>No projects in this category yet.</p>
          )}
        </Wrap>
      </section>
      <Cta title="Your Project Could Be Next." />
    </Page>
  );
}
