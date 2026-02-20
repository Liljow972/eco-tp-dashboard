-- ============================================
-- SOLUTION ALTERNATIVE: UTILISER UN COMPTE EXISTANT
-- ============================================

-- Le problème: Les nouveaux comptes créés ont des mots de passe qui ne fonctionnent pas
-- La solution: Utiliser un compte existant et créer un projet pour lui

-- 1. Vérifier les utilisateurs existants qui ont des profils
SELECT 
    u.id,
    u.email,
    p.name,
    p.role,
    u.email_confirmed_at,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmé'
        ELSE '❌ Email non confirmé'
    END as status
FROM auth.users u
JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 2. Choisir un utilisateur existant (par exemple ecotpmartinique@gmail.com)
-- Cet utilisateur existe déjà et vous connaissez probablement son mot de passe

-- 3. Si vous ne connaissez pas le mot de passe, vous pouvez:
--    a) Utiliser la fonction "Reset Password" dans Supabase Dashboard
--    b) Ou créer un NOUVEAU projet pour un utilisateur existant

-- ============================================
-- OPTION 1: CRÉER UN PROJET POUR UN UTILISATEUR EXISTANT
-- ============================================

-- Récupérer l'ID d'un utilisateur client existant
SELECT id, email, raw_user_meta_data->>'name' as name
FROM auth.users
WHERE email = 'client@ecotp.test';

-- Créer un projet pour cet utilisateur (REMPLACEZ l'ID)
INSERT INTO projects (id, client_id, name, status, progress, start_date, end_date, budget, description)
VALUES (
    gen_random_uuid(),
    '394ccc4d-9b25-4d64-ae15-3c15cab19f94',  -- ⚠️ REMPLACEZ par l'ID du client
    'Villa Moderne - Terrassement',
    'in_progress',
    45,
    '2024-02-01',
    '2024-06-30',
    75000,
    'Projet de terrassement pour villa moderne avec piscine'
);

-- ============================================
-- OPTION 2: TESTER AVEC UN COMPTE GOOGLE
-- ============================================

-- Si vous avez activé Google OAuth dans Supabase:
-- 1. Aller sur http://localhost:3000/login
-- 2. Cliquer sur "Continuer avec Google"
-- 3. Se connecter avec votre compte Google
-- 4. Un profil sera créé automatiquement

-- ============================================
-- OPTION 3: CRÉER UN COMPTE VIA L'INTERFACE
-- ============================================

-- 1. Aller sur http://localhost:3000/signup
-- 2. Créer un nouveau compte avec:
--    - Email: test@example.com
--    - Mot de passe: Test123456!
--    - Nom: Test User
-- 3. Le profil sera créé automatiquement par le trigger

-- ============================================
-- RÉSUMÉ
-- ============================================

-- Problème: Les mots de passe créés par script ne fonctionnent pas
-- Solutions:
-- 1. ✅ Utiliser un compte existant (ecotpmartinique@gmail.com, client@ecotp.test)
-- 2. ✅ Créer un compte via l'interface de signup
-- 3. ✅ Utiliser Google OAuth
-- 4. ⚠️ Réinitialiser le mot de passe via Supabase Dashboard (nécessite email)

-- Recommandation: Utiliser l'OPTION 3 (créer via signup)
-- C'est la méthode la plus simple et la plus fiable
