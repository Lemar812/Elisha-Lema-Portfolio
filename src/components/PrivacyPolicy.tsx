import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { sectionReveal, EASE } from '../lib/motion';

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "1. Introduction",
            content: "This Privacy Policy explains how Elisha Lema ('we', 'us', 'our', or 'the Company') collects, uses, protects, and discloses information when you visit and use our website (the 'Service'). We are committed to protecting your privacy and ensuring you have a positive experience on our platform."
        },
        {
            title: "2. Information We Collect",
            content: "We collect information you provide directly to us when you:\n\n• Submit a contact form or inquiry\n• Subscribe to our newsletter or mailing list\n• Request a consultation or service\n• Provide feedback or testimonials\n\nInformation collected may include your name, email address, phone number, company name, project details, and any other information you choose to provide."
        },
        {
            title: "3. How We Use Your Information",
            content: "We use the collected information to:\n\n• Respond to your inquiries and provide requested services\n• Send you updates about our services and special offers\n• Improve our website and service offerings\n• Comply with legal obligations\n• Prevent fraudulent activities and ensure security\n• Communicate project updates and deadlines\n• Deliver a personalized user experience"
        },
        {
            title: "4. Information Sharing",
            content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with:\n\n• Service providers who assist in our operations\n• Legal authorities when required by law\n• Professional partners necessary to complete your project\n\nAll third parties are bound by confidentiality agreements and data protection obligations."
        },
        {
            title: "5. Data Security",
            content: "We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, and destruction. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and protect your account information."
        },
        {
            title: "6. Cookies and Tracking",
            content: "Our website may use cookies and similar tracking technologies to enhance your user experience, analyze site usage, and remember your preferences. You can control cookie settings through your browser. Disabling cookies may affect certain website functionality."
        },
        {
            title: "7. Third-Party Links",
            content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of external sites. We encourage you to review the privacy policies of any linked websites before providing your information."
        },
        {
            title: "8. Your Rights",
            content: "You have the right to:\n\n• Access the personal information we hold about you\n• Request correction of inaccurate information\n• Request deletion of your information (subject to legal requirements)\n• Opt-out of marketing communications\n• Request a copy of your data in a portable format\n\nTo exercise these rights, please contact us using the information provided below."
        },
        {
            title: "9. Children's Privacy",
            content: "Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 13, we will take steps to delete such information immediately."
        },
        {
            title: "10. Policy Updates",
            content: "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website with a new effective date. Your continued use of our services constitutes acceptance of the updated policy."
        },
        {
            title: "11. Contact Information",
            content: "If you have questions about this Privacy Policy or our privacy practices, please contact us at:\n\nEmail: elishalema12@gmail.com\nPhone: +255 674 175 613 | +255 698 568 982\n\nWe will respond to your inquiry within 30 days of receipt."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-20 pb-16 px-4 md:px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </motion.button>

                {/* Header */}
                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    animate="visible"
                    className="mb-12 md:mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black font-satoshi mb-4 tracking-tight">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-text-muted text-lg">Last updated: February 2026</p>
                </motion.div>

                {/* Content */}
                <div className="space-y-8 md:space-y-12">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-surface/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-colors duration-500"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold font-satoshi mb-4 text-white">
                                {section.title}
                            </h2>
                            <p className="text-text-muted leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-8 border-t border-white/5 text-center"
                >
                    <p className="text-text-muted">
                        For any privacy-related questions or concerns, please don't hesitate to contact us.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
