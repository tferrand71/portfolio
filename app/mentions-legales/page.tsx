"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function MentionsLegales() {
    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden text-[var(--color-text-main)]">
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-1/2 left-1/4 w-[40vw] h-[40vw] bg-[var(--color-mauve)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            
            <Navbar />
            
            <div className="pt-40 pb-20 max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[var(--color-text-main)]">
                        Mentions <span className="text-gradient-energetic">Légales</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-8 md:p-12 rounded-3xl space-y-12"
                >
                    <section>
                        <h2 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 border-b border-[var(--color-glass-border)] pb-4 uppercase tracking-widest">
                            1. Éditeur du site
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed">
                            Ce site est édité et géré par <strong>Tobias Ferrand</strong>, domicilié à Roisel, Hauts-de-France, France.
                        </p>
                        <ul className="mt-4 space-y-2 text-[var(--color-text-muted)] font-light">
                            <li><strong className="text-[var(--color-text-main)]">Email de contact :</strong> <a href="mailto:tobias.ferrand@proton.me" className="text-[var(--color-mauve)] hover:text-[var(--color-gold)] transition-colors">tobias.ferrand@proton.me</a></li>
                            <li><strong className="text-[var(--color-text-main)]">Site internet :</strong> tobias-ferrand.ovh</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 border-b border-[var(--color-glass-border)] pb-4 uppercase tracking-widest">
                            2. Hébergement
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed mb-4">
                            L'hébergement de ce site web est assuré par <strong>Vercel Inc.</strong>
                        </p>
                        <ul className="space-y-2 text-[var(--color-text-muted)] font-light">
                            <li><strong className="text-[var(--color-text-main)]">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
                            <li><strong className="text-[var(--color-text-main)]">Site internet :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-mauve)] hover:text-[var(--color-gold)] transition-colors">https://vercel.com</a></li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 border-b border-[var(--color-glass-border)] pb-4 uppercase tracking-widest">
                            3. Propriété intellectuelle
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed">
                            L'ensemble du contenu de ce site (textes, images, code source, design) est la propriété exclusive de Tobias Ferrand, sauf mention contraire. Toute reproduction, distribution, modification ou utilisation, même partielle, sans accord préalable écrit, est strictement interdite et passible de poursuites légales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 border-b border-[var(--color-glass-border)] pb-4 uppercase tracking-widest">
                            4. Responsabilité
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed">
                            L'éditeur met tout en œuvre pour diffuser des informations exactes et tenues à jour. Toutefois, il ne saurait être tenu pour responsable d'éventuelles erreurs, d'une absence de disponibilité des informations ou de la présence de virus sur son site. Les liens hypertextes mis en place dans le cadre du présent site en direction d'autres ressources sur le réseau Internet ne sauraient engager la responsabilité de l'éditeur.
                        </p>
                    </section>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
