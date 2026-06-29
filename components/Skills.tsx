"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
    SiReact, SiNextdotjs, SiTailwindcss, SiTypescript,
    SiPhp, SiLaravel, SiMysql, SiFirebase, SiNodedotjs,
    SiGit, SiDocker, SiAndroid
} from "react-icons/si";

export default function Skills() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yParallax1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const yParallax2 = useTransform(scrollYProgress, [0, 1], [50, -150]);
    const yParallax3 = useTransform(scrollYProgress, [0, 1], [-50, 100]);

    const allSkills = [
        { name: "React", icon: <SiReact />, color: "var(--color-gold)", scale: 1.1, parallax: yParallax1, delay: 0 },
        { name: "Next.js", icon: <SiNextdotjs />, color: "var(--color-gold)", scale: 1, parallax: yParallax2, delay: 0.1 },
        { name: "TypeScript", icon: <SiTypescript />, color: "var(--color-gold)", scale: 0.9, parallax: yParallax3, delay: 0.2 },
        { name: "Tailwind", icon: <SiTailwindcss />, color: "var(--color-gold)", scale: 1, parallax: yParallax1, delay: 0.3 },
        { name: "PHP", icon: <SiPhp />, color: "var(--color-red)", scale: 1.2, parallax: yParallax3, delay: 0.4 },
        { name: "Laravel", icon: <SiLaravel />, color: "var(--color-red)", scale: 1.1, parallax: yParallax1, delay: 0.5 },
        { name: "Node.js", icon: <SiNodedotjs />, color: "var(--color-red)", scale: 0.9, parallax: yParallax2, delay: 0.6 },
        { name: "MySQL", icon: <SiMysql />, color: "var(--color-red)", scale: 1, parallax: yParallax3, delay: 0.7 },
        { name: "Firebase", icon: <SiFirebase />, color: "var(--color-red)", scale: 0.9, parallax: yParallax1, delay: 0.8 },
        { name: "Git", icon: <SiGit />, color: "var(--color-mauve)", scale: 1, parallax: yParallax2, delay: 0.9 },
        { name: "Docker", icon: <SiDocker />, color: "var(--color-mauve)", scale: 1.1, parallax: yParallax3, delay: 1.0 },
        { name: "Android", icon: <SiAndroid />, color: "var(--color-mauve)", scale: 1.2, parallax: yParallax1, delay: 1.1 },
    ];

    // Shuffling the array for a more scattered look, or hardcode positions
    // Let's use a flex-wrap with random looking margins via specific classes to ensure it's responsive
    const margins = [
        "mt-8 md:mt-12", "mb-10 md:mb-16", "mt-4 md:-mt-8", "mb-6 md:mb-20", 
        "mt-12 md:mt-24", "mb-4 md:-mb-12", "mt-2 md:mt-6", "mb-12 md:mb-8",
        "mt-16 md:mt-32", "mb-2 md:mb-10", "mt-6 md:-mt-4", "mb-8 md:mb-14"
    ];

    return (
        <section id="skills" ref={containerRef} className="py-32 w-full relative overflow-hidden bg-transparent border-t border-[var(--color-glass-border)]">
            {/* Ambient Glow */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-[var(--color-mauve)]/10 rounded-full blur-[120px] -z-10 pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.1, 0.25, 0.1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-[var(--color-gold)]/10 rounded-full blur-[150px] -z-10 pointer-events-none"
            />

            <div className="w-full px-6 lg:px-24 xl:px-32 relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-24 text-center max-w-2xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-6 tracking-tight">
                        Mon <span className="text-gradient-energetic">Arsenal.</span>
                    </h2>
                    <p className="text-[var(--color-text-muted)] text-lg font-light leading-relaxed">
                        Un éventail technologique maîtrisé et en constante évolution, choisi pour construire des expériences fluides et scalables.
                    </p>
                </motion.div>

                {/* Asymmetrical Floating Cloud */}
                <div className="relative w-full min-h-[500px] flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-10 py-10">
                    {allSkills.map((skill, index) => (
                        <motion.div
                            key={index}
                            style={{ y: skill.parallax }}
                            className={`relative ${margins[index % margins.length]}`}
                        >
                            {/* Floating Animation Wrapper */}
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotate: [0, index % 2 === 0 ? 3 : -3, 0]
                                }}
                                transition={{
                                    duration: 6 + (index % 4),
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: skill.delay
                                }}
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.15, rotate: 0 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-3 px-6 py-4 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-colors cursor-pointer group"
                                    style={{ 
                                        '--hover-color': skill.color,
                                        transform: `scale(${skill.scale})`
                                    } as any}
                                >
                                    <div className="text-[var(--color-text-muted)] group-hover:text-[var(--hover-color)] transition-colors text-2xl drop-shadow-lg group-hover:drop-shadow-[0_0_15px_var(--hover-color)]">
                                        {skill.icon}
                                    </div>
                                    <span className="text-sm md:text-base font-medium text-[var(--color-text-main)] group-hover:text-white transition-colors">
                                        {skill.name}
                                    </span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}