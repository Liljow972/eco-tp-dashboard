-- 🔍 VÉRIFICATION RAPIDE SUPABASE (Sans erreurs)
-- Exécuter dans Supabase SQL Editor

-- ============================================
-- 1. VÉRIFIER LES TABLES PRINCIPALES
-- ============================================

SELECT 
    '📊 TABLES' as section,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as nb_colonnes
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('profiles', 'projects', 'project_steps', 'documents', 'messages', 'notifications', 'project_photos')
ORDER BY table_name;

-- ============================================
-- 2. COMPTER LES DONNÉES
-- ============================================

SELECT '📈 DONNÉES' as section, 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL SELECT '📈 DONNÉES', 'projects', COUNT(*) FROM projects
UNION ALL SELECT '📈 DONNÉES', 'project_steps', COUNT(*) FROM project_steps
UNION ALL SELECT '📈 DONNÉES', 'documents', COUNT(*) FROM documents
UNION ALL SELECT '📈 DONNÉES', 'messages', COUNT(*) FROM messages
UNION ALL SELECT '📈 DONNÉES', 'notifications', COUNT(*) FROM notifications
UNION ALL SELECT '📈 DONNÉES', 'project_photos', COUNT(*) FROM project_photos;

-- ============================================
-- 3. VÉRIFIER LE TRIGGER DE PROFIL
-- ============================================

SELECT 
    '⚡ TRIGGER' as section,
    trigger_name,
    event_object_table as table_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- 4. VÉRIFIER LES UTILISATEURS
-- ============================================

SELECT 
    '👥 UTILISATEURS' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users
FROM auth.users;

-- ============================================
-- 5. VÉRIFIER PROFILS vs AUTH
-- ============================================

-- Utilisateurs sans profil (PROBLÈME)
SELECT 
    '⚠️ SANS PROFIL' as section,
    u.id,
    u.email,
    u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
LIMIT 5;

-- ============================================
-- 6. VÉRIFIER LES BUCKETS STORAGE
-- ============================================

SELECT 
    '🗄️ BUCKETS' as section,
    id as bucket_name,
    CASE WHEN public THEN '✅ Public' ELSE '🔒 Privé' END as visibility,
    created_at
FROM storage.buckets
ORDER BY id;

-- ============================================
-- 7. RÉSUMÉ FINAL
-- ============================================

SELECT 
    '✅ RÉSUMÉ' as section,
    'Tables créées' as metric,
    COUNT(*)::text as value
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'

UNION ALL

SELECT 
    '✅ RÉSUMÉ',
    'Triggers actifs',
    COUNT(DISTINCT trigger_name)::text
FROM information_schema.triggers
WHERE trigger_schema = 'public'

UNION ALL

SELECT 
    '✅ RÉSUMÉ',
    'Buckets Storage',
    COUNT(*)::text
FROM storage.buckets

UNION ALL

SELECT 
    '✅ RÉSUMÉ',
    'Utilisateurs totaux',
    COUNT(*)::text
FROM auth.users

UNION ALL

SELECT 
    '✅ RÉSUMÉ',
    'Profils créés',
    COUNT(*)::text
FROM profiles;

-- ============================================
-- FIN - RÉSULTATS À ANALYSER
-- ============================================

-- 📝 INTERPRÉTATION:
-- 
-- ✅ Si toutes les tables existent (7 tables) → OK
-- ✅ Si trigger existe → OK
-- ✅ Si buckets existent (documents, photos) → OK
-- ⚠️ Si utilisateurs sans profil > 0 → Trigger ne fonctionne pas
-- ⚠️ Si tables manquent → Exécuter FIX_ALL_TABLES.sql
