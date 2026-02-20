-- ============================================
-- ÉTAPE 1: VOIR LES UTILISATEURS
-- ============================================
-- Exécutez cette requête SEULE d'abord
-- Copiez l'ID d'un utilisateur client

SELECT 
    id, 
    email, 
    raw_user_meta_data->>'name' as name,
    raw_user_meta_data->>'role' as role
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- ÉTAPE 2: CRÉER LE PROJET
-- ============================================
-- ⚠️ IMPORTANT: Remplacez la ligne ci-dessous par l'ID réel copié à l'étape 1
-- Exemple: '550e8400-e29b-41d4-a716-446655440000'
-- 
-- Exécutez cette requête SEULE après avoir remplacé l'ID

-- DÉCOMMENTEZ ET MODIFIEZ LA LIGNE CI-DESSOUS:
-- INSERT INTO projects (client_id, name, status, progress, budget, spent, start_date, end_date)
-- VALUES ('COLLER_ICI_L_ID_COMPLET_DU_CLIENT', 'Villa Moderne - Terrassement', 'in_progress', 45, 35000, 15000, '2024-02-01', '2024-05-01')
-- RETURNING *;

-- ============================================
-- EXEMPLE COMPLET (à adapter)
-- ============================================
-- Voici un exemple si votre client_id est: a1b2c3d4-e5f6-7890-abcd-ef1234567890

-- INSERT INTO projects (client_id, name, status, progress, budget, spent, start_date, end_date)
-- VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Villa Moderne - Terrassement', 'in_progress', 45, 35000, 15000, '2024-02-01', '2024-05-01')
-- RETURNING *;

-- ============================================
-- ÉTAPE 3: CRÉER LES ÉTAPES
-- ============================================
-- ⚠️ IMPORTANT: Remplacez par l'ID du projet retourné à l'étape 2
-- Exécutez cette requête SEULE après avoir remplacé l'ID

-- DÉCOMMENTEZ ET MODIFIEZ LES LIGNES CI-DESSOUS:
-- INSERT INTO project_steps (project_id, name, description, status, order_index) VALUES 
-- ('COLLER_ICI_L_ID_DU_PROJET', 'Lancement', 'Validation du projet', 'completed', 1),
-- ('COLLER_ICI_L_ID_DU_PROJET', 'Travaux', 'Exécution des travaux', 'in_progress', 2),
-- ('COLLER_ICI_L_ID_DU_PROJET', 'Livraison', 'Réception finale', 'pending', 3);

-- ============================================
-- ÉTAPE 4: VÉRIFIER
-- ============================================
-- Exécutez cette requête pour vérifier que tout est créé

SELECT 
    p.id as project_id,
    p.name as project_name,
    p.status,
    p.client_id,
    u.email as client_email,
    COUNT(ps.id) as nb_steps
FROM projects p
LEFT JOIN auth.users u ON p.client_id = u.id
LEFT JOIN project_steps ps ON ps.project_id = p.id
GROUP BY p.id, p.name, p.status, p.client_id, u.email
ORDER BY p.created_at DESC;
