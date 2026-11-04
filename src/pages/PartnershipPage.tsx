'use client';

import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import '../styles/partners.css';

const partners = [
  {
    name: 'Stripe',
    fullName: 'Stripe',
    description: 'Payments infrastructure for internet businesses.',
    logo: '/partnership/stripe.svg',
    url: 'https://stripe.com',
  },
  {
    name: 'Techstars',
    fullName: 'Techstars',
    description: 'Global accelerator and early-stage investor.',
    logo: '/partnership/techstars.png',
    url: 'https://www.techstars.com',
  },
  {
    name: 'Stanford',
    fullName: 'Stanford University',
    description: 'Research university and innovation partner.',
    logo: '/partnership/stanford.png',
    url: 'https://www.stanford.edu',
  },
  {
    name: 'Google',
    fullName: 'Google',
    description: 'Search, cloud, and developer platforms.',
    logo: '/partnership/google.svg',
    url: 'https://www.google.com',
  },
  {
    name: 'Berkeley IPIRA',
    fullName: 'UC Berkeley IPIRA',
    description: 'Intellectual property and industry research alliances.',
    logo: '/partnership/berkeley.svg',
    url: 'https://ipira.berkeley.edu',
  },
  {
    name: 'Cloudflare',
    fullName: 'Cloudflare',
    description: 'Global network for security and performance.',
    logo: '/partnership/cloudflare.svg',
    url: 'https://www.cloudflare.com',
  },
  {
    name: 'Accenture',
    fullName: 'Accenture',
    description: 'Technology and professional services.',
    logo: '/partnership/accenture.svg',
    url: 'https://www.accenture.com',
  },
  {
    name: 'Sui',
    fullName: 'Sui',
    description: 'Layer 1 blockchain built for high throughput.',
    logo: '/partnership/sui.svg',
    url: 'https://sui.io',
  },
  {
    name: 'Stellar',
    fullName: 'Stellar',
    description: 'Open network for cross-border payments.',
    logo: '/partnership/stellar.svg',
    url: 'https://stellar.org',
  },
  {
    name: 'a16z',
    fullName: 'Andreessen Horowitz',
    description: 'Venture capital firm backing technology companies.',
    logo: '/partnership/a16z.svg',
    url: 'https://a16z.com',
  },
];

const designBuildSteps = [
  {
    step: '01',
    title: 'Discover',
    desc: 'We align with your goals, constraints, and vision from day one—no handoffs, no surprises.',
  },
  {
    step: '02',
    title: 'Design & Build',
    desc: 'Single-source accountability. Design and delivery merge into one streamlined process.',
  },
  {
    step: '03',
    title: 'Deliver',
    desc: 'From concept to completion, we own the outcome and ensure it exceeds expectations.',
  },
];

export function PartnershipPage() {
  return (
    <div className="partners-page">
      {/* Hero */}
      <section className="partners-hero">
        <div className="partners-container">
          <motion.h1
            className="partners-hero__title"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Partners
          </motion.h1>
        </div>
      </section>

      {/* Design-Build Intro */}
      <section className="partners-intro">
        <div className="partners-container">
          <div className="partners-intro__grid">
            <motion.div
              className="partners-intro__content"
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="partners-intro__label">Design-Build</span>
              <h2 className="partners-intro__title">One Team. One Process.</h2>
              <p className="partners-intro__desc">
                With extensive background in design-build partnerships, we're familiar with numerous
                delivery methods and confident we can find the process that helps you meet your goals.
                Single accountability. Integrated design and construction. Faster delivery.
              </p>
            </motion.div>
            <motion.div
              className="partners-intro__steps"
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {designBuildSteps.map((item, idx) => (
                <div key={idx} className="partners-step">
                  <span className="partners-step__num">{item.step}</span>
                  <div>
                    <h3 className="partners-step__title">{item.title}</h3>
                    <p className="partners-step__desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="partners-section">
        <div className="partners-container">
          <motion.div
            className="partners-header"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="partners-label">TEAM · CUSTOMER · COMMUNITY</span>
            <h2 className="partners-title">We Work With the Best</h2>
          </motion.div>

        </div>

        <div className="partners-marquee">
          <div className="partners-marquee__track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="partners-marquee__row" aria-hidden={copy === 1 || undefined}>
                {partners.map((partner) => (
                  <li key={`${partner.name}-${copy}`}>
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="partners-marquee__item"
                      aria-label={partner.fullName}
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      <span className="partners-marquee__logo">
                        <img src={partner.logo} alt="" />
                      </span>
                      <span className="partners-marquee__name">{partner.fullName}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="partners-cta">
        <div className="partners-container">
          <motion.div
            className="partners-cta__inner"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="partners-cta__label">Next Step</span>
            <h2 className="partners-cta__title">Ready to partner with us?</h2>
            <Button to="/contact" size="lg" variant="primary">
              Start a Project
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
