import React, { useMemo } from "react";

import { AUTO_UPGRADES, CLICK_UPGRADES } from "../data/upgrades.js";
import { nextMilestone } from "../lib/engine.js";
import useStore from "../store/useStore.js";
import { formatNumber } from "../utils/format.js";
import ClickButton from "../components/ClickButton.jsx";

/** Barre de progression vers le prochain palier hors de portée. */
function NextMilestone() {
    const score = useStore((s) => s.score);
    const owned = useStore((s) => s.owned);
    const rebirthCount = useStore((s) => s.rebirthCount);

    // Dérivé via useMemo : un sélecteur renvoyant un objet neuf à chaque appel
    // ferait échouer le cache de useSyncExternalStore.
    const milestone = useMemo(
        () => nextMilestone({ score, owned, rebirthCount }, [CLICK_UPGRADES, AUTO_UPGRADES]),
        [score, owned, rebirthCount]
    );

    if (!milestone) return null;

    const ratio = Math.min(1, score / milestone.cost);
    return (
        <div className="is-next">
            <div className="is-next-head">
                <span>
                    Prochain palier{" "}
                    <span className="is-next-name">
                        {milestone.def.icon} {milestone.def.label}
                    </span>
                </span>
                <span>{formatNumber(milestone.cost)}</span>
            </div>
            <div
                className="is-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(ratio * 100)}
            >
                <div className="is-bar-fill" style={{ width: `${ratio * 100}%` }} />
            </div>
        </div>
    );
}

export default function Game() {
    // Un sélecteur par valeur : le tick de score ne fait re-rendre que
    // l'affichage du score, pas l'en-tête ni la surimpression média.
    const score = useStore((s) => s.score);
    const perClick = useStore((s) => s.perClick);
    const perSecond = useStore((s) => s.perSecond);
    const rebirthCount = useStore((s) => s.rebirthCount);
    const loaded = useStore((s) => s.loaded);
    const saveError = useStore((s) => s.saveError);
    const click = useStore((s) => s.click);
    const loadGame = useStore((s) => s.loadGame);

    // Une partie qui n'a pas pu être chargée doit le dire. Sans cet écran, le
    // joueur voyait un score à zéro et cliquait dans le vide pendant que
    // chaque sauvegarde repartait en erreur — le défaut de l'ancienne version.
    if (!loaded && saveError) {
        return (
            <main className="is-page is-page--center">
                <div className="is-card" style={{ textAlign: "center" }}>
                    <h1 className="is-title">Partie indisponible</h1>
                    <p className="is-subtitle">
                        Ta sauvegarde n&apos;a pas pu être récupérée. Rien n&apos;est perdu : tant
                        qu&apos;elle n&apos;est pas chargée, le jeu n&apos;écrit rien en base.
                    </p>
                    <button type="button" className="is-btn is-btn--primary is-btn--block" onClick={() => loadGame()}>
                        Réessayer
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="is-page is-page--center">
            <div className="is-game">
                <div>
                    <div className="is-score">{formatNumber(score)}</div>
                    <div className="is-score-label">idées</div>
                </div>

                <div className="is-stat-grid">
                    <div className="is-stat">
                        <div className="is-stat-key">👆 par clic</div>
                        <div className="is-stat-value">{formatNumber(perClick)}</div>
                    </div>
                    <div className="is-stat">
                        <div className="is-stat-key">⏱️ par seconde</div>
                        <div className="is-stat-value">{formatNumber(perSecond)}</div>
                    </div>
                </div>

                <ClickButton perClick={perClick} onClick={click} disabled={!loaded} />

                <NextMilestone />

                {rebirthCount > 0 && (
                    <p className="is-subtitle" style={{ margin: 0 }}>
                        ✨ {rebirthCount} ascension{rebirthCount > 1 ? "s" : ""} — production ×
                        {formatNumber(Math.pow(50, rebirthCount))}
                    </p>
                )}
            </div>
        </main>
    );
}
