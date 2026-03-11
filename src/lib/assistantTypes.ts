export type MessageRole = 'user' | 'assistant';

export type AssistantIntent =
    | 'greeting'
    | 'projects'
    | 'services'
    | 'skills'
    | 'about'
    | 'testimonials'
    | 'contact'
    | 'lead'
    | 'outOfScope'
    | 'unknown';

export type AssistantResponseIntent = 'general' | 'contact' | 'projects' | 'services' | 'skills' | 'about' | 'lead';

export type AssistantActionTarget =
    | 'hero'
    | 'skills'
    | 'works'
    | 'services'
    | 'about'
    | 'testimonials'
    | 'contact';

export type AssistantActionType = 'scroll';
export type AssistantServiceCategory =
    | 'web-development'
    | 'branding-design'
    | 'design-development'
    | 'portfolio-brand'
    | 'business-brand'
    | 'graphic-design'
    | 'general';

export interface AssistantAction {
    id: string;
    label: string;
    type: AssistantActionType;
    target: AssistantActionTarget;
}

export interface AssistantCta {
    label: string;
    type: 'scroll';
    target: 'contact';
}

export interface AssistantRecommendation {
    id: string;
    title: string;
    reason: string;
    target: 'works';
}

export interface AssistantQualification {
    status: 'insufficient' | 'partial' | 'sufficient';
    missingFields?: string[];
}

export interface AssistantInquirySummary {
    projectType?: string;
    servicesNeeded?: string[];
    goal?: string;
    timeline?: string;
    styleDirection?: string;
    extraRequirements?: string[];
    summaryText: string;
    status: 'partial' | 'sufficient';
}

export type AssistantResponseMode = 'ai' | 'fallback';

export interface AssistantMessage {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: number;
    actions?: AssistantAction[];
    mode?: AssistantResponseMode;
    intent?: AssistantResponseIntent;
    cta?: AssistantCta;
    recommendations?: AssistantRecommendation[];
    qualification?: AssistantQualification;
}

export interface QuickAction {
    id: string;
    label: string;
    prompt: string;
    target: AssistantActionTarget;
}

export interface AssistantKnowledgeService {
    title: string;
    summary: string;
    serviceType: AssistantServiceCategory;
    outcomes: string[];
    keywords: string[];
}

export interface AssistantKnowledgeProject {
    id: string;
    title: string;
    category: string;
    summary: string;
    tags: string[];
    technologies: string[];
    industries: string[];
    capabilities: string[];
    serviceTypes: AssistantServiceCategory[];
    keywords: string[];
    sectionTarget: Extract<AssistantActionTarget, 'works'>;
    featured?: boolean;
}

export interface AssistantKnowledgeTestimonial {
    name: string;
    role: string;
    summary: string;
}

export interface AssistantKnowledgeContactMethod {
    label: string;
    value: string;
    kind: 'email' | 'phone' | 'social' | 'form';
}

export interface AssistantKnowledge {
    assistantName: string;
    assistantTitle: string;
    assistantSubtitle: string;
    welcomeMessage: string;
    fallbackMessage: string;
    scopeGuardMessage: string;
    greetingMessage: string;
    leadCaptureMessage: string;
    rateLimitMessage: string;
    contactCtaLabel: string;
    projectBriefCtaLabel: string;
    identitySummary: string;
    aboutSummary: string;
    servicesSummary: string;
    skillsSummary: string;
    projectsSummary: string;
    testimonialsSummary: string;
    contactSummary: string;
    commonClientGoals: string[];
    supportedWorkTypes: string[];
    commercialGuidance: string[];
    services: AssistantKnowledgeService[];
    skillsTools: string[];
    projects: AssistantKnowledgeProject[];
    testimonials: AssistantKnowledgeTestimonial[];
    contactMethods: AssistantKnowledgeContactMethod[];
    behaviorHints: string[];
    actionHints: Array<{
        target: AssistantActionTarget;
        label: string;
        when: string;
    }>;
    quickActions: QuickAction[];
}

