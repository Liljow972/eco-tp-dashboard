-- ============================================
-- SOLUTION RAPIDE - ÉTAPE 4 CORRIGÉE
-- ============================================

-- OPTION 1: Si la colonne s'appelle "title" au lieu de "name"
-- (C'est probablement le cas)

INSERT INTO project_steps (
    project_id,
    title,           -- ⚠️ Changé de "name" à "title"
    description,
    status,
    order_index
) VALUES 
(
    '4b368734-376a-44ad-b169-99b592c46b58',  -- ⚠️ REMPLACEZ PAR VOTRE PROJECT_ID
    'Lancement',
    'Validation du projet et préparation',
    'completed',
    1
),
(
    '4b368734-376a-44ad-b169-99b592c46b58',  -- ⚠️ REMPLACEZ PAR VOTRE PROJECT_ID
    'Travaux',
    'Exécution des travaux de terrassement',
    'in_progress',
    2
),
(
    '4b368734-376a-44ad-b169-99b592c46b58',  -- ⚠️ REMPLACEZ PAR VOTRE PROJECT_ID
    'Livraison',
    'Réception finale et validation',
    'pending',
    3
);

-- ============================================
-- OPTION 2: Version minimale (si OPTION 1 ne fonctionne pas)
-- ============================================

/*
INSERT INTO project_steps (project_id, status, order_index) VALUES 
('VOTRE_PROJECT_ID', 'completed', 1),
('VOTRE_PROJECT_ID', 'in_progress', 2),
('VOTRE_PROJECT_ID', 'pending', 3);
*/

-- ============================================
-- INSTRUCTIONS
-- ============================================

-- 1. Remplacez '4b368734-376a-44ad-b169-99b592c46b58' par votre project_id
--    (celui que vous avez copié à l'étape 3)

-- 2. Essayez d'abord OPTION 1 (avec "title")

-- 3. Si ça ne fonctionne pas, essayez OPTION 2 (version minimale)

-- 4. Vérifiez le résultat:
SELECT * FROM project_steps WHERE project_id = 'VOTRE_PROJECT_ID';
