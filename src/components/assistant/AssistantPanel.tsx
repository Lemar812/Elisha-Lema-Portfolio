import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import type {
    AssistantAction,
    AssistantCta,
    AssistantInquirySummary,
    AssistantMessage,
    AssistantRecommendation,
    QuickAction,
} from '../../lib/assistantTypes';
import AssistantInput from './AssistantInput';
import AssistantMessageList from './AssistantMessageList';
import YookieOrb from './YookieOrb';

interface AssistantPanelProps {
    open: boolean;
    title: string;
    subtitle: string;
    messages: AssistantMessage[];
    isTyping: boolean;
    showQuickActions: boolean;
    quickActions: QuickAction[];
    inquirySummary: AssistantInquirySummary | null;
    onClose: () => void;
    onSubmit: (value: string) => void;
    onDraftingChange: (value: boolean) => void;
    onQuickAction: (action: QuickAction) => void;
    onMessageAction: (action: AssistantAction) => void;
    onMessageCta: (cta: AssistantCta) => void;
    onRecommendationClick: (recommendation: AssistantRecommendation) => void;
    onCopyInquirySummary: () => Promise<boolean>;
    onUseInquirySummary: () => void;
}

const AUTO_SCROLL_THRESHOLD_PX = 72;

export default function AssistantPanel({
    open,
    title,
    subtitle,
    messages,
    isTyping,
    showQuickActions,
    quickActions,
    inquirySummary,
    onClose,
    onSubmit,
    onDraftingChange,
    onQuickAction,
    onMessageAction,
    onMessageCta,
    onRecommendationClick,
    onCopyInquirySummary,
    onUseInquirySummary,
}: AssistantPanelProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const bottomAnchorRef = useRef<HTMLDivElement>(null);
    const shouldStickToBottomRef = useRef(true);
    const previousMessageCountRef = useRef(messages.length);
    const inputRef = useRef<HTMLInputElement>(null);
    const reduceMotion = useReducedMotion();
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!open) {
            shouldStickToBottomRef.current = true;
            return;
        }

        const scroller = scrollerRef.current;

        if (!scroller) {
            return;
        }

        const updateStickiness = () => {
            const distanceFromBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
            shouldStickToBottomRef.current = distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX;
        };

        updateStickiness();
        scroller.addEventListener('scroll', updateStickiness, { passive: true });

        return () => {
            scroller.removeEventListener('scroll', updateStickiness);
        };
    }, [open]);

    useEffect(() => {
        if (!open || !bottomAnchorRef.current) {
            return;
        }

        const hasNewMessage = messages.length > previousMessageCountRef.current;
        previousMessageCountRef.current = messages.length;

        if (!hasNewMessage && !shouldStickToBottomRef.current) {
            return;
        }

        bottomAnchorRef.current.scrollIntoView({
            block: 'end',
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    }, [messages, isTyping, open, reduceMotion]);

    useEffect(() => {
        if (!open || !bottomAnchorRef.current) {
            return;
        }

        shouldStickToBottomRef.current = true;
        bottomAnchorRef.current.scrollIntoView({
            block: 'end',
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    }, [open, reduceMotion]);

    useEffect(() => {
        if (!open) {
            onDraftingChange(false);
            return;
        }

        const timeoutId = window.setTimeout(() => {
            inputRef.current?.focus();
        }, reduceMotion ? 0 : 120);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, onDraftingChange, open, reduceMotion]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Dismiss portfolio assistant overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[118] bg-black/50 backdrop-blur-sm sm:hidden"
                    />
                    <motion.section
                        id="portfolio-assistant-panel"
                        role="dialog"
                        aria-modal="false"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-x-3 bottom-[5.25rem] z-[120] flex h-[min(75vh,640px)] min-h-[20rem] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(6,10,24,0.88))] shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:inset-auto sm:bottom-24 sm:right-24 sm:w-[372px]"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.15),transparent_34%),radial-gradient(circle_at_100%_18%,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_36%)]" />
                        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                        <div className="relative shrink-0 border-b border-white/10 px-4 py-3 sm:px-4.5 sm:py-3.5">
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]" />
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.14),transparent_70%)]" />
                            <div className="relative flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <YookieOrb size="header" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 id={titleId} className="font-satoshi text-[15px] font-bold text-white">
                                                {title}
                                            </h2>
                                            <Sparkles size={13} className="text-secondary" />
                                        </div>
                                        <p id={descriptionId} className="mt-0.5 max-w-[236px] text-[11px] leading-5 text-text-muted">
                                            {subtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close portfolio assistant"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-text-muted transition-colors hover:border-white/15 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                >
                                    <X size={17} />
                                </button>
                            </div>
                        </div>

                        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(124,58,237,0.1),transparent_24%)]" />
                            <div
                                ref={scrollerRef}
                                data-lenis-prevent
                                className="relative h-full min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-3.5 sm:px-4 sm:py-4"
                            >
                                <AssistantMessageList
                                    messages={messages}
                                    isTyping={isTyping}
                                    showQuickActions={showQuickActions}
                                    quickActions={quickActions}
                                    inquirySummary={inquirySummary}
                                    onQuickAction={onQuickAction}
                                    onMessageAction={onMessageAction}
                                    onMessageCta={onMessageCta}
                                    onRecommendationClick={onRecommendationClick}
                                    onCopyInquirySummary={onCopyInquirySummary}
                                    onUseInquirySummary={onUseInquirySummary}
                                />
                                <div ref={bottomAnchorRef} aria-hidden="true" className="h-px w-full" />
                            </div>
                        </div>

                        <div className="relative shrink-0 border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.04))]">
                            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                            <AssistantInput ref={inputRef} disabled={isTyping} onSubmit={onSubmit} onDraftingChange={onDraftingChange} />
                        </div>
                    </motion.section>
                </>
            )}
        </AnimatePresence>
    );
}
