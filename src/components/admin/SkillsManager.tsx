import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, Check, X } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { api } from '../../lib/api-config';

interface Skill {
    _id?: string;
    id?: string;
    name: string;
    percentage: number;
    category: 'design' | 'development';
    icon: string;
    color?: string;
}

export default function SkillsManager() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        percentage: 80,
        category: 'development' as 'design' | 'development',
        icon: '',
        color: '#7C3AED'
    });

    const fetchSkills = async () => {
        try {
            const response = await fetch(api.skills.list());
            const data = await response.json();
            setSkills(data);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const openModal = (skill?: Skill) => {
        if (skill) {
            setEditingSkill(skill);
            setFormData({
                name: skill.name,
                percentage: skill.percentage,
                category: skill.category,
                icon: skill.icon,
                color: skill.color || '#7C3AED'
            });
        } else {
            setEditingSkill(null);
            setFormData({
                name: '',
                percentage: 80,
                category: 'development',
                icon: '',
                color: '#7C3AED'
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveSkill = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('adminToken');
        try {
            const url = editingSkill
                ? api.skills.update(editingSkill._id || editingSkill.id || '')
                : api.skills.create();

            const method = editingSkill ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSaveSuccess(true);
                await fetchSkills();
                setIsModalOpen(false);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSkill = async (id: string) => {
        if (window.confirm('Delete this skill?')) {
            const token = localStorage.getItem('adminToken');
            try {
                await fetch(api.skills.delete(id), {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                await fetchSkills();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
                />
            </div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic uppercase">Skills <span className="text-primary tracking-tighter not-italic">Vault</span></h1>
                    <p className="text-text-muted font-medium">Manage your technical and design skills with proficiency levels.</p>
                </div>

                <motion.button
                    onClick={() => openModal()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-4 rounded-full font-black text-sm uppercase tracking-widest bg-primary shadow-glow-primary text-white"
                >
                    <Plus size={18} />
                    Add Skill
                </motion.button>
            </motion.div>

            {/* Skills Grid */}
            <motion.div
                variants={staggerItem}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <AnimatePresence>
                    {skills.map((skill) => (
                        <motion.div
                            key={skill._id || skill.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">{skill.category}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(skill)}
                                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSkill(skill._id || skill.id || '')}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-muted font-bold">Proficiency</span>
                                    <span className="text-lg font-black text-primary">{skill.percentage}%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.percentage}%` }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#050505] border border-white/10 rounded-3xl p-8 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-white italic uppercase">
                                    {editingSkill ? 'Edit' : 'Add'} <span className="text-primary not-italic">Skill</span>
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-5 mb-6">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-2 block">Skill Name</label>
                                    <input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                                        placeholder="e.g., React.js"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-2 block">Proficiency Level: {formData.percentage}%</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.percentage}
                                        onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-2 block">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as 'design' | 'development' })}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                                    >
                                        <option value="design">Design</option>
                                        <option value="development">Development</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-2 block">Icon Name</label>
                                    <input
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                                        placeholder="e.g., React, Photoshop, Code"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted">Color</label>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-16 h-10 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleSaveSkill}
                                    disabled={isSaving}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${
                                        saveSuccess
                                            ? 'bg-green-500 text-white'
                                            : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                                >
                                    {saveSuccess ? <Check size={16} /> : <Save size={16} />}
                                    {isSaving ? 'Saving...' : 'Save'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
