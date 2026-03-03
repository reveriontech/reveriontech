import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import '../styles/about.css';

type CountUpStatProps = {
    value: number;
    suffix?: string;
    delay?: number;
    className?: string;
};

function CountUpStatNumber({ value, suffix = '', delay = 0, className }: CountUpStatProps) {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLSpanElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    const formatter = useMemo(() => new Intl.NumberFormat(), []);

    const [display, setDisplay] = useState(() => (reduceMotion ? formatter.format(value) : '0'));

    useEffect(() => {
        if (reduceMotion) {
            setDisplay(formatter.format(value));
            return;
        }
        if (!isInView) return;

        const controls = animate(0, value, {
            duration: 1.6,
            delay,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => setDisplay(formatter.format(Math.round(latest))),
        });

        return () => controls.stop();
    }, [delay, formatter, isInView, reduceMotion, value]);

    if (reduceMotion) {
        return (
            <span ref={ref} className={className}>
                {display}
                {suffix}
            </span>
        );
    }

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'brightness(1)' }}
            animate={isInView ? { opacity: 1, y: 0, scale: [1, 1.08, 1], filter: ['brightness(1)', 'brightness(1.35)', 'brightness(1)'] } : undefined}
            transition={{ duration: 0.9, delay, times: [0, 0.45, 1], ease: [0.16, 1, 0.3, 1] }}
        >
            {display}
            {suffix}
        </motion.span>
    );
}

export function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <motion.h1
                        className="about-hero__title"
                        initial={{ clipPath: 'inset(100% 0 0 0)' }}
                        animate={{ clipPath: 'inset(0% 0 0 0)' }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        About Us
                    </motion.h1>
                </div>
            </section>

            {/* Intro Section - Asymmetric */}
            <section className="about-intro">
                <div className="container">
                    <div className="about-intro__grid">
                        <motion.div
                            className="about-intro__image-wrapper"
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                                alt="Our Team"
                                className="about-intro__image"
                            />
                        </motion.div>

                        <motion.div
                            className="about-intro__content"
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        >
                            <span className="about-intro__label">Identity</span>
                            <h2 className="about-intro__title">Breaking The Norm</h2>
                            <p className="about-intro__desc">
                                We are a creative collective dedicated to pushing the boundaries of
                                visual storytelling. Our approach is rooted in brutal honesty and
                                technical precision, ensuring every frame we produce is unforgettable.
                            </p>
                            <Button to="/contact" size="md" variant="primary">Initiate Contact</Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Skills & Stats Section */}
            <section className="about-skills-stats">
                <div className="container">
                    <div className="about-skills-stats__grid">
                        <motion.div
                            className="about-skills"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <motion.h2 variants={itemVariants} className="about-skills__title">Capabilities</motion.h2>
                            <motion.p variants={itemVariants} className="about-skills__desc">
                                Excellence is not an act, but a habit. We've refined our skills
                                over decades of relentless pursuit of quality.
                            </motion.p>

                            {[
                                { name: 'Technical Execution', val: 95 },
                                { name: 'Artistic Vision', val: 98 },
                                { name: 'Strategic Branding', val: 82 }
                            ].map((skill, idx) => (
                                <motion.div key={idx} variants={itemVariants} className="about-skill-item">
                                    <div className="about-skill-info">
                                        <span>{skill.name}</span>
                                        <span>{skill.val}%</span>
                                    </div>
                                    <div className="about-skill-bar-bg">
                                        <motion.div
                                            className="about-skill-bar-fill"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.val}%` }}
                                            transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="about-stats-grid">
                            {[
                                { label: 'Years Active', value: 12, suffix: '+' },
                                { label: 'Artifacts Built', value: 500, suffix: '+' },
                                { label: 'Core Partners', value: 34 },
                                { label: 'Design Awards', value: 12 }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    className="about-stat-card"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <CountUpStatNumber
                                        className="about-stat-number"
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        delay={0.15 + idx * 0.1}
                                    />
                                    <span className="about-stat-label">{stat.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="about-cta__label">Next Step</span>
                        <h2 className="about-cta__title">
                            Ready to shatter expectations?
                        </h2>
                        <Button to="/contact" size="lg" variant="primary">Start Project</Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
