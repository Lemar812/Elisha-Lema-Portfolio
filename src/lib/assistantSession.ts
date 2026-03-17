import type { AssistantMessage, AssistantPersistedState, AssistantSessionIntentContext } from './assistantTypes';

const STORAGE_KEY = 'portfolio-assistant-session';
const INQUIRY_DRAFT_KEY = 'portfolio-assistant-inquiry-draft';
const MAX_STORED_MESSAGES = 16;

function canUseSessionStorage() {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function sanitizePersistedMessages(messages: unknown): AssistantMessage[] {
    if (!Array.isArray(messages)) {
        return [];
    }

    return messages
        .filter((message): message is AssistantMessage => {
            if (!message || typeof message !== 'object') {
                return false;
            }

            const candidate = message as Partial<AssistantMessage>;
            return (
                (candidate.role === 'user' || candidate.role === 'assistant') &&
                typeof candidate.id === 'string' &&
                typeof candidate.content === 'string' &&
                candidate.content.trim().length > 0 &&
                typeof candidate.createdAt === 'number'
            );
        })
        .map((message) => ({
            ...message,
            content: message.content.trim(),
        }))
        .slice(-MAX_STORED_MESSAGES);
}

function sanitizeSessionContext(context: unknown): AssistantSessionIntentContext | null {
    if (!context || typeof context !== 'object') {
        return null;
    }

    const candidate = context as Partial<AssistantSessionIntentContext>;

    if (candidate.language !== 'en' && candidate.language !== 'sw' && candidate.language !== 'fr' && candidate.language !== 'es') {
        return null;
    }

    const selectedService =
        candidate.selectedService === 'logo' ||
        candidate.selectedService === 'poster' ||
        candidate.selectedService === 'website' ||
        candidate.selectedService === 'branding' ||
        candidate.selectedService === 'hiring'
            ? candidate.selectedService
            : null;

    const currentWorkflow =
        candidate.currentWorkflow &&
        typeof candidate.currentWorkflow === 'object' &&
        (candidate.currentWorkflow.type === 'logo' ||
            candidate.currentWorkflow.type === 'poster' ||
            candidate.currentWorkflow.type === 'website' ||
            candidate.currentWorkflow.type === 'branding' ||
            candidate.currentWorkflow.type === 'hiring') &&
        (candidate.currentWorkflow.status === 'collecting' || candidate.currentWorkflow.status === 'ready')
            ? candidate.currentWorkflow
            : null;

    return {
        language: candidate.language,
        selectedService,
        currentWorkflow,
        projectType: typeof candidate.projectType === 'string' ? candidate.projectType.trim() : undefined,
        goal: typeof candidate.goal === 'string' ? candidate.goal.trim() : undefined,
        timeline: typeof candidate.timeline === 'string' ? candidate.timeline.trim() : undefined,
        relevantCategory:
            candidate.relevantCategory === 'Logo' ||
            candidate.relevantCategory === 'Poster/Banner' ||
            candidate.relevantCategory === "Website's Screenshot"
                ? candidate.relevantCategory
                : undefined,
        categoryInterest: Array.isArray(candidate.categoryInterest)
            ? candidate.categoryInterest.filter((value): value is string => typeof value === 'string').slice(0, 4)
            : [],
        leadStatus: candidate.leadStatus === 'likelyLead' ? 'likelyLead' : 'browsing',
        serviceTypes: Array.isArray(candidate.serviceTypes)
            ? candidate.serviceTypes.filter(
                  (value): value is AssistantSessionIntentContext['serviceTypes'][number] =>
                      value === 'web-development' ||
                      value === 'branding-design' ||
                      value === 'design-development' ||
                      value === 'portfolio-brand' ||
                      value === 'business-brand' ||
                      value === 'graphic-design' ||
                      value === 'general'
              )
            : ['general'],
    };
}

export function loadAssistantSession(): AssistantPersistedState | null {
    if (!canUseSessionStorage()) {
        return null;
    }

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<AssistantPersistedState>;

        return {
            messages: sanitizePersistedMessages(parsed.messages),
            hasWelcomed: Boolean(parsed.hasWelcomed),
            hasOpened: Boolean(parsed.hasOpened),
            sessionContext: sanitizeSessionContext(parsed.sessionContext),
        };
    } catch {
        return null;
    }
}

export function saveAssistantSession(state: AssistantPersistedState) {
    if (!canUseSessionStorage()) {
        return;
    }

    const payload: AssistantPersistedState = {
        messages: sanitizePersistedMessages(state.messages),
        hasWelcomed: state.hasWelcomed,
        hasOpened: state.hasOpened,
        sessionContext: sanitizeSessionContext(state.sessionContext),
    };

    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        return;
    }
}

export function saveInquiryDraft(summaryText: string) {
    if (!canUseSessionStorage()) {
        return;
    }

    try {
        window.sessionStorage.setItem(INQUIRY_DRAFT_KEY, summaryText);
        window.dispatchEvent(new CustomEvent('portfolio-assistant-inquiry-draft', { detail: { summaryText } }));
    } catch {
        return;
    }
}

export function loadInquiryDraft() {
    if (!canUseSessionStorage()) {
        return '';
    }

    try {
        return window.sessionStorage.getItem(INQUIRY_DRAFT_KEY)?.trim() ?? '';
    } catch {
        return '';
    }
}

export function clearInquiryDraft() {
    if (!canUseSessionStorage()) {
        return;
    }

    try {
        window.sessionStorage.removeItem(INQUIRY_DRAFT_KEY);
    } catch {
        return;
    }
}
