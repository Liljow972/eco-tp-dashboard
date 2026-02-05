# 🚀 INSTALLATION DU TRIGGER AUTOMATIQUE DE PROFIL

**Objectif** : Créer automatiquement un profil dans la table `profiles` chaque fois qu'un utilisateur s'inscrit.

---

## ✅ AVANTAGES

Avec ce trigger :
- ✅ **Plus besoin** de créer manuellement les profils
- ✅ **Aucun bug** de profil manquant
- ✅ **Automatique** pour tous les utilisateurs (email, Google OAuth, etc.)
- ✅ **Nom extrait** automatiquement des métadonnées
- ✅ **Rôle par défaut** : 'client'

---

## 📋 INSTALLATION

### Étape 1 : Ouvrir Supabase SQL Editor

1. **Aller sur** : https://supabase.com/dashboard
2. **Sélectionner** votre projet
3. **SQL Editor** (menu de gauche)
4. **New query**

---

### Étape 2 : Copier-Coller le Script

**Ouvrir** le fichier : `supabase-auto-create-profile-trigger.sql`

**OU copier-coller** directement ce code :

```sql
-- Créer la fonction trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    'client',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### Étape 3 : Exécuter le Script

**Cliquer** sur **Run** (ou F5)

**Résultat attendu** :
```
Success. No rows returned.
```

---

### Étape 4 : Vérifier l'Installation

**Copier-coller** ce code pour vérifier :

```sql
-- Vérifier que le trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Résultat attendu** :
```
trigger_name          | event_manipulation | event_object_table
----------------------|--------------------|-----------------
on_auth_user_created  | INSERT             | users
```

✅ Si vous voyez cette ligne, le trigger est installé !

---

## 🧪 TESTER LE TRIGGER

### Test 1 : Créer un Nouveau Compte

1. **Aller sur** : http://localhost:3000/register
2. **Créer un compte** :
   - Email : `test@example.com`
   - Mot de passe : `test123`
3. **Vérifier dans Supabase** :

```sql
SELECT * FROM profiles WHERE email = 'test@example.com';
```

**Résultat attendu** :
```
id       | email             | name | role   | created_at
---------|-------------------|------|--------|------------
abc123...| test@example.com  | test | client | 2026-02-03...
```

✅ Le profil a été créé automatiquement !

---

### Test 2 : Connexion Google OAuth

1. **Aller sur** : http://localhost:3000/login
2. **Cliquer** sur "Continuer avec Google"
3. **Se connecter** avec un compte Google
4. **Vérifier dans Supabase** :

```sql
SELECT * FROM profiles WHERE email = 'votre-email@gmail.com';
```

**Résultat attendu** :
```
id       | email                | name         | role   
---------|----------------------|--------------|--------
def456...| votre-email@gmail.com| Votre Nom    | client
```

✅ Le profil a été créé avec le nom de votre compte Google !

---

## 🎯 FONCTIONS BONUS

Le script inclut aussi 2 fonctions utiles :

### Promouvoir un Utilisateur en Admin

```sql
SELECT promote_to_admin('user@example.com');
```

### Rétrograder un Admin en Client

```sql
SELECT demote_to_client('admin@example.com');
```

---

## 🔧 COMMENT ÇA MARCHE ?

### Flux Automatique

```
1. Utilisateur s'inscrit
   ↓
2. Supabase crée l'utilisateur dans auth.users
   ↓
3. TRIGGER s'active automatiquement
   ↓
4. Fonction handle_new_user() s'exécute
   ↓
5. Profil créé dans la table profiles
   ↓
6. Utilisateur peut se connecter immédiatement ✅
```

### Extraction du Nom

Le trigger extrait le nom dans cet ordre :
1. `raw_user_meta_data->>'full_name'` (Google OAuth)
2. `raw_user_meta_data->>'name'` (autres providers)
3. Partie avant @ de l'email (fallback)

**Exemples** :
- Google : "John Doe" → `name = "John Doe"`
- Email : "john.doe@example.com" → `name = "john.doe"`

---

## 📊 VÉRIFICATION COMPLÈTE

Pour voir tous les triggers et fonctions :

```sql
-- Lister tous les triggers
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth';

-- Lister toutes les fonctions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%user%';
```

---

## ⚠️ NOTES IMPORTANTES

### 1. Rôle par Défaut

Tous les nouveaux utilisateurs ont le rôle **'client'** par défaut.

Pour créer un admin, vous devez :
1. Créer le compte normalement
2. Promouvoir en admin :
   ```sql
   SELECT promote_to_admin('admin@example.com');
   ```

### 2. Utilisateurs Existants

Le trigger ne s'applique **que pour les NOUVEAUX utilisateurs**.

Pour les utilisateurs existants sans profil, utilisez :
```sql
INSERT INTO profiles (id, email, name, role)
SELECT id, email, split_part(email, '@', 1), 'client'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);
```

### 3. Modification du Trigger

Si vous voulez modifier le trigger plus tard :
1. Modifiez la fonction `handle_new_user()`
2. Le trigger utilisera automatiquement la nouvelle version

---

## 🎉 RÉSULTAT FINAL

Après installation :

**Avant** :
```
Utilisateur s'inscrit → Profil manquant → Erreur 404 ❌
```

**Après** :
```
Utilisateur s'inscrit → Profil créé automatiquement → Connexion réussie ✅
```

---

## 📁 FICHIERS CRÉÉS

- ✅ `supabase-auto-create-profile-trigger.sql` - Script complet avec trigger et fonctions bonus

---

## ⏱️ TEMPS D'INSTALLATION

- Copier le script : **30 secondes**
- Exécuter : **10 secondes**
- Vérifier : **20 secondes**

**Total** : ~1 minute

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ Installer le trigger (maintenant)
2. ✅ Tester avec un nouveau compte
3. ✅ Promouvoir admin@ecotp.test en admin
4. ✅ Tester les boutons démo

---

**Besoin d'aide ?** Si le trigger ne fonctionne pas, vérifiez les permissions de la table `profiles` !
