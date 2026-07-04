# 🌑 Tobias Ferrand - Portfolio Premium

[![Site en ligne](https://img.shields.io/badge/🌍_Voir_le_site-tobias--ferrand.fr-D4AF37?style=for-the-badge)](https://tobias-ferrand.fr)
[![Next.js](https://img.shields.io/badge/Next.js_15-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Bienvenue sur le code source de mon portfolio personnel. Ce projet a été conçu pour refléter mon identité professionnelle à travers un design **"Luxury"** (thème noir profond, typographie serif, accents Or et Rouge énergique) tout en démontrant mes compétences techniques avancées en développement front-end et en intégration d'API.

---

## 📑 Sommaire

1. [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
2. [🧠 Philosophie d'Architecture](#-philosophie-darchitecture)
3. [🛠️ Stack Technique](#️-stack-technique)
4. [📁 Structure du Projet](#-structure-du-projet)
5. [📫 Contact](#-contact)

---

## ✨ Fonctionnalités Principales

### 🎨 Design & Expérience Utilisateur (UX/UI)

* **Charte Graphique Premium :** Palette de couleurs sur mesure (`rich-black`, `luxury-gold`, touches de rouge) pour un rendu à la fois élégant et dynamique.
* **Effets Visuels Avancés :** Intégration d'un composant exclusif `LogoVisualizer` générant une auréole énergétique multicouche animée en arrière-plan du logo.
* **Animations Fluides :** Utilisation de Framer Motion pour des transitions de pages douces, des apparitions d'éléments au défilement et des effets de lumière dynamiques.
* **Galerie Interactive :** Système de Lightbox (pop-up plein écran) sur-mesure pour les captures d'écran des projets, avec adaptation intelligente aux formats portrait et paysage.

### ⚙️ Intégration Dynamique & API

* **API GitHub en Temps Réel :** Récupération dynamique des dépôts de l'organisation *l-Atelier-du-code*. Le site affiche toujours les derniers projets sans nécessiter de mise à jour manuelle.
* **Data Visualisation CSS :** Génération de graphiques en camembert (pie charts) en pur CSS (`conic-gradient`) pour illustrer la répartition des langages de programmation de chaque dépôt.
* **Rendu Markdown Natif :** Traduction à la volée des fichiers `README.md` de GitHub en HTML stylisé grâce à `react-markdown` et au plugin `remark-gfm` (support des tableaux, listes à cocher, etc.).

### 🚀 Performances & SEO

* **Hébergement Vercel :** Déploiement continu et optimisation native (SSR, Edge caching, optimisation d'images automatique).
* **Routage Propre :** Configuration Next.js avancée avec redirections (rewrites) pour supporter de multiples sous-projets (ex: CV Creator, IdeaStorm) de manière fluide.

---

## 🧠 Philosophie d'Architecture

Ce projet a été construit selon les standards de l'industrie, en refusant les fichiers monolithiques géants au profit d'une approche hautement modulaire :

1. **Le principe des briques (Réutilisabilité)**
   L'interface est découpée en petits composants indépendants (`Navbar`, `CourseModal`, `ProjectGallery`). Cela permet de modifier un élément une seule fois pour qu'il se mette à jour sur toutes les pages.

2. **Maintenabilité absolue**
   La séparation des responsabilités garantit un débogage rapide. Les requêtes API GitHub, le calcul du graphique et la conversion du Markdown sont isolés dans des composants spécifiques.

3. **Optimisation Next.js (Server vs Client)**
   Le code distingue strictement les *Server Components* (pour un affichage instantané et un SEO optimal) des *Client Components* (marqués par `"use client"`, réservés uniquement aux éléments interactifs comme les clics, les modales et les animations). Cela garantit un site ultra-léger côté visiteur.

---

## 🛠️ Stack Technique

* **Framework Core :** Next.js 15+ (App Router) / React
* **Styling :** Tailwind CSS
* **Animations :** Framer Motion
* **Icônes :** React Icons (`react-icons/fa`, `react-icons/si`)
* **Parsing Markdown :** `react-markdown`, `remark-gfm`
* **Hébergement & Déploiement :** Vercel (CI/CD natif)

---

## 📁 Structure du Projet

```text
├── app/                  # Routes et pages principales (Server Components)
│   ├── page.tsx          # Page d'accueil
│   ├── projets/          # Pages projets
│   ├── cours/            # Exercices & Atelier du Code
│   └── ressources/       # Téléchargements (CV, compétences)
├── components/           # Composants réutilisables
├── data/                 # Données statiques
├── public/               # Assets (images, PDF, fonts, sous-projets HTML statiques)
├── tailwind.config.ts    # Configuration Tailwind
└── next.config.ts        # Config Next.js & redirections Vercel
```

---

## 📫 Contact

* **LinkedIn :** https://www.linkedin.com/in/tobias-ferrand
* **GitHub :** https://github.com/tferrand71

---

✨ Fait avec ❤️, beaucoup de café, et l'API GitHub.
