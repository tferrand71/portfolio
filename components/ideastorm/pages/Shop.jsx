import React, { useMemo, useState } from "react";

import {
    AUTO_UPGRADES,
    CLICK_UPGRADES,
    COMPANIONS,
    MULTIPLIERS,
    REBIRTH_MAX,
    REBIRTH_REQUIREMENT,
} from "../data/upgrades.js";
import { sealedUpgrades, upgradeCost, visibleUpgrades } from "../lib/engine.js";
import useStore from "../store/useStore.js";
import { formatNumber } from "../utils/format.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

/**
 * Une ligne d'amélioration. Le prix, le nombre possédé et la disponibilité
 * sont recalculés depuis le store : il n'existe plus de bouton dont l'action
 * pourrait être absente, puisque tous passent par `buy(id)`.
 */
function UpgradeRow({ def, unit, sellable = true }) {
    const owned = useStore((s) => s.owned[def.id] ?? 0);
    const score = useStore((s) => s.score);
    const rebirthCount = useStore((s) => s.rebirthCount);
    const buy = useStore((s) => s.buy);
    const sell = useStore((s) => s.sell);

    const cost = upgradeCost(def.id, owned, rebirthCount);
    const maxed = !Number.isFinite(cost);
    const affordable = !maxed && score >= cost;

    const effect = def.factor
        ? `Multiplie la production ${def.target === "auto" ? "automatique" : "au clic"} par ${def.factor}`
        : `+${formatNumber(def.bonus)} ${unit}`;

    return (
        <div
            className={[
                "is-upgrade",
                affordable ? "is-upgrade--affordable" : "",
                def.legendary ? "is-upgrade--legendary" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className="is-upgrade-icon" aria-hidden="true">
                {def.icon}
            </span>

            <button
                type="button"
                className="is-upgrade-body"
                onClick={() => buy(def.id)}
                disabled={!affordable}
            >
                <span className="is-upgrade-name">
                    {def.label}
                    {owned > 0 && <span className="is-upgrade-count">×{owned}</span>}
                </span>
                <span className="is-upgrade-effect">{effect}</span>
            </button>

            <span className="is-upgrade-price">{maxed ? "épuisé" : formatNumber(cost)}</span>

            {sellable && owned > 0 && (
                <button
                    type="button"
                    className="is-sell"
                    onClick={() => sell(def.id)}
                    title="Revendre un exemplaire (50 % du prix payé)"
                    aria-label={`Revendre ${def.label}`}
                >
                    −
                </button>
            )}
        </div>
    );
}

/** Achat unique : pas de compteur, pas de revente. */
function CompanionRow({ def }) {
    const owned = useStore((s) => s.owned[def.id] ?? 0);
    const score = useStore((s) => s.score);
    const rebirthCount = useStore((s) => s.rebirthCount);
    const buy = useStore((s) => s.buy);

    const cost = upgradeCost(def.id, 0, rebirthCount);
    const affordable = score >= cost;

    if (owned > 0) {
        return (
            <div className="is-upgrade is-companion--owned">
                <span className="is-upgrade-icon" aria-hidden="true">
                    {def.icon}
                </span>
                <span className="is-upgrade-body">
                    <span className="is-upgrade-name">{def.label}</span>
                    <span className="is-upgrade-effect">+{formatNumber(def.bonus)} / s — acquis</span>
                </span>
                <span className="is-upgrade-price" style={{ color: "var(--is-success)" }}>
                    ✓
                </span>
            </div>
        );
    }

    return (
        <div className={`is-upgrade${affordable ? " is-upgrade--affordable" : ""}`}>
            <span className="is-upgrade-icon" aria-hidden="true">
                {def.icon}
            </span>
            <button type="button" className="is-upgrade-body" onClick={() => buy(def.id)} disabled={!affordable}>
                <span className="is-upgrade-name">{def.label}</span>
                <span className="is-upgrade-effect">+{formatNumber(def.bonus)} / seconde</span>
            </button>
            <span className="is-upgrade-price">{formatNumber(cost)}</span>
        </div>
    );
}

/** Remise à zéro complète. L'action existait dans le store d'origine mais
 *  n'était atteignable depuis aucun écran. */
function DangerZone() {
    const resetGame = useStore((s) => s.resetGame);
    const toast = useStore((s) => s.toast);
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);

    const confirm = async () => {
        setBusy(true);
        try {
            await resetGame();
            toast("Partie remise à zéro.", "info");
        } catch {
            toast("La remise à zéro n'a pas pu être enregistrée.", "error");
        } finally {
            setBusy(false);
            setConfirming(false);
        }
    };

    return (
        <div style={{ marginTop: 26, textAlign: "center" }}>
            <button type="button" className="is-btn is-btn--danger is-btn--sm" onClick={() => setConfirming(true)}>
                Recommencer à zéro
            </button>
            {confirming && (
                <ConfirmDialog
                    title="Tout effacer ?"
                    message="Score, améliorations, compagnons et ascensions repartent de zéro, sans contrepartie. Cette action est irréversible."
                    confirmLabel="Tout effacer"
                    tone="danger"
                    busy={busy}
                    onConfirm={confirm}
                    onCancel={() => setConfirming(false)}
                />
            )}
        </div>
    );
}

function RebirthPanel() {
    const score = useStore((s) => s.score);
    const rebirthCount = useStore((s) => s.rebirthCount);
    const rebirth = useStore((s) => s.rebirth);
    const toast = useStore((s) => s.toast);
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);

    const maxed = rebirthCount >= REBIRTH_MAX;
    const ready = !maxed && score >= REBIRTH_REQUIREMENT;
    const ratio = Math.min(1, score / REBIRTH_REQUIREMENT);

    const confirm = async () => {
        setBusy(true);
        try {
            await rebirth();
            toast(`Ascension ${rebirthCount + 1} atteinte. Production ×50.`, "success");
        } catch {
            toast("L'ascension n'a pas pu être enregistrée. Réessaie.", "error");
        } finally {
            setBusy(false);
            setConfirming(false);
        }
    };

    return (
        <section className="is-rebirth">
            <h3 className="is-rebirth-title">
                ✦ Ascension {rebirthCount} / {REBIRTH_MAX}
            </h3>
            <p className="is-rebirth-help">
                Repart de zéro et multiplie durablement toute la production par 50. Les compagnons
                et les améliorations sont perdus, les ascensions ne le sont jamais.
            </p>

            {!maxed && (
                <div className="is-bar" style={{ marginBottom: 16 }}>
                    <div className="is-bar-fill" style={{ width: `${ratio * 100}%` }} />
                </div>
            )}

            <button
                type="button"
                className="is-btn is-btn--gold is-btn--block"
                disabled={!ready}
                onClick={() => setConfirming(true)}
            >
                {maxed
                    ? "Ascension maximale atteinte"
                    : ready
                      ? "Déclencher l'ascension"
                      : `Requis : ${formatNumber(REBIRTH_REQUIREMENT)} idées`}
            </button>

            {confirming && (
                <ConfirmDialog
                    title={`Ascension ${rebirthCount + 1} ?`}
                    message="Ton score, tes améliorations et tes compagnons repartent de zéro. En échange, toute ta production sera multipliée par 50. C'est définitif."
                    confirmLabel="Ascensionner"
                    tone="gold"
                    busy={busy}
                    onConfirm={confirm}
                    onCancel={() => setConfirming(false)}
                />
            )}
        </section>
    );
}

