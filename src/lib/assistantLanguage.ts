import type { AssistantLanguage } from './assistantTypes';

function normalize(value: string) {
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

const SWAHILI_HINTS = [' nina ', ' nataka', ' nahitaji', ' bei', ' kazi', ' tovuti', ' nembo', ' chapa', ' msaada', ' unaweza ', ' nieleze ', ' miradi ', ' huduma '];
const FRENCH_HINTS = [' bonjour ', ' salut ', ' parle-moi ', ' météo ', ' projet ', ' services ', ' prix ', ' contactez ', ' je veux ', ' j’ai besoin ', ' besoin ', ' site web '];

export function detectAssistantLanguage(text: string): AssistantLanguage {
    const padded = ` ${normalize(text)} `;

    if (SWAHILI_HINTS.some((hint) => padded.includes(hint))) {
        return 'sw';
    }

    if (FRENCH_HINTS.some((hint) => padded.includes(hint))) {
        return 'fr';
    }

    return 'en';
}

export function getReplyLanguage(latestUserMessage: string, fallbackLanguage: AssistantLanguage = 'en') {
    const detected = detectAssistantLanguage(latestUserMessage);
    return latestUserMessage.trim() ? detected : fallbackLanguage;
}

export function localizeAssistantText(language: AssistantLanguage, copy: { en: string; sw: string; fr: string }) {
    if (language === 'sw') {
        return copy.sw;
    }

    if (language === 'fr') {
        return copy.fr;
    }

    return copy.en;
}
