"use client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaGooglePlay, FaGithub, FaExternalLinkAlt, FaCoffee, FaFilePdf } from "react-icons/fa";
import { SiFlutter, SiDart } from "react-icons/si";

// Ta liste de projets complète
const projects = [
    {
        title: "CV Creator",
        category: "Application Web",
        description: "Un outil interactif développé en React permettant de générer et personnaliser son CV en temps réel avec prévisualisation PDF.",
        tech: [
            { name: "React", icon: <FaReact />, color: "text-blue-400" },
            { name: "JS", icon: <FaJs />, color: "text-yellow-400" },
        ],
        links: {
            demo: "#", // Mets le lien si tu l'as hébergé
            repo: "https://github.com/ton-profil/cv-creator"
        },
        featured: true
    },
    {
        title: "L'Excentric' Café",
        category: "Site Vitrine",
        description: "Site web professionnel réalisé pour un établissement local. Présentation de la carte, des événements et système de contact.",
        tech: [
            { name: "HTML5", icon: <FaHtml5 />, color: "text-orange-500" },
            { name: "CSS3", icon: <FaCss3Alt />, color: "text-blue-500" },
            { name: "JS", icon: <FaJs />, color: "text-yellow-400" },
        ],
        links: {
            demo: "https://excentric-cafe.com", // Mets le vrai lien ici
        },
        icon: <FaCoffee className="text-5xl text-luxury-gold" />
    },
    {
        title: "Super Clicker",
        category: "Jeu Web & Mobile",
        description: "Jeu incrémental addictif. Version Web optimisée React et portage mobile natif via Flutter avec gestion de sauvegarde.",
        tech: [
            { name: "React", icon: <FaReact />, color: "text-blue-400" },
            { name: "Flutter", icon: <SiFlutter />, color: "text-cyan-400" },
        ],
        links: {
            demo: "https://tferrand71.github.io/IDEAStorm/",
            download: "/downloads/clicker.apk"
        }
    },
    {
        title: "Harmonie d'Épehy",
        category: "Site Associatif",
        description: "Développement complet du site pour l'orchestre d'harmonie d'Épehy. Gestion de contenu, agenda et présentation des musiciens.",
        tech: [
            { name: "HTML5", icon: <FaHtml5 />, color: "text-orange-500" },
            { name: "CSS3", icon: <FaCss3Alt />, color: "text-blue-500" },
        ],
        links: {
            demo: "https://harmonie-epehy.fr"
        }
    },
    {
        title: "Maki",
        category: "Application Mobile",
        description: "Projet personnel de mangathèque. Permet de scanner, classer et suivre sa collection de mangas. En cours de développement.",
        tech: [
            { name: "Flutter", icon: <SiFlutter />, color: "text-cyan-400" },
            { name: "Dart", icon: <SiDart />, color: "text-blue-300" },
        ],
        links: {
            repo: "https://github.com/ton-profil/maki"
        },
        status: "En cours"
    }
];

export default function ProjectsPage() {
    return (
        <main className="min-h-screen bg-rich-black text-white selection:bg-luxury-gold selection:text-black">
            <Navbar />

            <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                {/* En-tête */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif font-bold text-white mb-6"
                    >
                        Mes <span className="text-luxury-gold">Réalisations</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Une collection de projets web et mobiles alliant technique et design, du développement React aux applications Flutter natives.
                    </p>
                </div>

                {/* Grille des projets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-card-dark rounded-xl overflow-hidden border border-gray-800 hover:border-luxury-gold/50 hover:shadow-glow transition-all duration-300 flex flex-col"
                        >
                            {/* Visuel (Placeholder ou Icône si pas d'image) */}
                            <div className="h-48 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-luxury-gold/5 group-hover:bg-luxury-gold/10 transition-colors" />

                                {/* Icône centrale si pas d'image */}
                                {project.icon ? project.icon : (
                                    <span className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity text-white">
                     {project.title.charAt(0)}
                   </span>
                                )}

                                {/* Badge "En cours" si nécessaire */}
                                {project.status && (
                                    <span className="absolute top-4 right-4 px-3 py-1 bg-purple-900/80 text-purple-300 text-xs font-bold rounded-full border border-purple-700 backdrop-blur-sm">
                    {project.status}
                  </span>
                                )}
                            </div>

                            {/* Contenu */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="mb-4">
                  <span className="text-luxury-gold text-xs uppercase tracking-widest font-bold mb-2 block">
                    {project.category}
                  </span>
                                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-luxury-gold transition-colors">
                                        {project.title}
                                    </h3>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                    {project.description}
                                </p>

                                {/* Stack Technique */}
                                <div className="flex gap-3 mb-8 border-t border-gray-800 pt-4">
                                    {project.tech.map((t, i) => (
                                        <div key={i} className="flex items-center gap-1 text-gray-500 text-xs" title={t.name}>
                                            <span className={`text-lg ${t.color}`}>{t.icon}</span>
                                            <span className="hidden group-hover:inline transition-all">{t.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex gap-3 mt-auto">
                                    {project.links.demo && (
                                        <a href={project.links.demo} target="_blank" className="flex-1 py-2 bg-gray-800 hover:bg-luxury-gold hover:text-black text-center rounded text-sm font-bold transition-all flex items-center justify-center gap-2">
                                            <FaExternalLinkAlt /> Visiter
                                        </a>
                                    )}
                                    {project.links.download && (
                                        <a href={project.links.download} download className="flex-1 py-2 border border-gray-600 hover:border-luxury-gold hover:text-luxury-gold text-center rounded text-sm font-bold transition-all flex items-center justify-center gap-2">
                                            <FaGooglePlay /> APK
                                        </a>
                                    )}
                                    {project.links.repo && (
                                        <a href={project.links.repo} target="_blank" className="flex-1 py-2 border border-gray-600 hover:bg-white hover:text-black hover:border-white text-center rounded text-sm font-bold transition-all flex items-center justify-center gap-2">
                                            <FaGithub /> Code
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Footer simple de page */}
                <div className="mt-20 text-center border-t border-gray-800 pt-8">
                    <p className="text-gray-500 text-sm">
                        Vous souhaitez en savoir plus sur un projet ? <a href="/#contact" className="text-luxury-gold hover:underline">Contactez-moi</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}