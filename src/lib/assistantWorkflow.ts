import { assistantKnowledge } from '../data/assistantKnowledge';
import { detectAssistantLanguage, localizeAssistantText } from './assistantLanguage';
import type {
    AssistantAction,
    AssistantBusinessActionTarget,
    AssistantHistoryEntry,
    AssistantReply,
    AssistantSessionIntentContext,
    AssistantSuggestionContext,
    AssistantWorkflowType,
    QuickAction,
} from './assistantTypes';
import { extractInquiryProfile, inferServiceCategoriesFromText } from './assistantLeadUtils';
function normalize(value: string) {
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function unique<T>(values: T[]) {
    return [...new Set(values)];
}

const SERVICE_ALIASES: Array<{ workflow: AssistantWorkflowType; keywords: string[] }> = [
    { workflow: 'logo', keywords: ['logo', 'nembo', 'brand mark', 'business logo'] },
    { workflow: 'poster', keywords: ['poster', 'banner', 'flyer', 'brochure', 'promo graphic', 'church flyer'] },
    { workflow: 'website', keywords: ['website', 'web', 'landing page', 'portfolio site', 'business site', 'tovuti'] },
    { workflow: 'branding', keywords: ['branding', 'brand identity', 'visual identity', 'identity system', 'chapa'] },
    { workflow: 'hiring', keywords: ['hire', 'work with you', 'start a project', 'project', 'quote', 'availability'] },
];

const QUESTION_COPY: Record<
    AssistantWorkflowType,
    Partial<Record<'projectType' | 'goal' | 'timeline', { en: string; sw: string; fr: string }>>
> = {
    logo: {
        projectType: {
            en: 'Great. What should the logo be for: a business, personal brand, event, or something else?',
            sw: 'Sawa. Nembo hiyo ni ya biashara, personal brand, tukio, au kitu kingine?',
            fr: 'Très bien. Ce logo est pour une entreprise, une marque personnelle, un événement, ou autre chose ?',
        },
        goal: {
            en: 'What should the logo help communicate or achieve?',
            sw: 'Nembo hiyo inapaswa kuwasilisha au kusaidia kufanikisha nini?',
            fr: 'Que doit communiquer ou accomplir ce logo ?',
        },
        timeline: {
            en: 'Do you have a timeline in mind for it?',
            sw: 'Una muda gani unaolenga kwa kazi hiyo?',
            fr: 'Avez-vous un délai en tête pour cela ?',
        },
    },
    poster: {
        projectType: {
            en: 'What is the poster, banner, or flyer promoting?',
            sw: 'Poster, banner, au flyer hiyo inatangaza nini?',
            fr: 'Que doit promouvoir l’affiche, la bannière ou le flyer ?',
        },
        goal: {
            en: 'What outcome do you want it to drive?',
            sw: 'Unataka ilete matokeo gani?',
            fr: 'Quel résultat voulez-vous obtenir avec cela ?',
        },
        timeline: {
            en: 'When do you need it ready?',
            sw: 'Unaihitaji iwe tayari lini?',
            fr: 'Pour quand en avez-vous besoin ?',
        },
    },
    website: {
        projectType: {
            en: 'Great. What kind of website are you planning: portfolio, business, landing page, or something else?',
            sw: 'Vizuri. Unapanga tovuti ya aina gani: portfolio, biashara, landing page, au nyingine?',
            fr: 'Très bien. Quel type de site préparez-vous : portfolio, site business, landing page, ou autre ?',
        },
        goal: {
            en: 'What should the website help you achieve?',
            sw: 'Tovuti hiyo inapaswa kukusaidia kufanikisha nini?',
            fr: 'Quel objectif le site doit-il vous aider à atteindre ?',
        },
        timeline: {
            en: 'Do you have a target launch timeline?',
            sw: 'Una muda gani wa uzinduzi unaolenga?',
            fr: 'Avez-vous un calendrier de lancement visé ?',
        },
    },
    branding: {
        projectType: {
            en: 'Is this for a new brand, or a refresh of an existing identity?',
            sw: 'Hii ni kwa brand mpya au kuboresha identity iliyopo?',
            fr: 'Est-ce pour une nouvelle marque ou pour rafraîchir une identité existante ?',
        },
        goal: {
            en: 'What should the branding help improve first?',
            sw: 'Branding hiyo inapaswa kuboresha nini kwanza?',
            fr: 'Qu’est-ce que le branding doit améliorer en priorité ?',
        },
        timeline: {
            en: 'What timeline are you working with?',
            sw: 'Unafanya kazi kwa muda gani?',
            fr: 'Quel délai avez-vous en tête ?',
        },
    },
    hiring: {
        projectType: {
            en: 'Happy to help. What would you like to start with: logo design, promotional graphics, a website, or full branding?',
            sw: 'Ninaweza kusaidia. Ungependa kuanza na nini: logo, promo graphics, website, au full branding?',
            fr: 'Avec plaisir. Vous souhaitez commencer par un logo, des visuels promotionnels, un site web ou une identité complète ?',
        },
        goal: {
            en: 'What are you trying to get done with the project?',
            sw: 'Unataka mradi huo ukusaidie kufanikisha nini?',
            fr: 'Quel résultat voulez-vous obtenir avec ce projet ?',
        },
        timeline: {
            en: 'Do you have a preferred timeline?',
            sw: 'Una muda unaoupendelea?',
            fr: 'Avez-vous un délai préféré ?',
        },
    },
};

const READY_COPY: Record<AssistantWorkflowType, { en: string; sw: string; fr: string }> = {
    logo: {
        en: 'That gives me enough to guide the next step for the logo request.',
        sw: 'Hiyo inanipa taarifa za kutosha kukuongoza kwenye hatua inayofuata ya ombi la logo.',
        fr: 'Cela me donne assez d’éléments pour guider la prochaine étape de la demande de logo.',
    },
    poster: {
        en: 'That gives me enough to shape the design request.',
        sw: 'Hiyo inanipa taarifa za kutosha kupanga ombi la design.',
        fr: 'Cela me donne assez d’éléments pour structurer la demande de design.',
    },
    website: {
        en: 'That gives me enough to shape the website request.',
        sw: 'Hiyo inanipa taarifa za kutosha kupanga ombi la website.',
        fr: 'Cela me donne assez d’éléments pour structurer la demande de site web.',
    },
    branding: {
        en: 'That gives me enough to shape the branding direction.',
        sw: 'Hiyo inanipa taarifa za kutosha kupanga mwelekeo wa branding.',
        fr: 'Cela me donne assez d’éléments pour orienter le travail de branding.',
    },
    hiring: {
        en: 'That gives me enough to move your project forward.',
        sw: 'Hiyo inanipa taarifa za kutosha kusogeza mradi wako mbele.',
        fr: 'Cela me donne assez d’éléments pour faire avancer votre projet.',
    },
};

export function inferWorkflowTypeFromText(text: string, previous?: AssistantWorkflowType | null): AssistantWorkflowType | null {
    const normalized = normalize(text);

    for (const entry of SERVICE_ALIASES) {
        if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
            return entry.workflow;
        }
    }

    return previous ?? null;
}

