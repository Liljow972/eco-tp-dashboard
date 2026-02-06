# 🚀 CONFIGURATION SUPABASE - ÉTAPE PAR ÉTAPE

**Date** : 5 février 2026  
**Projet** : Eco TP Dashboard

---

## ✅ **ÉTAPE 1 : VARIABLES D'ENVIRONNEMENT** ✓ TERMINÉ

- ✅ `.env.local` créé avec vos clés Supabase
- ✅ Serveur redémarré
- ✅ Variables chargées

---

## 📊 **ÉTAT ACTUEL DE VOTRE SUPABASE**

Vous avez déjà 3 tables :
- `documents` (UNRESTRICTED)
- `profiles` (UNRESTRICTED)
- `projects` (UNRESTRICTED)

**Problèmes détectés** :
- ⚠️ 24 issues de sécurité (RLS non activé)
- ⚠️ Tables publiques sans protection
- ⚠️ Requêtes lentes détectées

---

## 🎯 **PROCHAINES ÉTAPES**

### **ÉTAPE 2 : VÉRIFIER/CRÉER LES TABLES MANQUANTES**

Tables nécessaires pour l'application :
1. ✅ `profiles` (existe déjà)
2. ✅ `projects` (existe déjà)
3. ✅ `documents` (existe déjà)
4. ❌ `project_steps` (à créer)
5. ❌ `project_photos` (à créer)
6. ❌ `messages` (à créer)
7. ❌ `notifications` (à créer)

### **ÉTAPE 3 : ACTIVER RLS (ROW LEVEL SECURITY)**

Pour chaque table, on va :
1. Activer RLS
2. Créer des politiques de sécurité
3. Tester les permissions

### **ÉTAPE 4 : CRÉER LES BUCKETS STORAGE**

1. `documents` - Pour les fichiers GED
2. `photos` - Pour les photos de chantier

### **ÉTAPE 5 : CONFIGURER GOOGLE OAUTH**

1. Créer un projet Google Cloud
2. Configurer OAuth 2.0
3. Ajouter les credentials dans Supabase

---

## 📝 **SCRIPTS SQL PRÊTS**

Tous les scripts sont déjà dans votre projet :

### **1. Créer la table `project_steps`**
```sql
CREATE TABLE project_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_project_steps_project_id ON project_steps(project_id);
CREATE INDEX idx_project_steps_status ON project_steps(status);
```

### **2. Créer la table `project_photos`**
```sql
CREATE TABLE project_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  type TEXT CHECK (type IN ('before', 'progress', 'after')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_project_photos_project_id ON project_photos(project_id);
CREATE INDEX idx_project_photos_type ON project_photos(type);
```

### **3. Créer la table `messages`**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

### **4. Créer la table `notifications`**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## 🔐 **EXEMPLE DE POLITIQUES RLS**

### **Pour la table `profiles`**
```sql
-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### **Pour la table `projects`**
```sql
-- Activer RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Les clients peuvent voir leurs propres projets
CREATE POLICY "Clients can view own projects"
ON projects FOR SELECT
USING (client_id = auth.uid());

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all projects"
ON projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Les admins peuvent créer des projets
CREATE POLICY "Admins can create projects"
ON projects FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 🚀 **COMMENÇONS !**

### **ACTION IMMÉDIATE : CRÉER LES TABLES MANQUANTES**

1. **Allez sur Supabase** : https://supabase.com/dashboard/project/dhrxwkvdtiqqspljkspq
2. **Cliquez sur** 🔧 **SQL Editor** (menu de gauche)
3. **Cliquez sur** "+ New query"
4. **Copiez-collez** le script ci-dessous
5. **Cliquez sur** "Run" (ou Cmd+Enter)

### **SCRIPT COMPLET À EXÉCUTER**

```sql
-- 1. Créer la table project_steps
CREATE TABLE IF NOT EXISTS project_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_steps_project_id ON project_steps(project_id);
CREATE INDEX IF NOT EXISTS idx_project_steps_status ON project_steps(status);

-- 2. Créer la table project_photos
CREATE TABLE IF NOT EXISTS project_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  type TEXT CHECK (type IN ('before', 'progress', 'after')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON project_photos(project_id);
CREATE INDEX IF NOT EXISTS idx_project_photos_type ON project_photos(type);

-- 3. Créer la table messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- 4. Créer la table notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 5. Créer un trigger pour updated_at sur project_steps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_steps_updated_at BEFORE UPDATE ON project_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## ✅ **APRÈS L'EXÉCUTION**

Une fois le script exécuté, vous devriez voir :
- ✅ 4 nouvelles tables créées
- ✅ Index créés pour les performances
- ✅ Trigger créé pour updated_at

**Dites-moi quand c'est fait !** 🎉

Ensuite on passera à :
1. Activer RLS sur toutes les tables
2. Créer les buckets Storage
3. Configurer Google OAuth