export interface AssistantReply {
    content: string;
    actions?: AssistantAction[];
    mode?: AssistantResponseMode;
    intent?: AssistantResponseIntent;
    cta?: AssistantCta;
    recommendations?: AssistantRecommendation[];
    qualification?: AssistantQualification;
}

export interface AssistantHistoryEntry {
    role: MessageRole;
    content: string;
}

export interface AssistantApiRequest {
    message: string;
    history?: AssistantHistoryEntry[];
}

export interface AssistantApiResponse {
    message: string;
    actions?: AssistantAction[];
    mode: AssistantResponseMode;
    source?: string;
    intent?: AssistantResponseIntent;
    cta?: AssistantCta;
    recommendations?: AssistantRecommendation[];
    qualification?: AssistantQualification;
    reason?: 'rate_limited';
}

export type AssistantAnalyticsEventName =
    | 'assistant_opened'
    | 'assistant_message_sent'
    | 'assistant_response_received'
    | 'assistant_fallback_used'
    | 'assistant_action_clicked'
    | 'assistant_contact_cta_shown'
    | 'assistant_contact_cta_clicked'
    | 'assistant_rate_limited'
    | 'assistant_error'
    | 'assistant_recommendation_shown'
    | 'assistant_recommendation_clicked'
    | 'assistant_lead_detected'
    | 'assistant_inquiry_summary_generated'
    | 'assistant_inquiry_summary_copied'
    | 'assistant_contact_handoff_used';

export interface AssistantAnalyticsEventMap {
    assistant_opened: { restoredSession: boolean };
    assistant_message_sent: { length: number; source: 'input' | 'quick_action' };
    assistant_response_received: {
        mode: AssistantResponseMode;
        intent: AssistantResponseIntent;
        hasActions: boolean;
        hasCta: boolean;
        hasRecommendations: boolean;
        qualificationStatus: AssistantQualification['status'] | 'none';
    };
    assistant_fallback_used: { reason: 'network' | 'provider' | 'invalid_response' | 'rate_limited' | 'local_rule' };
    assistant_action_clicked: { actionId: string; target: AssistantActionTarget };
    assistant_contact_cta_shown: { label: string };
    assistant_contact_cta_clicked: { label: string; target: 'contact' };
    assistant_rate_limited: { source: 'backend' };
    assistant_error: { kind: 'network' | 'provider' | 'validation' | 'unknown'; statusCode?: number };
    assistant_recommendation_shown: { ids: string[] };
    assistant_recommendation_clicked: { recommendationId: string; target: 'works' };
    assistant_lead_detected: { status: AssistantQualification['status']; serviceTypes: AssistantServiceCategory[] };
    assistant_inquiry_summary_generated: { status: AssistantInquirySummary['status'] };
    assistant_inquiry_summary_copied: { length: number };
    assistant_contact_handoff_used: { hasSummary: boolean };
}

export type AssistantPersistedState = {
    messages: AssistantMessage[];
    hasWelcomed: boolean;
    hasOpened: boolean;
};

export interface UseAssistantReturn {
    isOpen: boolean;
    isTyping: boolean;
    messages: AssistantMessage[];
    showQuickActions: boolean;
    quickActions: QuickAction[];
    inquirySummary: AssistantInquirySummary | null;
    openAssistant: () => void;
    closeAssistant: () => void;
    toggleAssistant: () => void;
    submitMessage: (input: string, source?: 'input' | 'quick_action') => void;
    handleQuickAction: (action: QuickAction) => void;
    handleMessageAction: (action: AssistantAction) => void;
    handleMessageCta: (cta: AssistantCta) => void;
    handleRecommendationClick: (recommendation: AssistantRecommendation) => void;
    handleCopyInquirySummary: () => Promise<boolean>;
    handleUseInquirySummary: () => void;
}
