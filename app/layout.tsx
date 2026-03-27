import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Configuration des polices
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter", // On crée une variable CSS pour Tailwind
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

export const metadata: Metadata = {
    title: "Tobias Ferrand", // Ton nom dans l'onglet
    description: "Portfolio de Tobias Ferrand - Développeur Fullstack",
    icons: {
        icon: "/images/image.png", // Utilise ton logo comme icône
        apple: "/images/image.png", // Optionnel : pour les raccourcis iPhone
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body className={`${inter.variable} ${playfair.variable} antialiased bg-rich-black text-white`}>
        {children}
        </body>
        </html>
    );
}