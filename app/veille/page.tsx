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
        title: "L'évolution des pratiques de développement en 2025",
        category: "Développement",
        date: "15 Fév 2026",
        source: "Stack Overflow Insights",
        url: "https://insights.stackoverflow.com/",
        summary: "Synthèse sur l'IA assistée (Copilot), le CI/CD moderne et l'architecture microservices. L'article souligne l'importance croissante des tests automatisés dans les pipelines DevOps."
    },
    {
        id: 2,
        title: "IA, vie privée et responsabilité des développeurs",
        category: "Juridique",
        date: "10 Jan 2026",
        source: "BBC Technology",
        url: "https://www.bbc.com/news/technology",
        summary: "Analyse des enjeux éthiques liés aux algorithmes : transparence, biais cognitifs et RGPD. Comment intégrer la notion de 'Privacy by Design' dès la conception ?"
    },
    {
        id: 3,
        title: "Flutter vs React Native : Le duel en 2026",
        category: "Mobile",
        date: "02 Dec 2025",
        source: "Medium / Flutter Dev",
        url: "#",
        summary: "Comparatif des performances avec le nouveau moteur de rendu Impeller de Flutter. React Native garde l'avantage sur l'écosystème JS, mais Flutter gagne sur l'UI fluide."
    }
    // Pour ajouter un article, copie-colle un bloc { ... } ci-dessus et change les infos
];

// Les catégories pour le filtre
const categories = ["Tout", "Développement", "Juridique", "Mobile", "Sécurité"];

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
                        Une curation d'articles pour suivre les évolutions techniques et juridiques du secteur informatique.
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
                    article.category === "Juridique" ? "border-purple-800 bg-purple-900/20 text-purple-300" :
                        article.category === "Développement" ? "border-blue-800 bg-blue-900/20 text-blue-300" :
                            article.category === "Mobile" ? "border-cyan-800 bg-cyan-900/20 text-cyan-300" :
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
                                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 group-hover:bg-luxury-gold group-hover:text-black group-hover:border-luxury-gold transition-all"
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