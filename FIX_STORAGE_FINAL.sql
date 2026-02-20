-- ============================================================
-- FIX DOCUMENTS BUCKET + STORAGE POLICIES
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- 1. Créer/mettre à jour le bucket 'documents'
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documents', 'documents', true, 10485760)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760;

-- 2. Créer/mettre à jour le bucket 'photos'
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('photos', 'photos', true, 10485760)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760;

-- 3. Supprimer les ANCIENNES policies documents (si elles existent)
DROP POLICY IF EXISTS "documents_public_read" ON storage.objects;
DROP POLICY IF EXISTS "documents_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "documents_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "documents_auth_delete" ON storage.objects;

-- 4. Créer nouvelles policies documents
CREATE POLICY "documents_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "documents_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "documents_auth_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "documents_auth_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

-- 5. Supprimer les ANCIENNES policies photos (si elles existent)
DROP POLICY IF EXISTS "photos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "photos_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "photos_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "photos_auth_delete" ON storage.objects;

-- 6. Créer nouvelles policies photos
CREATE POLICY "photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

CREATE POLICY "photos_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "photos_auth_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "photos_auth_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos' AND auth.uid() IS NOT NULL);

-- 7. Recharger le cache
NOTIFY pgrst, 'reload schema';

-- 8. Vérification finale
SELECT id, name, public FROM storage.buckets WHERE id IN ('documents', 'photos');
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
