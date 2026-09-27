import { NextResponse } from "next/server";
import { query } from "@/lib/ideastorm/db";
import { getSession } from "@/lib/ideastorm/session";

// Équivalent de admin_update_stats, mais réservé aux administrateurs.
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    if (session.role !== "admin") return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

    let body: { user_id?: unknown; score?: unknown; save_data?: Record<string, unknown> };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const userId = Number(body.user_id);
    const score = Number(body.score);
    if (!Number.isInteger(userId)) return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
    if (!Number.isFinite(score) || score < 0) return NextResponse.json({ error: "Score invalide." }, { status: 400 });

    const saveData = body.save_data ?? {};
    const rebirthCount = Number((saveData as { rebirthCount?: unknown }).rebirthCount ?? 0);

    try {
        await query(
            `UPDATE ideastorm_game_state
             SET save_data = $1::jsonb, score = $2, rebirth_count = $3, updated_at = NOW()
             WHERE user_id = $4`,
            [JSON.stringify(saveData), score, Number.isInteger(rebirthCount) ? rebirthCount : 0, userId]
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[ideastorm/admin/stats]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
