-- ============================================
-- VÉRIFICATION RAPIDE - TOUS LES PROFILS
-- ============================================

-- 1. Vérifier que TOUS les utilisateurs ont un profil
SELECT 
    u.email,
    p.name,
    p.role,
    CASE 
        WHEN p.id IS NULL THEN '❌ MANQUANT'
        ELSE '✅ OK'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.email;

-- 2. Compter les profils manquants
SELECT 
    COUNT(*) FILTER (WHERE p.id IS NULL) as profils_manquants,
    COUNT(*) as total_utilisateurs
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id;

-- 3. Si des profils manquent encore, les créer
-- (Exécutez SEULEMENT si l'étape 2 montre profils_manquants > 0)

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
*/

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- profils_manquants = 0
-- Tous les utilisateurs avec '✅ OK'
