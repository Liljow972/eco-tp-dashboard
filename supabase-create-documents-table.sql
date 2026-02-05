-- ============================================
-- SCRIPT SQL POUR CRÉER LA TABLE DOCUMENTS
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- 1. Créer la table documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('contract', 'invoice', 'deliverable', 'other')),
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);

-- 3. Activer Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 4. Politique : Les utilisateurs peuvent voir les documents de leurs projets
CREATE POLICY "Users can view documents for their projects" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = documents.project_id
      AND (client_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

-- 5. Politique : Les admins peuvent gérer tous les documents
CREATE POLICY "Admins can manage all documents" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Politique : Les clients peuvent uploader des documents à leurs projets
CREATE POLICY "Clients can upload documents to their projects" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = documents.project_id AND client_id = auth.uid()
    )
  );

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que la table a été créée
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'documents' 
ORDER BY ordinal_position;

-- Vérifier les politiques RLS
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd 
FROM pg_policies 
WHERE tablename = 'documents';
