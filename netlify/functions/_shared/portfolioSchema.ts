import type {
    AssistantAction,
    AssistantApiRequest,
    AssistantApiResponse,
    AssistantBusinessActionTarget,
    AssistantConfidence,
    AssistantCta,
    AssistantHistoryEntry,
    AssistantQualification,
    AssistantRecommendation,
    AssistantResponseIntent,
    AssistantRouteTarget,
    AssistantSectionTarget,
    AssistantSessionIntentContext,
    AssistantWorksFilter,
} from '../../../src/lib/assistantTypes';

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_LENGTH = 8;
const MAX_HISTORY_ITEM_LENGTH = 400;
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
const VALID_BUSINESS_TARGETS = new Set<AssistantBusinessActionTarget>([
    'start_project_request',
    'build_project_brief',
    'continue_to_contact',
    'copy_project_summary',
    'show_relevant_work',
    'show_pricing_for_current_service',
]);
const VALID_WORK_FILTERS = new Set<AssistantWorksFilter>(['Logo', 'Poster/Banner', "Website's Screenshot"]);

function sanitizeText(value: string, maxLength: number) {
    return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function sanitizeIntent(intent: unknown): AssistantResponseIntent {
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

function sanitizeCta(cta: unknown): AssistantCta | undefined {
    if (!cta || typeof cta !== 'object') {
        return undefined;
    }

    const candidate = cta as Partial<AssistantCta>;

    if (candidate.type !== 'scroll' || candidate.target !== 'contact' || typeof candidate.label !== 'string') {
        return undefined;
    }

    const label = sanitizeText(candidate.label, 40);

    if (!label) {
        return undefined;
    }

    return { label, type: 'scroll', target: 'contact' };
}

function sanitizeConfidence(confidence: unknown): AssistantConfidence | undefined {
    if (!confidence || typeof confidence !== 'object') {
        return undefined;
    }

    const candidate = confidence as Partial<AssistantConfidence>;

    if (candidate.level !== 'low' && candidate.level !== 'medium' && candidate.level !== 'high') {
        return undefined;
    }

    return {
        level: candidate.level,
        redirectLabel: typeof candidate.redirectLabel === 'string' ? sanitizeText(candidate.redirectLabel, 40) : undefined,
        escalateToContact: Boolean(candidate.escalateToContact),
    };
}

function sanitizeRecommendation(recommendation: unknown): AssistantRecommendation | null {
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
        id: sanitizeText(candidate.id, 60),
        title: sanitizeText(candidate.title, 60),
        reason: sanitizeText(candidate.reason, 140),
        target: 'works',
    };
}

function sanitizeQualification(qualification: unknown): AssistantQualification | undefined {
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

export function parseAssistantRequest(body: string | null): AssistantApiRequest | { error: string; statusCode: number } {
    if (!body) {
        return { error: 'Request body is required.', statusCode: 400 };
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(body);
    } catch {
        return { error: 'Request body must be valid JSON.', statusCode: 400 };
    }

    if (!parsed || typeof parsed !== 'object') {
        return { error: 'Request body must be an object.', statusCode: 400 };
    }

    const candidate = parsed as Partial<AssistantApiRequest>;

    if (typeof candidate.message !== 'string') {
        return { error: 'Message must be a string.', statusCode: 400 };
    }

    const message = sanitizeText(candidate.message, MAX_MESSAGE_LENGTH);

    if (!message) {
        return { error: 'Message cannot be empty.', statusCode: 400 };
    }

    if (candidate.history !== undefined && !Array.isArray(candidate.history)) {
        return { error: 'History must be an array when provided.', statusCode: 400 };
    }

    const rawHistory = (candidate.history ?? []).slice(-MAX_HISTORY_LENGTH);
    const history: AssistantHistoryEntry[] = [];

    for (const item of rawHistory) {
        if (!item || typeof item !== 'object') {
            return { error: 'Each history item must be an object.', statusCode: 400 };
        }

        const entry = item as Partial<AssistantHistoryEntry>;

        if ((entry.role !== 'user' && entry.role !== 'assistant') || typeof entry.content !== 'string') {
            return { error: 'Each history item must include a valid role and content.', statusCode: 400 };
        }

        const content = sanitizeText(entry.content, MAX_HISTORY_ITEM_LENGTH);

        if (!content) {
            return { error: 'History content cannot be empty.', statusCode: 400 };
        }

        history.push({ role: entry.role, content });
    }

    let sessionContext: AssistantSessionIntentContext | undefined;

    if (candidate.sessionContext !== undefined) {
        if (!candidate.sessionContext || typeof candidate.sessionContext !== 'object') {
            return { error: 'Session context must be an object when provided.', statusCode: 400 };
        }

        const context = candidate.sessionContext as Partial<AssistantSessionIntentContext>;
        sessionContext = {
            language: context.language === 'sw' ? 'sw' : context.language === 'fr' ? 'fr' : context.language === 'es' ? 'es' : 'en',
            selectedService:
                context.selectedService === 'logo' ||
                context.selectedService === 'poster' ||
                context.selectedService === 'website' ||
                context.selectedService === 'branding' ||
                context.selectedService === 'hiring'
                    ? context.selectedService
                    : null,
            currentWorkflow:
                context.currentWorkflow &&
                typeof context.currentWorkflow === 'object' &&
                (context.currentWorkflow.type === 'logo' ||
                    context.currentWorkflow.type === 'poster' ||
                    context.currentWorkflow.type === 'website' ||
                    context.currentWorkflow.type === 'branding' ||
                    context.currentWorkflow.type === 'hiring') &&
                (context.currentWorkflow.status === 'collecting' || context.currentWorkflow.status === 'ready')
                    ? context.currentWorkflow
                    : null,
            projectType: typeof context.projectType === 'string' ? sanitizeText(context.projectType, 80) : undefined,
            goal: typeof context.goal === 'string' ? sanitizeText(context.goal, 120) : undefined,
            timeline: typeof context.timeline === 'string' ? sanitizeText(context.timeline, 60) : undefined,
            relevantCategory:
                context.relevantCategory === 'Logo' ||
                context.relevantCategory === 'Poster/Banner' ||
                context.relevantCategory === "Website's Screenshot"
                    ? context.relevantCategory
                    : undefined,
            categoryInterest: Array.isArray(context.categoryInterest)
                ? context.categoryInterest.filter((value): value is string => typeof value === 'string').slice(0, 4)
                : [],
            leadStatus: context.leadStatus === 'likelyLead' ? 'likelyLead' : 'browsing',
            serviceTypes: Array.isArray(context.serviceTypes)
                ? context.serviceTypes.filter(
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

    return { message, history, sessionContext };
}

function extractJsonObject(content: string) {
    const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fencedMatch ? fencedMatch[1].trim() : content.trim();
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        return null;
    }

    return candidate.slice(firstBrace, lastBrace + 1);
}

function extractPlainTextFallback(content: string) {
    const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const source = fencedMatch ? fencedMatch[1] : content;
    const withoutBraces = source.replace(/^[^{]*\{[\s\S]*\}[^}]*$/m, '').trim();
    const cleaned = sanitizeText((withoutBraces || source).replace(/```/g, '').replace(/^json\s*/i, ''), 700);
    return cleaned || null;
}

function sanitizeAction(action: unknown): AssistantAction | null {
    if (!action || typeof action !== 'object') {
        return null;
    }

    const candidate = action as Partial<AssistantAction> & { target?: unknown; filter?: unknown; workflow?: unknown };

    if (typeof candidate.label !== 'string' || typeof candidate.id !== 'string' || typeof candidate.target !== 'string') {
        return null;
    }

    const id = sanitizeText(candidate.id, 60);
    const label = sanitizeText(candidate.label, 40);

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

    if (candidate.type === 'business' && VALID_BUSINESS_TARGETS.has(candidate.target as AssistantBusinessActionTarget)) {
        return {
            id,
            label,
            type: 'business',
            target: candidate.target as AssistantBusinessActionTarget,
            workflow:
                candidate.workflow === 'logo' ||
                candidate.workflow === 'poster' ||
                candidate.workflow === 'website' ||
                candidate.workflow === 'branding' ||
                candidate.workflow === 'hiring'
                    ? candidate.workflow
                    : undefined,
            filter:
                typeof candidate.filter === 'string' && VALID_WORK_FILTERS.has(candidate.filter as AssistantWorksFilter)
                    ? (candidate.filter as AssistantWorksFilter)
                    : undefined,
        };
    }

    return null;
}

export function parseAssistantModelResponse(content: string): AssistantApiResponse | null {
    const jsonBlock = extractJsonObject(content);
    if (jsonBlock) {
        let parsed: unknown;

        try {
            parsed = JSON.parse(jsonBlock);
        } catch {
            parsed = null;
        }

        if (parsed && typeof parsed === 'object') {
            const candidate = parsed as Partial<AssistantApiResponse>;

            if (typeof candidate.message === 'string') {
                const message = sanitizeText(candidate.message, 700);

                if (message) {
                    const actions = Array.isArray(candidate.actions)
                        ? candidate.actions.map((action) => sanitizeAction(action)).filter((action): action is AssistantAction => Boolean(action)).slice(0, 3)
                        : undefined;

                    const recommendations = Array.isArray(candidate.recommendations)
                        ? candidate.recommendations
                              .map((recommendation) => sanitizeRecommendation(recommendation))
                              .filter((recommendation): recommendation is AssistantRecommendation => Boolean(recommendation))
                              .slice(0, 2)
                        : undefined;

                    return {
                        message,
                        actions: actions && actions.length ? actions : undefined,
                        mode: 'ai',
                        intent: sanitizeIntent(candidate.intent),
                        cta: sanitizeCta(candidate.cta),
                        recommendations: recommendations && recommendations.length ? recommendations : undefined,
                        qualification: sanitizeQualification(candidate.qualification),
                        confidence: sanitizeConfidence(candidate.confidence),
                    };
                }
            }
        }
    }

    const fallbackMessage = extractPlainTextFallback(content);

    if (!fallbackMessage) {
        return null;
    }

    return {
        message: fallbackMessage,
        actions: undefined,
        mode: 'fallback',
        intent: 'general',
    };
}

export function jsonResponse(statusCode: number, payload: unknown) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
    };
}
