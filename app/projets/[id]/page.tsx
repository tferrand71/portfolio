import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FaExternalLinkAlt, FaGithub, FaGooglePlay, FaArrowLeft } from "react-icons/fa";
import ProjectGallery from "@/components/ProjectGallery"; // <-- IMPORT DU NOUVEAU COMPOSANT

// Nécessaire pour l'export statique OVH
export async function generateStaticParams() {
    return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projects.find((p) => p.id === id);

    if (!project) notFound();

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">
                <Link href="/projets" className="inline-flex items-center gap-2 text-gray-500 hover:text-luxury-gold mb-12 transition-colors text-sm uppercase tracking-widest">
                    <FaArrowLeft /> Retour aux projets
                </Link>

                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Contenu principal */}
                    <div className="lg:col-span-2">
                        <h1 className="text-6xl font-serif font-bold mb-4">{project.title}</h1>
                        <p className="text-luxury-gold uppercase tracking-[0.3em] text-xs font-bold mb-12">{project.category}</p>

                        <div className="prose prose-invert max-w-none mb-16">
                            <h2 className="text-2xl font-serif text-white mb-6">À propos du projet</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {project.longDescription}
                            </p>
                        </div>

                        {/* --- NOUVELLE SECTION : GALERIE D'IMAGES VIA LE COMPOSANT --- */}
                        <ProjectGallery images={project.gallery} title={project.title} />
                        {/* --- FIN DE LA SECTION GALERIE --- */}

                    </div>

                    {/* Sidebar d'actions */}
                    <div className="space-y-8">
                        <div className="bg-white/5 p-8 border border-white/10 rounded-2xl h-fit">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Technologies</h3>
                            <div className="flex flex-wrap gap-4 mb-8">
                                {project.tech.map((t, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded border border-white/5">
                                        <span className={t.color}>{t.icon}</span>
                                        <span className="text-xs font-medium">{t.name}</span>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Accès au projet</h3>
                            <div className="flex flex-col gap-4">
                                {project.links.demo && (
                                    <a href={project.links.demo} target="_blank" className="w-full py-4 bg-luxury-gold text-black font-bold text-center text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3">
                                        <FaExternalLinkAlt /> Visiter le site
                                    </a>
                                )}
                                {project.links.download && (
                                    <a href={project.links.download} download className="w-full py-4 border border-luxury-gold text-luxury-gold font-bold text-center text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-3">
                                        <FaGooglePlay /> APK (Android)
                                    </a>
                                )}
                                {project.links.repo && (
                                    <a href={project.links.repo} target="_blank" className="w-full py-4 border border-white/20 text-white font-bold text-center text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                                        <FaGithub /> Code Source
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}