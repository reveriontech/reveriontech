import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page, Sec, Eyebrow, Arrow, Cta } from '../components/site/parts';
import { FeaturedProjectCard } from '../components/site/ProjectCard';
import { Hero } from '../components/site/Hero';
import {
  homeCapabilities, homeSolutions, industries, process, stack, workflow, pillars, faqs,
  projectCategories, siteProjects, insightTopics,
} from '../data/site';

export function LandingPage() {
  const [cat, setCat] = useState('All');
  const featured = ['prime-grand', 'talinoed', 'waste2earn'].map((s) => siteProjects.find((p) => p.slug === s)!);
  const shown = cat === 'All' ? featured : siteProjects.filter((p) => p.category === cat).slice(0, 3);

  return (
    <Page>
      <Hero />

      {/* Intro */}
      <Sec id="about">
        <div className="rv-split">
          <div><Eyebrow>WHO WE ARE</Eyebrow><h2 className="rv-h2">Technology Should Move Your Business Forward.</h2></div>
          <div className="rv-stack">
            <p className="rv-lead">Every business has processes that can be improved, systems that can work better, and opportunities that technology can unlock.</p>
            <p>At Reverion Tech, we combine engineering expertise and intelligent automation to turn these opportunities into practical solutions.</p>
            <p>From custom software to AI-powered workflows and secure cloud infrastructure, we build technology around the way businesses actually operate.</p>
            <Link to="/about" className="rv-link">About Reverion Tech →</Link>
          </div>
        </div>
      </Sec>

      {/* Capabilities */}
      <Sec tone="alt" id="services">
        <div className="rv-head">
          <div style={{ maxWidth: '40rem' }}>
            <Eyebrow>CORE CAPABILITIES</Eyebrow>
            <h2 className="rv-h2">Build Better. Work Smarter. Scale Further.</h2>
            <p style={{ marginTop: 16 }}>Five practices, one engineering team — from the first line of code to secure, monitored infrastructure.</p>
          </div>
          <Link to="/services" className="rv-link">Explore Our Capabilities →</Link>
        </div>
        <div className="rv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))' }}>
          {homeCapabilities.map((c) => (
            <article key={c.n} className="rv-card" style={{ padding: '2rem', gap: 14 }}>
              <p className="rv-mono idx">{c.n}</p>
              <h3 className="rv-h3">{c.title}</h3>
              <p>{c.text}</p>
              <p className="rv-tags" style={{ fontSize: '.875rem', lineHeight: 1.9, color: 'var(--navy)' }}>{c.items.join(' · ')}</p>
              <Link to="/services" className="rv-link grow">Learn more →</Link>
            </article>
          ))}
          <Link to="/contact" className="rv-card dk" style={{ justifyContent: 'center' }}>
            <h3 className="rv-h3" style={{ color: '#fff' }}>Not sure where to start?</h3>
            <p>Tell us the problem. We’ll recommend the right mix of engineering, automation and infrastructure.</p>
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Talk to Our Team →</span>
          </Link>
        </div>
      </Sec>

      {/* AI human-led */}
      <Sec tone="deep">
        <div className="rv-split">
          <div><Eyebrow>AI-POWERED. HUMAN-LED.</Eyebrow><h2 className="rv-h2">Automation Should Make Work Better, Not More Complicated.</h2></div>
          <div className="rv-stack">
            <p>Artificial intelligence can process information, coordinate workflows, and handle repetitive tasks at scale. But effective automation requires more than connecting tools and deploying AI models.</p>
            <p>We combine intelligent automation with human oversight, engineering discipline, and business understanding — so automated systems stay practical, accountable, and aligned with real business objectives.</p>
          </div>
        </div>
        <div className="rv-wf" role="img" aria-label="Workflow: business input, AI processing, orchestration, human review where needed, system execution, monitoring and improvement">
          {workflow.map(([k, v], i) => (
            <div key={v} style={{ display: 'contents' }}>
              <div className={`step ${v === 'Human Review' ? 'human' : ''}`}><p>{k}</p><p>{v}</p></div>
              {i < workflow.length - 1 && <div className="arrow"><Arrow /></div>}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '.875rem', color: '#8fa5aa' }}>Human checkpoints are added where risk, context or business rules call for judgment — not on every step.</p>
        <div className="rv-pillars">
          {pillars.map((p) => (
            <div key={p.title}><h3 className="rv-h3" style={{ marginBottom: 8 }}>{p.title}</h3><p>{p.text}</p></div>
          ))}
        </div>
        <div style={{ marginTop: '3rem' }}><Link to="/contact" className="rv-btn cyan">Discuss an AI Opportunity</Link></div>
      </Sec>

      {/* Solutions */}
      <Sec id="solutions">
        <div className="rv-head">
          <div><Eyebrow>SOLUTIONS</Eyebrow><h2 className="rv-h2">Built Around Real Business Needs.</h2><p style={{ marginTop: 16 }}>Start from the problem. We bring the engineering.</p></div>
          <Link to="/solutions" className="rv-link">All solutions →</Link>
        </div>
        <div className="rv-grid w240">
          {homeSolutions.map((s) => (
            <article key={s.title} className="rv-card">
              <h3 className="rv-h3" style={{ fontSize: '1.125rem' }}>{s.title}</h3>
              <p className="small"><strong style={{ color: 'var(--navy)' }}>Problem</strong> — {s.problem}</p>
              <p className="small"><strong style={{ color: 'var(--navy)' }}>Solution</strong> — {s.solution}</p>
              <p className="small"><strong style={{ color: 'var(--navy)' }}>Benefit</strong> — {s.benefit}</p>
              <p className="rv-tags grow">{s.tags}</p>
              <Link to="/solutions" className="rv-link">Explore →</Link>
            </article>
          ))}
        </div>
      </Sec>

      {/* Industries */}
      <Sec tone="alt">
        <div className="rv-split narrow-left">
          <div><Eyebrow>INDUSTRIES</Eyebrow><h2 className="rv-h2">Technology for Businesses Moving Forward.</h2></div>
          <div className="rv-ind">{industries.map((i) => <p key={i}>{i}</p>)}</div>
        </div>
      </Sec>

      {/* Process */}
      <Sec>
        <div style={{ marginBottom: '3rem' }}><Eyebrow>OUR ENGINEERING PROCESS</Eyebrow><h2 className="rv-h2">From Business Challenge to Working Solution.</h2></div>
        <ol className="rv-process">
          {process.map((s) => (
            <li key={s.n}><span className="rv-mono">{s.n}</span><h3 className="rv-h3" style={{ marginBottom: 6 }}>{s.title}</h3><p>{s.text}</p></li>
          ))}
        </ol>
      </Sec>

      {/* Featured work */}
      <Sec tone="dark" id="projects">
        <div className="rv-head">
          <div><Eyebrow>FEATURED WORK</Eyebrow><h2 className="rv-h2">Engineering in Action.</h2></div>
          <Link to="/projects" className="rv-link">All projects →</Link>
        </div>
        <div className="rv-filter" role="group" aria-label="Filter projects" style={{ marginBottom: '2.5rem' }}>
          {['All', ...projectCategories].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        {shown.length ? (
          <div className="rv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))' }}>{shown.map((p) => <FeaturedProjectCard key={p.slug} p={p} />)}</div>
        ) : (
          <p>No projects in this category yet. <Link to="/contact" className="rv-link">Start one with us →</Link></p>
        )}
      </Sec>

      {/* Stack */}
      <Sec>
        <div style={{ marginBottom: '3rem' }}><Eyebrow>TECHNOLOGY</Eyebrow><h2 className="rv-h2">Built with Modern Engineering Tools.</h2></div>
        <div className="rv-grid w240" style={{ gap: '32px 24px' }}>
          {stack.map((s) => (
            <div key={s.label} className="rv-stack-col"><p className="l">{s.label}</p><ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul></div>
          ))}
        </div>
      </Sec>

      {/* Insights teaser */}
      <Sec tone="alt" id="insights">
        <div className="rv-head">
          <div><Eyebrow>INSIGHTS</Eyebrow><h2 className="rv-h2">Perspectives on Technology and Engineering.</h2></div>
          <Link to="/insights" className="rv-link">All insights →</Link>
        </div>
        <div className="rv-grid">
          {[insightTopics[0], insightTopics[1], insightTopics[4]].map((t, i) => (
            <Link key={t} to="/insights" className="rv-card rv-ph-card">
              <p className="rv-eyebrow" style={{ marginBottom: 0 }}>{t}</p>
              <h3 className="rv-h3">[ARTICLE TITLE]</h3>
              <p className="small grow">{['Guide', 'Article', 'Technical guide'][i]} · [READ TIME]</p>
            </Link>
          ))}
        </div>
      </Sec>

      {/* FAQ */}
      <Sec id="faq">
        <div className="rv-split narrow-left">
          <div><Eyebrow>FAQ</Eyebrow><h2 className="rv-h2">Questions Businesses Ask Us.</h2><p style={{ marginTop: 16 }}>Straight answers about who we are and how we work.</p></div>
          <div className="rv-faq">
            {faqs.map((f) => (<details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>))}
          </div>
        </div>
      </Sec>

      <Cta
        title="Let’s Build Something That Moves Your Business Forward."
        text="Whether you’re developing a new digital product, improving business operations, or exploring how AI can create value in your organization, let’s engineer the right solution."
        secondary={['Talk to Our Team', '/contact']}
      />
    </Page>
  );
}
