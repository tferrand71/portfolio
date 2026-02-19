"use client";
import { motion } from "framer-motion";
import { FiDownload, FiMail } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
    return (
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
            {/* Effet de fond "Glow" */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-gold/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

                {/* Texte */}
                <motion.div
                    initial={{ opacity: 1, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-luxury-gold tracking-widest text-sm uppercase mb-4">
                        Étudiant / Développeur autodidacte
                    </p>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Tobias <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-yellow-700">
                            Ferrand
                        </span>
                    </h1>

                    {/* --- AJOUT : Tes liens sociaux rapides --- */}
                    <div className="flex gap-4 mb-8">
                        <a href="https://github.com/tferrand71" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                            <FaGithub /> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/tobias-ferrand-3a337b277" target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm">
                            <FaLinkedin /> LinkedIn
                        </a>
                    </div>
                    {/* ------------------------------------------ */}

                    <div className="flex flex-wrap gap-4">
                        <a href="/files/mon-cv.pdf" download className="px-6 py-3 bg-luxury-gold text-black font-bold rounded hover:bg-white transition-colors flex items-center gap-2">
                            <FiDownload /> Télécharger CV
                        </a>

                        {/* J'ai changé 'button' en 'a' pour que le scroll vers #contact fonctionne */}
                        <a href="#contact" className="px-6 py-3 border border-gray-700 text-white rounded hover:border-luxury-gold hover:text-luxury-gold transition-colors flex items-center gap-2">
                            <FiMail /> Me contacter
                        </a>
                    </div>
                </motion.div>

                {/* Cercle photo avec l'image */}
                <motion.div
                    initial={{ opacity: 1, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-luxury-gold/30 mx-auto flex items-center justify-center shadow-glow">
                        <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-card-dark overflow-hidden">
                            <img
                                src="/images/image.png"
                                alt="Logo de Tobias Ferrand"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}