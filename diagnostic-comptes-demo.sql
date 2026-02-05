-- 🔧 SCRIPT DE DIAGNOSTIC ET CORRECTION DES COMPTES DÉMO

-- ============================================
-- ÉTAPE 1 : VÉRIFIER LES UTILISATEURS
-- ============================================

SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test')
ORDER BY email;

-- ============================================
-- ÉTAPE 2 : VÉRIFIER LES PROFILS
-- ============================================

SELECT 
    id,
    email,
    name,
    role,
    created_at
FROM profiles
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test')
ORDER BY email;

-- ============================================
-- ÉTAPE 3 : CRÉER LES PROFILS MANQUANTS
-- ============================================

-- Si les profils n'existent pas, les créer
-- Remplacez 'USER_ID_ADMIN' et 'USER_ID_CLIENT' par les vrais IDs de l'étape 1

-- Pour l'admin
INSERT INTO profiles (id, email, name, role)
SELECT 
    id,
    email,
    'Admin EcoTP',
    'admin'
FROM auth.users
WHERE email = 'admin@ecotp.test'
ON CONFLICT (id) DO UPDATE
SET 
    name = 'Admin EcoTP',
    role = 'admin';

-- Pour le client
INSERT INTO profiles (id, email, name, role)
SELECT 
    id,
    email,
    'Client Test',
    'client'
FROM auth.users
WHERE email = 'client@ecotp.test'
ON CONFLICT (id) DO UPDATE
SET 
    name = 'Client Test',
    role = 'client';

-- ============================================
-- ÉTAPE 4 : VÉRIFICATION FINALE
-- ============================================

SELECT 
    u.email,
    u.email_confirmed_at as "Email Confirmé",
    p.name as "Nom",
    p.role as "Rôle",
    CASE 
        WHEN p.id IS NULL THEN '❌ Profil manquant'
        WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email non confirmé'
        ELSE '✅ OK'
    END as "Statut"
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin@ecotp.test', 'client@ecotp.test')
ORDER BY u.email;

-- ============================================
-- ÉTAPE 5 : VÉRIFIER LES PERMISSIONS RLS
-- ============================================

-- Vérifier que les politiques RLS permettent la lecture
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles';
