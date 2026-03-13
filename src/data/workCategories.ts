import { works } from './works';
import type { AssistantWorksCategory } from '../lib/assistantTypes';

export const assistantWorkCategories: AssistantWorksCategory[] = [
    {
        id: 'logo-work',
        label: 'Logo Work',
        description: 'Logo and identity pieces focused on brand marks, recognition, and visual identity.',
        keywords: ['logo', 'logos', 'logo work', 'branding work', 'identity', 'brand identity', 'brand marks'],
        target: 'works',
        actionType: 'scroll',
        filter: 'Logo',
        exampleProjectIds: works.filter((work) => work.category === 'Logo').slice(0, 3).map((work) => work.id ?? work._id ?? ''),
    },
    {
        id: 'poster-banner-work',
        label: 'Poster and Banner Designs',
        description: 'Poster, banner, brochure, flyer-style, and promotional design pieces from the gallery.',
        keywords: ['poster', 'posters', 'banner', 'banners', 'flyer', 'flyers', 'brochure', 'brochures', 'promo design', 'campaign design'],
        target: 'works',
        actionType: 'scroll',
        filter: 'Poster/Banner',
        exampleProjectIds: works.filter((work) => work.category === 'Poster/Banner').slice(0, 4).map((work) => work.id ?? work._id ?? ''),
    },
    {
        id: 'website-projects',
        label: 'Website Projects',
        description: 'Website showcase work highlighting layout, UI presentation, and polished web execution.',
        keywords: ['website', 'websites', 'website projects', 'web project', 'web design', 'web development', 'ui work'],
        target: 'works',
        actionType: 'scroll',
        filter: "Website's Screenshot",
        exampleProjectIds: works.filter((work) => work.category === "Website's Screenshot").map((work) => work.id ?? work._id ?? ''),
    },
    {
        id: 'travel-safari-designs',
        label: 'Travel and Safari Designs',
        description: 'Travel-oriented pieces in the gallery, including tourism posters and safari-related visual work.',
        keywords: ['travel', 'travel design', 'travel designs', 'safari', 'safari designs', 'tourism', 'tour designs'],
        target: 'works',
        actionType: 'scroll',
        exampleProjectIds: works
            .filter((work) => work.tags.some((tag) => ['travel', 'campaign'].includes(tag.toLowerCase())) || work.title.toLowerCase().includes('tours'))
            .map((work) => work.id ?? work._id ?? ''),
    },
];
