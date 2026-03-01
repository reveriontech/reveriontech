import { useState } from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';
import { PinContainer } from '../components/ui/PinContainer';
import { allProjects } from '../data/projects';
import type { CaseStudy } from '../types';
import '../styles/case-studies.css';

export function CaseStudiesPage() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  return (
    <div className="case-studies">
      <div className="case-studies__inner">
        <Reveal>
          <SectionHeading
            subtitle="Our Work"
            title="Case"
            highlight="Studies"
            align="center"
          />
        </Reveal>

        {/* Grid */}
        <div className="case-studies__grid">
          {allProjects.map((study, i) => (
            <Reveal key={study.id} direction="scale" delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <PinContainer
                title={study.title}
                href={study.href}
                containerClassName="case-study-pin"
                onClick={() => setSelectedStudy(study)}
              >
                <div className="case-study-card">
                  <div className="case-study-card__thumbnail">
                    {study.image ? (
                      <img
                        src={study.image}
                        alt={`${study.title} preview`}
                        className="case-study-card__screenshot"
                      />
                    ) : (
                      <div
                        className="case-study-card__gradient"
                        style={{
                          background: `linear-gradient(135deg, ${study.gradientFrom} 0%, ${study.gradientTo} 100%)`,
                        }}
                      />
                    )}
                    <div className="case-study-card__overlay">
                      <span className="case-study-card__overlay-text">
                        View Details <Icon name="arrow-right" size={16} />
                      </span>
                    </div>
                  </div>
                  <div className="case-study-card__body">
                    <p className="case-study-card__industry">{study.industry}</p>
                    <h3 className="case-study-card__title">{study.title}</h3>
                    <p className="case-study-card__client">{study.client}</p>
                    <div className="case-study-card__tech">
                      {study.technologies.map((tech) => (
                        <span key={tech} className="case-study-card__badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </PinContainer>
            </Reveal>
          ))}
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={!!selectedStudy}
          onClose={() => setSelectedStudy(null)}
          title={selectedStudy?.title}
        >
          {selectedStudy && (
            <>
              <div className="case-study-modal__meta">
                <span className="case-study-modal__meta-item">
                  Client: <span>{selectedStudy.client}</span>
                </span>
                <span className="case-study-modal__meta-item">
                  Industry: <span>{selectedStudy.industry}</span>
                </span>
              </div>

              <div className="case-study-modal__section">
                <h4>Overview</h4>
                <p>{selectedStudy.summary}</p>
              </div>

              <div className="case-study-modal__section">
                <h4>Challenge</h4>
                <p>{selectedStudy.challenge}</p>
              </div>

              <div className="case-study-modal__section">
                <h4>Solution</h4>
                <p>{selectedStudy.solution}</p>
              </div>

              <div className="case-study-modal__section">
                <h4>Results</h4>
                <div className="case-study-modal__results">
                  {selectedStudy.results.map((result) => (
                    <div key={result} className="case-study-modal__result">
                      <Icon name="check" size={16} />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="case-study-modal__section">
                <h4>Tech Stack</h4>
                <div className="case-study-modal__tech-stack">
                  {selectedStudy.technologies.map((tech) => (
                    <span key={tech} className="case-study-modal__tech-badge">{tech}</span>
                  ))}
                </div>
              </div>

              {selectedStudy.testimonial && (
                <div className="case-study-modal__testimonial">
                  <blockquote>"{selectedStudy.testimonial.quote}"</blockquote>
                  <cite>
                    <strong>{selectedStudy.testimonial.author}</strong> — {selectedStudy.testimonial.role}
                  </cite>
                </div>
              )}

              <div className="case-study-modal__cta">
                <Button
                  to={`/contact?service=web-development&ref=${selectedStudy.id}`}
                  onClick={() => setSelectedStudy(null)}
                >
                  Start Similar Project <Icon name="arrow-right" size={16} />
                </Button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
