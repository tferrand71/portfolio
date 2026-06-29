import CoursClient from "./CoursClient";

export default async function CoursPage() {
    let initialRepos = [];
    let errorMsg = null;

    try {
        const headers: HeadersInit = {};
        if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
            headers.Authorization = `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
        }

        // Using next: { revalidate: 3600 } or force-cache to cache the request on the server
        const res = await fetch("https://api.github.com/orgs/l-Atelier-du-code/repos?per_page=100", { 
            headers,
            next: { revalidate: 3600 } // Cache pendant 1 heure (ou force-cache selon le setup)
        });

        if (!res.ok) {
            if (res.status === 403) throw new Error("Limite d'API atteinte. Ajoutez un token ou attendez un peu.");
            if (res.status === 404) throw new Error("Dossier introuvable.");
            throw new Error("Erreur de récupération des données.");
        }

        const data = await res.json();
        const sortedData = data.sort((a: any, b: any) =>
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );

        initialRepos = sortedData.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
            pushed_at: repo.pushed_at
        }));
    } catch (error: any) {
        console.error("Erreur API GitHub côté serveur:", error);
        errorMsg = error.message;
    }

    return <CoursClient initialRepos={initialRepos} errorMsg={errorMsg} />;
}