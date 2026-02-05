# 🔧 CRÉER LES COMPTES DÉMO ADMIN ET CLIENT

**Problème** : Les boutons "Admin" et "Client" ne fonctionnent pas

**Cause** : Les comptes démo n'existent pas dans Supabase

**Solution** : Créer les comptes manuellement dans Supabase

---

## 🚀 SOLUTION RAPIDE

### Option 1 : Créer les Comptes via l'Interface (Recommandé)

#### Étape 1 : Créer le Compte Admin

1. **Aller sur** : http://localhost:3000/register
2. **Remplir** :
   - Prénom : `Admin`
   - Nom : `EcoTP`
   - Email : `admin@ecotp.test`
   - Mot de passe : `admin123`
   - Confirmer : `admin123`
3. **Cliquer** sur "Créer mon compte"

⚠️ **IMPORTANT** : Vous recevrez un email de confirmation. Pour un email de test, vous devez :
- Soit désactiver la confirmation email dans Supabase
- Soit utiliser un vrai email

---

#### Étape 2 : Créer le Compte Client

1. **Aller sur** : http://localhost:3000/register
2. **Remplir** :
   - Prénom : `Client`
   - Nom : `Test`
   - Email : `client@ecotp.test`
   - Mot de passe : `client123`
   - Confirmer : `client123`
3. **Cliquer** sur "Créer mon compte"

---

### Option 2 : Désactiver la Confirmation Email (Plus Simple)

Pour éviter le problème de confirmation email :

#### Étape 1 : Désactiver la Confirmation

1. **Aller sur** : https://supabase.com/dashboard
2. **Sélectionner** votre projet
3. **Authentication** → **Providers** → **Email**
4. **Décocher** "Enable email confirmations"
5. **Cliquer** sur "Save"

#### Étape 2 : Créer les Comptes

Maintenant vous pouvez créer les comptes sans confirmation email :

1. **Admin** : `admin@ecotp.test` / `admin123`
2. **Client** : `client@ecotp.test` / `client123`

---

### Option 3 : Créer les Comptes Directement dans Supabase

#### Étape 1 : Aller dans Supabase Dashboard

1. **Aller sur** : https://supabase.com/dashboard
2. **Sélectionner** votre projet
3. **Authentication** → **Users**

#### Étape 2 : Créer le Compte Admin

1. **Cliquer** sur **"Add user"** → **"Create new user"**
2. **Remplir** :
   - Email : `admin@ecotp.test`
   - Password : `admin123`
   - Auto Confirm User : ✅ **Cocher**
3. **Cliquer** sur "Create user"

#### Étape 3 : Créer le Compte Client

1. **Cliquer** sur **"Add user"** → **"Create new user"**
2. **Remplir** :
   - Email : `client@ecotp.test`
   - Password : `client123`
   - Auto Confirm User : ✅ **Cocher**
3. **Cliquer** sur "Create user"

---

## 🎯 DÉFINIR LES RÔLES

Une fois les comptes créés, vous devez définir leurs rôles dans la table `profiles`.

### Étape 1 : Aller dans l'Éditeur SQL

1. **Supabase Dashboard** → **SQL Editor**
2. **Cliquer** sur **"New query"**

### Étape 2 : Exécuter le SQL

**Copier et coller** ce code :

```sql
-- Mettre à jour le profil Admin
UPDATE profiles
SET role = 'admin',
    name = 'Admin EcoTP'
WHERE email = 'admin@ecotp.test';

-- Mettre à jour le profil Client
UPDATE profiles
SET role = 'client',
    name = 'Client Test'
WHERE email = 'client@ecotp.test';

-- Vérifier les profils
SELECT id, email, name, role FROM profiles
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test');
```

**Cliquer** sur **"Run"**

---

## ✅ VÉRIFICATION

Après avoir créé les comptes, vérifiez dans Supabase :

### Table `auth.users`

Devrait contenir :
```
✅ admin@ecotp.test (confirmed)
✅ client@ecotp.test (confirmed)
```

### Table `profiles`

Devrait contenir :
```
✅ admin@ecotp.test | Admin EcoTP | admin
✅ client@ecotp.test | Client Test | client
```

---

## 🧪 TESTER

1. **Aller sur** : http://localhost:3000/login
2. **Cliquer** sur le bouton **"Admin"**
3. **Résultat attendu** : Connexion réussie, redirection vers `/client`

4. **Se déconnecter**
5. **Cliquer** sur le bouton **"Client"**
6. **Résultat attendu** : Connexion réussie, redirection vers `/client`

---

## 🐛 SI ÇA NE FONCTIONNE TOUJOURS PAS

### Vérifier les Emails

Les emails doivent être **exactement** :
```
admin@ecotp.test
client@ecotp.test
```

Pas :
```
❌ admin@ecotp.com
❌ admin@eco-tp.test
❌ Admin@ecotp.test (majuscule)
```

### Vérifier les Mots de Passe

Les mots de passe doivent être **exactement** :
```
admin123
client123
```

### Vérifier dans le Code

Le code dans `login/page.tsx` doit avoir :

```tsx
onClick={() => quickLogin({ email: 'admin@ecotp.test', password: 'admin123' })}
onClick={() => quickLogin({ email: 'client@ecotp.test', password: 'client123' })}
```

---

## 💡 ALTERNATIVE : UTILISER VOS VRAIS EMAILS

Si vous voulez utiliser vos vrais emails pour les tests :

### Modifier le Code

Dans `src/app/(auth)/login/page.tsx`, ligne 276 et 285 :

**Remplacer** :
```tsx
onClick={() => quickLogin({ email: 'admin@ecotp.test', password: 'admin123' })}
```

**Par** :
```tsx
onClick={() => quickLogin({ email: 'votre-email@gmail.com', password: 'votre-mot-de-passe' })}
```

---

## 📋 CHECKLIST

- [ ] Désactiver la confirmation email dans Supabase (optionnel)
- [ ] Créer le compte `admin@ecotp.test` / `admin123`
- [ ] Créer le compte `client@ecotp.test` / `client123`
- [ ] Définir le rôle 'admin' pour admin@ecotp.test
- [ ] Définir le rôle 'client' pour client@ecotp.test
- [ ] Vérifier dans la table `profiles`
- [ ] Tester le bouton "Admin"
- [ ] Tester le bouton "Client"

---

## ⏱️ TEMPS ESTIMÉ

- Désactiver confirmation : **1 minute**
- Créer les comptes : **2 minutes**
- Définir les rôles : **1 minute**
- Tester : **1 minute**

**Total** : ~5 minutes

---

**Besoin d'aide ?** Si ça ne fonctionne toujours pas, faites-moi une capture d'écran de l'erreur ! 🚀
