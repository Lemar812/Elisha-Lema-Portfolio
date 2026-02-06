import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import { staggerContainer, staggerItem, sectionReveal, EASE } from '../lib/motion';
import { api } from '../lib/api-config';
import * as LucideIcons from 'lucide-react';
import { skills as fallbackSkills, Skill } from '../data/skills';
import {
    PhotoshopLogo,
    IllustratorLogo,
    CanvaLogo,
    ReactLogo,
    NodeLogo,
    TailwindLogo
} from './skills/SkillIcons';

const BRAND_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
    'Photoshop': PhotoshopLogo,
    'Illustrator': IllustratorLogo,
    'Canva': CanvaLogo,
    'React': ReactLogo,
    'Node': NodeLogo,
    'Tailwind': TailwindLogo,
};

export default function Skills() {
    const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
    const [, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadSkills = async () => {
            try {
                const res = await fetch(api.skills.list());
                if (!res.ok) throw new Error(`Failed to load skills: ${res.status}`);

                const data = await res.json();
                if (isMounted && Array.isArray(data)) {
                    setSkills(data);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) setSkills(fallbackSkills);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadSkills();

        return () => {
            isMounted = false;
        };
    }, []);
    return (
        <section id="skills" className="py-16 md:py-24 px-4 md:px-6 relative">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeading
                        title="My Skills"
                        subtitle="We put your ideas and thus your wishes in the form of a unique web project that inspires you and your customers."
                        centered
                    />
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mt-12 md:mt-16"
                >
                    {skills.map((skill) => {
                        const BrandIcon = BRAND_ICONS[skill.icon];
                        const LucideIcon = (LucideIcons as any)[skill.icon] || LucideIcons.Code2;

                        return (
                            <motion.div
                                key={skill._id || skill.id}
                                variants={staggerItem}
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                className="group relative p-6 rounded-card bg-surface border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-premium hover:shadow-[0_10px_40px_rgba(124,58,237,0.15)]"
                                style={{
                                    borderColor: skill.color ? `${skill.color}20` : undefined
                                }}
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 bg-white/5 group-hover:bg-white/10 overflow-hidden p-3"
                                        style={{
                                            boxShadow: skill.color ? `0 0 20px ${skill.color}20` : undefined,
                                        }}
                                    >
                                        {BrandIcon ? (
                                            <BrandIcon size={32} />
                                        ) : (
                                            <LucideIcon size={28} className="md:w-8 md:h-8" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-center font-bold text-white mb-4 text-xs md:text-sm tracking-wide">
                                    {skill.name}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold font-mono text-text-muted/60 uppercase tracking-widest">{skill.percentage}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.percentage}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, delay: 0.2, ease: EASE }}
                                            className="h-full rounded-full"
                                            style={{
                                                background: skill.color
                                                    ? `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`
                                                    : skill.category === 'design'
                                                        ? 'linear-gradient(90deg, #7C3AED, #7C3AED88)'
                                                        : 'linear-gradient(90deg, #22D3EE, #22D3EE88)'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Hover glow effect */}
                                <div
                                    className="absolute inset-0 rounded-card opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-2xl"
                                    style={{
                                        backgroundColor: skill.color || (skill.category === 'design' ? '#7C3AED' : '#22D3EE')
                                    }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
