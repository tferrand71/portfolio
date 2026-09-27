#!/usr/bin/env node
/**
 * Reprise des comptes IdeaStorm vers Neon.
 *
 * Le script ne se connecte à aucune ancienne base : il lit deux exports que tu
 * produis toi-même, en JSON ou en CSV. Aucun identifiant d'ancienne base ne
 * transite donc par ici.
 *
 * ── Export depuis Supabase ────────────────────────────────────────────
 *   Table Editor → table `users`      → ⋯ → Download as CSV
 *                                      → scripts/dump-users.csv
 *   Table Editor → table `game_state` → ⋯ → Download as CSV
 *                                      → scripts/dump-game-state.csv
 *
 * ── Export depuis MySQL / MariaDB ─────────────────────────────────────
 *   docker exec docker-web-db-1 mariadb -uroot -p<mdp> <base> \
 *     -e "SELECT * FROM users" --json > scripts/dump-users.json
 *
 * ── Lancer ────────────────────────────────────────────────────────────
 *   export $(grep -v '^#' .env.local | xargs)
 *   node scripts/migrate-ideastorm.mjs
 *
 * Mots de passe :
 *   • déjà en bcrypt ($2a$/$2b$/$2y$) → repris tels quels ;
 *   • en clair (cas de Supabase)      → hachés en bcrypt ici même, le joueur
 *                                       garde son mot de passe et le stockage
 *                                       devient correct ;
 *   • absent / vide                   → hash impossible, réinitialisation requise.
 */

import { readFileSync, existsSync } from "node:fs";
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


// Comptes à ne pas reprendre : essais de développement et pseudos qui n'ont
// pas leur place dans le classement public d'un portfolio.
// Ajoute ou retire un pseudo ici, la comparaison ignore la casse.
const EXCLUDED = new Set(["test", "1234", "bite", "toto", "toto1"]);

// --dry-run : affiche ce qui serait migré sans toucher à la base.
const DRY_RUN = process.argv.includes("--dry-run");

const CANDIDATES = {
    users: ["scripts/dump-users.json", "scripts/dump-users.csv"],
    state: ["scripts/dump-game-state.json", "scripts/dump-game-state.csv"],
};

// Colonnes qui ont leur propre place dans le nouveau schéma : tout le reste
// part dans save_data.
const STATE_OWN_COLUMNS = new Set(["id", "user_id", "score", "rebirth_count", "created_at", "updated_at"]);

/* ---------------------------------------------------------------- lecture */

function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quoted) {
            if (c === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i++;
                } else quoted = false;
            } else field += c;
        } else if (c === '"') {
            quoted = true;
        } else if (c === ",") {
            row.push(field);
            field = "";
        } else if (c === "\n" || c === "\r") {
            if (field !== "" || row.length) {
                row.push(field);
                rows.push(row);
                row = [];
                field = "";
            }
            if (c === "\r" && text[i + 1] === "\n") i++;
        } else field += c;
    }
    if (field !== "" || row.length) {
        row.push(field);
        rows.push(row);
    }

    const [header, ...body] = rows;
    if (!header) return [];
    return body.map((cells) =>
        Object.fromEntries(header.map((h, i) => [h.trim(), cells[i] ?? ""]))
    );
}

function load(paths, label) {
    const file = paths.find(existsSync);
    if (!file) {
        console.error(`Aucun export trouvé pour ${label}. Attendu : ${paths.join(" ou ")}`);
        process.exit(1);
    }
    const text = readFileSync(file, "utf-8");
    let rows;
    if (file.endsWith(".csv")) {
        rows = parseCsv(text);
    } else {
        const raw = JSON.parse(text);
        // phpMyAdmin enveloppe les lignes dans un objet {type:"table", data:[...]}
        rows = Array.isArray(raw)
            ? raw.find((e) => e && e.type === "table" && Array.isArray(e.data))?.data ?? raw
            : raw.data ?? [];
    }
    console.log(`  ${file} → ${rows.length} ligne(s)`);
    return rows;
}

/* ------------------------------------------------------------ conversions */

const isBcrypt = (h) => typeof h === "string" && /^\$2[aby]\$/.test(h);
const UNUSABLE = "$2b$12$" + "x".repeat(53);

/**
 * La table Supabase a 95 colonnes à plat en snake_case, le store Zustand des
 * clés en camelCase, et les deux nommages ont divergé (click_500k_cost vs
 * click500kCost, god_click_aa_cost vs godClickAACost). Plutôt que de deviner,
 * on indexe les clés réellement utilisées par le jeu et on rapproche les deux
 * par une forme normalisée (minuscules, sans séparateurs).
 */
function buildStoreIndex() {
    const src = readFileSync("components/ideastorm/store/useStore.js", "utf-8");
    const keys = new Set();
    for (const m of src.matchAll(/\b([a-z][a-zA-Z0-9]*)\s*:/g)) keys.add(m[1]);
    for (const m of src.matchAll(/'([a-z][a-zA-Z0-9]*)'/g)) keys.add(m[1]);
    const index = new Map();
    for (const k of keys) index.set(normalize(k), k);
    return index;
}

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const STORE_INDEX = buildStoreIndex();
let droppedColumns = new Set();

