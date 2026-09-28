import React from "react";

import useStore from "../store/useStore.js";

/**
 * Notifications empilées en bas d'écran. Elles remplacent les `alert()` du
 * jeu d'origine, qui bloquaient la boucle de jeu et le rendu à chaque
 * connexion, inscription ou erreur réseau.
 */
export default function Toasts() {
    const toasts = useStore((s) => s.toasts);
    const dismiss = useStore((s) => s.dismissToast);

    if (toasts.length === 0) return null;

    return (
        <div className="is-toasts" role="status" aria-live="polite">
            {toasts.map((t) => (
                <div key={t.id} className={`is-toast is-toast--${t.tone}`}>
                    <span style={{ flex: 1 }}>{t.message}</span>
                    <button
                        type="button"
                        onClick={() => dismiss(t.id)}
                        className="is-btn is-btn--ghost is-btn--sm"
                        aria-label="Fermer la notification"
                        style={{ padding: "2px 8px" }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
