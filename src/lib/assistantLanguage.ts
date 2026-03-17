import type { AssistantLanguage } from './assistantTypes';

function normalize(value: string) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

const SWAHILI_HINTS = [
    ' nina ',
    ' nataka',
    ' nahitaji',
    ' bei ',
    ' kazi ',
    ' tovuti ',
    ' nembo ',
    ' chapa ',
    ' msaada ',
    ' unaweza ',
    ' nieleze ',
    ' miradi ',
    ' huduma ',
    ' ana ujuzi gani',
    ' anafanya huduma gani',
    ' kiasi gani ',
];

const FRENCH_HINTS = [
    ' bonjour ',
    ' salut ',
    ' parle-moi ',
    ' meteo ',
    ' projet ',
    ' services ',
    ' prix ',
    ' contactez ',
    ' je veux ',
    " j'ai besoin ",
    ' besoin ',
    ' site web ',
    ' quelles sont les competences ',
    ' quels services ',
];

const SPANISH_HINTS = [
    ' hola ',
    ' que habilidades ',
    ' que servicios ',
    ' muestrame ',
    ' precio ',
    ' cuanto ',
    ' quiero un logo',
    ' necesito ',
    ' servicios ofrece ',
    ' habilidades tiene ',
];

export function detectAssistantLanguage(text: string): AssistantLanguage {
    const padded = ` ${normalize(text)} `;

    if (SWAHILI_HINTS.some((hint) => padded.includes(hint))) {
        return 'sw';
    }

    if (FRENCH_HINTS.some((hint) => padded.includes(hint))) {
        return 'fr';
    }

    if (SPANISH_HINTS.some((hint) => padded.includes(hint))) {
        return 'es';
    }

    return 'en';
}

export function getReplyLanguage(latestUserMessage: string, fallbackLanguage: AssistantLanguage = 'en') {
    const detected = detectAssistantLanguage(latestUserMessage);
    return latestUserMessage.trim() ? detected : fallbackLanguage;
}

export function localizeAssistantText(language: AssistantLanguage, copy: { en: string; sw: string; fr: string; es?: string }) {
    if (language === 'sw') {
        return copy.sw;
    }

    if (language === 'fr') {
        return copy.fr;
    }

    if (language === 'es') {
        return copy.es ?? copy.en;
    }

    return copy.en;
}
