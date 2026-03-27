import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaCoffee, FaMusic } from "react-icons/fa";
import { SiFlutter, SiDart } from "react-icons/si";
import { ReactNode } from "react";

export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    longDescription: string;
    tech: { name: string; icon: ReactNode; color: string }[];
    links: {
        demo?: string;
        repo?: string;
        download?: string;
    };
    icon?: ReactNode;
    status?: string;
    gallery?: string[]; // <-- AJOUT DE LA PROPRIÉTÉ GALERIE
}

export const projects: Project[] = [
    {
        id: "cv-creator",
        title: "CV Creator",
        category: "Application Web",
        description: "Générateur de CV interactif avec prévisualisation PDF.",
        longDescription: "CV Creator simplifie la création de curriculum vitae professionnels. En utilisant React, cet outil permet une personnalisation en temps réel. L'export PDF est géré côté client, garantissant que vos données personnelles ne quittent jamais votre navigateur.",
        tech: [{ name: "React", icon: <FaReact />, color: "text-blue-400" }, { name: "JS", icon: <FaJs />, color: "text-yellow-400" }],
        links: { demo: "/cv-creator/index.html", repo: "" },
        gallery: [
             "/images/cv-creator.png"
        ]
    },
    {
        id: "IdeaStorm",
        title: "IdeaStorm",
        category: "Jeu Web & Mobile",
        description: "Jeu incrémental avec portage mobile Flutter.",
        longDescription: "IdeaStorm est un projet explorant le développement cross-platform. D'abord créé en React pour le web, il a été porté sur mobile avec Flutter pour offrir une expérience native. Il inclut un système de sauvegarde locale et des mécaniques de progression addictive.",
        tech: [{ name: "React", icon: <FaReact />, color: "text-blue-400" }, { name: "Flutter", icon: <SiFlutter />, color: "text-cyan-400" }],
        links: { demo: "/ideastorm/index.html", repo: "https://github.com/tferrand71/ideastorm2.0.git", download:"/download/IdeaStorm.apk" },
        gallery: [
            "/images/IdeaStorm - connexion.png",
            "/images/IdeaStorm - accueil.png",
            "/images/IdeaStorm - boutique 1.png",
            "/images/IdeaStorm - boutique 2.png",
            "/images/IdeaStorm - boutique 3.png"
        ]
    },
    {
        id: "harmonie-epehy",
        title: "Harmonie d'Épehy",
        category: "Site Associatif",
        description: "Site officiel de l'orchestre d'harmonie d'Épehy.",
        longDescription: "Développement du site web pour l'association musicale Harmonie d'Épehy. L'objectif était de moderniser leur communication, de présenter l'agenda des concerts et de faciliter le recrutement de nouveaux musiciens via une interface élégante.",
        tech: [{ name: "HTML5", icon: <FaHtml5 />, color: "text-orange-500" }, { name: "CSS3", icon: <FaCss3Alt />, color: "text-blue-500" }],
        links: { demo: "https://harmonie-epehy.fr" },
        icon: <FaMusic className="text-5xl text-luxury-gold" />,
        gallery: [
            // "/images/harmonie-1.jpg"
        ]
    },
    {
        id: "maki",
        title: "Maki",
        category: "Application Mobile",
        description: "Gestionnaire de mangathèque personnel (scan & suivi).",
        longDescription: "Maki est une application mobile conçue pour les collectionneurs de mangas. Elle permet de scanner les codes-barres pour ajouter des tomes à sa collection, de suivre ses lectures et de gérer sa liste de souhaits. Actuellement en cours de développement avec Flutter et Dart.",
        tech: [{ name: "Flutter", icon: <SiFlutter />, color: "text-cyan-400" }, { name: "Dart", icon: <SiDart />, color: "text-blue-300" }],
        links: { repo: "https://github.com/tferrand71/MakiApp.git" },
        status: "En cours",
        gallery: [
            "/images/Maki - accueil.PNG",
            "/images/Maki - collec.PNG",
            "/images/Maki - Discovery.PNG",
            "/images/Maki - ISBN.PNG",
            "/images/Maki - profil.PNG",
            "/images/Maki - profil 2.PNG",
            "/images/Maki - profil 3.PNG",
            "/images/Maki - progress.PNG",
            "/images/Maki - progress 2.PNG",
            "/images/Maki - search.PNG",


        ]
    }
];