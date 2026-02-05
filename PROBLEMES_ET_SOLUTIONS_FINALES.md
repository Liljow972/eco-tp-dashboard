# 🔧 PROBLÈMES ET SOLUTIONS FINALES

**Date** : 3 février 2026  
**Statut** : 🟡 En cours de résolution

---

## ✅ **PROBLÈMES RÉSOLUS**

### 1. Google OAuth - Nom de l'Application
**Problème** : L'application affichait le domaine Supabase au lieu de "Eco TP Dashboard"  
**Solution** : Modifié dans Google Cloud Console → OAuth consent screen → Nom de l'application  
**Statut** : ✅ Résolu

### 2. Confirmation Email
**Problème** : Les utilisateurs devaient confirmer leur email avant de se connecter  
**Solution** : Désactivé dans Supabase → Authentication → Email  
**Statut** : ✅ Résolu

### 3. Profils Manquants
**Problème** : Les profils n'étaient pas créés automatiquement lors de l'inscription  
**Solution** : Créé un trigger SQL automatique `handle_new_user()`  
**Statut** : ✅ Résolu

### 4. Permissions RLS
**Problème** : Les utilisateurs ne pouvaient pas lire les données (profiles, projects)  
**Solution** : Désactivé RLS temporairement pour le développement  
**Statut** : ✅ Résolu

### 5. Redirection Bloquée
**Problème** : Après connexion, l'utilisateur restait sur "Connexion en cours..."  
**Solution** : Ajouté un timeout de sécurité (5 secondes) pour forcer la redirection  
**Statut** : ✅ Résolu

---

## 🟡 **PROBLÈMES EN COURS**

### 1. Chargement Trop Long (5 secondes)
**Problème** : La connexion prend 5 secondes avant de rediriger  
**Cause probable** : Supabase met trop de temps à répondre  

**Solutions possibles** :

#### Option A : Vérifier la Configuration Supabase
```sql
-- Vérifier que les tables existent
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Vérifier les index
SELECT tablename, indexname FROM pg_indexes 
WHERE schemaname = 'public';
```

#### Option B : Optimiser la Connexion
Ajouter un index sur la colonne `email` dans `profiles` :
```sql
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
```

#### Option C : Supprimer le Timeout
Si Supabase fonctionne correctement, on peut supprimer le timeout et laisser la connexion normale.

---

### 2. Admin et Client Voient le Même Dashboard
**Problème** : Le Sidebar affiche les mêmes options pour Admin et Client  
**Cause** : Le rôle n'est pas détecté correctement dans le Sidebar  

**Solution** :

Modifier `src/components/shell/Sidebar.tsx` ligne 35-37 :

**Avant** (bugué) :
```tsx
useEffect(() => {
  AuthService.isAdmin().then(setIsAdmin)
}, [])
```

**Après** (corrigé) :
```tsx
useEffect(() => {
  const loadRole = async () => {
    const user = await AuthService.getCurrentUser()
    setIsAdmin(user?.role === 'admin')
  }
  loadRole()
}, [])
```

---

## 🎯 **ACTIONS IMMÉDIATES**

### 1. Corriger la Détection du Rôle dans le Sidebar

**Fichier** : `src/components/shell/Sidebar.tsx`  
**Ligne** : 35-37

**Code à remplacer** :
```tsx
useEffect(() => {
  AuthService.isAdmin().then(setIsAdmin)
}, [])
```

**Nouveau code** :
```tsx
useEffect(() => {
  const loadRole = async () => {
    const user = await AuthService.getCurrentUser()
    setIsAdmin(user?.role === 'admin')
  }
  loadRole()
}, [])
```

---

### 2. Optimiser la Base de Données

**Exécuter dans Supabase SQL Editor** :

```sql
-- Créer des index pour accélérer les requêtes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);

-- Vérifier que ça a marché
SELECT tablename, indexname FROM pg_indexes 
WHERE schemaname = 'public' AND tablename IN ('profiles', 'projects');
```

---

### 3. Tester la Connexion Sans Timeout

Si après les optimisations, Supabase répond rapidement, on peut **supprimer le timeout** :

**Fichier** : `src/app/(auth)/login/page.tsx`  
**Lignes** : 39-43 et 78-82

**Supprimer ces lignes** :
```tsx
// Timeout de sécurité : rediriger après 5 secondes maximum
const timeoutId = setTimeout(() => {
  console.log('Timeout atteint, redirection forcée')
  window.location.href = '/dashboard'
}, 5000)
```

Et aussi :
```tsx
clearTimeout(timeoutId)
```

---

## 📊 **DIAGNOSTIC DE PERFORMANCE**

### Mesurer le Temps de Connexion

Ouvrir la console (F12) et regarder les logs :
- Si vous voyez **"Timeout atteint, redirection forcée"** → Supabase est trop lent
- Si vous ne voyez **rien** → La connexion fonctionne normalement

### Vérifier la Latence Supabase

Dans Supabase Dashboard :
1. **Settings** → **General**
2. Regarder la **région** du projet (ex: `eu-west-1`)
3. Si la région est loin de vous, ça peut expliquer la latence

---

## 🚀 **PROCHAINES ÉTAPES**

1. ✅ **Corriger le Sidebar** (détection du rôle)
2. ✅ **Optimiser la base de données** (index)
3. ⏳ **Tester** et mesurer les performances
4. ⏳ **Supprimer le timeout** si tout fonctionne bien

---

## 💡 **POURQUOI CES PROBLÈMES ?**

**Avant** : L'application utilisait `localStorage` (simulation)  
**Maintenant** : L'application utilise Supabase (vraie base de données)

**Différences** :
- `localStorage` : Instantané (0ms)
- Supabase : Requête réseau (100-500ms selon la région)

C'est normal que ce soit plus lent, mais **5 secondes c'est trop**.

---

## 📋 **CHECKLIST FINALE**

- [x] Google OAuth configuré
- [x] Confirmation email désactivée
- [x] Trigger automatique créé
- [x] Permissions RLS configurées
- [x] Redirection fonctionnelle
- [ ] Chargement rapide (< 1 seconde)
- [ ] Rôles Admin/Client différenciés

---

**Besoin d'aide ?** Consultez les autres guides :
- `INSTALLATION_TRIGGER_PROFIL.md`
- `DEPANNAGE_CONNEXION.md`
- `SOLUTION_FINALE_CONNEXION.md`
