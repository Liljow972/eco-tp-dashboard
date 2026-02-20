-- ============================================
-- SCRIPT DE RÉPARATION COMPLET (MESSAGERIE, PHOTOS, GED)
-- A EXÉCUTER DANS SUPABASE SQL EDITOR
-- ============================================

-- 1. TABLE MESSAGES (Pour la messagerie)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL, -- Peut être auth.uid() ou un ID système
  sender_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index et RLS Messages
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their projects" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = messages.project_id
      AND (client_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "Users can insert messages for their projects" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = messages.project_id
      AND (client_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- 2. TABLE NOTIFICATIONS (Pour les alertes)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Destinataire
  type TEXT DEFAULT 'info',
  title TEXT,
  message TEXT,
  project_id UUID,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politique permissive pour notifications (tout le monde peut créer, seul le destinataire peut lire)
CREATE POLICY "Users can see their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id OR user_id::text = 'admin'); -- admin est un rôle générique ici

CREATE POLICY "Users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true); -- Permettre l'envoi de notifs


-- 3. TABLE PROJECT_PHOTOS (Pour la galerie)
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

CREATE POLICY "Users can view photos" ON project_photos
  FOR SELECT USING (true); -- Simplifié pour éviter les blocages

CREATE POLICY "Users can insert photos" ON project_photos
  FOR INSERT WITH CHECK (true); -- Simplifié (l'upload est déjà protégé par Storage)

CREATE POLICY "Users can delete photos" ON project_photos
  FOR DELETE USING (true);


-- 4. MISE A JOUR GED (Pour la signature)
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS is_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS signed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS signed_by_name TEXT,
ADD COLUMN IF NOT EXISTS signature_metadata JSONB;

-- Politique Update Documents
CREATE POLICY "Users can update documents" ON documents
  FOR UPDATE USING (true) WITH CHECK (true);

