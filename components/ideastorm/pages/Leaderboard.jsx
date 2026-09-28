import React, { useCallback, useEffect, useState } from "react";

import useStore from "../store/useStore.js";
import { fetchLeaderboard } from "../utils/api.js";
import { formatNumber } from "../utils/format.js";

const REFRESH_MS = 15000;

export default function Leaderboard() {
    const username = useStore((s) => s.user?.username);
    const [players, setPlayers] = useState([]);
    const [status, setStatus] = useState("loading");

    // Chaîne de promesses plutôt qu'async/await : les mises à jour d'état
    // partent ainsi d'un callback, jamais du corps de l'effet.
    const load = useCallback(
        (signal) =>
            fetchLeaderboard()
                .then((data) => {
                    if (signal.aborted) return;
                    setPlayers(Array.isArray(data) ? data : []);
                    setStatus("ready");
                })
                .catch(() => {
                    if (!signal.aborted) setStatus("error");
                }),
        []
    );

    useEffect(() => {
        // AbortController plutôt qu'un simple clearInterval : une requête déjà
        // partie ne doit pas écrire dans un composant démonté.
        const controller = new AbortController();
        load(controller.signal);
        const timer = setInterval(() => load(controller.signal), REFRESH_MS);
        return () => {
            controller.abort();
            clearInterval(timer);
        };
    }, [load]);

    return (
        <main className="is-page">
            <div className="is-card is-card--wide">
                <h1 className="is-title">Classement</h1>
                <p className="is-subtitle">
                    Les cinquante meilleures parties, triées par ascension puis par score.
                    Actualisé toutes les {REFRESH_MS / 1000} secondes.
                </p>

                {status === "loading" && <p className="is-hint">Chargement…</p>}
                {status === "error" && (
                    <div className="is-error">Le classement n&apos;a pas pu être chargé.</div>
                )}

                {status === "ready" && players.length === 0 && (
                    <p className="is-hint">Aucune partie enregistrée pour l&apos;instant.</p>
                )}

                {status === "ready" && players.length > 0 && (
                    <div className="is-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th className="is-mid">#</th>
                                    <th>Joueur</th>
                                    <th className="is-mid">Ascensions</th>
                                    <th className="is-num">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player, index) => {
                                    const rank = index + 1;
                                    return (
                                        <tr
                                            key={player.username}
                                            className={player.username === username ? "is-row-me" : undefined}
                                        >
                                            <td className="is-mid">
                                                <span className={`is-rank${rank <= 3 ? ` is-rank--${rank}` : ""}`}>
                                                    {rank}
                                                </span>
                                            </td>
                                            <td>{player.username}</td>
                                            <td className="is-mid">
                                                <span className="is-badge">✦ {player.rebirth_count ?? 0}</span>
                                            </td>
                                            <td className="is-num">{formatNumber(player.score)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
