-- ============================================
-- SCRIPT: CRÉER DES PROJETS DE TEST
-- ============================================
-- Ce script crée des projets réels pour tester la messagerie temps réel
-- À exécuter dans Supabase SQL Editor

-- 1. Récupérer les IDs des utilisateurs existants
-- Remplacez ces IDs par les vrais IDs de vos utilisateurs

-- IMPORTANT: Exécutez d'abord cette requête pour voir vos utilisateurs:
SELECT id, email, raw_user_meta_data->>'name' as name 
FROM auth.users;

-- 2. Créer un projet de test
-- Remplacez 'CLIENT_ID_ICI' par l'ID du client (user_id du client)

INSERT INTO projects (
    client_id,
    name,
    status,
    progress,
    budget,
    spent,
    start_date,
    end_date,
    created_at,
    updated_at
) VALUES (
    -- REMPLACEZ PAR L'ID DU CLIENT
    (SELECT id FROM auth.users WHERE email LIKE '%client%' OR raw_user_meta_data->>'role' = 'client' LIMIT 1),
    'Villa Moderne - Terrassement',
    'in_progress',
    45,
    35000,
    15000,
    '2024-02-01',
    '2024-05-01',
    NOW(),
    NOW()
) RETURNING *;

-- 3. Créer les étapes du projet
-- Récupérer l'ID du projet créé ci-dessus et l'utiliser ici

INSERT INTO project_steps (
    project_id,
    name,
    description,
    status,
    order_index,
    created_at,
    updated_at
) VALUES 
-- Remplacez 'PROJECT_ID_ICI' par l'ID du projet créé
(
    (SELECT id FROM projects WHERE name = 'Villa Moderne - Terrassement' LIMIT 1),
    'Lancement',
    'Validation du projet et préparation',
    'completed',
    1,
    NOW(),
    NOW()
),
(
    (SELECT id FROM projects WHERE name = 'Villa Moderne - Terrassement' LIMIT 1),
    'Travaux',
    'Exécution des travaux de terrassement',
    'in_progress',
    2,
    NOW(),
    NOW()
),
(
    (SELECT id FROM projects WHERE name = 'Villa Moderne - Terrassement' LIMIT 1),
    'Livraison',
    'Réception finale et validation',
    'pending',
    3,
    NOW(),
    NOW()
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

-- 5. ALTERNATIVE: Si vous connaissez déjà les IDs
-- Décommentez et utilisez cette version simplifiée:

/*
-- Remplacez ces valeurs:
-- CLIENT_ID: l'ID de l'utilisateur client
-- PROJECT_ID: sera généré automatiquement

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
    'VOTRE_CLIENT_ID_ICI',  -- Remplacez par l'ID du client
    'Villa Moderne - Terrassement',
    'in_progress',
    45,
    35000,
    15000,
    '2024-02-01',
    '2024-05-01'
);
*/

-- ============================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================

-- 1. Ouvrir Supabase Dashboard
-- 2. Aller dans SQL Editor
-- 3. Copier-coller ce script
-- 4. Exécuter la première requête SELECT pour voir les IDs
-- 5. Copier l'ID du client
-- 6. Remplacer dans les INSERT ci-dessus
-- 7. Exécuter les INSERT
-- 8. Vérifier avec le dernier SELECT

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================

-- Vous devriez voir:
-- - 1 projet créé
-- - 3 étapes créées
-- - Le projet lié au client

-- Ensuite, dans l'application:
-- - Le client verra son vrai projet (pas "proj-client-demo")
-- - Realtime sera activé (UUID valide)
-- - Les messages fonctionneront entre client et admin
