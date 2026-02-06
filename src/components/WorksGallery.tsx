import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkCard from './WorkCard';
import WorkModal from './WorkModal';
import SectionHeading from './SectionHeading';
import { cn } from '../lib/utils';
import FloatingTooltip from './FloatingTooltip';
import { works as worksData } from '../data/works';

const categories = [
    { name: "All", tooltip: "View Everything" },
    { name: "Logo", tooltip: "Identity Design" },
    { name: "Poster/Banner", tooltip: "Visual Arts" },
    { name: "Website's Screenshot", tooltip: "Web Design" }
];

export default function WorksGallery() {
    const [filter, setFilter] = useState("All");
    const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
    const works = worksData;

    const filteredWorks = filter === "All"
        ? works
        : works.filter(work => work.category === filter);

    const selectedWork = works.find(w => (w._id || w.id) === selectedWorkId) || null;

    return (
        <section id="works" className="py-16 md:py-24 px-4 md:px-6 bg-surface/30">
            <div className="container mx-auto">
                <SectionHeading
                    title="Works Gallery"
                    subtitle="Explore the complete collection of design and development projects."
                    centered
                />

                {/* Filters - Scrollable on mobile */}
                <div className="flex justify-center mb-10 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide no-scrollbar md:flex-wrap md:justify-center w-full">
                        {categories.map((cat) => (
                            <FloatingTooltip key={cat.name} text={cat.tooltip} color={filter === cat.name ? "primary" : "secondary"} position="top">
                                <button
                                    onClick={() => setFilter(cat.name)}
                                    className={cn(
                                        "px-5 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap outline-none flex-shrink-0",
                                        filter === cat.name
                                            ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                                            : "bg-surface border border-white/5 text-text-muted hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            </FloatingTooltip>
                        ))}
                    </div>
                </div>

                {/* Grid - Smart responsive columns */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredWorks.map((work) => {
                            const workId = work._id || work.id;
                            return (
                                <WorkCard
                                    key={workId}
                                    work={work}
                                    onClick={(w) => setSelectedWorkId(w._id || w.id || null)}
                                    className="brightness-95 hover:brightness-100"
                                />
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
                {filteredWorks.length === 0 && (
                    <div className="text-center text-text-muted text-sm mt-12">
                        No works added yet.
                    </div>
                )}
            </div>

            <WorkModal
                work={selectedWork}
                onClose={() => setSelectedWorkId(null)}
            />
        </section>
    );
}
