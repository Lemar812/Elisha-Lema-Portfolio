import { motion } from 'framer-motion';
import type { Work } from '../data/works';
import { cn } from '../lib/utils';
import { Plus } from 'lucide-react';
import { EASE, staggerItem } from '../lib/motion';

interface WorkCardProps {
    work: Work;
    onClick: (work: Work) => void;
    className?: string;
}

export default function WorkCard({ work, onClick, className }: WorkCardProps) {
    return (
        <motion.div
            layout
            variants={staggerItem}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={cn("group relative cursor-pointer", className)}
            onClick={() => onClick(work)}
        >
            <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-surface border border-white/5 transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    src={work.imageSrc}
                    alt={work.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x600/111111/333333?text=${encodeURIComponent(work.title)}`;
                    }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                    >
                        <Plus className="w-6 h-6" />
                    </motion.div>
                </div>

                {/* Image shine */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
            </div>

            <div className="mt-5 space-y-2">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold font-satoshi text-text-primary group-hover:text-primary transition-colors duration-300 leading-snug">
                        {work.title}
                    </h3>
                    <span className="shrink-0 text-[10px] font-bold font-mono text-text-muted/60 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded uppercase tracking-wider">
                        {work.category}
                    </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">{work.description}</p>
            </div>
        </motion.div>
    );
}
