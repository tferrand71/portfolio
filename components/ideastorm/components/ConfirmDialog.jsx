import React from "react";

/** Confirmation pour les actions destructrices (ascension, remise à zéro). */
export default function ConfirmDialog({ title, message, confirmLabel, tone = "primary", busy, onConfirm, onCancel }) {
    return (
        <div className="is-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="is-confirm-title">
            <div className="is-modal">
                <h2 id="is-confirm-title" className="is-title">
                    {title}
                </h2>
                <p className="is-subtitle">{message}</p>
                <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={onCancel} disabled={busy} className="is-btn is-btn--ghost is-btn--block">
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className={`is-btn is-btn--${tone} is-btn--block`}
                    >
                        {busy ? "…" : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