function coerce(value) {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value !== "string") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    // JSON embarqué (active_media, save_data sérialisé…)
    if (/^[[{]/.test(value)) {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    if (/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(value)) {
        const n = Number(value);
        if (Number.isFinite(n)) return n;
    }
    return value;
}

/**
 * Reconstruit save_data quel que soit le schéma d'origine :
 *   • MySQL      → une colonne save_data déjà en JSON ;
 *   • Supabase   → des colonnes à plat (per_click, per_second, active_media…),
 *                  converties en camelCase, comme les attend le store Zustand.
 */
function buildSaveData(state) {
    if (!state) return {};

    if (state.save_data !== undefined && state.save_data !== null && state.save_data !== "") {
        const parsed = coerce(state.save_data);
        if (parsed && typeof parsed === "object") return parsed;
    }

    const data = {};
    for (const [key, value] of Object.entries(state)) {
        if (STATE_OWN_COLUMNS.has(key) || key === "save_data") continue;

        const storeKey = STORE_INDEX.get(normalize(key));
        if (!storeKey) {
            // Colonnes d'une version antérieure du jeu (*_threshold, god_*_zz…) :
            // le store ne les connaît plus, on ne pollue pas save_data avec.
            droppedColumns.add(key);
            continue;
        }

        const parsed = coerce(value);
        if (parsed !== null) data[storeKey] = parsed;
    }
    return data;
}

/* ------------------------------------------------------------- migration */

if (!process.env.DATABASE_URL && !DRY_RUN) {
    console.error("DATABASE_URL manquante. Renseigne DATABASE_URL dans .env.local (à la racine du projet).");
    console.error("Ou simule sans base :  node scripts/migrate-ideastorm.mjs --dry-run");
    process.exit(1);
}

console.log("Lecture des exports :");
const users = load(CANDIDATES.users, "users");
const states = load(CANDIDATES.state, "game_state");
const stateByUser = new Map(states.map((s) => [String(s.user_id), s]));

// En simulation, aucune connexion n'est ouverte : un client factice rejoue la
// même séquence de requêtes pour vérifier la transformation des données.
let fakeId = 0;
const fakeClient = {
    query: async (sql) => (/RETURNING id/.test(sql) ? { rows: [{ id: ++fakeId }] } : { rows: [] }),
    release: () => {},
};

const pool = DRY_RUN
    ? { connect: async () => fakeClient, end: async () => {} }
    : new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

let migrated = 0;
let rehashed = 0;
let resets = 0;
let skipped = 0;
let excluded = 0;

const client = await pool.connect();
try {
    await client.query("BEGIN");
    console.log(DRY_RUN ? "\nSimulation (aucune écriture) :" : "\nMigration :");

    for (const u of users) {
        const username = String(u.username ?? "").trim();
        if (!username) {
            skipped++;
            continue;
        }
        if (EXCLUDED.has(username.toLowerCase())) {
            console.log(`  – ${username} : exclu`);
            excluded++;
            continue;
        }

        const stored = u.password_hash ?? u.password;
        let finalHash;
        if (isBcrypt(stored)) {
            finalHash = stored;
        } else if (typeof stored === "string" && stored.length > 0) {
            // Supabase stockait le mot de passe en clair : on le hache ici.
            finalHash = await bcrypt.hash(stored, 12);
            rehashed++;
        } else {
            finalHash = UNUSABLE;
            resets++;
            console.warn(`  ! ${username} : aucun mot de passe exploitable → réinitialisation requise`);
        }

        const { rows } = await client.query(
            `INSERT INTO ideastorm_users (username, password_hash, role)
             VALUES ($1, $2, 'player')
             ON CONFLICT (username) DO NOTHING
             RETURNING id`,
            [username, finalHash]
        );
        if (rows.length === 0) {
            console.warn(`  ~ ${username} : existe déjà, ignoré`);
            skipped++;
            continue;
        }

        const newId = rows[0].id;
        const state = stateByUser.get(String(u.id));
        const saveData = buildSaveData(state);

        const score = Number(state?.score ?? saveData.score ?? 0);
        const rebirth = Number(state?.rebirth_count ?? saveData.rebirthCount ?? 0);

        await client.query(
            `INSERT INTO ideastorm_game_state (user_id, save_data, score, rebirth_count)
             VALUES ($1, $2::jsonb, $3, $4)
             ON CONFLICT (user_id) DO NOTHING`,
            [
                newId,
                JSON.stringify(saveData),
                Number.isFinite(score) ? score : 0,
                Number.isInteger(rebirth) ? rebirth : 0,
            ]
        );

        migrated++;
        console.log(`  ✓ ${username} (score ${score}, rebirth ${rebirth})`);
    }

    await client.query("COMMIT");
} catch (err) {
    await client.query("ROLLBACK");
    console.error("\nMigration annulée, rien n'a été écrit :", err.message);
    process.exitCode = 1;
} finally {
    client.release();
    await pool.end();
}

console.log(
    `\n${migrated} compte(s) migré(s) — ${rehashed} mot(s) de passe haché(s) au passage, ` +
    `${resets} à réinitialiser, ${excluded} exclu(s), ${skipped} ignoré(s).`
);
if (droppedColumns.size) {
    console.log(
        `${droppedColumns.size} colonne(s) obsolète(s) écartée(s) (inconnues du store actuel) : ` +
        [...droppedColumns].slice(0, 5).join(", ") + (droppedColumns.size > 5 ? "…" : "")
    );
}
