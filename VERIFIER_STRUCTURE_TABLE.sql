-- ============================================
-- VÉRIFIER LA STRUCTURE DE LA TABLE project_steps
-- ============================================

-- Exécutez cette requête pour voir les colonnes de la table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'project_steps'
ORDER BY ordinal_position;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Vous devriez voir toutes les colonnes disponibles
-- Par exemple:
-- column_name    | data_type | is_nullable
-- ---------------|-----------|------------
-- id             | uuid      | NO
-- project_id     | uuid      | YES
-- title          | text      | YES  (ou "name")
-- description    | text      | YES
-- status         | text      | YES
-- order_index    | integer   | YES
-- created_at     | timestamp | YES
-- updated_at     | timestamp | YES

-- ============================================
-- SI LA COLONNE S'APPELLE "title" AU LIEU DE "name"
-- ============================================
-- Utilisez cette requête à la place:

/*
INSERT INTO project_steps (
    project_id,
    title,           -- ⚠️ Changé de "name" à "title"
    description,
    status,
    order_index
) VALUES 
(
    'VOTRE_PROJECT_ID',  -- ⚠️ REMPLACEZ
    'Lancement',
    'Validation du projet et préparation',
    'completed',
    1
),
(
    'VOTRE_PROJECT_ID',  -- ⚠️ REMPLACEZ
    'Travaux',
    'Exécution des travaux de terrassement',
    'in_progress',
    2
),
(
    'VOTRE_PROJECT_ID',  -- ⚠️ REMPLACEZ
    'Livraison',
    'Réception finale et validation',
    'pending',
    3
);
*/

-- ============================================
-- OU SI LA TABLE N'A PAS CES COLONNES DU TOUT
-- ============================================
-- Créez d'abord la table avec la bonne structure:

/*
CREATE TABLE IF NOT EXISTS project_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/
