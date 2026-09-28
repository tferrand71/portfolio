import { NextResponse } from "next/server";
import { query } from "@/lib/ideastorm/db";
import { getSession } from "@/lib/ideastorm/session";

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

    let body: { score?: unknown; save_data?: Record<string, unknown> };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    // Le user_id éventuellement envoyé par le client est ignoré : on écrit
    // toujours sur le compte porté par le cookie de session.
    // `JSON.stringify` transforme Infinity et NaN en `null`. `Number(null)`
    // vaut 0 : une partie dont le score aurait débordé côté client était donc
    // enregistrée à zéro, sans erreur. On exige un vrai nombre.
    const rawScore = body.score;
    const score =
        typeof rawScore === "number"
            ? rawScore
            : typeof rawScore === "string" && rawScore.trim() !== ""
              ? Number(rawScore)
              : Number.NaN;
    if (!Number.isFinite(score) || score < 0) {
        return NextResponse.json({ error: "Score invalide." }, { status: 400 });
    }

    const saveData = body.save_data ?? {};
    const rebirthCount = Number((saveData as { rebirthCount?: unknown }).rebirthCount ?? 0);

    try {
        // UPDATE seul ne touchait aucune ligne quand la partie n'existait pas
        // encore, tout en répondant « success » : l'écriture était perdue en
        // silence. L'upsert crée la ligne au lieu de faire semblant.
        await query(
            `INSERT INTO ideastorm_game_state (user_id, save_data, score, rebirth_count, updated_at)
             VALUES ($4, $1::jsonb, $2, $3, NOW())
             ON CONFLICT (user_id) DO UPDATE
             SET save_data = EXCLUDED.save_data,
                 score = EXCLUDED.score,
                 rebirth_count = EXCLUDED.rebirth_count,
                 updated_at = NOW()`,
            [JSON.stringify(saveData), score, Number.isInteger(rebirthCount) ? rebirthCount : 0, session.userId]
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[ideastorm/save]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
