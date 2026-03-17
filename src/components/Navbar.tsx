import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowRight, BadgeDollarSign, Briefcase, Home, Mail, Menu, MessageSquare, Settings, User, X, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';

const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Skills', href: '#skills', icon: Zap },
    { name: 'Works', href: '#works', icon: Briefcase },
    { name: 'Services', href: '#services', icon: Settings },
    { name: 'Pricing', href: '#pricing', icon: BadgeDollarSign },
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

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
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
        closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    const linkVariants = {
        closed: { x: 50, opacity: 0 },
        open: (i: number) => ({
            x: 0,
            opacity: 1,
            transition: { delay: i * 0.1 + 0.2 },
        }),
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn('fixed left-0 right-0 top-0 z-50 w-full transition-all duration-500', isScrolled ? 'py-3 md:py-4' : 'py-5 md:py-6')}
            >
                <div className="mx-auto w-full max-w-7xl px-6">
                    <div
                        className={cn(
                            'flex h-[72px] w-full items-center rounded-full transition-all duration-500 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6 xl:gap-8',
                            isScrolled ? 'border border-white/5 bg-background/60 px-4 shadow-lg shadow-black/20 backdrop-blur-xl md:px-6' : 'px-0'
                        )}
                    >
                        <motion.a
                            href="#"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ x: 1 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative flex shrink-0 items-center whitespace-nowrap"
                        >
                            <motion.span
                                aria-hidden="true"
                                animate={{ opacity: [0.04, 0.1, 0.04] }}
                                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute inset-x-3 inset-y-1 rounded-full bg-primary/10 blur-lg"
                            />
                            <div className="relative inline-flex min-w-fit items-baseline gap-2 py-1 leading-none">
                                <span className="text-xl font-black tracking-[0.1em] text-white md:text-2xl">
                                    ELISHA
                                </span>
                                <motion.span
                                    animate={{ textShadow: ['0 0 0 rgba(124,58,237,0)', '0 0 12px rgba(124,58,237,0.24)', '0 0 0 rgba(124,58,237,0)'] }}
                                    whileHover={{ color: '#9f67ff' }}
                                    transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                                    className="text-xl font-black tracking-[0.1em] text-primary md:text-2xl"
                                >
                                    LEMA
                                </motion.span>
                            </div>
                        </motion.a>

                        <div className="mx-auto hidden min-w-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] p-1.5 backdrop-blur-xl lg:flex lg:justify-self-center">
                            {navLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    whileHover="hover"
                                    initial="initial"
                                    className="group relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-text-muted transition-all duration-300 hover:text-white xl:px-5"
                                >
                                    <div className="relative z-10 flex items-center gap-2">
                                        <motion.div
                                            variants={{
                                                initial: { y: 15, opacity: 0, scale: 0.6, rotate: -20 },
                                                hover: { y: 0, opacity: 1, scale: 1, rotate: 0 },
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                        >
                                            <link.icon size={15} className="text-primary" />
                                        </motion.div>
                                        <motion.span
                                            variants={{
                                                initial: { x: -4 },
                                                hover: { x: 0 },
                                            }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        >
                                            {link.name}
                                        </motion.span>
                                    </div>

                                    <motion.div
                                        variants={{
                                            initial: { opacity: 0, scale: 0.95 },
                                            hover: { opacity: 1, scale: 1 },
                                        }}
                                        className="absolute inset-0 -z-0 rounded-full bg-white/5"
                                    />

                                    <motion.div
                                        variants={{
                                            initial: { width: 0, opacity: 0 },
                                            hover: { width: '30%', opacity: 1 },
                                        }}
                                        className="absolute bottom-1.5 left-[35%] h-[1.5px] rounded-full bg-primary shadow-[0_0_10px_#7C3AED]"
                                    />
                                </motion.a>
                            ))}
                        </div>

                        <div className="ml-auto hidden shrink-0 lg:ml-0 lg:block lg:justify-self-end">
                            <motion.div whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 320, damping: 24 }} className="relative">
                                <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/12 blur-md" />
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => scrollToSection(e as unknown as React.MouseEvent<HTMLAnchorElement>, '#contact')}
                                    className="min-w-[144px] rounded-full border border-primary/25 bg-gradient-to-r from-primary via-primary to-primary/90 px-6 py-2.5 font-semibold tracking-[0.02em] text-white shadow-[0_10px_24px_rgba(124,58,237,0.22)] hover:shadow-[0_14px_28px_rgba(124,58,237,0.28)]"
                                >
                                    Let&apos;s Work
                                </Button>
                            </motion.div>
                        </div>

                        <button
                            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-primary transition-all active:scale-90 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

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
                            className="fixed bottom-0 right-0 top-0 z-[70] flex w-[80%] max-w-[400px] flex-col border-l border-white/5 bg-surface p-8 md:hidden"
                        >
                            <div className="mb-12 flex items-center justify-between">
                                <span className="text-sm font-bold uppercase tracking-widest text-primary">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-primary"
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
                                        className="group flex items-center justify-between py-4 text-4xl font-bold text-text-primary transition-colors hover:text-primary"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="-translate-x-4 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" size={24} />
                                    </motion.a>
                                ))}
                            </nav>

                            <div className="mt-auto border-t border-white/5 pt-8">
                                <Button className="w-full py-4 text-lg" onClick={(e) => scrollToSection(e as unknown as React.MouseEvent<HTMLAnchorElement>, '#contact')}>
                                    Let&apos;s Work Together
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
