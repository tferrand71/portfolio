import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import useStore from "../store/useStore.js";

/** Indique si la partie est à jour en base, sans jamais bloquer le jeu. */
function SaveIndicator() {
    const saving = useStore((s) => s.saving);
    const dirty = useStore((s) => s.dirty);
    const saveError = useStore((s) => s.saveError);

    const { modifier, label } = saveError
        ? { modifier: "is-save-dot--error", label: "Sauvegarde en échec" }
        : saving || dirty
          ? { modifier: "is-save-dot--pending", label: "Sauvegarde en cours" }
          : { modifier: "", label: "Partie sauvegardée" };

    return <span className={`is-save-dot ${modifier}`} title={label} role="status" aria-label={label} />;
}

export default function Header() {
    const user = useStore((s) => s.user);
    const signOut = useStore((s) => s.signOut);
    const showMedia = useStore((s) => s.showMedia);
    const hasTrophy = useStore((s) => s.hasSeenEasterEgg);
    const toggleMedia = useStore((s) => s.toggleMedia);
    const toast = useStore((s) => s.toast);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        toast("À bientôt !", "info");
        navigate("/login");
    };

    const linkClass = ({ isActive }) => `is-nav-link${isActive ? " is-active" : ""}`;

    return (
        <header className="is-header">
            <NavLink to="/" className="is-brand">
                <span className="is-brand-mark" aria-hidden="true">
                    ◆
                </span>
                IdeaStorm
            </NavLink>

            {user && (
                <nav className="is-nav">
                    <NavLink to="/" end className={linkClass}>
                        Jeu
                    </NavLink>
                    <NavLink to="/boutique" className={linkClass}>
                        Boutique
                    </NavLink>
                    <NavLink to="/classement" className={linkClass}>
                        Classement
                    </NavLink>
                    {/* Le rôle vient du cookie de session, vérifié à nouveau côté
                        serveur sur chaque route admin : masquer ce lien n'est
                        qu'un confort d'affichage, pas un contrôle d'accès. */}
                    {user.role === "admin" && (
                        <NavLink to="/admin" className={({ isActive }) => `${linkClass({ isActive })} is-nav-link--admin`}>
                            Admin
                        </NavLink>
                    )}
                </nav>
            )}

            <div className="is-header-right">
                {user ? (
                    <>
                        <SaveIndicator />
                        {hasTrophy && (
                            <span
                                className="is-trophy"
                                title="Cartographe du Grand Tout — boutique entièrement vidée"
                                aria-label="Cartographe du Grand Tout"
                            >
                                👑
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={toggleMedia}
                            className="is-btn is-btn--ghost is-btn--sm"
                            aria-pressed={showMedia}
                            title={showMedia ? "Masquer les décorations" : "Afficher les décorations"}
                            style={{ padding: "5px 9px" }}
                        >
                            {showMedia ? "👁️" : "🚫"}
                        </button>
                        <span className="is-avatar" aria-hidden="true">
                            {user.username.charAt(0).toUpperCase()}
                        </span>
                        <span className="is-username">{user.username}</span>
                        <button type="button" onClick={handleSignOut} className="is-btn is-btn--ghost is-btn--sm">
                            Quitter
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="is-btn is-btn--ghost is-btn--sm">
                            Connexion
                        </NavLink>
                        <NavLink to="/signup" className="is-btn is-btn--primary is-btn--sm">
                            Inscription
                        </NavLink>
                    </>
                )}
            </div>
        </header>
    );
}
