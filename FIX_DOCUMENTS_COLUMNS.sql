-- ============================================================
-- FIX FINAL - Documents + Storage Buckets
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- ============================================================
-- 1. Rendre project_id nullable dans documents
--    (GED autonome = pas de projet obligatoire)
-- ============================================================
ALTER TABLE documents ALTER COLUMN project_id DROP NOT NULL;

-- 2. Rendre type nullable aussi (pour le fallback minimal)
ALTER TABLE documents ALTER COLUMN type DROP NOT NULL;

-- 3. Rendre label nullable (on utilise name maintenant)
ALTER TABLE documents ALTER COLUMN label DROP NOT NULL;

-- ============================================================
-- 4. Ajouter colonnes manquantes
-- ============================================================
ALTER TABLE documents ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS uploaded_by UUID;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_signed BOOLEAN DEFAULT false;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS signed_by_name TEXT;

-- ============================================================
-- 5. Créer les buckets Storage si inexistants
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos', 
  'photos', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'documents', 
  'documents', 
  true,
  10485760 -- 10MB
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760;

-- ============================================================
-- 6. Vérification
-- ============================================================
-- Buckets créés :
SELECT id, name, public FROM storage.buckets WHERE id IN ('photos', 'documents');

-- Colonnes documents :
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'documents' AND table_schema = 'public'
ORDER BY ordinal_position;
