import { NextResponse } from "next/server";

import {
    GITHUB_ORG,
    GITHUB_REVALIDATE,
    REPO_NAME_PATTERN,
    githubHeaders,
    hasGithubToken,
} from "@/lib/github";

/**
 * Détails d'un dépôt de cours : langages et README.
 *
 * Cette route existe pour que le jeton GitHub reste sur le serveur. Le modal
 * appelait l'API GitHub depuis le navigateur, ce qui imposait un jeton
 * préfixé NEXT_PUBLIC_, donc publié dans le bundle.
 *
 * Elle n'expose rien de plus qu'avant : la page /cours affichait déjà
 * publiquement le README et les langages de ces dépôts. Ce qu'elle retire,
 * c'est la possibilité pour un visiteur de repartir avec le jeton lui-même.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ repo: string }> }) {
    const { repo } = await params;

    if (!REPO_NAME_PATTERN.test(repo)) {
        return NextResponse.json({ error: "Nom de dépôt invalide." }, { status: 400 });
    }

    if (!hasGithubToken()) {
        // Sans jeton, GitHub répond 404 sur un dépôt privé : autant le dire
        // clairement plutôt que de laisser croire que le dépôt n'existe pas.
        return NextResponse.json(
            { error: "GITHUB_TOKEN n'est pas configuré sur le serveur." },
            { status: 503 }
        );
    }

    const base = `https://api.github.com/repos/${GITHUB_ORG}/${encodeURIComponent(repo)}`;
    const cache = { next: { revalidate: GITHUB_REVALIDATE } };

    try {
        // Les deux appels sont indépendants : on les lance en parallèle.
        const [langRes, readmeRes] = await Promise.all([
            fetch(`${base}/languages`, { headers: githubHeaders(), ...cache }),
            fetch(`${base}/readme`, {
                headers: githubHeaders({ Accept: "application/vnd.github.v3.raw" }),
                ...cache,
            }),
        ]);

        if (langRes.status === 404 && readmeRes.status === 404) {
            return NextResponse.json({ error: "Dépôt introuvable." }, { status: 404 });
        }

        const languages = langRes.ok ? await langRes.json() : {};
        const readme = readmeRes.ok ? await readmeRes.text() : null;

        return NextResponse.json(
            { languages, readme },
            {
                headers: {
                    // Le contenu bouge rarement : une heure de cache partagé,
                    // et on tolère une réponse périmée pendant la revalidation.
                    "Cache-Control": `public, s-maxage=${GITHUB_REVALIDATE}, stale-while-revalidate=86400`,
                },
            }
        );
    } catch (err) {
        console.error("[api/cours]", err);
        return NextResponse.json({ error: "GitHub est injoignable." }, { status: 502 });
    }
}
