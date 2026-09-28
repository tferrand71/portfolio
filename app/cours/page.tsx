import { GITHUB_ORG, GITHUB_REVALIDATE, githubHeaders, type GithubRepo } from "@/lib/github";

import CoursClient from "./CoursClient";

export default async function CoursPage() {
    let initialRepos: GithubRepo[] = [];
    let errorMsg: string | null = null;

    try {
        // Composant serveur : le jeton ne quitte jamais la machine.
        const res = await fetch(
            `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100`,
            { headers: githubHeaders(), next: { revalidate: GITHUB_REVALIDATE } }
        );

        if (!res.ok) {
            if (res.status === 401) throw new Error("Jeton GitHub invalide ou expiré.");
            if (res.status === 403) throw new Error("Limite d'API atteinte, réessaie dans un moment.");
            if (res.status === 404) throw new Error("Dossier introuvable.");
            throw new Error("Erreur de récupération des données.");
        }

        const data: GithubRepo[] = await res.json();
        const sortedData = [...data].sort(
            (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );

        initialRepos = sortedData.map((repo) => ({
            id: repo.id,
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
            pushed_at: repo.pushed_at
        }));
    } catch (error) {
        console.error("Erreur API GitHub côté serveur:", error);
        errorMsg = error instanceof Error ? error.message : "Erreur inconnue.";
    }

    return <CoursClient initialRepos={initialRepos} errorMsg={errorMsg} />;
}