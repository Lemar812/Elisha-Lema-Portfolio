export interface Skill {
    _id?: string;
    id: string;
    name: string;
    percentage: number;
    category: 'design' | 'development';
    icon: string; // lucide icon name OR brand key
    color?: string;
}

export const skills: Skill[] = [
    {
        id: '1',
        name: 'Adobe Photoshop',
        percentage: 92,
        category: 'design',
        icon: 'Photoshop',
        color: '#31A8FF'
    },
    {
        id: '2',
        name: 'Adobe Illustrator',
        percentage: 88,
        category: 'design',
        icon: 'Illustrator',
        color: '#FF9A00'
    },
    {
        id: '3',
        name: 'Canva',
        percentage: 90,
        category: 'design',
        icon: 'Canva',
        color: '#00C4CC'
    },
    {
        id: '4',
        name: 'React',
        percentage: 85,
        category: 'development',
        icon: 'React',
        color: '#61DAFB'
    },
    {
        id: '5',
        name: 'Node.js',
        percentage: 82,
        category: 'development',
        icon: 'Node',
        color: '#339933'
    },
    {
        id: '6',
        name: 'TailwindCSS',
        percentage: 93,
        category: 'development',
        icon: 'Tailwind',
        color: '#06B6D4'
    }
];

export const stats = [
    {
        id: '1',
        value: '2+',
        label: 'Years of Experience'
    },
    {
        id: '2',
        value: '50+',
        label: 'Projects Completed'
    },
    {
        id: '3',
        value: '30+',
        label: 'Happy Clients'
    },
    {
        id: '4',
        value: '98%',
        label: 'Client Satisfaction'
    }
];
