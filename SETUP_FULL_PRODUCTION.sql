-- ============================================
-- SCRIPT DE MISE EN PRODUCTION (PHOTOS, GED, NOTIFS)
-- A EXÉCUTER DANS SUPABASE SQL EDITOR
-- ============================================

-- ============================================
-- 1. MODULE PHOTOS (Réparation)
-- ============================================

CREATE TABLE IF NOT EXISTS project_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  file_path TEXT, 
  type TEXT CHECK (type IN ('before', 'progress', 'after')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_project_id ON project_photos(project_id);
ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

-- Reading Policy
CREATE POLICY "Users can view photos of accessible projects" ON project_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_photos.project_id
      AND (client_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- Admin Management Policy
CREATE POLICY "Admins can manage photos" ON project_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ============================================
-- 2. MODULE GED (Signature & Métadonnées)
-- ============================================

-- Ajout des colonnes de signature à la table documents existante
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS is_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS signed_by_name TEXT,
ADD COLUMN IF NOT EXISTS signature_metadata JSONB; -- Pour stocker IP, user_agent, etc.

-- Politique Update pour permettre au client de signer (modifier) ses documents
CREATE POLICY "Clients can sign their documents" ON documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = documents.project_id AND client_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = documents.project_id AND client_id = auth.uid()
    )
  );


-- ============================================
-- 3. MODULE NOTIFICATIONS (Réel)
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Trigger function automatique pour notifier un client quand un projet avance ?
-- (Optionnel, on peut le gérer via l'application pour l'instant)

