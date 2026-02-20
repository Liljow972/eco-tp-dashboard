-- ============================================
-- VÉRIFICATION DES UTILISATEURS CRÉÉS
-- ============================================

-- 1. Vérifier les utilisateurs créés
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    raw_user_meta_data->>'role' as role,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email IN ('admin.demo@ecotp.com', 'client.demo@ecotp.com')
ORDER BY created_at DESC;

-- 2. Vérifier leurs profils
SELECT 
    p.id,
    p.name,
    p.role,
    p.company,
    u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email IN ('admin.demo@ecotp.com', 'client.demo@ecotp.com');

-- 3. Vérifier que tous les utilisateurs ont un profil
SELECT 
    u.email,
    u.raw_user_meta_data->>'name' as user_name,
    p.name as profile_name,
    p.role,
    CASE 
        WHEN p.id IS NULL THEN '❌ PAS DE PROFIL'
        ELSE '✅ OK'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin.demo@ecotp.com', 'client.demo@ecotp.com');

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Les deux utilisateurs devraient avoir:
-- - ✅ Email confirmé (email_confirmed_at non null)
-- - ✅ Profil créé
-- - ✅ Rôle correct (admin/client)
