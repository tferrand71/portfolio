// =====================================================================
//  Accès à l'API GitHub — code serveur uniquement
//
//  Les dépôts de cours sont privés : leur lecture exige un jeton. Celui-ci
//  s'appelle GITHUB_TOKEN, sans le préfixe NEXT_PUBLIC_.
//
//  La distinction n'est pas cosmétique. `NEXT_PUBLIC_` demande explicitement
//  à Next de remplacer l'expression par sa valeur littérale au moment du
//  build, y compris dans le JavaScript envoyé au navigateur : le jeton se
//  retrouvait en clair dans /_next/static/chunks/, téléchargeable par
//  n'importe qui. Un jeton n'étant pas limité à un point d'entrée, quiconque
//  le récupérait obtenait les droits complets qu'il porte.
//
//  Ce fichier ne doit jamais être importé depuis un composant client.
// =====================================================================

/** Organisation qui héberge les dépôts de cours. */
export const GITHUB_ORG = "l-Atelier-du-code";

/** Durée de cache des réponses GitHub, en secondes. */
export const GITHUB_REVALIDATE = 3600;

/**
 * Noms de dépôt acceptés. GitHub n'autorise que lettres, chiffres, point,
 * tiret et underscore : tout le reste est refusé avant de construire l'URL,
 * pour qu'un nom fabriqué ne puisse pas sortir de l'organisation.
 */
export const REPO_NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

/** En-têtes d'authentification, vides si aucun jeton n'est configuré. */
export function githubHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = { ...extra };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
}

/** True quand un jeton est configuré — les dépôts privés en dépendent. */
export function hasGithubToken(): boolean {
    return Boolean(process.env.GITHUB_TOKEN);
}

/** Un dépôt tel que renvoyé par /orgs/:org/repos, réduit à ce qu'on affiche. */
export type GithubRepo = {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    pushed_at: string;
};
