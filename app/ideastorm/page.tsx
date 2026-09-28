"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Poppins } from "next/font/google";
import "@/components/ideastorm/ideastorm.css";

// Le jeu utilise HashRouter, une boucle de jeu et un canvas : rien n'est
// prérendable côté serveur, on le charge donc uniquement dans le navigateur.
const Game = dynamic(() => import("@/components/ideastorm/App"), {
    ssr: false,
    loading: () => (
        <div className="ideastorm-boot">
            <p>Chargement d&apos;IdeaStorm…</p>
        </div>
    ),
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export default function IdeaStormPage() {
    return (
        <div className={`ideastorm-root ${poppins.className}`}>
            <Game />
            <Link href="/projets/IdeaStorm" className="is-back">
                ← Retour au portfolio
            </Link>
        </div>
    );
}
