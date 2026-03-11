import { assistantKnowledge } from '../data/assistantKnowledge';
import { inferCommercialSignals } from './assistantLeadUtils';
import type {
    AssistantAction,
    AssistantActionTarget,
    AssistantApiResponse,
    AssistantCta,
    AssistantHistoryEntry,
    AssistantIntent,
    AssistantMessage,
    AssistantQualification,
    AssistantRecommendation,
    AssistantReply,
    AssistantResponseIntent,
} from './assistantTypes';

const SECTION_LABELS: Record<AssistantActionTarget, string> = {
    hero: 'Back to top',
    skills: 'View skills',
    works: 'View projects',
    services: 'Go to services',
    about: 'Read about',
    testimonials: 'See testimonials',
    contact: 'Open contact',
};

const VALID_ACTION_TARGETS = new Set<AssistantActionTarget>([
    'hero',
    'skills',
    'works',
    'services',
    'about',
    'testimonials',
    'contact',
]);

const LEAD_KEYWORDS = [
    'hire',
    'work with you',
    'start a project',
    'pricing',
    'price',
    'quote',
    'availability',
    'available',
    'budget',
    'contact',
];

const INTENT_KEYWORDS: Record<AssistantIntent, string[]> = {
    greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    projects: ['project', 'projects', 'work', 'works', 'portfolio', 'case study', 'gallery'],
    services: ['service', 'services', 'offer', 'offering', 'help with', 'what do you do', 'branding', 'website'],
    skills: ['skill', 'skills', 'stack', 'tools', 'tech', 'technology', 'software'],
    about: ['about', 'who are you', 'who is', 'background', 'bio'],
    testimonials: ['testimonial', 'testimonials', 'review', 'reviews', 'client feedback', 'social proof'],
    contact: ['contact', 'reach out', 'email', 'call', 'book'],
    lead: LEAD_KEYWORDS,
    outOfScope: ['weather', 'news', 'politics', 'sports', 'recipe', 'stock', 'bitcoin', 'math homework'],
    unknown: [],
};

const HISTORY_LIMIT = 8;
const STORED_HISTORY_LIMIT = 10;

