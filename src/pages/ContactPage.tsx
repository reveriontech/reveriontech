import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';
import { services } from '../data/services';
import '../styles/contact.css';

interface FormData {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  description: string;
  timeline: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  company: '',
  service: '',
  budget: '',
  description: '',
  timeline: '',
};

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormData>(() => ({
    ...initialForm,
    service: searchParams.get('service') || '',
  }));
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    if (!form.name) newErrors.name = true;
    if (!form.email) newErrors.email = true;
    if (!form.description) newErrors.description = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800));

      // Save to localStorage (MOCK BACKEND)
      const newRequest = {
        id: crypto.randomUUID(),
        ...form,
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      const existingRequests = JSON.parse(localStorage.getItem('contact_requests') || '[]');
      localStorage.setItem('contact_requests', JSON.stringify([newRequest, ...existingRequests]));

      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact contact--split">
        <div className="contact__inner contact__inner--success">
          <Reveal className="contact__success">
            <div className="contact__success-icon">
              <Icon name="check" size={56} />
            </div>
            <h2 className="contact__success-title">Thank you</h2>
            <p className="contact__success-text">
              Your project inquiry has been received. Our team will review your
              details and get back to you within 24 hours with next steps.
            </p>
            <Button to="/" size="lg">
              Back to Home
            </Button>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="contact contact--split">
      <div className="contact__inner">
        {/* Left (40%): Headline + copy + trust signals */}
        <div className="contact__hero">
          <div className="contact__hero-bg" aria-hidden />
          <Reveal direction="right" className="contact__hero-content">
            <span className="contact__subtitle">Start your project</span>
            <h1 className="contact__title">
              Let’s build something <span className="contact__title-accent">great</span>
            </h1>
            <p className="contact__lead">
              Fill in the details and we’ll get back to you within 24 hours. No commitment required.
            </p>
            <div className="contact__trust">
              <div className="contact__trust-item">
                <Icon name="check" size={20} className="contact__trust-icon" />
                <span>50+ projects delivered</span>
              </div>
              <div className="contact__trust-item">
                <Icon name="check" size={20} className="contact__trust-icon" />
                <span>Response within 24 hours</span>
              </div>
              <div className="contact__trust-item">
                <Icon name="check" size={20} className="contact__trust-icon" />
                <span>No commitment required</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right (60%): Form card */}
        <div className="contact__form-side">
          <Reveal direction="up" className="contact__form-card">
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label contact__label--required" htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    className={`contact__input ${errors.name ? 'contact__input--error' : ''}`}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label contact__label--required" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className={`contact__input ${errors.email ? 'contact__input--error' : ''}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-company">Company</label>
                  <input
                    id="contact-company"
                    type="text"
                    className="contact__input"
                    placeholder="Your company"
                    value={form.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-service">Service interest</label>
                  <select
                    id="contact-service"
                    className="contact__select"
                    value={form.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                    <option value="general">General inquiry</option>
                  </select>
                </div>
              </div>

              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-budget">Budget range</label>
                  <select
                    id="contact-budget"
                    className="contact__select"
                    value={form.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                  >
                    <option value="">Select budget</option>
                    <option value="5k-15k">$5,000 – $15,000</option>
                    <option value="15k-50k">$15,000 – $50,000</option>
                    <option value="50k-100k">$50,000 – $100,000</option>
                    <option value="100k+">$100,000+</option>
                  </select>
                </div>
                <div className="contact__field">
                  <label className="contact__label" htmlFor="contact-timeline">Timeline</label>
                  <select
                    id="contact-timeline"
                    className="contact__select"
                    value={form.timeline}
                    onChange={(e) => handleChange('timeline', e.target.value)}
                  >
                    <option value="">Select timeline</option>
                    <option value="1-2months">1–2 months</option>
                    <option value="3-6months">3–6 months</option>
                    <option value="6-12months">6–12 months</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div className="contact__field">
                <label className="contact__label contact__label--required" htmlFor="contact-description">Project description</label>
                <textarea
                  id="contact-description"
                  className={`contact__textarea ${errors.description ? 'contact__textarea--error' : ''}`}
                  placeholder="Tell us about your project, goals, and any specific requirements…"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              <div className="contact__submit">
                <button
                  type="submit"
                  className="contact__submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="contact__submit-spinner" aria-hidden />
                  ) : (
                    <>
                      Send inquiry
                      <Icon name="arrow-right" size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
