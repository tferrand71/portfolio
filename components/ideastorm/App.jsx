import React, { useEffect, useRef } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import Header from "./components/Header.jsx";
import MediaOverlay from "./components/MediaOverlay.jsx";
import Particles from "./components/Particles.jsx";
import Toasts from "./components/Toasts.jsx";
import EndingModal from "./components/EndingModal.jsx";
import EasterEggModal from "./components/EasterEggModal.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AuthForm from "./pages/AuthForm.jsx";
import Game from "./pages/Game.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Shop from "./pages/Shop.jsx";
import { ENDING_THRESHOLD } from "./data/upgrades.js";
import { endgameUnlocked, hasUnlockedEasterEgg } from "./lib/engine.js";
import useStore from "./store/useStore.js";

/** Intervalle de la production automatique. */
const TICK_MS = 200;

/** Intervalle de sauvegarde. */
const AUTOSAVE_MS = 10000;

/**
 * Boucle de jeu et sauvegarde.
 *
 * Un seul intervalle pour chaque, montés une fois. La version précédente
 * lançait un autosave de 5 s depuis le store (jamais arrêté au démontage) et
 * un second de 10 s depuis le composant : les deux écrivaient en parallèle.
 */
function GameLoop() {
    const tick = useStore((s) => s.tick);
    const save = useStore((s) => s.save);
    // Initialisé dans l'effet : lire l'horloge pendant le rendu rendrait le
    // composant impur (React Compiler le refuse, à raison).
    const lastTick = useRef(0);

    useEffect(() => {
        // On mesure le temps réellement écoulé : un onglet en arrière-plan voit
        // ses timers ralentis à une fois par seconde, compter les tics ferait
        // perdre de la production.
        lastTick.current = performance.now();

        const id = setInterval(() => {
            const now = performance.now();
            const dt = (now - lastTick.current) / 1000;
            lastTick.current = now;
            tick(dt);
        }, TICK_MS);

        const onVisible = () => {
            // Au réveil de l'onglet, on repart de maintenant : `tick` borne
            // déjà le rattrapage, inutile de créditer le temps hors ligne ici.
            lastTick.current = performance.now();
        };
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [tick]);

    useEffect(() => {
        const id = setInterval(() => {
            save().catch(() => {});
        }, AUTOSAVE_MS);

        // Dernière écriture quand l'onglet part : `pagehide` est le seul
        // événement fiable sur Safari iOS, où `beforeunload` ne se déclenche pas.
        const flush = () => {
            if (document.visibilityState === "hidden") save().catch(() => {});
        };
        document.addEventListener("visibilitychange", flush);
        window.addEventListener("pagehide", flush);

        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", flush);
            window.removeEventListener("pagehide", flush);
            save().catch(() => {});
        };
    }, [save]);

    return null;
}

/**
 * Les deux scènes du jeu, une seule à l'écran à la fois.
 *
 * Les deux exigent la dernière ascension. L'écran de fin (1e90) ouvre ce
 * dernier cycle, l'easter egg le referme ; un joueur qui remplirait les deux
 * conditions d'un coup les voit dans l'ordre plutôt que superposées.
 */
function Cutscenes() {
    const score = useStore((s) => s.score);
    const rebirthCount = useStore((s) => s.rebirthCount);
    const hasSeenEnding = useStore((s) => s.hasSeenEnding);
    const hasSeenEasterEgg = useStore((s) => s.hasSeenEasterEgg);
    // Les deux scènes appartiennent au dernier cycle : rien ne se joue tant
    // qu'il reste une ascension à faire.
    const lastCycle = useStore((s) => endgameUnlocked(s));
    const eggUnlocked = useStore((s) => hasUnlockedEasterEgg(s));
    const loaded = useStore((s) => s.loaded);
    const closeEnding = useStore((s) => s.closeEnding);
    const closeEasterEgg = useStore((s) => s.closeEasterEgg);

    if (!loaded) return null;

    if (!hasSeenEnding && lastCycle && score >= ENDING_THRESHOLD) {
        return <EndingModal score={score} rebirthCount={rebirthCount} onClose={closeEnding} />;
    }
    if (!hasSeenEasterEgg && eggUnlocked) {
        return <EasterEggModal score={score} rebirthCount={rebirthCount} onClose={closeEasterEgg} />;
    }
    return null;
}

/** Redirige vers la connexion, en gardant la destination initiale. */
function RequireAuth({ children }) {
    const status = useStore((s) => s.status);
    const location = useLocation();

    if (status === "loading") {
        return (
            <main className="is-page is-page--center">
                <p className="is-hint">
                    <span className="is-spin">◆</span> Chargement de ta partie…
                </p>
            </main>
        );
    }
    if (status !== "authenticated") {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return children;
}

/** Empêche d'afficher les formulaires quand on est déjà connecté. */
function RequireGuest({ children }) {
    const status = useStore((s) => s.status);
    if (status === "authenticated") return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    const bootstrap = useStore((s) => s.bootstrap);
    const showMedia = useStore((s) => s.showMedia);
    const authenticated = useStore((s) => s.status === "authenticated");

    // Le serveur, et lui seul, dit qui est connecté (cookie httpOnly).
    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    return (
        <HashRouter>
            {showMedia && <Particles />}
            {showMedia && authenticated && <MediaOverlay />}
            {authenticated && <GameLoop />}
            <Cutscenes />

            <Header />

            <Routes>
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Game />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/boutique"
                    element={
                        <RequireAuth>
                            <Shop />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/classement"
                    element={
                        <RequireAuth>
                            <Leaderboard />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <RequireAuth>
                            <AdminPanel />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RequireGuest>
                            <AuthForm mode="login" />
                        </RequireGuest>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RequireGuest>
                            <AuthForm mode="signup" />
                        </RequireGuest>
                    }
                />
                {/* Les anciens liens (#/pages, #/leaderboard) restent valides. */}
                <Route path="/pages" element={<Navigate to="/boutique" replace />} />
                <Route path="/leaderboard" element={<Navigate to="/classement" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toasts />
        </HashRouter>
    );
}
