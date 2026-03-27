"use client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFilePdf, FaTable, FaDownload, FaBriefcase } from "react-icons/fa";

// Liste de tes documents téléchargeables
const documents = [
    {
        id: "cv",
        title: "Curriculum Vitae",
        description: "Mon parcours académique, mes expériences professionnelles",
        type: "PDF",
        size: "1.2 MB",
        icon: <FaFilePdf className="text-4xl text-luxury-gold" />,
        link: "/downloads/CV_FERRAND_Tobias.pdf" // Le chemin vers ton fichier dans le dossier public
    },
    {
        id: "competences",
        title: "Tableau de Compétences",
        description: "La matrice complète des compétences acquises durant mon BTS SIO (AP, Stages).",
        type: "EXCEL / PDF",
        size: "850 KB",
        icon: <FaTable className="text-4xl text-luxury-gold" />,
        link: "/downloads/Tableau_Competences_FERRAND_Tobias.pdf"
    },
];

export default function RessourcesPage() {
    // Sécurité pour éviter le bug Safari (Hydration)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="min-h-screen bg-black" />;

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif font-bold mb-6"
                    >
                        En voir <span className="text-luxury-gold">Plus</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Retrouvez ici tous les documents professionnels relatifs à mon parcours, disponibles en téléchargement direct.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {documents.map((doc, index) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-xl flex flex-col hover:border-luxury-gold/50 hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="mb-6 flex justify-between items-start">
                                <div className="p-4 bg-black/50 rounded-lg border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                    {doc.icon}
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{doc.type}</span>
                                    <span className="text-xs text-gray-600">{doc.size}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-luxury-gold transition-colors">
                                {doc.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-8 grow">
                                {doc.description}
                            </p>

                            <a
                                href={doc.link}
                                download
                                className="w-full py-4 border border-luxury-gold text-luxury-gold font-bold text-center text-[10px] uppercase tracking-[0.2em] hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-3 rounded"
                            >
                                <FaDownload className="text-sm" /> Télécharger
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}