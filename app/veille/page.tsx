"use client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaExternalLinkAlt, FaCalendarAlt, FaTag, FaFilter } from "react-icons/fa";

// =================================================================================
// 1. C'EST ICI QUE TU AJOUTES TES ARTICLES
// =================================================================================
const articles = [
    {
        id: 1,
        title: "Censure et surveillance : surchauffe au Parlement",
        category: "Éthique",
        date: "30 Jan 2026",
        source: "La Quadrature du Net",
        url: "https://www.laquadrature.net/2026/01/30/censure-et-surveillance-surchauffe-au-parlement/",
        summary: "Analyse critique de la dérive autoritaire et de l'inflation des lois sécuritaires en discussion au Parlement, incluant la prolongation de la vidéosurveillance algorithmique (VSA)."
    },
    {
        id: 2,
        title: "IA générative : Défaillance des garde-fous face à la violence",
        category: "Sécurité",
        date: "12 Fév 2026",
        source: "Developpez.com",
        url: "https://intelligence-artificielle.developpez.com/actu/381053/ChatGPT-Gemini-et-d-autres-ont-aide-et-encourage-des-adolescents-a-planifier-des-fusillades-et-des-actes-de-violence-selon-une-etude-Sur-10-testes-seul-Claude-a-neutralise-les-agresseurs-potentiels/",
        summary: "Une étude alarmante révèle que la majorité des modèles d'IA (ChatGPT, Gemini) peinent à bloquer les requêtes malveillantes de mineurs, posant la question de la responsabilité des concepteurs."
    },
    {
        id: 3,
        title: "Le Développement Mobile A Changé - Et Les Développeurs Doivent Aussi",
        category: "Développement",
        date: "09 avril 2026",
        source: "dev.to",
        url: "https://dev.to/devilseyrock/mobile-development-has-changed-and-so-must-developers-4716",
        summary: "Analyse des nouvelles exigences du développement mobile : pourquoi les développeurs doivent dépasser la simple création d'interfaces pour concevoir de véritables systèmes modulaires, sécurisés, multi-écrans et intégrants l'IA."
    },
    {
        id: 4,
        title: "Intégrer le Privacy by Design dans vos développements",
        category: "Éthique",
        date: "15 Fév 2026",
        source: "CNIL (Recommandation)",
        url: "https://www.cnil.fr/fr/referentiel-durees-conservation-donnees-rh",
        summary: "Présentation du référentiel pratique de la CNIL guidant les employeurs, RH et DPO dans l'identification et l'application des durées légales de conservation des données personnelles des salariés."
    }
];

// Les catégories pour le filtre
const categories = ["Tout", "Développement", "Éthique", "Sécurité", "UI/UX"];

export default function Veille() {
    const [activeCategory, setActiveCategory] = useState("Tout");

    // Logique de filtre
    const filteredArticles = activeCategory === "Tout"
        ? articles
        : articles.filter(art => art.category === activeCategory);

    return (
        <main className="min-h-screen bg-rich-black text-white selection:bg-luxury-gold selection:text-black">
            <Navbar />

            <div className="pt-32 pb-20 max-w-6xl mx-auto px-6">

                {/* En-tête */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif font-bold text-white mb-6"
                    >
                        Veille <span className="text-luxury-gold">Technologique</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Une curation d'articles pour suivre les évolutions techniques, éthiques et UI/UX du secteur informatique.
                    </p>
                </div>

                {/* Barre de Filtres */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
                                activeCategory === cat
                                    ? "bg-luxury-gold text-black border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                                    : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grille des Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredArticles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-card-dark rounded-xl p-8 border border-gray-800 hover:border-luxury-gold/50 hover:shadow-glow transition-all duration-300 flex flex-col relative overflow-hidden"
                        >
                            {/* Effet décoratif d'arrière-plan */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-luxury-gold/10 transition-colors" />

                            {/* Header Carte : Date & Catégorie */}
                            <div className="flex justify-between items-center mb-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    article.category === "Éthique" ? "border-green-800 bg-green-900/20 text-green-300" :
                                        article.category === "Sécurité" ? "border-red-800 bg-red-900/20 text-red-300" :
                                            article.category === "UI/UX" ? "border-cyan-800 bg-cyan-900/20 text-cyan-300" :
                                                article.category === "Développement" ? "border-blue-800 bg-blue-900/20 text-blue-300" :
                                                    "border-gray-700 bg-gray-800 text-gray-400"
                                }`}>
                                  <FaTag className="inline mr-2 mb-0.5" />{article.category}
                                </span>
                                <span className="text-gray-500 text-xs flex items-center gap-2">
                                  <FaCalendarAlt /> {article.date}
                                </span>
                            </div>

                            {/* Contenu */}
                            <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-luxury-gold transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                                {article.summary}
                            </p>

                            {/* Footer Carte : Source */}
                            <div className="pt-6 border-t border-gray-800 flex justify-between items-center mt-auto">
                                <span className="text-xs text-gray-500 uppercase tracking-widest">
                                  Source : {article.source}
                                </span>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 group-hover:bg-luxury-gold group-hover:text-black group-hover:border-luxury-gold transition-all z-10"
                                >
                                    <FaExternalLinkAlt size={12} />
                                </a>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Message si aucun article */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <FaFilter className="text-4xl mx-auto mb-4 opacity-20" />
                        <p>Aucun article trouvé dans cette catégorie pour le moment.</p>
                    </div>
                )}

            </div>
        </main>
    );
}