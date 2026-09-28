import { NextResponse } from "next/server";
import { getSession } from "@/lib/ideastorm/session";

/**
 * Qui est connecté, d'après le cookie de session.
 *
 * Le client se fiait au localStorage pour savoir s'il était connecté : quand
 * le cookie expirait, le jeu affichait une partie vierge à 0 point pendant que
 * chaque sauvegarde repartait en 401, sans que le joueur soit averti. Cette
 * route donne au navigateur la seule réponse qui fasse autorité.
 */
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    return NextResponse.json(
        {
            user: {
                id: session.userId,
                username: session.username,
                role: session.role,
            },
        },
        { headers: { "Cache-Control": "no-store" } }
    );
}
