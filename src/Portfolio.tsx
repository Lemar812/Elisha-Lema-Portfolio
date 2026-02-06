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

export default function Portfolio() {
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

        return () => {
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
        </div>
    );
}
