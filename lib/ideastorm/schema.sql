-- =====================================================================
--  IdeaStorm — installation complète de la base (PostgreSQL / Neon)
--
--  À coller tel quel dans :  Vercel → Storage → ta base Neon → SQL Editor
--  ou à exécuter avec      :  psql "$DATABASE_URL" -f lib/ideastorm/schema.sql
--
--  Le script est idempotent : tu peux le relancer sans rien casser.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------
-- Reprend les deux tables de l'ancien api.php, avec trois différences :
--   * password_hash contient un hash bcrypt, jamais un mot de passe en clair ;
--   * une colonne role porte l'autorisation (l'ancien panneau admin n'en avait aucune) ;
--   * score est NUMERIC et non BIGINT : le jeu monte à 1e300, un BIGINT déborderait.

CREATE TABLE IF NOT EXISTS ideastorm_users (
    id            SERIAL PRIMARY KEY,
    username      TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    role          TEXT        NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'admin')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ideastorm_game_state (
    user_id       INTEGER     PRIMARY KEY REFERENCES ideastorm_users(id) ON DELETE CASCADE,
    save_data     JSONB       NOT NULL DEFAULT '{}'::jsonb,
    score         NUMERIC     NOT NULL DEFAULT 0,
    rebirth_count INTEGER     NOT NULL DEFAULT 0,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tri du classement : rebirth d'abord, score ensuite.
CREATE INDEX IF NOT EXISTS ideastorm_leaderboard_idx
    ON ideastorm_game_state (rebirth_count DESC, score DESC);


-- ---------------------------------------------------------------------
-- 2. COMPTE ADMINISTRATEUR DE DÉPART
-- ---------------------------------------------------------------------
--   identifiant   : admin
--   mot de passe  : ChangeMoi2026!
--
--   ⚠️  Connecte-toi une fois, puis change ce mot de passe depuis le jeu.
--       Ce hash est publié dans ton dépôt Git : considère-le comme connu de tous.

INSERT INTO ideastorm_users (username, password_hash, role)
VALUES ('admin', '$2b$12$HS53uSsYHZeukEgzp6e6/evUVco9nMOTCVBTrNhcDOxF095O03nfe', 'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO ideastorm_game_state (user_id, save_data, score, rebirth_count)
SELECT id, '{}'::jsonb, 0, 0 FROM ideastorm_users WHERE username = 'admin'
ON CONFLICT (user_id) DO NOTHING;


-- ---------------------------------------------------------------------
-- 3. VÉRIFICATION
-- ---------------------------------------------------------------------
SELECT u.id, u.username, u.role, g.score, g.rebirth_count
FROM ideastorm_users u
LEFT JOIN ideastorm_game_state g ON g.user_id = u.id
ORDER BY u.id;


-- ---------------------------------------------------------------------
-- MÉMO
-- ---------------------------------------------------------------------
-- Promouvoir un joueur administrateur :
--     UPDATE ideastorm_users SET role = 'admin' WHERE username = 'ton_pseudo';
--
-- Repartir de zéro (efface tout, les sauvegardes suivent par CASCADE) :
--     TRUNCATE ideastorm_users RESTART IDENTITY CASCADE;
