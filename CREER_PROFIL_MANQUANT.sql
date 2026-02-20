-- ============================================
-- CRÉER LE PROFIL MANQUANT
-- ============================================

-- Créer TOUS les profils manquants d'un coup
INSERT INTO profiles (id, name, role, company)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as name,
    COALESCE(u.raw_user_meta_data->>'role', 'client') as role,
    'Eco TP' as company
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Vérifier que tous les utilisateurs ont maintenant un profil
SELECT 
    u.email,
    p.name,
    p.role,
    CASE 
        WHEN p.id IS NULL THEN '❌ PAS DE PROFIL'
        ELSE '✅ OK'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Tous les utilisateurs devraient avoir '✅ OK'