export default function Shop() {
    const score = useStore((s) => s.score);
    const perClick = useStore((s) => s.perClick);
    const perSecond = useStore((s) => s.perSecond);

    // Un sélecteur qui construit un tableau renvoie une référence différente à
    // chaque appel, ce que useSyncExternalStore refuse ("getSnapshot should be
    // cached"). On s'abonne donc aux valeurs brutes et on dérive ici.
    const owned = useStore((s) => s.owned);
    const rebirthCount = useStore((s) => s.rebirthCount);

    const clickList = useMemo(
        () => visibleUpgrades(CLICK_UPGRADES, { score, owned, rebirthCount }),
        [score, owned, rebirthCount]
    );
    const autoList = useMemo(
        () => visibleUpgrades(AUTO_UPGRADES, { score, owned, rebirthCount }),
        [score, owned, rebirthCount]
    );
    const multipliers = useMemo(
        () => MULTIPLIERS.filter((m) => score >= m.unlockAt || owned[m.id]),
        [score, owned]
    );
    const sealed = useMemo(
        () =>
            sealedUpgrades(CLICK_UPGRADES, { rebirthCount, owned }).length +
            sealedUpgrades(AUTO_UPGRADES, { rebirthCount, owned }).length,
        [rebirthCount, owned]
    );

    return (
        <main className="is-page">
            <div className="is-card is-card--wide">
                <h1 className="is-title">Boutique</h1>
                <p className="is-subtitle">
                    Les paliers se dévoilent à mesure que ton score grimpe. Le bouton − revend un
                    exemplaire pour la moitié de son prix.
                </p>

                <div className="is-shop-stats">
                    <div className="is-stat">
                        <div className="is-stat-key">💰 idées</div>
                        <div className="is-stat-value">{formatNumber(score)}</div>
                    </div>
                    <div className="is-stat">
                        <div className="is-stat-key">👆 par clic</div>
                        <div className="is-stat-value">{formatNumber(perClick)}</div>
                    </div>
                    <div className="is-stat">
                        <div className="is-stat-key">⏱️ par seconde</div>
                        <div className="is-stat-value">{formatNumber(perSecond)}</div>
                    </div>
                </div>

                <h2 className="is-section-title">Puissance de clic</h2>
                {clickList.map((def) => (
                    <UpgradeRow key={def.id} def={def} unit="par clic" />
                ))}

                <h2 className="is-section-title">Production automatique</h2>
                {autoList.map((def) => (
                    <UpgradeRow key={def.id} def={def} unit="par seconde" />
                ))}

                {multipliers.length > 0 && (
                    <>
                        <h2 className="is-section-title">Multiplicateurs</h2>
                        {multipliers.map((def) => (
                            <UpgradeRow key={def.id} def={def} />
                        ))}
                    </>
                )}

                <h2 className="is-section-title">Compagnons</h2>
                <div className="is-companions">
                    {COMPANIONS.map((def) => (
                        <CompanionRow key={def.id} def={def} />
                    ))}
                </div>

                {sealed > 0 && (
                    <p className="is-sealed">
                        🔒 {sealed} paliers sont scellés jusqu&apos;à l&apos;ascension {REBIRTH_MAX}{" "}
                        / {REBIRTH_MAX}. Ils coûtent plus cher qu&apos;une ascension : les acheter
                        maintenant reviendrait à les perdre au cycle suivant.
                    </p>
                )}

                <RebirthPanel />
                <DangerZone />
            </div>
        </main>
    );
}
