import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { motion } from 'framer-motion';
import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import ElectricBorder from '../components/ui/ElectricBorder';
import { services } from '../data/services';
import '../styles/about.css';

const FILTERS = ['All', 'Web & UI', 'Apps & Products', 'AI & Automation'] as const;
type Filter = (typeof FILTERS)[number];

const serviceCategory: Record<string, Filter> = {
  'web-development': 'Web & UI',
  'ui-ux-design': 'Web & UI',
  'mobile-apps': 'Apps & Products',
  'editing-photo': 'Apps & Products',
  'cloud-architecture': 'AI & Automation',
  'ai-integration': 'AI & Automation',
};

const PROCESS_STEPS = [
  {
    number: '01',
    icon: 'search' as const,
    heading: 'Discovery',
    description: 'Sessions to align on goals and constraints.',
  },
  {
    number: '02',
    icon: 'design' as const,
    heading: 'Design & Build',
    description: 'Design and engineering in the same loop.',
  },
  {
    number: '03',
    icon: 'arrow-right' as const,
    heading: 'Launch',
    description: 'Support and long‑term iteration options.',
  },
];

export function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step1InView = useInView(step1Ref, { amount: 0.3 });
  const step2InView = useInView(step2Ref, { amount: 0.3 });
  const step3InView = useInView(step3Ref, { amount: 0.3 });
  const activeStep = step3InView ? 2 : step2InView ? 1 : step1InView ? 0 : -1;
  const lineProgress = activeStep < 0 ? 0 : (activeStep + 1) / 3;

  const filteredServices = services.filter((service) => {
    if (activeFilter === 'All') return true;
    const category = serviceCategory[service.id] ?? 'Web & UI';
    return category === activeFilter;
  });

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <Reveal direction="scale" className="about-hero__content">
            <span className="about-hero__subtitle"></span>
            <h1 className="about-hero__title">Selected client work</h1>
            <p className="about-hero__description">
              A curated look at the brands, products, and platforms we&apos;ve shipped – blending Web3,
              GenAI, and clean front‑end engineering into experiences that actually move the needle.
            </p>
            <div className="about-hero__actions">
              <Button size="lg" to="/contact">
                Start a project
              </Button>
              <Button size="lg" variant="outline" to="/case-studies">
                View full case studies
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capability grid */}
      <section className="about-services">
        <div className="container">
          <div className="about-services__header">
            <h2 className="about-services__title">Selected capabilities</h2>
            <p className="about-services__subtitle">
              Explore the types of work we take on. Filter by focus area to see how we might plug into
              your roadmap.
            </p>
          </div>

          <div className="portfolio-filters">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`portfolio-filter-chip ${
                  activeFilter === filter ? 'portfolio-filter-chip--active' : ''
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="about-services__grid">
            {filteredServices.map((service, i) => (
              <Reveal
                key={service.id}
                direction="scale"
                delay={((i % 3) + 1) as 1 | 2 | 3}
                className="service-card-new-wrapper"
              >
                <ElectricBorder
                  color="#7df9ff"
                  speed={0.35}
                  chaos={0.08}
                  thickness={1.5}
                  displacement={10}
                  outwardOffset={28}
                  borderRadius={16}
                  className="service-card-new-electric"
                >
                  <article className="service-card-new service-card-new--portfolio">
                    <div className="service-card-new__icon">
                      <Icon name={service.icon} size={40} />
                    </div>
                    <header className="service-card-new__header">
                      <h3 className="service-card-new__title">{service.title}</h3>
                      <p className="service-card-new__desc">{service.description}</p>
                    </header>

                    {service.features?.length ? (
                      <ul className="service-card-new__tags">
                        {service.features.map((feature) => (
                          <li key={feature} className="service-card-new__tag">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <footer className="service-card-new__footer">
                      <a href={`/services/${service.id}`} className="service-card-new__link">
                        View example work
                        <Icon name="arrow-right" size={14} />
                      </a>
                    </footer>
                  </article>
                </ElectricBorder>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process / CTA — Horizontal timeline */}
      <section className="process-timeline">
        <div className="container">
          <Reveal direction="up" className="process-timeline__header">
            <span className="process-timeline__label">How we work</span>
            <h2 className="process-timeline__title">
              From idea to launch with a collaborative, transparent process.
            </h2>
            <p className="process-timeline__desc">
              We combine discovery, rapid prototyping, and iterative delivery so you see progress
              early and often – not just at the end of a long roadmap.
            </p>
          </Reveal>

          <div className="process-timeline__track">
            {/* SVG line that draws on scroll */}
            <div className="process-timeline__line-wrap" aria-hidden>
              <svg className="process-timeline__line-svg" viewBox="0 0 1000 8" preserveAspectRatio="none">
                <path
                  className="process-timeline__path"
                  d="M 0 4 H 1000"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    strokeDasharray: 1000,
                    strokeDashoffset: 1000 - 1000 * lineProgress,
                  }}
                />
              </svg>
            </div>

            <div className="process-timeline__steps">
              {PROCESS_STEPS.map((step, i) => {
                const ref = i === 0 ? step1Ref : i === 1 ? step2Ref : step3Ref;
                const isActive = activeStep === i;
                return (
                  <div
                    key={step.number}
                    ref={ref}
                    className={`process-timeline__step ${isActive ? 'process-timeline__step--active' : ''}`}
                  >
                    <div className="process-timeline__number-wrap">
                      <span
                        className="process-timeline__number"
                        style={{ ['--fill-progress' as string]: isActive ? 1 : activeStep > i ? 1 : 0 }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <div className="process-timeline__icon-wrap">
                      <Icon name={step.icon} size={28} />
                    </div>
                    <motion.div
                      className="process-timeline__content"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: isActive ? 0 : 0.1 }}
                    >
                      <h3 className="process-timeline__heading">{step.heading}</h3>
                      <p className="process-timeline__text">{step.description}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <Reveal direction="up" className="process-timeline__cta">
            <Button size="lg" to="/contact">
              Book a portfolio walkthrough
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}