# 🚨 PLAN D'ACTION URGENT - Livraison Cette Semaine

**Date**: 2 février 2026  
**Deadline**: Fin de semaine  
**Statut**: 🔴 CRITIQUE - Authentification non fonctionnelle

---

## 📊 RÉSUMÉ DE L'AUDIT

### ✅ Ce qui fonctionne
- ✅ Git synchronisé (local = remote)
- ✅ Interface utilisateur complète et moderne
- ✅ Supabase installé et configuré
- ✅ Schéma de base de données prêt
- ✅ Variables d'environnement configurées

### ❌ Ce qui NE fonctionne PAS
- ❌ **Inscription** : Stocke dans localStorage au lieu de Supabase
- ❌ **Connexion** : Utilise des comptes hardcodés au lieu de Supabase
- ❌ **Google OAuth** : Totalement absent
- ❌ **Base de données** : Aucune donnée n'est sauvegardée dans Supabase
- ❌ **Profils utilisateur** : Non créés automatiquement

---

## 🎯 OBJECTIFS DE LIVRAISON

1. ✅ Inscription fonctionnelle avec Supabase
2. ✅ Connexion fonctionnelle avec Supabase
3. ✅ Google OAuth opérationnel
4. ✅ Profils utilisateur créés automatiquement dans la BDD
5. ✅ Données persistées dans Supabase

---

## 📝 ÉTAPES D'IMPLÉMENTATION

### ÉTAPE 1 : Vérifier la Base de Données Supabase (30 min)

#### Actions :
1. Se connecter au Dashboard Supabase : https://supabase.com
2. Vérifier si les tables existent :
   - `profiles`
   - `projects`
   - `documents`
   - `project_updates`

3. Si les tables n'existent pas :
   - Aller dans **SQL Editor**
   - Copier le contenu de `supabase-schema.sql`
   - Exécuter le script SQL

4. Vérifier le trigger `on_auth_user_created` :
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

5. Vérifier le bucket `documents` dans **Storage**

#### Fichiers à vérifier :
- `supabase-schema.sql` ✅ (existe déjà)

---

### ÉTAPE 2 : Implémenter l'Authentification Supabase (2-3 heures)

#### 2.1 Modifier `src/lib/auth.ts`

**REMPLACER** le contenu actuel par :

```typescript
import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
}

export class AuthService {
  // Inscription avec Supabase
  static async signUpWithEmail(
    email: string, 
    password: string, 
    name: string, 
    role: 'client' | 'admin' = 'client'
  ): Promise<{ user: AuthUser | null, error: string | null }> {
    try {
      // 1. Créer le compte Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Erreur lors de la création du compte' };
      }

      // 2. Récupérer le profil créé automatiquement par le trigger
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Erreur profil:', profileError);
        // Le profil sera créé par le trigger, on continue quand même
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile?.name || name,
        role: (profile?.role as 'client' | 'admin') || role
      };

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || 'Erreur d\'inscription' };
    }
  }

  // Connexion avec Supabase
  static async signInWithEmail(
    email: string, 
    password: string
  ): Promise<{ user: AuthUser | null, error: string | null }> {
    try {
      // 1. Connexion Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return { user: null, error: 'Email ou mot de passe incorrect' };
      }

      if (!authData.user) {
        return { user: null, error: 'Erreur de connexion' };
      }

      // 2. Récupérer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { user: null, error: 'Profil utilisateur introuvable' };
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile.name,
        role: profile.role
      };

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message || 'Erreur de connexion' };
    }
  }

  // Connexion avec Google OAuth
  static async signInWithGoogle(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Erreur de connexion Google' };
    }
  }

  // Déconnexion
  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  // Récupérer l'utilisateur actuel
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      return {
        id: user.id,
        email: user.email!,
        name: profile.name,
        role: profile.role
      };
    } catch {
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  static async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  // Vérifier si l'utilisateur est admin
  static async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  }
}

// Comptes de test (pour référence uniquement)
export const TEST_ACCOUNTS = {
  client: {
    email: 'client@ecotp.test',
    password: 'client123',
    name: 'Client Test',
    role: 'client' as const
  },
  admin: {
    email: 'admin@ecotp.test',
    password: 'admin123',
    name: 'Admin Test',
    role: 'admin' as const
  }
};
```

#### Fichiers à modifier :
- ✅ `src/lib/auth.ts`

---

### ÉTAPE 3 : Ajouter Google OAuth au Modal (1 heure)

#### 3.1 Modifier `src/components/auth/AuthModal.tsx`

Ajouter le bouton Google OAuth après le formulaire :

```typescript
// Ajouter cette fonction dans le composant
const handleGoogleSignIn = async () => {
  setIsLoading(true);
  setError(null);
  
  const { error } = await AuthService.signInWithGoogle();
  
  if (error) {
    setError(error);
    setIsLoading(false);
  }
  // La redirection sera gérée automatiquement par Supabase
};

// Ajouter ce bouton AVANT le bouton "Submit" dans le formulaire
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
  </div>
</div>

<button
  type="button"
  onClick={handleGoogleSignIn}
  disabled={isLoading}
  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continuer avec Google
</button>
```

#### Fichiers à modifier :
- ✅ `src/components/auth/AuthModal.tsx`

---

### ÉTAPE 4 : Créer la Route de Callback OAuth (30 min)