export function inferRelevantFilter(workflow: AssistantWorkflowType | null) {
    switch (workflow) {
        case 'logo':
        case 'branding':
            return 'Logo' as const;
        case 'poster':
            return 'Poster/Banner' as const;
        case 'website':
            return "Website's Screenshot" as const;
        default:
            return undefined;
    }
}

function classifyLeadStatus(text: string) {
    return /(hire|quote|budget|price|pricing|start a project|project|need|want|looking for|availability|contact)/i.test(text)
        ? 'likelyLead'
        : 'browsing';
}

export function createBusinessAction(
    target: AssistantBusinessActionTarget,
    label: string,
    options?: { workflow?: AssistantWorkflowType | null }
): AssistantAction {
    return {
        id: `business-${target}`,
        label,
        type: 'business',
        target,
        workflow: options?.workflow ?? undefined,
        filter: inferRelevantFilter(options?.workflow ?? null),
    };
}

export function buildSessionIntentContext(
    history: AssistantHistoryEntry[],
    previous?: AssistantSessionIntentContext | null
): AssistantSessionIntentContext {
    const userMessages = history.filter((entry) => entry.role === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1]?.content ?? '';
    const sourceText = userMessages.slice(-6).map((entry) => entry.content).join(' ');
    const inferredProfile = extractInquiryProfile(history);
    const workflow = inferWorkflowTypeFromText(sourceText, previous?.currentWorkflow?.type ?? previous?.selectedService ?? null);
    const serviceTypes = inferredProfile?.serviceTypes ?? inferServiceCategoriesFromText(sourceText);
    const relevantCategory = inferRelevantFilter(workflow) ?? previous?.relevantCategory;
    const projectType = inferredProfile?.projectType ?? previous?.projectType;
    const goal = inferredProfile?.goal ?? previous?.goal;
    const timeline = inferredProfile?.timeline ?? previous?.timeline;
    const normalized = normalize(sourceText);
    const categoryInterest = unique(
        assistantKnowledge.workCategories
            .filter((category) => category.keywords.some((keyword) => normalized.includes(normalize(keyword))))
            .map((category) => category.id)
    );

    const currentWorkflow: AssistantSessionIntentContext['currentWorkflow'] = workflow
        ? {
              type: workflow,
              status: projectType && goal ? 'ready' : 'collecting',
          }
        : previous?.currentWorkflow ?? null;

    return {
        language: detectAssistantLanguage(latestUserMessage || previous?.language || 'en'),
        selectedService: workflow ?? previous?.selectedService ?? null,
        currentWorkflow: currentWorkflow ?? null,
        projectType,
        goal,
        timeline,
        relevantCategory,
        categoryInterest,
        leadStatus: classifyLeadStatus(sourceText),
        serviceTypes,
    };
}

