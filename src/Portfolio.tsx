import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import WorksGallery from './components/WorksGallery';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackgroundFX from './components/background/BackgroundFX';
import AssistantLauncher from './components/assistant/AssistantLauncher';
import AssistantPanel from './components/assistant/AssistantPanel';
import { assistantKnowledge } from './data/assistantKnowledge';
import { useAssistant } from './hooks/useAssistant';

export default function Portfolio() {
    const {
        isOpen,
        isTyping,
        messages,
        showQuickActions,
        quickActions,
        inquirySummary,
        closeAssistant,
        toggleAssistant,
        submitMessage,
        handleQuickAction,
        handleMessageAction,
        handleMessageCta,
        handleRecommendationClick,
        handleCopyInquirySummary,
        handleUseInquirySummary,
    } = useAssistant();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        window.__portfolioLenis = lenis;

        return () => {
            delete window.__portfolioLenis;
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen text-text-primary selection:bg-primary/30 relative bg-background">
            <BackgroundFX />
            <div className="relative z-10">
                <Navbar />
                <main>
                    <Hero />
                    <Skills />
                    <WorksGallery />
                    <Services />
                    <About />
                    <Testimonials />
                    <Contact />
                </main>
                <Footer />
            </div>
            <ScrollToTop />
            <AssistantPanel
                open={isOpen}
                title={assistantKnowledge.assistantTitle}
                subtitle={assistantKnowledge.assistantSubtitle}
                messages={messages}
                isTyping={isTyping}
                showQuickActions={showQuickActions}
                quickActions={quickActions}
                inquirySummary={inquirySummary}
                onClose={closeAssistant}
                onSubmit={submitMessage}
                onQuickAction={handleQuickAction}
                onMessageAction={handleMessageAction}
                onMessageCta={handleMessageCta}
                onRecommendationClick={handleRecommendationClick}
                onCopyInquirySummary={handleCopyInquirySummary}
                onUseInquirySummary={handleUseInquirySummary}
            />
            <AssistantLauncher open={isOpen} onToggle={toggleAssistant} />
        </div>
    );
}
