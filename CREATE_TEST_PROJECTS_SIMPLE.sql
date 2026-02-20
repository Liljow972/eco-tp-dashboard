-- ============================================
-- SCRIPT SIMPLIFIÉ: CRÉER UN PROJET DE TEST
-- ============================================
-- Version sans updated_at pour éviter les erreurs

-- 1. D'abord, voir les utilisateurs disponibles
SELECT id, email, raw_user_meta_data->>'name' as name 
FROM auth.users;

-- 2. Créer un projet de test
-- IMPORTANT: Remplacez 'VOTRE_CLIENT_ID' par l'ID d'un utilisateur client de la requête ci-dessus

INSERT INTO projects (
    client_id,
    name,
    status,
    progress,
    budget,
    spent,
    start_date,
    end_date
) VALUES (
    'VOTRE_CLIENT_ID',  -- ⚠️ REMPLACEZ PAR L'ID DU CLIENT
    'Villa Moderne - Terrassement',
    'in_progress',
    45,
    35000,
    15000,
    '2024-02-01',
    '2024-05-01'
) RETURNING *;

-- 3. Créer les étapes du projet
-- IMPORTANT: Remplacez 'VOTRE_PROJECT_ID' par l'ID du projet retourné ci-dessus

INSERT INTO project_steps (
    project_id,
    name,
    description,
    status,
    order_index
) VALUES 
(
    'VOTRE_PROJECT_ID',  -- ⚠️ REMPLACEZ PAR L'ID DU PROJET
    'Lancement',
    'Validation du projet et préparation',
    'completed',
    1
),
(
    'VOTRE_PROJECT_ID',  -- ⚠️ REMPLACEZ PAR L'ID DU PROJET
    'Travaux',
    'Exécution des travaux de terrassement',
    'in_progress',
    2
),
(
    'VOTRE_PROJECT_ID',  -- ⚠️ REMPLACEZ PAR L'ID DU PROJET
    'Livraison',
    'Réception finale et validation',
    'pending',
    3
);

-- 4. Vérifier que tout est créé
SELECT 
    p.id as project_id,
    p.name as project_name,
    p.client_id,
    u.email as client_email,
    COUNT(ps.id) as nb_steps
FROM projects p
LEFT JOIN auth.users u ON p.client_id = u.id
LEFT JOIN project_steps ps ON ps.project_id = p.id
WHERE p.name = 'Villa Moderne - Terrassement'
GROUP BY p.id, p.name, p.client_id, u.email;

-- ============================================
-- INSTRUCTIONS ÉTAPE PAR ÉTAPE
-- ============================================

-- ÉTAPE 1: Exécuter la première requête SELECT
-- → Copier l'ID d'un utilisateur client

-- ÉTAPE 2: Remplacer 'VOTRE_CLIENT_ID' dans l'INSERT projects
-- → Exécuter l'INSERT
-- → Copier l'ID du projet retourné

-- ÉTAPE 3: Remplacer 'VOTRE_PROJECT_ID' dans l'INSERT project_steps
-- → Exécuter l'INSERT (les 3 étapes en même temps)

-- ÉTAPE 4: Exécuter le dernier SELECT pour vérifier
-- → Vous devriez voir 1 projet avec 3 étapes

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Après ces étapes:
-- ✅ 1 projet créé avec un UUID valide
-- ✅ 3 étapes créées
-- ✅ Realtime sera activé dans l'application
-- ✅ Les messages fonctionneront entre client et admin
