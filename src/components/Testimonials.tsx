import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { sectionReveal } from '../lib/motion';

const testimonials = [
    {
        name: "Samson Lotha",
        role: "Founder & Owner\nMaasai Adventures",
        text: "The design work helped Maasai Adventures present our safari experiences in a more professional and attractive way. The visuals communicate our brand much better and give potential travelers a clear sense of the adventure we offer."
    },
    {
        name: "Alexander Demetro",
        role: "Founder & Owner\nA & B Accessories",
        text: "The branding and promotional designs made a big difference for our business. Our products are now presented with a cleaner and more professional visual identity, which has helped us build stronger trust with customers."
    },
    {
        name: "Baltazary Twati",
        role: "Founder & Managing Director\nTanzania Smile Safaris",
        text: "The design work helped Tanzania Smile Safaris present itself with much better clarity. It strengthened how we communicate our safari experience and improved our overall brand image."
    },
    {
        name: "George Macha",
        role: "Macha Stores Owner",
        text: "The logo and business presentation gave Macha Stores a stronger identity. The brand now looks cleaner, more credible, and better aligned with the kind of customers we want to attract."
    },
    {
        name: "Jeremiah Lema",
        role: "CEO & Founder\nOur Destiny",
        text: "The logo design captured the vision of Our Destiny perfectly. It gave our brand a clear identity that represents our mission and helps us present ourselves confidently to our audience."
    }
];

// Duplicate list for smooth scrolling
const duplicatedTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section id="testimonials" className="py-16 md:py-24 px-0 md:px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl 2xl:max-w-7xl px-4 md:px-0">
                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeading
                        title="Client Stories"
                        subtitle="Feedback grounded in real branding, promotional, and business presentation work."
                        centered
                    />
                </motion.div>
            </div>

            <div className="mt-12 md:mt-16 relative w-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-6 md:gap-8 w-max px-4"
                    animate={{ x: [0, -1 * (320 + 24) * testimonials.length] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 40,
                            ease: "linear",
                        },
                    }}
                    whileHover={{ animationPlayState: "paused" }}
                >
                    {duplicatedTestimonials.map((t, i) => (
                        <div
                            key={i}
                            className="w-[280px] sm:w-[320px] md:w-[450px] min-h-[320px] md:min-h-[360px] p-7 sm:p-8 md:p-10 rounded-card bg-surface/40 backdrop-blur-sm border border-white/5 flex flex-col select-none group hover:border-primary/30 hover:shadow-premium hover:shadow-[0_20px_50px_rgba(124,58,237,0.1)] transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-6 right-6 text-primary opacity-5 group-hover:opacity-20 transition-opacity duration-500">
                                <svg width={isMobile ? 40 : 60} height={isMobile ? 40 : 60} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9125 16 16.0171 16H19.0171C20.1217 16 21.0171 15.1046 21.0171 14V9C21.0171 7.89543 20.1217 7 19.0171 7H16.0171C14.9125 7 14.0171 7.89543 14.0171 9V14M4.0171 21L4.0171 18C4.0171 16.8954 4.91253 16 6.0171 16H9.0171C10.1217 16 11.0171 15.1046 11.0171 14V9C11.0171 7.89543 10.1217 7 9.0171 7H6.0171C4.91253 7 4.0171 7.89543 4.0171 9V14" />
                                </svg>
                            </div>

                            <div className="relative z-10 flex-1 pb-6 md:pb-8">
                                <p className="text-base md:text-xl text-text-muted leading-[1.75] md:leading-[1.7] group-hover:text-white transition-colors duration-300 italic font-medium">
                                    "{t.text}"
                                </p>
                            </div>

                            <div className="mt-auto flex items-center gap-4 border-t border-white/5 pt-5 md:pt-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px] shrink-0">
                                    <div className="w-full h-full rounded-full bg-surface flex items-center justify-center font-bold text-base md:text-lg text-white">
                                        {t.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-white font-black tracking-tight text-base md:text-lg group-hover:text-primary transition-colors">{t.name}</h4>
                                    <p className="mt-1 text-text-muted text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 whitespace-pre-line leading-relaxed">
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
