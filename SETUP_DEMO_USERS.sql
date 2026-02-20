-- ============================================
-- SETUP COMPLET: VÉRIFICATION + DONNÉES DE TEST
-- Exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Vérifier les utilisateurs demo créés
SELECT 
    u.id,
    u.email,
    p.name,
    p.role,
    p.company,
    CASE WHEN p.id IS NULL THEN '❌ PAS DE PROFIL' ELSE '✅ OK' END as profil_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin.demo@ecotp.com', 'client.demo@ecotp.com')
ORDER BY u.email;

-- 2. Si les profils n'existent pas, les créer
INSERT INTO profiles (id, name, role, company)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'name', 'Demo User') as name,
    COALESCE(u.raw_user_meta_data->>'role', 'client') as role,
    CASE 
        WHEN u.raw_user_meta_data->>'role' = 'admin' THEN 'Eco TP'
        ELSE 'Client Demo'
    END as company
FROM auth.users u
WHERE u.email IN ('admin.demo@ecotp.com', 'client.demo@ecotp.com')
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

-- 3. Récupérer l'ID du client demo pour créer un projet
SELECT id, email FROM auth.users WHERE email = 'client.demo@ecotp.com';
