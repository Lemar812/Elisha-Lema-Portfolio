import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useFloatingDockOffset } from '../../hooks/useFloatingDockOffset';
import type { AssistantOrbState } from '../../lib/assistantTypes';

interface AssistantLauncherProps {
    open: boolean;
    onToggle: () => void;
    canShowNudge?: boolean;
    orbState?: AssistantOrbState;
}

const NUDGE_STOPPED_STORAGE_KEY = 'portfolio-assistant-nudge-stopped';
const BASE_BOTTOM_PX = 24;
const FIRST_NUDGE_DELAY_MS = 8000;
const REAPPEAR_NUDGE_DELAY_MS = 45000;
const AUTO_HIDE_NUDGE_MS = 5600;

export default function AssistantLauncher({ open, onToggle, canShowNudge = true, orbState = 'idle' }: AssistantLauncherProps) {
    const reduceMotion = useReducedMotion();
    const footerLift = useFloatingDockOffset();
    const [showNudge, setShowNudge] = useState(false);
    const showTimerRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);

    const clearShowTimer = useCallback(() => {
        if (showTimerRef.current) {
            window.clearTimeout(showTimerRef.current);
            showTimerRef.current = null;
        }
    }, []);

    const clearHideTimer = useCallback(() => {
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    }, []);

    const hasStoppedNudges = useCallback(() => {
        if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
            return false;
        }

        return window.sessionStorage.getItem(NUDGE_STOPPED_STORAGE_KEY) === '1';
    }, []);

    const stopNudgesForSession = useCallback(() => {
        if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
            window.sessionStorage.setItem(NUDGE_STOPPED_STORAGE_KEY, '1');
        }

        clearShowTimer();
        clearHideTimer();
        setShowNudge(false);
    }, [clearHideTimer, clearShowTimer]);

    const scheduleNextNudge = useCallback(
        (delayMs: number) => {
            if (
                typeof window === 'undefined' ||
                typeof window.sessionStorage === 'undefined' ||
                !canShowNudge ||
                open ||
                orbState === 'userTyping' ||
                hasStoppedNudges()
            ) {
                return;
            }

            clearShowTimer();
            showTimerRef.current = window.setTimeout(() => {
                if (open || orbState === 'userTyping' || hasStoppedNudges()) {
                    showTimerRef.current = null;
                    return;
                }

                setShowNudge(true);
                showTimerRef.current = null;
            }, delayMs);
        },
        [canShowNudge, clearShowTimer, hasStoppedNudges, open, orbState]
    );

    const dismissNudge = useCallback(() => {
        stopNudgesForSession();
    }, [stopNudgesForSession]);

    const orbAnimation = useMemo(() => {
        if (reduceMotion) {
            return { scale: 1, rotate: 0, boxShadow: '0 18px 46px rgba(0, 0, 0, 0.42)' };
        }

        switch (orbState) {
            case 'userTyping':
                return {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                        '0 18px 46px rgba(0,0,0,0.42)',
                        '0 0 0 10px rgba(34,211,238,0.12), 0 22px 55px rgba(34,211,238,0.22)',
                        '0 18px 46px rgba(0,0,0,0.42)',
                    ],
                };
            case 'thinking':
                return {
                    scale: [1, 1.03, 1],
                    boxShadow: [
                        '0 18px 46px rgba(0,0,0,0.42)',
                        '0 0 0 12px rgba(124,58,237,0.14), 0 26px 62px rgba(124,58,237,0.3)',
                        '0 18px 46px rgba(0,0,0,0.42)',
                    ],
                };
            case 'speaking':
                return {
                    scale: [1, 1.04, 1],
                    y: [0, -2, 0],
                    boxShadow: [
                        '0 18px 46px rgba(0,0,0,0.42)',
                        '0 24px 60px rgba(34,211,238,0.2)',
                        '0 18px 46px rgba(0,0,0,0.42)',
                    ],
                };
            default:
                return {
                    scale: [1, 0.985, 1.015, 1],
                    rotate: [0, -3, 2, 0],
                    boxShadow: [
                        '0 18px 46px rgba(0,0,0,0.42)',
                        '0 21px 52px rgba(124,58,237,0.16)',
                        '0 20px 50px rgba(34,211,238,0.12)',
                        '0 18px 46px rgba(0,0,0,0.42)',
                    ],
                };
        }
    }, [orbState, reduceMotion]);

    const orbTransition = useMemo(() => {
        if (reduceMotion) {
            return { duration: 0.18 };
        }

        switch (orbState) {
            case 'userTyping':
                return { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' };
            case 'thinking':
                return { duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' };
            case 'speaking':
                return { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' };
            default:
                return { duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' };
        }
    }, [orbState, reduceMotion]);

    useEffect(() => {
        if (open) {
            stopNudgesForSession();
            return;
        }

        if (!canShowNudge || hasStoppedNudges()) {
            setShowNudge(false);
            clearShowTimer();
            clearHideTimer();
            return;
        }

        if (orbState === 'userTyping') {
            setShowNudge(false);
            clearHideTimer();
            scheduleNextNudge(REAPPEAR_NUDGE_DELAY_MS);
            return;
        }

        if (!showNudge) {
            scheduleNextNudge(FIRST_NUDGE_DELAY_MS);
        }
    }, [
        canShowNudge,
        clearHideTimer,
        clearShowTimer,
        hasStoppedNudges,
        open,
        orbState,
        scheduleNextNudge,
        showNudge,
        stopNudgesForSession,
    ]);

    useEffect(() => {
        if (!showNudge) {
            clearHideTimer();

            if (!open && canShowNudge && !hasStoppedNudges() && orbState !== 'userTyping') {
                scheduleNextNudge(REAPPEAR_NUDGE_DELAY_MS);
            }
            return;
        }

        clearHideTimer();
        hideTimerRef.current = window.setTimeout(() => {
            setShowNudge(false);
            hideTimerRef.current = null;
        }, AUTO_HIDE_NUDGE_MS);

        return () => {
            clearHideTimer();
        };
    }, [canShowNudge, clearHideTimer, hasStoppedNudges, open, orbState, scheduleNextNudge, showNudge]);

    useEffect(() => {
        return () => {
            clearShowTimer();
            clearHideTimer();
        };
    }, [clearHideTimer, clearShowTimer]);

    const handleToggle = () => {
        if (!open) {
            stopNudgesForSession();
        } else {
            setShowNudge(false);
        }

        onToggle();
    };

    return (
        <div className="fixed right-4 z-[121] sm:right-8" style={{ bottom: `${BASE_BOTTOM_PX + footerLift}px` }}>
            <AnimatePresence>
                {!open && showNudge && (
                    <motion.div
                        key="assistant-nudge"
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute bottom-[calc(100%+1rem)] right-0 w-[min(18rem,calc(100vw-2rem))]"
                    >
                        <div className="relative overflow-hidden rounded-[22px] border border-white/12 bg-surface/92 px-4 py-3 text-left shadow-[0_20px_55px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.16),transparent_46%)]" />
                            <div className="relative flex items-start gap-3">
                                <div className="relative mt-0.5 h-9 w-9 shrink-0">
                                    <span className="absolute inset-0 rounded-full border border-white/12 border-t-secondary/55 border-r-primary/40 opacity-80" />
                                    <span className="absolute inset-[4px] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.38),transparent_22%),radial-gradient(circle_at_45%_55%,rgba(124,58,237,0.78),rgba(124,58,237,0.14)_62%,rgba(3,7,18,0.78)_82%),radial-gradient(circle_at_74%_76%,rgba(34,211,238,0.36),transparent_28%)]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-white">Hi, I&apos;m Yookie.</p>
                                    <p className="mt-1 text-xs leading-5 text-text-muted">Need help exploring the portfolio?</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={dismissNudge}
                                    aria-label="Dismiss Yookie introduction"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-white/12 bg-surface/92" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={handleToggle}
                aria-label={open ? 'Close Yookie assistant' : 'Open Yookie assistant'}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls="portfolio-assistant-panel"
                animate={orbAnimation}
                transition={orbTransition}
                whileHover={reduceMotion ? undefined : { scale: 1.04, y: -4 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="group relative flex h-[4.35rem] w-[4.35rem] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                <motion.span
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { rotate: [0, 360] }}
                    transition={{ duration: orbState === 'thinking' ? 8 : 16, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                    className="absolute inset-[-6px] rounded-full border border-white/10 border-t-secondary/55 border-r-primary/40 opacity-70"
                />
                <motion.span
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { scale: orbState === 'userTyping' ? [1, 1.18, 1] : [1, 1.1, 1], opacity: [0.32, 0.58, 0.32] }}
                    transition={{ duration: orbState === 'userTyping' ? 1.05 : 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.65),transparent_20%),radial-gradient(circle_at_35%_35%,rgba(124,58,237,0.95),rgba(124,58,237,0.38)_46%,rgba(5,5,5,0.05)_74%),radial-gradient(circle_at_72%_76%,rgba(34,211,238,0.72),transparent_28%)] blur-[1px]"
                />
                <span className="absolute inset-[8px] rounded-full border border-white/12 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_60%_70%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.18),rgba(8,8,8,0.7)_75%)] backdrop-blur-xl" />
                <motion.span
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { scale: orbState === 'speaking' ? [1, 1.08, 1] : [1, 1.02, 1], opacity: [0.65, 0.95, 0.65] }}
                    transition={{ duration: orbState === 'speaking' ? 1.6 : 2.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                    className="absolute inset-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.5),transparent_18%),radial-gradient(circle_at_50%_55%,rgba(124,58,237,0.8),rgba(124,58,237,0.2)_60%,transparent_82%)]"
                />
                <span className="absolute inset-[18px] rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.22),transparent_18%),radial-gradient(circle_at_68%_72%,rgba(34,211,238,0.2),transparent_22%),radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.24),rgba(5,5,5,0.22)_72%)]" />
                <AnimatePresence>
                    {open && (
                        <motion.span
                            key="launcher-close"
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.16 }}
                            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/20 text-white"
                        >
                            <X size={20} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