#### 4.1 Créer `src/app/auth/callback/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Rediriger vers le dashboard approprié
  return NextResponse.redirect(`${requestUrl.origin}/client`);
}
```

#### Fichiers à créer :
- ✅ `src/app/auth/callback/route.ts`

---

### ÉTAPE 5 : Configurer Google OAuth dans Supabase (30 min)

#### 5.1 Google Cloud Console

1. Aller sur https://console.cloud.google.com
2. Créer un nouveau projet ou sélectionner un existant
3. Activer "Google+ API"
4. Créer des identifiants OAuth 2.0 :
   - Type : Application Web
   - Origines JavaScript autorisées :
     - `http://localhost:3000`
     - `https://votre-site.vercel.app`
   - URI de redirection autorisés :
     - `https://dhrxwkvdtiqqspljkspq.supabase.co/auth/v1/callback`

5. Copier **Client ID** et **Client Secret**

#### 5.2 Supabase Dashboard

1. Aller sur https://supabase.com
2. Sélectionner votre projet
3. **Authentication** → **Providers** → **Google**
4. Activer Google
5. Coller **Client ID** et **Client Secret**
6. Sauvegarder

---

### ÉTAPE 6 : Mettre à Jour AuthContext (1 heure)

#### 6.1 Modifier `src/contexts/AuthContext.tsx`

Remplacer le système localStorage par Supabase :

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, role: 'client' | 'admin') => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session au chargement
    AuthService.getCurrentUser().then(setUser).finally(() => setLoading(false));

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: authUser, error } = await AuthService.signInWithEmail(email, password);
    if (authUser) setUser(authUser);
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, role: 'client' | 'admin') => {
    const { user: authUser, error } = await AuthService.signUpWithEmail(email, password, name, role);
    if (authUser) setUser(authUser);
    return { error };
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  const signInWithGoogle = async () => {
    return await AuthService.signInWithGoogle();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### Fichiers à modifier :
- ✅ `src/contexts/AuthContext.tsx`

---

### ÉTAPE 7 : Tester l'Application (2 heures)

#### 7.1 Tests Locaux

```bash
# Démarrer le serveur
npm run dev

# Tester dans le navigateur : http://localhost:3000
```

#### Tests à effectuer :

1. **Inscription Email/Password**
   - [ ] Créer un nouveau compte
   - [ ] Vérifier dans Supabase Dashboard → Authentication → Users
   - [ ] Vérifier dans Table Editor → profiles

2. **Connexion Email/Password**
   - [ ] Se connecter avec le compte créé
   - [ ] Vérifier la redirection vers /client ou /admin
   - [ ] Vérifier que les données utilisateur s'affichent

3. **Google OAuth**
   - [ ] Cliquer sur "Continuer avec Google"
   - [ ] Autoriser l'application
   - [ ] Vérifier la création automatique du profil
   - [ ] Vérifier la redirection

4. **Déconnexion**
   - [ ] Se déconnecter
   - [ ] Vérifier la redirection vers la page d'accueil

#### 7.2 Vérification Base de Données

Dans Supabase Dashboard :
- [ ] Table `profiles` contient les nouveaux utilisateurs
- [ ] Champ `role` est correctement défini
- [ ] Champ `name` est rempli

---

### ÉTAPE 8 : Déploiement Production (1 heure)

#### 8.1 Variables d'Environnement Vercel

Ajouter sur Vercel (Settings → Environment Variables) :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dhrxwkvdtiqqspljkspq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_a6DHXlmsTFga7PIWSQNilA_XXcFQggV
SUPABASE_SERVICE_ROLE_KEY=[À RÉCUPÉRER DANS SUPABASE]
NEXT_PUBLIC_SITE_URL=https://votre-site.vercel.app
```

#### 8.2 Push et Déploiement

```bash
# Commit des changements
git add .
git commit -m "Feat: Implement Supabase Authentication with Google OAuth"
git push origin master

# Vercel déploiera automatiquement
```

#### 8.3 Tests Production

- [ ] Tester l'inscription sur le site en production
- [ ] Tester la connexion
- [ ] Tester Google OAuth
- [ ] Vérifier les données dans Supabase

---

## ⏱️ PLANNING

| Étape | Durée | Responsable |
|-------|-------|-------------|
| 1. Vérifier BDD Supabase | 30 min | Dev |
| 2. Implémenter Auth Supabase | 2-3h | Dev |
| 3. Ajouter Google OAuth UI | 1h | Dev |
| 4. Route Callback | 30 min | Dev |
| 5. Config Google OAuth | 30 min | Dev |
| 6. Mettre à jour AuthContext | 1h | Dev |
| 7. Tests | 2h | Dev + QA |
| 8. Déploiement | 1h | DevOps |
| **TOTAL** | **8-10h** | **1-2 jours** |

---

## 🚨 POINTS DE VIGILANCE

1. **Trigger Supabase** : S'assurer que `on_auth_user_created` fonctionne
2. **Politiques RLS** : Vérifier que les utilisateurs peuvent lire leur propre profil
3. **Google OAuth** : Bien configurer les URLs de redirection
4. **Variables d'env** : Ne PAS committer les clés secrètes
5. **Tests** : Tester TOUS les flux avant la livraison

---

## 📞 SUPPORT

### Ressources
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Next.js + Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

### Contacts
- Dashboard Supabase : https://supabase.com/dashboard
- Support Vercel : https://vercel.com/support

---

## ✅ CHECKLIST FINALE

Avant de livrer :

- [ ] Inscription fonctionne avec Supabase
- [ ] Connexion fonctionne avec Supabase
- [ ] Google OAuth opérationnel
- [ ] Profils créés automatiquement
- [ ] Données persistées dans Supabase
- [ ] Tests complets effectués
- [ ] Déployé en production
- [ ] Tests production validés
- [ ] Documentation à jour

---

**🎯 OBJECTIF : Application 100% fonctionnelle d'ici vendredi !**
