"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <footer className="relative w-full overflow-hidden pt-32 pb-12 bg-transparent mt-20">
            {/* Top Border with gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-glass-border)] to-transparent" />
            
            {/* Glows d'ambiance en arrière-plan */}
            <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-[var(--color-midnight)]/40 rounded-full blur-[150px] -z-10 pointer-events-none translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-[var(--color-mauve)]/10 rounded-full blur-[150px] -z-10 pointer-events-none translate-y-1/2" />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-7xl mx-auto px-6"
            >
                {/* Section Principale : CTA & Logo */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
                    <motion.div variants={itemVariants} className="text-center md:text-left max-w-xl">
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-[var(--color-text-main)] mb-6 tracking-tight">
                            Tobias<span className="text-[var(--color-gold)]">.</span>
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-lg font-light leading-relaxed mb-8">
                            Développeur Full Stack passionné, créant des expériences web immersives et des architectures modernes. Actuellement en alternance chez Affutis.
                        </p>
                        <Link 
                            href="/contact"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-gold)] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-5px_var(--color-gold)] group"
                        >
                            Travaillons ensemble
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Liens Rapides & Réseaux */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-12 md:gap-24 text-center sm:text-left">
                        
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-text-main)] border-b border-[var(--color-glass-border)] pb-2">Navigation</h3>
                            <div className="flex flex-col gap-4 text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-widest">
                                <Link href="/projets" className="hover:text-[var(--color-gold)] hover:translate-x-1 transition-all">Projets</Link>
                                <Link href="/veille" className="hover:text-[var(--color-gold)] hover:translate-x-1 transition-all">Veille</Link>
                                <Link href="/cours" className="hover:text-[var(--color-gold)] hover:translate-x-1 transition-all">Cours</Link>
                                <Link href="/ressources" className="hover:text-[var(--color-gold)] hover:translate-x-1 transition-all">Ressources</Link>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-text-main)] border-b border-[var(--color-glass-border)] pb-2">Réseaux</h3>
                            <div className="flex flex-col gap-4 text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-widest">
                                <a href="https://github.com/tferrand71" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white hover:translate-x-1 transition-all group">
                                    <FaGithub className="text-lg group-hover:text-white" /> GitHub
                                </a>
                                <a href="https://www.linkedin.com/in/tobias-ferrand-3a337b277" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--color-mauve)] hover:translate-x-1 transition-all group">
                                    <FaLinkedin className="text-lg group-hover:text-[var(--color-mauve)]" /> LinkedIn
                                </a>
                                <a href="mailto:tobias.ferrand@proton.me" className="flex items-center gap-3 hover:text-[var(--color-gold)] hover:translate-x-1 transition-all group">
                                    <FaEnvelope className="text-lg group-hover:text-[var(--color-gold)]" /> Email
                                </a>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* Section Bas de Footer */}
                <motion.div variants={itemVariants} className="pt-8 border-t border-[var(--color-glass-border)] flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest font-bold">
                        © {currentYear} Tobias Ferrand. Tous droits réservés.
                    </p>
                    <div className="flex gap-6 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">
                        <Link href="/mentions-legales" className="hover:text-[var(--color-gold)] transition-colors">Mentions Légales</Link>
                        <Link href="/politique-confidentialite" className="hover:text-[var(--color-gold)] transition-colors">Confidentialité</Link>
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
}