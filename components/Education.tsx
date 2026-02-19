export default function Education() {
    return (
        <section className="py-20 bg-rich-black">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-4xl font-serif text-luxury-gold mb-16 border-l-4 border-luxury-gold pl-4">
                    Parcours & Formation
                </h2>

                <div className="relative border-l border-gray-800 ml-4 md:ml-0 space-y-12">

                    {/* Item 1 */}
                    <div className="relative pl-8 md:pl-12">
                        <span className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-luxury-gold shadow-[0_0_10px_#D4AF37]"></span>
                        <span className="text-sm text-luxury-gold-dim font-bold tracking-widest">2024 - 2026</span>
                        <h3 className="text-2xl font-bold text-white mt-1">BTS SIO - Option SLAM</h3>
                        <p className="text-gray-500 italic mb-4">Lycée Saint Luc, Cambrai (59)</p>
                        <p className="text-gray-400">
                            Actuellement en 2ème année. Formation complète en développement d'applications, bases de données, et gestion de projets.
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div className="relative pl-8 md:pl-12">
                        <span className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-gray-600"></span>
                        <span className="text-sm text-gray-500 font-bold tracking-widest">2025 - EN COURS</span>
                        <h3 className="text-2xl font-bold text-white mt-1">Auto-formation JavaScript & Android</h3>
                        <p className="text-gray-500 italic mb-4">Autonomie</p>
                        <p className="text-gray-400">
                            Découverte parallèle du développement mobile avec Android Studio et Java. Objectif : maîtriser ces technologies pour élargir mes possibilités.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}