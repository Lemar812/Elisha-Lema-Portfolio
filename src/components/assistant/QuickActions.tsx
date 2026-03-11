import { motion, useReducedMotion } from 'framer-motion';
import type { QuickAction } from '../../lib/assistantTypes';

interface QuickActionsProps {
    actions: QuickAction[];
    disabled?: boolean;
    onSelect: (action: QuickAction) => void;
}

export default function QuickActions({ actions, disabled, onSelect }: QuickActionsProps) {
    const reduceMotion = useReducedMotion();

    return (
        <div className="flex flex-wrap gap-2" aria-label="Quick assistant actions">
            {actions.map((action) => (
                <motion.button
                    key={action.id}
                    type="button"
                    whileHover={reduceMotion || disabled ? undefined : { y: -1 }}
                    whileTap={reduceMotion || disabled ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    disabled={disabled}
                    onClick={() => onSelect(action)}
                    aria-label={`Quick action: ${action.label}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:border-primary/35 hover:bg-primary/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    {action.label}
                </motion.button>
            ))}
        </div>
    );
}
