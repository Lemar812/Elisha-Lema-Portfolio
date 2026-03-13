import { useEffect, useState } from 'react';

const FOOTER_SELECTOR = '[data-floating-footer-boundary]';
const EXTRA_CLEARANCE_PX = 28;
const MAX_LIFT_PX = 220;

export function useFloatingDockOffset() {
    const [lift, setLift] = useState(0);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        let frameId = 0;

        const update = () => {
            const footer = document.querySelector<HTMLElement>(FOOTER_SELECTOR);

            if (!footer) {
                setLift(0);
                return;
            }

            const { top } = footer.getBoundingClientRect();
            const overlap = Math.max(window.innerHeight - top + EXTRA_CLEARANCE_PX, 0);
            const nextLift = Math.min(overlap, MAX_LIFT_PX);

            setLift((current) => (current === nextLift ? current : nextLift));
        };

        const scheduleUpdate = () => {
            window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(update);
        };

        scheduleUpdate();
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
        };
    }, []);

    return lift;
}
