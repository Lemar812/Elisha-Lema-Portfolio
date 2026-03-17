import { assistantKnowledge } from '../data/assistantKnowledge';
import type {
    AssistantHistoryEntry,
    AssistantInquirySummary,
    AssistantQualification,
    AssistantRecommendation,
    AssistantServiceCategory,
} from './assistantTypes';

type InquiryProfile = {
    serviceTypes: AssistantServiceCategory[];
    projectType?: string;
    servicesNeeded: string[];
    goal?: string;
    timeline?: string;
    styleDirection?: string;
    extraRequirements: string[];
};

const PROJECT_TYPE_RULES: Array<{ label: string; keywords: string[] }> = [
    { label: 'Portfolio website', keywords: ['portfolio website', 'portfolio', 'personal brand'] },
    { label: 'Business website', keywords: ['business website', 'company website', 'brand website', 'website for my business'] },
    { label: 'Landing page', keywords: ['landing page', 'launch page', 'sales page'] },
    { label: 'Brand identity', keywords: ['brand identity', 'branding', 'logo', 'visual identity'] },
    { label: 'Promotional graphics', keywords: ['poster', 'banner', 'brochure', 'promo graphic'] },
];

const STYLE_KEYWORDS = ['premium', 'clean', 'minimal', 'bold', 'modern', 'elegant'];
const TIMELINE_PATTERNS = [
    /next month/i,
    /this month/i,
    /in \d+ (day|days|week|weeks|month|months)/i,
    /by [a-z]+/i,
    /asap/i,
    /soon/i,
];

const SEMANTIC_CLUSTERS = [
    {
        triggers: ['safari', 'tourism', 'travel', 'wildlife', 'tour'],
        aliases: ['travel', 'tourism', 'safari', 'travel brand', 'wildlife', 'tours'],
    },
    {
        triggers: ['church', 'ministry', 'gospel', 'choir', 'event flyer'],
        aliases: ['church', 'gospel', 'choir', 'event', 'poster', 'promo'],
    },
    {
        triggers: ['accessories', 'retail', 'shop', 'store', 'fashion'],
        aliases: ['retail', 'accessories', 'store', 'business collateral', 'promo design'],
    },
    {
        triggers: ['premium', 'portfolio website', 'business website', 'landing page'],
        aliases: ['premium design', 'website', 'web', 'ui', 'responsive web experience'],
    },
];

