import { useState } from 'react';
import { Copy, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type {
    AssistantAction,
    AssistantCta,
    AssistantInquirySummary,
    AssistantMessage,
    AssistantRecommendation,
    QuickAction,
} from '../../lib/assistantTypes';
import { formatAssistantTimestamp } from '../../lib/assistantUtils';
import QuickActions from './QuickActions';
import TypingIndicator from './TypingIndicator';

interface AssistantMessageListProps {
    messages: AssistantMessage[];
    isTyping: boolean;
    showQuickActions: boolean;
    quickActions: QuickAction[];
    inquirySummary: AssistantInquirySummary | null;
    onQuickAction: (action: QuickAction) => void;
    onMessageAction: (action: AssistantAction) => void;
    onMessageCta: (cta: AssistantCta) => void;
    onRecommendationClick: (recommendation: AssistantRecommendation) => void;
    onCopyInquirySummary: () => Promise<boolean>;
    onUseInquirySummary: () => void;
}

export default function AssistantMessageList({
    messages,
    isTyping,
    showQuickActions,
    quickActions,
    inquirySummary,
    onQuickAction,
    onMessageAction,
    onMessageCta,
    onRecommendationClick,
    onCopyInquirySummary,
    onUseInquirySummary,
}: AssistantMessageListProps) {
    const reduceMotion = useReducedMotion();
    const [copyFeedback, setCopyFeedback] = useState<'idle' | 'copied'>('idle');
    const motionProps = reduceMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.12 } }
        : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.18 } };

    const handleCopy = async () => {
        const copied = await onCopyInquirySummary();

        if (!copied) {
            return;
        }

        setCopyFeedback('copied');
        window.setTimeout(() => setCopyFeedback('idle'), 1800);
    };

    return (
        <div className="space-y-3.5 pb-1" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => {
                const isAssistant = message.role === 'assistant';
                const messageCta = message.cta;
                const recommendations = message.recommendations;

                return (
                    <motion.div
                        key={message.id}
                        {...motionProps}
                        className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`relative max-w-[91%] overflow-hidden rounded-[24px] px-3.5 py-2.5 shadow-premium sm:max-w-[89%] ${
                                isAssistant
                                    ? 'rounded-bl-md border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] text-text-primary backdrop-blur-xl'
                                    : 'rounded-br-md border border-primary/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.92),rgba(34,211,238,0.34))] text-white'
                            }`}
                        >
                            {isAssistant && (
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.09),transparent_28%)]" />
                            )}
                            <div className="relative">
                                <p className="whitespace-pre-line break-words text-[13px] leading-6">{message.content}</p>
                                <div className="mt-1.5 flex items-center justify-between gap-3">
                                    <span className={`text-[10px] font-medium uppercase tracking-[0.18em] ${isAssistant ? 'text-text-muted/70' : 'text-white/70'}`}>
                                        {formatAssistantTimestamp(message.createdAt)}
                                    </span>
                                </div>
                                {Boolean(recommendations?.length) && (
                                    <motion.div {...motionProps} className="mt-2.5 grid gap-2">
                                        {recommendations?.map((recommendation) => (
                                            <div
                                                key={recommendation.id}
                                                className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(4,8,20,0.5),rgba(255,255,255,0.03))] p-3 backdrop-blur-xl"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-white">{recommendation.title}</p>
                                                        <p className="mt-1 break-words text-xs leading-5 text-text-muted">{recommendation.reason}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => onRecommendationClick(recommendation)}
                                                        aria-label={`View recommended work: ${recommendation.title}`}
                                                        className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-primary/45 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                                    >
                                                        View Work
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                                {Boolean(message.actions?.length) && (
                                    <div className="mt-2.5 flex flex-wrap gap-2">
                                        {message.actions?.map((action) => (
                                            <button
                                                key={action.id}
                                                type="button"
                                                onClick={() => onMessageAction(action)}
                                                aria-label={action.label}
                                                className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl transition-colors hover:border-primary/35 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {messageCta && (
                                    <motion.div {...motionProps} className="mt-2.5">
                                        <button
                                            type="button"
                                            onClick={() => onMessageCta(messageCta)}
                                            aria-label={messageCta.label}
                                            className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-gradient-to-r from-primary/20 to-secondary/15 px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-white transition-colors hover:border-primary/50 hover:from-primary/30 hover:to-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                        >
                                            {messageCta.label}
                                        </button>
                                    </motion.div>
                                )}
                                {isAssistant && showQuickActions && index === 0 && (
                                    <div className="mt-2.5">
                                        <QuickActions actions={quickActions} disabled={isTyping} onSelect={onQuickAction} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            {inquirySummary && (
                <motion.div
                    {...motionProps}
                    className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] p-3.5 shadow-premium backdrop-blur-xl"
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.09),transparent_28%)]" />
                    <div className="relative flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-primary/10 text-primary">
                            <FileText size={17} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white">Inquiry Summary</p>
                            <p className="mt-1 whitespace-pre-line break-words text-xs leading-5 text-text-muted">
                                {inquirySummary.summaryText}
                            </p>
                        </div>
                    </div>
                    <div className="relative mt-3 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={onUseInquirySummary}
                            aria-label="Continue to the contact section with this inquiry summary"
                            className="rounded-full border border-primary/30 bg-gradient-to-r from-primary/20 to-secondary/15 px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-white transition-colors hover:border-primary/50 hover:from-primary/30 hover:to-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            Continue to Contact
                        </button>
                        <button
                            type="button"
                            onClick={handleCopy}
                            aria-label="Copy inquiry summary"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <Copy size={14} />
                            {copyFeedback === 'copied' ? 'Copied' : 'Copy Summary'}
                        </button>
                    </div>
                </motion.div>
            )}

            {isTyping && <TypingIndicator />}
        </div>
    );
}
