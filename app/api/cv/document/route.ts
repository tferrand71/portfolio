import { NextResponse } from "next/server";
import { query } from "@/lib/cv/db";
import { getSession } from "@/lib/cv/session";

const noStore = { "Cache-Control": "no-store" };

/**
 * Renvoie le CV du compte porté par le cookie de session, et lui seul.
 * Aucun identifiant n'est accepté depuis le client : impossible de demander
 * le document de quelqu'un d'autre.
 */
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Non authentifié." }, { status: 401, headers: noStore });
    }

    try {
        const [row] = await query<{ data: Record<string, unknown>; updated_at: string }>(
            `SELECT data, updated_at FROM cv_documents WHERE user_id = $1`,
            [session.userId]
        );
        return NextResponse.json(
            {
                user: { id: session.userId, username: session.username },
                data: row?.data ?? {},
                updatedAt: row?.updated_at ?? null,
            },
            { headers: noStore }
        );
    } catch (err) {
        console.error("[cv/document GET]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Non authentifié." }, { status: 401, headers: noStore });
    }

    let body: { data?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
        return NextResponse.json({ error: "Document invalide." }, { status: 400 });
    }

    const serialized = JSON.stringify(body.data);
    // Les photos sont embarquées en base64 : on plafonne pour éviter qu'un
    // document ne gonfle indéfiniment.
    if (serialized.length > 2_000_000) {
        return NextResponse.json(
            { error: "CV trop volumineux (2 Mo max). Réduis la taille de la photo." },
            { status: 413 }
        );
    }

    try {
        await query(
            `INSERT INTO cv_documents (user_id, data, updated_at)
             VALUES ($1, $2::jsonb, NOW())
             ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
            [session.userId, serialized]
        );
        return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
    } catch (err) {
        console.error("[cv/document PUT]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