function normalize(value: string) {
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function unique<T>(values: T[]) {
    return [...new Set(values)];
}

export function inferServiceCategoriesFromText(input: string): AssistantServiceCategory[] {
    const normalized = normalize(input);
    const categories = new Set<AssistantServiceCategory>();

    if (/(website|web|landing page|frontend|portfolio site|business site|responsive)/.test(normalized)) {
        categories.add('web-development');
    }

    if (/(brand|branding|logo|identity|visual identity)/.test(normalized)) {
        categories.add('branding-design');
    }

    if (/(poster|banner|brochure|graphic design|promo)/.test(normalized)) {
        categories.add('graphic-design');
    }

    if (/(portfolio|personal brand|creative portfolio)/.test(normalized)) {
        categories.add('portfolio-brand');
    }

    if (/(business|company|startup|restaurant|brand site)/.test(normalized)) {
        categories.add('business-brand');
    }

    if (categories.has('web-development') && (categories.has('branding-design') || categories.has('graphic-design'))) {
        categories.add('design-development');
    }

    if (!categories.size) {
        categories.add('general');
    }

    return [...categories];
}

function inferProjectType(normalizedText: string) {
    for (const rule of PROJECT_TYPE_RULES) {
        if (rule.keywords.some((keyword) => normalizedText.includes(keyword))) {
            return rule.label;
        }
    }

    return undefined;
}

function inferGoal(sourceText: string) {
    const goalMatch =
        sourceText.match(/(?:for|to)\s+([^.!?]{10,90})/i) ??
        sourceText.match(/i need\s+([^.!?]{10,90})/i) ??
        sourceText.match(/looking to\s+([^.!?]{10,90})/i);

    return goalMatch?.[1]?.trim();
}

function inferTimeline(sourceText: string) {
    for (const pattern of TIMELINE_PATTERNS) {
        const match = sourceText.match(pattern);

        if (match?.[0]) {
            return match[0].trim();
        }
    }

    return undefined;
}

function inferStyleDirection(normalizedText: string) {
    const styles = STYLE_KEYWORDS.filter((keyword) => normalizedText.includes(keyword));
    return styles.length ? unique(styles).join(', ') : undefined;
}

function inferExtraRequirements(normalizedText: string) {
    const requirements = [
        normalizedText.includes('responsive') ? 'Responsive layout' : null,
        normalizedText.includes('motion') || normalizedText.includes('animation') ? 'Motion or animation' : null,
        normalizedText.includes('branding') && normalizedText.includes('website') ? 'Combined branding and website scope' : null,
    ].filter((value): value is string => Boolean(value));

    return unique(requirements);
}

export function extractInquiryProfile(history: AssistantHistoryEntry[]) {
    const userMessages = history.filter((item) => item.role === 'user').slice(-6);
    const sourceText = userMessages.map((item) => item.content).join(' ');
    const normalizedText = normalize(sourceText);

    if (!sourceText.trim()) {
        return null;
    }

    const serviceTypes = inferServiceCategoriesFromText(sourceText);
    const servicesNeeded = assistantKnowledge.services
        .filter((service) => service.keywords.some((keyword) => normalizedText.includes(keyword)))
        .map((service) => service.title);

    const profile: InquiryProfile = {
        serviceTypes,
        projectType: inferProjectType(normalizedText),
        servicesNeeded: unique(servicesNeeded),
        goal: inferGoal(sourceText),
        timeline: inferTimeline(sourceText),
        styleDirection: inferStyleDirection(normalizedText),
        extraRequirements: inferExtraRequirements(normalizedText),
    };

    return profile;
}

export function buildQualification(profile: InquiryProfile | null): AssistantQualification {
    if (!profile) {
        return {
            status: 'insufficient',
            missingFields: ['project type', 'goal'],
        };
    }

    const missingFields = [
        profile.projectType ? null : 'project type',
        profile.goal || profile.servicesNeeded.length ? null : 'goal',
    ].filter((value): value is string => Boolean(value));

    if (!missingFields.length) {
        return { status: 'sufficient' };
    }

    if (profile.servicesNeeded.length || profile.projectType || profile.goal) {
        return {
            status: 'partial',
            missingFields,
        };
    }

    return {
        status: 'insufficient',
        missingFields,
    };
}

export function getLeadFollowUpQuestion(qualification: AssistantQualification, profile: InquiryProfile | null) {
    if (qualification.status !== 'partial' && qualification.status !== 'insufficient') {
        return null;
    }

    if (!profile?.projectType) {
        return 'What type of project are you planning?';
    }

    if (!profile.goal && !profile.servicesNeeded.length) {
        return 'What outcome are you aiming for with it?';
    }

    return null;
}

export function recommendProjectsFromHistory(history: AssistantHistoryEntry[]): AssistantRecommendation[] {
    const sourceText = history.map((item) => item.content).join(' ');
    const normalizedText = normalize(sourceText);
    const inferredServiceTypes = inferServiceCategoriesFromText(sourceText);
    const activeAliases = SEMANTIC_CLUSTERS.filter((cluster) =>
        cluster.triggers.some((trigger) => normalizedText.includes(trigger))
    ).flatMap((cluster) => cluster.aliases);

    const scoredProjects = assistantKnowledge.projects
        .map((project) => {
            let score = project.featured ? 1 : 0;

            score += project.keywords.filter((keyword) => normalizedText.includes(keyword)).length * 3;
            score += project.capabilities.filter((capability) => normalizedText.includes(capability.toLowerCase())).length * 2;
            score += project.serviceTypes.filter((serviceType) => inferredServiceTypes.includes(serviceType)).length * 2;
            score += project.industries.filter((industry) =>
                activeAliases.some((alias) => normalize(industry).includes(alias) || alias.includes(normalize(industry)))
            ).length * 2;
            score += project.tags.filter((tag) =>
                activeAliases.some((alias) => normalize(tag).includes(alias) || alias.includes(normalize(tag)))
            ).length * 2;
            score += activeAliases.filter((alias) =>
                project.keywords.some((keyword) => normalize(keyword).includes(alias) || alias.includes(normalize(keyword)))
            ).length * 2;

            return {
                project,
                score,
            };
        })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, 2);

    return scoredProjects.map(({ project }) => ({
        id: project.id,
        title: project.title,
        reason: project.summary,
        target: 'works',
    }));
}

export function buildInquirySummary(history: AssistantHistoryEntry[]): AssistantInquirySummary | null {
    const profile = extractInquiryProfile(history);
    const qualification = buildQualification(profile);

    if (!profile || qualification.status !== 'sufficient') {
        return null;
    }

    const lines = [
        profile.projectType ? `Project Type: ${profile.projectType}` : null,
        profile.servicesNeeded.length ? `Services Needed: ${profile.servicesNeeded.join(', ')}` : null,
        profile.goal ? `Goal: ${profile.goal}` : null,
        profile.timeline ? `Timeline: ${profile.timeline}` : null,
        profile.styleDirection ? `Style Direction: ${profile.styleDirection}` : null,
        profile.extraRequirements.length ? `Extra Requirements: ${profile.extraRequirements.join(', ')}` : null,
    ].filter((value): value is string => Boolean(value));

    if (!lines.length) {
        return null;
    }

    return {
        projectType: profile.projectType,
        servicesNeeded: profile.servicesNeeded.length ? profile.servicesNeeded : undefined,
        goal: profile.goal,
        timeline: profile.timeline,
        styleDirection: profile.styleDirection,
        extraRequirements: profile.extraRequirements.length ? profile.extraRequirements : undefined,
        summaryText: lines.join('\n'),
        status: 'sufficient',
    };
}

export function inferCommercialSignals(history: AssistantHistoryEntry[]) {
    const profile = extractInquiryProfile(history);
    const qualification = buildQualification(profile);
    const recommendations = recommendProjectsFromHistory(history);

    return {
        profile,
        qualification,
        recommendations,
        followUpQuestion: getLeadFollowUpQuestion(qualification, profile),
        summary: buildInquirySummary(history),
    };
}
