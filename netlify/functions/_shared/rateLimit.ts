type RateLimitState = {
    timestamps: number[];
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const rateLimitStore = new Map<string, RateLimitState>();

function prune(now: number, timestamps: number[]) {
    return timestamps.filter((timestamp) => now - timestamp < WINDOW_MS);
}

export function getRateLimitKey(headers: Record<string, string | undefined>) {
    const forwardedFor = headers['x-forwarded-for']?.split(',')[0]?.trim();
    const realIp = headers['client-ip']?.trim() || headers['x-nf-client-connection-ip']?.trim();
    return forwardedFor || realIp || 'unknown-client';
}

export function checkRateLimit(key: string) {
    const now = Date.now();
    const current = rateLimitStore.get(key) ?? { timestamps: [] };
    const activeTimestamps = prune(now, current.timestamps);

    if (activeTimestamps.length >= MAX_REQUESTS) {
        rateLimitStore.set(key, { timestamps: activeTimestamps });
        return false;
    }

    activeTimestamps.push(now);
    rateLimitStore.set(key, { timestamps: activeTimestamps });

    if (rateLimitStore.size > 500) {
        for (const [entryKey, value] of rateLimitStore.entries()) {
            const nextTimestamps = prune(now, value.timestamps);

            if (!nextTimestamps.length) {
                rateLimitStore.delete(entryKey);
            } else {
                rateLimitStore.set(entryKey, { timestamps: nextTimestamps });
            }
        }
    }

    return true;
}

export const rateLimitConfig = {
    windowMs: WINDOW_MS,
    maxRequests: MAX_REQUESTS,
};
