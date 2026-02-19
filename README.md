# 🌑 Tobias Ferrand - Portfolio Premium

Ce dépôt contient le code source de mon portfolio personnel. L'objectif est de présenter mon parcours et mes projets avec une identité visuelle forte et une navigation fluide.

## 🚀 Site en ligne
[tobias-ferrand.ovh](https://tobias-ferrand.ovh)

## 🛠️ Stack Technique

* **Framework :** [Next.js 15+](https://nextjs.org/) (App Router)
* **Styling :** [Tailwind CSS](https://tailwindcss.com/)
* **Animations :** [Framer Motion](https://www.framer.com/motion/)
* **Icônes :** [React Icons](https://react-icons.github.io/react-icons/)
* **Hébergement :** OVH (Mutualisé)

## ✨ Points clés du projet

* **Design Luxury :** Thème sombre, accents dorés et typographie serif.
* **Logo Custom :** Logo TF avec glyphe musical et arrière-plan effet "Matrix".
* **Architecture :** Pages statiques optimisées (`Static Export`).
* **SEO :** Balises structurées et gestion des redirections propres.

## 🏗️ Rappel Déploiement (OVH)

Pour mettre à jour le site sur le FTP :

1.  Générer les fichiers : `npm run build`
2.  Transférer le contenu du dossier `/out` vers le dossier `/www` du serveur.
3.  **Note cruciale :** Le fichier `.htaccess` doit être présent dans `/www` pour gérer le HTTPS et les routes sans `.html`.

### Configuration .htaccess actuelle :
```apache
Options -Indexes
DirectoryIndex index.html
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]