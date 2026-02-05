-- ============================================
-- 🔍 DIAGNOSTIC COMPLET - COMPTES DÉMO
-- ============================================

-- ÉTAPE 1 : Vérifier les utilisateurs dans auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test')
ORDER BY email;

-- ÉTAPE 2 : Vérifier les profils
SELECT 
    id,
    email,
    name,
    role,
    created_at
FROM profiles
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test')
ORDER BY email;

-- ÉTAPE 3 : Vérifier la correspondance
SELECT 
    u.email as "Email",
    u.email_confirmed_at as "Email Confirmé",
    p.name as "Nom",
    p.role as "Rôle",
    CASE 
        WHEN p.id IS NULL THEN '❌ Profil manquant'
        WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email non confirmé'
        WHEN p.role IS NULL THEN '⚠️ Rôle non défini'
        ELSE '✅ OK'
    END as "Statut"
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin@ecotp.test', 'client@ecotp.test')
ORDER BY u.email;

-- ============================================
-- CORRECTION SI NÉCESSAIRE
-- ============================================

-- Si les profils n'existent pas ou ont le mauvais rôle :

-- Supprimer les profils existants (si besoin)
DELETE FROM profiles WHERE email IN ('admin@ecotp.test', 'client@ecotp.test');

-- Recréer les profils avec les bons rôles
INSERT INTO profiles (id, email, name, role)
SELECT id, email, 'Admin EcoTP', 'admin'
FROM auth.users WHERE email = 'admin@ecotp.test'
ON CONFLICT (id) DO UPDATE SET name = 'Admin EcoTP', role = 'admin';

INSERT INTO profiles (id, email, name, role)
SELECT id, email, 'Client Test', 'client'
FROM auth.users WHERE email = 'client@ecotp.test'
ON CONFLICT (id) DO UPDATE SET name = 'Client Test', role = 'client';

-- Vérifier que ça a marché
SELECT email, name, role FROM profiles
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test')
ORDER BY email;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================

-- Email              | Nom          | Rôle
-- -------------------|--------------|-------
-- admin@ecotp.test   | Admin EcoTP  | admin
-- client@ecotp.test  | Client Test  | client
