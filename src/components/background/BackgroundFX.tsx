import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

interface BackgroundFXProps {
    intensity?: 'low' | 'medium';
}

const BackgroundFX = ({ intensity = 'low' }: BackgroundFXProps) => {
    const shouldReduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Parallax settings
    const gridY = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const nodesY = useTransform(scrollYProgress, [0, 1], [0, -100]);

    if (shouldReduceMotion) {
        return <div className="fixed inset-0 bg-background -z-50" />;
    }

    const shapeCount = isMobile ? 8 : 20;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
            {/* Layer A: subtle grid */}
            <motion.div
                style={{ y: gridY }}
                className="absolute inset-0 opacity-[0.03] md:opacity-[0.05]"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                        backgroundSize: intensity === 'medium' ? '40px 40px' : '80px 80px'
                    }}
                />
            </motion.div>

            {/* Layer B: light node network */}
            <motion.div
                style={{ y: nodesY }}
                className="absolute inset-0 flex items-center justify-center opacity-[0.1] md:opacity-[0.15]"
            >
                <svg width="100%" height="100%" className="w-full h-full">
                    <defs>
                        <pattern id="node-grid" width="400" height="400" patternUnits="userSpaceOnUse">
                            <circle cx="50" cy="50" r={isMobile ? 1.5 : 2} fill="#7C3AED" />
                            <circle cx="250" cy="150" r={isMobile ? 1.5 : 2} fill="#22D3EE" />
                            <circle cx="150" cy="350" r={isMobile ? 1.5 : 2} fill="#7C3AED" />
                            <path d="M50 50 L250 150 M250 150 L150 350" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#node-grid)" />
                </svg>
            </motion.div>

            {/* Layer C: floating outlines */}
            <div className="absolute inset-0">
                {[...Array(shapeCount)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isMobile ? [0.1, 0.2, 0.1] : [0.15, 0.4, 0.15],
                            rotate: 360,
                            x: isMobile ? [0, 40, -40, 0] : [0, 120, -120, 0],
                            y: isMobile ? [0, -50, 30, 0] : [0, -150, 80, 0]
                        }}
                        transition={{
                            duration: 30 + i * 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute text-primary/30 md:text-primary/40"
                        style={{
                            left: `${(i * 13) % 100}%`,
                            top: `${(i * 17) % 100}%`,
                        }}
                    >
                        {i % 3 === 0 ? (
                            <svg width={isMobile ? "60" : "100"} height={isMobile ? "60" : "100"} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="5" y="5" width="30" height="30" rx="4" />
                            </svg>
                        ) : i % 3 === 1 ? (
                            <svg width={isMobile ? "50" : "85"} height={isMobile ? "50" : "85"} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
                                <circle cx="20" cy="20" r="15" />
                            </svg>
                        ) : (
                            <svg width={isMobile ? "40" : "75"} height={isMobile ? "40" : "75"} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M20 5 L35 35 L5 35 Z" />
                            </svg>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Layer D: soft glows */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{ opacity: [0.08, 0.12, 0.08] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] md:blur-[150px]"
                />
                <motion.div
                    animate={{ opacity: [0.04, 0.08, 0.04] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px] md:blur-[150px]"
                />
            </div>

            {/* Layer E: faint code motifs (hidden on smallest screens) */}
            <div className="absolute inset-0 opacity-[0.015] md:opacity-[0.02] font-mono text-[10px] md:text-xs text-white hidden sm:block">
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-[30%] left-[8%]"
                >
                    {"< />"}
                </motion.div>
                <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-[20%] right-[15%]"
                >
                    {"{ }"}
                </motion.div>
            </div>

            {/* Vignette to keep focus centered */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.3)_100%)] md:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.4)_100%)] pointer-events-none" />
        </div>
    );
};

export default memo(BackgroundFX);
