"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { name: "Accueil", href: "/" },
        { name: "Veille", href: "/veille" },
        { name: "Cours", href: "/cours" },
        { name: "Projets", href: "/projets" },
        { name: "Ressources", href: "/ressources" },
    ];

    return (
        <div className={`fixed top-0 w-full z-50 flex justify-center transition-all duration-500 pointer-events-none ${scrolled ? "mt-6 px-4" : "mt-0 px-0"}`}>
            {/* Navbar Container */}
            <motion.nav
                initial={false}
                animate={{
                    width: scrolled || isOpen ? (isOpen ? "100%" : "auto") : "100%",
                    maxWidth: scrolled || isOpen ? (isOpen ? "400px" : "800px") : "1280px",
                    borderRadius: scrolled || isOpen ? (isOpen ? "2rem" : "9999px") : "0px",
                    backgroundColor: scrolled || isOpen ? "rgba(19, 17, 28, 0.85)" : "transparent",
                    backdropFilter: scrolled || isOpen ? "blur(20px)" : "none",
                    border: scrolled || isOpen ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                    boxShadow: scrolled || isOpen ? "0 8px 32px rgba(0,0,0,0.5)" : "none",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`pointer-events-auto overflow-hidden flex flex-col ${!scrolled && !isOpen ? 'py-4' : ''}`}
            >
                {/* Top Bar (Always visible) */}
                <div className={`flex items-center justify-between transition-all duration-300 ${scrolled || isOpen ? "px-6 py-3 min-w-[300px] md:min-w-[600px]" : "px-6 py-2 w-full"}`}>
                    {/* Logo */}
                    <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-[var(--color-text-main)] hover:text-[var(--color-gold)] transition-colors" onClick={() => setIsOpen(false)}>
                        Tobias<span className="text-[var(--color-gold)]">.</span>
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center gap-6 md:gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors font-bold ${scrolled || isOpen ? "text-[10px]" : "text-xs"}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <Link
                            href="/contact"
                            className={`ml-2 border border-[var(--color-gold)] text-[var(--color-gold)] font-bold uppercase tracking-widest rounded-full hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 ${scrolled || isOpen ? "px-4 py-1.5 text-[10px]" : "px-6 py-2 text-xs"}`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Bouton Mobile */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-[var(--color-text-main)] text-2xl focus:outline-none p-2 -mr-2"
                    >
                        {isOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Expanded Menu Mobile (Dynamic Island Expansion) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4 border-t border-white/5"
                        >
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-[var(--color-text-muted)] hover:text-[var(--color-gold)] text-xs uppercase tracking-[0.2em] font-bold text-center py-2"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 w-full text-center px-4 py-3 bg-[var(--color-gold)] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all duration-300"
                            >
                                Me contacter
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
}