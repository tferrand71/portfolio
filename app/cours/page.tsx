"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import CourseModal from "@/components/CourseModal";

export default function Cours() {
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<{ name: string, url: string } | null>(null);

    useEffect(() => {
        const fetchOrgRepos = async () => {
            try {
                // Préparation des en-têtes avec le token s'il est présent (en local)
                const headers: HeadersInit = {};
                if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
                    headers.Authorization = `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
                }

                // Essaye 'users' à la place de 'orgs' si tu as toujours une erreur 404
                const res = await fetch("https://api.github.com/orgs/l-Atelier-du-code/repos", { headers });

                if (!res.ok) {
                    if (res.status === 403) throw new Error("Limite d'API atteinte. Ajoutez un token ou changez d'IP.");
                    if (res.status === 404) throw new Error("Dossier introuvable (Essayez 'users/l-Atelier-du-code' au lieu de 'orgs').");
                    throw new Error("Erreur de récupération des données.");
                }

                const data = await res.json();

                const sortedData = data.sort((a: any, b: any) =>
                    new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
                );

                setRepos(sortedData);
            } catch (error: any) {
                console.error("Erreur API GitHub:", error);
                setErrorMsg(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgRepos();
    }, []);

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">

                <div className="mb-16">
                    <h1 className="text-5xl font-serif text-white mb-4">
                        L'Atelier du <span className="text-luxury-gold">Code</span>
                    </h1>
                    <p className="text-gray-400">
                        Cliquez sur un projet pour voir sa répartition technique et son contenu.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
                    </div>
                ) : errorMsg ? (
                    <div className="text-center text-red-400 py-10 border border-red-900/50 rounded-xl bg-red-900/10">
                        🚨 {errorMsg}
                    </div>
                ) : repos.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repos.map((repo) => (
                            <div
                                key={repo.id}
                                onClick={() => setSelectedRepo({ name: repo.name, url: repo.html_url })}
                                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-luxury-gold/50 hover:bg-white/10 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                            >
                                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-luxury-gold transition-colors capitalize">
                                    {repo.name.replace(/-/g, ' ')}
                                </h3>
                                <p className="text-gray-400 text-sm grow mb-6 line-clamp-3">
                                    {repo.description || "Aucune description fournie pour ce projet."}
                                </p>

                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                                    <span className="w-8 h-px bg-luxury-gold/50 group-hover:w-12 group-hover:bg-luxury-gold transition-all"></span>
                                    Découvrir
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10 border border-white/10 rounded-xl bg-white/5">
                        Aucun dépôt public trouvé.
                    </div>
                )}
            </div>

            {selectedRepo && (
                <CourseModal
                    repoName={selectedRepo.name}
                    repoUrl={selectedRepo.url}
                    onClose={() => setSelectedRepo(null)}
                />
            )}
        </main>
    );
}