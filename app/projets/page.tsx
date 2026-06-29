"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { projects } from "../../data/projects";
import { useRef } from "react";

export default function ProjectsPage() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [150, -200]);

    // Aucun projet mis en avant, on divise tout équitablement !
    const leftCol = projects.filter((_, i) => i % 2 === 0);
    const rightCol = projects.filter((_, i) => i % 2 !== 0);

    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-0 left-1/4 w-[60vw] h-[60vw] bg-[var(--color-gold)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            
            <Navbar />
            <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-left mb-24 max-w-3xl">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-[var(--color-text-main)] mb-6 leading-tight"
                    >
                        Mes <br/><span className="text-gradient-energetic">Réalisations.</span>
                    </motion.h1>
                    <p className="text-[var(--color-text-muted)] font-light text-lg leading-relaxed">
                        Une sélection de mes travaux. De l'idée à la production, explorez comment je résous des problèmes à travers le design et le code.
                    </p>
                </div>

                {/* Grille Asymétrique Parallaxe pour TOUS les projets */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    {/* Colonne Gauche */}
                    <motion.div style={{ y: yLeft }} className="flex-1 flex flex-col gap-8 lg:gap-12">
                        {leftCol.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="group"
                            >
                                <Link href={`/projets/${project.id}`} className="block h-full">
                                    <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-[var(--color-glass-border)] hover:border-[var(--color-gold)]/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_var(--color-gold)] relative overflow-hidden bg-black/20">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--color-gold)]/20 transition-colors duration-500" />
                                        
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[var(--color-gold)] text-[10px] uppercase tracking-[0.2em] font-bold block">{project.category}</span>
                                            {project.icon && (
                                                <div className="text-[var(--color-gold)] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 text-2xl">
                                                    {project.icon}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h3 className="text-3xl font-serif font-bold text-[var(--color-text-main)] mb-4 group-hover:text-[var(--color-gold)] transition-colors duration-300">{project.title}</h3>
                                        <p className="text-[var(--color-text-muted)] text-sm font-light leading-relaxed flex-grow">{project.description}</p>
                                        <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">
                                            <span className="w-8 h-px bg-[var(--color-gold)]/50 group-hover:w-16 group-hover:bg-[var(--color-gold)] transition-all duration-500"></span>
                                            Voir le détail
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Colonne Droite */}
                    <motion.div style={{ y: yRight }} className="flex-1 flex flex-col gap-8 lg:gap-12 md:mt-24">
                        {rightCol.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="group"
                            >
                                <Link href={`/projets/${project.id}`} className="block h-full">
                                    <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-[var(--color-glass-border)] hover:border-[var(--color-gold)]/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_var(--color-gold)] relative overflow-hidden bg-black/20">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--color-gold)]/20 transition-colors duration-500" />
                                        
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[var(--color-gold)] text-[10px] uppercase tracking-[0.2em] font-bold block">{project.category}</span>
                                            {project.icon && (
                                                <div className="text-[var(--color-gold)] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 text-2xl">
                                                    {project.icon}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-3xl font-serif font-bold text-[var(--color-text-main)] mb-4 group-hover:text-[var(--color-gold)] transition-colors duration-300">{project.title}</h3>
                                        <p className="text-[var(--color-text-muted)] text-sm font-light leading-relaxed flex-grow">{project.description}</p>
                                        <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">
                                            <span className="w-8 h-px bg-[var(--color-gold)]/50 group-hover:w-16 group-hover:bg-[var(--color-gold)] transition-all duration-500"></span>
                                            Voir le détail
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </div>
            <Footer />
        </main>
    );
}