import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Mail, ArrowRight, Heart, Handshake } from 'lucide-react';
import Button from './Button';
import FloatingTooltip from './FloatingTooltip';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const footerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: footerRef,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.15, 0.25]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer ref={footerRef} className="relative pt-16 md:pt-32 pb-12 overflow-hidden">
            {/* Large background label */}
            <motion.div
                style={{ x: "-50%", y, opacity, scale }}
                className="absolute top-0 left-1/2 select-none pointer-events-none z-0"
            >
                <h2
                    className="text-[14vw] md:text-[12vw] font-black font-satoshi leading-none whitespace-nowrap text-white/[0.12] tracking-tighter text-center"
                    style={{
                        WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)',
                        textShadow: '0 0 80px rgba(124, 58, 237, 0.6), 0 0 30px rgba(124, 58, 237, 0.3)',
                    }}
                >
                    ELISHA LEMA
                </h2>
            </motion.div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Main footer card */}
                <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

                        {/* Left column: call to action */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="space-y-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                    <Mail size={20} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold font-satoshi text-white leading-tight">
                                    Want to make sure I am the right fit? <br className="hidden md:block" />
                                    Book a discovery call!
                                </h3>
                                <p className="text-text-muted">
                                    Find out how you can up your design game, forever.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-4">
                                <Button
                                    initial="initial"
                                    whileHover="hover"
                                    className="w-full sm:w-auto sm:flex-none bg-primary hover:bg-primary/95 text-white font-bold h-14 px-10 group/btn rounded-full !overflow-visible relative whitespace-nowrap"
                                    onClick={() => window.open('https://wa.me/message/5VKY4GHMGJ65J1', '_blank')}
                                >
                                    <div className="relative flex items-center justify-center w-32">
                                        {/* Default state */}
                                        <div className="overflow-hidden h-6 flex items-center justify-center">
                                            <motion.div
                                                variants={{
                                                    initial: { y: 0, opacity: 1 },
                                                    hover: { y: -40, opacity: 0 }
                                                }}
                                                className="flex items-center gap-2 whitespace-nowrap"
                                            >
                                                Book a call <ArrowRight size={18} />
                                            </motion.div>
                                        </div>

                                        {/* Floating handshake state */}
                                        <motion.div
                                            variants={{
                                                initial: { y: 40, opacity: 0, scale: 0.5 },
                                                hover: {
                                                    y: -15, // stronger float
                                                    opacity: 1,
                                                    scale: 1.1,
                                                    transition: { type: "spring", stiffness: 400, damping: 20 }
                                                }
                                            }}
                                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                                        >
                                            <motion.div
                                                animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="flex flex-col items-center gap-1"
                                            >
                                                <div className="bg-secondary p-2.5 rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.7)] border border-white/10">
                                                    <Handshake size={24} className="text-background" />
                                                </div>
                                                <span className="font-black uppercase tracking-[0.2em] text-[10px] text-white font-black">Partner Up</span>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto sm:flex-none h-14 px-8 border-white/10 hover:border-white/20 whitespace-nowrap"
                                    onClick={(e) => scrollToSection(e as any, '#works')}
                                >
                                    See my work
                                </Button>
                            </div>
                        </div>

                        {/* Nav columns */}
                        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">

                            {/* Site links */}
                            <div className="space-y-6">
                                <h4 className="text-white font-bold font-satoshi text-lg">Navigation</h4>
                                <ul className="space-y-4">
                                    {['Home', 'Skills', 'Works', 'Services', 'About'].map((item) => (
                                        <li key={item}>
                                            <a
                                                href={`#${item.toLowerCase()}`}
                                                onClick={(e) => scrollToSection(e, `#${item.toLowerCase()}`)}
                                                className="text-text-muted hover:text-white transition-colors"
                                            >
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Social links */}
                            <div className="space-y-6">
                                <h4 className="text-white font-bold font-satoshi text-lg">Connect</h4>
                                <ul className="space-y-4">
                                    {[
                                        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/elisha-lema-46424a223', color: 'secondary' as const },
                                        { name: 'Upwork', url: 'https://www.upwork.com/freelancers/~01f03c531eb6a7e049?mp_source=share', color: 'highlight' as const },
                                        { name: 'Instagram', url: 'https://www.instagram.com/elisha.steven.lema?igsh=MWhwYTQwNW9pcGgwMA==', color: 'primary' as const },
                                        { name: 'GitHub', url: 'https://github.com/Lemar812', color: 'primary' as const },
                                        { name: 'WhatsApp', url: 'https://wa.me/message/5VKY4GHMGJ65J1', color: 'highlight' as const }
                                    ].map((social) => (
                                        <li key={social.name}>
                                            <FloatingTooltip text={`Visit ${social.name}`} color={social.color} position="top" className="inline-block">
                                                <a
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-text-muted hover:text-white transition-colors"
                                                >
                                                    {social.name}
                                                </a>
                                            </FloatingTooltip>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact details */}
                            <div className="space-y-6">
                                <h4 className="text-white font-bold font-satoshi text-lg">Contact</h4>
                                <div className="space-y-4">
                                    <a href="mailto:elishalema12@gmail.com" className="block text-text-muted hover:text-white transition-colors break-all">
                                        elishalema12@gmail.com
                                    </a>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs h-10 border-white/5 hover:bg-white/5"
                                            onClick={() => window.open('https://wa.me/message/5VKY4GHMGJ65J1', '_blank')}
                                        >
                                            Chat with me
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Attribution */}
                            <div className="space-y-6">
                                <h4 className="text-white font-bold font-satoshi text-lg">About</h4>
                                <div className="space-y-4">
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        Made with <Heart size={12} className="inline text-primary fill-primary mx-1" /> by <br />
                                        <span className="text-white font-medium">Elisha Lema</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
                    <p className="text-text-muted text-sm font-mono">
                        © {currentYear} ELISHA LEMA. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-text-muted">
                        <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

