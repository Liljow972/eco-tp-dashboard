# 🚀 CRÉATION RAPIDE DES COMPTES DÉMO

## Méthode Simple : Via Supabase Dashboard

### Étape 1 : Aller dans Users

1. **Supabase Dashboard** : https://supabase.com/dashboard
2. **Sélectionner** votre projet
3. **Authentication** (dans le menu de gauche)
4. **Users** (sous-menu)

### Étape 2 : Créer le Compte Admin

1. **Cliquer** sur **"Add user"** (en haut à droite)
2. **Sélectionner** : **"Create new user"**
3. **Remplir** :
   ```
   Email: admin@ecotp.test
   Password: admin123
   ```
4. ✅ **IMPORTANT** : Cocher **"Auto Confirm User"**
5. **Cliquer** sur **"Create user"**

### Étape 3 : Créer le Compte Client

1. **Cliquer** sur **"Add user"**
2. **Sélectionner** : **"Create new user"**
3. **Remplir** :
   ```
   Email: client@ecotp.test
   Password: client123
   ```
4. ✅ **IMPORTANT** : Cocher **"Auto Confirm User"**
5. **Cliquer** sur **"Create user"**

### Étape 4 : Définir les Rôles

1. **Aller dans** : **SQL Editor** (menu de gauche)
2. **Cliquer** sur **"New query"**
3. **Copier-coller** ce code :

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

-- Vérifier
SELECT email, name, role FROM profiles
WHERE email IN ('admin@ecotp.test', 'client@ecotp.test');
```

4. **Cliquer** sur **"Run"** (ou F5)
5. **Vérifier** que vous voyez les 2 profils avec les bons rôles

### Étape 5 : Tester

1. **Aller sur** : http://localhost:3000/login
2. **Cliquer** sur le bouton **"Admin"**
3. ✅ Devrait fonctionner !

---

## ⏱️ Temps Total : 3 minutes

---

## 📸 Captures d'Écran Attendues

### Dans Supabase → Authentication → Users

Vous devriez voir :
```
✅ admin@ecotp.test (Confirmed)
✅ client@ecotp.test (Confirmed)
```

### Dans SQL Editor (après la requête)

Vous devriez voir :
```
email               | name         | role
--------------------|--------------|-------
admin@ecotp.test    | Admin EcoTP  | admin
client@ecotp.test   | Client Test  | client
```

---

## 🐛 Si Ça Ne Fonctionne Toujours Pas

Faites-moi une capture d'écran de :
1. La page **Authentication → Users** dans Supabase
2. Le résultat de la requête SQL
3. L'erreur que vous voyez quand vous cliquez sur "Admin"
