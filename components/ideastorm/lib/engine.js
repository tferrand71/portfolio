// =====================================================================
//  IdeaStorm — moteur de jeu (fonctions pures, aucun état, aucun réseau)
//
//  Le principe qui structure ce fichier : l'état persisté ne contient que
//  ce qui ne se déduit pas. Concrètement, on sauvegarde le nombre
//  d'exemplaires possédés de chaque amélioration (`owned`), et on recalcule
//  prix, points par clic et points par seconde à partir de là.
//
//  La version précédente faisait l'inverse : elle stockait le prix courant
//  et modifiait perClick/perSecond au fil des achats. Trois conséquences,
//  toutes observées dans le jeu :
//    * revendre une amélioration après un multiplicateur ×2 retirait le bonus
//      brut, donc rendait moins que ce que l'achat avait apporté ;
//    * la boutique devinait « déjà acheté ? » en comparant le prix courant au
//      prix de base, une heuristique fausse dès la première ascension ;
//    * un prix absent de la sauvegarde donnait `undefined`, donc un bouton
//      actif qui ne faisait rien.
// =====================================================================

import {
    CLICK_UPGRADES,
    ENDGAME_COST_FLOOR,
    FINAL_UPGRADE_IDS,
    REBIRTH_MAX,
    AUTO_UPGRADES,
    MULTIPLIERS,
    COMPANIONS,
    UPGRADE_BY_ID,
    COST_GROWTH,
    BASE_PER_CLICK,
    SCORE_MAX,
} from "../data/upgrades.js";

/** Convertit n'importe quelle entrée en nombre fini, sinon renvoie le défaut. */
export function toNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

/**
 * Borne le score : au-delà de SCORE_MAX un flottant devient Infinity, puis NaN
 * à la première soustraction.
 *
 * Infinity est ramené au plafond, pas à zéro : un dépassement doit coûter la
 * précision du score, jamais le score lui-même.
 */
export function clampScore(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return 0;
    if (n < 0) return 0;
    return n > SCORE_MAX ? SCORE_MAX : n;
}

/** Multiplicateur de production apporté par les ascensions. */
export function powerMultiplier(rebirthCount) {
    return Math.pow(50, Math.max(0, toNumber(rebirthCount, 0)));
}

/** Multiplicateur de prix apporté par les ascensions. */
export function costMultiplier(rebirthCount) {
    const r = Math.max(0, toNumber(rebirthCount, 0));
    return r === 0 ? 1 : r + 2;
}

/**
 * Prix du prochain exemplaire d'une amélioration.
 * Renvoie Infinity si le prix dépasse la précision d'un flottant : l'appelant
 * affiche alors le palier comme épuisé plutôt qu'un bouton cassé.
 */
export function upgradeCost(id, owned, rebirthCount) {
    const def = UPGRADE_BY_ID[id];
    if (!def) return Infinity;
    const growth = def.growth ?? COST_GROWTH;
    const count = Math.max(0, toNumber(owned, 0));
    const cost = def.baseCost * costMultiplier(rebirthCount) * Math.pow(growth, count);
    return Number.isFinite(cost) ? cost : Infinity;
}

/** Produit des multiplicateurs possédés pour une cible ("click" ou "auto"). */
function multiplierFactor(owned, target) {
    return MULTIPLIERS.filter((m) => m.target === target).reduce(
        (acc, m) => acc * Math.pow(m.factor, Math.max(0, toNumber(owned[m.id], 0))),
        1
    );
}

/**
 * Points par clic.
 * (base + Σ bonus possédés + bonus accordé par un admin) × multiplicateurs × ascension
 */
export function computePerClick(state) {
    const owned = state.owned ?? {};
    const sum = CLICK_UPGRADES.reduce(
        (acc, u) => acc + Math.max(0, toNumber(owned[u.id], 0)) * u.bonus,
        0
    );
    const raw =
        (BASE_PER_CLICK + sum + toNumber(state.grantedPerClick, 0)) *
        multiplierFactor(owned, "click") *
        powerMultiplier(state.rebirthCount);
    return clampScore(Math.max(BASE_PER_CLICK, raw));
}

/**
 * Points par seconde.
 * (Σ bonus auto + Σ bonus compagnons + bonus admin) × multiplicateurs × ascension
 */
