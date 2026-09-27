import { NextResponse } from "next/server";
import { query } from "@/lib/ideastorm/db";

// Classement public : pas de session requise, et aucune donnée sensible exposée.
export async function GET() {
    try {
        const rows = await query<{ username: string; score: string; rebirth_count: number }>(
            `SELECT u.username, g.score, g.rebirth_count
             FROM ideastorm_game_state g
             JOIN ideastorm_users u ON u.id = g.user_id
             ORDER BY g.rebirth_count DESC, g.score DESC
             LIMIT 50`
        );
        return NextResponse.json(
            rows.map((r) => ({ username: r.username, score: Number(r.score), rebirth_count: r.rebirth_count })),
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (err) {
        console.error("[ideastorm/leaderboard]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
