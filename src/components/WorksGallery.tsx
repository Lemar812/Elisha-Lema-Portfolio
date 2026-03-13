import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkCard from './WorkCard';
import WorkModal from './WorkModal';
import SectionHeading from './SectionHeading';
import { cn } from '../lib/utils';
import FloatingTooltip from './FloatingTooltip';
import { ASSISTANT_WORKS_FILTER_EVENT } from '../lib/assistantActions';
import { works as worksData, WORK_GALLERY_FILTERS } from '../data/works';
import type { AssistantWorksFilter } from '../lib/assistantTypes';

const categories = [
    { name: 'All' as const, tooltip: 'View Everything' },
    ...WORK_GALLERY_FILTERS.map((category) => ({
        name: category,
        tooltip:
            category === 'Logo'
                ? 'Identity Design'
                : category === 'Poster/Banner'
                  ? 'Visual Arts'
                  : 'Web Design',
    })),
];

type WorksGalleryFilter = 'All' | AssistantWorksFilter;

export default function WorksGallery() {
    const [filter, setFilter] = useState<WorksGalleryFilter>('All');
    const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
    const works = worksData;

    useEffect(() => {
        const handleAssistantFilter = (event: Event) => {
            const customEvent = event as CustomEvent<{ filter?: AssistantWorksFilter }>;
            const nextFilter = customEvent.detail?.filter;

            if (!nextFilter || !WORK_GALLERY_FILTERS.includes(nextFilter)) {
                return;
            }

            setSelectedWorkId(null);
            setFilter(nextFilter);
        };

        window.addEventListener(ASSISTANT_WORKS_FILTER_EVENT, handleAssistantFilter);
        return () => window.removeEventListener(ASSISTANT_WORKS_FILTER_EVENT, handleAssistantFilter);
    }, []);

    const filteredWorks = filter === 'All' ? works : works.filter((work) => work.category === filter);
    const selectedWork = works.find((work) => (work._id || work.id) === selectedWorkId) || null;

    return (
        <section id="works" className="bg-surface/30 px-4 py-16 md:px-6 md:py-24">
            <div className="container mx-auto max-w-6xl 2xl:max-w-7xl">
                <SectionHeading
                    title="Works Gallery"
                    subtitle="Explore the complete collection of design and development projects."
                    centered
                />

                <div className="-mx-4 mb-10 flex justify-center px-4 md:mx-0 md:px-0">
                    <div className="no-scrollbar scrollbar-hide flex w-full gap-2 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:pb-0">
                        {categories.map((category) => (
                            <FloatingTooltip
                                key={category.name}
                                text={category.tooltip}
                                color={filter === category.name ? 'primary' : 'secondary'}
                                position="top"
                            >
                                <button
                                    type="button"
                                    onClick={() => setFilter(category.name)}
                                    className={cn(
                                        'flex-shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-xs font-medium outline-none transition-all duration-300 md:px-6 md:text-sm',
                                        filter === category.name
                                            ? 'scale-105 bg-primary text-white shadow-lg shadow-primary/25'
                                            : 'border border-white/5 bg-surface text-text-muted hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    {category.name}
                                </button>
                            </FloatingTooltip>
                        ))}
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {filteredWorks.map((work) => {
                            const workId = work._id || work.id;
                            return (
                                <WorkCard
                                    key={workId}
                                    work={work}
                                    onClick={(nextWork) => setSelectedWorkId(nextWork._id || nextWork.id || null)}
                                    className="brightness-95 hover:brightness-100"
                                />
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {filteredWorks.length === 0 && (
                    <div className="mt-12 text-center text-sm text-text-muted">No works added yet.</div>
                )}
            </div>

            <WorkModal work={selectedWork} onClose={() => setSelectedWorkId(null)} />
        </section>
    );
}
