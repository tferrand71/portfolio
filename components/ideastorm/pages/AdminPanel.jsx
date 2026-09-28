import React, { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { COMPANIONS } from "../data/upgrades.js";
import { clampScore, migrateSave, serializeSave, withPerClick, withPerSecond } from "../lib/engine.js";
import useStore from "../store/useStore.js";
import * as api from "../utils/api.js";
import { formatNumber } from "../utils/format.js";

/**
 * Champ numérique acceptant la notation scientifique (1e300).
 *
 * Un <input type="number"> refuse « 1e300 » dans plusieurs navigateurs et
 * renvoie une chaîne vide : le panneau d'origine écrivait alors 0 dans la
 * partie du joueur. On garde donc un champ texte et on convertit nous-mêmes.
 */
function BigNumberField({ id, label, value, onChange, disabled }) {
    // Pas d'effet de synchronisation : hors saisie, le champ affiche
    // directement la valeur du parent ; pendant la saisie, le brouillon local
    // fait foi pour que « 1e » ne soit pas réécrit avant d'être terminé.
    const [draft, setDraft] = useState(null);
    const shown = draft ?? String(value);

    const commit = (text) => {
        setDraft(text);
        const parsed = Number(text);
        if (Number.isFinite(parsed) && parsed >= 0) onChange(parsed);
    };

    const invalid = !Number.isFinite(Number(shown)) || Number(shown) < 0;

    return (
        <div className="is-field">
            <label className="is-label" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                value={shown}
                onChange={(e) => commit(e.target.value)}
                onBlur={() => setDraft(null)}
                disabled={disabled}
                inputMode="decimal"
                spellCheck={false}
                style={invalid ? { borderColor: "var(--is-danger)" } : undefined}
            />
            <p className="is-hint">
                {invalid ? "Nombre invalide." : `= ${formatNumber(Number(shown))}`} — notation
                scientifique acceptée (1e30).
            </p>
        </div>
    );
}

/** Édition d'une partie. L'état local est un état de jeu complet, pas un
 *  agrégat de champs : on réutilise donc exactement le moteur du jeu. */
function PlayerEditor({ player, onBack, onSaved }) {
    const toast = useStore((s) => s.toast);
    const resyncFromServer = useStore((s) => s.resyncFromServer);
    const isSelf = useStore((s) => s.user?.id === player.id);
    const [state, setState] = useState(null);
    const [status, setStatus] = useState("loading");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;
        api.loadPlayerSave(player.id)
            .then((raw) => {
                if (cancelled) return;
                setState(migrateSave(raw));
                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [player.id]);

    const save = async () => {
        setBusy(true);
        try {
            await api.savePlayer({
                user_id: player.id,
                score: state.score,
                save_data: serializeSave(state),
            });
            // Modifier son propre compte demande de recharger la partie en
            // cours : sinon l'autosave du jeu réécrit l'ancien état par-dessus.
            if (isSelf) await resyncFromServer();
            toast(`Partie de ${player.username} enregistrée.`, "success");
            onSaved();
        } catch (err) {
            toast(err.message || "Enregistrement impossible.", "error");
        } finally {
            setBusy(false);
        }
    };

    const toggleCompanion = (id, checked) =>
        setState((prev) => {
            const owned = { ...prev.owned };
            if (checked) owned[id] = 1;
            else delete owned[id];
            // On repasse par le moteur pour que la production suive.
            return migrateSave({ ...serializeSave({ ...prev, owned }), score: prev.score });
        });

    if (status === "loading") return <p className="is-hint">Chargement de la partie…</p>;
    if (status === "error") return <div className="is-error">Partie illisible.</div>;

    return (
        <>
            <button type="button" className="is-btn is-btn--ghost is-btn--sm" onClick={onBack}>
                ← Retour à la liste
            </button>

            <h1 className="is-title" style={{ marginTop: 18 }}>
                {player.username}
            </h1>
            <p className="is-subtitle">
                Les valeurs sont appliquées via le moteur du jeu : l&apos;échelle des prix reste
                cohérente avec la puissance accordée.
                {isSelf && " C'est ton propre compte : ta partie en cours sera rechargée après l'enregistrement."}
            </p>

            <h2 className="is-section-title">Ressources</h2>
            <BigNumberField
                id="is-admin-score"
                label="Score"
                value={state.score}
                disabled={busy}
                onChange={(v) => setState((p) => ({ ...p, score: clampScore(v) }))}
            />
            <BigNumberField
                id="is-admin-perclick"
                label="Points par clic"
                value={state.perClick}
                disabled={busy}
                onChange={(v) => setState((p) => withPerClick(p, v))}
            />
            <BigNumberField
                id="is-admin-persecond"
                label="Points par seconde"
                value={state.perSecond}
                disabled={busy}
                onChange={(v) => setState((p) => withPerSecond(p, v))}
            />

            <div className="is-field">
                <label className="is-label" htmlFor="is-admin-rebirth">
                    Ascensions
                </label>
                <input
                    id="is-admin-rebirth"
                    type="number"
                    min={0}
                    max={6}
                    value={state.rebirthCount}
                    disabled={busy}
                    onChange={(e) => {
                        const n = Math.max(0, Math.min(6, Number(e.target.value) || 0));
                        setState((p) => migrateSave({ ...serializeSave({ ...p, rebirthCount: n }), score: p.score }));
                    }}
                />
            </div>

            <h2 className="is-section-title">Compagnons</h2>
            <div className="is-companions">
                {COMPANIONS.map((c) => (
                    <label
                        key={c.id}
                        className={`is-upgrade${state.owned[c.id] ? " is-companion--owned" : ""}`}
                        style={{ cursor: "pointer" }}
                    >
                        <input
                            type="checkbox"
                            checked={Boolean(state.owned[c.id])}
                            disabled={busy}
                            onChange={(e) => toggleCompanion(c.id, e.target.checked)}
                            style={{ width: 18, height: 18, flex: "none", accentColor: "var(--is-accent)" }}
                        />
                        <span className="is-upgrade-body">
                            <span className="is-upgrade-name">
                                {c.icon} {c.label}
                            </span>
                        </span>
                    </label>
                ))}
            </div>

            <button
                type="button"
                className="is-btn is-btn--primary is-btn--block"
                onClick={save}
                disabled={busy}
                style={{ marginTop: 26 }}
            >
                {busy ? "Enregistrement…" : "Enregistrer la partie"}
            </button>
        </>
    );
}

export default function AdminPanel() {
    const user = useStore((s) => s.user);
    const [players, setPlayers] = useState([]);
    const [status, setStatus] = useState("loading");
    const [selected, setSelected] = useState(null);

    const load = useCallback(
        () =>
            api
                .fetchPlayers()
                .then((data) => {
                    setPlayers(Array.isArray(data) ? data : []);
                    setStatus("ready");
                })
                .catch(() => setStatus("error")),
        []
    );

    const isAdmin = user?.role === "admin";
    useEffect(() => {
        if (isAdmin) load();
    }, [isAdmin, load]);

    // Garde d'affichage uniquement : /api/ideastorm/admin/* revérifie le rôle
    // côté serveur à chaque requête.
    if (user && user.role !== "admin") return <Navigate to="/" replace />;

    return (
        <main className="is-page">
            <div className="is-card is-card--full">
                {selected ? (
                    <PlayerEditor
                        player={selected}
                        onBack={() => setSelected(null)}
                        onSaved={() => {
                            setSelected(null);
                            load();
                        }}
                    />
                ) : (
                    <>
                        <h1 className="is-title">Administration</h1>
                        <p className="is-subtitle">
                            {players.length} compte{players.length > 1 ? "s" : ""} enregistré
                            {players.length > 1 ? "s" : ""}.
                        </p>

                        {status === "loading" && <p className="is-hint">Chargement…</p>}
                        {status === "error" && <div className="is-error">Liste indisponible.</div>}

                        {status === "ready" && (
                            <div className="is-table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Joueur</th>
                                            <th className="is-num">Score</th>
                                            <th className="is-mid">Ascensions</th>
                                            <th className="is-mid">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.map((p) => (
                                            <tr key={p.id}>
                                                <td>{p.username}</td>
                                                <td className="is-num">{formatNumber(p.score)}</td>
                                                <td className="is-mid">
                                                    <span className="is-badge">✦ {p.rebirth_count}</span>
                                                </td>
                                                <td className="is-mid">
                                                    <button
                                                        type="button"
                                                        className="is-btn is-btn--sm"
                                                        onClick={() => setSelected(p)}
                                                    >
                                                        Modifier
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
