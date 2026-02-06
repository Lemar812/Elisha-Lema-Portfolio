import { motion } from 'framer-motion';
import Button from './Button';
import { ArrowRight, Download, Github, Linkedin, Instagram, MessageCircle, Handshake } from 'lucide-react';
import UpworkIcon from './icons/UpworkIcon';
import { staggerContainer, staggerItem, EASE } from '../lib/motion';
import { stats } from '../data/skills';

import FloatingTooltip from './FloatingTooltip';

export default function Hero() {

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-28 md:pt-20 px-4 md:px-6 relative overflow-hidden">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-16 md:mb-20">

                    {/* Left Column - Content */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1 lg:pr-2 lg:pl-10 max-w-xl lg:max-w-none"
                    >
                        <motion.div variants={staggerItem} className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-satoshi leading-[1.1] text-white tracking-tight">
                                I am <span className="text-primary">Elisha Lema</span>
                            </h1>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-satoshi text-text-muted">
                                Graphic Designer <span className="text-secondary">+</span> Developer
                            </h2>
                        </motion.div>

                        <motion.p variants={staggerItem} className="text-base md:text-lg text-text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            I break down complex user experience problems to create intuitive, focused solutions that connect with people.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button
                                initial="initial"
                                whileHover="hover"
                                className="w-full sm:w-auto px-10 py-5 text-base group/btn bg-primary hover:bg-primary/95 transition-all duration-500 rounded-full !overflow-visible relative"
                                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <div className="relative flex items-center justify-center min-w-[120px]">
                                    {/* Default State - Clipped */}
                                    <div className="overflow-hidden h-6 flex items-center justify-center">
                                        <motion.div
                                            variants={{
                                                initial: { y: 0, opacity: 1 },
                                                hover: { y: -40, opacity: 0 }
                                            }}
                                            className="flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <span className="font-bold">Hire Me</span>
                                            <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                        </motion.div>
                                    </div>

                                    {/* God-Tier Floating Handshake State */}
                                    <motion.div
                                        variants={{
                                            initial: { y: 40, opacity: 0, scale: 0.5 },
                                            hover: {
                                                y: -12, // Float UP outside the box
                                                opacity: 1,
                                                scale: 1.1,
                                                transition: {
                                                    y: { type: "spring", stiffness: 400, damping: 20 },
                                                    opacity: { duration: 0.2 }
                                                }
                                            }
                                        }}
                                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                                    >
                                        <motion.div
                                            animate={{
                                                y: [0, -6, 0],
                                                rotate: [0, 5, -5, 0],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <div className="bg-secondary p-2 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.6)] border border-white/20">
                                                <Handshake size={24} className="text-background" />
                                            </div>
                                            <span className="font-black uppercase tracking-[0.2em] text-[10px] text-white drop-shadow-lg">Let's Build</span>
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Animated Background Glow on Hover */}
                                <motion.div
                                    variants={{
                                        initial: { opacity: 0, scale: 0.5 },
                                        hover: { opacity: 1, scale: 1.2 }
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-primary via-secondary/40 to-primary opacity-0 group-hover/btn:opacity-100 -z-10 blur-2xl transition-all duration-700"
                                />
                            </Button>
                            <motion.a
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                href="/works/cv.pdf"
                                download="Elisha_Lema_CV.pdf"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-button border border-white/10 bg-surface/50 backdrop-blur-sm text-white font-medium hover:border-white/20 transition-all duration-300 w-full sm:w-auto text-base"
                            >
                                <Download className="mr-2 w-4 h-4" />
                                Download CV
                            </motion.a>
                        </motion.div>

                        {/* Social Icons */}
                        <motion.div variants={staggerItem} className="flex gap-4 justify-center lg:justify-start pt-2">
                            {[
                                { icon: Github, href: "https://github.com/Lemar812", color: "hover:text-primary hover:border-primary/50", label: "GitHub", tooltipColor: "primary" as const },
                                { icon: Linkedin, href: "https://www.linkedin.com/in/elisha-lema-46424a223", color: "hover:text-secondary hover:border-secondary/50", label: "LinkedIn", tooltipColor: "secondary" as const },
                                { icon: UpworkIcon, href: "https://www.upwork.com/freelancers/~01f03c531eb6a7e049?mp_source=share", color: "hover:text-highlight hover:border-highlight/50", label: "Upwork", tooltipColor: "highlight" as const },
                                { icon: Instagram, href: "https://www.instagram.com/elisha.steven.lema?igsh=MWhwYTQwNW9pcGgwMA==", color: "hover:text-primary hover:border-primary/50", label: "Instagram", tooltipColor: "primary" as const },
                                { icon: MessageCircle, href: "https://wa.me/message/5VKY4GHMGJ65J1", color: "hover:text-highlight hover:border-highlight/50", label: "WhatsApp", tooltipColor: "highlight" as const }
                            ].map((item, i) => (
                                <FloatingTooltip key={i} text={item.label} color={item.tooltipColor} position="bottom">
                                    <motion.a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.label}
                                        whileHover={{ y: -4, scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-11 md:w-12 h-11 md:h-12 rounded-full border border-white/10 bg-surface/50 backdrop-blur-sm flex items-center justify-center text-text-muted transition-colors duration-300 ${item.color}`}
                                    >
                                        <item.icon size={20} />
                                    </motion.a>
                                </FloatingTooltip>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Portrait */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-center order-1 lg:order-2 lg:pl-2 lg:-ml-4"
                        style={{ perspective: 1200 }}
                    >
                        <motion.div
                            animate={{
                                rotateY: [-5, 5, -5],
                                rotateX: [3, -3, 3],
                                y: [0, -10, 0]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative w-[280px] h-[360px] sm:w-[320px] sm:h-[420px] md:w-[450px] md:h-[600px] group"
                        >
                            {/* Premium Glow effect */}
                            <motion.div
                                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-secondary/15 to-primary/20 blur-2xl md:blur-3xl group-hover:scale-110 transition-all duration-700"
                            />

                            {/* Image container with tilt */}
                            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-surface/50 backdrop-blur-sm overflow-hidden transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-[0_0_80px_rgba(124,58,237,0.25)]">
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.8, ease: EASE }}
                                    src="works/me.jpeg"
                                    alt="Elisha Lema - Graphic Designer and Developer"
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80';
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pt-12 border-t border-white/5"
                >
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            variants={staggerItem}
                            className="text-center group p-4 md:p-0"
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-satoshi text-white mb-1 md:mb-2 group-hover:text-primary transition-colors duration-500">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm text-text-muted font-medium uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
