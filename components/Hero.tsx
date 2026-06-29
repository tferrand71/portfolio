"use client";
import { motion } from "framer-motion";
import { FiDownload, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import LogoVisualizer from "./LogoVisualizer";

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
            {/* Ambient Background Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] bg-[var(--color-mauve)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 100, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-[var(--color-pink)]/10 rounded-full blur-[100px] -z-10 pointer-events-none"
            />

            <div className="max-w-6xl w-full mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10 pt-20">

                {/* Texte */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-[var(--color-gold)] tracking-[0.3em] text-xs font-bold uppercase mb-6"
                    >
                        Développeur Fullstack
                    </motion.p>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-[var(--color-text-main)] mb-6 leading-[1.1] tracking-tight">
                        Tobias <br />
                        <span className="text-gradient-energetic">
                            Ferrand.
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-[var(--color-text-muted)] text-lg mb-10 max-w-md font-light leading-relaxed"
                    >
                        Je conçois des expériences numériques robustes, esthétiques et fluides. Étudiant passionné avec une forte appétence pour l'innovation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4 mb-10"
                    >
                        <a href="/downloads/CV_FERRAND_Tobias.pdf" download className="px-8 py-4 bg-[var(--color-gold)] text-black font-bold text-sm tracking-wider uppercase rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_-5px_var(--color-gold)] flex items-center gap-3">
                            <FiDownload className="text-lg" /> CV
                        </a>

                        <a href="#contact" className="px-8 py-4 border border-[var(--color-glass-border)] text-[var(--color-text-main)] text-sm tracking-wider font-bold uppercase rounded-full bg-[var(--color-glass)] backdrop-blur-md hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] transition-all duration-300 flex items-center gap-3">
                            <FiMail className="text-lg" /> Contact
                        </a>
                    </motion.div>

                    {/* Socials */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex gap-6"
                    >
                        <a href="https://github.com/tferrand71" target="_blank" className="w-12 h-12 rounded-full border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors text-xl bg-[var(--color-glass)] backdrop-blur-sm">
                            <FaGithub />
                        </a>
                        <a href="https://www.linkedin.com/in/tobias-ferrand-3a337b277" target="_blank" className="w-12 h-12 rounded-full border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-mauve)] hover:border-[var(--color-mauve)] transition-colors text-xl bg-[var(--color-glass)] backdrop-blur-sm">
                            <FaLinkedin />
                        </a>
                    </motion.div>
                </motion.div>

                {/* Cercle photo avec l'image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, type: "spring", stiffness: 100, delay: 0.2 }}
                    className="flex justify-center md:justify-end"
                >
                    <LogoVisualizer />
                </motion.div>
            </div>
        </section>
    );
}