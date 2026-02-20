-- ============================================
-- DIAGNOSTIC: VÉRIFIER LES PROFILS MANQUANTS
-- ============================================

-- 1. Voir tous les utilisateurs
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name_metadata,
    raw_user_meta_data->>'role' as role_metadata,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. Voir tous les profils
SELECT 
    id,
    name,
    role,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- 3. Trouver les utilisateurs SANS profil
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'name' as name,
    u.raw_user_meta_data->>'role' as role,
    CASE 
        WHEN p.id IS NULL THEN '❌ PAS DE PROFIL'
        ELSE '✅ OK'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ============================================
-- SOLUTION: CRÉER LES PROFILS MANQUANTS
-- ============================================

-- Si des utilisateurs n'ont pas de profil, exécutez:

/*
-- Pour chaque utilisateur sans profil, créez un profil:
-- REMPLACEZ les valeurs ci-dessous

INSERT INTO profiles (id, name, role, company)
VALUES (
    'USER_ID_ICI',           -- ID de l'utilisateur
    'Nom Utilisateur',       -- Nom
    'client',                -- Role: 'client' ou 'admin'
    'Entreprise'             -- Nom de l'entreprise (optionnel)
);
*/

-- ============================================
-- EXEMPLE: Créer un profil pour client@ecotp.test
-- ============================================

/*
-- 1. Trouver l'ID de l'utilisateur
SELECT id, email FROM auth.users WHERE email = 'client@ecotp.test';

-- 2. Créer le profil (REMPLACEZ l'ID)
INSERT INTO profiles (id, name, role, company)
VALUES (
    '394ccc4d-9b25-4d64-ae15-3c15cab19f94',  -- ⚠️ REMPLACEZ
    'Client Test',
    'client',
    'Particulier'
);

-- 3. Vérifier
SELECT * FROM profiles WHERE id = '394ccc4d-9b25-4d64-ae15-3c15cab19f94';
*/

-- ============================================
-- ALTERNATIVE: Créer TOUS les profils manquants d'un coup
-- ============================================

/*
INSERT INTO profiles (id, name, role, company)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as name,
    COALESCE(u.raw_user_meta_data->>'role', 'client') as role,
    'Eco TP' as company
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Vérifier
SELECT COUNT(*) as nb_profils FROM profiles;
*/

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================

-- Tous les utilisateurs devraient avoir un profil
SELECT 
    u.email,
    p.name,
    p.role,
    CASE 
        WHEN p.id IS NULL THEN '❌ MANQUANT'
        ELSE '✅ OK'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id;
