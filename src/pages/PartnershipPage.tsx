'use client';

import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { CardBody, CardContainer, CardItem } from '../components/ui/3d-card';
import '../styles/partners.css';

const partners = [
  {
    name: 'DCT',
    fullName: 'Lungsod ng Dabaw',
    description: 'Government & civic innovation partner for Davao City.',
    logo: '/partnership/DAVAO_logo.png',
    url: 'https://davaocity.gov.ph',
  },
  {
    name: 'ICP-PH',
    fullName: 'ICP Philippines',
    description: 'Internet Computer Protocol community and blockchain initiatives.',
    logo: '/partnership/ICP_logo.png',
    url: 'https://internetcomputer.org',
  },
  {
    name: 'NFT Davao',
    fullName: 'NFT Davao',
    description: 'NFT and digital collectibles ecosystem in Davao.',
    logo: '/partnership/NFTDAVAO_logo.png',
    url: 'https://www.facebook.com/nftdavao',
  },
  {
    name: 'RERDAO',
    fullName: 'RERDAO',
    description: 'Regional blockchain and Web3 innovation hub.',
    logo: '/partnership/REDDAO_logo.jpg',
    url: 'https://www.facebook.com/reveriondao',
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

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

          <motion.div
            className="partners-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {partners.map((partner) => {
              const cardContent = (
                <CardContainer
                  containerClassName="partner-3d-container"
                  className="partner-3d-inner"
                >
                  <CardBody className="partner-card-3d">
                    <CardItem
                      translateZ={100}
                      className="partner-card-3d__logo-wrap"
                    >
                      <img
                        src={partner.logo}
                        alt={`${partner.fullName} logo`}
                        className="partner-card-3d__logo"
                        loading="lazy"
                      />
                    </CardItem>
                    <CardItem
                      translateZ={50}
                      as="p"
                      className="partner-card-3d__name"
                    >
                      {partner.fullName}
                    </CardItem>
                    <CardItem
                      translateZ={60}
                      as="p"
                      className="partner-card-3d__desc"
                    >
                      {partner.description}
                    </CardItem>
                    <CardItem
                      translateZ={20}
                      as="span"
                      className={`partner-card-3d__link ${partner.url === '#' ? 'partner-card-3d__link--disabled' : ''}`}
                    >
                      {partner.url !== '#' ? (
                        <>
                          Visit website
                          <Icon name="arrow-right" size={14} />
                        </>
                      ) : (
                        'Coming soon'
                      )}
                    </CardItem>
                  </CardBody>
                </CardContainer>
              );

              return partner.url !== '#' ? (
                <motion.a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-card-3d-wrapper"
                  variants={itemVariants}
                  aria-label={`Visit ${partner.fullName} website`}
                >
                  {cardContent}
                </motion.a>
              ) : (
                <motion.div
                  key={partner.name}
                  className="partner-card-3d-wrapper partner-card-3d-wrapper--no-link"
                  variants={itemVariants}
                >
                  {cardContent}
                </motion.div>
              );
            })}
          </motion.div>
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
