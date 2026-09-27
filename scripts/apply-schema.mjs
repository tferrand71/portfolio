#!/usr/bin/env node
/** Applique lib/ideastorm/schema.sql sur la base pointée par DATABASE_URL. */
import { readFileSync } from "node:fs";
import { Pool } from "pg";

try { process.loadEnvFile(".env.local"); } catch {}

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL manquante dans .env.local");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

try {
    const sql = readFileSync("lib/ideastorm/schema.sql", "utf-8");
    const result = await pool.query(sql);
    const last = Array.isArray(result) ? result.at(-1) : result;
    console.log("✓ Schéma appliqué.\n");
    if (last?.rows?.length) console.table(last.rows);
} catch (err) {
    console.error("Erreur :", err.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
