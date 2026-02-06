import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import FloatingTooltip from './FloatingTooltip';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
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
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <FloatingTooltip text="To the Sky 🚀" color="primary" position="top">
                        <button
                            onClick={scrollToTop}
                            className="w-14 h-14 rounded-2xl bg-primary text-white shadow-[0_10px_30px_rgba(124,58,237,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
                            aria-label="Scroll to top"
                        >
                            {/* Ring halo */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 scale-100 group-hover:scale-110 transition-transform duration-300" />

                            {/* Glow halo */}
                            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <ArrowUp className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" />
                        </button>
                    </FloatingTooltip>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
