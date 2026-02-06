import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Settings,
    User,
    LogOut,
    Home,
    Search,
    Bell,
    Zap
} from 'lucide-react';
import Overview from './Overview.tsx';
import WorksManager from './WorksManager.tsx';
import AboutManager from './AboutManager.tsx';
import SettingsManager from './SettingsManager.tsx';
import SkillsManager from './SkillsManager.tsx';
import FloatingTooltip from '../FloatingTooltip';

const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { name: 'Works', icon: Briefcase, path: '/admin/works' },
    { name: 'Skills', icon: Zap, path: '/admin/skills' },
    { name: 'About', icon: User, path: '/admin/about' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login', { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-satoshi selection:bg-primary/30 flex overflow-hidden">
            {/* Liquid Background Grain */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/15 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Premium Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-24 md:w-64 h-screen bg-white/[0.02] backdrop-blur-3xl border-r border-white/5 flex flex-col z-50 relative"
            >
                <div className="p-8 flex items-center gap-2 md:gap-3">
                    <motion.div className="group relative flex items-center gap-1 overflow-hidden">
                        <div className="flex relative py-1">
                            {"ELISHA".split("").map((letter, i) => (
                                <div key={i} className="relative flex flex-col h-[28px] md:h-[36px] overflow-hidden">
                                    <motion.span
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{
                                            y: [0, -40, -40, 0],
                                            opacity: [1, 0, 0, 1]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            delay: 2 + (i * 0.1),
                                            times: [0, 0.1, 0.9, 1],
                                            ease: "easeInOut"
                                        }}
                                        className="text-lg md:text-2xl font-black font-satoshi tracking-tighter text-white"
                                    >
                                        {letter}
                                    </motion.span>
                                    <motion.span
                                        initial={{ y: 0, opacity: 0 }}
                                        animate={{
                                            y: [0, -28, -28, 0],
                                            opacity: [0, 1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            delay: 2 + (i * 0.1),
                                            times: [0, 0.1, 0.9, 1],
                                            ease: "easeInOut"
                                        }}
                                        className="absolute top-[28px] md:top-[36px] left-0 text-lg md:text-2xl font-black font-satoshi tracking-tighter text-primary opacity-0"
                                    >
                                        {letter}
                                    </motion.span>
                                </div>
                            ))}
                        </div>
                        <div className="relative flex items-center justify-center w-2 h-2 ml-0.5">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring", stiffness: 300 }}
                                className="w-1 h-1 rounded-full bg-primary z-10"
                            />
                            <motion.span
                                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute w-full h-full rounded-full bg-primary/40 blur-[2px]"
                            />
                        </div>
                    </motion.div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.name} to={item.path}>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={`
                                        group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500
                                        ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-muted hover:bg-white/5 hover:text-white'}
                                    `}
                                >
                                    <item.icon size={22} className={isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                                    <span className="hidden md:block font-bold text-sm tracking-wide">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-text-muted hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-500 group"
                    >
                        <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
                        <span className="hidden md:block font-bold text-sm tracking-wide">Logout</span>
                    </button>

                    <Link to="/">
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-text-muted hover:bg-white/5 hover:text-white transition-all duration-500">
                            <Home size={22} />
                            <span className="hidden md:block font-bold text-sm tracking-wide">Back to Site</span>
                        </button>
                    </Link>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto relative z-10 custom-scrollbar">
                {/* Global Top Bar */}
                <header className="sticky top-0 w-full h-20 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between z-40">
                    <div className="relative w-64 md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Command Palette (Ctrl + K)..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <FloatingTooltip text="Notifications" color="primary">
                            <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all relative">
                                <Bell size={18} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-[#050505]"></span>
                            </button>
                        </FloatingTooltip>

                        <div className="h-10 w-[1px] bg-white/5"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-black uppercase tracking-widest text-white">{localStorage.getItem('adminUser') || 'Admin'}</div>
                                <div className="text-[10px] text-text-muted font-mono">System Admin</div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-primary/30 p-0.5 overflow-hidden">
                                <img src="/works/me.jpeg" className="w-full h-full object-cover rounded-full" alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Overview />} />
                            <Route path="/works" element={<WorksManager />} />
                            <Route path="/skills" element={<SkillsManager />} />
                            <Route path="/about" element={<AboutManager />} />
                            <Route path="/settings" element={<SettingsManager />} />
                        </Routes>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
