import type { AssistantAnalyticsEventMap, AssistantAnalyticsEventName } from './assistantTypes';

declare global {
    interface Window {
        dataLayer?: Array<Record<string, unknown>>;
    }
}

const CUSTOM_EVENT_NAME = 'portfolio-assistant-analytics';

export function trackAssistantEvent<TEventName extends AssistantAnalyticsEventName>(
    eventName: TEventName,
    payload: AssistantAnalyticsEventMap[TEventName]
) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const detail = {
            event: eventName,
            payload,
            ts: Date.now(),
        };

        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail }));

        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push({
                event: eventName,
                assistant: payload,
            });
        }

        if (import.meta.env.DEV) {
            console.debug('[assistant-analytics]', eventName, payload);
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn('[assistant-analytics:error]', error);
        }
    }
}
