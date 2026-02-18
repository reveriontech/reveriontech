import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { StatCounter } from '../components/ui/StatCounter';
import { services } from '../data/services';
import { stats } from '../data/stats';
import '../styles/landing.css';

const laptopCodeLines = [
  "const solution = {",
  "  stack: 'Web3 · GenAI · React',",
  "  status: 'live',",
  "  outcomes: ['secure', 'scalable', 'beautiful'],",
  "};",
  '// ReverionTech · building your next product',
];

export function LandingPage() {
  const { hash } = useLocation();
  const heroOrbitsRef = useRef<HTMLDivElement | null>(null);
  const laptopRef = useRef<HTMLDivElement | null>(null);
  const [typedCode, setTypedCode] = useState('');

  const handleHeroMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = heroOrbitsRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = y * -32;
    const rotateY = x * 32;
    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleHeroMouseLeave = () => {
    const el = heroOrbitsRef.current;
    if (!el) return;
    el.style.transform = '';
  };

  const handleLaptopMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = laptopRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const baseX = 20;
    const baseY = -24;
    const maxTilt = 22;

    const rotateX = baseX + y * -maxTilt;
    const rotateY = baseY + x * maxTilt;

    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleLaptopMouseLeave = () => {
    const el = laptopRef.current;
    if (!el) return;
    el.style.transform = '';
  };

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = window.innerHeight * 2;
      const progress = Math.max(0, Math.min(window.scrollY / maxScroll, 1));
      document.documentElement.style.setProperty('--scroll-depth', progress.toString());
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fullText = laptopCodeLines.join('\n');
    let index = 0;
    let phase: 'typing' | 'pause' | 'reset' = 'typing';
    let pauseTicks = 0;

    const interval = setInterval(() => {
      if (phase === 'typing') {
        index += 1;
        if (index >= fullText.length) {
          index = fullText.length;
          phase = 'pause';
        }
      } else if (phase === 'pause') {
        pauseTicks += 1;
        if (pauseTicks > 40) {
          phase = 'reset';
        }
      } else {
        index = 0;
        pauseTicks = 0;
        phase = 'typing';
      }

      setTypedCode(fullText.slice(0, index));
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const typedLines = typedCode.split('\n');

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [hash]);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        {/*you can also add any letter you want here */}
        <div className="hero__bg-letter"> </div>
        <div className="hero__inner">
          <Reveal direction="left" className="hero__content">
            <span className="hero__label">Web3 & GenAI Solutions</span>
            <h1 className="hero__title">
              Building with <span className="hero__title-accent">Blockchain</span> & <span className="hero__title-accent">GenAI</span>
            </h1>
            <div className="hero__bar" aria-hidden="true" />
            <p className="hero__description">
              Empower your business with Web3, GenAI, and scalable digital solutions that enhance security,
              transparency, and innovation across Web3 and Web2 environments.
            </p>
            <div className="hero__cta-group">
              <Button to="/contact?service=general" size="lg">
                Get Started
              </Button>
              <Button variant="outline" to="/case-studies" size="lg">
                View Our Work
              </Button>
            </div>
          </Reveal>
          <div className="hero__image">
            <div
              ref={heroOrbitsRef}
              className="hero__image-orbits"
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
            >
              <span className="hero__orbit hero__orbit--1" />
              <span className="hero__orbit hero__orbit--2" />
              <span className="hero__orbit hero__orbit--3" />
              <img
                src="/ReverionTech.webp"
                alt="ReverionTech"
                className="hero__image-logo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services" id="services">
        <div className="services__layout">
          <Reveal direction="left" className="services__text">
            <SectionHeading subtitle="Our Services" title="WHAT WE" highlight="DO?" />
            <p className="services__description">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <p className="services__description">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
            <div className="services__view-btn">
              <Button variant="primary" to="/case-studies" size="md">
                View All
              </Button>
            </div>
          </Reveal>
          <div className="services__grid">
            {services.slice(0, 4).map((service, i) => (
              <Reveal key={service.id} direction="scale" delay={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="service-card">
                  <div className="service-card__icon">
                    <Icon name={service.icon} size={36} />
                  </div>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__desc">{service.description.split('.')[0]}.</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about" id="about">
        {/*you can also add any letter you want here */}

        <div className="about__bg-letter"> </div>
        <div className="about__inner">
          <Reveal direction="left" className="about__image">
            <div
              ref={laptopRef}
              className="about__laptop"
              onMouseMove={handleLaptopMouseMove}
              onMouseLeave={handleLaptopMouseLeave}
            >
              <div className="about__laptop-screen">
                <div className="about__laptop-screen-inner">
                  <div className="about__laptop-code3d">
                    <div className="about__laptop-code3d-panel">
                      <div className="about__laptop-code3d-header">
                        <div className="about__laptop-code3d-dots">
                          <span className="about__laptop-code3d-dot about__laptop-code3d-dot--red" />
                          <span className="about__laptop-code3d-dot about__laptop-code3d-dot--yellow" />
                          <span className="about__laptop-code3d-dot about__laptop-code3d-dot--green" />
                        </div>
                        <span>reverion-tech.ts</span>
                      </div>
                      <div className="about__laptop-code3d-body">
                        {typedLines.map((line, index) => (
                          <div key={index} className="about__laptop-code3d-line">
                            {line}
                            {index === typedLines.length - 1 && (
                              <span className="about__laptop-code3d-caret" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="about__laptop-code3d-input">
                      <span className="about__laptop-code3d-input-label">Prompt</span>
                      <div className="about__laptop-code3d-input-field" />
                      <span className="about__laptop-code3d-input-btn">Run</span>
                    </div>
                  </div>
                  <div className="about__laptop-screen-glow" />
                </div>
              </div>
              <div className="about__laptop-base">
                <div className="about__laptop-base-top" />
                <div className="about__laptop-base-front" />
              </div>
              <div className="about__laptop-shadow" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={1} className="about__content">
            <SectionHeading subtitle="About Us" title="WHO ARE" highlight="WE?" />
            <p className="about__description">
              Whether you're looking to harness the power of blockchain, implement AI-driven solutions,
              or transform your data into actionable insights, Reverion Tech has the expertise, experience,
              and enthusiasm to make it happen.
            </p>
            <div className="about__features">
              <div className="about__feature">
                <div className="about__feature-icon">
                  <Icon name="clean-code" size={28} />
                </div>
                <div>
                  <p className="about__feature-title">Clean Code</p>
                  <p className="about__feature-desc">
                    We write clean, efficient, and maintainable code that ensures
                    your digital solutions are robust, scalable, and future-ready.
                  </p>
                </div>
              </div>
              <div className="about__feature">
                <div className="about__feature-icon">
                  <Icon name="modern-design" size={28} />
                </div>
                <div>
                  <p className="about__feature-title">Modern Design</p>
                  <p className="about__feature-desc">
                    Our designs combine creativity and usability, delivering modern,
                    intuitive interfaces that engage users and elevate your brand.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <Reveal as="section" className="stats">
        <div className="stats__inner">
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
      </Reveal>

      {/* CTA Banner */}
      <Reveal as="section" direction="scale" className="cta-banner">
        <div className="cta-banner__inner">
          <h2 className="cta-banner__title">
            Ready to <span className="accent">Transform</span> Your Business?
          </h2>
          <p className="cta-banner__text">
            Let's discuss your project and find the perfect solution for your needs.
          </p>
          <Button to="/contact" size="lg">
            Book Consultation
          </Button>
        </div>
      </Reveal>
    </>
  );
}
