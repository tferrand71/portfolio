-- =====================================================================
--  CV Creator — installation de la base (PostgreSQL / Neon)
--  Idempotent : relançable sans risque.
-- =====================================================================

-- Comptes propres à CV Creator : aucun lien avec ceux d'IdeaStorm.
CREATE TABLE IF NOT EXISTS cv_users (
    id            SERIAL PRIMARY KEY,
    username      TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    role          TEXT        NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'admin')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Un CV par compte. La clé primaire sur user_id garantit qu'un utilisateur
-- ne peut pas se retrouver avec le document d'un autre.
CREATE TABLE IF NOT EXISTS cv_documents (
    user_id    INTEGER     PRIMARY KEY REFERENCES cv_users(id) ON DELETE CASCADE,
    data       JSONB       NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT u.id, u.username, u.created_at, (d.user_id IS NOT NULL) AS a_un_cv
FROM cv_users u
LEFT JOIN cv_documents d ON d.user_id = u.id
ORDER BY u.id;
