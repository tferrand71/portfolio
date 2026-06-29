"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaLaptopCode, FaMusic, FaCoffee, FaCodeBranch } from "react-icons/fa";
import { useRef } from "react";

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [50, -150]);
    const y4 = useTransform(scrollYProgress, [0, 1], [100, -80]);

    return (
        <section id="about" ref={containerRef} className="py-32 w-full relative overflow-hidden bg-transparent">
            {/* Ambient Background Glow */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.1, 0.25, 0.1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-0 w-[50vw] h-[50vw] bg-[var(--color-gold)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />

            <div className="w-full px-6 lg:px-24 xl:px-32 relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center lg:items-stretch">
                    
                    {/* Left content: Typography & Glass Panel */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:w-7/12 relative z-20"
                    >
                        <div className="glass-panel p-10 md:p-16 rounded-[2rem] border-t border-l border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                            {/* Inner subtle glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-mauve)]/10 blur-[60px] rounded-full pointer-events-none" />
                            
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-8 leading-tight relative z-10">
                                Salut ! Moi c'est <br/>
                                <span className="text-gradient-energetic">Tobias Ferrand.</span>
                            </h2>

                            <div className="space-y-6 text-[var(--color-text-muted)] text-lg font-light leading-relaxed relative z-10">
                                <p>
                                    J'ai 19 ans. Après avoir obtenu mon BTS Services Informatiques aux Organisations (option SLAM) le 29 juin 2026, j'intègre l'école EPSI Arras pour l'année 2026-2027, en alternance au sein de l'entreprise Affutis.
                                </p>
                                <p>
                                    J'ai une base solide en HTML et CSS, et j'apprends actuellement le JavaScript en autodidacte. Je découvre aussi le développement mobile avec Android Studio.
                                </p>
                                <p>
                                    Musicien dans un orchestre d'harmonie, j'ai créé le site web de notre ensemble, mon premier vrai projet qui m'a permis de mettre en pratique mes compétences et de lier mes deux passions.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right content: Asymmetrical Scattered Stats */}
                    <div className="lg:w-5/12 relative w-full min-h-[400px] lg:min-h-0 flex items-center justify-center lg:block mt-12 lg:mt-0">
                        <div className="relative w-full h-full max-w-md mx-auto">
                            {/* Card 1 - Fullstack */}
                            <motion.div 
                                style={{ y: y1 }}
                                className="absolute top-0 left-0 lg:-left-12 w-48 glass-panel p-5 rounded-2xl border border-[var(--color-glass-border)] shadow-xl hover:border-[var(--color-gold)]/50 transition-colors z-30"
                            >
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-3">
                                    <FaLaptopCode className="text-xl text-[var(--color-gold)]" />
                                </div>
                                <h4 className="text-base font-semibold text-[var(--color-text-main)] font-serif mb-1">Étudiant SIO</h4>
                                <p className="text-[var(--color-text-muted)] font-light text-xs">Option SLAM (Dev)</p>
                            </motion.div>

                            {/* Card 2 - Musique */}
                            <motion.div 
                                style={{ y: y2 }}
                                className="absolute top-24 right-0 lg:-right-8 w-56 glass-panel p-5 rounded-2xl border border-[var(--color-glass-border)] shadow-xl hover:border-[var(--color-pink)]/50 transition-colors z-20"
                            >
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-3">
                                    <FaMusic className="text-xl text-[var(--color-pink)]" />
                                </div>
                                <h4 className="text-base font-semibold text-[var(--color-text-main)] font-serif mb-1">Musicien</h4>
                                <p className="text-[var(--color-text-muted)] font-light text-xs">Orchestre d'harmonie</p>
                            </motion.div>

                            {/* Card 3 - Autodidacte */}
                            <motion.div 
                                style={{ y: y3 }}
                                className="absolute top-52 left-8 lg:left-4 w-52 glass-panel p-5 rounded-2xl border border-[var(--color-glass-border)] shadow-xl hover:border-[var(--color-red)]/50 transition-colors z-10"
                            >
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-3">
                                    <FaCodeBranch className="text-xl text-[var(--color-red)]" />
                                </div>
                                <h4 className="text-base font-semibold text-[var(--color-text-main)] font-serif mb-1">Autodidacte</h4>
                                <p className="text-[var(--color-text-muted)] font-light text-xs">JavaScript & Android</p>
                            </motion.div>

                            {/* Card 4 - Pratique */}
                            <motion.div 
                                style={{ y: y4 }}
                                className="absolute top-80 right-12 lg:-right-4 w-44 glass-panel p-5 rounded-2xl border border-[var(--color-glass-border)] shadow-xl hover:border-[var(--color-gold)]/50 transition-colors z-40"
                            >
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-3">
                                    <FaCoffee className="text-xl text-[var(--color-gold)]" />
                                </div>
                                <h4 className="text-base font-semibold text-[var(--color-text-main)] font-serif mb-1">Mise en pratique</h4>
                                <p className="text-[var(--color-text-muted)] font-light text-xs">Projets concrets</p>
                            </motion.div>

                            {/* Card 5 - EPSI Arras */}
                            <motion.div 
                                style={{ y: y1 }}
                                className="absolute top-[26rem] left-0 lg:-left-8 w-56 glass-panel p-5 rounded-2xl border border-[var(--color-glass-border)] shadow-xl hover:border-[var(--color-mauve)]/50 transition-colors z-50"
                            >
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center mb-3">
                                    <FaLaptopCode className="text-xl text-[var(--color-mauve)]" />
                                </div>
                                <h4 className="text-base font-semibold text-[var(--color-text-main)] font-serif mb-1">Dev Fullstack</h4>
                                <p className="text-[var(--color-text-muted)] font-light text-xs">Alternance EPSI Arras</p>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}