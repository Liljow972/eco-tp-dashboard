# 🔧 CORRECTION ERREUR GOOGLE OAUTH - redirect_uri_mismatch

**Erreur** : `Erreur 400 : redirect_uri_mismatch`

## 🎯 CAUSE DU PROBLÈME

L'URL de redirection configurée dans votre code ne correspond pas à celle enregistrée dans Google Cloud Console.

---

## ✅ SOLUTION RAPIDE

### ÉTAPE 1 : Vérifier l'URL de Redirection Supabase

1. **Aller sur** : https://supabase.com/dashboard
2. **Sélectionner** votre projet
3. **Authentication** → **URL Configuration**
4. **Copier** l'URL de callback :
   ```
   https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
   ```

---

### ÉTAPE 2 : Mettre à Jour Google Cloud Console

1. **Aller sur** : https://console.cloud.google.com
2. **Menu ☰** → **APIs & Services** → **Credentials**
3. **Cliquer** sur votre OAuth 2.0 Client ID
4. **Dans "Authorized redirect URIs"**, ajouter :

   ```
   https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
   ```

5. **IMPORTANT** : Vérifier que cette URL est **EXACTEMENT** la même (pas d'espace, pas de slash en trop)

6. **Cliquer** sur **Save**

---

### ÉTAPE 3 : Vérifier les Origines JavaScript Autorisées

Dans la même page Google Cloud Console :

1. **"Authorized JavaScript origins"** doit contenir :
   ```
   http://localhost:3000
   https://votre-site.vercel.app
   ```

2. **Cliquer** sur **Save**

---

### ÉTAPE 4 : Attendre la Propagation (2-5 minutes)

Google Cloud peut prendre quelques minutes pour propager les changements.

---

## 🧪 TESTER À NOUVEAU

1. **Fermer** tous les onglets de connexion Google
2. **Retourner** sur http://localhost:3000/login
3. **Cliquer** sur "Continuer avec Google"
4. **Autoriser** l'application

---

## 📋 CHECKLIST DE VÉRIFICATION

- [ ] URL de callback Supabase copiée exactement
- [ ] URL ajoutée dans Google Cloud Console
- [ ] Pas d'espace ou de caractère en trop
- [ ] Changements sauvegardés dans Google Cloud
- [ ] Attendu 2-5 minutes pour la propagation
- [ ] Testé à nouveau

---

## 🔍 URLS À VÉRIFIER

### ✅ URL Correcte (Supabase)
```
https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
```

### ❌ URLs Incorrectes (NE PAS UTILISER)
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback-success
https://votre-site.vercel.app/auth/callback
```

---

## 🐛 SI L'ERREUR PERSISTE

### Vérifier dans Supabase Dashboard

1. **Authentication** → **Providers** → **Google**
2. **Vérifier** que :
   - Google est **Enabled** (toggle vert)
   - **Client ID** est correct
   - **Client Secret** est correct
3. **Callback URL** affiché doit être :
   ```
   https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
   ```

### Vérifier dans Google Cloud Console

1. **Credentials** → Votre OAuth Client ID
2. **Authorized redirect URIs** doit contenir **EXACTEMENT** :
   ```
   https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
   ```

---

## 💡 ASTUCE

Si vous avez plusieurs environnements (dev, staging, prod), vous devez ajouter **toutes** les URLs de callback :

```
https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback
https://votre-projet-staging.supabase.co/auth/v1/callback
```

---

## 🎉 APRÈS LA CORRECTION

Une fois corrigé, Google OAuth devrait fonctionner :

1. ✅ Clic sur "Continuer avec Google"
2. ✅ Redirection vers Google
3. ✅ Sélection du compte
4. ✅ Autorisation de l'application
5. ✅ Redirection vers `/client`
6. ✅ Profil créé automatiquement dans Supabase

---

**Temps estimé** : 5 minutes  
**Difficulté** : Facile
