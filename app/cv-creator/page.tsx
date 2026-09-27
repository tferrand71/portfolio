"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import "@/components/cv-creator/cv-creator.css";

// L'éditeur manipule le DOM pour l'impression et n'a rien à prérendre.
const CvCreator = dynamic(() => import("@/components/cv-creator/App"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center text-gray-500">
            Chargement de l&apos;éditeur…
        </div>
    ),
});

export default function CvCreatorPage() {
    return (
        <div className="cv-root">
            <CvCreator />
            <Link
                href="/projets/cv-creator"
                className="no-print fixed left-4 bottom-4 z-50 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-xs font-semibold text-gray-600 shadow-lg backdrop-blur transition-colors hover:bg-gray-900 hover:text-white"
            >
                ← Retour au portfolio
            </Link>
        </div>
    );
}
