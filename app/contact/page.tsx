"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from "react-icons/fa";

export default function ContactPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [100, -200]);
    const yCenter = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-20 left-10 w-[50vw] h-[50vw] bg-[var(--color-gold)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
                className="fixed bottom-0 right-0 w-[60vw] h-[60vw] bg-[var(--color-mauve)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />

            <Navbar />

            <div className="pt-40 pb-32 max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-24 text-center md:text-left max-w-2xl"
                >
                    <p className="text-gradient-energetic uppercase tracking-[0.3em] text-xs font-bold mb-6">Lançons un projet</p>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-[var(--color-text-main)] mb-8 tracking-tight leading-tight">
                        Faisons <br/>Connaissance<span className="text-[var(--color-gold)]">.</span>
                    </h1>
                    <p className="text-[var(--color-text-muted)] text-lg font-light leading-relaxed">
                        Je suis actuellement en alternance à l'EPSI (Arras) chez Affutis. Que vous ayez un projet en tête ou que vous souhaitiez simplement discuter, n'hésitez pas à me contacter directement !
                    </p>
                </motion.div>

                {/* Grille Asymétrique des Contacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 relative">
                    
                    {/* Bloc 1: Email (Grand bloc gauche) */}
                    <motion.div 
                        style={{ y: yLeft }}
                        className="lg:col-span-7 glass-panel p-10 md:p-14 rounded-[3rem] border border-[var(--color-glass-border)] hover:border-[var(--color-gold)]/50 transition-all duration-500 group relative overflow-hidden hover:shadow-[0_20px_60px_-15px_var(--color-gold)]"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--color-gold)]/20 transition-colors duration-500" />
                        
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <FaEnvelope className="text-2xl text-[var(--color-gold)]" />
                        </div>
                        
                        <h3 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-bold mb-2">Email Direct</h3>
                        <a href="mailto:tobias.ferrand@proton.me" className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-text-main)] group-hover:text-white transition-colors relative inline-block">
                            tobias.ferrand@proton.me
                            <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[var(--color-gold)] group-hover:w-full transition-all duration-500" />
                        </a>
                    </motion.div>

                    {/* Bloc 2: LinkedIn (Bloc droit en haut) */}
                    <motion.a 
                        href="https://www.linkedin.com/in/tobias-ferrand-3a337b277"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ y: yRight }}
                        className="lg:col-span-5 glass-panel p-10 rounded-[3rem] border border-[var(--color-glass-border)] hover:border-[#0A66C2]/50 transition-all duration-500 group relative overflow-hidden hover:shadow-[0_20px_60px_-15px_#0A66C2] flex flex-col justify-center items-center text-center bg-gradient-to-br from-transparent to-[#0A66C2]/5"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-[#0A66C2] transition-colors duration-500 shadow-xl">
                            <FaLinkedin className="text-3xl text-[#0A66C2] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">LinkedIn</h3>
                        <p className="text-[var(--color-text-muted)] text-sm font-light">Retrouvez mon parcours pro</p>
                    </motion.a>

                    {/* Bloc 3: GitHub (Bloc gauche en bas) */}
                    <motion.a 
                        href="https://github.com/tferrand71"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ y: yCenter }}
                        className="lg:col-span-5 lg:col-start-2 glass-panel p-10 rounded-[3rem] border border-[var(--color-glass-border)] hover:border-white/50 transition-all duration-500 group relative overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.2)] flex flex-col justify-center items-center text-center bg-gradient-to-bl from-transparent to-white/5 mt-0 lg:mt-12"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white transition-colors duration-500 shadow-xl">
                            <FaGithub className="text-3xl text-white group-hover:text-black transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">GitHub</h3>
                        <p className="text-[var(--color-text-muted)] text-sm font-light">Découvrez mon code source</p>
                    </motion.a>

                    {/* Bloc 4: Localisation (Bloc droit en bas) */}
                    <motion.div 
                        style={{ y: yRight }}
                        className="lg:col-span-6 glass-panel p-10 md:p-14 rounded-[3rem] border border-[var(--color-glass-border)] hover:border-[var(--color-pink)]/50 transition-all duration-500 group relative overflow-hidden hover:shadow-[0_20px_60px_-15px_var(--color-pink)] mt-0 lg:-mt-12"
                    >
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-pink)]/10 blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-[var(--color-pink)]/20 transition-colors duration-500" />
                        
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <FaMapMarkerAlt className="text-2xl text-[var(--color-pink)]" />
                        </div>
                        
                        <h3 className="text-sm uppercase tracking-widest text-[var(--color-text-muted)] font-bold mb-4">Localisation</h3>
                        <p className="text-2xl font-serif text-[var(--color-text-main)] leading-relaxed">
                            Basé dans la région d'Arras.<br/>
                            <span className="text-[var(--color-text-muted)] text-lg">En alternance chez Affutis (EPSI).</span>
                        </p>
                    </motion.div>
                </div>
            </div>
            
            <Footer />
        </main>
    );
}
