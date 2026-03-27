"use client";
import { useState } from "react";

interface ProjectGalleryProps {
    images?: string[];
    title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <div className="mb-16">
            <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-4">
                Aperçu <span className="w-12 h-px bg-luxury-gold"></span>
            </h2>

            {/* GRILLE DES MINIATURES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className="group relative h-48 sm:h-64 bg-white/5 rounded-xl border border-white/10 p-2 hover:border-luxury-gold/50 cursor-zoom-in transition-all duration-300"
                    >
                        <img
                            src={img}
                            alt={`${title} - Aperçu ${index + 1}`}
                            // object-contain permet aux images portrait de ne pas être rognées ni étirées
                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* LIGHTBOX (POP-UP PLEIN ÉCRAN) */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)} // Ferme au clic sur le fond
                >
                    {/* Bouton Fermer */}
                    <button
                        className="absolute top-6 right-6 sm:top-10 sm:right-10 text-gray-400 hover:text-luxury-gold transition-colors text-4xl font-light"
                        onClick={() => setSelectedImage(null)}
                    >
                        &times;
                    </button>

                    {/* Image en grand */}
                    <img
                        src={selectedImage}
                        alt={`${title} - Zoom`}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
                        onClick={(e) => e.stopPropagation()} // Empêche de fermer si on clique sur l'image elle-même
                    />
                </div>
            )}
        </div>
    );
}