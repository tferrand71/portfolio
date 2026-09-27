import { Pool } from "pg";

// Fluid Compute réutilise les instances de fonction entre requêtes : on garde
// le pool sur globalThis pour ne pas rouvrir une connexion à chaque invocation
// (et pour survivre au hot reload en développement).
const globalForPg = globalThis as unknown as { ideastormPool?: Pool };

/**
 * Le pool est créé à la première requête, jamais à l'import : sinon `next build`
 * échoue en collectant les routes alors qu'aucune base n'est configurée.
 */
function getPool(): Pool {
    if (globalForPg.ideastormPool) return globalForPg.ideastormPool;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error(
            "DATABASE_URL manquante. Ajoute la connection string Neon dans .env.local (local) et dans les variables d'environnement Vercel (déploiement)."
        );
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }, // Neon impose TLS
        max: 3,
        idleTimeoutMillis: 10_000,
    });

    globalForPg.ideastormPool = pool;
    return pool;
}

/**
 * Toutes les requêtes passent par ici, en paramétré.
 * Les valeurs ne sont jamais concaténées dans le SQL : c'est ce qui remplace
 * les requêtes construites par interpolation de l'ancien api.php.
 */
export async function query<T = Record<string, unknown>>(
    text: string,
    params: unknown[] = []
): Promise<T[]> {
    const res = await getPool().query(text, params);
    return res.rows as T[];
}
