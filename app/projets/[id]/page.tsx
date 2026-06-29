import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaExternalLinkAlt, FaGithub, FaGooglePlay, FaArrowLeft } from "react-icons/fa";
import ProjectGallery from "@/components/ProjectGallery"; // <-- IMPORT DU NOUVEAU COMPOSANT
import * as motion from "framer-motion/client";

// Nécessaire pour l'export statique OVH
export async function generateStaticParams() {
    return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projects.find((p) => p.id === id);

    if (!project) notFound();

    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden">
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-1/3 right-1/4 w-[50vw] h-[50vw] bg-[var(--color-pink)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            
            <Navbar />

            <div className="pt-40 pb-20 max-w-5xl mx-auto px-6 relative z-10">
                <Link href="/projets" className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] mb-12 transition-colors text-xs uppercase tracking-[0.2em] font-medium">
                    <FaArrowLeft /> Retour aux projets
                </Link>

                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Contenu principal */}
                    <div className="lg:col-span-2">
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-serif font-bold mb-4 text-[var(--color-text-main)]"
                        >
                            {project.title}
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-gradient-energetic uppercase tracking-[0.3em] text-xs font-bold mb-12"
                        >
                            {project.category}
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel p-8 md:p-10 rounded-3xl mb-16"
                        >
                            <h2 className="text-2xl font-serif text-[var(--color-text-main)] mb-6 font-bold">À propos du projet</h2>
                            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed font-light">
                                {project.longDescription}
                            </p>
                        </motion.div>

                        {/* --- NOUVELLE SECTION : GALERIE D'IMAGES VIA LE COMPOSANT --- */}
                        <ProjectGallery images={project.gallery} title={project.title} />
                        {/* --- FIN DE LA SECTION GALERIE --- */}

                    </div>

                    {/* Sidebar d'actions */}
                    <div className="space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-panel p-8 rounded-2xl h-fit border border-[var(--color-glass-border)]"
                        >
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-[var(--color-glass-border)] pb-4 text-[var(--color-gold)]">Technologies</h3>
                            <div className="flex flex-wrap gap-3 mb-8">
                                {project.tech.map((t, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-[var(--color-glass-border)] shadow-inner">
                                        <span className={t.color}>{t.icon}</span>
                                        <span className="text-xs font-medium text-[var(--color-text-main)]">{t.name}</span>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-[var(--color-glass-border)] pb-4 text-[var(--color-gold)]">Accès au projet</h3>
                            <div className="flex flex-col gap-4">
                                {project.links.demo && (
                                    <a href={project.links.demo} target="_blank" className="w-full py-4 bg-[var(--color-gold)] text-black font-bold text-center text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 rounded-xl shadow-[0_0_20px_-5px_var(--color-gold)]">
                                        <FaExternalLinkAlt /> Visiter le site
                                    </a>
                                )}
                                {project.links.download && (
                                    <a href={project.links.download} download className="w-full py-4 border border-[var(--color-gold)] text-[var(--color-gold)] font-bold text-center text-xs uppercase tracking-widest hover:bg-[var(--color-gold)] hover:text-black transition-all flex items-center justify-center gap-3 rounded-xl">
                                        <FaGooglePlay /> APK (Android)
                                    </a>
                                )}
                                {project.links.repo && (
                                    <a href={project.links.repo} target="_blank" className="w-full py-4 border border-[var(--color-glass-border)] text-[var(--color-text-main)] font-bold text-center text-xs uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-3 rounded-xl">
                                        <FaGithub /> Code Source
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}