export function normalizeAssistantText(value: string) {
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function trimAssistantContent(value: string, maxLength = 700) {
    return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function detectAssistantIntent(input: string): AssistantIntent {
    const normalized = normalizeAssistantText(input);

    if (LEAD_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
        return 'lead';
    }

    for (const intent of Object.keys(INTENT_KEYWORDS) as AssistantIntent[]) {
        if (intent === 'unknown' || intent === 'lead') {
            continue;
        }

        if (INTENT_KEYWORDS[intent].some((keyword) => normalized.includes(keyword))) {
            return intent;
        }
    }

    return 'unknown';
}

export function createScrollAction(
    target: AssistantActionTarget,
    label = SECTION_LABELS[target]
): AssistantAction {
    return {
        id: `scroll-${target}`,
        label,
        type: 'scroll',
        target,
    };
}

export function createContactCta(label = assistantKnowledge.contactCtaLabel): AssistantCta {
    return {
        label,
        type: 'scroll',
        target: 'contact',
    };
}

export function sanitizeAssistantAction(action: unknown): AssistantAction | null {
    if (!action || typeof action !== 'object') {
        return null;
    }

    const candidate = action as Partial<AssistantAction> & { target?: unknown };

    if (candidate.type !== 'scroll' || typeof candidate.label !== 'string' || typeof candidate.id !== 'string') {
        return null;
    }

    if (typeof candidate.target !== 'string' || !VALID_ACTION_TARGETS.has(candidate.target as AssistantActionTarget)) {
        return null;
    }

    return {
        id: candidate.id.trim().slice(0, 60) || `scroll-${candidate.target}`,
        label: candidate.label.trim().slice(0, 40) || SECTION_LABELS[candidate.target as AssistantActionTarget],
        type: 'scroll',
        target: candidate.target as AssistantActionTarget,
    };
}

export function sanitizeAssistantActions(actions: unknown): AssistantAction[] | undefined {
    if (!Array.isArray(actions)) {
        return undefined;
    }

    const safeActions = actions
        .map((action) => sanitizeAssistantAction(action))
        .filter((action): action is AssistantAction => Boolean(action))
        .slice(0, 3);

    return safeActions.length ? safeActions : undefined;
}

export function sanitizeAssistantCta(cta: unknown): AssistantCta | undefined {
    if (!cta || typeof cta !== 'object') {
        return undefined;
    }

    const candidate = cta as Partial<AssistantCta>;

    if (candidate.type !== 'scroll' || candidate.target !== 'contact' || typeof candidate.label !== 'string') {
        return undefined;
    }

    const label = candidate.label.trim().slice(0, 40);

    if (!label) {
        return undefined;
    }

    return {
        label,
        type: 'scroll',
        target: 'contact',
    };
}

export function sanitizeAssistantIntent(intent: unknown): AssistantResponseIntent {
    if (
        intent === 'general' ||
        intent === 'contact' ||
        intent === 'projects' ||
        intent === 'services' ||
        intent === 'skills' ||
        intent === 'about' ||
        intent === 'lead'
    ) {
        return intent;
    }

    return 'general';
}

export function sanitizeAssistantRecommendations(recommendations: unknown): AssistantRecommendation[] | undefined {
    if (!Array.isArray(recommendations)) {
        return undefined;
    }

    const safeRecommendations = recommendations
        .map((recommendation) => {
            if (!recommendation || typeof recommendation !== 'object') {
                return null;
            }

            const candidate = recommendation as Partial<AssistantRecommendation>;

            if (
                typeof candidate.id !== 'string' ||
                typeof candidate.title !== 'string' ||
                typeof candidate.reason !== 'string' ||
                candidate.target !== 'works'
            ) {
                return null;
            }

            return {
                id: trimAssistantContent(candidate.id, 60),
                title: trimAssistantContent(candidate.title, 60),
                reason: trimAssistantContent(candidate.reason, 140),
                target: 'works' as const,
            };
        })
        .filter((recommendation): recommendation is AssistantRecommendation => Boolean(recommendation))
        .slice(0, 2);

    return safeRecommendations.length ? safeRecommendations : undefined;
}

export function sanitizeAssistantQualification(qualification: unknown): AssistantQualification | undefined {
    if (!qualification || typeof qualification !== 'object') {
        return undefined;
    }

    const candidate = qualification as Partial<AssistantQualification>;

    if (
        candidate.status !== 'insufficient' &&
        candidate.status !== 'partial' &&
        candidate.status !== 'sufficient'
    ) {
        return undefined;
    }

    return {
        status: candidate.status,
        missingFields: Array.isArray(candidate.missingFields)
            ? candidate.missingFields.filter((field): field is string => typeof field === 'string').slice(0, 3)
            : undefined,
    };
}

export function createAssistantMessage(
    role: AssistantMessage['role'],
    content: string,
    actions?: AssistantReply['actions'],
    mode?: AssistantMessage['mode'],
    extras?: Pick<AssistantMessage, 'intent' | 'cta' | 'recommendations' | 'qualification'>
): AssistantMessage {
    return {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        content: trimAssistantContent(content),
        createdAt: Date.now(),
        actions: sanitizeAssistantActions(actions),
        mode,
        intent: sanitizeAssistantIntent(extras?.intent),
        cta: sanitizeAssistantCta(extras?.cta),
        recommendations: sanitizeAssistantRecommendations(extras?.recommendations),
        qualification: sanitizeAssistantQualification(extras?.qualification),
    };
}

export function buildLocalAssistantReply(input: string, history: AssistantHistoryEntry[] = []): AssistantReply {
    const intent = detectAssistantIntent(input);
    const signals = inferCommercialSignals([...history, { role: 'user', content: input }]);

    switch (intent) {
        case 'greeting':
            return { content: assistantKnowledge.greetingMessage, mode: 'fallback', intent: 'general' };
        case 'lead':
            return {
                content:
                    signals.followUpQuestion ??
                    `${assistantKnowledge.leadCaptureMessage} ${signals.recommendations.length ? 'I can also point you to a relevant example.' : ''}`.trim(),
                actions: [createScrollAction('services', 'View services'), createScrollAction('contact', assistantKnowledge.projectBriefCtaLabel)],
                mode: 'fallback',
                intent: 'lead',
                cta: createContactCta(assistantKnowledge.contactCtaLabel),
                recommendations: signals.recommendations,
                qualification: signals.qualification,
            };
        case 'projects':
            return {
                content: assistantKnowledge.projectsSummary,
                actions: [createScrollAction('works', 'View projects'), createScrollAction('contact', 'Start a project')],
                mode: 'fallback',
                intent: 'projects',
                cta: createContactCta(assistantKnowledge.projectBriefCtaLabel),
                recommendations: signals.recommendations,
                qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
            };
        case 'services':
            return {
                content: assistantKnowledge.servicesSummary,
                actions: [createScrollAction('services', 'Go to services')],
                mode: 'fallback',
                intent: 'services',
                cta: createContactCta(assistantKnowledge.projectBriefCtaLabel),
                recommendations: signals.recommendations,
                qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
            };
        case 'skills':
            return {
                content: assistantKnowledge.skillsSummary,
                actions: [createScrollAction('skills', 'View skills')],
                mode: 'fallback',
                intent: 'skills',
            };
        case 'about':
            return {
                content: assistantKnowledge.aboutSummary,
                actions: [createScrollAction('about', 'Read about')],
                mode: 'fallback',
                intent: 'about',
            };
        case 'testimonials':
            return {
                content: assistantKnowledge.testimonialsSummary,
                actions: [createScrollAction('testimonials', 'See testimonials'), createScrollAction('contact', assistantKnowledge.contactCtaLabel)],
                mode: 'fallback',
                intent: 'general',
                cta: createContactCta(),
            };
        case 'contact':
            return {
                content: assistantKnowledge.contactSummary,
                actions: [createScrollAction('contact', 'Open contact')],
                mode: 'fallback',
                intent: 'contact',
                cta: createContactCta(),
                qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
            };
        case 'outOfScope':
            return {
                content: assistantKnowledge.scopeGuardMessage,
                actions: [createScrollAction('works', 'Projects'), createScrollAction('contact', 'Contact')],
                mode: 'fallback',
                intent: 'general',
                cta: createContactCta(),
            };
        default:
            return {
                content: assistantKnowledge.fallbackMessage,
                actions: [createScrollAction('works', 'Projects'), createScrollAction('contact', 'Contact')],
                mode: 'fallback',
                intent: 'general',
                recommendations: signals.recommendations,
            };
    }
}

export function buildRateLimitedReply(): AssistantReply {
    return {
        content: assistantKnowledge.rateLimitMessage,
        actions: [createScrollAction('contact', assistantKnowledge.contactCtaLabel)],
        mode: 'fallback',
        intent: 'general',
    };
}

export function toAssistantHistory(messages: AssistantMessage[]): AssistantHistoryEntry[] {
    return messages
        .filter((message) => message.role === 'user' || message.role === 'assistant')
        .slice(-HISTORY_LIMIT)
        .map((message) => ({
            role: message.role,
            content: trimAssistantContent(message.content, 400),
        }));
}

export function toStoredAssistantMessages(messages: AssistantMessage[]) {
    return messages.slice(-STORED_HISTORY_LIMIT).map((message) => ({
        ...message,
        content: trimAssistantContent(message.content, 700),
        actions: sanitizeAssistantActions(message.actions),
        intent: sanitizeAssistantIntent(message.intent),
        cta: sanitizeAssistantCta(message.cta),
        recommendations: sanitizeAssistantRecommendations(message.recommendations),
        qualification: sanitizeAssistantQualification(message.qualification),
    }));
}

export function isAssistantApiResponse(value: unknown): value is AssistantApiResponse {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Partial<AssistantApiResponse>;
    return (
        typeof candidate.message === 'string' &&
        (candidate.mode === 'ai' || candidate.mode === 'fallback') &&
        (candidate.actions === undefined || Array.isArray(candidate.actions))
    );
}

export function sanitizeAssistantApiResponse(value: unknown): AssistantApiResponse | null {
    if (!isAssistantApiResponse(value)) {
        return null;
    }

    const response = value as AssistantApiResponse;
    const message = trimAssistantContent(response.message);

    if (!message) {
        return null;
    }

    return {
        message,
        mode: response.mode,
        actions: sanitizeAssistantActions(response.actions),
        source: typeof response.source === 'string' ? response.source : undefined,
        intent: sanitizeAssistantIntent(response.intent),
        cta: sanitizeAssistantCta(response.cta),
        recommendations: sanitizeAssistantRecommendations(response.recommendations),
        qualification: sanitizeAssistantQualification(response.qualification),
        reason: response.reason === 'rate_limited' ? 'rate_limited' : undefined,
    };
}

export function formatAssistantTimestamp(timestamp: number) {
    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    }).format(timestamp);
}
