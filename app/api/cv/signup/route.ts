import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/cv/db";
import { createSession } from "@/lib/cv/session";

export async function POST(request: Request) {
    let body: { username?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    const username = (body.username ?? "").trim();
    const password = body.password ?? "";

    if (username.length < 3 || username.length > 20) {
        return NextResponse.json({ error: "Le pseudo doit faire entre 3 et 20 caractères." }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return NextResponse.json({ error: "Lettres, chiffres, tirets et underscores uniquement." }, { status: 400 });
    }
    if (password.length < 8) {
        return NextResponse.json({ error: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 });
    }

    try {
        const [user] = await query<{ id: number; username: string; role: string }>(
            `INSERT INTO cv_users (username, password_hash) VALUES ($1, $2)
             RETURNING id, username, role`,
            [username, await bcrypt.hash(password, 12)]
        );

        // Chaque compte démarre avec un document vide qui lui est propre.
        await query(`INSERT INTO cv_documents (user_id, data) VALUES ($1, '{}'::jsonb)`, [user.id]);

        await createSession({ userId: user.id, username: user.username, role: "player" });
        return NextResponse.json({ id: user.id, username: user.username });
    } catch (err) {
        if (typeof err === "object" && err && "code" in err && err.code === "23505") {
            return NextResponse.json({ error: "Ce pseudo est déjà pris." }, { status: 409 });
        }
        console.error("[cv/signup]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