export function buildGuidedWorkflowReply(
    context: AssistantSessionIntentContext,
    hasPricingQuestion = false
): AssistantReply | null {
    const workflow = context.currentWorkflow?.type;

    if (!workflow) {
        return null;
    }

    const language = context.language;
    const questionSet = QUESTION_COPY[workflow];
    const needsProjectType = !context.projectType;
    const needsGoal = !context.goal;
    const needsTimeline = !context.timeline && hasPricingQuestion;

    if (needsProjectType && questionSet.projectType) {
        return {
            content: localizeAssistantText(language, questionSet.projectType),
            mode: 'fallback',
            intent: 'lead',
        };
    }

    if (needsGoal && questionSet.goal) {
        return {
            content: localizeAssistantText(language, questionSet.goal),
            mode: 'fallback',
            intent: 'lead',
        };
    }

    if (needsTimeline && questionSet.timeline) {
        return {
            content: localizeAssistantText(language, questionSet.timeline),
            mode: 'fallback',
            intent: 'lead',
        };
    }

    if (context.projectType && context.goal) {
        return {
            content: `${localizeAssistantText(language, READY_COPY[workflow])} ${localizeAssistantText(language, {
                en: 'I can show relevant pricing, similar work, or carry this into contact for you.',
                sw: 'Naweza kukuonyesha bei inayokaribiana, kazi zinazofanana, au kukupeleka kwenye contact ukiendelee.',
                fr: 'Je peux vous montrer le tarif pertinent, des réalisations proches, ou transférer cela vers le contact pour vous.',
            })}`,
            mode: 'fallback',
            intent: 'lead',
            actions: [
                createBusinessAction('show_pricing_for_current_service', localizeAssistantText(language, { en: 'Relevant pricing', sw: 'Bei ya karibu', fr: 'Tarif pertinent' }), { workflow }),
                createBusinessAction('show_relevant_work', localizeAssistantText(language, { en: 'Relevant work', sw: 'Kazi zinazofanana', fr: 'Travaux proches' }), { workflow }),
                createBusinessAction('continue_to_contact', localizeAssistantText(language, { en: 'Continue to Contact', sw: 'Endelea Contact', fr: 'Continuer vers Contact' }), { workflow }),
            ],
        };
    }

    return null;
}

export function buildDynamicQuickActions(context: AssistantSuggestionContext | null): QuickAction[] {
    const workflow = context?.selectedService ?? null;
    const matchingGroup = assistantKnowledge.quickSuggestionGroups.find((group) => group.workflow === workflow);
    return matchingGroup?.actions ?? assistantKnowledge.quickActions;
}
