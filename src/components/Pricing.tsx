import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeDollarSign, Check, Layers3, MonitorSmartphone, Shapes } from 'lucide-react';
import Button from './Button';
import SectionHeading from './SectionHeading';
import { sectionReveal, staggerContainer, staggerItem, EASE } from '../lib/motion';

type PricingRow = {
    label: string;
    badge: string;
    tzs: string;
    usd: string;
    detail?: string;
};

type PricingCard = {
    title: string;
    icon: typeof Layers3;
    accent: string;
    description: string;
    prices: PricingRow[];
    highlight?: string;
};

const pricingCards: PricingCard[] = [
    {
        title: 'Posters / Banners / Flyers',
        icon: Layers3,
        accent: 'Best for ongoing campaigns',
        description: 'Commercial visuals for promotions, launches, offers, and event communication.',
        prices: [
            { label: 'Single work', badge: 'Single Work', tzs: '15,000 TZS', usd: '6 USD' },
            { label: 'Bulk work', badge: 'Bulk Work', detail: '10+ items', tzs: '5,000 TZS each', usd: '2 USD each' },
        ],
        highlight: 'Bulk pricing is ideal for businesses that need consistent promo output at scale.',
    },
    {
        title: 'Logo Design',
        icon: Shapes,
        accent: 'Fixed identity package',
        description: 'Focused logo creation for a cleaner, more professional brand presentation.',
        prices: [
            { label: 'Single fixed price', badge: 'Single Fixed Price', tzs: '20,000 TZS', usd: '8 USD' },
        ],
    },
    {
        title: 'Website Design / Development',
        icon: MonitorSmartphone,
        accent: 'Custom project range',
        description: 'Responsive websites designed to present your business with clarity and credibility.',
        prices: [
            { label: 'Project range', badge: 'Project', tzs: '200,000 - 250,000 TZS', usd: '77 - 95 USD' },
        ],
    },
];

export default function Pricing() {
    const scrollToContact = () => {
        const element = document.querySelector('#contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="pricing" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl 2xl:max-w-7xl">
                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <SectionHeading
                        title="Pricing"
                        subtitle="Clear starting rates for brand, promotional, and web work, presented in both TZS and USD."
                        centered
                    />
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {pricingCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                variants={staggerItem}
                                whileHover={{ y: -8, scale: 1.01 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="relative rounded-card border border-white/8 bg-surface/50 backdrop-blur-sm p-7 md:p-8 overflow-hidden group"
                            >
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70" />
                                <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />

                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.28em] text-primary/80 font-bold mb-3">
                                            {card.accent}
                                        </p>
                                        <h3 className="text-2xl font-satoshi font-bold text-white tracking-tight">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
                                        <Icon size={22} />
                                    </div>
                                </div>

                                <p className="text-sm md:text-base text-text-muted leading-relaxed mb-6">
                                    {card.description}
                                </p>

                                <div className="space-y-4">
                                    {card.prices.map((price) => (
                                        <div key={price.label} className="rounded-2xl border border-white/6 bg-black/20 px-4 py-4">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <p className="text-white font-semibold">{price.label}</p>
                                                    {price.detail && (
                                                        <p className="text-xs uppercase tracking-[0.22em] text-text-muted/70 mt-1">
                                                            {price.detail}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-primary font-bold leading-none">
                                                        {price.badge}
                                                    </div>
                                                    <BadgeDollarSign size={18} className="text-primary/80 shrink-0 mt-0.5" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="rounded-xl bg-white/[0.03] border border-white/6 px-3 py-3">
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted/70 mb-1">TZS</p>
                                                    <p className="text-white font-bold">{price.tzs}</p>
                                                </div>
                                                <div className="rounded-xl bg-white/[0.03] border border-white/6 px-3 py-3">
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted/70 mb-1">USD</p>
                                                    <p className="text-white font-bold">{price.usd}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {card.highlight && (
                                    <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/8 px-4 py-4">
                                        <div className="flex items-start gap-3">
                                            <Check size={16} className="text-primary shrink-0 mt-0.5" />
                                            <p className="text-sm text-white/85 leading-relaxed">{card.highlight}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="mt-8 md:mt-10 rounded-card border border-white/8 bg-gradient-to-r from-white/[0.03] via-primary/[0.06] to-white/[0.03] backdrop-blur-sm p-6 md:p-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="max-w-3xl">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-bold mb-3">Before You Proceed</p>
                            <p className="text-white text-base md:text-lg leading-relaxed">
                                Review the Terms of Service carefully before placing an order or starting a project.
                            </p>
                            <p className="text-text-muted text-sm md:text-base leading-relaxed mt-2">
                                It outlines project scope, payments, revisions, delivery, and ownership so expectations stay clear from the start.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <Link
                                to="/terms-of-service"
                                className="inline-flex items-center justify-center gap-2 rounded-button border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20"
                            >
                                Read Terms
                                <ArrowRight size={16} />
                            </Link>
                            <Button variant="primary" size="md" onClick={scrollToContact} className="px-5">
                                Start a Project
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
