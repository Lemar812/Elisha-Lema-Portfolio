import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PolicyConsentModalProps {
    open: boolean;
    onAccept: () => void;
}

export default function PolicyConsentModal({ open, onAccept }: PolicyConsentModalProps) {
    const reduceMotion = useReducedMotion();
    const acceptButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const focusTimer = window.setTimeout(() => {
            acceptButtonRef.current?.focus();
        }, reduceMotion ? 0 : 120);

        return () => {
            window.clearTimeout(focusTimer);
        };
    }, [open, reduceMotion]);

    return (
        <AnimatePresence>
            {open && (
                <motion.section
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="policy-consent-title"
                    aria-describedby="policy-consent-description"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20, y: 20, scale: 0.98 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-4 left-4 z-[220] w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-white/10 bg-surface/92 shadow-[0_26px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:bottom-6 sm:left-6"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_42%)]" />
                    <div className="relative p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-primary shadow-[0_0_24px_rgba(124,58,237,0.16)]">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-text-muted/80">
                                    Site Policies
                                </p>
                                <h2 id="policy-consent-title" className="mt-1 font-satoshi text-lg font-bold text-white sm:text-xl">
                                    Review before continuing
                                </h2>
                                <p id="policy-consent-description" className="mt-2 text-sm leading-6 text-text-muted">
                                    Please review the Privacy Policy and Terms of Service. Once you agree, this prompt will stay out of the way unless the policy version changes.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <Link
                                to="/privacy-policy"
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms-of-service"
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                Terms of Service
                            </Link>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-text-muted/80">
                                Consent is stored locally in your browser.
                            </p>
                            <button
                                ref={acceptButtonRef}
                                type="button"
                                onClick={onAccept}
                                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(124,58,237,0.35)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                Agree & Continue
                            </button>
                        </div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
