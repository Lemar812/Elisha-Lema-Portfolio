import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Portfolio from './Portfolio';
import PrivacyPolicy from './components/PrivacyPolicy.tsx';
import TermsOfService from './components/TermsOfService.tsx';
import PolicyConsentModal from './components/PolicyConsentModal.tsx';
import { ASSISTANT_ROUTE_EVENT } from './lib/assistantActions';
import { acceptPolicyConsent, hasAcceptedPolicyConsent } from './lib/policyConsent';
import type { AssistantRouteTarget } from './lib/assistantTypes';

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [hasConsent, setHasConsent] = useState(() => hasAcceptedPolicyConsent());

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleAssistantRoute = (event: Event) => {
            const customEvent = event as CustomEvent<{ route?: AssistantRouteTarget }>;
            const route = customEvent.detail?.route;

            if (!route) {
                return;
            }

            navigate(route);
        };

        window.addEventListener(ASSISTANT_ROUTE_EVENT, handleAssistantRoute);
        return () => window.removeEventListener(ASSISTANT_ROUTE_EVENT, handleAssistantRoute);
    }, [navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleAcceptPolicies = () => {
        acceptPolicyConsent();
        setHasConsent(true);
    };

    return (
        <>
            <Routes>
                <Route path="/" element={<Portfolio canShowAssistantNudge={hasConsent} />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
            <PolicyConsentModal open={!hasConsent} onAccept={handleAcceptPolicies} />
        </>
    );
}

export default App;
