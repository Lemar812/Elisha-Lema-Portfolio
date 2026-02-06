import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Save, Check } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { api } from '../../lib/api-config';

export default function AboutManager() {
    const [formData, setFormData] = useState({
        bio: '',
        experience: '',
        location: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetch(api.profile.get())
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setFormData({
                        bio: data.bio || '',
                        experience: data.experience || '',
                        location: data.location || '',
                        email: data.email || ''
                    });
                }
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(api.profile.update(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
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
            <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic uppercase">Profile <span className="text-highlight tracking-tighter not-italic">Engine</span></h1>
                    <p className="text-text-muted font-medium">Configure your personal brand and biography.</p>
                </div>

                <motion.button
                    onClick={handleSave}
                    disabled={isSaving}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                        flex items-center gap-2 px-6 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all
                        ${saveSuccess ? 'bg-green-500 shadow-glow-green text-white' : 'bg-highlight shadow-glow-highlight text-white'}
                        ${isSaving ? 'opacity-50' : ''}
                    `}
                >
                    {saveSuccess ? <Check size={18} /> : <Save size={18} />}
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                </motion.button>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Biography Section */}
                <motion.div variants={staggerItem} className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText size={20} className="text-highlight" />
                        <h3 className="font-black italic uppercase tracking-tight text-xl">Biography</h3>
                    </div>

                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full h-48 bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-highlight/50 transition-all font-medium leading-relaxed"
                        placeholder="Tell your story..."
                    />
                </motion.div>

                {/* Profile Stats Mini Section */}
                <motion.div variants={staggerItem} className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <User size={20} className="text-primary" />
                        <h3 className="font-black italic uppercase tracking-tight text-xl">Quick <span className="text-primary not-italic">Meta</span></h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-4">Years of experience</label>
                            <input
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-primary/50"
                                placeholder="4+ Years"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-4">Location</label>
                            <input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-primary/50"
                                placeholder="Tanzania"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-4">Public Email</label>
                            <input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-primary/50"
                                placeholder="example@email.com"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
