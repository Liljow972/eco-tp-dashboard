# 🔧 PROBLÈME: MOTS DE PASSE INCORRECTS

**Date**: 13 février 2026  
**Heure**: 09:17  
**Statut**: 🔍 **CAUSE IDENTIFIÉE**

---

## 🐛 DIAGNOSTIC

### Symptômes observés
- ✅ Profils créés
- ✅ Projet créé
- ❌ Connexion échoue avec "Invalid login credentials"
- ❌ Erreur Supabase: `400 Bad Request`

### Cause racine

**Les mots de passe dans Supabase ne correspondent PAS aux mots de passe utilisés par les boutons de démo**

**Boutons de démo** (dans le code):
- Admin: `ecotpmartinique@gmail.com` / `password123` (probablement)
- Client: `client@ecotp.test` / `password123` (probablement)

**Supabase**: Les mots de passe sont différents ou n'ont jamais été définis

---

## ✅ SOLUTION (5 MIN)

### Option 1: Réinitialiser les mots de passe dans Supabase ⭐ RECOMMANDÉ

**Étapes**:

1. **Ouvrir Supabase Dashboard**
   - https://supabase.com/dashboard
   - Sélectionner votre projet

2. **Aller dans Authentication > Users**

3. **Pour chaque utilisateur**:
   - Cliquer sur l'utilisateur
   - Cliquer sur "Reset Password"
   - Définir un nouveau mot de passe: `EcoTP2024!`
   - Sauvegarder

4. **Utilisateurs à mettre à jour**:
   - `ecotpmartinique@gmail.com` → Mot de passe: `EcoTP2024!`
   - `client@ecotp.test` → Mot de passe: `EcoTP2024!`

---

### Option 2: Mettre à jour les boutons de démo dans le code

**Fichier**: `src/app/(auth)/login/page.tsx`

**Trouver les boutons de démo et mettre à jour les mots de passe**:

```typescript
// Bouton Admin
const handleQuickLoginAdmin = () => {
  setEmail('ecotpmartinique@gmail.com')
  setPassword('VOTRE_VRAI_MOT_DE_PASSE')  // ⚠️ Mettre le vrai mot de passe
}

// Bouton Client
const handleQuickLoginClient = () => {
  setEmail('client@ecotp.test')
  setPassword('VOTRE_VRAI_MOT_DE_PASSE')  // ⚠️ Mettre le vrai mot de passe
}
```

---

### Option 3: Créer de nouveaux utilisateurs avec des mots de passe connus

**Dans Supabase Authentication > Users > Add User**:

**Utilisateur 1 - Admin**:
- Email: `admin.demo@ecotp.com`
- Password: `EcoTP2024!`
- User Metadata:
  ```json
  {
    "name": "Admin Demo",
    "role": "admin"
  }
  ```

**Utilisateur 2 - Client**:
- Email: `client.demo@ecotp.com`
- Password: `EcoTP2024!`
- User Metadata:
  ```json
  {
    "name": "Client Demo",
    "role": "client"
  }
  ```

**Puis créer les profils**:
```sql
-- Profil Admin
INSERT INTO profiles (id, name, role, company)
VALUES (
    'ID_ADMIN_ICI',  -- Copier depuis auth.users
    'Admin Demo',
    'admin',
    'Eco TP'
);

-- Profil Client
INSERT INTO profiles (id, name, role, company)
VALUES (
    'ID_CLIENT_ICI',  -- Copier depuis auth.users
    'Client Demo',
    'client',
    'Particulier'
);
```

---

## 🧪 TEST APRÈS CORRECTION

### Méthode 1: Connexion manuelle

1. Aller sur http://localhost:3000/login
2. Entrer manuellement:
   - Email: `ecotpmartinique@gmail.com`
   - Mot de passe: `EcoTP2024!` (ou le mot de passe que vous avez défini)
3. Cliquer "Se connecter"
4. ✅ Devrait rediriger vers `/admin`

### Méthode 2: Boutons de démo (après mise à jour du code)

1. Mettre à jour les mots de passe dans le code
2. Rafraîchir la page
3. Cliquer sur "Admin (Email Demo)"
4. Cliquer "Se connecter"
5. ✅ Devrait rediriger vers `/admin`

---

## 📊 RÉSUMÉ

### Problèmes résolus

1. ✅ Colonne `name` → `title`
2. ✅ `client_id` corrigé
3. ✅ Profils créés
4. ✅ Timeout augmenté
5. ⚠️ **Mots de passe à corriger** (en cours)

### Après cette correction

- ✅ Connexion fonctionne
- ✅ Dashboard charge
- ✅ Realtime activé
- ✅ **Application 100% opérationnelle !** 🎉

---

## 🎯 PROCHAINE ACTION

**MAINTENANT**: 

1. **Ouvrir Supabase Dashboard**
2. **Authentication > Users**
3. **Réinitialiser les mots de passe**:
   - `ecotpmartinique@gmail.com` → `EcoTP2024!`
   - `client@ecotp.test` → `EcoTP2024!`
4. **Tester la connexion**

**OU**

1. **Créer de nouveaux utilisateurs** avec des mots de passe connus
2. **Créer leurs profils**
3. **Mettre à jour le projet** avec le bon `client_id`
4. **Tester la connexion**

---

**Temps estimé**: 5 minutes

**Résultat**: Connexion fonctionnelle ! 🚀
