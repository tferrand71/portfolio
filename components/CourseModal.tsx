"use client";
import React, { useEffect, useState } from "react";
import { FaGithub, FaBookOpen, FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CourseModalProps {
    repoName: string;
    repoUrl: string;
    onClose: () => void;
}

const COLORS = ["#D4AF37", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#F59E0B"];

export default function CourseModal({ repoName, repoUrl, onClose }: CourseModalProps) {
    const [languages, setLanguages] = useState<{ name: string; percent: number; color: string }[]>([]);
    const [readme, setReadme] = useState<string>("Chargement du README...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Configuration des en-têtes avec Token si présent
                const baseHeaders: HeadersInit = {};
                const readmeHeaders: HeadersInit = { Accept: "application/vnd.github.v3.raw" };

                if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
                    baseHeaders.Authorization = `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
                    readmeHeaders.Authorization = `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
                }

                // 1. Récupérer les langages
                const langRes = await fetch(`https://api.github.com/repos/l-Atelier-du-code/${repoName}/languages`, { headers: baseHeaders });
                if (langRes.ok) {
                    const langData = await langRes.json();
                    const totalBytes = Object.values(langData).reduce((a: any, b: any) => a + b, 0) as number;

                    if (totalBytes > 0) {
                        const langArray = Object.entries(langData).map(([name, bytes], index) => ({
                            name,
                            percent: Number((((bytes as number) / totalBytes) * 100).toFixed(1)),
                            color: COLORS[index % COLORS.length]
                        }));
                        setLanguages(langArray);
                    }
                }

                // 2. Récupérer le README
                const readmeRes = await fetch(`https://api.github.com/repos/l-Atelier-du-code/${repoName}/readme`, { headers: readmeHeaders });
                if (readmeRes.ok) {
                    const readmeText = await readmeRes.text();
                    setReadme(readmeText);
                } else {
                    setReadme("Aucun README trouvé pour ce dépôt.");
                }
            } catch (error) {
                console.error("Erreur API GitHub:", error);
                setReadme("Erreur lors du chargement des détails.");
            } finally {
                setLoading(false);
            }
        };

        // Correction de l'erreur "Promise returned is ignored"
        void fetchDetails();

        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, [repoName]);

    let currentAngle = 0;
    const conicGradient = languages.map(lang => {
        const start = currentAngle;
        const end = currentAngle + lang.percent;
        currentAngle = end;
        return `${lang.color} ${start}% ${end}%`;
    }).join(", ");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* Correction : bg-[#0a0a0a] -> bg-rich-black */}
            <div className="relative bg-rich-black border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                    <h2 className="text-2xl font-serif text-white capitalize">{repoName.replace(/-/g, ' ')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-luxury-gold transition-colors p-2">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Correction : flex-grow -> grow */}
                <div className="overflow-y-auto p-6 grow custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8 h-full">

                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col items-center justify-start h-fit md:col-span-1">
                                <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-8 font-bold text-center w-full border-b border-white/10 pb-4">Répartition du Code</h3>

                                {languages.length > 0 ? (
                                    <>
                                        {/* Correction : flex-shrink-0 -> shrink-0 */}
                                        <div
                                            className="w-48 h-48 rounded-full mb-8 shadow-[0_0_30px_rgba(212,175,55,0.1)] shrink-0"
                                            style={{ background: `conic-gradient(${conicGradient})` }}
                                        ></div>
                                        <div className="flex flex-col gap-3 w-full">
                                            {languages.map((lang, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm text-white bg-black/30 p-2 rounded border border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }}></span>
                                                        {lang.name}
                                                    </div>
                                                    <span className="text-gray-400 font-mono">{lang.percent}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm">Aucun langage détecté.</p>
                                )}
                            </div>

                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col h-full md:col-span-2">
                                <h3 className="text-sm uppercase tracking-widest text-luxury-gold mb-4 font-bold flex items-center gap-2 border-b border-white/10 pb-4">
                                    <FaBookOpen /> README.md
                                </h3>
                                {/* Correction : flex-grow -> grow */}
                                <div className="overflow-y-auto custom-scrollbar pr-4 grow prose prose-invert prose-sm md:prose-base max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {readme}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5 mt-auto">
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-luxury-gold text-black hover:bg-white font-bold text-center text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 rounded"
                    >
                        <FaGithub className="text-lg" /> Voir le code source complet
                    </a>
                </div>
            </div>
        </div>
    );
}