"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaReact, FaGooglePlay, FaGithub, FaArrowRight } from "react-icons/fa";
import { SiFlutter } from "react-icons/si";

export default function FeaturedProjects() {
    return (
        <section className="py-20 px-6 bg-rich-black text-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-serif text-luxury-gold mb-12 border-l-4 border-luxury-gold pl-4">
                    Projets à la une
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* CARTE 1 : CLICKER */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-card-dark rounded-xl p-6 border border-gray-800 shadow-glow flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-serif">React Clicker</h3>
                                <div className="flex gap-2">
                                    <FaReact className="text-blue-400 text-xl" />
                                    <SiFlutter className="text-cyan-400 text-xl" />
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Un jeu incrémental addictif. Version Web optimisée et portage mobile natif via Flutter.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a href="https://tferrand71.github.io/IDEAStorm/" target="_blank" className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-center rounded text-sm transition-colors">
                                Jouer sur le Web
                            </a>
                            <a href="/downloads/clicker.apk" download className="w-full py-2 bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold text-center rounded text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                                <FaGooglePlay /> Télécharger l'App
                            </a>
                        </div>
                    </motion.div>

                    {/* CARTE 2 : MAKI */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-card-dark rounded-xl p-6 border border-gray-800 hover:border-gray-600 transition-colors flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-serif">Maki</h3>
                                <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full border border-purple-700">En cours</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-6">
                                Application de gestion de mangathèque personnelle développée en Flutter. Architecture clean et UI soignée.
                            </p>
                        </div>

                        <a href="#" className="w-full py-2 border border-gray-600 hover:border-luxury-gold hover:text-luxury-gold text-center rounded text-sm flex items-center justify-center gap-2 transition-all">
                            <FaGithub /> Voir le repo
                        </a>
                    </motion.div>

                    {/* CARTE 3 : VOIR TOUT */}
                    <Link href="/projets" className="group">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="h-full bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer group-hover:border-luxury-gold transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-luxury-gold group-hover:text-black transition-colors">
                                <FaArrowRight className="text-xl" />
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">Voir tous mes projets</h3>
                            <p className="text-center text-gray-500 text-sm group-hover:text-gray-300">
                                Explorez l'intégralité de mon portfolio
                            </p>
                        </motion.div>
                    </Link>

                </div>
            </div>
        </section>
    );
}