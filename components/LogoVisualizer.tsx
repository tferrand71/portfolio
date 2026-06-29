"use client";
import { motion } from "framer-motion";

export default function LogoVisualizer() {
    return (
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center mt-10 md:mt-0 z-10">
            {/* Halo 1 : Large, doux, tourne et respire lentement */}
            <motion.div 
                animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 360]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-tr from-[var(--color-mauve)] via-[var(--color-pink)] to-transparent rounded-full blur-[30px] md:blur-[40px] opacity-50 pointer-events-none" 
            />

            {/* Halo 2 : Plus concentré, pulse au rythme de la musique */}
            <motion.div 
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-gradient-to-bl from-[var(--color-pink)] to-[var(--color-mauve)] rounded-full blur-[20px] md:blur-[25px] pointer-events-none" 
            />

            {/* Halo 3 : Aura très proche qui vibre de manière dynamique (kick/bass) */}
            <motion.div 
                animate={{
                    scale: [1, 1.08, 1, 1.04, 1],
                    opacity: [0.6, 1, 0.7, 0.9, 0.6]
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "anticipate"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-[var(--color-mauve)] rounded-full blur-[10px] md:blur-[15px] pointer-events-none" 
            />

            {/* Cercle central contenant l'image */}
            <div className="relative z-10 w-[82%] h-[82%] rounded-full border-[2px] border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center p-2 bg-[var(--color-glass)] backdrop-blur-xl">
                <div className="w-full h-full rounded-full bg-[#1A1825] overflow-hidden border border-white/10 relative">
                    {/* Filtre assombrissant pour bien voir les couleurs */}
                    <div className="absolute inset-0 bg-black/20 z-10 rounded-full" />
                    <img
                        src="/images/image.png"
                        alt="Logo de Tobias Ferrand"
                        className="w-full h-full object-cover mix-blend-screen opacity-90 relative z-0"
                    />
                </div>
            </div>
        </div>
    );
}
