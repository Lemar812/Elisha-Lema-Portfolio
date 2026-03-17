import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assistantKnowledge } from '../data/assistantKnowledge';
import { runAssistantAction } from '../lib/assistantActions';
import { trackAssistantEvent } from '../lib/assistantAnalytics';
import { inferCommercialSignals } from '../lib/assistantLeadUtils';
import {
    clearInquiryDraft,
    loadAssistantSession,
    saveAssistantSession,
    saveInquiryDraft,
} from '../lib/assistantSession';
import type {
    AssistantAction,
    AssistantApiRequest,
    AssistantCta,
    AssistantMessage,
    AssistantOrbState,
    AssistantRecommendation,
    AssistantSessionIntentContext,
    QuickAction,
    UseAssistantReturn,
} from '../lib/assistantTypes';
import {
    buildLocalAssistantReply,
    buildRateLimitedReply,
    createAssistantMessage,
    createScrollAction,
    sanitizeAssistantApiResponse,
    toAssistantHistory,
    toStoredAssistantMessages,
    trimAssistantContent,
} from '../lib/assistantUtils';
import { localizeAssistantText } from '../lib/assistantLanguage';
import { buildDynamicQuickActions, buildSessionIntentContext } from '../lib/assistantWorkflow';

const ASSISTANT_ENDPOINT = '/.netlify/functions/portfolio-chat';
const RESPONSE_DELAY_MS = 320;
const REQUEST_TIMEOUT_MS = 12000;
const SPEAKING_STATE_MS = 2400;

type ReplyFailureReason = 'network' | 'provider' | 'invalid_response' | 'rate_limited';

