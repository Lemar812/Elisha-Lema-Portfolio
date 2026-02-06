import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { services } from '../data/works';
import { PenTool, Monitor, Palette, Code, Layers, Zap } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { staggerContainer, staggerItem, sectionReveal, EASE } from '../lib/motion';

const iconMap: Record<string, any> = {
    'PenTool': PenTool,
    'Monitor': Monitor,
    'Palette': Palette,
    'Code': Code,
    'Layers': Layers,
    'Zap': Zap
};

export default function Services() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section id="services" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
            <div className="container mx-auto">
                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeading title="Services" subtitle="Specialized skills tailored to your needs." centered />
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16"
                >
                    {services.map((service, index) => {
                        const Icon = iconMap[service.icon] || Zap;
                        return (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="relative p-8 md:p-10 rounded-card bg-surface/50 backdrop-blur-sm border border-white/5 hover:border-primary/30 transition-all duration-500 group overflow-hidden"
                            >
                                {/* Top corner accent */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 md:mb-8 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6 shadow-glow-sm">
                                    <Icon size={isMobile ? 28 : 32} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-satoshi font-bold mb-3 md:mb-4 text-white group-hover:text-primary transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-sm md:text-base text-text-muted leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                                    {service.description}
                                </p>

                                {/* Bottom glow */}
                                <div className="absolute inset-0 rounded-card bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-3xl" />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
