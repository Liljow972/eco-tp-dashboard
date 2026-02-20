-- 🔍 SCRIPT DE VÉRIFICATION COMPLÈTE SUPABASE
-- Exécuter ce script dans Supabase SQL Editor pour vérifier l'état de la base de données

-- ============================================
-- 1. VÉRIFICATION DES TABLES
-- ============================================

SELECT 
    '📊 TABLES EXISTANTES' as section,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as nb_colonnes,
    (SELECT COUNT(*) FROM information_schema.table_constraints 
     WHERE table_name = t.table_name AND constraint_type = 'PRIMARY KEY') as has_pk,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name)::regclass)) as taille
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- 2. VÉRIFICATION DES COLONNES IMPORTANTES
-- ============================================

-- Table profiles
SELECT '👤 PROFILES - Colonnes' as section, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Table projects
SELECT '📁 PROJECTS - Colonnes' as section, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Table documents
SELECT '📄 DOCUMENTS - Colonnes' as section, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'documents'
ORDER BY ordinal_position;

-- Table messages
SELECT '💬 MESSAGES - Colonnes' as section, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;

-- ============================================
-- 3. VÉRIFICATION DES TRIGGERS
-- ============================================

SELECT 
    '⚡ TRIGGERS' as section,
    trigger_name,
    event_object_table as table_name,
    event_manipulation as event,
    action_timing as timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 4. VÉRIFICATION DES POLITIQUES RLS
-- ============================================

SELECT 
    '🔒 POLITIQUES RLS' as section,
    tablename as table_name,
    policyname as policy_name,
    permissive,
    roles,
    cmd as operation,
    CASE 
        WHEN qual IS NOT NULL THEN 'WITH CHECK'
        ELSE 'USING'
    END as type
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Vérifier si RLS est activé
SELECT 
    '🔒 RLS ACTIVÉ' as section,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ Activé'
        ELSE '❌ Désactivé'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- 5. COMPTAGE DES DONNÉES
-- ============================================

SELECT '📈 COMPTAGE DES DONNÉES' as section, 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT '📈 COMPTAGE DES DONNÉES', 'projects', COUNT(*) FROM projects
UNION ALL
SELECT '📈 COMPTAGE DES DONNÉES', 'project_steps', COUNT(*) FROM project_steps
UNION ALL
SELECT '📈 COMPTAGE DES DONNÉES', 'documents', COUNT(*) FROM documents
UNION ALL
SELECT '📈 COMPTAGE DES DONNÉES', 'messages', COUNT(*) FROM messages
UNION ALL
SELECT '📈 COMPTAGE DES DONNÉES', 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT '📈 COMPTAGE DES DONNÉES', 'project_photos', COUNT(*) FROM project_photos;

-- ============================================
-- 6. VÉRIFICATION DES BUCKETS STORAGE
-- ============================================

SELECT 
    '🗄️ STORAGE BUCKETS' as section,
    id as bucket_name,
    CASE WHEN public THEN '✅ Public' ELSE '🔒 Privé' END as visibility,
    created_at
FROM storage.buckets
ORDER BY id;

-- Vérifier les politiques de storage
SELECT 
    '🗄️ STORAGE POLICIES' as section,
    bucket_id,
    name as policy_name,
    definition
FROM storage.policies
ORDER BY bucket_id, name;

-- ============================================
-- 7. VÉRIFICATION DES INDEX
-- ============================================

SELECT 
    '📇 INDEX' as section,
    tablename as table_name,
    indexname as index_name,
    indexdef as definition
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- 8. VÉRIFICATION DES CONTRAINTES
-- ============================================

SELECT 
    '🔗 CONTRAINTES' as section,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- ============================================
-- 9. VÉRIFICATION DES FOREIGN KEYS
-- ============================================

SELECT 
    '🔗 FOREIGN KEYS' as section,
    tc.table_name as from_table,
    kcu.column_name as from_column,
    ccu.table_name as to_table,
    ccu.column_name as to_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- 10. VÉRIFICATION DES UTILISATEURS AUTH
-- ============================================

SELECT 
    '👥 UTILISATEURS AUTH' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
    COUNT(CASE WHEN last_sign_in_at IS NOT NULL THEN 1 END) as users_logged_in
FROM auth.users;

-- Derniers utilisateurs créés
SELECT 
    '👥 DERNIERS UTILISATEURS' as section,
    email,
    created_at,
    CASE WHEN email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END as confirmed,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 11. VÉRIFICATION PROFILS vs AUTH
-- ============================================

-- Utilisateurs sans profil
SELECT 
    '⚠️ UTILISATEURS SANS PROFIL' as section,
    u.id,
    u.email,
    u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Profils sans utilisateur (orphelins)
SELECT 
    '⚠️ PROFILS ORPHELINS' as section,
    p.id,
    p.name,
    p.email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- ============================================
-- 12. VÉRIFICATION DES DONNÉES RÉCENTES
-- ============================================

-- Messages récents
SELECT 
    '💬 MESSAGES RÉCENTS' as section,
    m.sender_name,
    LEFT(m.content, 50) as message_preview,
    m.created_at,
    p.name as project_name
FROM messages m
LEFT JOIN projects p ON m.project_id = p.id
ORDER BY m.created_at DESC
LIMIT 5;

-- Documents récents
SELECT 
    '📄 DOCUMENTS RÉCENTS' as section,
    d.name,
    d.file_size,
    d.uploaded_at,
    p.name as project_name
FROM documents d
LEFT JOIN projects p ON d.project_id = p.id
ORDER BY d.uploaded_at DESC
LIMIT 5;

-- Photos récentes
SELECT 
    '📸 PHOTOS RÉCENTES' as section,
    pp.type,
    pp.uploaded_at,
    p.name as project_name
FROM project_photos pp
LEFT JOIN projects p ON pp.project_id = p.id
ORDER BY pp.uploaded_at DESC
LIMIT 5;

-- ============================================
-- 13. VÉRIFICATION DE LA PERFORMANCE
-- ============================================

-- Tables les plus volumineuses
SELECT 
    '💾 TAILLE DES TABLES' as section,
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- ============================================
-- 14. RÉSUMÉ FINAL
-- ============================================

SELECT 
    '✅ RÉSUMÉ FINAL' as section,
    'Tables créées' as metric,
    COUNT(*)::text as value
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Triggers actifs',
    COUNT(DISTINCT trigger_name)::text
FROM information_schema.triggers
WHERE trigger_schema = 'public'

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Politiques RLS',
    COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Buckets Storage',
    COUNT(*)::text
FROM storage.buckets

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Utilisateurs totaux',
    COUNT(*)::text
FROM auth.users

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Profils créés',
    COUNT(*)::text
FROM profiles

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Projets actifs',
    COUNT(*)::text
FROM projects
WHERE status != 'completed'

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Messages échangés',
    COUNT(*)::text
FROM messages

UNION ALL

SELECT 
    '✅ RÉSUMÉ FINAL',
    'Documents uploadés',
    COUNT(*)::text
FROM documents;

-- ============================================
-- FIN DU SCRIPT DE VÉRIFICATION
-- ============================================

-- 📝 NOTES:
-- - Exécuter ce script dans Supabase SQL Editor
-- - Vérifier chaque section pour identifier les problèmes
-- - Les sections marquées ⚠️ indiquent des problèmes potentiels
-- - Les sections marquées ✅ indiquent un état normal
