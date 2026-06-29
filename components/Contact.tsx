"use client";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
    const contacts = [
        {
            icon: <FaEnvelope />,
            title: "Email",
            text: "tobias.ferrand@proton.me",
            link: "mailto:tobias.ferrand@proton.me",
            color: "group-hover:text-[var(--color-gold)]",
            border: "hover:border-[var(--color-gold)]/50",
            glow: "group-hover:shadow-[0_0_30px_-5px_var(--color-gold)]",
            bgHover: "group-hover:bg-[var(--color-gold)]/5"
        },
        {
            icon: <FaLinkedin />,
            title: "LinkedIn",
            text: "Tobias Ferrand",
            link: "https://www.linkedin.com/in/tobias-ferrand-3a337b277",
            color: "group-hover:text-[var(--color-mauve)]",
            border: "hover:border-[var(--color-mauve)]/50",
            glow: "group-hover:shadow-[0_0_30px_-5px_var(--color-mauve)]",
            bgHover: "group-hover:bg-[var(--color-mauve)]/5"
        },
        {
            icon: <FaGithub />,
            title: "GitHub",
            text: "@tferrand71",
            link: "https://github.com/tferrand71",
            color: "group-hover:text-[var(--color-pink)]",
            border: "hover:border-[var(--color-pink)]/50",
            glow: "group-hover:shadow-[0_0_30px_-5px_var(--color-pink)]",
            bgHover: "group-hover:bg-[var(--color-pink)]/5"
        }
    ];

    return (
        <section id="contact" className="py-32 w-full relative overflow-hidden bg-transparent border-t border-[var(--color-glass-border)]">
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] bg-[var(--color-gold)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />

            <div className="w-full px-6 lg:px-24 xl:px-32 relative z-10 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-6 tracking-tight">
                        Parlons de <span className="text-gradient-energetic">votre projet.</span>
                    </h2>
                    <p className="text-[var(--color-text-muted)] text-lg font-light max-w-xl mx-auto">
                        Je suis toujours à la recherche de nouvelles opportunités et de défis stimulants.
                        N'hésitez pas à me contacter par email ou via les réseaux sociaux.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {contacts.map((item, index) => (
                        <motion.a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            className={`group glass-panel p-10 rounded-3xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 ${item.border} ${item.glow} ${item.bgHover}`}
                        >
                            <div className={`text-5xl text-[var(--color-text-muted)] mb-6 transition-colors duration-500 ${item.color}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-2">{item.title}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] font-light group-hover:text-white transition-colors duration-300">
                                {item.text}
                            </p>
                        </motion.a>
                    ))}
                </div>

                {/* Localisation */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-24 text-center flex items-center justify-center gap-3"
                >
                    <FaMapMarkerAlt className="text-[var(--color-text-muted)]" />
                    <span className="text-[var(--color-text-muted)] tracking-[0.3em] uppercase text-xs font-semibold">Basé à Roisel, Hauts-de-France</span>
                </motion.div>
            </div>
        </section>
    );
}