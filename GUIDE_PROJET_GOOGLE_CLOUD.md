# 🔐 GOOGLE OAUTH : UN PROJET PAR APPLICATION ?

**Question** : Faut-il créer un nouveau projet Google Cloud pour Eco TP ou réutiliser celui de LJ RENT ?

---

## ✅ RÉPONSE RECOMMANDÉE : CRÉER UN NOUVEAU PROJET

**Oui**, vous devriez créer un **projet Google Cloud séparé** pour Eco TP.

---

## 🎯 POURQUOI SÉPARER LES PROJETS ?

### 1. **Sécurité** 🔒

Si un projet est compromis, l'autre reste sécurisé.

**Scénario de risque** :
```
LJ RENT compromis → Eco TP aussi compromis ❌
```

**Avec projets séparés** :
```
LJ RENT compromis → Eco TP reste sécurisé ✅
```

---

### 2. **Gestion des Quotas** 📊

Chaque projet Google Cloud a ses propres quotas d'API.

**Avec un seul projet** :
```
LJ RENT : 5000 connexions/jour
Eco TP  : 5000 connexions/jour
Total   : 10000 connexions → DÉPASSEMENT DE QUOTA ❌
```

**Avec projets séparés** :
```
LJ RENT : 5000/10000 connexions ✅
Eco TP  : 3000/10000 connexions ✅
```

---

### 3. **Monitoring et Analytics** 📈

Vous pouvez suivre les statistiques séparément :

**LJ RENT** :
- 1500 connexions Google/mois
- 95% taux de succès

**Eco TP** :
- 800 connexions Google/mois
- 98% taux de succès

---

### 4. **Branding et Consentement** 🎨

L'écran de consentement Google affiche le nom du projet.

**Avec un seul projet** :
```
Utilisateur Eco TP voit :
"LJ RENT souhaite accéder à votre compte Google"
→ Confusion ❌
```

**Avec projets séparés** :
```
Utilisateur Eco TP voit :
"Eco TP Dashboard souhaite accéder à votre compte Google"
→ Clair et professionnel ✅
```

---

### 5. **Gestion des Permissions** 👥

Vous pouvez donner des accès différents :

**LJ RENT** :
- Développeur A : Admin
- Développeur B : Viewer

**Eco TP** :
- Développeur C : Admin
- Développeur D : Editor

---

### 6. **Facturation Séparée** 💰

Si vous dépassez les quotas gratuits, vous pouvez :
- Facturer LJ RENT au client A
- Facturer Eco TP au client B

---

## 📋 COMPARAISON

| Critère | Un Seul Projet | Projets Séparés |
|---------|---------------|-----------------|
| **Sécurité** | ⚠️ Risque partagé | ✅ Isolation |
| **Quotas** | ⚠️ Partagés | ✅ Indépendants |
| **Monitoring** | ❌ Mélangé | ✅ Séparé |
| **Branding** | ❌ Confus | ✅ Professionnel |
| **Gestion** | ⚠️ Complexe | ✅ Simple |
| **Coût** | ✅ Gratuit | ✅ Gratuit |

---

## 🚀 COMMENT CRÉER UN NOUVEAU PROJET

### Étape 1 : Créer le Projet Google Cloud

1. **Aller sur** : https://console.cloud.google.com
2. **Cliquer** sur le sélecteur de projet (en haut à gauche)
3. **Cliquer** sur **"NEW PROJECT"** (Nouveau Projet)
4. **Nom** : `Eco TP Dashboard`
5. **Cliquer** sur **"CREATE"**

---

### Étape 2 : Activer l'API Google OAuth

1. **Menu ☰** → **APIs & Services** → **Library**
2. **Chercher** : "Google+ API" ou "Google Identity"
3. **Cliquer** sur **"ENABLE"**

---

### Étape 3 : Configurer l'Écran de Consentement

1. **Menu ☰** → **APIs & Services** → **OAuth consent screen**
2. **User Type** : External
3. **Cliquer** sur **"CREATE"**
4. **Remplir** :
   - **App name** : `Eco TP Dashboard`
   - **User support email** : votre email
   - **Developer contact** : votre email
