import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { teamMembers } from '../data/teamData';
import { Icon } from '../components/ui/Icon';
import '../styles/team.css';

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

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 20,
    },
  },
};

export function OurTeamPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.children[activeIndex] as HTMLElement | undefined;
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <div className="team-page">
      <section className="team-hero">
        <div className="container team-hero__container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="team-hero__eyebrow">ReverionTech</p>
            <h1 className="team-hero__title">Our Core</h1>
            <p className="team-hero__subtitle">
              A collective of visionaries, architects, and technical experts
              dedicated to breaking the standard paradigms of digital experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="team-slider-section">
        <div className="container">
          <div className="team-slider__header">
            <h2 className="team-slider__title">Core Team Cards</h2>
          </div>

          <div className="team-slider__viewport">
            <button
              type="button"
              className="team-slider__arrow team-slider__arrow--left"
              onClick={handlePrev}
              aria-label="Previous team member"
            >
              <Icon name="arrowLeft" size={18} />
            </button>

            <motion.div
              ref={sliderRef}
              className="team-slider"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {teamMembers.map((member, index) => (
                <motion.article
                  key={member.id}
                  className={`team-card team-card--variant-${(index % 4) + 1} ${
                    index === activeIndex ? 'team-card--active' : ''
                  }`}
                  variants={cardVariants}
                >
                  <div className="team-card__frame">
                    <div className="team-card__scanline" />
                    <div className="team-card__inner">
                      <header className="team-card__meta">
                        <span className="team-card__meta-slot">
                          <span className="team-card__meta-label">Unit</span>
                          <span className="team-card__meta-value">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                        </span>
                        <span className="team-card__meta-status">
                          <span className="team-card__status-dot" />
                          Active
                        </span>
                      </header>

                      <div className="team-card__image-wrap">
                        <img src={member.image} alt={member.name} className="team-card__image" />
                      </div>

                      <div className="team-card__content">
                        <h3 className="team-card__name">{member.name}</h3>
                        <p className="team-card__role">{member.role}</p>
                        <p className="team-card__bio team-card__bio--clamp">{member.bio}</p>

                        <div className="team-card__footer">
                          <div className="team-card__tags">
                            <span className="team-card__tag">Signal: High</span>
                            <span className="team-card__tag">Latency: Low</span>
                          </div>

                          <div className="team-card__socials">
                            {member.socials.linkedin && (
                              <a
                                href={member.socials.linkedin}
                                className="team-card__social-link"
                                aria-label={`${member.name} on LinkedIn`}
                              >
                                <Icon name="user" size={16} />
                              </a>
                            )}
                            {member.socials.facebook && (
                              <a
                                href={member.socials.facebook}
                                className="team-card__social-link"
                                aria-label={`${member.name} on Facebook`}
                              >
                                <Icon name="customer" size={16} />
                              </a>
                            )}
                            {member.socials.instagram && (
                              <a
                                href={member.socials.instagram}
                                className="team-card__social-link"
                                aria-label={`${member.name} on Instagram`}
                              >
                                <Icon name="image" size={16} />
                              </a>
                            )}
                            {member.socials.youtube && (
                              <a
                                href={member.socials.youtube}
                                className="team-card__social-link"
                                aria-label={`${member.name} on YouTube`}
                              >
                                <Icon name="ai" size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            <button
              type="button"
              className="team-slider__arrow team-slider__arrow--right"
              onClick={handleNext}
              aria-label="Next team member"
            >
              <Icon name="arrow-right" size={18} />
            </button>
          </div>

          <div
            className="team-slider__dots"
            role="tablist"
            aria-label="Select team member card"
          >
            {teamMembers.map((member, index) => (
              <button
                key={member.id}
                type="button"
                className={`team-slider__dot ${
                  index === activeIndex ? 'team-slider__dot--active' : ''
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${member.name}`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OurTeamPage;
