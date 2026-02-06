export interface Work {
    _id?: string;
    id?: string;
    title: string;
    category: 'Logo' | 'Poster/Banner' | "Website's Screenshot";
    imageSrc: string;
    description: string;
    tags: string[];
    websiteUrl?: string; // Optional website link for screenshots
    status?: string;
    views?: number;
}

export const works: Work[] = [
    {
        id: 'logo-1',
        title: 'Kili Expeditions',
        category: 'Logo',
        imageSrc: '/works/Logos/Kili Expeditions.jpg',
        description: 'Adventure brand mark with strong geometric balance and clean silhouette.',
        tags: ['Brand', 'Logo', 'Adventure'],
        websiteUrl: ''
    },
    {
        id: 'logo-2',
        title: 'Macha Stores',
        category: 'Logo',
        imageSrc: '/works/Logos/Macha Stores.jpg',
        description: 'Retail logo focusing on readability and bold form for signage and packaging.',
        tags: ['Retail', 'Identity', 'Logo'],
        websiteUrl: ''
    },
    {
        id: 'logo-3',
        title: 'RestoPulse',
        category: 'Logo',
        imageSrc: '/works/Logos/RestoPulse Logo.png',
        description: 'Modern restaurant identity with a vibrant, energetic symbol.',
        tags: ['Restaurant', 'Brand', 'Logo'],
        websiteUrl: ''
    },
    {
        id: 'logo-4',
        title: 'Mountain Expeditions',
        category: 'Logo',
        imageSrc: '/works/Logos/Mountain Expeditions.jpg',
        description: 'Outdoor exploration logo with a crisp icon suited for digital and print.',
        tags: ['Outdoor', 'Travel', 'Logo'],
        websiteUrl: ''
    },
    {
        id: 'poster-1',
        title: "Angiee's Hair Saloon",
        category: 'Poster/Banner',
        imageSrc: "/works/Posters & Banners/Angiee's Hair Saloon.jpg",
        description: 'Salon promo poster with clean hierarchy and bold service highlights.',
        tags: ['Poster', 'Beauty', 'Promo'],
        websiteUrl: ''
    },
    {
        id: 'poster-2',
        title: 'Digital Networking Poster',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Digital Networking Poster.jpg',
        description: 'Event poster for a tech networking meetup with a modern layout.',
        tags: ['Event', 'Tech', 'Poster'],
        websiteUrl: ''
    },
    {
        id: 'web-1',
        title: 'NatureWise Tours',
        category: "Website's Screenshot",
        imageSrc: "/works/Website's Screenshots/NatureWiseTours.jpg",
        description: 'Website snapshot showcasing a clean travel brand experience.',
        tags: ['Web', 'Tourism', 'UI'],
        websiteUrl: ''
    }
];

export const services = [
    {
        title: 'Brand Identity',
        icon: 'PenTool',
        description: 'Creating unique visual identities, logos, and brand guidelines that tell your story.'
    },
    {
        title: 'Web Development',
        icon: 'Code',
        description: 'Building fast, secure, and scalable web applications using the latest technologies.'
    },
    {
        title: 'Graphic Design',
        icon: 'Layers',
        description: 'High-quality visual assets for digital and print media, from posters to brochures.'
    }
];
