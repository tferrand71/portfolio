import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { COMPANIONS, REBIRTH_MAX } from "../data/upgrades.js";
import { formatNumber } from "../utils/format.js";

/** Glyphes lancés en renfort des cinq compagnons. */
const CONFETTI = ["🤪", "🥷", "🔫", "👑", "🪿", "🛰️", "✨", "☄️", "🪐", "🛸"];
const CONFETTI_COUNT = 34;

/**
 * L'easter egg : l'invasion.
 *
 * Déclenché uniquement au bout du jeu : dernière ascension atteinte et
 * boutique entièrement vidée. Les cinq compagnons se décollent de leur coin
 * d'écran et rebondissent partout, accompagnés d'une trentaine de figurants.
 *
 * L'animation ne passe pas par React : les positions sont écrites directement
 * dans `style.transform` depuis une boucle requestAnimationFrame. Re-rendre
 * quarante éléments soixante fois par seconde via l'état ferait ramer le jeu,
 * qui tourne déjà en fond.
 */
export default function EasterEggModal({ score, rebirthCount, onClose }) {
    const nodesRef = useRef([]);

    // Construits une seule fois. Les tailles sont dérivées de l'indice et non
    // tirées au sort : `useMemo` s'exécute pendant le rendu, où toute fonction
    // impure est proscrite. L'aléatoire vit dans l'effet, avec les positions
    // et les vitesses de départ.
    const sprites = useMemo(() => {
        const list = COMPANIONS.map((c) => ({
            key: c.id,
            kind: c.media.type,
            src: c.media.src,
            size: 96,
        }));
        for (let i = 0; i < CONFETTI_COUNT; i += 1) {
            list.push({
                key: `confetti-${i}`,
                kind: "glyph",
                glyph: CONFETTI[i % CONFETTI.length],
                size: 22 + ((i * 3) % 5) * 7,
            });
        }
        return list;
    }, []);

    const registerNode = useCallback((index) => (el) => {
        nodesRef.current[index] = el;
    }, []);

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return undefined;

        const nodes = nodesRef.current.filter(Boolean);
        if (nodes.length === 0) return undefined;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const bodies = nodes.map((node, i) => {
            const size = sprites[i]?.size ?? 32;
            return {
                node,
                size,
                x: Math.random() * Math.max(1, width - size),
                y: Math.random() * Math.max(1, height - size),
                // Les compagnons, plus gros, avancent plus lentement.
                vx: (Math.random() * 2 - 1) * (size > 60 ? 130 : 260),
                vy: (Math.random() * 2 - 1) * (size > 60 ? 130 : 260),
                rot: Math.random() * 360,
                vr: (Math.random() * 2 - 1) * 140,
            };
        });

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        let frame = 0;
        let last = performance.now();

        const step = (now) => {
            // Intégration au temps écoulé, bornée : un onglet qui revient au
            // premier plan ne doit pas téléporter tout le monde d'un coup.
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            for (const b of bodies) {
                b.x += b.vx * dt;
                b.y += b.vy * dt;
                b.rot += b.vr * dt;

                const maxX = width - b.size;
                const maxY = height - b.size;
                if (b.x <= 0) { b.x = 0; b.vx = Math.abs(b.vx); }
                else if (b.x >= maxX) { b.x = maxX; b.vx = -Math.abs(b.vx); }
                if (b.y <= 0) { b.y = 0; b.vy = Math.abs(b.vy); }
                else if (b.y >= maxY) { b.y = maxY; b.vy = -Math.abs(b.vy); }

                b.node.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.rot}deg)`;
            }
            frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onResize);
        };
    }, [sprites]);

    // Échap ferme la scène, comme n'importe quelle fenêtre modale.
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="is-invasion" role="dialog" aria-modal="true" aria-labelledby="is-egg-title">
            <div className="is-invasion-field" aria-hidden="true">
                {sprites.map((s, i) =>
                    s.kind === "video" ? (
                        <video
                            key={s.key}
                            ref={registerNode(i)}
                            className="is-invader is-invader--media"
                            style={{ width: s.size }}
                            src={s.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    ) : s.kind === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={s.key}
                            ref={registerNode(i)}
                            className="is-invader is-invader--media"
                            style={{ width: s.size }}
                            src={s.src}
                            alt=""
                        />
                    ) : (
                        <span
                            key={s.key}
                            ref={registerNode(i)}
                            className="is-invader"
                            style={{ fontSize: s.size, lineHeight: 1 }}
                        >
                            {s.glyph}
                        </span>
                    )
                )}
            </div>

            <div className="is-modal is-modal--gold is-invasion-card">
                <p className="is-egg-kicker">
                    Ascension {REBIRTH_MAX} / {REBIRTH_MAX} · boutique vidée
                </p>

                <h2 id="is-egg-title" className="is-egg-title">
                    Ils se sont échappés
                </h2>

                <p className="is-subtitle">
                    Six ascensions, la Singularité finale et le Grand Tout rachetés une
                    dernière fois. Il n&apos;y a plus rien à vendre, plus rien à améliorer, plus
                    rien à recommencer, et l&apos;équipage vient de comprendre qu&apos;il
                    n&apos;avait plus de contrat. L&apos;Artilleur orbital a pris ça très au
                    sérieux.
                </p>

                <div className="is-egg-stats">
                    <div>
                        <span className="is-stat-key">Idées</span>
                        <strong>{formatNumber(score)}</strong>
                    </div>
                    <div>
                        <span className="is-stat-key">Ascensions</span>
                        <strong>{rebirthCount}</strong>
                    </div>
                </div>

                <p className="is-egg-award">
                    Titre débloqué : <strong>Cartographe du Grand Tout</strong>
                </p>

                <button type="button" onClick={onClose} className="is-btn is-btn--gold is-btn--block">
                    Les remettre dans leur coin
                </button>
            </div>
        </div>
    );
}
