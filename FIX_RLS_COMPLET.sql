-- ============================================================
-- FIX COMPLET RLS - EcoTP Dashboard
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABLE: documents
-- ============================================================
ALTER TABLE IF EXISTS documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "documents_all" ON documents;
DROP POLICY IF EXISTS "documents_select" ON documents;
DROP POLICY IF EXISTS "documents_insert" ON documents;
DROP POLICY IF EXISTS "documents_update" ON documents;
DROP POLICY IF EXISTS "documents_delete" ON documents;

-- Tout utilisateur connecté peut voir les documents
CREATE POLICY "documents_select" ON documents
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Tout utilisateur connecté peut uploader
CREATE POLICY "documents_insert" ON documents
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Tout utilisateur connecté peut modifier
CREATE POLICY "documents_update" ON documents
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Tout utilisateur connecté peut supprimer
CREATE POLICY "documents_delete" ON documents
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- 2. TABLE: messages
-- ============================================================
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_all" ON messages;
DROP POLICY IF EXISTS "messages_select" ON messages;
DROP POLICY IF EXISTS "messages_insert" ON messages;
DROP POLICY IF EXISTS "messages_delete" ON messages;

-- Tout utilisateur connecté peut lire les messages
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Tout utilisateur connecté peut envoyer des messages
CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- L'auteur peut supprimer ses messages
CREATE POLICY "messages_delete" ON messages
  FOR DELETE USING (sender_id = auth.uid());

-- ============================================================
-- 3. TABLE: project_photos
-- ============================================================
ALTER TABLE IF EXISTS project_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "photos_all" ON project_photos;
DROP POLICY IF EXISTS "photos_select" ON project_photos;
DROP POLICY IF EXISTS "photos_insert" ON project_photos;
DROP POLICY IF EXISTS "photos_delete" ON project_photos;

CREATE POLICY "photos_select" ON project_photos
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "photos_insert" ON project_photos
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "photos_delete" ON project_photos
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- 4. TABLE: profiles
-- ============================================================
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;

-- Tout utilisateur connecté peut lire les profils
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Chaque utilisateur peut modifier son propre profil
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- 5. TABLE: projects
-- ============================================================
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select" ON projects;
DROP POLICY IF EXISTS "projects_insert" ON projects;
DROP POLICY IF EXISTS "projects_update" ON projects;

CREATE POLICY "projects_select" ON projects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "projects_insert" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "projects_update" ON projects
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- 6. TABLE: project_steps
-- ============================================================
ALTER TABLE IF EXISTS project_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "steps_select" ON project_steps;
DROP POLICY IF EXISTS "steps_insert" ON project_steps;
DROP POLICY IF EXISTS "steps_update" ON project_steps;

CREATE POLICY "steps_select" ON project_steps
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "steps_insert" ON project_steps
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "steps_update" ON project_steps
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- 7. Ajouter sender_name à la table messages (si absent)
-- ============================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'sender_name'
  ) THEN
    ALTER TABLE messages ADD COLUMN sender_name TEXT;
  END IF;
END $$;

-- ============================================================
-- 8. Ajouter file_url à documents (si absent)
-- ============================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN file_url TEXT;
  END IF;
END $$;

-- ============================================================
-- 9. Ajouter is_signed, signed_at, signed_by_name (si absents)
-- ============================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'is_signed'
  ) THEN
    ALTER TABLE documents ADD COLUMN is_signed BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'signed_at'
  ) THEN
    ALTER TABLE documents ADD COLUMN signed_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'signed_by_name'
  ) THEN
    ALTER TABLE documents ADD COLUMN signed_by_name TEXT;
  END IF;
END $$;

-- ============================================================
-- 10. VÉRIFICATION - Afficher les policies actives
-- ============================================================
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies 
WHERE tablename IN ('documents', 'messages', 'project_photos', 'profiles', 'projects', 'project_steps')
ORDER BY tablename, policyname;
