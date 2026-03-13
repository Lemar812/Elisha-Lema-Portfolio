import type {
    AssistantAction,
    AssistantApiResponse,
    AssistantCta,
    AssistantHistoryEntry,
    AssistantIntent,
    AssistantMessage,
    AssistantQualification,
    AssistantRecommendation,
    AssistantReply,
    AssistantResponseIntent,
    AssistantRouteTarget,
    AssistantSectionTarget,
    AssistantSiteFeature,
    AssistantWorksCategory,
    AssistantWorksFilter,
} from './assistantTypes';
import { assistantKnowledge } from '../data/assistantKnowledge';
import { assistantSiteFeatures } from '../data/siteFeatures';
import { assistantWorkCategories } from '../data/workCategories';
import { inferCommercialSignals } from './assistantLeadUtils';

const SECTION_LABELS: Record<AssistantSectionTarget, string> = {
    hero: 'Back to top',
    skills: 'View skills',
    works: 'View projects',
    services: 'Go to services',
    pricing: 'See pricing',
    about: 'Read about',
    testimonials: 'See testimonials',
    contact: 'Open contact',
};

const ROUTE_LABELS: Record<AssistantRouteTarget, string> = {
    '/privacy-policy': 'Open Privacy Policy',
    '/terms-of-service': 'Open Terms of Service',
};

const VALID_SCROLL_TARGETS = new Set<AssistantSectionTarget>([
    'hero',
    'skills',
    'works',
    'services',
    'pricing',
    'about',
    'testimonials',
    'contact',
]);

const VALID_ROUTE_TARGETS = new Set<AssistantRouteTarget>(['/privacy-policy', '/terms-of-service']);
const VALID_WORK_FILTERS = new Set<AssistantWorksFilter>(['Logo', 'Poster/Banner', "Website's Screenshot"]);

const LEAD_KEYWORDS = ['hire', 'work with you', 'start a project', 'pricing', 'price', 'quote', 'availability', 'available', 'budget', 'contact'];

const INTENT_KEYWORDS: Record<AssistantIntent, string[]> = {
    greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    projects: ['project', 'projects', 'work', 'works', 'portfolio', 'case study', 'gallery', 'logo work', 'logos'],
    services: ['service', 'services', 'offer', 'offering', 'help with', 'what do you do', 'branding', 'website'],
    skills: ['skill', 'skills', 'stack', 'tools', 'tech', 'technology', 'software'],
    about: ['about', 'who are you', 'who is', 'background', 'bio'],
    testimonials: ['testimonial', 'testimonials', 'review', 'reviews', 'client feedback', 'social proof', 'client stories'],
    contact: ['contact', 'reach out', 'email', 'call', 'book', 'whatsapp'],
    lead: LEAD_KEYWORDS,
    outOfScope: ['weather', 'news', 'politics', 'sports', 'recipe', 'stock', 'bitcoin', 'math homework'],
    unknown: [],
};

const HISTORY_LIMIT = 8;
const STORED_HISTORY_LIMIT = 10;
const NAVIGATION_KEYWORDS = ['where', 'show', 'take me', 'go to', 'open', 'see', 'view', 'find', 'redirect'];

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

