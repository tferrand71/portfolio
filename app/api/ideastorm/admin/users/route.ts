import { NextResponse } from "next/server";
import { query } from "@/lib/ideastorm/db";
import { getSession } from "@/lib/ideastorm/session";

// L'ancien api.php exposait admin_list sans aucun contrôle : n'importe qui
// pouvait lister les comptes. Le rôle est désormais vérifié côté serveur.
export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    if (session.role !== "admin") return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

    try {
        const rows = await query<{ id: number; username: string; score: string; rebirth_count: number }>(
            `SELECT u.id, u.username, g.score, g.rebirth_count
             FROM ideastorm_users u
             LEFT JOIN ideastorm_game_state g ON g.user_id = u.id
             ORDER BY g.score DESC NULLS LAST`
        );
        return NextResponse.json(
            rows.map((r) => ({ id: r.id, username: r.username, score: Number(r.score ?? 0), rebirth_count: r.rebirth_count ?? 0 }))
        );
    } catch (err) {
        console.error("[ideastorm/admin/users]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
