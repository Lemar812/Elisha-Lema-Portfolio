import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

type YookieOrbSize = 'message' | 'header' | 'launcher' | 'nudge';

interface YookieOrbProps {
    size?: YookieOrbSize;
    animated?: boolean;
    className?: string;
}

const SIZE_CLASSES: Record<YookieOrbSize, { shell: string; ring: string; mid: string; core: string }> = {
    message: {
        shell: 'h-6 w-6',
        ring: 'inset-[-3px]',
        mid: 'inset-[4px]',
        core: 'inset-[8px]',
    },
    header: {
        shell: 'h-8 w-8',
        ring: 'inset-[-4px]',
        mid: 'inset-[5px]',
        core: 'inset-[10px]',
    },
    launcher: {
        shell: 'h-12 w-12',
        ring: 'inset-[-5px]',
        mid: 'inset-[6px]',
        core: 'inset-[12px]',
    },
    nudge: {
        shell: 'h-7 w-7',
        ring: 'inset-[-3px]',
        mid: 'inset-[4px]',
        core: 'inset-[8px]',
    },
};

export default function YookieOrb({ size = 'header', animated = true, className }: YookieOrbProps) {
    const reduceMotion = useReducedMotion();
    const scale = SIZE_CLASSES[size];
    const allowMotion = animated && !reduceMotion;

    return (
        <div className={cn('relative shrink-0', scale.shell, className)}>
            <motion.span
                aria-hidden="true"
                animate={allowMotion ? { rotate: [0, 360] } : undefined}
                transition={allowMotion ? { duration: 16, repeat: Number.POSITIVE_INFINITY, ease: 'linear' } : undefined}
                className={cn(
                    'absolute rounded-full border border-white/12 border-t-secondary/55 border-r-primary/45 opacity-75',
                    scale.ring
                )}
            />
            <motion.span
                aria-hidden="true"
                animate={allowMotion ? { scale: [1, 1.05, 1], opacity: [0.82, 1, 0.82] } : undefined}
                transition={allowMotion ? { duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : undefined}
                className={cn(
                    'absolute rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.42),transparent_22%),radial-gradient(circle_at_48%_54%,rgba(124,58,237,0.82),rgba(124,58,237,0.16)_58%,rgba(4,8,20,0.8)_80%),radial-gradient(circle_at_75%_76%,rgba(34,211,238,0.42),transparent_28%)] shadow-[0_0_22px_rgba(124,58,237,0.18)]',
                    scale.mid
                )}
            />
            <span
                aria-hidden="true"
                className={cn(
                    'absolute rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_26%,rgba(255,255,255,0.2),transparent_18%),radial-gradient(circle_at_70%_72%,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.16),rgba(5,5,5,0.22)_72%)]',
                    scale.core
                )}
            />
        </div>
    );
}
