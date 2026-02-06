import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Button from './Button';
import SectionHeading from './SectionHeading';
import { Mail, Copy, Check, Instagram, Linkedin, Github, MessageCircle, Phone } from 'lucide-react';
import UpworkIcon from './icons/UpworkIcon';
import { sectionReveal, staggerContainer, staggerItem } from '../lib/motion';
import FloatingTooltip from './FloatingTooltip';

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formRef.current) return;

        setFormState('submitting');
        setErrorMessage('');

        try {
            const formData = new FormData(formRef.current);
            const senderName = formData.get('user_name') as string;
            const senderEmail = formData.get('user_email') as string;
            const message = formData.get('message') as string;

            // Send email with formatted message to your inbox
            await emailjs.send(
                'service_48brnvp',
                'template_tkhc067',
                {
                    to_email: 'elishalema12@gmail.com',
                    from_name: senderName,
                    from_email: senderEmail,
                    message: message,
                    user_name: senderName,
                    user_email: senderEmail,
                    reply_to: senderEmail
                },
                {
                    publicKey: 'fcxUxVXBlm1_nTJfR',
                }
            );

            setFormState('success');
            formRef.current.reset();
            setTimeout(() => setFormState('idle'), 5000);
        } catch (error: any) {
            console.error('EmailJS Error:', error);
            setFormState('error');
            setErrorMessage(error.text || 'Something went wrong. Please check your internet connection and try again.');
            setTimeout(() => setFormState('idle'), 5000);
        }
    };

    return (
        <section id="contact" className="py-16 md:py-24 px-4 md:px-6 relative">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeading
                        title="Let's Work Together"
                        subtitle="Have a project in mind? Let's build something extraordinary."
                        centered
                    />
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid lg:grid-cols-2 gap-10 md:gap-12 mt-12 md:mt-16 bg-surface/50 backdrop-blur-md p-6 sm:p-8 md:p-14 rounded-card border border-white/5 shadow-premium overflow-hidden relative"
                >
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] -z-10" />

                    {/* Info Side */}
                    <motion.div variants={staggerItem} className="space-y-8 md:space-y-10">
                        <div>
                            <h3 className="text-xl md:text-2xl font-black font-satoshi text-white mb-3 md:mb-4 uppercase tracking-tight">Contact Info</h3>
                            <p className="text-sm md:text-base text-text-muted leading-relaxed">Feel free to reach out directly via email or separate social channels.</p>
                        </div>

                        <div className="p-4 md:p-5 bg-background/40 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/30 hover:bg-background/60 transition-all duration-500 overflow-hidden">
                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                    <Mail size={isMobile ? 18 : 22} />
                                </div>
                                <span className="text-xs md:text-sm font-bold font-mono text-text-primary tracking-tight truncate">elishalema12@gmail.com</span>
                            </div>
                            <button
                                onClick={() => handleCopy('elishalema12@gmail.com', 'email')}
                                className="p-2 md:p-2.5 text-text-muted hover:text-primary transition-colors duration-300 flex-shrink-0"
                                title="Copy Email"
                            >
                                {copied === 'email' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                            </button>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="p-4 md:p-5 bg-background/40 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-secondary/30 hover:bg-background/60 transition-all duration-500 overflow-hidden">
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/10 flex-shrink-0 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                                        <Phone size={isMobile ? 18 : 22} />
                                    </div>
                                    <span className="text-xs md:text-sm font-bold font-mono text-text-primary tracking-tight truncate">+255 674 175 613</span>
                                </div>
                                <button
                                    onClick={() => handleCopy('+255 674 175 613', 'phone1')}
                                    className="p-2 md:p-2.5 text-text-muted hover:text-secondary transition-colors duration-300 flex-shrink-0"
                                    title="Copy Phone"
                                >
                                    {copied === 'phone1' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                </button>
                            </div>

                            <div className="p-4 md:p-5 bg-background/40 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-secondary/30 hover:bg-background/60 transition-all duration-500 overflow-hidden">
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/10 flex-shrink-0 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                                        <Phone size={isMobile ? 18 : 22} />
                                    </div>
                                    <span className="text-xs md:text-sm font-bold font-mono text-text-primary tracking-tight truncate">+255 698 568 982</span>
                                </div>
                                <button
                                    onClick={() => handleCopy('+255 698 568 982', 'phone2')}
                                    className="p-2 md:p-2.5 text-text-muted hover:text-secondary transition-colors duration-300 flex-shrink-0"
                                    title="Copy Phone"
                                >
                                    {copied === 'phone2' ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 md:gap-5 pt-4 md:pt-6 justify-center md:justify-start">
                            {[
                                { icon: Github, href: "https://github.com/Lemar812", color: "hover:text-primary hover:border-primary/50", label: "GitHub", tooltipColor: "primary" as const },
                                { icon: Linkedin, href: "https://www.linkedin.com/in/elisha-lema-46424a223", color: "hover:text-secondary hover:border-secondary/50", label: "LinkedIn", tooltipColor: "secondary" as const },
                                { icon: UpworkIcon, href: "https://www.upwork.com/freelancers/~01f03c531eb6a7e049?mp_source=share", color: "hover:text-highlight hover:border-highlight/50", label: "Upwork", tooltipColor: "highlight" as const },
                                { icon: Instagram, href: "https://www.instagram.com/elisha.steven.lema?igsh=MWhwYTQwNW9pcGgwMA==", color: "hover:text-primary hover:border-primary/50", label: "Instagram", tooltipColor: "primary" as const },
                                { icon: MessageCircle, href: "https://wa.me/message/5VKY4GHMGJ65J1", color: "hover:text-highlight hover:border-highlight/50", label: "WhatsApp", tooltipColor: "highlight" as const }
                            ].map((item, i) => (
                                <FloatingTooltip key={i} text={item.label} color={item.tooltipColor} position="bottom">
                                    <motion.a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.label}
                                        whileHover={{ y: -5, scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-white/5 bg-background/40 flex items-center justify-center text-text-muted transition-all duration-500 hover:shadow-glow-sm ${item.color}`}
                                    >
                                        <item.icon size={20} />
                                    </motion.a>
                                </FloatingTooltip>
                            ))}
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.form variants={staggerItem} ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-7 mt-8 lg:mt-0" noValidate>
                        <div className="space-y-2 group relative">
                            <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Name</label>
                            <FloatingTooltip text="your names please 😊" color="primary" showOnFocus className="block w-full">
                                <input
                                    type="text"
                                    id="name"
                                    name="user_name"
                                    required
                                    onInvalid={(e) => e.preventDefault()}
                                    className="w-full bg-background/40 border border-white/5 rounded-2xl px-5 py-4 text-sm md:text-base text-white focus:outline-none focus:border-primary/50 focus:bg-background/60 focus:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all duration-500 placeholder:text-text-muted/30"
                                    placeholder="Elisha Lema"
                                />
                            </FloatingTooltip>
                        </div>

                        <div className="space-y-2 group relative">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-secondary transition-colors">Email</label>
                            <FloatingTooltip text="how can i reach you? 📧" color="secondary" showOnFocus className="block w-full">
                                <input
                                    type="email"
                                    id="email"
                                    name="user_email"
                                    required
                                    onInvalid={(e) => e.preventDefault()}
                                    className="w-full bg-background/40 border border-white/5 rounded-2xl px-5 py-4 text-sm md:text-base text-white focus:outline-none focus:border-secondary/50 focus:bg-background/60 focus:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-500 placeholder:text-text-muted/30"
                                    placeholder="elishalema12@gmail.com"
                                />
                            </FloatingTooltip>
                        </div>

                        <div className="space-y-2 group relative">
                            <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">Message</label>
                            <FloatingTooltip text="let's hear the magic! ✨" color="primary" showOnFocus className="block w-full">
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    onInvalid={(e) => e.preventDefault()}
                                    rows={4}
                                    className="w-full bg-background/40 border border-white/5 rounded-2xl px-5 py-4 text-sm md:text-base text-white focus:outline-none focus:border-primary/50 focus:bg-background/60 focus:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all duration-500 resize-none placeholder:text-text-muted/30"
                                    placeholder="Tell me about your project..."
                                />
                            </FloatingTooltip>
                        </div>

                        {formState === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 md:p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs md:text-sm font-bold text-center"
                            >
                                Message sent successfully! I'll get back to you soon.
                            </motion.div>
                        )}

                        {formState === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs md:text-sm font-bold text-center"
                            >
                                {errorMessage}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-3.5 md:py-4 text-base md:text-lg font-black uppercase tracking-wider mt-2"
                            isLoading={formState === 'submitting'}
                            disabled={formState === 'success'}
                        >
                            {formState === 'success' ? 'Sent' : 'Send Message'}
                        </Button>
                    </motion.form>

                </motion.div>
            </div>
        </section>
    );
}
