-- ============================================================
-- RECHARGER LE CACHE SCHEMA POSTGREST
-- À exécuter dans Supabase > SQL Editor
-- Envoie un signal à PostgREST pour recharger son schéma
-- ============================================================

NOTIFY pgrst, 'reload schema';

-- ============================================================
-- VÉRIFICATION (doit montrer project_id = YES)
-- ============================================================
SELECT column_name, is_nullable
FROM information_schema.columns 
WHERE table_name = 'documents' 
  AND table_schema = 'public'
  AND column_name IN ('project_id', 'name', 'file_url', 'uploaded_by', 'client_id', 'file_path')
ORDER BY ordinal_position;
