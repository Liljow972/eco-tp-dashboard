-- ============================================================
-- FIX project_photos - Ajouter file_path
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- Ajouter file_path à project_photos (manquant dans le schéma original)
ALTER TABLE project_photos ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Ajouter d'autres colonnes utiles si manquantes
ALTER TABLE project_photos ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE project_photos ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Vérification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'project_photos' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Rechargement du cache schema
NOTIFY pgrst, 'reload schema';
