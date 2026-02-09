import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';

import { Home, Zap, Briefcase, Settings, User, MessageSquare, Mail } from 'lucide-react';

const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Skills', href: '#skills', icon: Zap },
    { name: 'Works', href: '#works', icon: Briefcase },
    { name: 'Services', href: '#services', icon: Settings },
    { name: 'About', href: '#about', icon: User },
    { name: 'Testimonials', href: '#testimonials', icon: MessageSquare },
    { name: 'Contact', href: '#contact', icon: Mail },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock scroll when the mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    const menuVariants: Variants = {
        closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    const linkVariants = {
        closed: { x: 50, opacity: 0 },
        open: (i: number) => ({
            x: 0,
            opacity: 1,
            transition: { delay: i * 0.1 + 0.2 }
        })
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-0",
                    isScrolled ? "py-3 md:py-4" : "py-5 md:py-6"
                )}
            >
                <div className={cn(
                    "container mx-auto px-4 md:px-8 flex items-center justify-between rounded-full transition-all duration-500",
                    isScrolled ? "bg-background/60 backdrop-blur-xl border border-white/5 shadow-lg shadow-black/20 py-2" : "py-0"
                )}>
                    <motion.a
                        href="#"
                        className="group relative flex items-center overflow-hidden"
                        whileHover="hover"
                    >
                        <div className="flex relative py-1">
                            {"ELISHA LEMA".split("").map((letter, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "relative flex flex-col h-[28px] md:h-[32px] overflow-hidden",
                                        letter === " " ? "w-2 md:w-3" : ""
                                    )}
                                >
                                    {letter === " " ? (
                                        <span className="sr-only"> </span>
                                    ) : (
                                        <>
                                    <motion.span
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{
                                            y: [0, -40, -40, 0],
                                            opacity: [1, 0, 0, 1]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            delay: 2 + (i * 0.1),
                                            times: [0, 0.1, 0.9, 1],
                                            ease: "easeInOut"
                                        }}
                                        className="text-xl md:text-2xl font-black font-satoshi tracking-tighter text-white"
                                    >
                                        {letter}
                                    </motion.span>
                                    <motion.span
                                        initial={{ y: 0, opacity: 0 }}
                                        animate={{
                                            y: [0, -28, -28, 0],
                                            opacity: [0, 1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            delay: 2 + (i * 0.1),
                                            times: [0, 0.1, 0.9, 1],
                                            ease: "easeInOut"
                                        }}
                                        className="absolute top-[28px] md:top-[32px] left-0 text-xl md:text-2xl font-black font-satoshi tracking-tighter text-primary opacity-0"
                                    >
                                        {letter}
                                    </motion.span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.a>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/[0.03] backdrop-blur-xl rounded-full border border-white/5">
                        {navLinks.map((link) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                whileHover="hover"
                                initial="initial"
                                className="px-5 py-2 rounded-full text-sm font-bold text-text-muted hover:text-white transition-all duration-300 relative group"
                            >
                                <div className="relative z-10 flex items-center gap-2">
                                    <motion.div
                                        variants={{
                                            initial: { y: 15, opacity: 0, scale: 0.6, rotate: -20 },
                                            hover: { y: 0, opacity: 1, scale: 1, rotate: 0 }
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <link.icon size={15} className="text-primary" />
                                    </motion.div>
                                    <motion.span
                                        variants={{
                                            initial: { x: -4 },
                                            hover: { x: 0 }
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        {link.name}
                                    </motion.span>
                                </div>

                                {/* Hover pill */}
                                <motion.div
                                    variants={{
                                        initial: { opacity: 0, scale: 0.95 },
                                        hover: { opacity: 1, scale: 1 }
                                    }}
                                    className="absolute inset-0 bg-white/5 rounded-full -z-0"
                                />

                                {/* Underline glow */}
                                <motion.div
                                    variants={{
                                        initial: { width: 0, opacity: 0 },
                                        hover: { width: "30%", opacity: 1 }
                                    }}
                                    className="absolute bottom-1.5 left-[35%] h-[1.5px] bg-primary rounded-full shadow-[0_0_10px_#7C3AED]"
                                />
                            </motion.a>
                        ))}
                    </div>

                    <div className="hidden lg:block">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => scrollToSection(e as any, '#contact')}
                            className="rounded-full shadow-glow-sm hover:shadow-glow-md px-6 py-2.5"
                        >
                            Let's Work
                        </Button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="lg:hidden w-10 h-10 flex items-center justify-center text-text-primary bg-white/5 rounded-full border border-white/10 active:scale-90 transition-all"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 right-0 bottom-0 z-[70] w-[80%] max-w-[400px] bg-surface border-l border-white/5 p-8 flex flex-col md:hidden"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-sm font-mono text-primary uppercase tracking-widest font-bold">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center text-text-primary bg-white/5 rounded-full border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.name}
                                        custom={i}
                                        variants={linkVariants}
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        className="text-4xl font-satoshi font-bold text-text-primary py-4 hover:text-primary transition-colors flex items-center justify-between group"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" size={24} />
                                    </motion.a>
                                ))}
                            </nav>

                            <div className="mt-auto pt-8 border-t border-white/5">
                                <Button className="w-full py-4 text-lg" onClick={(e) => scrollToSection(e as any, '#contact')}>
                                    Let's Work Together
                                </Button>
                                <div className="mt-8 flex gap-4 justify-center">
                                    {/* Add social shortcuts here if we want them */}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
