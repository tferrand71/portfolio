// =====================================================================
//  Diagnostic du jeton GitHub
//
//  Usage :  node scripts/check-github-token.mjs
//
//  Lit GITHUB_TOKEN depuis .env.local et dit précisément ce que le jeton
//  voit — et, s'il ne voit pas l'organisation, pourquoi.
//
//  Le jeton n'est jamais affiché.
// =====================================================================

process.loadEnvFile(".env.local");

const ORG = "l-Atelier-du-code";
const token = process.env.GITHUB_TOKEN;

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const ko = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const info = (m) => console.log(`    ${m}`);

if (!token) {
    ko("GITHUB_TOKEN absent de .env.local");
    info("Ajoute une ligne :  GITHUB_TOKEN=github_pat_...");
    process.exit(1);
}

const api = async (path, accept) => {
    const res = await fetch(`https://api.github.com${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...(accept ? { Accept: accept } : {}),
        },
    });
    let body = null;
    try {
        body = accept ? await res.text() : await res.json();
    } catch {
        /* réponse vide */
    }
    return { status: res.status, body };
};

console.log(`\nDiagnostic du jeton (type : ${token.startsWith("github_pat_") ? "fine-grained" : "classique"})\n`);

// 1. Le jeton est-il valide ?
const me = await api("/user");
if (me.status !== 200) {
    ko(`jeton refusé par GitHub (HTTP ${me.status} — ${me.body?.message ?? "?"})`);
    info("Il est expiré ou révoqué. Génère-en un nouveau.");
    process.exit(1);
}
ok(`jeton valide, rattaché au compte ${me.body.login}`);

// 2. Voit-il l'organisation ?
const orgs = await api("/user/orgs");
const visibles = Array.isArray(orgs.body) ? orgs.body.map((o) => o.login) : [];
if (visibles.includes(ORG)) ok(`organisation ${ORG} accessible`);
else ko(`organisation ${ORG} NON accessible (organisations vues : ${visibles.length ? visibles.join(", ") : "aucune"})`);

// 3. Le test qui compte : les dépôts de l'organisation.
const repos = await api(`/orgs/${ORG}/repos?per_page=100`);
const liste = Array.isArray(repos.body) ? repos.body : [];

if (liste.length > 0) {
    ok(`${liste.length} dépôt(s) lisibles dans ${ORG} :`);
    for (const r of liste) info(`- ${r.name}${r.private ? " (privé)" : ""}`);

    // 4. Les deux appels dont la page a besoin.
    const cible = liste[0].name;
    const [lang, readme] = await Promise.all([
        api(`/repos/${ORG}/${cible}/languages`),
        api(`/repos/${ORG}/${cible}/readme`, "application/vnd.github.v3.raw"),
    ]);
    if (lang.status === 200) ok(`langages lisibles (testé sur ${cible})`);
    else ko(`langages illisibles sur ${cible} (HTTP ${lang.status})`);
    if (readme.status === 200) ok(`README lisible (testé sur ${cible})`);
    else ko(`README illisible sur ${cible} (HTTP ${readme.status}) — permission « Contents » manquante ?`);

    console.log("\n\x1b[32mLe jeton est bon.\x1b[0m Mets-le aussi dans Vercel sous le nom GITHUB_TOKEN,");
    console.log("puis remets « Cours » dans Navbar.tsx et Footer.tsx.\n");
    process.exit(0);
}

// --- Échec : on explique quoi corriger, dans l'ordre le plus probable.
ko(`aucun dépôt lisible dans ${ORG}`);
console.log("\n\x1b[33mCauses possibles, de la plus fréquente à la plus rare :\x1b[0m\n");
console.log("  1. Le jeton attend une approbation.");
console.log("     Un jeton visant une organisation s'authentifie mais ne voit rien");
console.log("     tant qu'un propriétaire ne l'a pas approuvé.");
console.log(`     -> github.com/organizations/${ORG}/settings/personal-access-token-requests\n`);
console.log("  2. Le « Resource owner » est resté sur ton compte personnel.");
console.log(`     C'est le premier champ du formulaire. Il doit valoir ${ORG}.`);
console.log("     Changer ce champ vide la sélection de dépôts : re-sélectionne-les après.\n");
console.log("  3. L'organisation n'autorise pas ces jetons.");
console.log(`     -> github.com/organizations/${ORG}/settings/personal-access-tokens`);
console.log("     « Allow access via fine-grained personal access tokens »\n");
console.log("  4. Permission insuffisante : « Repository permissions → Contents: Read-only ».\n");
process.exit(1);
