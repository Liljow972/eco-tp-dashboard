# 🎯 GUIDE VISUEL - Configuration Google OAuth

**Objectif** : Ajouter l'URL de redirection Supabase dans Google Cloud Console

---

## 📍 ÉTAPE 1 : Accéder aux Identifiants

Vous êtes déjà sur la bonne page ! Je vois que vous êtes sur **Google Cloud Console**.

### Navigation :

1. **Menu ☰** (en haut à gauche)
2. **APIs & Services** 
3. **Credentials** (Identifiants)

---

## 📍 ÉTAPE 2 : Trouver votre OAuth Client ID

Sur la page **Credentials**, vous devriez voir une liste d'identifiants.

### Cherchez :

- **Type** : "OAuth 2.0 Client IDs"
- **Nom** : Probablement quelque chose comme "Web client" ou "EcoTP Dashboard"

### Action :

**Cliquez** sur le nom de votre OAuth Client ID pour l'ouvrir.

---

## 📍 ÉTAPE 3 : Modifier les URIs Autorisés

Une fois que vous avez cliqué sur votre OAuth Client ID, vous verrez une page avec plusieurs sections.

### Section A : **Authorized JavaScript origins**

Cette section liste les domaines autorisés à initier OAuth.

**Ajouter** :
```
http://localhost:3000
```

Si vous déployez sur Vercel, ajoutez aussi :
```
https://votre-site.vercel.app
```

### Section B : **Authorized redirect URIs** ⚠️ IMPORTANT

C'est ici que vous devez ajouter l'URL Supabase !

**Cliquer** sur **"+ ADD URI"** (ou "+ Ajouter un URI")

**Coller exactement** :
```
https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
```

⚠️ **ATTENTION** : 
- Pas d'espace avant ou après
- Pas de slash `/` à la fin
- Exactement comme écrit ci-dessus

---

## 📍 ÉTAPE 4 : Sauvegarder

En bas de la page, cliquer sur **"SAVE"** (ou "ENREGISTRER")

---

## 📍 ÉTAPE 5 : Attendre la Propagation

Google Cloud prend **2 à 5 minutes** pour propager les changements.

Pendant ce temps, vous pouvez :
- ☕ Prendre un café
- 📧 Vérifier vos emails
- 🎵 Écouter une chanson

---

## 📍 ÉTAPE 6 : Tester

Après 5 minutes :

1. **Fermer** tous les onglets de connexion Google
2. **Retourner** sur http://localhost:3000/login
3. **Cliquer** sur "Continuer avec Google"
4. **Sélectionner** votre compte Google
5. **Autoriser** l'application

**Résultat attendu** :
- ✅ Redirection vers Google
- ✅ Sélection du compte
- ✅ Autorisation
- ✅ Redirection vers `/client`
- ✅ Connexion réussie !

---

## 🔍 VÉRIFICATION

### Comment savoir si c'est bon ?

Dans Google Cloud Console, après avoir sauvegardé, vous devriez voir :

**Authorized redirect URIs** :
```
✅ https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
```

---

## 🐛 SI VOUS NE TROUVEZ PAS LA PAGE

### Méthode Alternative :

1. **Aller sur** : https://console.cloud.google.com/apis/credentials
2. Vous arriverez directement sur la page **Credentials**
3. Cherchez votre **OAuth 2.0 Client ID**
4. Cliquez dessus
5. Suivez les étapes ci-dessus

---

## 📸 CAPTURES D'ÉCRAN ATTENDUES

### Avant :
```
Authorized redirect URIs
(vide ou anciennes URLs)
```

### Après :
```
Authorized redirect URIs
✅ https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
```

---

## ⏱️ TEMPS ESTIMÉ

- Trouver la page : **1 minute**
- Ajouter l'URL : **30 secondes**
- Sauvegarder : **10 secondes**
- Attendre propagation : **2-5 minutes**

**Total** : ~5-7 minutes

---

## ✅ CHECKLIST

- [ ] Je suis sur Google Cloud Console
- [ ] J'ai trouvé "APIs & Services" → "Credentials"
- [ ] J'ai cliqué sur mon OAuth Client ID
- [ ] J'ai ajouté l'URL Supabase dans "Authorized redirect URIs"
- [ ] J'ai sauvegardé
- [ ] J'ai attendu 5 minutes
- [ ] J'ai testé la connexion Google

---

**Besoin d'aide ?** Si vous ne trouvez pas où ajouter l'URL, faites-moi une capture d'écran de ce que vous voyez !
