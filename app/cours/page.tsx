import Navbar from "@/components/Navbar";

export default function Cours() {
    return (
        <main className="min-h-screen bg-rich-black text-white">
            <Navbar />
            <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
                <h1 className="text-5xl font-serif text-white mb-12">
                    Mes Cours <span className="text-luxury-gold">BTS SIO</span>
                </h1>

                <div className="space-y-12">
                    {/* 2ème Année */}
                    <div>
                        <h2 className="text-2xl font-serif text-luxury-gold mb-6 flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-luxury-gold"></span> 2ème Année
                        </h2>
                        <div className="grid gap-4">
                            <div className="bg-card-dark p-6 rounded border border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">Programmation Web</h3>
                                <p className="text-gray-400">Principes avancés en HTML/CSS, JavaScript et notions de sécurité web.</p>
                            </div>
                            <div className="bg-card-dark p-6 rounded border border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">Base de données</h3>
                                <p className="text-gray-400">Conception de schémas, SQL avancé, transactions et intégrité.</p>
                            </div>
                        </div>
                    </div>

                    {/* 1ère Année */}
                    <div>
                        <h2 className="text-2xl font-serif text-gray-500 mb-6 flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-gray-600"></span> 1ère Année
                        </h2>
                        <div className="grid gap-4 opacity-75 hover:opacity-100 transition-opacity">
                            <div className="bg-card-dark p-6 rounded border border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">Algorithmique (Python)</h3>
                                <p className="text-gray-400">Bases de la programmation, structures de contrôle et fonctions.</p>
                            </div>
                            <div className="bg-card-dark p-6 rounded border border-gray-800">
                                <h3 className="text-xl font-bold text-white mb-2">Systèmes & Réseaux</h3>
                                <p className="text-gray-400">OS, réseaux locaux, configuration de base.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}