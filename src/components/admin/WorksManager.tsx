import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Upload,
    Save
} from 'lucide-react';
import { staggerContainer, staggerItem, modalTransition } from '../../lib/motion';
import { api } from '../../lib/api-config';
import FloatingTooltip from '../FloatingTooltip';

export default function WorksManager() {
    const [works, setWorks] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWork, setEditingWork] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: "Website's Screenshot",
        imageSrc: '',
        description: '',
        tags: '',
        websiteUrl: ''
    });

    const categories = ['All', 'Logo', 'Poster/Banner', "Website's Screenshot"];

    const fetchWorks = async () => {
        try {
            const response = await fetch(api.works.list());
            const data = await response.json();
            setWorks(data);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const filteredWorks = works.filter(work => {
        const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            work.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || work.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const token = localStorage.getItem('adminToken');
            try {
                const response = await fetch(api.works.delete(id), {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    fetchWorks();
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpenModal = (work: any = null) => {
        if (work) {
            setEditingWork(work);
            setFormData({
                title: work.title,
                category: work.category,
                imageSrc: work.imageSrc,
                description: work.description,
                tags: work.tags.join(', '),
                websiteUrl: work.websiteUrl || ''
            });
        } else {
            setEditingWork(null);
            setFormData({
                title: '',
                category: "Website's Screenshot",
                imageSrc: '',
                description: '',
                tags: '',
                websiteUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
        };

        const url = editingWork
            ? api.works.update(editingWork._id)
            : api.works.create();

        const method = editingWork ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchWorks();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
            />
        </div>
    );

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Header Area */}
            <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic uppercase">Works <span className="text-secondary tracking-tighter not-italic">Vault</span></h1>
                    <p className="text-text-muted font-medium">Manage your portfolio projects and brand identities.</p>
                </div>

                <motion.button
                    onClick={() => handleOpenModal()}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-primary px-6 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-glow-primary hover:shadow-glow-md transition-all self-start md:self-auto"
                >
                    <Plus size={18} strokeWidth={3} />
                    New Project
                </motion.button>
            </motion.div>

            {/* Filter Bar */}
            <motion.div variants={staggerItem} className="flex flex-col lg:flex-row gap-6 bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-4 rounded-3xl items-center">
                <div className="relative flex-1 w-full lg:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects, tags, or IDs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-secondary/50 transition-all font-bold"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar pb-2 lg:pb-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                                ${selectedCategory === cat
                                    ? 'bg-secondary text-background border-secondary shadow-glow-sm'
                                    : 'bg-white/5 text-text-muted border-white/5 hover:bg-white/10 hover:text-white'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Works List / Table */}
            <motion.div variants={staggerItem} className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden relative">
                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Project</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Tags</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right text-text-muted">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredWorks.map((work) => (
                                <motion.tr
                                    layout
                                    key={work._id}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-background/60 p-0.5 overflow-hidden group-hover:border-primary/50 transition-all duration-500">
                                                <img src={work.imageSrc} alt={work.title} className="w-full h-full object-cover rounded-[14px] group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white group-hover:text-primary transition-colors">{work.title}</div>
                                                <div className="text-[10px] font-mono text-text-muted">ID: {work._id.slice(-6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`
                                            px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                                            ${work.category === "Website's Screenshot" ? 'border-secondary/20 bg-secondary/5 text-secondary' :
                                                work.category === 'Logo' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-highlight/20 bg-highlight/5 text-highlight'}
                                        `}>
                                            {work.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                            {work.tags.slice(0, 2).map((tag: string) => (
                                                <span key={tag} className="text-[9px] font-bold text-text-muted bg-white/5 px-2 py-0.5 rounded-md">#{tag}</span>
                                            ))}
                                            {work.tags.length > 2 && <span className="text-[9px] font-bold text-text-muted">+{work.tags.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white italic">{work.status || 'Live'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <FloatingTooltip text="Edit Project" color="secondary">
                                                <button
                                                    onClick={() => handleOpenModal(work)}
                                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-secondary hover:border-secondary/30 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </FloatingTooltip>
                                            <FloatingTooltip text="Delete" color="highlight">
                                                <button
                                                    onClick={() => handleDelete(work._id)}
                                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-red-400 hover:border-red-400/30 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </FloatingTooltip>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            variants={modalTransition}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                <h3 className="text-2xl font-black italic uppercase tracking-tight">
                                    {editingWork ? 'Edit' : 'New'} <span className="text-primary not-italic tracking-tighter">Project</span>
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Title</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                            placeholder="NatureWise Tours"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all appearance-none"
                                        >
                                            <option value="Logo">Logo</option>
                                            <option value="Poster/Banner">Poster/Banner</option>
                                            <option value="Website's Screenshot">Website's Screenshot</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Image URL / Path</label>
                                    <div className="relative">
                                        <input
                                            required
                                            value={formData.imageSrc}
                                            onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                            placeholder="/works/Logos/Project.jpg"
                                        />
                                        <Upload className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full h-24 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all resize-none"
                                        placeholder="Briefly describe the project..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Tags (comma separated)</label>
                                        <input
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                            placeholder="React, UI, Branding"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Website URL (optional)</label>
                                        <input
                                            value={formData.websiteUrl}
                                            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow-primary flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        {editingWork ? 'Update Vault' : 'Publish Project'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
