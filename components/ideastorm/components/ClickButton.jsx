import React, { useCallback, useRef, useState } from "react";

import { formatNumber } from "../utils/format.js";

/**
 * Bouton principal. Les nombres qui s'envolent vivent dans un état local :
 * les rendre depuis le store ferait re-rendre le reste du jeu à chaque clic.
 */
export default function ClickButton({ perClick, onClick, disabled }) {
    const [floats, setFloats] = useState([]);
    const nextId = useRef(0);

    const handleClick = useCallback(() => {
        if (disabled) return;
        onClick();

        const id = nextId.current++;
        // Léger décalage horizontal pour que deux clics rapprochés ne se
        // superposent pas exactement.
        const offset = Math.round((Math.random() - 0.5) * 60);
        setFloats((f) => [...f, { id, offset, value: perClick }]);
        setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 850);
    }, [disabled, onClick, perClick]);

    return (
        <button
            type="button"
            className="is-click-btn"
            onClick={handleClick}
            disabled={disabled}
            aria-label={`Générer ${formatNumber(perClick)} points`}
        >
            <span className="is-click-icon" aria-hidden="true">
                ⚡
            </span>
            Générer

            {floats.map((f) => (
                <span key={f.id} className="is-float" style={{ marginLeft: f.offset }}>
                    +{formatNumber(f.value)}
                </span>
            ))}
        </button>
    );
}
