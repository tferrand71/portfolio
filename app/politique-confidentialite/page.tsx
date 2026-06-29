"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function PolitiqueConfidentialite() {
    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden text-[var(--color-text-main)]">
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed bottom-0 right-1/4 w-[40vw] h-[40vw] bg-[var(--color-pink)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />
            
            <Navbar />
            
            <div className="pt-40 pb-20 max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[var(--color-text-main)]">
                        Politique de <span className="text-gradient-energetic">Confidentialité</span>
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
                            1. Collecte des données personnelles
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed mb-4">
                            Dans le cadre de l'utilisation de ce site (portfolio), nous ne collectons aucune donnée personnelle à votre insu. Les seules données collectées sont celles que vous nous communiquez volontairement (par exemple, en envoyant un e-mail à l'adresse de contact).
                        </p>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed">
                            <strong className="text-[var(--color-text-main)]">Finalité :</strong> Les informations transmises par e-mail sont utilisées uniquement dans le but de répondre à vos demandes (contact professionnel, proposition de mission, etc.).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 border-b border-[var(--color-glass-border)] pb-4 uppercase tracking-widest">
                            2. Partage et revente des données
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed">
                            Nous nous engageons à ne <strong className="text-[var(--color-text-main)]">jamais</strong> vendre, céder ou louer vos données personnelles à des tiers. Vos informations de contact restent strictement confidentielles et réservées à un usage interne professionnel.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 border-b border-[var(--color-glass-border)] pb-4 uppercase tracking-widest">
                            3. Utilisation des cookies
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed">
                            Ce site a été conçu pour respecter votre vie privée au maximum. Il n'utilise aucun cookie publicitaire ou de traçage commercial. Les seuls "cookies" ou stockages locaux qui pourraient être utilisés sont d'ordre strictement technique (fonctionnement interne du site, mémorisation de préférences locales temporaires). Par conséquent, aucun bandeau de consentement n'est requis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-serif font-bold text-[var(--color-gold)] mb-4 border-b border-[var(--color-glass-border)] pb-4 uppercase tracking-widest">
                            4. Vos droits (RGPD)
                        </h2>
                        <p className="text-[var(--color-text-muted)] font-light leading-relaxed mb-4">
                            Conformément à la réglementation européenne (RGPD) et à la loi française "Informatique et Libertés", vous disposez des droits suivants concernant vos données personnelles (notamment celles envoyées par e-mail) :
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-[var(--color-text-muted)] font-light">
                            <li><strong className="text-[var(--color-text-main)]">Droit d'accès :</strong> vous pouvez demander à consulter les données vous concernant.</li>
                            <li><strong className="text-[var(--color-text-main)]">Droit de rectification :</strong> vous pouvez demander la mise à jour de vos données.</li>
                            <li><strong className="text-[var(--color-text-main)]">Droit à l'effacement :</strong> vous pouvez demander la suppression de nos échanges.</li>
                        </ul>
                        <p className="mt-6 text-[var(--color-text-muted)] font-light leading-relaxed">
                            Pour exercer ces droits, vous pouvez me contacter à l'adresse suivante : <a href="mailto:tobias.ferrand@proton.me" className="text-[var(--color-mauve)] hover:text-[var(--color-gold)] transition-colors">tobias.ferrand@proton.me</a>.
                        </p>
                    </section>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
