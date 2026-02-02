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
      // Validation
      if (password.length < 6) {
        return { user: null, error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }

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
        console.error('Erreur auth:', authError);
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Erreur lors de la création du compte' };
      }

      // 2. Attendre un peu pour que le trigger crée le profil
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. Récupérer le profil créé automatiquement par le trigger
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
      console.error('Erreur inscription:', error);
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
        console.error('Erreur connexion:', authError);
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
        console.error('Erreur récupération profil:', profileError);
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
      console.error('Erreur connexion:', error);
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
        console.error('Erreur Google OAuth:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Erreur Google OAuth:', error);
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
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
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

// Comptes de test (pour référence uniquement - ne sont plus utilisés)
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