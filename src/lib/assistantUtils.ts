import type {
    AssistantAction,
    AssistantApiResponse,
    AssistantBusinessActionTarget,
    AssistantConfidence,
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
    AssistantSessionIntentContext,
    AssistantSiteFeature,
    AssistantWorksCategory,
    AssistantWorksFilter,
} from './assistantTypes';
import { assistantKnowledge } from '../data/assistantKnowledge';
import { assistantSiteFeatures } from '../data/siteFeatures';
import { assistantWorkCategories } from '../data/workCategories';
import { localizeAssistantText } from './assistantLanguage';
import { inferCommercialSignals } from './assistantLeadUtils';
import { buildGuidedWorkflowReply, buildSessionIntentContext, createBusinessAction } from './assistantWorkflow';

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
const VALID_BUSINESS_TARGETS = new Set<AssistantBusinessActionTarget>([
    'start_project_request',
    'build_project_brief',
    'continue_to_contact',
    'copy_project_summary',
    'show_relevant_work',
    'show_pricing_for_current_service',
]);
const VALID_WORK_FILTERS = new Set<AssistantWorksFilter>(['Logo', 'Poster/Banner', "Website's Screenshot"]);

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
    'need a logo',
    'need a website',
    'need branding',
];

const INTENT_KEYWORDS: Record<AssistantIntent, string[]> = {
    greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'habari', 'mambo'],
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
const STORED_HISTORY_LIMIT = 16;
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

function getLocalizedKnowledgeText(
    language: AssistantSessionIntentContext['language'],
    key:
        | 'greetingMessage'
        | 'leadCaptureMessage'
        | 'projectsSummary'
        | 'servicesSummary'
        | 'skillsSummary'
        | 'aboutSummary'
        | 'testimonialsSummary'
        | 'contactSummary'
        | 'scopeGuardMessage'
        | 'rateLimitMessage'
) {
    switch (key) {
        case 'greetingMessage':
            return localizeAssistantText(language, {
                en: assistantKnowledge.greetingMessage,
                sw: 'Habari, mimi ni Yookie. Uliza kuhusu miradi, huduma, bei, ujuzi, au namna ya kuanza, nami nitakuongoza.',
                fr: 'Bonjour, je suis Yookie. Demandez-moi des projets, services, tarifs, compétences, ou la meilleure façon de commencer, et je vous guiderai.',
            });
        case 'leadCaptureMessage':
            return localizeAssistantText(language, {
                en: assistantKnowledge.leadCaptureMessage,
                sw: 'Ninaweza kusaidia kuhusu branding, website, au visual design. Nieleze kidogo kuhusu mradi au lengo lako, nikuelekeze kwenye kazi na hatua inayofaa.',
                fr: 'Je peux vous aider pour le branding, les sites web ou le design visuel. Partagez brièvement votre projet ou votre objectif, et je vous orienterai vers le travail le plus pertinent et la suite.',
            });
        case 'projectsSummary':
            return localizeAssistantText(language, {
                en: assistantKnowledge.projectsSummary,
                sw: 'Sehemu ya works inaonyesha logos, posters na banners, pamoja na website visuals kama NatureWiseTours. Hapo ndipo mahali pazuri kuona mtindo na ubora wa kazi.',
                fr: 'La section works présente des logos, des affiches et bannières, ainsi que des visuels de sites comme NatureWiseTours. C’est le meilleur endroit pour voir le style et la qualité d’exécution.',
            });
        case 'servicesSummary':
            return localizeAssistantText(language, {
                en: assistantKnowledge.servicesSummary,
                sw: 'Huduma zinajikita kwenye brand identity, web development, na graphic design. Kazi inahusisha logos, visual systems, websites, posters, brochures, na promo assets.',
                fr: 'Les services couvrent l’identité de marque, le développement web et le design graphique. Le travail comprend logos, systèmes visuels, sites responsives, affiches, brochures et assets promotionnels.',
            });
        case 'skillsSummary':
            return localizeAssistantText(language, {
                en: assistantKnowledge.skillsSummary,
                sw: 'Vifaa na teknolojia kuu ni React, TypeScript, Tailwind CSS, Framer Motion, Node.js, Adobe Illustrator, Adobe Photoshop, Canva, na brand identity design.',
                fr: 'Les outils et technologies clés incluent React, TypeScript, Tailwind CSS, Framer Motion, Node.js, Adobe Illustrator, Adobe Photoshop, Canva, ainsi que le design d’identité visuelle.',
            });
        case 'aboutSummary':
            return localizeAssistantText(language, {
                en: assistantKnowledge.aboutSummary,
                sw: 'Elisha Lema ni designer na developer kutoka Tanzania anayechanganya visual design na frontend execution. Portfolio inaonyesha mtazamo unaojali aesthetics, utatuzi wa matatizo, na ushirikiano mzuri.',
                fr: 'Elisha Lema est designer et développeur basé en Tanzanie, combinant design visuel et exécution frontend. Le portfolio montre une approche centrée sur l’esthétique, la résolution concrète des problèmes et la collaboration.',
            });
        case 'testimonialsSummary':
            return localizeAssistantText(language, {
                en: assistantKnowledge.testimonialsSummary,
                sw: 'Testimonials zinaonyesha namna kazi zilivyosaidia brand presentation, promotional communication, tourism visuals, na identity ya biashara kuwa imara zaidi.',
                fr: 'Les témoignages montrent comment le travail a renforcé la présentation de marque, la communication promotionnelle, les visuels touristiques et l’identité business.',
            });
        case 'contactSummary':
            return localizeAssistantText(language, {
                en: assistantKnowledge.contactSummary,
                sw: 'Unaweza kumfikia Elisha kupitia contact form, email, simu, GitHub, LinkedIn, Upwork, Instagram, au WhatsApp. Sehemu ya contact ndiyo hatua bora kwa mazungumzo ya mradi.',
                fr: 'Vous pouvez contacter Elisha via le formulaire, email, téléphone, GitHub, LinkedIn, Upwork, Instagram ou WhatsApp. La section contact est l’étape la plus claire pour parler du projet.',
            });
        case 'scopeGuardMessage':
            return localizeAssistantText(language, {
                en: assistantKnowledge.scopeGuardMessage,
                sw: 'Niko hapa kusaidia kuhusu portfolio ya Elisha Lema. Uliza kuhusu miradi, huduma, bei, ujuzi, testimonials, legal pages, au contact, nami nitabaki kwenye hilo.',
                fr: 'Je suis ici pour aider autour du portfolio d’Elisha Lema. Demandez-moi les projets, services, tarifs, compétences, pages légales ou le contact, et je resterai sur ce périmètre.',
            });
        case 'rateLimitMessage':
            return localizeAssistantText(language, {
                en: assistantKnowledge.rateLimitMessage,
                sw: 'Tafadhali subiri kidogo kabla ya kutuma ujumbe mwingine. Bado niko hapa kusaidia kuhusu miradi, huduma, bei, au contact.',
                fr: 'Veuillez patienter un instant avant d’envoyer un autre message. Je suis toujours là pour aider avec les projets, services, tarifs ou le contact.',
            });
    }
}

function hasNavigationIntent(input: string) {
    return NAVIGATION_KEYWORDS.some((keyword) => normalizeAssistantText(input).includes(keyword));
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
    return (
        assistantSiteFeatures
            .map((feature) => ({ feature, score: scoreSiteFeature(input, feature) }))
            .filter((item) => item.score > 0)
            .sort((left, right) => right.score - left.score)[0]?.feature ?? null
    );
}

function findWorkCategory(input: string, context?: AssistantSessionIntentContext | null) {
    const directMatch =
        assistantWorkCategories
            .map((category) => ({ category, score: scoreWorkCategory(input, category) }))
            .filter((item) => item.score > 0)
            .sort((left, right) => right.score - left.score)[0]?.category ?? null;

    if (directMatch) {
        return directMatch;
    }

    if (!context?.relevantCategory) {
        return null;
    }

    return assistantWorkCategories.find((category) => category.filter === context.relevantCategory) ?? null;
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

    const candidate = action as Partial<AssistantAction> & { target?: unknown; filter?: unknown; workflow?: unknown };

    if (typeof candidate.id !== 'string' || typeof candidate.label !== 'string' || typeof candidate.target !== 'string') {
        return null;
    }

    const id = trimAssistantContent(candidate.id, 60);
    const label = trimAssistantContent(candidate.label, 40);

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
        const workflow =
            candidate.workflow === 'logo' ||
            candidate.workflow === 'poster' ||
            candidate.workflow === 'website' ||
            candidate.workflow === 'branding' ||
            candidate.workflow === 'hiring'
                ? candidate.workflow
                : undefined;

        const filter =
            typeof candidate.filter === 'string' && VALID_WORK_FILTERS.has(candidate.filter as AssistantWorksFilter)
                ? (candidate.filter as AssistantWorksFilter)
                : undefined;

        return {
            id,
            label,
            type: 'business',
            target: candidate.target as AssistantBusinessActionTarget,
            workflow,
            filter,
        };
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

    const label = trimAssistantContent(candidate.label, 40);
    return label ? { label, type: 'scroll', target: 'contact' } : undefined;
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

export function sanitizeAssistantConfidence(confidence: unknown): AssistantConfidence | undefined {
    if (!confidence || typeof confidence !== 'object') {
        return undefined;
    }

    const candidate = confidence as Partial<AssistantConfidence>;

    if (candidate.level !== 'low' && candidate.level !== 'medium' && candidate.level !== 'high') {
        return undefined;
    }

    return {
        level: candidate.level,
        redirectLabel: typeof candidate.redirectLabel === 'string' ? trimAssistantContent(candidate.redirectLabel, 40) : undefined,
        escalateToContact: Boolean(candidate.escalateToContact),
    };
}

export function createAssistantMessage(
    role: AssistantMessage['role'],
    content: string,
    actions?: AssistantReply['actions'],
    mode?: AssistantMessage['mode'],
    extras?: Pick<AssistantMessage, 'intent' | 'cta' | 'recommendations' | 'qualification' | 'confidence'>
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
        confidence: sanitizeAssistantConfidence(extras?.confidence),
    };
}

function buildFeatureNavigationReply(
    feature: AssistantSiteFeature,
    signals: ReturnType<typeof inferCommercialSignals>,
    language: AssistantSessionIntentContext['language']
): AssistantReply {
    const action =
        feature.actionType === 'route'
            ? createRouteAction(feature.target as AssistantRouteTarget, feature.label)
            : createScrollAction(feature.target as AssistantSectionTarget, feature.label);

    return {
        content: localizeAssistantText(language, {
            en: `${feature.description}`,
            sw: `Ninaweza kukupeleka kwenye sehemu hiyo ya portfolio.`,
            fr: `Je peux vous emmener vers cette section du portfolio.`,
        }),
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
        cta:
            feature.target === 'contact'
                ? createContactCta(localizeAssistantText(language, { en: assistantKnowledge.contactCtaLabel, sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' }))
                : undefined,
        recommendations: feature.target === 'works' ? signals.recommendations : undefined,
        qualification: feature.target === 'contact' && signals.qualification.status !== 'insufficient' ? signals.qualification : undefined,
        confidence: { level: 'high' },
    };
}

function buildWorkCategoryReply(
    category: AssistantWorksCategory,
    signals: ReturnType<typeof inferCommercialSignals>,
    language: AssistantSessionIntentContext['language']
): AssistantReply {
    const action = createScrollAction('works', category.label, { filter: category.filter });
    const matchingRecommendations = category.exampleProjectIds.length
        ? signals.recommendations?.filter((recommendation) => category.exampleProjectIds.includes(recommendation.id))
        : undefined;

    return {
        content: category.filter
            ? localizeAssistantText(language, {
                  en: `${category.description} I can take you straight there in the gallery.`,
                  sw: `${category.description} Naweza kukupeleka moja kwa moja huko kwenye gallery.`,
                  fr: `${category.description} Je peux vous y emmener directement dans la galerie.`,
              })
            : localizeAssistantText(language, {
                  en: `${category.description} I can take you to the gallery and highlight the closest matching pieces.`,
                  sw: `${category.description} Naweza kukupeleka kwenye gallery na kuonyesha kazi zinazofanana zaidi.`,
                  fr: `${category.description} Je peux vous emmener dans la galerie et mettre en avant les pièces les plus proches.`,
              }),
        actions: [action, createBusinessAction('continue_to_contact', localizeAssistantText(language, { en: 'Start project', sw: 'Anza mradi', fr: 'Démarrer le projet' }))],
        mode: 'fallback',
        intent: 'projects',
        recommendations: matchingRecommendations?.length ? matchingRecommendations : signals.recommendations,
        confidence: { level: 'high' },
    };
}

function buildLowConfidenceReply(context: AssistantSessionIntentContext | null, signals: ReturnType<typeof inferCommercialSignals>): AssistantReply {
    const hasWorkContext = Boolean(context?.selectedService || signals.recommendations.length);
    const language = context?.language ?? 'en';

    return {
        content: hasWorkContext
            ? localizeAssistantText(language, {
                  en: "I can't answer that with confidence from the portfolio alone. I can show the closest relevant work or take you to contact if you'd like direct help.",
                  sw: 'Siwezi kujibu hilo kwa uhakika nikitumia portfolio pekee. Naweza kukuonyesha kazi iliyo karibu zaidi au kukupeleka kwenye contact kama unahitaji msaada wa moja kwa moja.',
                  fr: 'Je ne peux pas répondre à cela avec assez de certitude à partir du portfolio seul. Je peux vous montrer le travail le plus proche ou vous emmener vers le contact si vous voulez une aide directe.',
              })
            : `${getLocalizedKnowledgeText(language, 'scopeGuardMessage')} ${localizeAssistantText(language, {
                  en: 'I can still point you to the most relevant section or contact path.',
                  sw: 'Bado naweza kukuonyesha sehemu inayofaa zaidi au njia ya contact.',
                  fr: 'Je peux quand même vous orienter vers la section la plus pertinente ou vers le contact.',
              })}`,
        actions: hasWorkContext
            ? [
                  createBusinessAction('show_relevant_work', localizeAssistantText(language, { en: 'Closest work', sw: 'Kazi iliyo karibu', fr: 'Travail le plus proche' }), { workflow: context?.selectedService }),
                  createBusinessAction('continue_to_contact', localizeAssistantText(language, { en: 'Contact Elisha', sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' })),
              ]
            : [
                  createScrollAction('works', localizeAssistantText(language, { en: 'Projects', sw: 'Miradi', fr: 'Projets' })),
                  createScrollAction('contact', localizeAssistantText(language, { en: 'Contact', sw: 'Wasiliana', fr: 'Contact' })),
              ],
        mode: 'fallback',
        intent: 'general',
        cta: createContactCta(localizeAssistantText(language, { en: assistantKnowledge.contactCtaLabel, sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' })),
        recommendations: signals.recommendations,
        confidence: {
            level: 'low',
            redirectLabel: hasWorkContext
                ? localizeAssistantText(language, { en: 'Closest work', sw: 'Kazi iliyo karibu', fr: 'Travail le plus proche' })
                : localizeAssistantText(language, { en: 'Projects', sw: 'Miradi', fr: 'Projets' }),
            escalateToContact: true,
        },
    };
}

export function buildLocalAssistantReply(
    input: string,
    history: AssistantHistoryEntry[] = [],
    context?: AssistantSessionIntentContext | null
): AssistantReply {
    const fullHistory: AssistantHistoryEntry[] = [...history, { role: 'user', content: input }];
    const intent = detectAssistantIntent(input);
    const signals = inferCommercialSignals(fullHistory);
    const nextContext = buildSessionIntentContext(fullHistory, context);
    const language = nextContext.language;
    const matchedFeature = findAssistantSiteFeature(input);
    const matchedWorkCategory = findWorkCategory(input, nextContext);
    const hasPricingQuestion = /(how much|price|pricing|cost|budget|bei)/i.test(normalizeAssistantText(input));
    const workflowReply = buildGuidedWorkflowReply(nextContext, hasPricingQuestion);

    if (matchedWorkCategory) {
        return buildWorkCategoryReply(matchedWorkCategory, signals, language);
    }

    if (workflowReply) {
        return {
            ...workflowReply,
            recommendations: signals.recommendations,
            qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
            cta: nextContext.currentWorkflow?.status === 'ready' ? createContactCta(assistantKnowledge.projectBriefCtaLabel) : undefined,
            confidence: { level: nextContext.currentWorkflow?.status === 'ready' ? 'high' : 'medium' },
        };
    }

    if (matchedFeature && (hasNavigationIntent(input) || matchedFeature.kind === 'page' || matchedFeature.target === 'pricing')) {
        return buildFeatureNavigationReply(matchedFeature, signals, language);
    }

    if (hasPricingQuestion && nextContext.selectedService) {
        return {
            content: localizeAssistantText(language, {
                en:
                nextContext.selectedService === 'logo' || nextContext.selectedService === 'branding'
                    ? 'Logo design is listed at 20,000 TZS / 8 USD. If you want, I can show the pricing section or move this into contact with your brief.'
                    : nextContext.selectedService === 'poster'
                      ? 'Poster, banner, and flyer pricing starts at 15,000 TZS / 6 USD, with bulk work from 5,000 TZS / 2 USD each for 10+ items.'
                      : 'Website projects are listed in the 200,000 - 250,000 TZS / 77 - 95 USD range, depending on scope.',
                sw:
                    nextContext.selectedService === 'logo' || nextContext.selectedService === 'branding'
                        ? 'Bei ya logo imeorodheshwa kama 20,000 TZS / 8 USD. Nikitaka, naweza kukuonyesha sehemu ya pricing au kupeleka hili kwenye contact pamoja na brief yako.'
                        : nextContext.selectedService === 'poster'
                          ? 'Bei ya poster, banner, na flyer inaanzia 15,000 TZS / 6 USD, na bulk work inaanzia 5,000 TZS / 2 USD kwa kila kazi kwa oda ya 10+.'
                          : 'Bei ya website imeorodheshwa kwenye kiwango cha 200,000 - 250,000 TZS / 77 - 95 USD kulingana na scope.',
                fr:
                    nextContext.selectedService === 'logo' || nextContext.selectedService === 'branding'
                        ? 'Le tarif du logo est indiqué à 20,000 TZS / 8 USD. Si vous voulez, je peux vous montrer la section pricing ou transférer cela vers le contact avec votre brief.'
                        : nextContext.selectedService === 'poster'
                          ? 'Le tarif des affiches, bannières et flyers commence à 15,000 TZS / 6 USD, avec du volume à partir de 5,000 TZS / 2 USD par pièce pour 10+ éléments.'
                          : 'Les projets web sont indiqués dans la fourchette 200,000 - 250,000 TZS / 77 - 95 USD selon le périmètre.',
            }),
            actions: [
                createBusinessAction('show_pricing_for_current_service', localizeAssistantText(language, { en: 'View pricing', sw: 'Angalia bei', fr: 'Voir les tarifs' }), { workflow: nextContext.selectedService }),
                createBusinessAction('continue_to_contact', localizeAssistantText(language, { en: 'Continue to contact', sw: 'Endelea contact', fr: 'Continuer vers contact' }), { workflow: nextContext.selectedService }),
            ],
            mode: 'fallback',
            intent: 'lead',
            qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
            cta: createContactCta(localizeAssistantText(language, { en: assistantKnowledge.projectBriefCtaLabel, sw: 'Tumia Muhtasari Huu kwenye Contact', fr: 'Utiliser ce résumé dans Contact' })),
            recommendations: signals.recommendations,
            confidence: { level: 'high' },
        };
    }

    switch (intent) {
        case 'greeting':
            return { content: getLocalizedKnowledgeText(language, 'greetingMessage'), mode: 'fallback', intent: 'general', confidence: { level: 'high' } };
        case 'lead':
            return {
                content:
                    signals.followUpQuestion ??
                    `${getLocalizedKnowledgeText(language, 'leadCaptureMessage')} ${
                        signals.recommendations.length
                ? localizeAssistantText(language, {
                                  en: 'I can also point you to a relevant example.',
                                  sw: 'Pia naweza kukuonyesha mfano unaofaa.',
                                  fr: 'Je peux aussi vous montrer un exemple pertinent.',
                              })
                            : ''
                    }`.trim(),
                actions: [
                    createBusinessAction('show_relevant_work', localizeAssistantText(language, { en: 'Relevant work', sw: 'Kazi zinazofaa', fr: 'Travaux pertinents' }), { workflow: nextContext.selectedService }),
                    createBusinessAction('continue_to_contact', localizeAssistantText(language, { en: assistantKnowledge.projectBriefCtaLabel, sw: 'Tumia Muhtasari Huu kwenye Contact', fr: 'Utiliser ce résumé dans Contact' }), { workflow: nextContext.selectedService }),
                ],
                mode: 'fallback',
                intent: 'lead',
                cta: createContactCta(localizeAssistantText(language, { en: assistantKnowledge.contactCtaLabel, sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' })),
                recommendations: signals.recommendations,
                qualification: signals.qualification,
                confidence: { level: 'medium', escalateToContact: true },
            };
        case 'projects':
            return {
                content: getLocalizedKnowledgeText(language, 'projectsSummary'),
                actions: [createScrollAction('works', localizeAssistantText(language, { en: 'View projects', sw: 'Angalia miradi', fr: 'Voir les projets' })), createBusinessAction('continue_to_contact', localizeAssistantText(language, { en: 'Start a project', sw: 'Anza mradi', fr: 'Démarrer un projet' }))],
                mode: 'fallback',
                intent: 'projects',
                cta: createContactCta(localizeAssistantText(language, { en: assistantKnowledge.projectBriefCtaLabel, sw: 'Tumia Muhtasari Huu kwenye Contact', fr: 'Utiliser ce résumé dans Contact' })),
                recommendations: signals.recommendations,
                qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
                confidence: { level: 'high' },
            };
        case 'services':
            return {
                content: getLocalizedKnowledgeText(language, 'servicesSummary'),
                actions: [createScrollAction('services', localizeAssistantText(language, { en: 'Go to services', sw: 'Nenda huduma', fr: 'Voir les services' })), createScrollAction('pricing', localizeAssistantText(language, { en: 'See pricing', sw: 'Angalia bei', fr: 'Voir les tarifs' }))],
                mode: 'fallback',
                intent: 'services',
                cta: createContactCta(localizeAssistantText(language, { en: assistantKnowledge.projectBriefCtaLabel, sw: 'Tumia Muhtasari Huu kwenye Contact', fr: 'Utiliser ce résumé dans Contact' })),
                recommendations: signals.recommendations,
                qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
                confidence: { level: 'high' },
            };
        case 'skills':
            return {
                content: getLocalizedKnowledgeText(language, 'skillsSummary'),
                actions: [createScrollAction('skills', localizeAssistantText(language, { en: 'View skills', sw: 'Angalia ujuzi', fr: 'Voir les compétences' }))],
                mode: 'fallback',
                intent: 'skills',
                confidence: { level: 'high' },
            };
        case 'about':
            return {
                content: getLocalizedKnowledgeText(language, 'aboutSummary'),
                actions: [createScrollAction('about', localizeAssistantText(language, { en: 'Read about', sw: 'Soma kuhusu', fr: 'En savoir plus' }))],
                mode: 'fallback',
                intent: 'about',
                confidence: { level: 'high' },
            };
        case 'testimonials':
            return {
                content: getLocalizedKnowledgeText(language, 'testimonialsSummary'),
                actions: [createScrollAction('testimonials', localizeAssistantText(language, { en: 'See testimonials', sw: 'Angalia ushuhuda', fr: 'Voir les témoignages' })), createScrollAction('contact', localizeAssistantText(language, { en: assistantKnowledge.contactCtaLabel, sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' }))],
                mode: 'fallback',
                intent: 'general',
                cta: createContactCta(localizeAssistantText(language, { en: assistantKnowledge.contactCtaLabel, sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' })),
                confidence: { level: 'high' },
            };
        case 'contact':
            return {
                content: getLocalizedKnowledgeText(language, 'contactSummary'),
                actions: [createScrollAction('contact', localizeAssistantText(language, { en: 'Open contact', sw: 'Fungua contact', fr: 'Ouvrir contact' }))],
                mode: 'fallback',
                intent: 'contact',
                cta: createContactCta(localizeAssistantText(language, { en: assistantKnowledge.contactCtaLabel, sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' })),
                qualification: signals.qualification.status === 'insufficient' ? undefined : signals.qualification,
                confidence: { level: 'high', escalateToContact: true },
            };
        case 'outOfScope':
            return buildLowConfidenceReply(nextContext, signals);
        default:
            if (matchedFeature) {
                return buildFeatureNavigationReply(matchedFeature, signals, language);
            }

            return buildLowConfidenceReply(nextContext, signals);
    }
}

export function buildRateLimitedReply(language: AssistantSessionIntentContext['language'] = 'en'): AssistantReply {
    return {
        content: getLocalizedKnowledgeText(language, 'rateLimitMessage'),
        actions: [createScrollAction('contact', localizeAssistantText(language, { en: assistantKnowledge.contactCtaLabel, sw: 'Wasiliana na Elisha', fr: 'Contacter Elisha' }))],
        mode: 'fallback',
        intent: 'general',
        confidence: { level: 'medium' },
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
        confidence: sanitizeAssistantConfidence(message.confidence),
    }));
}

export function isAssistantApiResponse(value: unknown): value is AssistantApiResponse {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Partial<AssistantApiResponse>;
    return typeof candidate.message === 'string' && (candidate.mode === 'ai' || candidate.mode === 'fallback');
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
        confidence: sanitizeAssistantConfidence(response.confidence),
        reason: response.reason === 'rate_limited' ? 'rate_limited' : undefined,
    };
}

export function formatAssistantTimestamp(timestamp: number) {
    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    }).format(timestamp);
}
