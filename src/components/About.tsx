import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { staggerItem, EASE, staggerContainer } from '../lib/motion';
import FloatingTooltip from './FloatingTooltip';

const skillsData = [
    { name: "React", color: "secondary" as const, category: "Frontend" },
    { name: "TypeScript", color: "secondary" as const, category: "Logic" },
    { name: "TailwindCSS", color: "secondary" as const, category: "Styles" },
    { name: "Framer Motion", color: "primary" as const, category: "Motion" },
    { name: "Node.js", color: "primary" as const, category: "Backend" },
    { name: "Adobe Illustrator", color: "highlight" as const, category: "Design" },
    { name: "Adobe Photoshop", color: "highlight" as const, category: "Design" },
    { name: "Canva", color: "highlight" as const, category: "Design" },
    { name: "Brand Identity", color: "highlight" as const, category: "Design" }
];

export default function About() {
    const profile = {
        bio: "I'm Elisha Lema, a passionate designer and developer from Tanzania. My journey began in a small digital studio where I discovered the magic of blending aesthetics with functionality. What started as a curious interest in design evolved into a full-fledged career where I now help businesses transform their digital presence.",
        experience: '2+ Years',
        location: 'Tanzania'
    };

    return (
        <section id="about" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl 2xl:max-w-7xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                {/* Photo block */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative order-2 lg:order-1 group"
                >
                    <div className="aspect-[3/4] sm:aspect-square lg:aspect-[3/4] rounded-card overflow-hidden relative border border-white/10 group-hover:border-primary/30 transition-colors duration-700 shadow-premium max-w-lg mx-auto lg:max-w-none">
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 1.2, ease: EASE }}
                            src="works/me.jpeg"
                            alt="About Me"
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 md:right-8 text-white">
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="font-satoshi font-black text-2xl md:text-3xl tracking-tight"
                            >
                                Based in the <span className="text-primary">{profile.location || 'Digital World'}</span>
                            </motion.p>
                            <motion.p
                                initial={{ y: 10, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-white/60 font-medium uppercase tracking-[0.2em] text-[10px] mt-2"
                            >
                                {profile.experience ? `${profile.experience} Experience` : 'Available Worldwide'}
                            </motion.p>
                        </div>
                    </div>

                    {/* Small decorative glow */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 blur-3xl -z-10 group-hover:bg-primary/40 transition-colors duration-700 hidden md:block" />
                </motion.div>

                {/* Text block */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="order-1 lg:order-2 space-y-6 md:space-y-8"
                >
                    <motion.div variants={staggerItem}>
                        <SectionHeading title="Behind the Pixel" className="mb-6 md:mb-0" />
                    </motion.div>

                    <div className="space-y-4 md:space-y-6 text-base md:text-lg text-text-muted leading-relaxed">
                        <motion.p variants={staggerItem}>
                            {profile.bio || "I'm Elisha Lema, a passionate designer and developer from Tanzania. My journey began in a small digital studio where I discovered the magic of blending aesthetics with functionality. What started as a curious interest in design evolved into a full-fledged career where I now help businesses transform their digital presence."}
                        </motion.p>
                        <motion.p variants={staggerItem}>
                            Over the years, I've learned that great design isn't just about making things look beautiful—it's about solving real problems for real people. I've worked with startups, established businesses, and creative agencies, helping them build brands that resonate with their audiences. From crafting brand identities that tell compelling stories to developing responsive web applications that perform flawlessly, I bring both artistry and technical precision to every project.
                        </motion.p>
                        <motion.p variants={staggerItem}>
                            My approach is collaborative and user-centric. I believe in understanding your vision, your audience, and your goals before diving into design. Whether it's a logo that becomes iconic, a website that converts visitors into customers, or a complete brand overhaul, I'm committed to delivering excellence that exceeds expectations.
                        </motion.p>

                        <motion.div variants={staggerItem} className="pt-6 md:pt-8">
                            <h3 className="font-satoshi font-black text-white mb-4 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs opacity-50">Tech Stack & Tools</h3>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {skillsData.map(skill => (
                                    <FloatingTooltip key={skill.name} text={skill.category} color={skill.color} position="top">
                                        <span className="px-3 md:px-4 py-1.5 md:py-2 bg-surface/50 backdrop-blur-sm border border-white/5 rounded-button text-[10px] md:text-[11px] font-bold font-mono text-primary uppercase tracking-wider hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                                            {skill.name}
                                        </span>
                                    </FloatingTooltip>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
