# 📋 GUIDE DE CONFIGURATION SUPABASE - ÉTAPE PAR ÉTAPE

**Date** : 2 février 2026  
**Temps estimé** : 20 minutes

---

## 🎯 OBJECTIF

Finaliser la configuration Supabase pour que l'authentification fonctionne à 100% :
1. ✅ Créer la table `documents`
2. ✅ Créer le bucket `documents` 
3. ✅ Configurer Google OAuth

---

## 📝 ÉTAPE 1 : CRÉER LA TABLE DOCUMENTS (5 min)

### A. Se connecter à Supabase

1. **Ouvrir** : https://supabase.com/dashboard
2. **Se connecter** avec votre compte (GitHub, Email, ou SSO)
3. **Sélectionner** votre projet : `dhrxwkvdtiqqspljkspq`

### B. Ouvrir SQL Editor

1. Dans le menu de gauche, cliquer sur **SQL Editor** (icône 📝)
2. Cliquer sur **New query** (bouton en haut à droite)

### C. Copier et Exécuter le SQL

1. **Ouvrir le fichier** : `supabase-create-documents-table.sql`
2. **Copier tout le contenu** (Cmd+A puis Cmd+C)
3. **Coller** dans l'éditeur SQL de Supabase (Cmd+V)
4. **Cliquer** sur **Run** (ou Cmd+Enter)

### D. Vérifier le Résultat

Vous devriez voir :
```
✅ Success. No rows returned
```

Puis en bas, deux tableaux de vérification :
- Liste des colonnes de la table `documents`
- Liste des politiques RLS

### E. Vérifier dans Table Editor

1. Cliquer sur **Table Editor** dans le menu de gauche
2. Chercher la table **documents** dans la liste
3. Cliquer dessus pour voir la structure

**Colonnes attendues** :
- `id` (uuid)
- `project_id` (uuid)
- `label` (text)
- `type` (text)
- `file_path` (text)
- `file_size` (bigint)
- `mime_type` (text)
- `created_at` (timestamp)

---

## 📦 ÉTAPE 2 : CRÉER LE BUCKET DOCUMENTS (2 min)

### A. Ouvrir Storage

1. Dans le menu de gauche, cliquer sur **Storage** (icône 📁)
2. Vous verrez la liste des buckets existants

### B. Créer le Bucket

1. Cliquer sur **New bucket** (bouton en haut à droite)
2. Remplir le formulaire :
   - **Name** : `documents`
   - **Public bucket** : ❌ **NON** (laisser décoché)
   - **File size limit** : `50 MB` (optionnel)
   - **Allowed MIME types** : Laisser vide (tous les types)
3. Cliquer sur **Create bucket**

### C. Configurer les Politiques du Bucket

1. Cliquer sur le bucket **documents** que vous venez de créer
2. Aller dans l'onglet **Policies**
3. Cliquer sur **New policy**

#### Politique 1 : Upload pour utilisateurs authentifiés

1. Cliquer sur **For full customization**
2. Remplir :
   - **Policy name** : `Authenticated users can upload`
   - **Allowed operation** : `INSERT`
   - **Policy definition** :
   ```sql
   bucket_id = 'documents' AND auth.role() = 'authenticated'
   ```
3. Cliquer sur **Review** puis **Save policy**

#### Politique 2 : Lecture pour utilisateurs authentifiés

1. Cliquer sur **New policy** à nouveau
2. Remplir :
   - **Policy name** : `Authenticated users can view`
   - **Allowed operation** : `SELECT`
   - **Policy definition** :
   ```sql
   bucket_id = 'documents' AND auth.role() = 'authenticated'
   ```
3. Cliquer sur **Review** puis **Save policy**

#### Politique 3 : Suppression pour utilisateurs authentifiés

1. Cliquer sur **New policy** à nouveau
2. Remplir :
   - **Policy name** : `Authenticated users can delete`
   - **Allowed operation** : `DELETE`
   - **Policy definition** :
   ```sql
   bucket_id = 'documents' AND auth.role() = 'authenticated'
   ```
3. Cliquer sur **Review** puis **Save policy**

---

## 🔐 ÉTAPE 3 : CONFIGURER GOOGLE OAUTH (10 min)

### A. Google Cloud Console

#### 1. Créer un Projet (si nécessaire)

1. **Ouvrir** : https://console.cloud.google.com
2. Se connecter avec votre compte Google
3. En haut, cliquer sur le sélecteur de projet
4. Cliquer sur **New Project**
5. Nom : `EcoTP Dashboard` (ou autre)
6. Cliquer sur **Create**

#### 2. Activer Google+ API

1. Dans le menu ☰, aller dans **APIs & Services** → **Library**
2. Chercher `Google+ API`
3. Cliquer dessus
4. Cliquer sur **Enable**

#### 3. Créer les Identifiants OAuth

1. Dans le menu ☰, aller dans **APIs & Services** → **Credentials**
2. Cliquer sur **Create Credentials** → **OAuth client ID**
3. Si demandé, configurer l'écran de consentement :
   - Type : **External**
   - App name : `EcoTP Dashboard`
   - User support email : Votre email
   - Developer contact : Votre email
   - Cliquer sur **Save and Continue** (3 fois)
4. Revenir à **Credentials** → **Create Credentials** → **OAuth client ID**
5. Remplir :
   - **Application type** : `Web application`
   - **Name** : `EcoTP Dashboard Web`
   
6. **Authorized JavaScript origins** :
   ```
   http://localhost:3000
   https://votre-site.vercel.app
   ```
   
7. **Authorized redirect URIs** :
   ```
   https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
   ```
   
