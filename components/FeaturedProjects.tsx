"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaReact } from "react-icons/fa";
import Link from "next/link";
import { SiFlutter, SiReact } from "react-icons/si";
import { useRef } from "react";

export default function FeaturedProjects() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const yParallaxReverse = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    return (
        <section id="projects" ref={sectionRef} className="py-24 w-full relative overflow-hidden bg-transparent">
            {/* Ambient Background Glows */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/3 left-1/4 w-[50vw] h-[50vw] bg-[var(--color-gold)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
                className="absolute bottom-1/3 right-1/4 w-[60vw] h-[60vw] bg-[var(--color-mauve)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />

            <div className="w-full px-6 lg:px-12 xl:px-24 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20 max-w-2xl mx-auto text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-4 tracking-tight">
                        Projets <span className="text-gradient-energetic">Récents.</span>
                    </h2>
                    <p className="text-[var(--color-text-muted)] text-lg font-light leading-relaxed">
                        Une sélection de mes travaux récents, alliant design moderne et architectures solides.
                    </p>
                </motion.div>

                <div className="space-y-32">
                    {/* Projet 1 - Immersive Banner */}
                    <div className="relative group rounded-3xl overflow-hidden border border-[var(--color-glass-border)] bg-[var(--color-glass)]/20 backdrop-blur-sm">
                        <div className="flex flex-col lg:flex-row min-h-[500px]">
                            {/* Text Content */}
                            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative z-20">
                                <motion.div 
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-[1px] bg-[var(--color-gold)]" />
                                        <span className="text-[var(--color-gold)] font-mono text-sm tracking-[0.2em] uppercase font-bold">01 / React</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-6 group-hover:text-[var(--color-gold)] transition-colors duration-500">
                                        React Clicker
                                    </h3>
                                    <p className="text-[var(--color-text-muted)] text-base font-light leading-relaxed mb-8 max-w-lg">
                                        Un jeu de clicker incrémental développé pour apprendre React et le state management complexe. L'interface a été conçue pour être addictive et extrêmement réactive avec de riches micro-animations.
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <a href="/ideastorm/index.html" target="_blank" className="flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-bold border border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] shadow-[0_0_20px_-5px_var(--color-gold)]">
                                            <FaExternalLinkAlt /> Jouer
                                        </a>
                                    </div>
                                </motion.div>
                            </div>
                            
                            {/* Visual Content - Parallax */}
                            <div className="lg:w-1/2 relative overflow-hidden flex items-center justify-center p-10 bg-gradient-to-br from-black/40 to-black/80">
                                <div className="absolute inset-0 bg-[var(--color-gold)]/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                                <motion.div 
                                    style={{ y: yParallax }}
                                    className="relative z-20 w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-black/50 backdrop-blur-md group-hover:border-[var(--color-gold)]/50 transition-colors duration-500"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                        <SiReact className="text-8xl text-gray-700 group-hover:text-[var(--color-gold)] transition-colors duration-500 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]" />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Projet 2 - Immersive Banner Reversed */}
                    <div className="relative group rounded-3xl overflow-hidden border border-[var(--color-glass-border)] bg-[var(--color-glass)]/20 backdrop-blur-sm">
                        <div className="flex flex-col lg:flex-row-reverse min-h-[500px]">
                            {/* Text Content */}
                            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative z-20">
                                <motion.div 
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="lg:pl-12"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-[1px] bg-[var(--color-mauve)]" />
                                        <span className="text-[var(--color-mauve)] font-mono text-sm tracking-[0.2em] uppercase font-bold">02 / Flutter</span>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-6 group-hover:text-[var(--color-mauve)] transition-colors duration-500">
                                        Maki App
                                    </h3>
                                    <p className="text-[var(--color-text-muted)] text-base font-light leading-relaxed mb-8 max-w-lg">
                                        Application de gestion de mangathèque personnelle développée en Flutter. Architecture clean et UI soignée pour une expérience utilisateur premium sur mobile.
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <a href="https://github.com/tferrand71/MakiApp.git" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--color-mauve)]/10 text-[var(--color-mauve)] hover:bg-[var(--color-mauve)] hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold border border-[var(--color-mauve)]/30 hover:border-[var(--color-mauve)] shadow-[0_0_20px_-5px_var(--color-mauve)]">
                                            <FaGithub className="text-lg" /> Code Source
                                        </a>
                                        <>
                                            <FaReact className="text-xl" />
                                            <SiFlutter className="text-xl" />
                                        </>
                                    </div>
                                </motion.div>
                            </div>
                            
                            {/* Visual Content - Parallax */}
                            <div className="lg:w-1/2 relative overflow-hidden flex items-center justify-center p-10 bg-gradient-to-bl from-black/40 to-black/80">
                                <div className="absolute inset-0 bg-[var(--color-mauve)]/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10" />
                                <motion.div 
                                    style={{ y: yParallaxReverse }}
                                    className="relative z-20 w-full aspect-[9/16] max-w-[280px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-black/50 backdrop-blur-md group-hover:border-[var(--color-mauve)]/50 transition-colors duration-500"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                        <SiFlutter className="text-8xl text-gray-700 group-hover:text-[var(--color-mauve)] transition-colors duration-500 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]" />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 text-center"
                >
                    <Link href="/projets" className="inline-flex items-center gap-3 px-10 py-5 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] backdrop-blur-md text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-black transition-all duration-300 text-sm uppercase tracking-[0.2em] font-bold shadow-xl">
                        Voir tous les travaux <FaExternalLinkAlt className="text-xs" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}