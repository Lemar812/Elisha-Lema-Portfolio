import { motion } from 'framer-motion';
import { Shield, Bell, RotateCcw } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../lib/motion';

export default function SettingsManager() {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic uppercase">System <span className="text-secondary tracking-tighter not-italic">Core</span></h1>
                    <p className="text-text-muted font-medium">Control platform security and external integrations.</p>
                </div>

                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-full font-black text-xs uppercase tracking-widest text-text-muted hover:text-white transition-all"
                    >
                        <RotateCcw size={16} />
                        Reset Defaults
                    </motion.button>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Security Section */}
                <motion.div variants={staggerItem} className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={20} className="text-secondary" />
                        <h3 className="font-black italic uppercase tracking-tight text-xl">Security</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <h4 className="text-sm font-black text-white mb-1">Two-Factor Auth</h4>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Enhanced security using mobile app</p>
                            </div>
                            <div className="w-12 h-6 bg-white/5 border border-white/10 rounded-full relative cursor-pointer group-hover:bg-white/10 transition-colors">
                                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-text-muted"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between group">
                            <div>
                                <h4 className="text-sm font-black text-white mb-1">Session Timeout</h4>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Auto logout after 1 hour</p>
                            </div>
                            <div className="w-12 h-6 bg-secondary/20 border border-secondary/30 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-secondary shadow-glow-sm"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications Section */}
                <motion.div variants={staggerItem} className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Bell size={20} className="text-primary" />
                        <h3 className="font-black italic uppercase tracking-tight text-xl">Notifications</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <h4 className="text-sm font-black text-white mb-1">Email Alerts</h4>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">New contact form submissions</p>
                            </div>
                            <div className="w-12 h-6 bg-primary/20 border border-primary/30 rounded-full relative cursor-pointer text-primary">
                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary shadow-glow-sm"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
