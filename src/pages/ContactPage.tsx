import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Page, Wrap } from '../components/site/parts';
import { industriesForm } from '../data/site';
import { submitContactRequest } from '../lib/contactRequests';

const serviceOptions = ['Software Development', 'AI & Automation', 'Business Systems', 'Cloud & DevOps', 'Cybersecurity', 'Technology Consulting', 'Other'];
const budgets = ['Under $10,000', '$10,000 – $25,000', '$25,000 – $50,000', '$50,000 – $100,000', '$100,000+', 'Not sure yet'];
const timelines = ['As soon as possible', '1 – 3 months', '3 – 6 months', '6+ months', 'Just exploring'];

const empty = { name: '', email: '', company: '', industry: '', service: '', budget: '', timeline: '', description: '' };
type Form = typeof empty;
const required: (keyof Form)[] = ['name', 'email', 'company', 'service', 'description'];

export function ContactPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState<Form>({ ...empty, service: params.get('service') ?? '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [done, setDone] = useState(false);

  const set = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const errs: Partial<Record<keyof Form, boolean>> = {};
    required.forEach((k) => { if (!form[k].trim()) errs[k] = true; });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { industry, ...rest } = form;
      await submitContactRequest({ ...rest, description: industry ? `[Industry: ${industry}]\n${form.description}` : form.description });
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`f-${k}`}>{label}{required.includes(k) ? ' *' : ''}</label>
      <input id={`f-${k}`} value={form[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={errors[k] || undefined} {...props} />
      {errors[k] && <p className="rv-err" role="alert">This field is required.</p>}
    </div>
  );
  const select = (k: keyof Form, label: string, opts: string[], ph: string, full = false) => (
    <div className={full ? 'full' : undefined}>
      <label htmlFor={`f-${k}`}>{label}{required.includes(k) ? ' *' : ''}</label>
      <select id={`f-${k}`} value={form[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={errors[k] || undefined}>
        <option value="">{ph}</option>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
      {errors[k] && <p className="rv-err" role="alert">Please choose one.</p>}
    </div>
  );

  return (
    <Page>
      <section className="rv-sec" style={{ padding: 0 }}>
        <Wrap className="rv-contact">
          <aside className="rv-contact__aside">
            <div>
              <p className="rv-eyebrow" style={{ color: 'var(--cyan)', marginBottom: 18 }}>START A PROJECT</p>
              <h1>Let’s Build Something.</h1>
              <p style={{ fontSize: '1.0625rem' }}>Tell us what you want to improve or build. A real engineer reads every inquiry.</p>
            </div>
            <div>
              <p className="l">What happens next</p>
              <ol className="rv-steps">
                <li><span className="rv-mono">01</span><span>We review your inquiry and reply within [1 BUSINESS DAY].</span></li>
                <li><span className="rv-mono">02</span><span>A short discovery call to understand goals, constraints and existing systems.</span></li>
                <li><span className="rv-mono">03</span><span>A clear proposal: approach, timeline and cost.</span></li>
              </ol>
            </div>
            <div className="rv-contact__info">
              <div><p className="l">Main office</p><p>212 N. 2nd St. Ste 100<br />Richmond, KY 40475</p></div>
              <div><p className="l">Philippines</p><p>Davao City 8000</p></div>
              <div><p className="l">Email</p><a href="mailto:hello@reveriontech.com">hello@reveriontech.com</a></div>
            </div>
          </aside>

          <div className="rv-contact__main">
            {done ? (
              <div className="rv-success" role="status">
                <div className="rv-success__icon">
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12.5 10 17.5 19 7" /></svg>
                </div>
                <h2>Thanks — your inquiry is in.</h2>
                <p>We’ve received your inquiry. An engineer will review your project and reply within [1 BUSINESS DAY] to arrange a discovery call.</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  <Link to="/projects" className="rv-btn ghost">See Our Work</Link>
                  <button type="button" className="rv-btn" style={{ background: 'transparent', color: 'var(--teal2)' }} onClick={() => { setForm(empty); setDone(false); }}>Send another inquiry</button>
                </div>
              </div>
            ) : (
            <form className="rv-form" onSubmit={submit} noValidate>
              <div className="full"><h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>Project Inquiry</h2><p style={{ fontSize: '.9375rem' }}>Fields marked * are required.</p></div>
              {field('name', 'Full Name', { type: 'text', autoComplete: 'name' })}
              {field('email', 'Business Email', { type: 'email', autoComplete: 'email' })}
              {field('company', 'Company', { type: 'text', autoComplete: 'organization' })}
              {select('industry', 'Industry', industriesForm, 'Select an industry')}
              {select('service', 'Service Required', serviceOptions, 'Select a service')}
              {select('budget', 'Project Budget', budgets, 'Select a range')}
              {select('timeline', 'Expected Timeline', timelines, 'Select a timeline', true)}
              <div className="full">
                <label htmlFor="f-description">Project Description *</label>
                <textarea id="f-description" rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} aria-invalid={errors.description || undefined} placeholder="What do you want to build or improve? What systems do you use today?" />
                {errors.description && <p className="rv-err" role="alert">This field is required.</p>}
              </div>
              <div className="full" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <p style={{ fontSize: '.8125rem', maxWidth: '26rem' }}>We use your details only to respond to this inquiry. See our <Link to="/privacy">Privacy Policy</Link>.</p>
                <button type="submit" className="rv-btn primary" disabled={loading}>{loading ? 'Sending…' : 'Send Inquiry'}</button>
              </div>
              {submitError && <p className="rv-err full" role="alert">{submitError}</p>}
            </form>
            )}
          </div>
        </Wrap>
      </section>
    </Page>
  );
}
