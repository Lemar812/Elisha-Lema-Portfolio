import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assistantKnowledge } from '../data/assistantKnowledge';
import { runAssistantAction } from '../lib/assistantActions';
import { trackAssistantEvent } from '../lib/assistantAnalytics';
import { inferCommercialSignals } from '../lib/assistantLeadUtils';
import { clearInquiryDraft, loadAssistantSession, saveAssistantSession, saveInquiryDraft } from '../lib/assistantSession';
import type {
    AssistantAction,
    AssistantApiRequest,
    AssistantCta,
    AssistantMessage,
    AssistantRecommendation,
    QuickAction,
    UseAssistantReturn,
} from '../lib/assistantTypes';
import {
    buildLocalAssistantReply,
    buildRateLimitedReply,
    createAssistantMessage,
    sanitizeAssistantApiResponse,
    toAssistantHistory,
    toStoredAssistantMessages,
    trimAssistantContent,
} from '../lib/assistantUtils';

const ASSISTANT_ENDPOINT = '/.netlify/functions/portfolio-chat';
const RESPONSE_DELAY_MS = 320;
const REQUEST_TIMEOUT_MS = 12000;

type ReplyFailureReason = 'network' | 'provider' | 'invalid_response' | 'rate_limited';

export function useAssistant(): UseAssistantReturn {
    const initialSession = useMemo(() => loadAssistantSession(), []);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<AssistantMessage[]>(() => initialSession?.messages ?? []);
    const hasWelcomedRef = useRef(initialSession?.hasWelcomed ?? false);
    const hasOpenedRef = useRef(initialSession?.hasOpened ?? false);
    const pendingRequestRef = useRef<AbortController | null>(null);
    const pendingInputRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);
    const lastSummaryRef = useRef<string | null>(null);
    const lastLeadKeyRef = useRef<string | null>(null);

    const commercialSignals = useMemo(() => inferCommercialSignals(toAssistantHistory(messages)), [messages]);
    const inquirySummary = commercialSignals.summary;

    useEffect(() => {
        if (messages.length > 0 && !hasWelcomedRef.current) {
            hasWelcomedRef.current = true;
        }
    }, [messages]);

    const appendAssistantReply = useCallback(
        (
            reply: {
                content: string;
                actions?: AssistantAction[];
                mode?: 'ai' | 'fallback';
                intent?: AssistantMessage['intent'];
                cta?: AssistantCta;
                recommendations?: AssistantMessage['recommendations'];
                qualification?: AssistantMessage['qualification'];
            },
            fallbackReason?: ReplyFailureReason | 'local_rule'
        ) => {
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = window.setTimeout(() => {
                const nextMessage = createAssistantMessage('assistant', reply.content, reply.actions, reply.mode, {
                    intent: reply.intent,
                    cta: reply.cta,
                    recommendations: reply.recommendations,
                    qualification: reply.qualification,
                });

                setMessages((current) => [...current, nextMessage]);
                setIsTyping(false);
                pendingInputRef.current = null;

                trackAssistantEvent('assistant_response_received', {
                    mode: nextMessage.mode ?? 'fallback',
                    intent: nextMessage.intent ?? 'general',
                    hasActions: Boolean(nextMessage.actions?.length),
                    hasCta: Boolean(nextMessage.cta),
                    hasRecommendations: Boolean(nextMessage.recommendations?.length),
                    qualificationStatus: nextMessage.qualification?.status ?? 'none',
                });

                if (nextMessage.mode === 'fallback') {
                    trackAssistantEvent('assistant_fallback_used', {
                        reason: fallbackReason ?? 'local_rule',
                    });
                }

                if (nextMessage.cta) {
                    trackAssistantEvent('assistant_contact_cta_shown', {
                        label: nextMessage.cta.label,
                    });
                }

                if (nextMessage.recommendations?.length) {
                    trackAssistantEvent('assistant_recommendation_shown', {
                        ids: nextMessage.recommendations.map((recommendation) => recommendation.id),
                    });
                }
            }, RESPONSE_DELAY_MS);
        },
        []
    );

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
            }

            pendingRequestRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        saveAssistantSession({
            messages: toStoredAssistantMessages(messages),
            hasWelcomed: hasWelcomedRef.current,
            hasOpened: hasOpenedRef.current,
        });
    }, [messages]);

    useEffect(() => {
        if (!inquirySummary || inquirySummary.summaryText === lastSummaryRef.current) {
            return;
        }

        lastSummaryRef.current = inquirySummary.summaryText;
        trackAssistantEvent('assistant_inquiry_summary_generated', {
            status: inquirySummary.status,
        });
    }, [inquirySummary]);

    useEffect(() => {
        const qualification = commercialSignals.qualification;
        const serviceTypes = commercialSignals.profile?.serviceTypes ?? [];
        const leadKey = `${qualification.status}:${serviceTypes.join('|')}`;

        if (
            qualification.status === 'insufficient' ||
            leadKey === lastLeadKeyRef.current ||
            !serviceTypes.length ||
            (serviceTypes.length === 1 && serviceTypes[0] === 'general')
        ) {
            return;
        }

        lastLeadKeyRef.current = leadKey;
        trackAssistantEvent('assistant_lead_detected', {
            status: qualification.status,
            serviceTypes,
        });
    }, [commercialSignals]);

    const ensureWelcome = useCallback(() => {
        if (hasWelcomedRef.current) {
            return;
        }

        if (messages.length > 0) {
            hasWelcomedRef.current = true;
            return;
        }

        hasWelcomedRef.current = true;
        setMessages([createAssistantMessage('assistant', assistantKnowledge.welcomeMessage, undefined, undefined, { intent: 'general' })]);
    }, [messages.length]);

    const openAssistant = useCallback(() => {
        const restoredSession = Boolean(initialSession?.messages?.length);
        ensureWelcome();

        if (!hasOpenedRef.current) {
            hasOpenedRef.current = true;
        }

        setIsOpen((current) => {
            if (!current) {
                trackAssistantEvent('assistant_opened', { restoredSession });
            }

            return true;
        });

        saveAssistantSession({
            messages: toStoredAssistantMessages(messages),
            hasWelcomed: hasWelcomedRef.current,
            hasOpened: hasOpenedRef.current,
        });
    }, [ensureWelcome, initialSession?.messages?.length, messages]);

    const closeAssistant = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleAssistant = useCallback(() => {
        if (isOpen) {
            closeAssistant();
            return;
        }

        openAssistant();
    }, [closeAssistant, isOpen, openAssistant]);

    const requestAssistantReply = useCallback(
        async (historyMessages: AssistantMessage[], input: string) => {
            const controller = new AbortController();
            pendingRequestRef.current = controller;

            const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            const compactHistory = toAssistantHistory(historyMessages);

            try {
                const payload: AssistantApiRequest = {
                    message: trimAssistantContent(input, 500),
                    history: compactHistory,
                };

                const response = await fetch(ASSISTANT_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                });

                const responseJson = await response.json().catch(() => null);
                const data = sanitizeAssistantApiResponse(responseJson);

                if (response.status === 429) {
                    trackAssistantEvent('assistant_rate_limited', { source: 'backend' });

                    const rateLimitedReply = data ?? buildRateLimitedReply();

                    appendAssistantReply(
                        {
                            content:
                                'message' in rateLimitedReply
                                    ? rateLimitedReply.message
                                    : rateLimitedReply.content ?? assistantKnowledge.rateLimitMessage,
                            actions: rateLimitedReply.actions,
                            mode: 'fallback',
                            intent: rateLimitedReply.intent ?? 'general',
                            cta: rateLimitedReply.cta,
                            recommendations: rateLimitedReply.recommendations,
                            qualification: rateLimitedReply.qualification,
                        },
                        'rate_limited'
                    );
                    return;
                }

                if (!response.ok) {
                    trackAssistantEvent('assistant_error', {
                        kind: response.status >= 500 ? 'provider' : 'validation',
                        statusCode: response.status,
                    });
                    throw new Error(`Assistant request failed with status ${response.status}`);
                }

                if (!data) {
                    trackAssistantEvent('assistant_error', {
                        kind: 'validation',
                    });
                    throw new Error('Assistant response was invalid');
                }

                appendAssistantReply({
                    content: data.message,
                    actions: data.actions,
                    mode: data.mode,
                    intent: data.intent,
                    cta: data.cta,
                    recommendations: data.recommendations,
                    qualification: data.qualification,
                });
            } catch (error) {
                const reason: ReplyFailureReason =
                    error instanceof Error && error.name === 'AbortError'
                        ? 'network'
                        : error instanceof Error && error.message.includes('invalid')
                          ? 'invalid_response'
                          : 'provider';

                trackAssistantEvent('assistant_error', {
                    kind: reason === 'network' ? 'network' : reason === 'invalid_response' ? 'validation' : 'provider',
                });

                const fallback = buildLocalAssistantReply(input, compactHistory);
                appendAssistantReply(
                    {
                        content: fallback.content,
                        actions: fallback.actions,
                        mode: 'fallback',
                        intent: fallback.intent,
                        cta: fallback.cta,
                        recommendations: fallback.recommendations,
                        qualification: fallback.qualification,
                    },
                    reason
                );
            } finally {
                window.clearTimeout(timeoutId);
                pendingRequestRef.current = null;
            }
        },
        [appendAssistantReply]
    );

    const submitMessage = useCallback(
        (input: string, source: 'input' | 'quick_action' = 'input') => {
            const trimmed = trimAssistantContent(input, 500);
            const normalized = trimmed.toLowerCase();

            if (!trimmed || isTyping || pendingInputRef.current === normalized) {
                return;
            }

            ensureWelcome();
            setIsTyping(true);
            pendingInputRef.current = normalized;

            trackAssistantEvent('assistant_message_sent', {
                length: trimmed.length,
                source,
            });

            const userMessage = createAssistantMessage('user', trimmed);

            setMessages((current) => {
                void requestAssistantReply(current, trimmed);
                return [...current, userMessage];
            });
        },
        [ensureWelcome, isTyping, requestAssistantReply]
    );

    const handleQuickAction = useCallback(
        (action: QuickAction) => {
            openAssistant();
            submitMessage(action.prompt, 'quick_action');
        },
        [openAssistant, submitMessage]
    );

    const handleMessageAction = useCallback((action: AssistantAction) => {
        trackAssistantEvent('assistant_action_clicked', {
            actionId: action.id,
            target: action.target,
        });
        runAssistantAction(action);
    }, []);

    const handleRecommendationClick = useCallback((recommendation: AssistantRecommendation) => {
        trackAssistantEvent('assistant_recommendation_clicked', {
            recommendationId: recommendation.id,
            target: recommendation.target,
        });
        runAssistantAction({
            id: `recommendation-${recommendation.id}`,
            label: recommendation.title,
            type: 'scroll',
            target: 'works',
        });
    }, []);

    const handoffToContact = useCallback(() => {
        const summaryText = inquirySummary?.summaryText ?? '';

        if (summaryText) {
            saveInquiryDraft(summaryText);
        } else {
            clearInquiryDraft();
        }

        trackAssistantEvent('assistant_contact_handoff_used', {
            hasSummary: Boolean(summaryText),
        });

        runAssistantAction({
            id: 'assistant-contact-handoff',
            label: assistantKnowledge.contactCtaLabel,
            type: 'scroll',
            target: 'contact',
        });
    }, [inquirySummary]);

    const handleMessageCta = useCallback(
        (cta: AssistantCta) => {
            trackAssistantEvent('assistant_contact_cta_clicked', {
                label: cta.label,
                target: cta.target,
            });
            handoffToContact();
        },
        [handoffToContact]
    );

    const handleCopyInquirySummary = useCallback(async () => {
        if (!inquirySummary?.summaryText) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(inquirySummary.summaryText);
            trackAssistantEvent('assistant_inquiry_summary_copied', {
                length: inquirySummary.summaryText.length,
            });
            return true;
        } catch {
            return false;
        }
    }, [inquirySummary]);

    const handleUseInquirySummary = useCallback(() => {
        handoffToContact();
    }, [handoffToContact]);

    const showQuickActions = messages.length === 1 && messages[0]?.role === 'assistant' && !isTyping;
    const quickActions = useMemo(() => assistantKnowledge.quickActions, []);

    return {
        isOpen,
        isTyping,
        messages,
        showQuickActions,
        quickActions,
        inquirySummary,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        submitMessage,
        handleQuickAction,
        handleMessageAction,
        handleMessageCta,
        handleRecommendationClick,
        handleCopyInquirySummary,
        handleUseInquirySummary,
    };
}
