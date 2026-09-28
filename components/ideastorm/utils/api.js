// =====================================================================
//  IdeaStorm — appels réseau
//
//  L'ancien backend PHP acceptait un `user_id` dans le corps de la requête.
//  Il est remplacé par les Route Handlers Next (app/api/ideastorm/*), qui
//  lisent l'identité dans un cookie httpOnly : plus aucun identifiant ne
//  transite côté client, et le client ne peut pas se faire passer pour un
//  autre compte.
// =====================================================================

const API_URL = "/api/ideastorm";

/** Erreur réseau portant le code HTTP, pour que le store distingue un 401. */
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

async function request(path, options = {}) {
    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            credentials: "same-origin",
            cache: "no-store",
            ...options,
        });
    } catch {
        throw new ApiError("Serveur injoignable. Vérifie ta connexion.", 0);
    }

    let payload = null;
    try {
        payload = await res.json();
    } catch {
        throw new ApiError("Réponse illisible du serveur.", res.status);
    }

    if (!res.ok) {
        throw new ApiError(payload?.error || "Une erreur est survenue.", res.status);
    }
    return payload;
}

const postJson = (path, body) =>
    request(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

/** Qui est connecté, d'après le cookie. `null` si personne. */
export async function fetchMe() {
    try {
        const { user } = await request("/me");
        return user ?? null;
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null;
        throw err;
    }
}

export const signIn = (username, password) => postJson("/login", { username, password });
export const signUp = (username, password) => postJson("/signup", { username, password });
export const signOut = () => request("/logout", { method: "POST" });

export const loadGame = () => request("/load");
export const saveGame = (payload) => postJson("/save", payload);

export const fetchLeaderboard = () => request("/leaderboard");

// --- Administration ---------------------------------------------------
export const fetchPlayers = () => request("/admin/users");
export const loadPlayerSave = (userId) => request(`/load?userId=${encodeURIComponent(userId)}`);
export const savePlayer = (payload) => postJson("/admin/stats", payload);
