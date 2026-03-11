import type { AssistantAction, AssistantActionTarget } from './assistantTypes';

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

export function scrollToAssistantSection(sectionId: AssistantActionTarget) {
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

export function runAssistantAction(action: AssistantAction) {
    if (action.type === 'scroll') {
        return scrollToAssistantSection(action.target);
    }

    return false;
}
