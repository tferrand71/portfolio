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
    if (!username || !password) {
        return NextResponse.json({ error: "Pseudo et mot de passe requis." }, { status: 400 });
    }

    try {
        const [user] = await query<{ id: number; username: string; password_hash: string }>(
            `SELECT id, username, password_hash FROM cv_users WHERE username = $1`,
            [username]
        );

        const invalid = NextResponse.json({ error: "Pseudo ou mot de passe incorrect." }, { status: 401 });
        if (!user) {
            await bcrypt.compare(password, "$2a$12$invalidsaltinvalidsaltinvalidsaltinvalidsaltinvalidsa");
            return invalid;
        }
        if (!(await bcrypt.compare(password, user.password_hash))) return invalid;

        await createSession({ userId: user.id, username: user.username, role: "player" });
        return NextResponse.json({ id: user.id, username: user.username });
    } catch (err) {
        console.error("[cv/login]", err);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
