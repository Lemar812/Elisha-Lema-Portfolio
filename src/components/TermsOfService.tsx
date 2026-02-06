import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { sectionReveal, EASE } from '../lib/motion';

export default function TermsOfService() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "1. Terms and Conditions",
            content: "These Terms of Service ('Terms') govern your access to and use of the website and services provided by Elisha Lema. By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree to any part of these Terms, please refrain from using our services."
        },
        {
            title: "2. Service Description",
            content: "Elisha Lema provides design and development services including:\n\n• Brand Identity and Logo Design\n• Graphic Design and Visual Assets\n• Web Development and Web Application Design\n• Consultation Services\n\nServices are tailored to individual client needs and are delivered according to the terms outlined in the project agreement."
        },
        {
            title: "3. Intellectual Property Rights",
            content: "Upon full payment for services, intellectual property rights for the final deliverables transfer to the client. During the project completion phase and until full payment, all work remains the property of Elisha Lema. Clients may not reproduce, modify, or distribute original designs without explicit written permission."
        },
        {
            title: "4. Payment Terms",
            content: "Payment for services is due as outlined in the project agreement. We accept various payment methods and will provide clear invoicing. Late payments may result in project suspension. A 50% deposit is typically required to initiate projects, with the balance due upon completion."
        },
        {
            title: "5. Project Timelines",
            content: "Project timelines are estimates and subject to change based on project scope, client feedback, and revisions. We will communicate any changes in timelines promptly. Delays caused by client feedback, additional requests, or scope changes may extend delivery dates."
        },
        {
            title: "6. Revisions and Feedback",
            content: "We typically include a specified number of revision rounds in our service packages. Additional revisions beyond the agreed number may incur extra charges. Revision requests should be clear and comprehensive to ensure efficient implementation."
        },
        {
            title: "7. Client Responsibilities",
            content: "Clients are responsible for:\n\n• Providing timely and accurate information\n• Offering constructive feedback during the design process\n• Reviewing deliverables promptly\n• Ensuring they have the right to use provided content (images, copy, etc.)\n• Communicating any specific requirements or constraints clearly"
        },
        {
            title: "8. Cancellation Policy",
            content: "If a client cancels a project:\n\n• Cancellations before work begins: 50% refund of deposit\n• Cancellations after work has commenced: No refund; client is billed for work completed\n• Cancellations without valid reason may result in forfeiture of deposit\n\nFor emergency cancellations, please contact us immediately for discussion."
        },
        {
            title: "9. Confidentiality",
            content: "Both parties agree to maintain confidentiality regarding project details, business strategies, and proprietary information disclosed during the engagement. This obligation extends for a period of two years after project completion, except for information already in the public domain or legally required to be disclosed."
        },
        {
            title: "10. Limitation of Liability",
            content: "Elisha Lema shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our services. Our total liability for any claim shall not exceed the amount paid for the specific service in question."
        },
        {
            title: "11. Website Usage",
            content: "You agree not to:\n\n• Engage in illegal or unethical activities\n• Upload viruses or malicious code\n• Attempt to gain unauthorized access to our systems\n• Harass or threaten other users\n• Use our website for spam or commercial purposes without permission\n• Violate any applicable laws or regulations"
        },
        {
            title: "12. Disclaimers",
            content: "Our website and services are provided on an 'as-is' basis. We do not guarantee uninterrupted access or error-free operation. We are not responsible for:\n\n• Third-party services or content\n• Loss of data or information\n• Compatibility issues with specific software versions\n• Performance issues due to client's infrastructure"
        },
        {
            title: "13. Indemnification",
            content: "You agree to indemnify and hold harmless Elisha Lema from any claims, damages, or losses arising from:\n\n• Your violation of these Terms\n• Your use of our services\n• Content you provide to us\n• Your violation of any applicable laws\n• Infringement of third-party rights through your provided materials"
        },
        {
            title: "14. Governing Law",
            content: "These Terms are governed by and construed in accordance with the laws of Tanzania. Any disputes arising from these Terms or our services shall be subject to the jurisdiction of the courts in Tanzania."
        },
        {
            title: "15. Dispute Resolution",
            content: "Before pursuing legal action, we encourage parties to attempt resolving disputes through:\n\n1. Direct communication and negotiation\n2. Mediation with a mutually agreed-upon mediator\n3. Arbitration if mediation fails\n\nOnly after these steps should legal proceedings be initiated."
        },
        {
            title: "16. Termination",
            content: "We reserve the right to terminate or suspend access to our services if you violate these Terms or engage in behavior we deem inappropriate. Termination will not affect obligations incurred before termination."
        },
        {
            title: "17. Modifications to Terms",
            content: "We may update these Terms periodically. Changes will be posted on our website with a new effective date. Continued use of our services after updates constitutes acceptance of the modified Terms. We recommend reviewing these Terms regularly."
        },
        {
            title: "18. Severability",
            content: "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable."
        },
        {
            title: "19. Entire Agreement",
            content: "These Terms, together with any project agreement and privacy policy, constitute the entire agreement between you and Elisha Lema regarding the services provided. They supersede all prior agreements and understandings."
        },
        {
            title: "20. Contact Information",
            content: "For questions about these Terms or our services, please contact us at:\n\nEmail: elishalema12@gmail.com\nPhone: +255 674 175 613 | +255 698 568 982\n\nWe will respond to your inquiry within 30 days of receipt."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-20 pb-16 px-4 md:px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </motion.button>

                {/* Page header */}
                <motion.div
                    variants={sectionReveal}
                    initial="hidden"
                    animate="visible"
                    className="mb-12 md:mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black font-satoshi mb-4 tracking-tight">
                        Terms of <span className="text-primary">Service</span>
                    </h1>
                    <p className="text-text-muted text-lg">Last updated: February 2026</p>
                </motion.div>

                {/* Main content */}
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

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-8 border-t border-white/5 text-center"
                >
                    <p className="text-text-muted">
                        By using our services, you acknowledge that you have read and understood these Terms of Service.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
