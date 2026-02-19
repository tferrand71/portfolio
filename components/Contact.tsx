"use client";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
    const contacts = [
        {
            icon: <FaEnvelope />,
            title: "Email",
            text: "contact@tobias-ferrand.ovh",
            link: "mailto:contact@tobias-ferrand.ovh",
            color: "group-hover:text-luxury-gold"
        },
        {
            icon: <FaLinkedin />,
            title: "LinkedIn",
            text: "Tobias Ferrand",
            link: "https://www.linkedin.com/in/tobias-ferrand-3a337b277",
            color: "group-hover:text-blue-400"
        },
        {
            icon: <FaGithub />,
            title: "GitHub",
            text: "@tferrand71",
            link: "https://github.com/tferrand71",
            color: "group-hover:text-white"
        }
    ];

    return (
        <section id="contact" className="py-24 bg-rich-black relative overflow-hidden">
            {/* Petit effet de fond discret */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[80px]" />

            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 1, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-serif text-white mb-4">
                        Parlons de <span className="text-luxury-gold">votre projet</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Je suis toujours à la recherche de nouvelles opportunités.
                        N'hésitez pas à me contacter par email ou via les réseaux sociaux.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {contacts.map((item, index) => (
                        <motion.a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 1, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-card-dark border border-gray-800 p-8 rounded-xl flex flex-col items-center text-center hover:border-luxury-gold/50 hover:shadow-glow transition-all duration-300"
                        >
                            <div className={`text-4xl text-gray-500 mb-4 transition-colors duration-300 ${item.color}`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                                {item.text}
                            </p>
                        </motion.a>
                    ))}
                </div>

                {/* Localisation (Petit ajout en bas) */}
                <div className="mt-12 text-center text-gray-500 flex items-center justify-center gap-2">
                    <FaMapMarkerAlt className="text-luxury-gold" />
                    <span>Basé à Roisel, Hauts-de-France</span>
                </div>
            </div>
        </section>
    );
}