"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Effet pour changer l'opacité au scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { name: "Accueil", href: "/" },
        { name: "Veille", href: "/veille" },
        { name: "Cours", href: "/cours" },
        { name: "Projets", href: "/projets" },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled ? "bg-rich-black/90 backdrop-blur-md py-4 border-b border-white/10" : "bg-transparent py-6"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-serif font-bold text-white hover:text-luxury-gold transition-colors">
                    Tobias<span className="text-luxury-gold">.</span>
                </Link>

                {/* Menu Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs uppercase tracking-[0.2em] text-gray-300 hover:text-luxury-gold transition-colors font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Bouton Contact direct */}
                    <Link
                        href="/#contact"
                        className="ml-4 px-6 py-2 border border-luxury-gold text-luxury-gold text-xs font-bold uppercase tracking-widest rounded hover:bg-luxury-gold hover:text-black transition-all duration-300"
                    >
                        Contact
                    </Link>
                </div>

                {/* Bouton Mobile */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white text-2xl focus:outline-none"
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Menu Mobile avec animation simple */}
            {isOpen && (
                <div className="md:hidden bg-card-dark border-t border-gray-800 absolute w-full p-6 flex flex-col gap-6 shadow-2xl">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-luxury-gold text-sm uppercase tracking-widest"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/#contact"
                        onClick={() => setIsOpen(false)}
                        className="text-luxury-gold font-bold uppercase tracking-widest text-sm"
                    >
                        Me contacter
                    </Link>
                </div>
            )}
        </nav>
    );
}