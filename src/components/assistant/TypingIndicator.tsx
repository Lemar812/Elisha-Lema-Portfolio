import { motion, useReducedMotion } from 'framer-motion';

export default function TypingIndicator() {
    const reduceMotion = useReducedMotion();

    return (
        <div className="flex justify-start" aria-live="polite" aria-label="Assistant is typing">
            <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3 py-2 text-text-muted backdrop-blur-xl">
                {[0, 1, 2].map((index) => (
                    <motion.span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full bg-primary/80"
                        animate={reduceMotion ? { opacity: [0.5, 0.9, 0.5] } : { opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
                        transition={{ duration: reduceMotion ? 1.1 : 0.9, repeat: Infinity, delay: index * 0.12 }}
                    />
                ))}
            </div>
        </div>
    );
}
