import type { AssistantMessage, AssistantPersistedState } from './assistantTypes';

const STORAGE_KEY = 'portfolio-assistant-session';
const INQUIRY_DRAFT_KEY = 'portfolio-assistant-inquiry-draft';
const MAX_STORED_MESSAGES = 10;

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
