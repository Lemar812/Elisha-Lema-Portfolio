export const POLICY_CONSENT_VERSION = 'v2';
export const POLICY_CONSENT_STORAGE_KEY = `site_policy_consent_${POLICY_CONSENT_VERSION}`;
const POLICY_CONSENT_VALUE = 'accepted';

function canUseLocalStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function hasAcceptedPolicyConsent() {
    if (!canUseLocalStorage()) {
        return false;
    }

    try {
        return window.localStorage.getItem(POLICY_CONSENT_STORAGE_KEY) === POLICY_CONSENT_VALUE;
    } catch {
        return false;
    }
}

export function acceptPolicyConsent() {
    if (!canUseLocalStorage()) {
        return;
    }

    try {
        window.localStorage.setItem(POLICY_CONSENT_STORAGE_KEY, POLICY_CONSENT_VALUE);
    } catch {
        return;
    }
}

