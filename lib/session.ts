import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

export type Session = {
    userId: number;
    username: string;
    role: "player" | "admin";
};

function secret() {
    // Partagée par toutes les démos du portfolio (l'ancien nom reste accepté).
    const value = process.env.SESSION_SECRET ?? process.env.IDEASTORM_SESSION_SECRET;
    if (!value || value.length < 32) {
        throw new Error(
            "SESSION_SECRET manquante ou trop courte (32 caractères minimum). Génère-la avec : openssl rand -base64 32"
        );
    }
    return new TextEncoder().encode(value);
}

/**
 * Chaque démo du portfolio a son propre cookie de session : une session
 * IdeaStorm ne donne aucun accès à CV Creator, et réciproquement.
 */
export function createSessionHelpers(cookieName: string) {
    return {
        async create(session: Session) {
            const token = await new SignJWT(session)
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime(`${MAX_AGE}s`)
                .sign(secret());

            (await cookies()).set(cookieName, token, {
                httpOnly: true, // inaccessible au JavaScript de la page
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: MAX_AGE,
            });
        },

        /** Seule source de vérité sur l'identité de l'appelant. */
        async get(): Promise<Session | null> {
            const token = (await cookies()).get(cookieName)?.value;
            if (!token) return null;
            try {
                const { payload } = await jwtVerify(token, secret());
                return {
                    userId: Number(payload.userId),
                    username: String(payload.username),
                    role: payload.role === "admin" ? "admin" : "player",
                };
            } catch {
                return null; // signature invalide ou jeton expiré
            }
        },

        async destroy() {
            (await cookies()).delete(cookieName);
        },
    };
}
