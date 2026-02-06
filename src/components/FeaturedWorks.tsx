import { useState } from 'react';
import { motion } from 'framer-motion';
import { works } from '../data/works';
import WorkCard from './WorkCard';
import WorkModal from './WorkModal';
import SectionHeading from './SectionHeading';
import { containerStagger, itemStagger } from '../lib/animations';

export default function FeaturedWorks() {
    const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

    const featuredWorks = works.slice(0, 6);
    const selectedWork = works.find(w => w.id === selectedWorkId) || null;

    return (
        <section id="featured" className="py-16 md:py-24 px-4 md:px-6 relative z-10">
            <div className="container mx-auto">
                <SectionHeading
                    title="Selected Works"
                    subtitle="A curated selection of projects that define my visual style."
                />

                <motion.div
                    variants={containerStagger}
                    whileInView="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {featuredWorks.map((work) => (
                        <motion.div key={work.id} variants={itemStagger}>
                            <WorkCard
                                work={work}
                                onClick={(w) => setSelectedWorkId(w.id ?? null)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <WorkModal
                work={selectedWork}
                onClose={() => setSelectedWorkId(null)}
            />
        </section>
    );
}
