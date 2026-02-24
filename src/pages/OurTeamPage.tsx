import { motion } from 'framer-motion';
import { teamMembers } from '../data/teamData';
import { Icon } from '../components/ui/Icon';
import '../styles/team.css';

export function OurTeamPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 60, opacity: 0 },
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
        <div className="team-page">
            <section className="team-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="team-hero__title">Our<br />Core</h1>
                        <p className="team-hero__subtitle">
                            A collective of visionaries, architects, and technical experts
                            dedicated to breaking the standard paradigms of digital experience.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="team-grid">
                <div className="container">
                    <motion.div
                        className="team-grid__inner"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                    >
                        {teamMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                className="team-member"
                                variants={itemVariants}
                            >
                                <div className="team-member__image-wrap">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="team-member__image"
                                    />
                                </div>
                                <div className="team-member__content">
                                    <span className="team-member__label">Expertise</span>
                                    <h2 className="team-member__name">{member.name}</h2>
                                    <p className="team-member__role">{member.role}</p>
                                    <p className="team-member__bio">{member.bio}</p>

                                    <div className="team-member__socials">
                                        {member.socials.linkedin && (
                                            <a href={member.socials.linkedin} className="team-member__social-link" aria-label="LinkedIn">
                                                <Icon name="user" size={20} />
                                            </a>
                                        )}
                                        {member.socials.twitter && (
                                            <a href={member.socials.twitter} className="team-member__social-link" aria-label="Twitter">
                                                <Icon name="globe" size={20} />
                                            </a>
                                        )}
                                        {member.socials.github && (
                                            <a href={member.socials.github} className="team-member__social-link" aria-label="GitHub">
                                                <Icon name="code" size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default OurTeamPage;
