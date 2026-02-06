import { motion, useSpring, useMotionValue, AnimatePresence, useVelocity, useTransform } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';

interface FloatingTooltipProps {
    children: React.ReactNode;
    text: string;
    color?: 'primary' | 'secondary' | 'highlight';
    position?: 'top' | 'bottom';
    showOnFocus?: boolean;
    className?: string;
}

export default function FloatingTooltip({
    children,
    text,
    color = 'primary',
    position = 'top',
    showOnFocus = false,
    className = ""
}: FloatingTooltipProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

    const globalX = useMotionValue(0);
    const globalY = useMotionValue(0);

    // Ultra-smooth spring physics
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const x = useSpring(globalX, springConfig);
    const y = useSpring(globalY, springConfig);

    // Velocity-based effects
    const xVelocity = useVelocity(x);
    const rotate = useTransform(xVelocity, [-2000, 2000], [-15, 15]);
    const skewX = useTransform(xVelocity, [-2000, 2000], [-10, 10]);

    useEffect(() => {
        setMountNode(document.body);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        globalX.set(e.clientX);
        globalY.set(e.clientY);
    };

    const isActive = isHovered || (showOnFocus && isFocused);

    const colorStyles = {
        primary: {
            dot: 'bg-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]',
            border: 'border-primary/40',
            glow: 'shadow-[0_10px_40px_rgba(124,58,237,0.3)]',
            accent: 'rgba(124,58,237,0.5)'
        },
        secondary: {
            dot: 'bg-secondary shadow-[0_0_15px_rgba(34,211,238,0.8)]',
            border: 'border-secondary/40',
            glow: 'shadow-[0_10px_40px_rgba(34,211,238,0.3)]',
            accent: 'rgba(34,211,238,0.5)'
        },
        highlight: {
            dot: 'bg-highlight shadow-[0_0_15px_rgba(250,204,21,0.8)]',
            border: 'border-highlight/40',
            glow: 'shadow-[0_10px_40px_rgba(250,204,21,0.3)]',
            accent: 'rgba(250,204,21,0.5)'
        }
    };

    const currentStyle = colorStyles[color];

    return (
        <>
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocusCapture={() => setIsFocused(true)}
                onBlurCapture={() => setIsFocused(false)}
                className={cn(
                    "group/tooltip",
                    !className.includes('fixed') && !className.includes('absolute') && "relative",
                    !className.includes('block') && !className.includes('flex') && "inline-block",
                    className
                )}
            >
                {children}
            </div>

            {mountNode && createPortal(
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.3 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                mass: 0.8
                            }}
                            style={{
                                x,
                                y,
                                rotate,
                                skewX,
                                translateX: '-50%',
                                translateY: position === 'top' ? '-140%' : '40%',
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                pointerEvents: 'none',
                                zIndex: 9999,
                            }}
                            className="whitespace-nowrap"
                        >
                            {/* Outer Glow Trail effect */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 blur-2xl -z-10"
                                style={{ backgroundColor: currentStyle.accent }}
                            />

                            <div className={`
                                relative flex items-center gap-3
                                px-5 py-2.5 rounded-2xl 
                                bg-[#0A0A0A]/95 backdrop-blur-3xl
                                border ${currentStyle.border}
                                ${currentStyle.glow}
                            `}>
                                {/* Animated Scanner line */}
                                <motion.div
                                    animate={{ left: ['-10%', '110%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute top-0 bottom-0 w-[1px] bg-white/20 blur-[2px]"
                                />

                                <div className="relative flex items-center justify-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className={`absolute w-4 h-4 rounded-full blur-[6px] ${currentStyle.dot}`}
                                    />
                                    <div className={`w-2.5 h-2.5 rounded-full relative z-10 ${currentStyle.dot}`} />
                                </div>

                                <span className="text-[11px] sm:text-[12px] font-black text-white uppercase tracking-[0.25em] font-satoshi italic">
                                    {text}
                                </span>

                                {/* Stylized Arrow */}
                                <div className={`
                                    absolute ${position === 'top' ? '-bottom-[5px]' : '-top-[5px]'} 
                                    left-1/2 -translate-x-1/2 
                                    w-2.5 h-2.5 
                                    bg-[#0A0A0A]/95
                                    rotate-45 
                                    border-white/10
                                    ${position === 'top' ? 'border-r border-b' : 'border-l border-t'}
                                `} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                mountNode
            )}
        </>
    );
}
