# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rôle attendu

Interviens comme **ingénieur fullstack / DevOps** sur ce dépôt : tu es responsable du code applicatif
(Next.js, React, TypeScript), de la couche données (Postgres), de la sécurité (authentification,
secrets, autorisations) et du déploiement (Vercel, variables d'environnement, build).

Ce que cela implique concrètement ici :

- **Le propriétaire du dépôt est étudiant en BTS SIO / alternance.** Explique les décisions
  d'architecture et les compromis, ne te contente pas d'appliquer. Le dépôt est public : il est lu
  par des recruteurs, donc les messages de commit et la qualité du code font partie du livrable.
- **Vérifie avant d'affirmer.** Lance `next build`, teste les endpoints avec `curl`, interroge la
  base. Ce projet a déjà contenu plusieurs bugs invisibles en local et cassants en production.
- **Signale les problèmes de sécurité dès que tu les croises**, même hors périmètre de la demande.
  Le dépôt a historiquement exposé des identifiants MySQL, un mot de passe SMTP et des mots de
  passe en clair.
- **Écris en français** : commentaires, messages de commit, documentation et réponses.

## Commandes

```bash
npm run dev          # serveur de développement (port 3000)
npm run build        # build de production — à lancer avant tout commit
npm run lint         # ESLint

node scripts/apply-schema.mjs        # crée/met à jour les tables IdeaStorm
node scripts/apply-cv-schema.mjs     # crée/met à jour les tables CV Creator
node scripts/migrate-ideastorm.mjs [--dry-run]   # reprise des comptes depuis un export CSV/JSON
node scripts/set-password.mjs <pseudo> <mdp> [--admin]
node scripts/set-password.mjs --list             # état des comptes IdeaStorm
```

Les scripts chargent `.env.local` via `process.loadEnvFile()` : **pas besoin de `export`**
(la connection string Neon contient des `?` et `&` que `export $(... | xargs)` découpe mal).

Il n'y a pas de suite de tests.

**Un seul serveur de dev à la fois.** Next pose un verrou sur `.next/dev/lock`, au niveau du projet
et non du port. Si WebStorm en a déjà lancé un, `npm run dev` échoue avec « Unable to acquire lock ».

## Architecture

Portfolio Next.js 16 (App Router, Turbopack, React 19, Tailwind 4) déployé sur Vercel, qui héberge
**deux applications de démonstration intégrées** — anciennement des projets Vite séparés servis
comme fichiers statiques, désormais des routes Next à part entière.

```
app/
  (pages vitrine)          accueil, projets, veille, cours, contact, pages légales
  ideastorm/page.tsx       jeu incrémental      → components/ideastorm/
  cv-creator/page.tsx      éditeur de CV        → components/cv-creator/
  api/ideastorm/*          9 Route Handlers (dont /me : qui est connecté)
  api/cv/*                 4 Route Handlers
lib/
  session.ts               fabrique de session partagée (JWT + cookie httpOnly)
  ideastorm/{db,session}.ts, schema.sql
  cv/{db,session}.ts, schema.sql
data/projects.tsx          source unique des projets ; `featured: true` pilote la page d'accueil
```

### Les deux démos intégrées

Chacune vient d'un projet Vite (`~/docker-web/www/{ideastorm,cv-creator}`) et suit le même patron :

1. La page est un Client Component qui charge l'app via `dynamic(..., { ssr: false })` — ces apps
   utilisent `localStorage`, `HashRouter` et des boucles d'animation, rien n'est prérendable.
2. **Le CSS des deux démos est scopé** sous `.ideastorm-root` / `.cv-root`. Les feuilles
   d'origine définissaient `*`, `body`, `#root`, `h1`, `p`, `input`, `button`, `table` : importées
   telles quelles, elles détruisent la charte du portfolio. `components/ideastorm/ideastorm.css`
   n'est plus généré depuis Vite (le jeu a été réécrit) : il s'édite directement, toutes ses
   classes sont préfixées `is-`.
3. Le backend PHP d'origine est remplacé par des Route Handlers. **Vercel n'exécute pas le PHP** :
   tout fichier `.php` déposé dans `public/` est servi en texte brut, code source et identifiants
   compris.

### Authentification

`lib/session.ts` expose `createSessionHelpers(cookieName)`. Chaque démo a **son propre cookie**
(`ideastorm_session`, `cv_session`) signé avec `SESSION_SECRET` : une session d'une démo ne donne
aucun accès à l'API de l'autre.

Règles non négociables, issues de failles réelles corrigées dans ce dépôt :

- **L'identité vient toujours du cookie**, jamais d'un `user_id` envoyé par le client. L'ancien
  `api.php` acceptait le `user_id` du corps de la requête : n'importe qui pouvait lire et écraser
  la sauvegarde d'autrui.
- **Les routes admin vérifient `session.role === "admin"` côté serveur.** Un contrôle côté client
  sur le pseudo ne compte pas.
- **Requêtes paramétrées uniquement**, via `query()` de `lib/*/db.ts`. Jamais de SQL concaténé.
- Mots de passe en **bcrypt coût 12**. Message d'erreur identique que le compte existe ou non.
- Dans CV Creator, le CV ne doit **jamais** repasser par `localStorage` : c'est ce qui faisait
  réapparaître le document de l'utilisateur précédent sur un poste partagé.

### Base de données

Un seul Neon Postgres, **partagé entre développement local et production**. Les tables sont
préfixées par démo : `ideastorm_users`, `ideastorm_game_state`, `cv_users`, `cv_documents`.
Le pool est créé paresseusement (`lib/ideastorm/db.ts`) — à l'import, `next build` échouerait
faute de `DATABASE_URL`.

`score` est en `NUMERIC` et non `BIGINT` : IdeaStorm monte jusqu'à 1e300.

**Format de sauvegarde IdeaStorm.** `ideastorm_game_state.save_data` ne contient que ce qui ne se
déduit pas : `owned` (nombre d'exemplaires par amélioration), `grantedPerClick`/`grantedPerSecond`
(puissance accordée par un admin), `rebirthCount`. Prix et production sont recalculés par
`components/ideastorm/lib/engine.js`. L'ancien format, qui stockait le prix courant de chaque
palier, est repris automatiquement par `migrateSave()` ; les parties d'avant le 27/09/2026 sont
copiées dans `ideastorm_game_state_sauvegarde_20260927` (table à supprimer une fois la reprise
confirmée).

### Déploiement

Push sur `main` → déploiement automatique sur `tobias-ferrand.fr`. Les variables
`DATABASE_URL` et `SESSION_SECRET` sont définies dans Vercel ; **elles ne sont injectées qu'au
build**, donc en ajouter une impose un redéploiement.

`next.config.ts` est volontairement vide : les anciennes `rewrites` vers des `index.html`
statiques ont disparu avec l'intégration des démos.

## Pièges rencontrés dans ce dépôt

- **Casse des noms de fichiers.** macOS est insensible à la casse, les builds Vercel non. Deux bugs
  déjà causés par ça (`Snow.jsx` vs `snow.jsx`, `progress 2.PNG` vs `Progress 2.PNG`). Nommer les
  fichiers en kebab-case ASCII, sans espaces ni accents.
- **`localStorage` au chargement d'un module** plante au prerender. Garder par
  `typeof window !== "undefined"` et appeler depuis un `useEffect`.
- **Images.** Toujours passer par `next/image` et livrer du WebP. Les captures d'origine pesaient
  4 à 7 Mo pour des vignettes de 200 px. `cwebp -q 80 -resize <largeur> 0`, et `gif2webp -lossy`
  pour les GIF animés.
- **`lucide-react` 1.x a supprimé les icônes de marque** (`Github`, `Linkedin`). Prendre celles de
  `react-icons`, déjà présent, plutôt que d'épingler une ancienne version.
- **Classes Tailwind fantômes.** `luxury-gold`, `rich-black`, `card-dark`, `shadow-glow` sont
  utilisées dans d'anciens composants mais ne sont définies nulle part dans le `@theme` de
  `app/globals.css` : elles ne produisent aucun style.
- **Tailwind 4 ne voit pas les classes construites dynamiquement.** Écrire les chaînes en toutes
  lettres (cf. l'objet `themes` de `components/FeaturedProjects.tsx`).

## Fichiers jamais versionnés

`.env.local`, `scripts/dump-*.csv|json` (exports de l'ancienne base, mots de passe en clair) et
`rapport.md` (audit local citant des identifiants). Vérifier avec `git check-ignore` avant tout
commit qui touche à la configuration.

## Chantiers ouverts

Détaillés dans `rapport.md` (non versionné) :

- Metadata SEO par page — six pages sont `"use client"` en racine, ce qui interdit d'exporter
  `metadata` ; extraire la partie interactive comme le fait `app/cours/`.
- `app/sitemap.ts` et `app/robots.ts` pointent encore vers `tobias-ferrand.ovh` alors que le site
  est sur `tobias-ferrand.fr`.
- Pas de `metadataBase` ni d'`openGraph` : les liens partagés sur LinkedIn apparaissent nus.
- ESLint remonte une soixantaine d'erreurs préexistantes (apostrophes non échappées, `any`).
- Contraste de `--color-text-muted` sous le seuil AA, et aucune prise en charge de
  `prefers-reduced-motion` alors que le site est très animé.
