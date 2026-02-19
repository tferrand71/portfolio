"use client";
import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="py-24 bg-rich-black relative">
            <div className="max-w-4xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl font-serif text-luxury-gold mb-12 border-l-4 border-luxury-gold pl-4"
                >
                    À propos de moi
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-gray-400 leading-relaxed">
                        <p>
                            Salut ! Moi c'est Tobias, j'ai 19 ans et je suis étudiant en 2ème année de
                            <strong className="text-white"> BTS Services Informatiques aux Organisations</strong>, option SLAM au Lycée Saint Luc à Cambrai.
                        </p>
                        <p>
                            J'ai une base solide en HTML et CSS, et j'apprends actuellement le <span className="text-luxury-gold">JavaScript</span> en autodidacte.
                            Je découvre aussi le développement mobile avec Android Studio.
                        </p>
                        <p>
                            Musicien dans un orchestre d'harmonie, j'ai créé le site web de notre ensemble,
                            mon premier vrai projet qui m'a permis de mettre en pratique mes compétences.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { number: "19", label: "Ans" },
                            { number: "2ème", label: "Année BTS" },
                            { number: "100%", label: "Motivation" },
                            { number: "1", label: "Orchestre" },
                        ].map((stat, index) => (
                            <div key={index} className="bg-card-dark p-6 rounded-lg border border-gray-800 text-center hover:border-luxury-gold/50 transition-colors">
                                <div className="text-3xl font-serif text-luxury-gold font-bold mb-1">{stat.number}</div>
                                <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}