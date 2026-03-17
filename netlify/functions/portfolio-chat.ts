import { inferCommercialSignals } from '../../src/lib/assistantLeadUtils';
import { localizeAssistantText } from '../../src/lib/assistantLanguage';
import { buildSessionIntentContext } from '../../src/lib/assistantWorkflow';
import { buildProviderMessages } from './_shared/portfolioPrompt';
import {
    jsonResponse,
    parseAssistantModelResponse,
    parseAssistantRequest,
} from './_shared/portfolioSchema';
import { checkRateLimit, getRateLimitKey } from './_shared/rateLimit';

type NetlifyEvent = {
    httpMethod?: string;
    body: string | null;
    headers?: Record<string, string | undefined>;
};

type ProviderResponse = {
    choices?: Array<{
        message?: {
            content?: string | null;
        };
    }>;
};

const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai';
const DEFAULT_MODEL = 'gemini-3-flash-preview';
const PROVIDER_TIMEOUT_MS = 15000;

export async function handler(event: NetlifyEvent) {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed.' });
    }

    const request = parseAssistantRequest(event.body);

    if ('error' in request) {
        return jsonResponse(request.statusCode, { error: request.error });
    }

    const headers = Object.fromEntries(
        Object.entries(event.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value])
    );

    const rateLimitKey = getRateLimitKey(headers);

    if (!checkRateLimit(rateLimitKey)) {
        const language = request.sessionContext?.language ?? 'en';
        return jsonResponse(429, {
            message: localizeAssistantText(language, {
                en: 'Please wait a moment before sending another message.',
                sw: 'Tafadhali subiri kidogo kabla ya kutuma ujumbe mwingine.',
                fr: 'Veuillez patienter un instant avant d’envoyer un autre message.',
                es: 'Espera un momento antes de enviar otro mensaje.',
            }),
            mode: 'fallback',
            intent: 'general',
            reason: 'rate_limited',
        });
    }

    const apiKey =
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return jsonResponse(503, { error: 'Assistant provider is not configured.' });
    }

    const insightHistory = [
        ...(request.history ?? []),
        { role: 'user' as const, content: request.message },
    ];

    const commercialSignals = inferCommercialSignals(insightHistory);
    const sessionContext = buildSessionIntentContext(insightHistory, request.sessionContext);

    const baseUrl = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                temperature: 0.2,
                messages: buildProviderMessages(request.history ?? [], request.message, sessionContext),
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('portfolio-chat provider error', response.status, errorText.slice(0, 400));

            return jsonResponse(502, {
                error: 'Assistant provider request failed.',
            });
        }

        const data = (await response.json()) as ProviderResponse;
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            return jsonResponse(502, {
                error: 'Assistant provider returned no content.',
            });
        }

        const parsed = parseAssistantModelResponse(content);

        if (!parsed) {
            console.error('portfolio-chat invalid model output', content.slice(0, 400));

            return jsonResponse(502, {
                error: 'Assistant provider returned invalid content.',
            });
        }

        const allowInjectedRecommendations =
            parsed.intent === 'projects' ||
            parsed.intent === 'services' ||
            (parsed.intent === 'lead' && parsed.confidence?.level !== 'low');

        return jsonResponse(200, {
            ...parsed,
            intent:
                parsed.intent === 'general' && commercialSignals.qualification.status !== 'insufficient'
                    ? 'lead'
                    : parsed.intent,
            recommendations:
                parsed.recommendations && parsed.recommendations.length
                    ? parsed.recommendations
                    : allowInjectedRecommendations
                      ? commercialSignals.recommendations
                      : undefined,
            qualification: commercialSignals.qualification,
            confidence:
                parsed.confidence ??
                ({
                    level: commercialSignals.qualification.status === 'sufficient' ? 'high' : 'medium',
                    escalateToContact: commercialSignals.qualification.status !== 'insufficient',
                } as const),
        });
    } catch (error) {
        console.error('portfolio-chat request failed', error);

        return jsonResponse(500, {
            error: 'Assistant request failed.',
        });
    } finally {
        clearTimeout(timeoutId);
    }
}
