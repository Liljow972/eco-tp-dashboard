-- ============================================
-- SCRIPT SQL POUR CRÉER LA TABLE PROJECT_PHOTOS
-- ET LE BUCKET STORAGE 'PHOTOS' (Instructions manuelles pour Bucket)
-- ============================================

-- 1. Créer la table project_photos
CREATE TABLE IF NOT EXISTS project_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  file_path TEXT, -- Chemin dans le storage bucket
  type TEXT CHECK (type IN ('before', 'progress', 'after')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Index pour performance
CREATE INDEX IF NOT EXISTS idx_photos_project_id ON project_photos(project_id);

-- 3. Activer RLS
ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS
-- Lecture : Tout le monde qui a accès au projet peut voir les photos
CREATE POLICY "Users can view photos of accessible projects" ON project_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_photos.project_id
      AND (
        -- Soit c'est mon projet (client)
        client_id = auth.uid() 
        -- Soit je suis admin
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Admin : Full access (Insert, Delete, Update)
CREATE POLICY "Admins can manage photos" ON project_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- NOTE IMPORTANTE POUR LE STORAGE (BUCKET)
-- ============================================
-- Vous devez créer manuellement un Bucket public nommé 'photos' dans Supabase Storage.
-- Et ajouter une politique Storage :
--  BUCKET POLICY : 'Give users access to own folder' 
--  ou plus simple pour commencer : 'Public Access' pour lecture
--  et 'Authenticated Users' pour Insert (Upload).