function hasNavigationIntent(input: string) {
    const normalized = normalizeAssistantText(input);
    return NAVIGATION_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function scoreSiteFeature(input: string, feature: AssistantSiteFeature) {
    const normalized = normalizeAssistantText(input);
    let score = 0;

    for (const keyword of feature.keywords) {
        const normalizedKeyword = normalizeAssistantText(keyword);

        if (normalized === normalizedKeyword) {
            score += 6;
            continue;
        }

        if (normalized.includes(normalizedKeyword)) {
            score += normalizedKeyword.includes(' ') ? 4 : 2;
        }
    }

    if (normalized.includes(normalizeAssistantText(feature.label))) {
        score += 3;
    }

    return score;
}

function scoreWorkCategory(input: string, category: AssistantWorksCategory) {
    const normalized = normalizeAssistantText(input);
    let score = 0;

    for (const keyword of category.keywords) {
        const normalizedKeyword = normalizeAssistantText(keyword);

        if (normalized === normalizedKeyword) {
            score += 7;
            continue;
        }

        if (normalized.includes(normalizedKeyword)) {
            score += normalizedKeyword.includes(' ') ? 5 : 3;
        }
    }

    return score;
}

function findAssistantSiteFeature(input: string) {
    const scoredFeature = assistantSiteFeatures
        .map((feature) => ({ feature, score: scoreSiteFeature(input, feature) }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)[0];

    return scoredFeature?.feature ?? null;
}

function findWorkCategory(input: string) {
    const scoredCategory = assistantWorkCategories
        .map((category) => ({ category, score: scoreWorkCategory(input, category) }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)[0];

    return scoredCategory?.category ?? null;
}

export function createScrollAction(
    target: AssistantSectionTarget,
    label = SECTION_LABELS[target],
    options?: { filter?: AssistantWorksFilter }
): AssistantAction {
    return {
        id: `scroll-${target}${options?.filter ? `-${options.filter.replace(/[^a-z]/gi, '-').toLowerCase()}` : ''}`,
        label,
        type: 'scroll',
        target,
        filter: target === 'works' && options?.filter && VALID_WORK_FILTERS.has(options.filter) ? options.filter : undefined,
    };
}

export function createRouteAction(target: AssistantRouteTarget, label = ROUTE_LABELS[target]): AssistantAction {
    return {
        id: `route-${target.replace(/[^a-z]/gi, '-')}`,
        label,
        type: 'route',
        target,
    };
}

export function createContactCta(label = assistantKnowledge.contactCtaLabel): AssistantCta {
    return { label, type: 'scroll', target: 'contact' };
}

export function sanitizeAssistantAction(action: unknown): AssistantAction | null {
    if (!action || typeof action !== 'object') {
        return null;
    }

    const candidate = action as Partial<AssistantAction> & { target?: unknown; filter?: unknown };

    if (typeof candidate.id !== 'string' || typeof candidate.label !== 'string' || typeof candidate.target !== 'string') {
        return null;
    }

    const id = candidate.id.trim().slice(0, 60);
    const label = candidate.label.trim().slice(0, 40);

    if (!id || !label) {
        return null;
    }

    if (candidate.type === 'scroll' && VALID_SCROLL_TARGETS.has(candidate.target as AssistantSectionTarget)) {
        const target = candidate.target as AssistantSectionTarget;
        const filter =
            target === 'works' && typeof candidate.filter === 'string' && VALID_WORK_FILTERS.has(candidate.filter as AssistantWorksFilter)
                ? (candidate.filter as AssistantWorksFilter)
                : undefined;

        return { id, label, type: 'scroll', target, filter };
    }

    if (candidate.type === 'route' && VALID_ROUTE_TARGETS.has(candidate.target as AssistantRouteTarget)) {
        return { id, label, type: 'route', target: candidate.target as AssistantRouteTarget };
    }

    return null;
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

    return { label, type: 'scroll', target: 'contact' };
}

export function sanitizeAssistantIntent(intent: unknown): AssistantResponseIntent {
    if (intent === 'general' || intent === 'contact' || intent === 'projects' || intent === 'services' || intent === 'skills' || intent === 'about' || intent === 'lead') {
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

    if (candidate.status !== 'insufficient' && candidate.status !== 'partial' && candidate.status !== 'sufficient') {
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

function buildFeatureNavigationReply(feature: AssistantSiteFeature, signals: ReturnType<typeof inferCommercialSignals>): AssistantReply {
    const action = feature.actionType === 'route'
        ? createRouteAction(feature.target as AssistantRouteTarget, feature.label)
        : createScrollAction(feature.target as AssistantSectionTarget, feature.label);

    return {
        content: feature.description,
        actions: [action],
        mode: 'fallback',
        intent:
            feature.target === 'contact'
                ? 'contact'
                : feature.target === 'works'
                  ? 'projects'
                  : feature.target === 'services' || feature.target === 'pricing'
                    ? 'services'
                    : feature.target === 'skills'
                      ? 'skills'
                      : feature.target === 'about'
                        ? 'about'
                        : 'general',
        cta: feature.target === 'contact' ? createContactCta() : undefined,
        recommendations: feature.target === 'works' ? signals.recommendations : undefined,
        qualification: feature.target === 'contact' && signals.qualification.status !== 'insufficient' ? signals.qualification : undefined,
    };
}

function buildWorkCategoryReply(category: AssistantWorksCategory, signals: ReturnType<typeof inferCommercialSignals>): AssistantReply {
    const action = createScrollAction('works', category.label, { filter: category.filter });
    const matchingRecommendations = category.exampleProjectIds.length
        ? signals.recommendations?.filter((recommendation) => category.exampleProjectIds.includes(recommendation.id))
        : undefined;

    return {
        content: category.filter
            ? `${category.description} I can take you straight there in the gallery.`
            : `${category.description} I can take you to the gallery and highlight the closest matching pieces.`,
        actions: [action],
        mode: 'fallback',
        intent: 'projects',
        recommendations: matchingRecommendations?.length ? matchingRecommendations : signals.recommendations,
    };
}

export function buildLocalAssistantReply(input: string, history: AssistantHistoryEntry[] = []): AssistantReply {
    const intent = detectAssistantIntent(input);
    const signals = inferCommercialSignals([...history, { role: 'user', content: input }]);
    const matchedFeature = findAssistantSiteFeature(input);
    const matchedWorkCategory = findWorkCategory(input);

    if (matchedWorkCategory) {
        return buildWorkCategoryReply(matchedWorkCategory, signals);
    }

    if (
        matchedFeature &&
        (hasNavigationIntent(input) || matchedFeature.kind === 'page' || matchedFeature.target === 'pricing')
    ) {
        return buildFeatureNavigationReply(matchedFeature, signals);
    }

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
                actions: [createScrollAction('services', 'Go to services'), createScrollAction('pricing', 'See pricing')],
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
            if (matchedFeature) {
                return buildFeatureNavigationReply(matchedFeature, signals);
            }

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
