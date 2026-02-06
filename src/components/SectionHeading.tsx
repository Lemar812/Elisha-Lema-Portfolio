import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { fadeInUp } from '../lib/animations';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    className?: string;
    centered?: boolean;
}

export default function SectionHeading({ title, subtitle, className, centered = false }: SectionHeadingProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className={cn("mb-10 md:mb-20", centered && "text-center", className)}
        >
            <h2 className="text-3xl md:text-5xl font-bold font-satoshi mb-3 md:mb-4 text-white tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-text-muted text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
