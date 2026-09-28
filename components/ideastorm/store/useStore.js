// =====================================================================
//  IdeaStorm — état global (zustand)
//
//  Ce store ne contient plus une méthode par palier d'amélioration : il lit
//  data/upgrades.js et délègue tout calcul à lib/engine.js. Les composants
//  s'y abonnent avec un sélecteur (`useStore((s) => s.score)`) pour que le
//  tick de jeu ne provoque pas le rendu de toute l'application.
// =====================================================================

import { create } from "zustand";

import { REBIRTH_MAX, REBIRTH_REQUIREMENT, UPGRADE_BY_ID } from "../data/upgrades.js";
import {
    clampScore,
    createGameState,
    migrateSave,
    serializeSave,
    upgradeCost,
    withDerivedStats,
} from "../lib/engine.js";
import * as api from "../utils/api.js";

/** Un tick plus long que ça vient d'un onglet mis en veille : on le borne. */
const MAX_TICK_SECONDS = 60;

let toastId = 0;

/** Les seuls champs qui décrivent la partie. Isolés pour ne jamais réécrire
 *  les actions du store en même temps que l'état. */
const gameFields = (s) => ({
    score: s.score,
    owned: s.owned,
    grantedPerClick: s.grantedPerClick,
    grantedPerSecond: s.grantedPerSecond,
    rebirthCount: s.rebirthCount,
    hasSeenEnding: s.hasSeenEnding,
});

