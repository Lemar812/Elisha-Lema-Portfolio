import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bot, Sparkles, X } from 'lucide-react';
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
    onQuickAction: (action: QuickAction) => void;
    onMessageAction: (action: AssistantAction) => void;
    onMessageCta: (cta: AssistantCta) => void;
    onRecommendationClick: (recommendation: AssistantRecommendation) => void;
    onCopyInquirySummary: () => Promise<boolean>;
    onUseInquirySummary: () => void;
}

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
    onQuickAction,
    onMessageAction,
    onMessageCta,
    onRecommendationClick,
    onCopyInquirySummary,
    onUseInquirySummary,
}: AssistantPanelProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const reduceMotion = useReducedMotion();
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!open || !scrollerRef.current) {
            return;
        }

        scrollerRef.current.scrollTo({
            top: scrollerRef.current.scrollHeight,
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    }, [messages, isTyping, open, reduceMotion]);

    useEffect(() => {
        if (!open) {
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
    }, [onClose, open, reduceMotion]);

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
                        className="fixed inset-x-3 bottom-[5.25rem] z-[120] flex max-h-[min(720px,calc(100vh-6rem))] min-h-[22rem] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface/85 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:inset-auto sm:bottom-24 sm:right-24 sm:w-[420px]"
                    >
                        <div className="relative border-b border-white/10 px-4 py-4 sm:px-5">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
                            <div className="relative flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-primary">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 id={titleId} className="font-satoshi text-base font-bold text-white">
                                                {title}
                                            </h2>
                                            <Sparkles size={14} className="text-secondary" />
                                        </div>
                                        <p id={descriptionId} className="mt-1 max-w-[260px] text-xs leading-5 text-text-muted">
                                            {subtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close portfolio assistant"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={scrollerRef}
                            data-lenis-prevent
                            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
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
                        </div>

                        <AssistantInput ref={inputRef} disabled={isTyping} onSubmit={onSubmit} />
                    </motion.section>
                </>
            )}
        </AnimatePresence>
    );
}
