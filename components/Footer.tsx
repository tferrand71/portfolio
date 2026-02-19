"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-rich-black border-t border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Logo & Copyright */}
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                        Tobias<span className="text-luxury-gold">.</span>
                    </h2>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Tobias Ferrand. Tous droits réservés.
                    </p>
                </div>

                {/* Liens Sociaux (Tes liens ici !) */}
                <div className="flex gap-6">
                    <a
                        href="https://github.com/tferrand71"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-card-dark border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-luxury-gold hover:bg-luxury-gold/10 transition-all"
                        aria-label="GitHub"
                    >
                        <FaGithub size={20} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/tobias-ferrand-3a337b277"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-card-dark border border-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400 hover:bg-blue-900/20 transition-all"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedin size={20} />
                    </a>
                    <a
                        href="mailto:contact@tobias-ferrand.ovh"
                        className="w-10 h-10 rounded-full bg-card-dark border border-gray-700 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:border-luxury-gold hover:bg-luxury-gold/10 transition-all"
                        aria-label="Email"
                    >
                        <FaEnvelope size={20} />
                    </a>
                </div>

                {/* Navigation rapide */}
                <div className="flex gap-6 text-sm text-gray-500 font-medium">
                    <Link href="/projets" className="hover:text-luxury-gold transition-colors">Projets</Link>
                    <Link href="/veille" className="hover:text-luxury-gold transition-colors">Veille</Link>
                    <Link href="/cours" className="hover:text-luxury-gold transition-colors">Cours</Link>
                </div>
            </div>
        </footer>
    );
}