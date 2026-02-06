import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Eye,
    MessageSquare,
    TrendingUp,
    ArrowUpRight,
    Star,
    Calendar,
    Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { api } from '../../lib/api-config';

const iconMap: Record<string, LucideIcon> = {
    'Eye': Eye,
    'MessageSquare': MessageSquare,
    'TrendingUp': TrendingUp,
    'Zap': Zap
};

export default function Overview() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);
    const [topWorks, setTopWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(api.stats())
            .then(res => res.json())
            .then(data => {
                setMetrics(data.metrics);
                setInsights(data.recentInsights);
                setTopWorks(data.topWorks || []);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return (
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
            {/* Header Section */}
            <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic uppercase">System <span className="text-primary tracking-tighter not-italic">Overview</span></h1>
                    <p className="text-text-muted font-medium">Welcome back, Elisha. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3">
                        <Calendar size={16} className="text-primary" />
                        <span className="text-sm font-bold text-text-primary">Feb 05, 2026</span>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => {
                    const Icon = iconMap[metric.label.split(' ').pop() || 'Zap'] || (metric.label.includes('Visits') ? Eye : metric.label.includes('Form') ? MessageSquare : metric.label.includes('Engagement') ? TrendingUp : Zap);
                    return (
                        <motion.div
                            key={i}
                            variants={staggerItem}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-6 rounded-[2rem] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                            <div className="flex items-start justify-between mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.02] shadow-inner`}>
                                    <Icon size={22} className={metric.color === 'primary' ? 'text-primary' : metric.color === 'secondary' ? 'text-secondary' : 'text-highlight'} />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black italic bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                                    {metric.change}
                                    <ArrowUpRight size={10} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-3xl font-black text-white">{metric.value}</h3>
                                <p className="text-sm font-bold text-text-muted uppercase tracking-widest text-[10px]">{metric.label}</p>
                            </div>

                            {/* Animated background line */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                                className="absolute bottom-0 left-0 h-[2px] w-40 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Section - More Bento Blocks */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <motion.div
                    variants={staggerItem}
                    className="lg:col-span-2 bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem] relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black italic uppercase tracking-tight text-xl">Recent <span className="text-primary not-italic tracking-tighter">Insights</span></h3>
                        <button className="text-[10px] font-black uppercase text-text-muted hover:text-white transition-colors border-b border-white/10 pb-1">View Full Log</button>
                    </div>

                    <div className="space-y-6">
                        {insights.map((item, i) => (
                            <div key={i} className="flex items-center gap-6 group">
                                <div className="text-xs font-mono text-text-muted">{item.time}</div>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all shadow-glow-primary"></div>
                                <div className="flex-1 text-sm font-bold text-text-muted group-hover:text-white transition-colors">
                                    {item.content}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest">{item.type}</div>
                            </div>
                        ))}
                    </div>

                    {/* Faded background grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                </motion.div>

                {/* Popular Works Mini list */}
                <motion.div
                    variants={staggerItem}
                    className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2rem]"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Star size={20} className="text-highlight fill-highlight/20" />
                        <h3 className="font-black italic uppercase tracking-tight text-xl">Top <span className="text-highlight not-italic tracking-tighter">Works</span></h3>
                    </div>

                    <div className="space-y-5">
                        {topWorks.map((work, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black italic">{i + 1}</div>
                                    <span className="text-sm font-bold text-text-muted group-hover:text-white transition-colors">{work.name}</span>
                                </div>
                                <span className={`text-xs font-mono font-bold ${work.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>{work.views}</span>
                            </div>
                        ))}
                        {topWorks.length === 0 && (
                            <div className="text-center py-10 opacity-30 italic text-xs font-bold">No data collected yet</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