export const useStore = create((set, get) => ({
    // --- Session -----------------------------------------------------
    // "loading" tant qu'on n'a pas demandé au serveur qui est connecté.
    // L'identité n'est jamais déduite du localStorage : le cookie httpOnly
    // fait foi. L'ancienne version affichait une partie à 0 point quand le
    // cookie avait expiré, pendant que chaque sauvegarde renvoyait 401.
    status: "loading",
    user: null,

    // --- Partie ------------------------------------------------------
    ...createGameState(0),
    /** Passe à true quand la sauvegarde distante est chargée. Tant qu'il est
     *  false, aucune écriture n'est envoyée : c'est ce qui empêche d'écraser
     *  la partie en base par un état neuf. */
    loaded: false,
    /** Une modification attend d'être sauvegardée. */
    dirty: false,
    saving: false,
    savedAt: null,
    saveError: null,

    // --- Interface ---------------------------------------------------
    showMedia: true,
    toasts: [],

    // -----------------------------------------------------------------
    //  Notifications
    // -----------------------------------------------------------------
    toast: (message, tone = "info") => {
        const id = ++toastId;
        set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
        setTimeout(() => get().dismissToast(id), 4000);
        return id;
    },
    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    toggleMedia: () => set((s) => ({ showMedia: !s.showMedia })),

    // -----------------------------------------------------------------
    //  Session
    // -----------------------------------------------------------------
    /** Premier appel au montage : c'est le serveur qui dit qui est connecté. */
    bootstrap: async () => {
        try {
            const user = await api.fetchMe();
            if (!user) {
                set({ status: "guest", user: null, loaded: false });
                return;
            }
            set({ status: "authenticated", user });
            await get().loadGame();
        } catch {
            set({ status: "guest", user: null, loaded: false });
        }
    },

    signIn: async (username, password) => {
        const user = await api.signIn(username, password);
        set({ status: "authenticated", user });
        await get().loadGame();
        return user;
    },

    signUp: async (username, password) => {
        const user = await api.signUp(username, password);
        set({ status: "authenticated", user });
        await get().loadGame();
        return user;
    },

    signOut: async () => {
        // On pousse une dernière fois la partie avant de perdre le cookie.
        await get().save({ force: true }).catch(() => {});
        try {
            await api.signOut();
        } catch {
            // Le cookie est httpOnly : sans le serveur on ne peut pas l'effacer,
            // mais on remet quand même l'interface à l'état déconnecté.
        }
        set({ status: "guest", user: null, loaded: false, dirty: false, ...createGameState(0) });
    },

    // -----------------------------------------------------------------
    //  Chargement / sauvegarde
    // -----------------------------------------------------------------
    loadGame: async () => {
        try {
            const raw = await api.loadGame();
            set({ ...migrateSave(raw), loaded: true, dirty: false, saveError: null });
        } catch (err) {
            // Session expirée pendant la partie : on repasse en invité plutôt
            // que de laisser jouer sur un état qui ne sera jamais sauvegardé.
            if (err?.status === 401) {
                set({ status: "guest", user: null, loaded: false });
                return;
            }
            set({ loaded: false, saveError: "Impossible de charger la partie." });
        }
    },

    /**
     * Rejette la partie en mémoire et repart de celle du serveur.
     *
     * Utilisé après une modification depuis le panneau d'administration
     * portant sur son propre compte : sans ça, la sauvegarde automatique du
     * jeu — qui tourne toujours avec l'état d'avant — réécrit l'ancien score
     * par-dessus dans les secondes qui suivent.
     *
     * `dirty` est remis à false avant le chargement, pour qu'un autosave qui
     * se déclencherait entre-temps n'envoie rien.
     */
    resyncFromServer: async () => {
        set({ dirty: false });
        await get().loadGame();
    },

    /** `force` ignore le drapeau `dirty` (déconnexion, ascension, fermeture). */
    save: async ({ force = false } = {}) => {
        const s = get();
        if (!s.user || !s.loaded) return;
        if (!force && !s.dirty) return;

        set({ saving: true, dirty: false });
        try {
            await api.saveGame({ score: s.score, save_data: serializeSave(s) });
            set({ saving: false, savedAt: Date.now(), saveError: null });
        } catch (err) {
            // La modification n'est pas passée : on la remet en attente.
            set({ saving: false, dirty: true, saveError: "Sauvegarde impossible." });
            if (err?.status === 401) set({ status: "guest", user: null, loaded: false });
            throw err;
        }
    },

    // -----------------------------------------------------------------
    //  Boucle de jeu
    // -----------------------------------------------------------------
    click: () =>
        set((s) =>
            s.loaded ? { score: clampScore(s.score + s.perClick), dirty: true } : {}
        ),

    /**
     * Avance la production automatique du nombre de secondes écoulées.
     * L'appelant mesure le temps réel plutôt que de compter les tics : un
     * onglet en arrière-plan voit ses timers ralentis par le navigateur.
     */
    tick: (seconds) =>
        set((s) => {
            if (!s.loaded || s.perSecond <= 0) return {};
            const dt = Math.min(Math.max(seconds, 0), MAX_TICK_SECONDS);
            if (dt <= 0) return {};
            return { score: clampScore(s.score + s.perSecond * dt), dirty: true };
        }),

    // -----------------------------------------------------------------
    //  Achats
    // -----------------------------------------------------------------
    buy: (id) => {
        const def = UPGRADE_BY_ID[id];
        if (!def) return false;

        const s = get();
        if (!s.loaded) return false;

        // Achat unique pour les compagnons.
        if (def.flag && s.owned[id]) return false;

        const cost = upgradeCost(id, s.owned[id] ?? 0, s.rebirthCount);
        if (!Number.isFinite(cost) || s.score < cost) return false;

        const owned = { ...s.owned, [id]: (s.owned[id] ?? 0) + 1 };
        set({
            ...withDerivedStats({ ...gameFields(s), score: clampScore(s.score - cost), owned }),
            dirty: true,
        });
        return true;
    },

    /** Revend un exemplaire. Le remboursement est la moitié du prix payé. */
    sell: (id) => {
        const s = get();
        const count = s.owned[id] ?? 0;
        if (!s.loaded || count <= 0) return false;

        const refund = upgradeCost(id, count - 1, s.rebirthCount) / 2;
        const owned = { ...s.owned };
        if (count === 1) delete owned[id];
        else owned[id] = count - 1;

        set({
            ...withDerivedStats({
                ...gameFields(s),
                score: clampScore(s.score + (Number.isFinite(refund) ? refund : 0)),
                owned,
            }),
            dirty: true,
        });
        return true;
    },

    // -----------------------------------------------------------------
    //  Ascension et remise à zéro
    // -----------------------------------------------------------------
    canRebirth: () => {
        const s = get();
        return s.loaded && s.score >= REBIRTH_REQUIREMENT && s.rebirthCount < REBIRTH_MAX;
    },

    rebirth: async () => {
        if (!get().canRebirth()) return false;
        const next = get().rebirthCount + 1;
        // Les deux scènes se voient une fois pour la vie du compte, pas une
        // fois par cycle : une ascension remet le score à zéro, sans elles on
        // les rejouerait à chaque passage.
        const { hasSeenEnding, hasSeenEasterEgg } = get();
        // On attend la confirmation du serveur avant d'annoncer l'ascension :
        // l'ancienne version rechargeait la page sans attendre la réponse,
        // et pouvait perdre le rebirth.
        set({ ...createGameState(next), hasSeenEnding, hasSeenEasterEgg, loaded: true, dirty: true });
        await get().save({ force: true });
        return true;
    },

    resetGame: async () => {
        const s = get();
        if (!s.user || !s.loaded) return false;
        set({ ...createGameState(0), loaded: true, dirty: true });
        await get().save({ force: true });
        return true;
    },

    closeEnding: () => set({ hasSeenEnding: true, dirty: true }),
    closeEasterEgg: () => set({ hasSeenEasterEgg: true, dirty: true }),
}));

export default useStore;
