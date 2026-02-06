import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { Work } from '../data/works';
import { useEffect } from 'react';
import { modalTransition, EASE } from '../lib/motion';
import { api } from '../lib/api-config';

interface WorkModalProps {
    work: Work | null;
    onClose: () => void;
}

export default function WorkModal({ work, onClose }: WorkModalProps) {

    useEffect(() => {
        if (work && work._id) {
            fetch(`${api.works.list()}/${work._id}/view`, { method: 'POST' })
                .catch(err => console.error('Error tracking view:', err));
        }
    }, [work]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {work && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/90 backdrop-blur-md"
                    />

                    <motion.div
                        variants={modalTransition}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-5xl bg-surface rounded-card shadow-premium overflow-hidden border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Image Side */}
                        <div className="w-full md:w-2/3 bg-black/40 overflow-hidden relative group">
                            <motion.img
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
                                src={work.imageSrc}
                                alt={work.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/3 p-10 flex flex-col h-full overflow-y-auto bg-surface/50 backdrop-blur-sm relative">
                            <motion.button
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </motion.button>

                            <div className="mt-6 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <h2 className="text-4xl font-black font-satoshi mb-3 tracking-tight">{work.title}</h2>
                                    <span className="text-[10px] font-black font-mono text-primary px-3 py-1 bg-primary/10 rounded-full uppercase tracking-widest border border-primary/20">
                                        {work.category}
                                    </span>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">About Project</h3>
                                    <p className="text-text-primary leading-relaxed text-base opacity-80">
                                        {work.description}
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {work.tags.map(tag => (
                                            <span key={tag} className="text-[11px] font-bold px-3 py-1 bg-white/5 border border-white/5 rounded-button text-text-muted/80 hover:text-white hover:border-white/20 transition-all duration-300">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Website Link Button */}
                                {work.websiteUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="pt-4"
                                    >
                                        <a
                                            href={work.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-button transition-all duration-300 hover:-translate-y-1 shadow-premium overflow-hidden"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                                            <ExternalLink size={16} />
                                            Visit Live Site
                                        </a>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