export function computePerSecond(state) {
    const owned = state.owned ?? {};
    const autoSum = AUTO_UPGRADES.reduce(
        (acc, u) => acc + Math.max(0, toNumber(owned[u.id], 0)) * u.bonus,
        0
    );
    const companionSum = COMPANIONS.reduce(
        (acc, c) => acc + (owned[c.id] ? c.bonus : 0),
        0
    );
    const raw =
        (autoSum + companionSum + toNumber(state.grantedPerSecond, 0)) *
        multiplierFactor(owned, "auto") *
        powerMultiplier(state.rebirthCount);
    return clampScore(Math.max(0, raw));
}

/** Recalcule perClick et perSecond après toute modification de `owned`. */
export function withDerivedStats(state) {
    return {
        ...state,
        perClick: computePerClick(state),
        perSecond: computePerSecond(state),
    };
}

/** État d'une partie neuve, ou d'une partie après ascension. */
export function createGameState(rebirthCount = 0) {
    return withDerivedStats({
        score: 0,
        owned: {},
        grantedPerClick: 0,
        grantedPerSecond: 0,
        rebirthCount: Math.max(0, toNumber(rebirthCount, 0)),
        hasSeenEnding: false,
        hasSeenEasterEgg: false,
    });
}

// ---------------------------------------------------------------------
//  Reprise des sauvegardes de l'ancien format
// ---------------------------------------------------------------------

/**
 * Nombre d'exemplaires déduit d'un prix sauvegardé.
 * L'ancien format ne stockait que le prix courant, obtenu en multipliant le
 * prix de base par 1.5 à chaque achat : on inverse l'opération.
 */
function ownedFromLegacyCost(id, savedCost, rebirthCount) {
    const def = UPGRADE_BY_ID[id];
    const cost = toNumber(savedCost, 0);
    if (!def || cost <= 0) return 0;

    const base = def.baseCost * costMultiplier(rebirthCount);
    if (base <= 0) return 0;

    const growth = def.growth ?? COST_GROWTH;
    const count = Math.log(cost / base) / Math.log(growth);
    if (!Number.isFinite(count)) return 0;
    return Math.max(0, Math.round(count));
}

/**
 * Convertit une sauvegarde (ancien ou nouveau format) en état de jeu.
 *
 * Sur les sauvegardes d'origine, l'échelle de prix et la puissance ne sont pas
 * toujours cohérentes : le panneau d'administration écrasait `perClick` sans
 * toucher aux prix, et `resetGame` ne remettait qu'une partie des clés. Une
 * partie en base porte ainsi un `multX2Cost` de 3,2e122 — environ 250 achats
 * d'un multiplicateur ×2 — pour un `perClick` de 6.
 *
 * On ne peut donc pas restituer les deux. La règle retenue : ce que le joueur
 * voit fait foi (score, puissance, ascensions, compagnons). L'échelle de prix
 * est reprise quand elle est compatible avec cette puissance, et repart de
 * zéro quand elle la contredit. L'écart résiduel est porté par
 * `grantedPerClick`/`grantedPerSecond`, le même champ qu'alimente le panneau
 * d'administration quand il accorde de la puissance.
 */
