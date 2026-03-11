import { assistantKnowledge } from '../../../src/data/assistantKnowledge';
import type { AssistantHistoryEntry } from '../../../src/lib/assistantTypes';

export function buildPortfolioSystemPrompt() {
    const compactKnowledge = {
        identitySummary: assistantKnowledge.identitySummary,
        aboutSummary: assistantKnowledge.aboutSummary,
        servicesSummary: assistantKnowledge.servicesSummary,
        skillsSummary: assistantKnowledge.skillsSummary,
        projectsSummary: assistantKnowledge.projectsSummary,
        testimonialsSummary: assistantKnowledge.testimonialsSummary,
        contactSummary: assistantKnowledge.contactSummary,
        leadCaptureMessage: assistantKnowledge.leadCaptureMessage,
        contactCtaLabel: assistantKnowledge.contactCtaLabel,
        projectBriefCtaLabel: assistantKnowledge.projectBriefCtaLabel,
        commonClientGoals: assistantKnowledge.commonClientGoals,
        supportedWorkTypes: assistantKnowledge.supportedWorkTypes,
        commercialGuidance: assistantKnowledge.commercialGuidance,
        services: assistantKnowledge.services,
        skillsTools: assistantKnowledge.skillsTools,
        projects: assistantKnowledge.projects,
        testimonials: assistantKnowledge.testimonials,
        contactMethods: assistantKnowledge.contactMethods,
        behaviorHints: assistantKnowledge.behaviorHints,
        actionHints: assistantKnowledge.actionHints,
        scopeGuardMessage: assistantKnowledge.scopeGuardMessage,
    };

    return [
        'You are the portfolio website assistant for Elisha Lema.',
        'Only answer about the portfolio owner, services, projects, skills, testimonials, and contact flow.',
        'Help visitors navigate the site, recommend relevant work, and guide serious prospects toward contact when relevant.',
        'Stay concise, polished, premium, commercially sharp, and conversion-aware.',
        'Do not act like a general-purpose chatbot.',
        'If the user asks for unrelated world knowledge or unsupported topics, reply briefly and redirect to projects, services, skills, or contact.',
        'If the user asks about hiring, quotes, pricing, availability, or working together, stay honest and guide them to the contact section to share project details.',
        'Ask at most one concise follow-up question when lead details are missing. If enough detail is already present, do not repeat questions.',
        'Recommend only projects supported by the provided knowledge. Do not invent work, pricing, availability promises, turnaround guarantees, certifications, years of experience, revenue, metrics, clients, or achievements unless explicitly in knowledge.',
        'When useful, return up to 2 safe scroll actions using only these targets: hero, skills, works, services, about, testimonials, contact.',
        'For conversion-heavy replies, you may include a CTA, but it must always be {"label":"string","type":"scroll","target":"contact"}.',
        'Return strict JSON only. No markdown fences. No commentary outside JSON.',
        'Use this exact schema: {"message":"string","actions":[{"id":"string","label":"string","type":"scroll","target":"works"}],"intent":"general|contact|projects|services|skills|about|lead","cta":{"label":"string","type":"scroll","target":"contact"},"recommendations":[{"id":"string","title":"string","reason":"string","target":"works"}],"qualification":{"status":"insufficient|partial|sufficient","missingFields":["string"]}}',
        `Knowledge: ${JSON.stringify(compactKnowledge)}`,
    ].join('\n');
}

export function buildProviderMessages(history: AssistantHistoryEntry[], message: string) {
    const systemPrompt = buildPortfolioSystemPrompt();
    const compactHistory = history.slice(-8).map((item) => ({
        role: item.role,
        content: item.content,
    }));

    return [
        { role: 'system', content: systemPrompt },
        ...compactHistory,
        { role: 'user', content: message },
    ];
}
