import type { Variants } from 'framer-motion';

export const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number];

export const sectionReveal: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: EASE
        }
    }
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: EASE
        }
    }
};

export const hoverLift = {
    initial: { y: 0, scale: 1 },
    hover: {
        y: -4,
        scale: 1.02,
        transition: { duration: 0.3, ease: EASE }
    }
};

export const glowPulse = {
    animate: {
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.05, 1],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const imageHover = {
    initial: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.5, ease: EASE }
    }
};

export const modalTransition: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: EASE,
            backdropFilter: { duration: 0.4 }
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: {
            duration: 0.3,
            ease: EASE
        }
    }
};
