export interface Work {
    _id: string; // From MongoDB
    id?: string; // Legacy
    title: string;
    category: 'Logo' | 'Poster/Banner' | "Website's Screenshot";
    imageSrc: string;
    description: string;
    tags: string[];
    websiteUrl?: string; // Optional website link for screenshots
    status?: string;
    views?: number;
}

export const works: Work[] = [];

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
