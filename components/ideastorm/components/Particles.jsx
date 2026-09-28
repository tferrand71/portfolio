import React, { useEffect, useRef } from "react";

/**
 * Champ de particules d'ambiance.
 *
 * Remplace l'ancien composant Snow, qui lançait une boucle
 * requestAnimationFrame jamais annulée : elle continuait de tourner après le
 * démontage du composant, et une seconde boucle démarrait à chaque remontage.
 */
export default function Particles({ count = 60 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Respecte le réglage système : pas d'animation si l'utilisateur
        // a demandé à réduire les mouvements.
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return undefined;

        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext("2d");
        if (!ctx) return undefined;

        // Le canvas est dimensionné en pixels physiques pour rester net
        // sur écran haute densité, puis remis à l'échelle CSS.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = 0;
        let height = 0;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        const particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.8 + 0.5,
            speed: Math.random() * 16 + 6,
            drift: (Math.random() - 0.5) * 10,
            alpha: Math.random() * 0.4 + 0.12,
        }));

        let frame = 0;
        let last = performance.now();

        const draw = (now) => {
            // Déplacement au temps écoulé, pas à l'image : l'ambiance garde la
            // même vitesse sur un écran 60 Hz et sur un écran 144 Hz.
            const dt = Math.min((now - last) / 1000, 0.1);
            last = now;

            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                p.y += p.speed * dt;
                p.x += p.drift * dt;
                if (p.y > height + 4) {
                    p.y = -4;
                    p.x = Math.random() * width;
                }
                if (p.x < -4) p.x = width + 4;
                else if (p.x > width + 4) p.x = -4;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(195, 174, 245, ${p.alpha})`;
                ctx.fill();
            }
            frame = requestAnimationFrame(draw);
        };

        frame = requestAnimationFrame(draw);
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
        };
    }, [count]);

    return <canvas ref={canvasRef} className="is-particles" aria-hidden="true" />;
}
