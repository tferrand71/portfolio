// Appels réseau de CV Creator. Le CV est rattaché au compte via un cookie
// httpOnly : le client n'envoie jamais d'identifiant d'utilisateur.
const API = "/api/cv";

async function request(path, options = {}) {
    const res = await fetch(`${API}${path}`, { credentials: "same-origin", ...options });
    let payload = null;
    try {
        payload = await res.json();
    } catch {
        throw new Error("Réponse illisible du serveur.");
    }
    if (!res.ok) {
        const err = new Error(payload?.error || "Une erreur est survenue.");
        err.status = res.status;
        throw err;
    }
    return payload;
}

export const signIn = (username, password) =>
    request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

export const signUp = (username, password) =>
    request("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

export const signOut = () => request("/logout", { method: "POST" });

/** Renvoie null si personne n'est connecté, au lieu de lever une erreur. */
export async function fetchDocument() {
    try {
        return await request("/document");
    } catch (err) {
        if (err.status === 401) return null;
        throw err;
    }
}

export const saveDocument = (data) =>
    request("/document", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
    });
