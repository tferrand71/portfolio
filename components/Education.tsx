"use client";
import { motion } from "framer-motion";

export default function Education() {
    return (
        <section id="education" className="py-24 w-full relative overflow-hidden bg-transparent">
            {/* Ambient Glow */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1], 
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute top-1/4 left-1/2 w-[30vw] h-[30vw] bg-[var(--color-pink)]/10 rounded-full blur-[100px] -z-10 pointer-events-none"
            />

            <div className="w-full px-6 lg:px-12 xl:px-24 relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-24 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-4 tracking-tight">
                        Parcours & <span className="text-gradient-energetic">Formation.</span>
                    </h2>
                </motion.div>

                {/* Central Luminous Timeline */}
                <div className="relative">
                    {/* The Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-gold)] via-[var(--color-pink)] to-transparent -translate-x-1/2 opacity-30 blur-[1px]" />
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--color-gold)] via-[var(--color-pink)] to-transparent -translate-x-1/2" />

                    <div className="space-y-24">
                        {/* Item 1 - EPSI */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between group">
                            {/* Marker */}
                            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-mauve)] shadow-[0_0_15px_var(--color-mauve)] -translate-x-1/2 z-20 group-hover:scale-150 transition-transform duration-500" />
                            
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className="w-full md:w-[45%] pl-12 md:pl-0 md:text-right"
                            >
                                <span className="text-[var(--color-mauve)] font-mono text-xs tracking-widest uppercase font-bold block mb-2">2026 - 2027</span>
                                <div className="glass-panel p-8 rounded-2xl group-hover:border-[var(--color-mauve)]/50 transition-colors duration-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-mauve)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-2 group-hover:text-[var(--color-mauve)] transition-colors duration-300 relative z-10">École EPSI Arras</h3>
                                    <p className="text-[var(--color-text-muted)] font-medium text-sm mb-4 relative z-10">Alternance chez Affutis</p>
                                    <p className="text-[var(--color-text-muted)] text-sm font-light leading-relaxed relative z-10">
                                        Poursuite de mes études en alternance pour approfondir mes compétences en ingénierie informatique et développement au sein de l'entreprise Affutis.
                                    </p>
                                </div>
                            </motion.div>
                            
                            <div className="hidden md:block w-[45%]" />
                        </div>

                        {/* Item 2 - BTS */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between group">
                            {/* Marker */}
                            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-gold)] shadow-[0_0_15px_var(--color-gold)] -translate-x-1/2 z-20 group-hover:scale-150 transition-transform duration-500" />
                            
                            <div className="hidden md:block w-[45%]" />
                            
                            <motion.div 
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className="w-full md:w-[45%] pl-12 md:pl-0"
                            >
                                <span className="text-[var(--color-gold)] font-mono text-xs tracking-widest uppercase font-bold block mb-2">2024 - 2026</span>
                                <div className="glass-panel p-8 rounded-2xl group-hover:border-[var(--color-gold)]/50 transition-colors duration-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-bl from-[var(--color-gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-2 group-hover:text-[var(--color-gold)] transition-colors duration-300 relative z-10">BTS SIO - Option SLAM</h3>
                                    <p className="text-[var(--color-text-muted)] font-medium text-sm mb-4 relative z-10">Lycée Saint Luc, Cambrai</p>
                                    <p className="text-[var(--color-text-muted)] text-sm font-light leading-relaxed relative z-10">
                                        Diplôme obtenu le 29 juin 2026. Formation en développement d'applications, bases de données et gestion de projets.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Item 3 - Auto-formation */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between group">
                            {/* Marker */}
                            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-pink)] shadow-[0_0_15px_var(--color-pink)] -translate-x-1/2 z-20 group-hover:scale-150 transition-transform duration-500" />
                            
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className="w-full md:w-[45%] pl-12 md:pl-0 md:text-right"
                            >
                                <span className="text-[var(--color-pink)] font-mono text-xs tracking-widest uppercase font-bold block mb-2">EN CONTINU</span>
                                <div className="glass-panel p-8 rounded-2xl group-hover:border-[var(--color-pink)]/50 transition-colors duration-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-pink)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-2 group-hover:text-[var(--color-pink)] transition-colors duration-300 relative z-10">Auto-formation JS & Android</h3>
                                    <p className="text-[var(--color-text-muted)] font-medium text-sm mb-4 relative z-10">Autonomie</p>
                                    <p className="text-[var(--color-text-muted)] text-sm font-light leading-relaxed relative z-10">
                                        Découverte parallèle du développement mobile avec Android Studio et approfondissement de JavaScript.
                                    </p>
                                </div>
                            </motion.div>
                            
                            <div className="hidden md:block w-[45%]" />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}