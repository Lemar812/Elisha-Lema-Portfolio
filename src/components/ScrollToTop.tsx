import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useFloatingDockOffset } from '../hooks/useFloatingDockOffset';

interface ScrollToTopProps {
    stackedWithAssistant?: boolean;
}

const BASE_BOTTOM_PX = 24;
const STACK_GAP_PX = 88;

export default function ScrollToTop({ stackedWithAssistant = false }: ScrollToTopProps) {
    const [isVisible, setIsVisible] = useState(false);
    const reduceMotion = useReducedMotion();
    const footerLift = useFloatingDockOffset();

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 16 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed right-4 z-[119] sm:right-8"
                    style={{ bottom: `${BASE_BOTTOM_PX + footerLift + (stackedWithAssistant ? STACK_GAP_PX : 0)}px` }}
                >
                    <motion.button
                        type="button"
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                        whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                        className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-surface/86 text-white shadow-[0_16px_40px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition-colors hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.24),transparent_48%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.14),transparent_48%)]" />
                        <div className="absolute inset-[1px] rounded-[18px] bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent" />
                        <ArrowUp className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
