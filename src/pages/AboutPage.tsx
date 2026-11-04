import { Link } from 'react-router-dom';
import { Page, Sec, Eyebrow, Cta } from '../components/site/parts';
import { values } from '../data/site';

const facts: [string, React.ReactNode][] = [
  ['Company type', 'AI-enabled technology engineering company'],
  ['Main office', '212 N. 2nd St. Ste 100, Richmond, KY 40475, USA'],
  ['Second office', 'Davao City, Philippines'],
  ['Services', 'Software engineering, AI & automation, business systems, cloud & DevOps, cybersecurity, technology consulting'],
  ['Clients', 'SMEs, startups, established companies, enterprises and public-sector organizations'],
  ['Contact', <a key="m" href="mailto:hello@reveriontech.com">hello@reveriontech.com</a>],
];

export function AboutPage() {
  return (
    <Page>
      <Sec>
        <Eyebrow>ABOUT REVERION TECH</Eyebrow>
        <h1 className="rv-h1" style={{ marginBottom: 24 }}>Technology That Works for People.</h1>
        <p className="rv-lead">Reverion Tech is an AI-enabled technology engineering company. We help businesses build intelligent digital products, automate complex operations, and modernize their technology infrastructure — combining software engineering, artificial intelligence and human expertise.</p>
      </Sec>

      <Sec tone="alt" label="Reverion Tech at a glance">
        <h2 className="rv-h2">Reverion Tech at a Glance</h2>
        <dl className="rv-facts">
          {facts.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
        </dl>
      </Sec>

      <Sec tone="dark">
        <div className="rv-split">
          <div><Eyebrow>MISSION</Eyebrow><p className="rv-big">To engineer intelligent, secure, and reliable technology solutions that empower businesses and organizations to operate smarter and achieve more.</p></div>
          <div><Eyebrow>VISION</Eyebrow><p className="rv-big">To become a trusted technology engineering partner recognized for building meaningful digital solutions and advancing the practical application of emerging technologies.</p></div>
        </div>
      </Sec>

      <Sec>
        <div className="rv-split">
          <div className="rv-stack">
            <Eyebrow>OUR PHILOSOPHY</Eyebrow>
            <h2 className="rv-h2">More Capable, Not More Complicated.</h2>
            <p>We don’t simply implement technology. We understand business challenges, engineer solutions, and help organizations operate smarter. AI should amplify human capabilities — not become a marketing gimmick or a replacement for thoughtful engineering.</p>
          </div>
          <div>
            <p className="rv-label">The best technology combines</p>
            <ul className="rv-list">
              {['Intelligent systems', 'Human judgment', 'Engineering excellence', 'Responsible automation', 'Security and reliability', 'Continuous improvement'].map((v) => <li key={v}>{v}</li>)}
            </ul>
          </div>
        </div>
      </Sec>

      <Sec tone="alt">
        <div style={{ marginBottom: '2.5rem' }}><Eyebrow>CORE VALUES</Eyebrow><h2 className="rv-h2">How We Work.</h2></div>
        <div className="rv-grid">
          {values.map((v, i) => (
            <div key={v} className="rv-value"><p className="rv-mono">{String(i + 1).padStart(2, '0')}</p><h3 className="rv-h3">{v}</h3></div>
          ))}
        </div>
      </Sec>

      <Sec>
        <div className="rv-split">
          <div className="rv-stack">
            <Eyebrow>OUR STORY</Eyebrow>
            <h2 className="rv-h2">[STORY HEADLINE]</h2>
            <p>[COMPANY STORY — WHEN AND WHY REVERION TECH STARTED, AND HOW IT HAS GROWN. VERIFIED FACTS ONLY.]</p>
          </div>
          <div>
            <Eyebrow>OUR TEAM</Eyebrow>
            <div className="rv-grid w240">
              {[0, 1, 2].map((i) => (<div key={i} className="rv-person"><div className="ph" /><p style={{ color: 'var(--navy)', fontWeight: 600 }}>[NAME]</p><p className="small">[ROLE]</p></div>))}
            </div>
            <p style={{ marginTop: 20 }}><Link to="/our-team" className="rv-link">Meet the team →</Link> · <Link to="/partners" className="rv-link">Our partners →</Link></p>
          </div>
        </div>
      </Sec>

      <Sec tone="alt">
        <div className="rv-grid">
          <div><Eyebrow>OFFICES</Eyebrow><h2 className="rv-h2">Local Presence. International Reach.</h2></div>
          <div className="rv-card"><p className="rv-label">Main office</p><p>212 N. 2nd St. Ste 100<br />Richmond, KY 40475<br />United States</p></div>
          <div className="rv-card"><p className="rv-label">Philippines</p><p>Davao City 8000<br />Philippines</p></div>
        </div>
      </Sec>

      <Cta title="From Complex Challenges to Practical Solutions." secondary={['Explore Our Capabilities', '/services']} />
    </Page>
  );
}