export function migrateSave(raw) {
    const save = raw && typeof raw === "object" ? raw : {};
    const rebirthCount = Math.max(
        0,
        Math.round(toNumber(save.rebirthCount ?? save.rebirth_count, 0))
    );

    // Format actuel : `owned` est présent, rien à déduire.
    if (save.owned && typeof save.owned === "object") {
        const owned = {};
        for (const [id, count] of Object.entries(save.owned)) {
            if (UPGRADE_BY_ID[id]) owned[id] = Math.max(0, Math.round(toNumber(count, 0)));
        }
        return withDerivedStats({
            score: clampScore(save.score),
            owned,
            grantedPerClick: toNumber(save.grantedPerClick, 0),
            grantedPerSecond: toNumber(save.grantedPerSecond, 0),
            rebirthCount,
            hasSeenEnding: save.hasSeenEnding === true,
            hasSeenEasterEgg: save.hasSeenEasterEgg === true,
        });
    }

    // Ancien format : on reconstruit `owned` à partir des prix sauvegardés.
    const owned = {};
    for (const [id, def] of Object.entries(UPGRADE_BY_ID)) {
        if (def.flag) {
            if (save[def.flag] === true) owned[id] = 1;
        } else if (save[id] !== undefined) {
            const count = ownedFromLegacyCost(id, save[id], rebirthCount);
            if (count > 0) owned[id] = count;
        }
    }

    const power = powerMultiplier(rebirthCount);
    const companionSum = COMPANIONS.reduce((a, c) => a + (owned[c.id] ? c.bonus : 0), 0);

    /** Les compagnons ne comptent que dans la production automatique. */
    const companionRaw = (target) => (target === "auto" ? companionSum : 0);

    /**
     * Cale le bonus fixe d'une catégorie sur la puissance sauvegardée.
     * Si l'échelle de prix reconstituée produit déjà plus que cette puissance,
     * c'est qu'elle est corrompue : on la remet à zéro plutôt que d'inventer
     * un bonus négatif, qui s'annulerait de toute façon avec la somme au
     * premier arrondi flottant.
     */
    const reconcile = (target, list, legacyPower, floor) => {
        const multipliers = MULTIPLIERS.filter((m) => m.target === target);
        const sumOf = () => list.reduce((a, u) => a + (owned[u.id] ?? 0) * u.bonus, 0);

        let targetRaw = legacyPower / (multiplierFactor(owned, target) * power);
        if (Number.isFinite(targetRaw) && targetRaw >= floor + sumOf() + companionRaw(target)) {
            return targetRaw - floor - sumOf() - companionRaw(target);
        }

        // Échelle incompatible : on repart de prix de base pour cette catégorie.
        for (const u of list) delete owned[u.id];
        for (const m of multipliers) delete owned[m.id];
        targetRaw = legacyPower / power;
        return Math.max(0, targetRaw - floor - companionRaw(target));
    };

    const legacyPerClick = toNumber(save.perClick, 0);
    const legacyPerSecond = toNumber(save.perSecond, 0);

    const grantedPerClick =
        legacyPerClick > 0 ? reconcile("click", CLICK_UPGRADES, legacyPerClick, BASE_PER_CLICK) : 0;
    const grantedPerSecond =
        legacyPerSecond > 0 ? reconcile("auto", AUTO_UPGRADES, legacyPerSecond, 0) : 0;

    return withDerivedStats({
        owned,
        rebirthCount,
        score: clampScore(save.score),
        grantedPerClick: Number.isFinite(grantedPerClick) ? Math.max(0, grantedPerClick) : 0,
        grantedPerSecond: Number.isFinite(grantedPerSecond) ? Math.max(0, grantedPerSecond) : 0,
        hasSeenEnding: save.hasSeenEnding === true,
        hasSeenEasterEgg: save.hasSeenEasterEgg === true,
    });
}

// ---------------------------------------------------------------------
//  Administration
// ---------------------------------------------------------------------

/**
 * Force les points par clic à une valeur donnée.
 *
 * La puissance étant dérivée des améliorations possédées, on ne peut pas
 * écrire `perClick` directement : on ajuste le bonus fixe pour que le calcul
 * retombe sur la valeur demandée. C'est ce qui permet au panneau
 * d'administration d'accorder de la puissance sans corrompre l'échelle des
 * prix — le défaut exact de l'ancien panneau.
 */
export function withPerClick(state, value) {
    const target = Math.max(0, toNumber(value, 0));
    const sum = CLICK_UPGRADES.reduce((a, u) => a + (state.owned?.[u.id] ?? 0) * u.bonus, 0);
    const divisor = multiplierFactor(state.owned ?? {}, "click") * powerMultiplier(state.rebirthCount);
    const granted = target / divisor - BASE_PER_CLICK - sum;
    return withDerivedStats({
        ...state,
        grantedPerClick: Number.isFinite(granted) ? Math.max(0, granted) : 0,
    });
}

/** Même principe que withPerClick, pour la production automatique. */
export function withPerSecond(state, value) {
    const target = Math.max(0, toNumber(value, 0));
    const owned = state.owned ?? {};
    const sum =
        AUTO_UPGRADES.reduce((a, u) => a + (owned[u.id] ?? 0) * u.bonus, 0) +
        COMPANIONS.reduce((a, c) => a + (owned[c.id] ? c.bonus : 0), 0);
    const divisor = multiplierFactor(owned, "auto") * powerMultiplier(state.rebirthCount);
    const granted = target / divisor - sum;
    return withDerivedStats({
        ...state,
        grantedPerSecond: Number.isFinite(granted) ? Math.max(0, granted) : 0,
    });
}

/** Ce qui part en base : uniquement les champs non déductibles. */
export function serializeSave(state) {
    return {
        owned: state.owned ?? {},
        grantedPerClick: toNumber(state.grantedPerClick, 0),
        grantedPerSecond: toNumber(state.grantedPerSecond, 0),
        rebirthCount: Math.max(0, Math.round(toNumber(state.rebirthCount, 0))),
        hasSeenEnding: state.hasSeenEnding === true,
        hasSeenEasterEgg: state.hasSeenEasterEgg === true,
        // Recopiés pour rester lisibles depuis la base et le panneau admin,
        // mais jamais relus tels quels : ils sont recalculés au chargement.
        perClick: computePerClick(state),
        perSecond: computePerSecond(state),
    };
}

