-- ============================================
-- DIAGNOSTIC: VÉRIFIER LA CORRESPONDANCE CLIENT
-- ============================================

-- 1. Voir tous les utilisateurs et leurs IDs
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    raw_user_meta_data->>'role' as role,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Voir le projet créé
SELECT 
    id as project_id,
    client_id,
    name,
    status,
    created_at
FROM projects
ORDER BY created_at DESC
LIMIT 5;

-- 3. Vérifier la correspondance
-- Le client_id du projet DOIT correspondre à l'id d'un utilisateur client

SELECT 
    p.id as project_id,
    p.name as project_name,
    p.client_id,
    u.email as client_email,
    u.raw_user_meta_data->>'name' as client_name,
    CASE 
        WHEN u.id IS NULL THEN '❌ PROBLÈME: Aucun utilisateur trouvé'
        WHEN u.raw_user_meta_data->>'role' != 'client' THEN '⚠️ ATTENTION: Pas un client'
        ELSE '✅ OK'
    END as status
FROM projects p
LEFT JOIN auth.users u ON p.client_id = u.id
ORDER BY p.created_at DESC
LIMIT 5;

-- ============================================
-- SOLUTION SI LE CLIENT_ID NE CORRESPOND PAS
-- ============================================

-- Si le résultat ci-dessus montre "❌ PROBLÈME", exécutez:

/*
-- Étape 1: Trouver l'ID du vrai utilisateur client
SELECT id, email, raw_user_meta_data->>'name' as name
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'client'
   OR email LIKE '%client%'
   OR email LIKE '%test%'
LIMIT 1;

-- Étape 2: Mettre à jour le projet avec le bon client_id
-- REMPLACEZ 'NOUVEAU_CLIENT_ID' par l'ID trouvé ci-dessus
-- REMPLACEZ 'PROJECT_ID' par l'ID de votre projet

UPDATE projects
SET client_id = 'NOUVEAU_CLIENT_ID'
WHERE id = 'PROJECT_ID';

-- Étape 3: Vérifier
SELECT 
    p.id,
    p.name,
    p.client_id,
    u.email as client_email
FROM projects p
LEFT JOIN auth.users u ON p.client_id = u.id
WHERE p.id = 'PROJECT_ID';
*/

-- ============================================
-- ALTERNATIVE: CRÉER UN NOUVEL UTILISATEUR CLIENT
-- ============================================

-- Si aucun utilisateur client n'existe, créez-en un:

/*
-- Cette requête doit être exécutée dans Supabase Auth, pas SQL Editor
-- Allez dans Authentication > Users > Add User

Email: client.test@ecotp.com
Password: TestClient2024!
User Metadata:
{
  "name": "Client Test",
  "role": "client"
}

-- Puis mettez à jour le projet avec le nouvel ID
*/