8. Cliquer sur **Create**
9. **COPIER** le **Client ID** et le **Client Secret** (important !)

### B. Supabase Dashboard

#### 1. Activer Google Provider

1. Retourner sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Dans le menu de gauche, cliquer sur **Authentication** (icône 🔐)
4. Cliquer sur **Providers**
5. Chercher **Google** dans la liste
6. Cliquer sur **Google** pour l'ouvrir

#### 2. Configurer Google

1. **Activer** le toggle en haut (Enable Sign in with Google)
2. Remplir :
   - **Client ID** : Coller le Client ID de Google Cloud Console
   - **Client Secret** : Coller le Client Secret de Google Cloud Console
3. Cliquer sur **Save**

#### 3. Vérifier la Configuration

Vous devriez voir :
- ✅ Google activé (toggle vert)
- ✅ Client ID rempli
- ✅ Redirect URL affichée : `https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback`

---

## ✅ ÉTAPE 4 : VÉRIFICATION FINALE

### A. Tester la Connexion Supabase

```bash
cd /Users/liljow/Documents/LJ_Design/Web_app_saas/Eco-TP-dashboard/eco-tp-dashboard
node scripts/test-supabase.js
```

**Résultat attendu** :
```
✅ Connexion Supabase : OK
✅ Table profiles : OK
✅ Table projects : OK
✅ Table documents : OK  ← Devrait être OK maintenant
✅ Bucket documents : OK  ← Devrait être OK maintenant
```

### B. Démarrer l'Application

```bash
npm run dev
```

Ouvrir : http://localhost:3000

### C. Tester l'Inscription

1. Cliquer sur **S'inscrire**
2. Remplir le formulaire :
   - Nom : `Test User`
   - Email : `test@example.com`
   - Password : `test123456`
   - Type : `Client`
3. Cliquer sur **Créer le compte**

**Vérifications** :
- [ ] Aucune erreur dans la console du navigateur (F12)
- [ ] Redirection vers `/client`
- [ ] Dans Supabase → **Authentication** → **Users** : nouveau utilisateur visible
- [ ] Dans Supabase → **Table Editor** → **profiles** : nouveau profil créé

### D. Tester la Connexion

1. Se déconnecter
2. Cliquer sur **Se connecter**
3. Utiliser :
   - Email : `test@example.com`
   - Password : `test123456`
4. Cliquer sur **Se connecter**

**Vérifications** :
- [ ] Connexion réussie
- [ ] Redirection vers `/client`
- [ ] Nom d'utilisateur affiché

### E. Tester Google OAuth

1. Se déconnecter
2. Cliquer sur **Se connecter**
3. Cliquer sur **Continuer avec Google**
4. Choisir un compte Google
5. Autoriser l'application

**Vérifications** :
- [ ] Redirection vers Google
- [ ] Écran d'autorisation affiché
- [ ] Redirection vers `/client` après autorisation
- [ ] Dans Supabase → **Authentication** → **Users** : nouveau utilisateur Google
- [ ] Dans Supabase → **Table Editor** → **profiles** : profil créé automatiquement

---

## 🐛 DÉPANNAGE

### Problème : Table documents n'existe pas

**Solution** :
1. Vérifier que le SQL a bien été exécuté sans erreur
2. Rafraîchir la page Supabase
3. Vérifier dans **Table Editor** que la table apparaît

### Problème : Bucket documents n'existe pas

**Solution** :
1. Aller dans **Storage**
2. Vérifier que le bucket `documents` est dans la liste
3. Si absent, recréer le bucket

### Problème : Google OAuth ne fonctionne pas

**Solutions possibles** :
1. Vérifier que les URLs de redirection sont exactes dans Google Cloud Console
2. Vérifier que le Client ID et Secret sont corrects dans Supabase
3. Vérifier que Google+ API est activée
4. Essayer en navigation privée (pour éviter les problèmes de cache)

### Problème : Erreur "Auth session missing"

**Solution** :
- C'est normal si vous n'êtes pas connecté
- Essayez de vous inscrire ou connecter

### Problème : Profil non créé automatiquement

**Solution** :
1. Vérifier que le trigger `on_auth_user_created` existe :
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Si absent, exécuter le script `supabase-schema.sql` complet

---

## 📊 CHECKLIST FINALE

### Configuration Supabase
- [ ] Table `documents` créée
- [ ] Politiques RLS configurées pour `documents`
- [ ] Bucket `documents` créé
- [ ] Politiques Storage configurées
- [ ] Google OAuth activé dans Supabase
- [ ] Client ID et Secret configurés

### Configuration Google Cloud
- [ ] Projet créé
- [ ] Google+ API activée
- [ ] OAuth Client ID créé
- [ ] URLs de redirection configurées

### Tests
- [ ] Script test-supabase.js : tout OK
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Google OAuth fonctionne
- [ ] Profil créé automatiquement
- [ ] Déconnexion fonctionne

---

## 🎉 FÉLICITATIONS !

Si tous les tests passent, votre application est **100% fonctionnelle** avec :
- ✅ Authentification Supabase réelle
- ✅ Inscription et connexion
- ✅ Google OAuth
- ✅ Profils utilisateur persistés
- ✅ Base de données complète

**Prochaine étape** : Déployer en production sur Vercel !

---

## 📞 BESOIN D'AIDE ?

- **Supabase Docs** : https://supabase.com/docs
- **Google OAuth Guide** : https://supabase.com/docs/guides/auth/social-login/auth-google
- **Support** : https://supabase.com/support

---

**Temps total** : ~20 minutes  
**Difficulté** : Facile (copier-coller)
