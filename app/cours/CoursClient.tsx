"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef } from "react";
import CourseModal from "@/components/CourseModal";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithub } from "react-icons/fa";

interface Repo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    pushed_at: string;
}

export default function CoursClient({ initialRepos, errorMsg }: { initialRepos: Repo[], errorMsg: string | null }) {
    const [selectedRepo, setSelectedRepo] = useState<{ name: string, url: string } | null>(null);

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Retour du parallaxe asymétrique
    const yLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [100, -200]);

    // Split repos into two columns for masonry
    const leftCol = initialRepos.filter((_, i) => i % 2 === 0);
    const rightCol = initialRepos.filter((_, i) => i % 2 !== 0);

    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-1/4 left-0 w-[50vw] h-[50vw] bg-[var(--color-mauve)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            
            <Navbar />
            <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-20">

                {/* Sticky Header Section */}
                <div className="lg:w-1/3 lg:sticky lg:top-48 h-fit z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <FaGithub className="text-5xl text-[var(--color-mauve)] mb-6 opacity-80" />
                        <h1 className="text-5xl md:text-6xl font-serif text-[var(--color-text-main)] font-bold mb-6 leading-tight">
                            L'Atelier du <br/><span className="text-[var(--color-mauve)]">Code.</span>
                        </h1>
                        <p className="text-[var(--color-text-muted)] font-light text-lg leading-relaxed mb-8">
                            Un espace de création. Explorez mes dépôts GitHub, découvrez les statistiques des langages utilisés et plongez dans le code source de mes expérimentations.
                        </p>
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-px bg-[var(--color-mauve)]/50"></div>
                            <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Sélectionnez un projet</span>
                        </div>
                    </motion.div>
                </div>

                {/* Content Section (Masonry Parallax) */}
                <div className="lg:w-2/3">
                    {errorMsg ? (
                        <div className="text-center text-red-400 py-10 glass-panel border-red-500/30 bg-red-500/10 rounded-xl mt-10">
                            🚨 {errorMsg}
                        </div>
                    ) : initialRepos.length > 0 ? (
                        <div className="flex flex-col md:flex-row gap-8">
                            
                            {/* Left Column (Parallax YLeft) */}
                            <motion.div style={{ y: yLeft }} className="flex-1 flex flex-col gap-8 md:mt-16">
                                {leftCol.map((repo, i) => (
                                    <motion.div
                                        key={repo.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.1 }}
                                        transition={{ duration: 0.5, delay: (i % 10) * 0.1 }}
                                        onClick={() => setSelectedRepo({ name: repo.name, url: repo.html_url })}
                                        className="glass-panel p-8 rounded-[2rem] border border-[var(--color-glass-border)] hover:border-[var(--color-mauve)]/50 transition-all duration-300 cursor-pointer group flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_var(--color-mauve)] bg-black/20 backdrop-blur-md"
                                    >
                                        <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-4 group-hover:text-[var(--color-mauve)] transition-colors capitalize">
                                            {repo.name.replace(/-/g, ' ')}
                                        </h3>
                                        <p className="text-[var(--color-text-muted)] text-sm font-light mb-8 flex-grow">
                                            {repo.description || "Aucune description fournie pour ce projet."}
                                        </p>
                                        <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold flex items-center gap-3 mt-auto">
                                            <span className="w-8 h-px bg-[var(--color-mauve)]/30 group-hover:w-16 group-hover:bg-[var(--color-mauve)] transition-all duration-500"></span>
                                            Explorer le code
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Right Column (Parallax YRight) */}
                            <motion.div style={{ y: yRight }} className="flex-1 flex flex-col gap-8 md:-mt-16">
                                {rightCol.map((repo, i) => (
                                    <motion.div
                                        key={repo.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.1 }}
                                        transition={{ duration: 0.5, delay: (i % 10) * 0.1 }}
                                        onClick={() => setSelectedRepo({ name: repo.name, url: repo.html_url })}
                                        className="glass-panel p-8 rounded-[2rem] border border-[var(--color-glass-border)] hover:border-[var(--color-mauve)]/50 transition-all duration-300 cursor-pointer group flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_var(--color-mauve)] bg-black/20 backdrop-blur-md"
                                    >
                                        <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-4 group-hover:text-[var(--color-mauve)] transition-colors capitalize">
                                            {repo.name.replace(/-/g, ' ')}
                                        </h3>
                                        <p className="text-[var(--color-text-muted)] text-sm font-light mb-8 flex-grow">
                                            {repo.description || "Aucune description fournie pour ce projet."}
                                        </p>
                                        <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold flex items-center gap-3 mt-auto">
                                            <span className="w-8 h-px bg-[var(--color-mauve)]/30 group-hover:w-16 group-hover:bg-[var(--color-mauve)] transition-all duration-500"></span>
                                            Explorer le code
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                        </div>
                    ) : (
                        <div className="text-center text-[var(--color-text-muted)] py-20 glass-panel border-[var(--color-glass-border)] rounded-[2rem] mt-10">
                            Aucun dépôt public trouvé.
                        </div>
                    )}
                </div>
            </div>
            
            {/* Modal de sélection (si applicable) */}
            {selectedRepo && (
                <CourseModal 
                    repoUrl={selectedRepo.url}
                    repoName={selectedRepo.name}
                    onClose={() => setSelectedRepo(null)} 
                />
            )}
            
            <Footer />
        </main>
    );
}
