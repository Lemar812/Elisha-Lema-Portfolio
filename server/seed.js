import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const WorkSchema = new mongoose.Schema({
    title: String,
    category: String,
    imageSrc: String,
    description: String,
    tags: [String],
    websiteUrl: String,
    status: { type: String, default: 'Live' },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Work = mongoose.model('Work', WorkSchema);

const SkillSchema = new mongoose.Schema({
    name: String,
    percentage: Number,
    category: String,
    icon: String,
    color: String,
    createdAt: { type: Date, default: Date.now }
});
const Skill = mongoose.model('Skill', SkillSchema);

const ProfileSchema = new mongoose.Schema({
    bio: String,
    experience: String,
    location: String,
    email: String,
    updatedAt: { type: Date, default: Date.now }
});
const Profile = mongoose.model('Profile', ProfileSchema);

const initialWorks = [
    // Website Screenshots
    {
        title: 'NatureWise Tours',
        category: "Website's Screenshot",
        imageSrc: "/works/Website's Screenshots/NatureWiseTours.jpg",
        description: 'A comprehensive tourism platform for nature expeditions and guided tours.',
        tags: ['React', 'Tourism', 'UI/UX'],
        websiteUrl: 'https://naturewisetours.netlify.app',
        views: 1250
    },
    // Logos
    {
        title: 'Kili Expeditions',
        category: 'Logo',
        imageSrc: '/works/Logos/Kili Expeditions.jpg',
        description: 'Brand identity design for a leading mountain climbing expedition company.',
        tags: ['Branding', 'Logos', 'Travel'],
        views: 840
    },
    {
        title: 'Macha Stores',
        category: 'Logo',
        imageSrc: '/works/Logos/Macha Stores.jpg',
        description: 'Modern retail brand identity with a focus on simplicity and accessibility.',
        tags: ['Retail', 'Corporate', 'Branding'],
        views: 620
    },
    {
        title: 'Mountain Expeditions',
        category: 'Logo',
        imageSrc: '/works/Logos/Mountain Expeditions.jpg',
        description: 'High-altitude adventure group logo design.',
        tags: ['Adventure', 'Outdoor', 'Graphic Design'],
        views: 450
    },
    {
        title: 'Mtumba Classic',
        category: 'Logo',
        imageSrc: '/works/Logos/Mtumba Classic.jpg',
        description: 'A classic logo for a high-end thrift and apparel brand.',
        tags: ['Fashion', 'Vintage', 'Identity'],
        views: 310
    },
    {
        title: 'RestoPulse',
        category: 'Logo',
        imageSrc: '/works/Logos/RestoPulse Logo.png',
        description: 'Tech-forward restaurant management system branding.',
        tags: ['Tech', 'SaaS', 'Restaurant'],
        views: 920
    },
    {
        title: 'Tangazeni Injili Choir',
        category: 'Logo',
        imageSrc: '/works/Logos/TANGAZENI INJILI CHOIR .jpg',
        description: 'Vibrant identity for a gospel choir community.',
        tags: ['Gospel', 'Religious', 'Community'],
        views: 150
    },
    // Posters & Banners
    {
        title: 'A&B Accessories Brochure',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/A&B Accessories Bronchure FP.jpg',
        description: 'Premium product showcase brochure for mobile accessories.',
        tags: ['Print', 'Layout', 'Product'],
        views: 540
    },
    {
        title: 'Angiee\'s Hair Saloon',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Angiee\'s Hair Saloon.jpg',
        description: 'Marketing poster for a high-end beauty and hair styling salon.',
        tags: ['Marketing', 'Beauty', 'Service'],
        views: 280
    },
    {
        title: 'Digital Networking Poster',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Digital Networking Poster.jpg',
        description: 'Abstract visual representing the power of global connectivity.',
        tags: ['Digital', 'Concept', 'Modern'],
        views: 410
    },
    {
        title: 'Social Night Event',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Social Night Poster.jpg',
        description: 'High-energy event poster for a community gathering.',
        tags: ['Event', 'Entertainment', 'Social'],
        views: 670
    },
    {
        title: 'Hilda Wakala Banner',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Hilda Wakala Banner.jpg',
        description: 'Professional service banner for financial agency.',
        tags: ['Finance', 'Corporate', 'Banner'],
        views: 220
    },
    {
        title: 'Serval Wildlife Poster',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Serval Wildlife Poster.jpg',
        description: 'Conservation awareness poster featuring exotic wildlife.',
        tags: ['Conservation', 'Nature', 'Poster'],
        views: 190
    },
    {
        title: 'TIC Youtube Thumbnail',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/TIC Youtube Thumbnail.jpg',
        description: 'Engaging visual designed for high click-through rates on digital platforms.',
        tags: ['Digital', 'Social Media', 'Marketing'],
        views: 1100
    },
    {
        title: 'A&B Accessories Poster',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/A&B Accessories Poster.jpg',
        description: 'Eye-catching promotional poster for mobile accessories retail brand.',
        tags: ['Retail', 'Marketing', 'Product'],
        views: 380
    },
    {
        title: 'Food Poster',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Food Poster.jpg',
        description: 'Appetizing food promotional poster for restaurant marketing.',
        tags: ['Food', 'Culinary', 'Marketing'],
        views: 520
    },
    {
        title: 'TIC New Year Poster',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/TIC New Year Poster.jpg',
        description: 'Festive new year celebration poster with modern design elements.',
        tags: ['Event', 'Holiday', 'Celebration'],
        views: 680
    },
    {
        title: 'Usaili 2024',
        category: 'Poster/Banner',
        imageSrc: '/works/Posters & Banners/Usaili 2024.jpg',
        description: 'Creative design for annual 2024 initiative promotional campaign.',
        tags: ['Campaign', 'Event', 'Branding'],
        views: 450
    }
];

const initialSkills = [
    {
        name: 'Adobe Photoshop',
        percentage: 92,
        category: 'design',
        icon: 'Photoshop',
        color: '#31A8FF'
    },
    {
        name: 'Adobe Illustrator',
        percentage: 88,
        category: 'design',
        icon: 'Illustrator',
        color: '#FF9A00'
    },
    {
        name: 'Canva',
        percentage: 90,
        category: 'design',
        icon: 'Canva',
        color: '#00C4CC'
    },
    {
        name: 'React',
        percentage: 85,
        category: 'development',
        icon: 'React',
        color: '#61DAFB'
    },
    {
        name: 'Node.js',
        percentage: 82,
        category: 'development',
        icon: 'Node',
        color: '#339933'
    },
    {
        name: 'TailwindCSS',
        percentage: 93,
        category: 'development',
        icon: 'Tailwind',
        color: '#06B6D4'
    }
];

const initialProfile = {
    bio: "I'm Elisha Lema, a passionate designer and developer from Tanzania. My journey began in a small digital studio where I discovered the magic of blending aesthetics with functionality. What started as a curious interest in design evolved into a full-fledged career where I now help businesses transform their digital presence.",
    experience: '4+ Years',
    location: 'Tanzania',
    email: 'elishalema12@gmail.com'
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for complete seeding...');

        // Seed Works
        await Work.deleteMany({});
        await Work.insertMany(initialWorks);
        console.log('Works seeded successfully!');

        // Seed Skills
        await Skill.deleteMany({});
        await Skill.insertMany(initialSkills);
        console.log('Skills seeded successfully!');

        // Seed Profile
        await Profile.deleteMany({});
        await Profile.create(initialProfile);
        console.log('Profile seeded successfully!');

        console.log('Database fully seeded with all data!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