export function useAssistant(): UseAssistantReturn {
    const restoredSession = useMemo(() => loadAssistantSession(), []);
    const [isOpen, setIsOpen] = useState(Boolean(restoredSession?.hasOpened));
    const [isTyping, setIsTyping] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<AssistantMessage[]>(restoredSession?.messages ?? []);
    const [sessionContext, setSessionContext] = useState<AssistantSessionIntentContext | null>(restoredSession?.sessionContext ?? null);
    const messagesRef = useRef<AssistantMessage[]>(restoredSession?.messages ?? []);
    const sessionContextRef = useRef<AssistantSessionIntentContext | null>(restoredSession?.sessionContext ?? null);
    const hasWelcomedRef = useRef(Boolean(restoredSession?.hasWelcomed || restoredSession?.messages?.length));
    const hasOpenedRef = useRef(Boolean(restoredSession?.hasOpened));
    const pendingRequestRef = useRef<AbortController | null>(null);
    const pendingInputRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);
    const speakingTimeoutRef = useRef<number | null>(null);
    const lastSummaryRef = useRef<string | null>(null);
    const lastLeadKeyRef = useRef<string | null>(null);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        sessionContextRef.current = sessionContext;
    }, [sessionContext]);

    const commercialSignals = useMemo(() => inferCommercialSignals(toAssistantHistory(messages)), [messages]);
    const inquirySummary = commercialSignals.summary;
    const orbState: AssistantOrbState = isTyping ? 'thinking' : isDrafting ? 'userTyping' : isSpeaking ? 'speaking' : 'idle';

    useEffect(() => {
        saveAssistantSession({
            messages: toStoredAssistantMessages(messages),
            hasWelcomed: hasWelcomedRef.current,
            hasOpened: isOpen,
            sessionContext,
        });
    }, [isOpen, messages, sessionContext]);

    useEffect(() => {
        if (messages.length > 0 && !hasWelcomedRef.current) {
            hasWelcomedRef.current = true;
        }
    }, [messages]);

    const triggerSpeakingState = useCallback(() => {
        if (speakingTimeoutRef.current) {
            window.clearTimeout(speakingTimeoutRef.current);
        }

        setIsSpeaking(true);
        speakingTimeoutRef.current = window.setTimeout(() => {
            setIsSpeaking(false);
            speakingTimeoutRef.current = null;
        }, SPEAKING_STATE_MS);
    }, []);

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
                confidence?: AssistantMessage['confidence'];
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
                    confidence: reply.confidence,
                });

                setMessages((current) => {
                    const nextMessages = [...current, nextMessage];
                    messagesRef.current = nextMessages;
                    return nextMessages;
                });
                setIsTyping(false);
                setIsDrafting(false);
                pendingInputRef.current = null;
                triggerSpeakingState();

                trackAssistantEvent('assistant_response_received', {
                    mode: nextMessage.mode ?? 'fallback',
                    intent: nextMessage.intent ?? 'general',
                    hasActions: Boolean(nextMessage.actions?.length),
                    hasCta: Boolean(nextMessage.cta),
                    hasRecommendations: Boolean(nextMessage.recommendations?.length),
                    qualificationStatus: nextMessage.qualification?.status ?? 'none',
                    confidence: nextMessage.confidence?.level ?? 'none',
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
        [triggerSpeakingState]
    );

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
            }
            if (speakingTimeoutRef.current) {
                window.clearTimeout(speakingTimeoutRef.current);
            }

            pendingRequestRef.current?.abort();
        };
    }, []);

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

        if (messagesRef.current.length > 0) {
            hasWelcomedRef.current = true;
            return;
        }

        const welcomeMessage = createAssistantMessage('assistant', assistantKnowledge.welcomeMessage, undefined, undefined, {
            intent: 'general',
            confidence: { level: 'high' },
        });

        hasWelcomedRef.current = true;
        messagesRef.current = [welcomeMessage];
        setMessages([welcomeMessage]);
    }, []);

    const openAssistant = useCallback(() => {
        ensureWelcome();

        if (!hasOpenedRef.current) {
            hasOpenedRef.current = true;
        }

        setIsOpen((current) => {
            if (!current) {
                trackAssistantEvent('assistant_opened', { restoredSession: Boolean(restoredSession?.messages?.length) });
            }

            return true;
        });
    }, [ensureWelcome, restoredSession]);

    const closeAssistant = useCallback(() => {
        setIsOpen(false);
        setIsDrafting(false);
        setIsSpeaking(false);
    }, []);

    const toggleAssistant = useCallback(() => {
        if (isOpen) {
            closeAssistant();
            return;
        }

        openAssistant();
    }, [closeAssistant, isOpen, openAssistant]);

    const requestAssistantReply = useCallback(
        async (historyMessages: AssistantMessage[], input: string, nextContext: AssistantSessionIntentContext | null) => {
            const controller = new AbortController();
            pendingRequestRef.current = controller;

            const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            const compactHistory = toAssistantHistory(historyMessages);

            try {
                const payload: AssistantApiRequest = {
                    message: trimAssistantContent(input, 500),
                    history: compactHistory,
                    sessionContext: nextContext ?? undefined,
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

                    const rateLimitedReply = data ?? buildRateLimitedReply(nextContext?.language ?? sessionContextRef.current?.language ?? 'en');

                    appendAssistantReply(
                        {
                            content: 'message' in rateLimitedReply ? rateLimitedReply.message : rateLimitedReply.content,
                            actions: rateLimitedReply.actions,
                            mode: 'fallback',
                            intent: rateLimitedReply.intent ?? 'general',
                            cta: rateLimitedReply.cta,
                            recommendations: rateLimitedReply.recommendations,
                            qualification: rateLimitedReply.qualification,
                            confidence: rateLimitedReply.confidence,
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
                    confidence: data.confidence,
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

                const fallback = buildLocalAssistantReply(input, compactHistory, nextContext);
                appendAssistantReply(
                    {
                        content: fallback.content,
                        actions: fallback.actions,
                        mode: 'fallback',
                        intent: fallback.intent,
                        cta: fallback.cta,
                        recommendations: fallback.recommendations,
                        qualification: fallback.qualification,
                        confidence: fallback.confidence,
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
            setIsSpeaking(false);
            pendingInputRef.current = normalized;

            trackAssistantEvent('assistant_message_sent', {
                length: trimmed.length,
                source,
            });

            const currentMessages = messagesRef.current;
            const userMessage = createAssistantMessage('user', trimmed);
            const nextMessages = [...currentMessages, userMessage];
            const nextContext = buildSessionIntentContext(toAssistantHistory(nextMessages), sessionContextRef.current);

            messagesRef.current = nextMessages;
            setMessages(nextMessages);
            setSessionContext(nextContext);

            const localReply = buildLocalAssistantReply(trimmed, toAssistantHistory(currentMessages), nextContext);
            const shouldUseLocalOnly =
                localReply.mode === 'fallback' &&
                ((localReply.intent === 'lead' && nextContext?.currentWorkflow?.status === 'collecting') ||
                    localReply.confidence?.level === 'low');

            if (shouldUseLocalOnly) {
                appendAssistantReply(
                    {
                        content: localReply.content,
                        actions: localReply.actions,
                        mode: 'fallback',
                        intent: localReply.intent,
                        cta: localReply.cta,
                        recommendations: localReply.recommendations,
                        qualification: localReply.qualification,
                        confidence: localReply.confidence,
                    },
                    'local_rule'
                );
                return;
            }

            void requestAssistantReply(currentMessages, trimmed, nextContext);
        },
        [appendAssistantReply, ensureWelcome, isTyping, requestAssistantReply]
    );

    const handleQuickAction = useCallback(
        (action: QuickAction) => {
            openAssistant();
            submitMessage(action.prompt, 'quick_action');
        },
        [openAssistant, submitMessage]
    );

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

    const handleBusinessAction = useCallback(
        async (action: Extract<AssistantAction, { type: 'business' }>) => {
            switch (action.target) {
                case 'continue_to_contact':
                    handoffToContact();
                    return;
                case 'show_pricing_for_current_service':
                    runAssistantAction(createScrollAction('pricing', 'See pricing'));
                    return;
                case 'show_relevant_work':
                    runAssistantAction({
                        id: `business-work-${action.filter ?? 'all'}`,
                        label: localizeAssistantText(sessionContextRef.current?.language ?? 'en', { en: 'View work', sw: 'Angalia kazi', fr: 'Voir le travail' }),
                        type: 'scroll',
                        target: 'works',
                        filter: action.filter ?? sessionContextRef.current?.relevantCategory,
                    });
                    return;
                case 'copy_project_summary':
                    await handleCopyInquirySummary();
                    return;
                case 'build_project_brief':
                    appendAssistantReply({
                        content: inquirySummary?.summaryText
                            ? localizeAssistantText(sessionContextRef.current?.language ?? 'en', {
                                  en: 'I have the project summary ready. You can copy it or continue to contact.',
                                  sw: 'Muhtasari wa mradi uko tayari. Unaweza kuunakili au kuendelea kwenye contact.',
                                  fr: 'Le resume du projet est pret. Vous pouvez le copier ou continuer vers le contact.',
                              })
                            : localizeAssistantText(sessionContextRef.current?.language ?? 'en', {
                                  en: 'Share a little more about the project and I will shape the brief with you.',
                                  sw: 'Shiriki maelezo kidogo zaidi kuhusu mradi, nami nitakusaidia kuunda brief.',
                                  fr: 'Partagez un peu plus de details sur le projet et je vous aiderai a structurer le brief.',
                              }),
                        actions: inquirySummary?.summaryText
                            ? [
                                  {
                                      id: 'business-copy-summary',
                                      label: localizeAssistantText(sessionContextRef.current?.language ?? 'en', { en: 'Copy summary', sw: 'Nakili muhtasari', fr: 'Copier le resume' }),
                                      type: 'business',
                                      target: 'copy_project_summary',
                                      workflow: action.workflow,
                                  },
                                  {
                                      id: 'business-contact-summary',
                                      label: localizeAssistantText(sessionContextRef.current?.language ?? 'en', { en: 'Continue to contact', sw: 'Endelea contact', fr: 'Continuer vers contact' }),
                                      type: 'business',
                                      target: 'continue_to_contact',
                                      workflow: action.workflow,
                                  },
                              ]
                            : undefined,
                        mode: 'fallback',
                        intent: 'lead',
                        confidence: { level: inquirySummary?.summaryText ? 'high' : 'medium' },
                    }, 'local_rule');
                    return;
                case 'start_project_request':
                    submitMessage(
                        localizeAssistantText(sessionContextRef.current?.language ?? 'en', {
                            en: `I want to start a ${action.workflow ?? 'project'} project`,
                            sw: `Nataka kuanza mradi wa ${action.workflow ?? 'project'}`,
                            fr: `Je veux commencer un projet de ${action.workflow ?? 'projet'}`,
                        }),
                        'quick_action'
                    );
                    return;
            }
        },
        [appendAssistantReply, handoffToContact, handleCopyInquirySummary, inquirySummary, submitMessage]
    );

    const handleMessageAction = useCallback(
        (action: AssistantAction) => {
            trackAssistantEvent('assistant_action_clicked', {
                actionId: action.id,
                target: action.target,
            });

            if (action.type === 'business') {
                void handleBusinessAction(action);
                return;
            }

            runAssistantAction(action);
        },
        [handleBusinessAction]
    );

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

    const handleUseInquirySummary = useCallback(() => {
        handoffToContact();
    }, [handoffToContact]);

    const latestAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant');
    const showQuickActions = Boolean(latestAssistantMessage) && !isTyping;
    const quickActions = useMemo(() => buildDynamicQuickActions(sessionContext), [sessionContext]);

    return {
        isOpen,
        isTyping,
        orbState,
        messages,
        showQuickActions,
        quickActions,
        inquirySummary,
        sessionContext,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        submitMessage,
        setIsDrafting,
        handleQuickAction,
        handleMessageAction,
        handleMessageCta,
        handleRecommendationClick,
        handleCopyInquirySummary,
        handleUseInquirySummary,
    };
}
