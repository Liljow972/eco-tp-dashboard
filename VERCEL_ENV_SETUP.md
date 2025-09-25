# 🚀 Configuration des Variables d'Environnement sur Vercel

## ❌ Problème Identifié
```
Error: either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!
```

## ✅ Solution : Configurer les Variables d'Environnement

### 1. 📋 Variables Requises

Vous devez configurer ces variables d'environnement sur Vercel :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXTAUTH_URL=https://votre-site.vercel.app
NEXTAUTH_SECRET=votre_secret_aleatoire
```

### 2. 🔧 Comment Configurer sur Vercel

#### Option A : Via l'Interface Web Vercel
1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Sélectionnez votre projet `eco-tp-dashboard`
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez chaque variable une par une :
   - **Name** : `NEXT_PUBLIC_SUPABASE_URL`
   - **Value** : Votre URL Supabase
   - **Environments** : Cochez `Production`, `Preview`, et `Development`
   - Cliquez **Save**
5. Répétez pour toutes les variables

#### Option B : Via Vercel CLI
```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
```

### 3. 🔍 Où Trouver vos Valeurs Supabase

1. **NEXT_PUBLIC_SUPABASE_URL** et **NEXT_PUBLIC_SUPABASE_ANON_KEY** :
   - Allez sur [supabase.com](https://supabase.com)
   - Sélectionnez votre projet
   - **Settings** → **API**
   - Copiez `Project URL` et `anon public`

2. **SUPABASE_SERVICE_ROLE_KEY** :
   - Même page **Settings** → **API**
   - Copiez `service_role` (⚠️ Gardez-la secrète !)

3. **NEXTAUTH_SECRET** :
   - Générez une chaîne aléatoire :
   ```bash
   openssl rand -base64 32
   ```

4. **NEXTAUTH_URL** :
   - URL de votre site déployé : `https://votre-site.vercel.app`

### 4. 🔄 Redéployer

Après avoir ajouté les variables :

1. **Redéploiement automatique** : Vercel redéploiera automatiquement
2. **Redéploiement manuel** : 
   - Allez dans **Deployments**
   - Cliquez sur les 3 points du dernier déploiement
   - **Redeploy**

### 5. ✅ Vérification

Une fois redéployé, testez :
- `https://votre-site.vercel.app/api/health` → Doit retourner `{"status":"ok"}`
- `https://votre-site.vercel.app/login` → Doit charger sans erreur

### 6. 🆘 Dépannage

Si ça ne marche toujours pas :

1. **Vérifiez les variables** :
   ```bash
   vercel env ls
   ```

2. **Vérifiez les logs** :
   - Vercel Dashboard → **Functions** → Cliquez sur une fonction qui échoue

3. **Variables mal formatées** :
   - Pas d'espaces avant/après les valeurs
   - Pas de guillemets autour des valeurs
   - URL Supabase doit commencer par `https://`

### 7. 📞 Support

Si vous avez encore des problèmes :
1. Vérifiez que votre projet Supabase est actif
2. Testez les variables en local avec un fichier `.env.local`
3. Contactez le support Vercel si nécessaire

---

## 🎯 Résumé Rapide

1. ✅ Ajoutez les 5 variables d'environnement sur Vercel
2. ✅ Redéployez le projet
3. ✅ Testez `/api/health` et `/login`
4. ✅ Votre app devrait fonctionner !