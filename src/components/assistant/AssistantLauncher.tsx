import { motion, useReducedMotion } from 'framer-motion';
import { BotMessageSquare, X } from 'lucide-react';

interface AssistantLauncherProps {
    open: boolean;
    onToggle: () => void;
}

export default function AssistantLauncher({ open, onToggle }: AssistantLauncherProps) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onToggle}
            aria-label={open ? 'Close portfolio assistant' : 'Open portfolio assistant'}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="portfolio-assistant-panel"
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 right-4 z-[121] flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-surface/80 text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-8 sm:right-28"
        >
            <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-primary/18 via-white/[0.02] to-secondary/12" />
            <div className="absolute -inset-1 -z-10 rounded-[26px] bg-primary/15 blur-xl" />
            <span className="relative">
                {open ? <X size={22} /> : <BotMessageSquare size={22} />}
            </span>
        </motion.button>
    );
}
