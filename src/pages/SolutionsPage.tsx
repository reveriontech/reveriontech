import { Reveal } from '../components/ui/Reveal';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { solutionsTiers } from '../data/solutionsTiers';
import '../styles/about.css';
import '../styles/solutions.css';

function TierIllustration({ type }: { type: 'starter' | 'growth' | 'enterprise' }) {
  if (type === 'starter') {
    return (
      <div className="solutions-card__illus solutions-card__illus--starter">
        <div className="solutions-card__block" />
        <div className="solutions-card__block solutions-card__block--2" />
        <div className="solutions-card__block solutions-card__block--3" />
      </div>
    );
  }
  if (type === 'growth') {
    return (
      <div className="solutions-card__illus solutions-card__illus--growth">
        <div className="solutions-card__layer" />
        <div className="solutions-card__layer solutions-card__layer--2" />
        <div className="solutions-card__arrow">↑</div>
      </div>
    );
  }
  return (
    <div className="solutions-card__illus solutions-card__illus--enterprise">
      <div className="solutions-card__node" />
      <div className="solutions-card__node solutions-card__node--2" />
      <div className="solutions-card__node solutions-card__node--3" />
      <div className="solutions-card__shield" />
    </div>
  );
}

export function SolutionsPage() {
  return (
    <div className="about-page solutions">
      <section className="about-hero solutions-hero">
        <div className="container">
          <Reveal direction="scale" className="about-hero__content">
            <span className="about-hero__subtitle" />
            <h1 className="about-hero__title">Smart Solutions</h1>
            <p className="about-hero__description">
              Pricing tiers that scale with your business. From getting started to enterprise grade choose the right fit.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="solutions-section">
        <div className="container">
          <Reveal direction="up" className="solutions-section__header">
            <h2 className="solutions-section__title">Solutions That Scale With Your Business</h2>
            <p className="solutions-section__desc">
              Whether you’re a small team or a large organization, we have a plan designed for your needs.
            </p>
          </Reveal>

          <div className="solutions-grid">
            {solutionsTiers.map((tier, i) => (
              <Reveal
                key={tier.id}
                direction="up"
                delay={((i % 3) + 1) as 1 | 2 | 3}
                className={`solutions-card-wrapper ${tier.recommended ? 'solutions-card-wrapper--featured' : ''}`}
              >
                <article className={`solutions-card ${tier.recommended ? 'solutions-card--growth' : ''}`}>
                  {tier.recommended && (
                    <div className="solutions-card__badge">Recommended</div>
                  )}
                  <div className="solutions-card__illus-wrap">
                    <TierIllustration type={tier.illustration} />
                  </div>
                  <h3 className="solutions-card__title">{tier.name}</h3>
                  <p className="solutions-card__subtitle">{tier.subtitle}</p>
                  <div className="solutions-card__divider" />
                  <ul className="solutions-card__features">
                    {tier.features.map((feature) => (
                      <li key={feature} className="solutions-card__feature">
                        <Icon name="check" size={18} className="solutions-card__check" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="solutions-card__cta">
                    <Button
                      to={tier.ctaTo}
                      variant={tier.ctaVariant}
                      size="lg"
                      className="solutions-card__btn"
                    >
                      {tier.ctaText}
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
