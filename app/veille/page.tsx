"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { FaExternalLinkAlt, FaCalendarAlt, FaTag, FaFilter, FaNewspaper } from "react-icons/fa";

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

const categories = ["Tout", "Développement", "Éthique", "Sécurité", "UI/UX"];

export default function Veille() {
    const [activeCategory, setActiveCategory] = useState("Tout");
    const containerRef = useRef(null);

    const filteredArticles = activeCategory === "Tout"
        ? articles
        : articles.filter(art => art.category === activeCategory);

    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden" ref={containerRef}>
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-1/4 right-0 w-[50vw] h-[50vw] bg-[var(--color-pink)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            <motion.div 
                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="fixed bottom-0 left-0 w-[60vw] h-[60vw] bg-[var(--color-mauve)]/10 rounded-full blur-[180px] -z-10 pointer-events-none"
            />

            <Navbar />

            <div className="pt-48 pb-32 max-w-7xl mx-auto px-6 relative z-10">

                {/* En-tête asymétrique */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
                    <div className="lg:w-2/3">
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-serif font-bold text-[var(--color-text-main)] mb-6 leading-tight"
                        >
                            Veille <br/><span className="text-[var(--color-pink)]">Technologique.</span>
                        </motion.h1>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed text-lg max-w-xl">
                            Une curation d'articles pour suivre les évolutions techniques, éthiques et UX du secteur informatique. Restez à la pointe de l'innovation.
                        </p>
                    </div>

                    {/* Filtres dans un panneau asymétrique */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-1/3 glass-panel p-6 rounded-[2rem] border border-[var(--color-glass-border)] w-full"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <FaFilter className="text-[var(--color-pink)]" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)]">Filtrer par catégorie</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                        activeCategory === cat
                                            ? "bg-[var(--color-pink)] text-black shadow-[0_0_20px_-5px_var(--color-pink)]"
                                            : "bg-black/30 text-[var(--color-text-muted)] border border-white/5 hover:border-[var(--color-pink)]/50 hover:text-white"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Liste Staggered */}
                <div className="relative mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        {/* Colonne Gauche */}
                        <div className="flex flex-col gap-8 lg:gap-16">
                            {filteredArticles.filter((_, i) => i % 2 === 0).map((article, index) => (
                                <motion.article
                                    key={article.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="w-full glass-panel p-8 md:p-10 rounded-[2.5rem] border border-[var(--color-glass-border)] hover:border-[var(--color-pink)]/50 transition-all duration-500 group hover:shadow-[0_15px_40px_-10px_var(--color-pink)] relative overflow-hidden bg-black/20"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-pink)]/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--color-pink)]/20 transition-colors duration-500" />
                                    
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                            article.category === "Éthique" ? "border-green-500/30 bg-green-500/10 text-green-300" :
                                            article.category === "Sécurité" ? "border-red-500/30 bg-red-500/10 text-red-300" :
                                            article.category === "UI/UX" ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" :
                                            article.category === "Développement" ? "border-blue-500/30 bg-blue-500/10 text-blue-300" :
                                            "border-[var(--color-pink)]/30 bg-[var(--color-pink)]/10 text-[var(--color-pink)]"
                                        }`}>
                                            {article.category}
                                        </span>
                                        <span className="text-[var(--color-text-muted)] text-xs font-mono">
                                            {article.date}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-6 group-hover:text-[var(--color-pink)] transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-[var(--color-text-muted)] text-sm font-light leading-relaxed mb-8 flex-grow">
                                        {article.summary}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                                                <FaNewspaper className="text-xs text-[var(--color-text-muted)]" />
                                            </div>
                                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">
                                                {article.source}
                                            </span>
                                        </div>
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-pink)] hover:text-black hover:border-[var(--color-pink)] transition-all z-10"
                                        >
                                            <FaExternalLinkAlt size={14} />
                                        </a>
                                    </div>
                                </motion.article>
                            ))}
                        </div>

                        {/* Colonne Droite */}
                        <div className="flex flex-col gap-8 lg:gap-16 lg:mt-32">
                            {filteredArticles.filter((_, i) => i % 2 !== 0).map((article, index) => (
                                <motion.article
                                    key={article.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="w-full glass-panel p-8 md:p-10 rounded-[2.5rem] border border-[var(--color-glass-border)] hover:border-[var(--color-pink)]/50 transition-all duration-500 group hover:shadow-[0_15px_40px_-10px_var(--color-pink)] relative overflow-hidden bg-black/20"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-pink)]/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--color-pink)]/20 transition-colors duration-500" />
                                    
                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                            article.category === "Éthique" ? "border-green-500/30 bg-green-500/10 text-green-300" :
                                            article.category === "Sécurité" ? "border-red-500/30 bg-red-500/10 text-red-300" :
                                            article.category === "UI/UX" ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" :
                                            article.category === "Développement" ? "border-blue-500/30 bg-blue-500/10 text-blue-300" :
                                            "border-[var(--color-pink)]/30 bg-[var(--color-pink)]/10 text-[var(--color-pink)]"
                                        }`}>
                                            {article.category}
                                        </span>
                                        <span className="text-[var(--color-text-muted)] text-xs font-mono">
                                            {article.date}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-6 group-hover:text-[var(--color-pink)] transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-[var(--color-text-muted)] text-sm font-light leading-relaxed mb-8 flex-grow">
                                        {article.summary}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                                                <FaNewspaper className="text-xs text-[var(--color-text-muted)]" />
                                            </div>
                                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">
                                                {article.source}
                                            </span>
                                        </div>
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full border border-[var(--color-glass-border)] flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-pink)] hover:text-black hover:border-[var(--color-pink)] transition-all z-10"
                                        >
                                            <FaExternalLinkAlt size={14} />
                                        </a>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-32 text-[var(--color-text-muted)] glass-panel rounded-[2rem] max-w-2xl mx-auto border-[var(--color-glass-border)]">
                            <FaFilter className="text-5xl mx-auto mb-6 opacity-50 text-[var(--color-pink)]" />
                            <p className="text-lg font-light">Aucun article trouvé dans cette catégorie pour le moment.</p>
                        </div>
                    )}
                </div>

            </div>
            <Footer />
        </main>
    );
}