5. **Cliquer** sur **"SAVE AND CONTINUE"**
6. **Scopes** : Laisser par défaut, **"SAVE AND CONTINUE"**
7. **Test users** : Ajouter votre email de test
8. **Cliquer** sur **"SAVE AND CONTINUE"**

---

### Étape 4 : Créer les Identifiants OAuth

1. **Menu ☰** → **APIs & Services** → **Credentials**
2. **Cliquer** sur **"+ CREATE CREDENTIALS"**
3. **Sélectionner** : **"OAuth client ID"**
4. **Application type** : **"Web application"**
5. **Name** : `Eco TP Web Client`
6. **Authorized JavaScript origins** :
   ```
   http://localhost:3000
   https://eco-tp-dashboard.vercel.app
   ```
7. **Authorized redirect URIs** :
   ```
   https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
   ```
8. **Cliquer** sur **"CREATE"**

---

### Étape 5 : Copier les Identifiants

Vous verrez une popup avec :
- **Client ID** : `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-xxxxxxxxxx`

**Copier** ces deux valeurs !

---

### Étape 6 : Mettre à Jour Supabase

1. **Aller sur** : https://supabase.com/dashboard
2. **Sélectionner** votre projet Eco TP
3. **Authentication** → **Providers** → **Google**
4. **Coller** :
   - **Client ID** : (celui que vous venez de copier)
   - **Client Secret** : (celui que vous venez de copier)
5. **Cliquer** sur **"Save"**

---

## ⚠️ IMPORTANT : METTRE À JOUR .env.local

Vous n'avez **PAS** besoin de mettre les identifiants Google dans `.env.local` !

Supabase gère tout automatiquement. Vos variables actuelles sont correctes :
```env
NEXT_PUBLIC_SUPABASE_URL=https://dhrxwkvdtiqqspljkspq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 RÉCAPITULATIF

### Ce Que Vous Devez Faire

1. ✅ **Créer** un nouveau projet Google Cloud pour Eco TP
2. ✅ **Configurer** OAuth avec le nouveau projet
3. ✅ **Mettre à jour** Supabase avec les nouveaux identifiants
4. ✅ **Tester** la connexion Google

### Ce Que Vous NE Devez PAS Faire

1. ❌ Réutiliser le projet LJ RENT
2. ❌ Partager les identifiants entre projets
3. ❌ Mettre les identifiants Google dans `.env.local`

---

## 💡 BONUS : ORGANISATION RECOMMANDÉE

### Structure Idéale

```
Google Cloud
├── LJ RENT Project
│   ├── OAuth Client ID (LJ RENT)
│   └── APIs activées pour LJ RENT
│
└── Eco TP Project
    ├── OAuth Client ID (Eco TP)
    └── APIs activées pour Eco TP
```

### Supabase

```
Supabase
├── LJ RENT Database
│   └── Google OAuth → LJ RENT Project
│
└── Eco TP Database
    └── Google OAuth → Eco TP Project
```

---

## ⏱️ TEMPS ESTIMÉ

- Créer le projet : **2 minutes**
- Configurer OAuth : **5 minutes**
- Mettre à jour Supabase : **1 minute**
- Tester : **2 minutes**

**Total** : ~10 minutes

---

## ✅ CHECKLIST

- [ ] Créer un nouveau projet Google Cloud "Eco TP Dashboard"
- [ ] Activer l'API Google OAuth
- [ ] Configurer l'écran de consentement
- [ ] Créer les identifiants OAuth
- [ ] Copier Client ID et Client Secret
- [ ] Mettre à jour Supabase avec les nouveaux identifiants
- [ ] Tester la connexion Google sur Eco TP
- [ ] Vérifier que LJ RENT fonctionne toujours

---

## 🎉 RÉSULTAT FINAL

**Après configuration** :

### LJ RENT
```
Google OAuth → LJ RENT Project
Utilisateurs voient : "LJ RENT souhaite accéder..."
```

### Eco TP
```
Google OAuth → Eco TP Project
Utilisateurs voient : "Eco TP Dashboard souhaite accéder..."
```

**Chaque application est indépendante et professionnelle !** ✅

---

**Besoin d'aide pour créer le nouveau projet ?** Je peux vous guider étape par étape ! 🚀
