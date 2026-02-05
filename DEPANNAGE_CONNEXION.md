# 🐛 DÉPANNAGE : Redirection vers la Page d'Accueil

**Problème** : Après connexion, vous êtes redirigé vers la page d'accueil au lieu du dashboard.

**Erreurs dans la console** :
```
Failed to load resource: @brxzvdvtionpll1ksqo-ed7-9c4ddaae48c5i1
Error lors de la récupération du profil
```

---

## 🔍 DIAGNOSTIC

Le problème vient du fait que les **profils n'ont pas été créés** dans la table `profiles` lors de l'inscription.

---

## ✅ SOLUTION RAPIDE

### Étape 1 : Ouvrir Supabase SQL Editor

1. **Aller sur** : https://supabase.com/dashboard
2. **Sélectionner** votre projet
3. **SQL Editor** (menu de gauche)
4. **New query**

---

### Étape 2 : Exécuter le Script de Diagnostic

**Copier-coller** ce code :

```sql
-- Vérifier les utilisateurs
SELECT 
    id,
    email,
    email_confirmed_at
FROM auth.users
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test');
```

**Cliquer** sur **Run** (F5)

**Résultat attendu** :
```
id                                   | email              | email_confirmed_at
-------------------------------------|--------------------|-----------------
abc123...                            | admin@ecotp.test   | 2026-02-03...
def456...                            | client@ecotp.test  | 2026-02-03...
```

✅ Si vous voyez les 2 utilisateurs, passez à l'étape 3.
❌ Si vous ne voyez rien, les comptes n'ont pas été créés. Retournez à http://localhost:3000/register.

---

### Étape 3 : Vérifier les Profils

**Copier-coller** ce code :

```sql
-- Vérifier les profils
SELECT 
    id,
    email,
    name,
    role
FROM profiles
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test');
```

**Cliquer** sur **Run**

**Résultat attendu** :
```
id       | email              | name         | role
---------|--------------------|--------------|---------
abc123...| admin@ecotp.test   | Admin EcoTP  | admin
def456...| client@ecotp.test  | Client Test  | client
```

✅ Si vous voyez les 2 profils, le problème est ailleurs (voir section "Autres Causes").
❌ Si vous ne voyez rien ou seulement 1 profil, passez à l'étape 4.

---

### Étape 4 : Créer les Profils Manquants

**Copier-coller** ce code :

```sql
-- Créer ou mettre à jour le profil Admin
INSERT INTO profiles (id, email, name, role)
SELECT 
    id,
    email,
    'Admin EcoTP',
    'admin'
FROM auth.users
WHERE email = 'admin@ecotp.test'
ON CONFLICT (id) DO UPDATE
SET 
    name = 'Admin EcoTP',
    role = 'admin';

-- Créer ou mettre à jour le profil Client
INSERT INTO profiles (id, email, name, role)
SELECT 
    id,
    email,
    'Client Test',
    'client'
FROM auth.users
WHERE email = 'client@ecotp.test'
ON CONFLICT (id) DO UPDATE
SET 
    name = 'Client Test',
    role = 'client';

-- Vérifier
SELECT email, name, role FROM profiles
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test');
```

**Cliquer** sur **Run**

**Résultat attendu** :
```
email              | name         | role
-------------------|--------------|-------
admin@ecotp.test   | Admin EcoTP  | admin
client@ecotp.test  | Client Test  | client
```

---

### Étape 5 : Tester la Connexion

1. **Aller sur** : http://localhost:3000/login
2. **Cliquer** sur le bouton **"Admin"**
3. **Résultat attendu** : Redirection vers `/dashboard` ✅

Si ça ne fonctionne toujours pas, passez à "Autres Causes".

---

## 🔧 AUTRES CAUSES POSSIBLES

### Cause 1 : Problème de Permissions RLS

Les politiques de sécurité (Row Level Security) empêchent peut-être la lecture des profils.

**Solution** :

```sql
-- Vérifier les politiques RLS
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'profiles';

-- Si aucune politique n'existe, en créer une
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

### Cause 2 : Session Expirée

Votre session Supabase est peut-être expirée.

**Solution** :

1. **Ouvrir** la console du navigateur (F12)
2. **Application** → **Local Storage** → `http://localhost:3000`
3. **Supprimer** toutes les clés qui commencent par `sb-`
4. **Rafraîchir** la page
5. **Réessayer** de se connecter

---

### Cause 3 : Problème de Middleware

Le middleware redirige peut-être incorrectement.

**Vérifier** : `src/middleware.ts`

**Solution** : Vérifier que le middleware autorise l'accès à `/dashboard` pour les utilisateurs connectés.

---

## 📋 CHECKLIST DE DÉPANNAGE

- [ ] Les utilisateurs existent dans `auth.users`
- [ ] Les profils existent dans `profiles`
- [ ] Les rôles sont correctement définis ('admin' et 'client')
- [ ] Les emails sont confirmés (`email_confirmed_at` n'est pas NULL)
- [ ] Les politiques RLS permettent la lecture
- [ ] Le localStorage est vide (pas de vieilles sessions)
- [ ] Le serveur dev est redémarré

---

## 🚀 SOLUTION RAPIDE (Tout-en-un)

Si vous voulez tout corriger d'un coup :

```sql
-- 1. Créer les profils
INSERT INTO profiles (id, email, name, role)
SELECT id, email, 'Admin EcoTP', 'admin'
FROM auth.users WHERE email = 'admin@ecotp.test'
ON CONFLICT (id) DO UPDATE SET name = 'Admin EcoTP', role = 'admin';

INSERT INTO profiles (id, email, name, role)
SELECT id, email, 'Client Test', 'client'
FROM auth.users WHERE email = 'client@ecotp.test'
ON CONFLICT (id) DO UPDATE SET name = 'Client Test', role = 'client';

-- 2. Vérifier les politiques RLS
CREATE POLICY IF NOT EXISTS "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Vérifier
SELECT u.email, p.name, p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email IN ('admin@ecotp.test', 'client@ecotp.test');
```

---

## ⏱️ TEMPS ESTIMÉ

- Diagnostic : **2 minutes**
- Correction : **1 minute**
- Test : **1 minute**

**Total** : ~4 minutes

---

**Besoin d'aide ?** Faites une capture d'écran du résultat de chaque requête SQL !
