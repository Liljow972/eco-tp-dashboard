# 🔑 CRÉER DES UTILISATEURS DE TEST AVEC MOTS DE PASSE CONNUS

**Date**: 13 février 2026  
**Heure**: 09:37  
**Méthode**: Script Node.js avec API Supabase Admin

---

## 🎯 OBJECTIF

Créer des utilisateurs de test avec des mots de passe connus pour pouvoir se connecter facilement.

---

## ✅ SOLUTION (5 MIN)

### Étape 1: Récupérer la clé Service Role (2 min)

1. **Ouvrir Supabase Dashboard**
   - https://supabase.com/dashboard
   - Sélectionner votre projet

2. **Aller dans Settings > API**

3. **Copier la clé `service_role`**
   - ⚠️ **ATTENTION**: Cette clé est secrète, ne la partagez jamais !
   - Elle commence par `eyJ...`

---

### Étape 2: Mettre à jour le script (1 min)

**Fichier**: `create-test-users.js`

**Ligne 10**: Remplacer `VOTRE_SERVICE_ROLE_KEY_ICI` par votre vraie clé

```javascript
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Votre clé
```

---

### Étape 3: Exécuter le script (1 min)

**Dans le terminal**:

```bash
cd eco-tp-dashboard
node create-test-users.js
```

**Résultat attendu**:

```
🚀 Création des utilisateurs de test...

📧 Création de admin.demo@ecotp.com...
✅ Utilisateur auth créé: abc123...
✅ Profil créé pour admin.demo@ecotp.com
   📝 Email: admin.demo@ecotp.com
   🔑 Mot de passe: EcoTP2024!
   👤 Rôle: admin
   🆔 ID: abc123...

📧 Création de client.demo@ecotp.com...
✅ Utilisateur auth créé: def456...
✅ Profil créé pour client.demo@ecotp.com
   📝 Email: client.demo@ecotp.com
   🔑 Mot de passe: EcoTP2024!
   👤 Rôle: client
   🆔 ID: def456...

✅ Terminé !

📋 Résumé des comptes créés:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍💼 admin.demo@ecotp.com / EcoTP2024! (admin)
👤 client.demo@ecotp.com / EcoTP2024! (client)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Script terminé avec succès !
```

---

### Étape 4: Tester la connexion (1 min)

1. **Aller sur** http://localhost:3000/login

2. **Se connecter**:
   - Email: `admin.demo@ecotp.com`
   - Mot de passe: `EcoTP2024!`

3. **Vérifier**:
   - ✅ Connexion réussie
   - ✅ Redirection vers `/admin`
   - ✅ Dashboard charge correctement

---

## 📊 COMPTES CRÉÉS

| Rôle | Email | Mot de passe | Usage |
|------|-------|--------------|-------|
| Admin | `admin.demo@ecotp.com` | `EcoTP2024!` | Gestion complète |
| Client | `client.demo@ecotp.com` | `EcoTP2024!` | Vue client |

---

## 🔄 METTRE À JOUR LES BOUTONS DE DÉMO (OPTIONNEL)

**Fichier**: `src/app/(auth)/login/page.tsx`

**Mettre à jour les fonctions**:

```typescript
const handleQuickLoginAdmin = () => {
  setEmail('admin.demo@ecotp.com')  // ✅ Nouveau
  setPassword('EcoTP2024!')          // ✅ Nouveau
}

const handleQuickLoginClient = () => {
  setEmail('client.demo@ecotp.com')  // ✅ Nouveau
  setPassword('EcoTP2024!')          // ✅ Nouveau
}
```

---

## 🎯 CRÉER UN PROJET POUR LE CLIENT DEMO

**Après avoir créé les utilisateurs**, créez un projet pour le client :

```sql
-- 1. Récupérer l'ID du client demo
SELECT id, email FROM auth.users WHERE email = 'client.demo@ecotp.com';

-- 2. Créer un projet (REMPLACEZ l'ID)
INSERT INTO projects (id, client_id, name, status, progress, start_date, end_date, budget, description)
VALUES (
    gen_random_uuid(),
    'ID_CLIENT_DEMO_ICI',  -- ⚠️ REMPLACEZ
    'Villa Moderne - Terrassement',
    'in_progress',
    45,
    '2024-02-01',
    '2024-06-30',
    75000,
    'Projet de terrassement pour villa moderne avec piscine'
);
```

---

## ⚠️ SÉCURITÉ

**IMPORTANT**:
- ✅ La clé `service_role` est **très puissante**
- ✅ Ne la commitez **JAMAIS** dans Git
- ✅ Ne la partagez **JAMAIS** publiquement
- ✅ Utilisez-la **uniquement** pour des scripts d'administration

**Après avoir créé les utilisateurs**:
- Supprimez la clé du script
- Ou ajoutez `create-test-users.js` dans `.gitignore`

---

## 🎉 RÉSULTAT FINAL

**Après cette étape**:
- ✅ Utilisateurs de test créés
- ✅ Mots de passe connus
- ✅ Connexion fonctionne
- ✅ Dashboard charge
- ✅ **Application 100% opérationnelle !** 🚀

---

**PROCHAINE ACTION**: 

1. **Récupérer la clé service_role** dans Supabase
2. **Mettre à jour le script**
3. **Exécuter** `node create-test-users.js`
4. **Tester la connexion** !

**Temps estimé**: 5 minutes

**Résultat**: Connexion fonctionnelle avec des comptes de test ! 💪
