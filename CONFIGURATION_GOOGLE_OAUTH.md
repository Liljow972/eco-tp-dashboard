# 🔐 Configuration Google OAuth avec Supabase pour Vercel

## ✅ CE QUI EST DÉJÀ FAIT

Le code a été modifié pour utiliser **Supabase OAuth** au lieu de l'API Emergent Auth.
- ✅ Bouton "Continuer avec Google" sur `/login`
- ✅ Bouton "Continuer avec Google" sur `/register`
- ✅ Code fonctionnel sur **Vercel, Netlify, ou tout autre hébergement**

## 📋 ÉTAPES POUR ACTIVER GOOGLE OAUTH

### Étape 1: Configurer Google Cloud Console

1. **Aller sur Google Cloud Console**
   - URL: https://console.cloud.google.com/
   - Créer un nouveau projet ou sélectionner un existant

2. **Activer Google+ API**
   - Navigation: APIs & Services > Library
   - Rechercher "Google+ API"
   - Cliquer sur "Enable"

3. **Créer des identifiants OAuth 2.0**
   - Navigation: APIs & Services > Credentials
   - Cliquer sur "Create Credentials" > "OAuth client ID"
   - Type d'application: "Web application"
   
4. **Configurer les URLs autorisées**
   
   **JavaScript origins autorisées:**
   ```
   http://localhost:3000
   https://votre-app.vercel.app
   ```
   
   **URIs de redirection autorisées:**
   ```
   https://VOTRE_PROJET_ID.supabase.co/auth/v1/callback
   ```
   
   ⚠️ Remplacez `VOTRE_PROJET_ID` par votre vrai ID Supabase
   
5. **Récupérer les identifiants**
   - Copiez le **Client ID** 
   - Copiez le **Client Secret**

### Étape 2: Configurer Supabase

1. **Aller sur Supabase Dashboard**
   - URL: https://app.supabase.com/
   - Sélectionnez votre projet

2. **Activer Google Provider**
   - Navigation: Authentication > Providers
   - Trouver "Google" dans la liste
   - Cliquer sur "Enable"

3. **Ajouter les identifiants Google**
   - Coller le **Client ID** de Google
   - Coller le **Client Secret** de Google
   - **Site URL**: `https://votre-app.vercel.app`
   - **Redirect URLs**: Ajouter toutes vos URLs:
     ```
     http://localhost:3000/**
     https://votre-app.vercel.app/**
     ```

4. **Sauvegarder la configuration**

### Étape 3: Variables d'environnement

Assurez-vous que votre `.env.local` (développement) et les variables Vercel contiennent:

```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_PROJET_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_publique_supabase
NEXT_PUBLIC_SITE_URL=https://votre-app.vercel.app
```

**Sur Vercel:**
1. Settings > Environment Variables
2. Ajouter les 3 variables ci-dessus
3. Redéployer l'application

### Étape 4: Tester

1. **En local (http://localhost:3000):**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
   - Aller sur `/login`
   - Cliquer sur "Continuer avec Google"
   - Se connecter avec Google
   - Vérifier la redirection vers `/dashboard`

2. **En production (Vercel):**
   - Déployez l'application
   - Testez le même flow

## 🎯 FLOW D'AUTHENTIFICATION

```
1. Utilisateur clique sur "Continuer avec Google"
   ↓
2. Supabase redirige vers Google OAuth
   ↓
3. Utilisateur s'authentifie avec Google
   ↓
4. Google redirige vers Supabase callback
   ↓
5. Supabase crée la session utilisateur
   ↓
6. Redirection vers /auth/callback-success
   ↓
7. Création du profil utilisateur (si nouveau)
   ↓
8. Redirection finale vers /dashboard
```

## ⚠️ PROBLÈMES COURANTS

### Erreur: "Invalid redirect URI"
**Solution:** Vérifier que l'URI de callback Supabase est bien ajoutée dans Google Cloud Console

### Erreur: "Site URL mismatch"
**Solution:** Dans Supabase, vérifier que la Site URL correspond bien à votre domaine Vercel

### L'utilisateur n'est pas redirigé après connexion
**Solution:** Vérifier que `/auth/callback-success` existe et gère correctement la session

### L'authentification fonctionne en local mais pas sur Vercel
**Solution:** 
1. Vérifier les variables d'environnement sur Vercel
2. Ajouter l'URL Vercel dans les URIs autorisées Google
3. Vérifier que NEXT_PUBLIC_SITE_URL est bien défini

## 📝 NOTES IMPORTANTES

- ✅ **Fonctionne sur Vercel, Netlify, et tout hébergement**
- ✅ **Utilise Supabase (pas d'API Emergent)**
- ✅ **Configuration simple et rapide**
- ✅ **Gratuit jusqu'à 50,000 utilisateurs actifs/mois (Supabase)**

## 🚀 APRÈS CONFIGURATION

Une fois Google OAuth configuré, voici ce que vos utilisateurs pourront faire:

1. **Se connecter avec Google** (aucun mot de passe nécessaire)
2. **S'inscrire avec Google** (création automatique du compte)
3. **Utiliser les comptes démo** (admin@ecotp.test / client@ecotp.test)
4. **Connexion classique** (email + mot de passe)

## 📞 SUPPORT

Si vous rencontrez des problèmes:
1. Vérifiez les logs Supabase: Dashboard > Logs > Auth Logs
2. Vérifiez les logs Vercel: Dashboard > Deployments > Logs
3. Utilisez les outils de développement du navigateur (Console)

---

**Développé pour Eco TP Dashboard** 🌱
