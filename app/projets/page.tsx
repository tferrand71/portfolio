"use client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { projects } from "../../data/projects";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
    const [mounted, setMounted] = useState(false);

    // Ce code ne s'exécute qu'une fois côté client (navigateur)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-black" />;
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                        Mes <span className="text-luxury-gold">Réalisations</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <motion.article
                            key={project.id} // Utilise bien l'ID unique ici
                            initial={{ opacity: 1 }} // On force l'opacité à 1 par défaut pour éviter qu'il soit invisible
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all flex flex-col"
                        >
                            <div className="h-48 bg-gray-900 flex items-center justify-center relative">
                                {project.icon ? project.icon : <span className="text-6xl opacity-10">{project.title.charAt(0)}</span>}
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <span className="text-luxury-gold text-xs uppercase tracking-widest font-bold mb-2">{project.category}</span>
                                <h3 className="text-2xl font-serif font-bold mb-4">{project.title}</h3>
                                <p className="text-gray-400 text-sm mb-8 flex-grow">{project.description}</p>

                                <Link
                                    href={`/projets/${project.id}`}
                                    className="block w-full py-3 bg-white/5 border border-white/10 text-center text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all"
                                >
                                    Découvrir le projet
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </main>
    );
}