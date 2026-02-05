# 🚀 PHASE 2 - CONFIGURATION SUPABASE + GOOGLE OAUTH

**Date** : 5 février 2026  
**Statut** : Prêt à démarrer

---

## ✅ **PHASE 1 TERMINÉE**

Tout le code est maintenant **en ligne sur GitHub** :
- ✅ Toutes les fonctionnalités opérationnelles
- ✅ Interface complète et fonctionnelle
- ✅ Données en mode démo (localStorage)
- ✅ Documentation complète

**Repository** : https://github.com/Liljow972/eco-tp-dashboard

---

## 🎯 **OBJECTIF PHASE 2**

Connecter l'application à **Supabase** pour avoir :
- 🔐 Authentification réelle avec Google OAuth
- 💾 Persistance des données en base de données
- 📁 Stockage des fichiers et photos
- 🔔 Notifications en temps réel
- 👥 Gestion des utilisateurs et permissions

---

## 📋 **PLAN D'ACTION**

### **Étape 1 : Créer le projet Supabase** ⏳
1. Aller sur https://supabase.com
2. Créer un compte (gratuit)
3. Créer un nouveau projet
4. Noter les clés API (URL + Anon Key)

### **Étape 2 : Créer les tables** ⏳
Tables à créer dans l'ordre :

1. **`profiles`** - Profils utilisateurs
   ```sql
   CREATE TABLE profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     role TEXT DEFAULT 'client',
     company TEXT,
     phone TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **`projects`** - Projets
   ```sql
   CREATE TABLE projects (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     description TEXT,
     client_id UUID REFERENCES profiles(id),
     status TEXT DEFAULT 'active',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **`project_steps`** - Étapes de projet
   ```sql
   CREATE TABLE project_steps (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     status TEXT DEFAULT 'pending',
     order_index INTEGER,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

4. **`documents`** - Fichiers GED
   ```sql
   CREATE TABLE documents (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     file_path TEXT NOT NULL,
     size BIGINT,
     type TEXT,
     owner_id UUID REFERENCES profiles(id),
     project_id UUID REFERENCES projects(id),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

5. **`project_photos`** - Photos de chantier
   ```sql
   CREATE TABLE project_photos (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     url TEXT NOT NULL,
     title TEXT,
     type TEXT CHECK (type IN ('before', 'progress', 'after')),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

6. **`messages`** - Messagerie
   ```sql
   CREATE TABLE messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
     sender_id UUID REFERENCES profiles(id),
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

7. **`notifications`** - Notifications
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
   ```

### **Étape 3 : Créer les buckets Storage** ⏳
1. **`documents`** - Pour les fichiers GED
2. **`photos`** - Pour les photos de chantier

### **Étape 4 : Configurer RLS (Row Level Security)** ⏳
Politiques de sécurité pour chaque table :

**Exemple pour `profiles`** :
```sql
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
```

### **Étape 5 : Configurer Google OAuth** ⏳
1. Aller sur https://console.cloud.google.com
2. Créer un projet
3. Activer Google+ API
4. Créer des identifiants OAuth 2.0
5. Ajouter les URLs de redirection Supabase
6. Copier Client ID et Client Secret
7. Les ajouter dans Supabase → Authentication → Providers → Google

### **Étape 6 : Configurer les variables d'environnement** ⏳
Créer/Mettre à jour `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
```

### **Étape 7 : Tester la connexion** ⏳
1. Redémarrer le serveur de dev
2. Tester la connexion Google
3. Vérifier que le profil est créé
4. Tester l'upload de fichiers
5. Tester la messagerie

---

## 📚 **FICHIERS DE RÉFÉRENCE**

Tous les scripts SQL sont déjà prêts dans le projet :

1. **`supabase-create-documents-table.sql`** - Table documents
2. **`supabase-auto-create-profile-trigger.sql`** - Trigger création profil
3. **`supabase-optimize-performance.sql`** - Optimisations
4. **`GUIDE_CONFIGURATION_SUPABASE.md`** - Guide complet
5. **`GUIDE_GOOGLE_CLOUD_CONSOLE.md`** - Guide Google OAuth

---

## ⚡ **ORDRE D'EXÉCUTION RECOMMANDÉ**

1. ✅ Créer le projet Supabase
2. ✅ Copier les clés dans `.env.local`
3. ✅ Créer les tables (dans l'ordre ci-dessus)
4. ✅ Créer les buckets Storage
5. ✅ Configurer RLS
6. ✅ Configurer Google OAuth
7. ✅ Tester la connexion
8. ✅ Migrer les données de démo (optionnel)

---

## 🐛 **POINTS D'ATTENTION**

### **Tables**
- Créer les tables dans l'ordre (dépendances)
- Activer RLS sur toutes les tables
- Créer les index pour les performances

### **Storage**
- Configurer les politiques d'accès
- Limiter la taille des fichiers (5MB pour GED, 10MB pour photos)
- Activer la compression d'images

### **Google OAuth**
- Bien configurer les URLs de redirection
- Tester en mode développement d'abord
- Vérifier que le trigger de création de profil fonctionne

---

## 🎯 **RÉSULTAT ATTENDU**

Après la Phase 2, l'application aura :
- ✅ Connexion Google fonctionnelle
- ✅ Données persistantes en base de données
- ✅ Fichiers stockés sur Supabase
- ✅ Photos stockées sur Supabase
- ✅ Messagerie en temps réel
- ✅ Notifications en temps réel
- ✅ Permissions strictes avec RLS

---

## 📞 **BESOIN D'AIDE ?**

Si vous rencontrez un problème :
1. Vérifiez les logs Supabase
2. Vérifiez la console du navigateur (F12)
3. Consultez les guides de référence
4. Demandez de l'aide !

---

## 🚀 **PRÊT À COMMENCER ?**

**Prochaine étape** : Créer le projet Supabase

1. Allez sur https://supabase.com
2. Cliquez sur "Start your project"
3. Créez un compte (gratuit)
4. Créez un nouveau projet :
   - Nom : `eco-tp-dashboard`
   - Base de données : Choisir une région proche (Europe West)
   - Mot de passe : Générer un mot de passe fort

Une fois le projet créé, vous aurez accès à :
- **Project URL** : `https://xxxxx.supabase.co`
- **Anon Key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Copiez ces clés, nous en aurons besoin !** 🔑

---

**Dites-moi quand vous êtes prêt à commencer !** 🎉
