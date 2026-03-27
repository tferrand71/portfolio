"use client";
import { useEffect, useState } from "react";
import { FaGithub, FaStar, FaHdd, FaBookOpen } from "react-icons/fa";

interface Project {
    title: string;
    description: string;
    tech: string[];
    github: string;
}

export default function GithubCourseCard({ project }: { project: Project }) {
    const [repoStats, setRepoStats] = useState<any>(null);
    const [languages, setLanguages] = useState<{ name: string; percent: string; color: string }[]>([]);
    const [readme, setReadme] = useState<string>("Chargement du README...");
    const [loading, setLoading] = useState(true);

    // Couleurs génériques pour la barre de langages
    const colors = ["bg-luxury-gold", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-red-400"];

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                // Extraction de "owner/repo" depuis l'URL GitHub
                const match = project.github.match(/github\.com\/([^/]+\/[^/]+)/);
                if (!match) return;
                const repoPath = match[1].replace('.git', '');

                // 1. Appel API pour les infos du repo (Étoiles, Taille)
                const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`);
                const repoData = await repoRes.json();
                setRepoStats(repoData);

                // 2. Appel API pour les langages et calculer les pourcentages
                const langRes = await fetch(`https://api.github.com/repos/${repoPath}/languages`);
                const langData = await langRes.json();

                const totalBytes = Object.values(langData).reduce((a: any, b: any) => a + b, 0) as number;
                const langArray = Object.entries(langData).map(([name, bytes], index) => ({
                    name,
                    percent: (((bytes as number) / totalBytes) * 100).toFixed(1),
                    color: colors[index % colors.length]
                }));
                setLanguages(langArray);

                // 3. Appel API pour récupérer le texte du README
                const readmeRes = await fetch(`https://api.github.com/repos/${repoPath}/readme`, {
                    headers: { Accept: "application/vnd.github.v3.raw" }
                });
                if (readmeRes.ok) {
                    const readmeText = await readmeRes.text();
                    setReadme(readmeText);
                } else {
                    setReadme("Aucun README trouvé pour ce dépôt.");
                }

            } catch (error) {
                console.error("Erreur API GitHub:", error);
                setReadme("Erreur lors du chargement.");
            } finally {
                setLoading(false);
            }
        };

        if (project.github) fetchGithubData();
    }, [project.github]);

    return (
        <div className="bg-card-dark p-6 rounded-xl border border-gray-800 flex flex-col hover:border-luxury-gold/30 hover:shadow-glow transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-2 capitalize">{project.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{project.description}</p>

            {loading ? (
                <div className="animate-pulse flex flex-col gap-4 my-4 grow">
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                    <div className="h-20 bg-gray-800 rounded w-full"></div>
                </div>
            ) : (
                <div className="flex flex-col grow">
                    {/* Statistiques GitHub */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-mono">
                        {repoStats?.stargazers_count !== undefined && (
                            <span className="flex items-center gap-1"><FaStar className="text-luxury-gold" /> {repoStats.stargazers_count}</span>
                        )}
                        {repoStats?.size !== undefined && (
                            <span className="flex items-center gap-1"><FaHdd /> {Math.round(repoStats.size / 1024)} MB</span>
                        )}
                    </div>

                    {/* Barre de pourcentages des langages */}
                    {languages.length > 0 && (
                        <div className="mb-6">
                            <div className="w-full h-2 rounded-full flex overflow-hidden mb-2">
                                {languages.map((lang, i) => (
                                    <div key={i} style={{ width: `${lang.percent}%` }} className={lang.color} title={`${lang.name} ${lang.percent}%`}></div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-3 text-[10px] text-gray-500 uppercase tracking-widest">
                                {languages.map((lang, i) => (
                                    <span key={i} className="flex items-center gap-1">
                                        <span className={`w-2 h-2 rounded-full ${lang.color}`}></span>
                                        {lang.name} {lang.percent}%
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Extrait du README */}
                    <div className="bg-black/50 border border-white/5 rounded p-4 mb-6 max-h-32 overflow-y-auto custom-scrollbar">
                        <h4 className="text-[10px] uppercase text-luxury-gold font-bold mb-2 flex items-center gap-2 tracking-widest">
                            <FaBookOpen /> Extrait du README
                        </h4>
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap font-sans">
                            {readme}
                        </pre>
                    </div>
                </div>
            )}

            <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-3 border border-gray-600 hover:border-luxury-gold text-gray-300 hover:text-luxury-gold font-bold text-center text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded"
            >
                <FaGithub className="text-lg" /> Voir sur GitHub
            </a>
        </div>
    );
}