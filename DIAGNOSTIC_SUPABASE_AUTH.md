# 🚨 PROBLÈME CRITIQUE: SUPABASE AUTH NE FONCTIONNE PAS

**Date**: 17 février 2026  
**Heure**: 11:10  
**Statut**: 🔴 **BLOCAGE CRITIQUE**

---

## 🔍 DIAGNOSTIC COMPLET

### Symptômes observés

1. ❌ **Connexion échoue** avec "Invalid login credentials" (400 Bad Request)
2. ❌ **Création de compte via script** échoue avec "Invalid API key"
3. ❌ **Création de compte via interface** échoue avec 400 Bad Request
4. ❌ **Tous les mots de passe** sont rejetés par Supabase

### Erreur Supabase

```
POST https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/token?grant_type=password
Status: 400 Bad Request
```

---

## 🎯 CAUSE RACINE

**Le problème n'est PAS dans le code de l'application.**

**Le problème est dans la configuration Supabase elle-même.**

Possibilités:
1. ✅ **Email confirmation requise** - Supabase est configuré pour exiger la confirmation d'email
2. ✅ **Auth disabled** - L'authentification par email/password est désactivée
3. ✅ **Rate limiting** - Trop de tentatives ont bloqué l'IP
4. ✅ **Project paused** - Le projet Supabase est en pause ou suspendu

---

## ✅ SOLUTION: VÉRIFIER LA CONFIGURATION SUPABASE

### Étape 1: Vérifier le statut du projet (2 min)

**Dans Supabase Dashboard**:

1. **Aller sur** https://supabase.com/dashboard
2. **Sélectionner votre projet** "Eco TP Dashboard"
3. **Vérifier le statut**:
   - ✅ Le projet est actif (pas en pause)
   - ✅ Pas de message d'erreur ou d'avertissement

---

### Étape 2: Vérifier l'authentification par email (3 min)

**Dans Supabase Dashboard > Authentication > Providers**:

1. **Email Provider**:
   - ✅ **Activé** (toggle ON)
   - ✅ **Confirm email** : **DÉSACTIVÉ** ⚠️ IMPORTANT
   - ✅ **Secure email change** : Activé ou désactivé (peu importe)

**CRITIQUE**: Si "Confirm email" est activé, les utilisateurs ne peuvent pas se connecter sans avoir cliqué sur le lien de confirmation dans leur email.

**Solution**: 
- Désactiver "Confirm email" pour les tests
- OU vérifier les emails de confirmation dans votre boîte mail

---

### Étape 3: Vérifier les Rate Limits (1 min)

**Dans Supabase Dashboard > Authentication > Rate Limits**:

1. **Vérifier**:
   - Pas de rate limit atteint
   - Pas d'IP bloquée

**Si bloqué**:
- Attendre quelques minutes
- OU réinitialiser les rate limits

---

### Étape 4: Tester avec un compte Google (RECOMMANDÉ) (2 min)

**Si l'authentification par email ne fonctionne pas**, utilisez Google OAuth:

**Dans Supabase Dashboard > Authentication > Providers**:

1. **Activer Google Provider**:
   - Toggle ON
   - Utiliser les credentials par défaut de Supabase (pour les tests)

2. **Tester**:
   - Aller sur http://localhost:3000/login
   - Cliquer sur "Continuer avec Google" (si le bouton existe)
   - Se connecter avec votre compte Google
   - ✅ Devrait fonctionner !

---

## 🔧 SOLUTION ALTERNATIVE: CRÉER UN UTILISATEUR MANUELLEMENT

**Si tout le reste échoue**, créez un utilisateur directement dans Supabase:

### Dans Supabase Dashboard > Authentication > Users > Add User

**Utilisateur de test**:
- Email: `test@ecotp.local`
- Password: `Test123456!`
- **Auto Confirm User**: ✅ **COCHER CETTE CASE** ⚠️ IMPORTANT
- User Metadata:
  ```json
  {
    "name": "Test User",
    "role": "admin"
  }
  ```

**Puis créer le profil** (SQL Editor):

```sql
-- Récupérer l'ID de l'utilisateur créé
SELECT id, email FROM auth.users WHERE email = 'test@ecotp.local';

-- Créer le profil (REMPLACEZ l'ID)
INSERT INTO profiles (id, name, role, company)
VALUES (
    'ID_UTILISATEUR_ICI',  -- ⚠️ REMPLACEZ
    'Test User',
    'admin',
    'Eco TP'
);
```

**Tester**:
- Aller sur http://localhost:3000/login
- Email: `test@ecotp.local`
- Password: `Test123456!`
- ✅ Devrait fonctionner !

---

## 📊 CHECKLIST DE VÉRIFICATION

**À vérifier dans Supabase Dashboard**:

- [ ] Projet actif (pas en pause)
- [ ] Email Provider activé
- [ ] **"Confirm email" DÉSACTIVÉ** ⚠️ CRITIQUE
- [ ] Pas de rate limit atteint
- [ ] Service role key correcte (pour les scripts)
- [ ] Variables d'environnement correctes dans `.env.local`

---

## 🎯 PROCHAINES ACTIONS

**MAINTENANT**:

1. **Ouvrir Supabase Dashboard**
2. **Authentication > Providers**
3. **Vérifier "Email Provider"**
4. **DÉSACTIVER "Confirm email"** ⚠️ IMPORTANT
5. **Sauvegarder**
6. **Tester la connexion** avec un compte existant

**OU**:

1. **Créer un utilisateur manuellement** dans Supabase
2. **Cocher "Auto Confirm User"**
3. **Créer le profil** via SQL
4. **Tester la connexion**

---

## 📸 CAPTURES D'ÉCRAN ATTENDUES

**Authentication > Providers > Email**:

```
Email
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enable Email provider: [✓] ON

Confirm email: [ ] OFF  ← DOIT ÊTRE DÉSACTIVÉ

Secure email change: [✓] ON

[Save]
```

---

**Temps estimé**: 5-10 minutes

**Résultat**: Authentification fonctionnelle ! 🚀

---

## 🆘 SI RIEN NE FONCTIONNE

**Dernière option**: Créer un **nouveau projet Supabase** avec une configuration propre:

1. Créer un nouveau projet Supabase
2. Importer le schéma de base de données
3. Mettre à jour `.env.local` avec les nouvelles clés
4. Tester

**Mais avant cela**, vérifiez d'abord la configuration "Confirm email" ! C'est probablement la cause du problème.
