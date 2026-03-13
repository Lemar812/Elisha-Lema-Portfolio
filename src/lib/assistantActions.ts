import type { AssistantAction, AssistantRouteTarget, AssistantSectionTarget, AssistantWorksFilter } from './assistantTypes';

export const ASSISTANT_ROUTE_EVENT = 'portfolio-assistant-route';
export const ASSISTANT_WORKS_FILTER_EVENT = 'portfolio-assistant-works-filter';

declare global {
    interface Window {
        __portfolioLenis?: {
            scrollTo: (
                target: number | string | HTMLElement,
                options?: { offset?: number; duration?: number; immediate?: boolean }
            ) => void;
        };
    }
}

const SECTION_OFFSET = -96;

export function scrollToAssistantSection(sectionId: AssistantSectionTarget) {
    try {
        const target = document.getElementById(sectionId);

        if (!target) {
            return false;
        }

        if (window.__portfolioLenis) {
            window.__portfolioLenis.scrollTo(target, { offset: SECTION_OFFSET, duration: 1.1 });
            return true;
        }

        const top = target.getBoundingClientRect().top + window.scrollY + SECTION_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        return true;
    } catch {
        return false;
    }
}

export function navigateToAssistantRoute(route: AssistantRouteTarget) {
    try {
        window.dispatchEvent(new CustomEvent(ASSISTANT_ROUTE_EVENT, { detail: { route } }));
        return true;
    } catch {
        return false;
    }
}

function applyWorksFilter(filter?: AssistantWorksFilter) {
    if (!filter) {
        return;
    }

    window.dispatchEvent(new CustomEvent(ASSISTANT_WORKS_FILTER_EVENT, { detail: { filter } }));
}

export function runAssistantAction(action: AssistantAction) {
    if (action.type === 'scroll') {
        if (action.target === 'works') {
            applyWorksFilter(action.filter);
        }

        return scrollToAssistantSection(action.target);
    }

    if (action.type === 'route') {
        return navigateToAssistantRoute(action.target);
    }

    return false;
}
