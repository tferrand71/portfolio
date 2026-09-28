import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useStore from "../store/useStore.js";

/**
 * Connexion et inscription partagent le même formulaire : mêmes champs, mêmes
 * états, seuls les libellés et l'appel changent. L'inscription applique en
 * amont les règles que le serveur validera de toute façon (app/api/ideastorm/
 * signup) — le contrôle client n'est qu'un confort, jamais une garantie.
 */
export default function AuthForm({ mode }) {
    const isSignup = mode === "signup";

    const signIn = useStore((s) => s.signIn);
    const signUp = useStore((s) => s.signUp);
    const toast = useStore((s) => s.toast);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    const validate = () => {
        if (!username.trim() || !password) return "Renseigne un pseudo et un mot de passe.";
        if (!isSignup) return null;
        if (username.trim().length < 3 || username.trim().length > 20)
            return "Le pseudo doit faire entre 3 et 20 caractères.";
        if (!/^[a-zA-Z0-9_-]+$/.test(username.trim()))
            return "Le pseudo n'accepte que lettres, chiffres, tirets et underscores.";
        if (password.length < 8) return "Le mot de passe doit faire au moins 8 caractères.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (busy) return;

        const localError = validate();
        if (localError) {
            setError(localError);
            return;
        }

        setBusy(true);
        setError(null);
        try {
            const user = isSignup
                ? await signUp(username.trim(), password)
                : await signIn(username.trim(), password);
            toast(isSignup ? `Bienvenue, ${user.username} !` : `Content de te revoir, ${user.username}.`, "success");
            navigate("/");
        } catch (err) {
            setError(err.message || "Une erreur est survenue.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="is-page is-page--center">
            <form className="is-card" onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                <h1 className="is-title">{isSignup ? "Créer un compte" : "Connexion"}</h1>
                <p className="is-subtitle">
                    {isSignup
                        ? "Ta partie est enregistrée sur le serveur : tu la retrouves depuis n'importe quel navigateur."
                        : "Reprends ta partie là où tu l'as laissée."}
                </p>

                {error && <div className="is-error">{error}</div>}

                <div className="is-field">
                    <label className="is-label" htmlFor="is-username">
                        Pseudo
                    </label>
                    <input
                        id="is-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        autoCapitalize="none"
                        spellCheck={false}
                        disabled={busy}
                        required
                    />
                </div>

                <div className="is-field">
                    <label className="is-label" htmlFor="is-password">
                        Mot de passe
                    </label>
                    <input
                        id="is-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        disabled={busy}
                        required
                    />
                    {isSignup && <p className="is-hint">Huit caractères minimum.</p>}
                </div>

                <button type="submit" className="is-btn is-btn--primary is-btn--block" disabled={busy}>
                    {busy ? "…" : isSignup ? "Créer mon compte" : "Se connecter"}
                </button>

                <p className="is-switch-link">
                    {isSignup ? (
                        <>
                            Déjà un compte ? <Link to="/login">Se connecter</Link>
                        </>
                    ) : (
                        <>
                            Pas encore de compte ? <Link to="/signup">En créer un</Link>
                        </>
                    )}
                </p>
            </form>
        </main>
    );
}
