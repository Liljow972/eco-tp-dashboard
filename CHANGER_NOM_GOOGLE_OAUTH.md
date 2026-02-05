# 🎨 CHANGER LE NOM DE L'APPLICATION GOOGLE OAUTH

**Problème** : Google affiche "Accéder à l'application dhrxwkvdtiqqspljkspq.supabase.co"

**Solution** : Modifier l'écran de consentement OAuth dans Google Cloud Console

---

## 🚀 ÉTAPES POUR CORRIGER

### Étape 1 : Aller sur Google Cloud Console

1. **Ouvrir** : https://console.cloud.google.com
2. **Sélectionner** votre projet "Eco TP Dashboard" (ou le projet que vous utilisez)

---

### Étape 2 : Accéder à l'Écran de Consentement OAuth

1. **Menu ☰** (en haut à gauche)
2. **APIs & Services**
3. **OAuth consent screen**

---

### Étape 3 : Modifier le Nom de l'Application

Vous verrez une page avec les informations de votre application.

**Cliquer** sur **"EDIT APP"** (ou "MODIFIER L'APPLICATION")

Dans la section **"App information"** :

1. **App name** : Changer en `Eco TP Dashboard`
2. **User support email** : Votre email
3. **App logo** (optionnel) : Vous pouvez uploader le logo Eco TP
4. **Application home page** (optionnel) : `https://eco-tp-dashboard.vercel.app`
5. **Application privacy policy link** (optionnel) : Laisser vide pour l'instant
6. **Application terms of service link** (optionnel) : Laisser vide pour l'instant

**Cliquer** sur **"SAVE AND CONTINUE"**

---

### Étape 4 : Vérifier les Scopes

Sur la page suivante (Scopes), vous pouvez laisser par défaut.

**Cliquer** sur **"SAVE AND CONTINUE"**

---

### Étape 5 : Test Users (Important !)

Si votre app est en mode "Testing", vous devez ajouter des utilisateurs de test.

**Cliquer** sur **"+ ADD USERS"**

**Ajouter** votre email de test (celui que vous utilisez pour vous connecter)

**Cliquer** sur **"SAVE AND CONTINUE"**

---

### Étape 6 : Publier l'Application (Optionnel)

Si vous voulez que n'importe qui puisse se connecter :

1. **Retourner** sur "OAuth consent screen"
2. **Cliquer** sur **"PUBLISH APP"**
3. **Confirmer**

⚠️ **Note** : En mode "Testing", seuls les utilisateurs que vous avez ajoutés peuvent se connecter.

---

## ✅ RÉSULTAT ATTENDU

**Avant** :
```
Accéder à l'application dhrxwkvdtiqqspljkspq.supabase.co
```

**Après** :
```
Eco TP Dashboard souhaite accéder à votre compte Google
```

---

## ⏱️ TEMPS DE PROPAGATION

Les changements sont **immédiats** ! Vous pouvez tester tout de suite.

---

## 🧪 TESTER

1. **Fermer** tous les onglets Google
2. **Retourner** sur http://localhost:3000/login
3. **Cliquer** sur "Continuer avec Google"
4. **Vérifier** que le nom est maintenant "Eco TP Dashboard"

---

## 📸 CAPTURE D'ÉCRAN ATTENDUE

Vous devriez voir :

```
┌─────────────────────────────────────┐
│  Se connecter avec Google           │
├─────────────────────────────────────┤
│                                     │
│  Connexion                          │
│                                     │
│  Eco TP Dashboard souhaite accéder  │
│  à votre compte Google              │
│                                     │
│  [Email]                            │
│                                     │
│  [Créer un compte]  [Suivant]       │
│                                     │
└─────────────────────────────────────┘
```

---

## 💡 BONUS : AJOUTER UN LOGO

Pour rendre l'écran encore plus professionnel :

1. **Préparer** le logo Eco TP (format PNG, 512x512px minimum)
2. **OAuth consent screen** → **EDIT APP**
3. **App logo** → **Upload**
4. **Sélectionner** votre logo
5. **SAVE**

**Résultat** : Votre logo apparaîtra sur l'écran de connexion Google ! 🎨

---

## 🎯 CHECKLIST

- [ ] Aller sur Google Cloud Console
- [ ] OAuth consent screen → EDIT APP
- [ ] Changer "App name" en "Eco TP Dashboard"
- [ ] Ajouter votre email dans "Test users"
- [ ] SAVE AND CONTINUE
- [ ] Tester la connexion Google
- [ ] Vérifier que le nom est correct

---

**Temps estimé** : 3 minutes
