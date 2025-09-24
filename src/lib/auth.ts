import { supabase } from './supabase';

// Comptes de test prédéfinis
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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
}

export class AuthService {
  // Connexion avec email/mot de passe
  static async signInWithEmail(email: string, password: string): Promise<{ user: AuthUser | null, error: string | null }> {
    try {
      // Vérifier les comptes de test d'abord
      const testAccount = Object.values(TEST_ACCOUNTS).find(account => 
        account.email === email && account.password === password
      );

      if (testAccount) {
        const user: AuthUser = {
          id: `test-${testAccount.role}`,
          email: testAccount.email,
          name: testAccount.name,
          role: testAccount.role
        };
        
        // Stocker dans localStorage pour la session
        localStorage.setItem('auth_user', JSON.stringify(user));
        return { user, error: null };
      }

      // Sinon, essayer avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Récupérer le profil utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.user_metadata?.name || '',
          role: profile?.role || 'client'
        };

        localStorage.setItem('auth_user', JSON.stringify(user));
        return { user, error: null };
      }

      return { user: null, error: 'Échec de la connexion' };
    } catch (error) {
      return { user: null, error: 'Erreur de connexion' };
    }
  }

  // Inscription avec email/mot de passe
  static async signUpWithEmail(email: string, password: string, name: string, role: 'client' | 'admin'): Promise<{ user: AuthUser | null, error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            name,
            role
          });

        if (profileError) {
          console.error('Erreur création profil:', profileError);
        }

        const user: AuthUser = {
          id: data.user.id,
          email,
          name,
          role
        };

        localStorage.setItem('auth_user', JSON.stringify(user));
        return { user, error: null };
      }

      return { user: null, error: 'Échec de l\'inscription' };
    } catch (error) {
      return { user: null, error: 'Erreur d\'inscription' };
    }
  }

  // Connexion avec Google
  static async signInWithGoogle(): Promise<{ user: AuthUser | null, error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        // Fallback pour la démo - simuler une connexion Google
        const mockGoogleUser: AuthUser = {
          id: 'google-demo-user',
          email: 'demo@google.com',
          name: 'Utilisateur Google Demo',
          role: 'client'
        };
        
        localStorage.setItem('auth_user', JSON.stringify(mockGoogleUser));
        return { user: mockGoogleUser, error: null };
      }

      return { user: null, error: null }; // La redirection va gérer le reste
    } catch (error) {
      // Fallback pour la démo
      const mockGoogleUser: AuthUser = {
        id: 'google-demo-user',
        email: 'demo@google.com',
        name: 'Utilisateur Google Demo',
        role: 'client'
      };
      
      localStorage.setItem('auth_user', JSON.stringify(mockGoogleUser));
      return { user: mockGoogleUser, error: null };
    }
  }

  // Déconnexion
  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem('auth_user');
  }

  // Récupérer l'utilisateur actuel
  static getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Vérifier si l'utilisateur est admin
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}