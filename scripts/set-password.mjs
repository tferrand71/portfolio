#!/usr/bin/env node
/**
 * Change le mot de passe d'un compte IdeaStorm, ou son rôle.
 * Le jeu n'offre pas cet écran : c'est l'outil d'administration en attendant.
 *
 *   export $(grep -v '^#' .env.local | xargs)
 *
 *   node scripts/set-password.mjs <pseudo> <nouveau_mot_de_passe>
 *   node scripts/set-password.mjs <pseudo> <nouveau_mot_de_passe> --admin
 *   node scripts/set-password.mjs --list
 *
 * Le mot de passe est haché en bcrypt (coût 12) avant écriture : il n'est
 * jamais stocké en clair, contrairement à l'ancienne base Supabase.
 */

import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Charge .env.local sans dépendance ni gymnastique shell : la connection string
// Neon contient des ? et des & que `export $(... | xargs)` découperait mal.
try {
    process.loadEnvFile(".env.local");
} catch {
    // Pas de .env.local : on se rabat sur les variables déjà présentes
    // dans l'environnement (cas de la CI ou de `vercel env pull`).
}


if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL manquante. Renseigne DATABASE_URL dans .env.local (à la racine du projet).");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const args = process.argv.slice(2);

try {
    if (args.includes("--list")) {
        const { rows } = await pool.query(
            `SELECT u.id, u.username, u.role, g.score, g.rebirth_count
             FROM ideastorm_users u
             LEFT JOIN ideastorm_game_state g ON g.user_id = u.id
             ORDER BY u.id`
        );
        console.table(rows);
        process.exit(0);
    }

    const [username, password] = args;
    const makeAdmin = args.includes("--admin");

    if (!username || !password) {
        console.error("Usage : node scripts/set-password.mjs <pseudo> <nouveau_mot_de_passe> [--admin]");
        process.exit(1);
    }
    if (password.length < 8) {
        console.error("Le mot de passe doit faire au moins 8 caractères (même règle que l'inscription).");
        process.exit(1);
    }

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
        `UPDATE ideastorm_users
         SET password_hash = $1,
             role = CASE WHEN $2 THEN 'admin' ELSE role END
         WHERE username = $3
         RETURNING id, username, role`,
        [hash, makeAdmin, username]
    );

    if (rows.length === 0) {
        console.error(`Aucun compte nommé « ${username} ».`);
        process.exit(1);
    }

    const user = rows[0];
    console.log(`✓ ${user.username} — mot de passe mis à jour, rôle : ${user.role}`);
} catch (err) {
    console.error("Erreur :", err.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