// ---------------------------------------------------------------------
//  Aides d'affichage
// ---------------------------------------------------------------------

/**
 * Un palier réservé à la fin du jeu ?
 *
 * Ces paliers coûtent plus cher qu'une ascension : les acheter avant la
 * dernière revient à les payer pour les perdre au cycle suivant.
 */
export function isEndgameUpgrade(def) {
    return def.baseCost > ENDGAME_COST_FLOOR;
}

/** Le joueur a-t-il accès aux paliers de fin de jeu ? */
export function endgameUnlocked(state) {
    return toNumber(state.rebirthCount, 0) >= REBIRTH_MAX;
}

/**
 * Paliers scellés : invisibles, mais comptés pour que la boutique puisse dire
 * qu'il reste quelque chose derrière.
 *
 * Un palier déjà possédé n'est jamais scellé, même hors du dernier cycle : une
 * sauvegarde ancienne peut en contenir, et masquer une amélioration dont le
 * bonus compte encore rendrait l'état du joueur invisible.
 */
export function sealedUpgrades(list, state) {
    if (endgameUnlocked(state)) return [];
    const owned = state.owned ?? {};
    return list.filter((def) => isEndgameUpgrade(def) && !(owned[def.id] > 0));
}

/**
 * Améliorations à montrer dans la boutique.
 *
 * L'ancienne version affichait une fenêtre glissante de quatre lignes, dont la
 * position était devinée en comparant le prix courant au prix de base — un
 * calcul faux dès la première ascension, qui pouvait masquer des paliers déjà
 * débloqués. On se base désormais sur ce que le joueur possède et sur ce qu'il
 * peut viser : tout ce qui est acquis, tout ce qui est à portée, plus les deux
 * paliers suivants pour donner un objectif.
 */
export function visibleUpgrades(list, state) {
    const owned = state.owned ?? {};
    const score = toNumber(state.score, 0);
    const reach = Math.max(score * 8, 1);
    const endgame = endgameUnlocked(state);

    const visible = [];
    let lookahead = 2;

    for (const def of list) {
        // Paliers de fin de jeu : scellés tant qu'il reste une ascension,
        // sauf ceux déjà possédés — on montre toujours ce qu'on détient.
        if (!endgame && isEndgameUpgrade(def) && !(owned[def.id] > 0)) continue;
        const count = owned[def.id] ?? 0;
        const cost = upgradeCost(def.id, count, state.rebirthCount);

        if (count > 0 || cost <= reach) {
            visible.push(def);
            lookahead = 2;
        } else if (lookahead > 0) {
            visible.push(def);
            lookahead -= 1;
        }
    }
    return visible;
}

/**
 * La boutique est-elle entièrement vidée ?
 *
 * C'est la condition de l'easter egg : posséder les deux paliers Centillion,
 * les derniers des deux échelles. Un score élevé ne suffit pas — il faut avoir
 * dépensé.
 */
export function hasCompletedShop(state) {
    const owned = state.owned ?? {};
    return FINAL_UPGRADE_IDS.every((id) => (owned[id] ?? 0) > 0);
}

/**
 * L'easter egg est-il débloqué ?
 *
 * Il exige les deux conditions de fin de jeu à la fois : être allé au bout des
 * ascensions, et avoir vidé la boutique à ce dernier palier d'ascension. Un
 * joueur qui termine la boutique à la cinquième ascension ne le verra pas —
 * il lui reste une ascension à faire, donc une boutique à revider.
 */
export function hasUnlockedEasterEgg(state) {
    return toNumber(state.rebirthCount, 0) >= REBIRTH_MAX && hasCompletedShop(state);
}

/**
 * Prochain palier hors de portée, pour la barre de progression de l'accueil.
 * Renvoie null quand tout est déjà accessible.
 */
export function nextMilestone(state, lists) {
    const endgame = endgameUnlocked(state);
    let best = null;
    for (const list of lists) {
        for (const def of list) {
            // Ne jamais pointer vers un palier que la boutique n'affiche pas.
            if (!endgame && isEndgameUpgrade(def) && !(state.owned?.[def.id] > 0)) continue;
            const cost = upgradeCost(def.id, state.owned?.[def.id] ?? 0, state.rebirthCount);
            if (!Number.isFinite(cost) || cost <= state.score) continue;
            if (!best || cost < best.cost) best = { def, cost };
        }
    }
    return best;
}
