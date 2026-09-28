import React from "react";

import { formatNumber } from "../utils/format.js";

/**
 * Scène de fin, atteinte à 1e90 points.
 *
 * Le fichier qu'elle remplace (EasterEgg.jsx) était un copier-coller du
 * classement : il ignorait sa prop `onClose`, donc une fois le seuil franchi
 * l'écran restait affiché par-dessus le jeu, sans moyen de le fermer.
 */
export default function EndingModal({ score, rebirthCount, onClose }) {
    return (
        <div className="is-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="is-ending-title">
            <div className="is-modal">
                <div className="is-modal-icon" aria-hidden="true">
                    🌌
                </div>
                <h2 id="is-ending-title" className="is-title" style={{ marginTop: 12 }}>
                    Tu as saturé l&apos;univers
                </h2>
                <p className="is-subtitle">
                    {formatNumber(score)} idées générées, {rebirthCount} ascension
                    {rebirthCount > 1 ? "s" : ""}. Il n&apos;y a plus rien à inventer — et pourtant
                    la boutique a encore des paliers.
                </p>
                <button type="button" onClick={onClose} className="is-btn is-btn--primary is-btn--block">
                    Continuer quand même
                </button>
            </div>
        </div>
    );
}
