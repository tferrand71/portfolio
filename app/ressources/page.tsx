"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaFilePdf, FaTable, FaDownload } from "react-icons/fa";

const documents = [
    {
        id: "cv",
        title: "Curriculum Vitae",
        description: "Mon parcours académique, mes expériences professionnelles.",
        type: "PDF",
        size: "1.2 MB",
        icon: <FaFilePdf className="text-3xl text-[var(--color-gold)]" />,
        link: "/downloads/CV_FERRAND_Tobias.pdf",
        color: "var(--color-gold)",
        delay: 0.2
    },
    {
        id: "competences",
        title: "Tableau de Compétences",
        description: "La matrice complète des compétences acquises durant mon BTS SIO.",
        type: "EXCEL / PDF",
        size: "850 KB",
        icon: <FaTable className="text-3xl text-[var(--color-mauve)]" />,
        link: "/downloads/Tableau_Competences_FERRAND_Tobias.pdf",
        color: "var(--color-mauve)",
        delay: 0.4
    },
];

export default function RessourcesPage() {
    const containerRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [50, -150]);

    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed bottom-0 left-0 w-[50vw] h-[50vw] bg-[var(--color-gold)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="fixed top-1/4 right-0 w-[40vw] h-[40vw] bg-[var(--color-mauve)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />

            <Navbar />

            <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 relative z-10 min-h-screen flex items-center">
                <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-20">
                    
                    {/* Left Side: Asymmetrical Title Panel */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:w-5/12 relative z-20"
                    >
                        <div className="glass-panel p-10 md:p-14 rounded-[2.5rem] border-l-2 border-t-2 border-white/10 shadow-2xl relative overflow-hidden">
                            {/* Inner accent glow */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[var(--color-gold)]/20 blur-[80px] rounded-full pointer-events-none" />
                            
                            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-[var(--color-text-main)] relative z-10 leading-tight">
                                Mon <br/>
                                <span className="text-gradient-energetic">Dossier Pro.</span>
                            </h1>
                            <p className="text-[var(--color-text-muted)] font-light text-lg leading-relaxed relative z-10">
                                Retrouvez ici tous les documents professionnels relatifs à mon parcours, disponibles en téléchargement direct. Une trace écrite de mes compétences et de mes expériences.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Side: Floating Asymmetrical Cards */}
                    <div className="lg:w-7/12 relative w-full h-[600px] flex items-center justify-center">
                        <div className="relative w-full max-w-2xl h-full">
                            
                            {/* Document 1: CV */}
                            <motion.div
                                style={{ y: y1 }}
                                className="absolute top-10 right-4 lg:right-12 w-[85%] md:w-[70%] z-20 group"
                            >
                                <div className="glass-panel p-8 rounded-[2rem] border border-[var(--color-glass-border)] hover:border-[var(--color-gold)]/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_var(--color-gold)]">
                                    <div className="flex gap-6 items-start">
                                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                            {documents[0].icon}
                                        </div>
                                        <div className="grow">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)] font-bold">{documents[0].type}</span>
                                                <span className="text-xs text-[var(--color-text-muted)] opacity-50 font-mono">{documents[0].size}</span>
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-3">{documents[0].title}</h3>
                                            <p className="text-[var(--color-text-muted)] font-light text-sm mb-6">{documents[0].description}</p>
                                            <a
                                                href={documents[0].link}
                                                download
                                                className="inline-flex items-center gap-3 py-3 px-6 bg-white/5 hover:bg-[var(--color-gold)] text-[var(--color-text-main)] hover:text-black rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 border border-white/10 hover:border-[var(--color-gold)]"
                                            >
                                                <FaDownload /> Télécharger
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Document 2: Compétences */}
                            <motion.div
                                style={{ y: y2 }}
                                className="absolute bottom-10 left-4 lg:left-0 w-[85%] md:w-[70%] z-30 group"
                            >
                                <div className="glass-panel p-8 rounded-[2rem] border border-[var(--color-glass-border)] hover:border-[var(--color-mauve)]/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_var(--color-mauve)] backdrop-blur-2xl">
                                    <div className="flex gap-6 items-start">
                                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                            {documents[1].icon}
                                        </div>
                                        <div className="grow">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-mauve)] font-bold">{documents[1].type}</span>
                                                <span className="text-xs text-[var(--color-text-muted)] opacity-50 font-mono">{documents[1].size}</span>
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-3">{documents[1].title}</h3>
                                            <p className="text-[var(--color-text-muted)] font-light text-sm mb-6">{documents[1].description}</p>
                                            <a
                                                href={documents[1].link}
                                                download
                                                className="inline-flex items-center gap-3 py-3 px-6 bg-white/5 hover:bg-[var(--color-mauve)] text-[var(--color-text-main)] hover:text-black rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 border border-white/10 hover:border-[var(--color-mauve)]"
                                            >
                                                <FaDownload /> Obtenir
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}