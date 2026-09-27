"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { projects } from "@/data/projects";

// Les classes Tailwind doivent être écrites en toutes lettres pour être détectées
// au build : on décline donc un thème complet par accent plutôt que de les composer.
const themes = [
    {
        label: "text-[var(--color-gold)]",
        rule: "bg-[var(--color-gold)]",
        title: "group-hover:text-[var(--color-gold)]",
        button: "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)] hover:text-black hover:border-[var(--color-gold)] shadow-[0_0_20px_-5px_var(--color-gold)]",
        overlay: "bg-[var(--color-gold)]/5",
        frame: "group-hover:border-[var(--color-gold)]/50",
        icon: "group-hover:text-[var(--color-gold)] drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]",
    },
    {
        label: "text-[var(--color-mauve)]",
        rule: "bg-[var(--color-mauve)]",
        title: "group-hover:text-[var(--color-mauve)]",
        button: "bg-[var(--color-mauve)]/10 text-[var(--color-mauve)] border-[var(--color-mauve)]/30 hover:bg-[var(--color-mauve)] hover:text-white hover:border-[var(--color-mauve)] shadow-[0_0_20px_-5px_var(--color-mauve)]",
        overlay: "bg-[var(--color-mauve)]/5",
        frame: "group-hover:border-[var(--color-mauve)]/50",
        icon: "group-hover:text-[var(--color-mauve)] drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]",
    },
];

export default function FeaturedProjects() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yParallax = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const yParallaxReverse = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    const featured = projects.filter((p) => p.featured);

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
                    {featured.map((project, index) => {
                        const theme = themes[index % themes.length];
                        const reversed = index % 2 === 1;
                        const cover = project.gallery?.[0];
                        const isMobile = project.category.toLowerCase().includes("mobile");

                        return (
                            <div
                                key={project.id}
                                className="relative group rounded-3xl overflow-hidden border border-[var(--color-glass-border)] bg-[var(--color-glass)]/20 backdrop-blur-sm"
                            >
                                <div className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} min-h-[500px]`}>
                                    {/* Text Content */}
                                    <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative z-20">
                                        <motion.div
                                            initial={{ opacity: 0, x: reversed ? 50 : -50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={reversed ? "lg:pl-12" : ""}
                                        >
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`w-12 h-[1px] ${theme.rule}`} />
                                                <span className={`${theme.label} font-mono text-sm tracking-[0.2em] uppercase font-bold`}>
                                                    {String(index + 1).padStart(2, "0")} / {project.category}
                                                </span>
                                                {project.status && (
                                                    <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-[var(--color-glass-border)] text-[var(--color-text-muted)]">
                                                        {project.status}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className={`text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-6 ${theme.title} transition-colors duration-500`}>
                                                {project.title}
                                            </h3>

                                            <p className="text-[var(--color-text-muted)] text-base font-light leading-relaxed mb-8 max-w-lg">
                                                {project.longDescription}
                                            </p>

                                            <div className="flex items-center flex-wrap gap-6">
                                                {project.links.demo && (
                                                    <a
                                                        href={project.links.demo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 uppercase tracking-widest text-xs font-bold ${theme.button}`}
                                                    >
                                                        <FaExternalLinkAlt /> Visiter le site
                                                    </a>
                                                )}
                                                {project.links.repo && (
                                                    <a
                                                        href={project.links.repo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 uppercase tracking-widest text-xs font-bold ${theme.button}`}
                                                    >
                                                        <FaGithub className="text-lg" /> Code Source
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/projets/${project.id}`}
                                                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                                                >
                                                    Voir le détail
                                                </Link>

                                                <div className="flex items-center gap-4 text-xl text-[var(--color-text-muted)]">
                                                    {project.tech.map((t) => (
                                                        <span key={t.name} title={t.name} className={t.color}>
                                                            {t.icon}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Visual Content - Parallax */}
                                    <div className={`lg:w-1/2 relative overflow-hidden flex items-center justify-center p-10 bg-gradient-to-br ${reversed ? "from-black/40 to-black/80" : "from-black/40 to-black/80"}`}>
                                        <div className={`absolute inset-0 ${theme.overlay} mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700 z-10`} />
                                        <motion.div
                                            style={{ y: reversed ? yParallaxReverse : yParallax }}
                                            className={`relative z-20 w-full ${isMobile ? "aspect-[9/16] max-w-[280px] rounded-[2rem]" : "aspect-video rounded-xl"} overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-black/50 backdrop-blur-md ${theme.frame} transition-colors duration-500`}
                                        >
                                            {cover ? (
                                                <Image
                                                    src={cover}
                                                    alt={`Aperçu du projet ${project.title}`}
                                                    fill
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: reversed ? -5 : 5 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    className={`text-8xl text-gray-700 transition-colors duration-500 ${theme.icon}`}
                                                >
                                                    {project.tech[0]?.icon}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
