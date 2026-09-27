import { NextResponse } from "next/server";
import { query } from "@/lib/ideastorm/db";
import { getSession } from "@/lib/ideastorm/session";

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    // Un joueur ne lit que sa propre sauvegarde. Seul un admin peut viser
    // un autre compte (c'est ce que fait le panneau d'administration).
    const requested = new URL(request.url).searchParams.get("userId");
    let targetId = session.userId;
    if (requested) {
        if (session.role !== "admin") {
            return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
        }
        const parsed = Number(requested);
        if (!Number.isInteger(parsed)) {
            return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
        }
        targetId = parsed;
    }

    try {
        const [row] = await query<{ save_data: Record<string, unknown>; score: string; rebirth_count: number }>(
            `SELECT save_data, score, rebirth_count FROM ideastorm_game_state WHERE user_id = $1`,
            [targetId]
        );
        if (!row) return NextResponse.json({});

        return NextResponse.json(
            {
                ...(row.save_data ?? {}),
                score: Number(row.score),
                rebirth_count: row.rebirth_count,
            },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (err) {
        console.error("[ideastorm/load]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
