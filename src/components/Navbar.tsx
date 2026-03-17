import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
    ArrowRight,
    BadgeDollarSign,
    Briefcase,
    Home,
    Mail,
    Menu,
    MessageSquare,
    Settings,
    User,
    X,
    Zap,
} from 'lucide-react';
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

        return () => {
            document.body.style.overflow = 'unset';
        };
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
        closed: {
            x: '100%',
            transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
        open: {
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
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
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-0 right-0 top-0 z-50 h-[96px] md:h-[104px]"
            >
                <div className="mx-auto flex h-full w-full max-w-7xl items-center px-6">
                    <div className="flex w-full items-center gap-4 lg:gap-8">
                        <motion.a
                            href="#"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -1 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative hidden h-[58px] shrink-0 items-center whitespace-nowrap lg:flex"
                        >
                            <motion.span
                                aria-hidden="true"
                                animate={{ opacity: [0.04, 0.1, 0.04] }}
                                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -inset-x-3 -inset-y-2 rounded-full bg-primary/8 blur-2xl"
                            />
                            <motion.span
                                aria-hidden="true"
                                animate={{ scaleX: [0.2, 1, 1], opacity: [0, 0.7, 0.28] }}
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute bottom-1 left-0 h-px w-full origin-left rounded-full bg-gradient-to-r from-primary/0 via-primary/80 to-primary/0"
                            />
                            <span className="relative inline-flex items-baseline gap-2.5 leading-none">
                                <motion.span
                                    animate={{ opacity: 1 }}
                                    whileHover={{ x: -1 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    className="font-satoshi text-[1.42rem] font-black tracking-[0.11em] text-white"
                                >
                                    ELISHA
                                </motion.span>
                                <motion.span
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%'],
                                    }}
                                    whileHover={{ filter: 'brightness(1.08)' }}
                                    transition={{ duration: 3.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                                    className="bg-[linear-gradient(90deg,#7c3aed_0%,#c18bff_50%,#8f4dff_100%)] bg-[length:220%_100%] bg-clip-text font-satoshi text-[1.42rem] font-black tracking-[0.11em] text-transparent"
                                >
                                    LEMA
                                </motion.span>
                            </span>
                        </motion.a>

                        <a href="#" className="flex items-center whitespace-nowrap lg:hidden">
                            <span className="inline-flex items-baseline gap-2.5 leading-none">
                                <span className="font-satoshi text-xl font-black tracking-[0.1em] text-white">
                                    ELISHA
                                </span>
                                <span className="bg-[linear-gradient(90deg,#7c3aed_0%,#c18bff_50%,#8f4dff_100%)] bg-[length:220%_100%] bg-clip-text font-satoshi text-xl font-black tracking-[0.1em] text-transparent">
                                    LEMA
                                </span>
                            </span>
                        </a>

                        <div className="hidden min-w-0 flex-1 px-2 lg:flex lg:justify-center">
                            <div
                                className={cn(
                                    'inline-flex h-[60px] shrink-0 items-center justify-center rounded-full border px-5 backdrop-blur-xl transition-all duration-300',
                                    isScrolled
                                        ? 'border-white/10 bg-background/78 shadow-lg shadow-black/20'
                                        : 'border-white/10 bg-background/72'
                                )}
                            >
                                <div className="flex items-center gap-0.5">
                                    {navLinks.map((link) => (
                                        <motion.a
                                            key={link.name}
                                            href={link.href}
                                            onClick={(e) => scrollToSection(e, link.href)}
                                            whileHover="hover"
                                            initial="initial"
                                            className="group relative whitespace-nowrap rounded-full px-5 py-2.5 text-[0.95rem] font-bold text-text-muted transition-colors duration-300 hover:text-white"
                                        >
                                            <div className="relative z-10 flex items-center">
                                                <motion.span
                                                    variants={{
                                                        initial: { y: 0 },
                                                        hover: { x: 0 },
                                                    }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                                >
                                                    {link.name}
                                                </motion.span>
                                            </div>

                                            <motion.div
                                                variants={{
                                                    initial: { opacity: 0, scale: 0.96 },
                                                    hover: { opacity: 1, scale: 1 },
                                                }}
                                                className="absolute inset-0 rounded-full bg-white/5"
                                            />

                                            <motion.div
                                                variants={{
                                                    initial: { width: 0, opacity: 0 },
                                                    hover: { width: '28%', opacity: 1 },
                                                }}
                                                className="absolute bottom-1.5 left-[36%] h-[1.5px] rounded-full bg-primary shadow-[0_0_10px_#7C3AED]"
                                            />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="hidden w-[184px] shrink-0 justify-end lg:flex">
                            <motion.div
                                whileHover={{ y: -1 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                className="relative"
                            >
                                <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/18 blur-lg" />
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => scrollToSection(e as unknown as React.MouseEvent<HTMLAnchorElement>, '#contact')}
                                    className="relative min-w-[174px] rounded-full border border-primary/20 bg-gradient-to-r from-primary via-[#8b4ff8] to-[#9f67ff] px-7 py-3 font-semibold text-white shadow-[0_10px_26px_rgba(124,58,237,0.22)] hover:shadow-[0_14px_32px_rgba(124,58,237,0.28)]"
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
                                <span className="text-sm font-bold uppercase tracking-widest text-primary">
                                    Menu
                                </span>
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
                                        <ArrowRight
                                            className="-translate-x-4 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                            size={24}
                                        />
                                    </motion.a>
                                ))}
                            </nav>

                            <div className="mt-auto border-t border-white/5 pt-8">
                                <Button
                                    className="w-full py-4 text-lg"
                                    onClick={(e) => scrollToSection(e as unknown as React.MouseEvent<HTMLAnchorElement>, '#contact')}
                                >
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
