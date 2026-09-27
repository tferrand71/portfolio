// Appels réseau du jeu. Les anciennes actions api.php sont remplacées par les
// Route Handlers Next (app/api/ideastorm/*). La session vit dans un cookie
// httpOnly posé par le serveur : aucun identifiant ne transite plus côté client.
const API_URL = "/api/ideastorm";

async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        credentials: "same-origin",
        ...options,
    });

    // Le serveur répond toujours en JSON, y compris pour les erreurs.
    let payload = null;
    try {
        payload = await res.json();
    } catch {
        throw new Error("Réponse illisible du serveur.");
    }

    if (!res.ok) {
        throw new Error(payload?.error || "Une erreur est survenue.");
    }
    return payload;
}

export const signIn = (username, password) =>
    request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

export const signUp = (username, password) =>
    request("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

export const signOut = () => request("/logout", { method: "POST" });

export const fetchLeaderboard = async () => {
    try {
        return await request("/leaderboard");
    } catch (err) {
        console.error("Erreur leaderboard:", err);
        return [];
    }
};
