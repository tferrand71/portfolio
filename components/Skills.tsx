"use client";
import { motion } from "framer-motion";
import { FaHtml5, FaCss3Alt, FaJs, FaAndroid, FaJava, FaGitAlt, FaDatabase } from "react-icons/fa";

const skills = [
    { name: "HTML5", icon: <FaHtml5 />, level: "Avancé", color: "text-orange-500" },
    { name: "CSS3", icon: <FaCss3Alt />, level: "Avancé", color: "text-blue-500" },
    { name: "JavaScript", icon: <FaJs />, level: "Intermédiaire", color: "text-yellow-400" },
    { name: "Android", icon: <FaAndroid />, level: "Débutant", color: "text-green-500" },
    { name: "Java", icon: <FaJava />, level: "Débutant", color: "text-red-500" },
    { name: "SQL", icon: <FaDatabase />, level: "Avancé", color: "text-gray-400" },
    { name: "Git", icon: <FaGitAlt />, level: "Outil", color: "text-orange-600" },
];

export default function Skills() {
    return (
        <section className="py-20 bg-card-dark">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-4xl font-serif text-white mb-12 text-center">
                    Compétences <span className="text-luxury-gold">&</span> Outils
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="p-6 bg-rich-black border border-gray-800 rounded-xl flex flex-col items-center justify-center gap-4 hover:shadow-glow transition-all"
                        >
                            <div className={`text-4xl ${skill.color}`}>{skill.icon}</div>
                            <div className="text-center">
                                <h3 className="font-bold text-white">{skill.name}</h3>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">{skill.level}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}