-- Création du bucket pour les documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Politique de sécurité pour le bucket documents
-- Permettre aux utilisateurs authentifiés de télécharger des fichiers
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Permettre aux utilisateurs authentifiés de voir les fichiers
CREATE POLICY "Authenticated users can view documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Permettre aux utilisateurs authentifiés de supprimer leurs fichiers
CREATE POLICY "Authenticated users can delete documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Permettre aux utilisateurs authentifiés de mettre à jour les métadonnées
CREATE POLICY "Authenticated users can update documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );