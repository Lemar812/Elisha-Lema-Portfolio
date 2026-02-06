export interface Work {
    _id?: string;
    id?: string;
    title: string;
    category: 'Logo' | 'Poster/Banner' | "Website's Screenshot";
    imageSrc: string;
    description: string;
    tags: string[];
    websiteUrl?: string;
    status?: string;
    views?: number;
}

export const works: Work[] = [
    {
        id: "work-1",
        title: "Kili Expeditions",
        category: "Logo",
        imageSrc: "/works/Logos/Kili Expeditions.jpg",
        description: "Brand mark crafted for recognition, balance, and scalability.",
        tags: ["Logo", "Brand", "Identity"],
        websiteUrl: '',
    },
    {
        id: "work-2",
        title: "Macha Stores",
        category: "Logo",
        imageSrc: "/works/Logos/Macha Stores.jpg",
        description: "Brand mark crafted for recognition, balance, and scalability.",
        tags: ["Logo", "Brand", "Identity"],
        websiteUrl: '',
    },
    {
        id: "work-3",
        title: "Mountain Expeditions",
        category: "Logo",
        imageSrc: "/works/Logos/Mountain Expeditions.jpg",
        description: "Brand mark crafted for recognition, balance, and scalability.",
        tags: ["Logo", "Brand", "Identity"],
        websiteUrl: '',
    },
    {
        id: "work-4",
        title: "Mtumba Classic",
        category: "Logo",
        imageSrc: "/works/Logos/Mtumba Classic.jpg",
        description: "Brand mark crafted for recognition, balance, and scalability.",
        tags: ["Logo", "Brand", "Identity"],
        websiteUrl: '',
    },
    {
        id: "work-5",
        title: "RestoPulse",
        category: "Logo",
        imageSrc: "/works/Logos/RestoPulse Logo.png",
        description: "Brand mark crafted for recognition, balance, and scalability.",
        tags: ["Logo", "Brand", "Identity"],
        websiteUrl: '',
    },
    {
        id: "work-6",
        title: "TANGAZENI INJILI CHOIR",
        category: "Logo",
        imageSrc: "/works/Logos/TANGAZENI INJILI CHOIR .jpg",
        description: "Brand mark crafted for recognition, balance, and scalability.",
        tags: ["Logo", "Brand", "Identity"],
        websiteUrl: '',
    },
    {
        id: "work-7",
        title: "A&B Accessories Bronchure BP",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/A&B Accessories Bronchure BP.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-8",
        title: "A&B Accessories Bronchure FP",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/A&B Accessories Bronchure FP.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-9",
        title: "A&B Accessories Poster",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/A&B Accessories Poster.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-10",
        title: "Angiee's Hair Saloon",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/Angiee's Hair Saloon.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-11",
        title: "Digital Networking Poster",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/Digital Networking Poster.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-12",
        title: "Food Poster",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/Food Poster.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-13",
        title: "Hilda Wakala Banner",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/Hilda Wakala Banner.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-14",
        title: "Serval Wildlife Poster",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/Serval Wildlife Poster.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-15",
        title: "Social Night Poster",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/Social Night Poster.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-16",
        title: "TIC New Year Poster",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/TIC New Year Poster.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-17",
        title: "TIC Youtube Thumbnail",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/TIC Youtube Thumbnail.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-18",
        title: "Usaili 2024",
        category: "Poster/Banner",
        imageSrc: "/works/Posters & Banners/Usaili 2024.jpg",
        description: "Promotional visual designed for clarity, hierarchy, and impact.",
        tags: ["Poster", "Promo", "Design"],
        websiteUrl: '',
    },
    {
        id: "work-19",
        title: "NatureWiseTours",
        category: "Website's Screenshot",
        imageSrc: "/works/Website's Screenshots/NatureWiseTours.jpg",
        description: "Website snapshot highlighting layout, typography, and visual polish.",
        tags: ["Web", "UI", "Design"],
        websiteUrl: '',
    },
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