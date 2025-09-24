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
  // Connexion avec email/mot de passe (Mode MVP - comptes de test uniquement)
  static async signInWithEmail(email: string, password: string): Promise<{ user: AuthUser | null, error: string | null }> {
    try {
      // Mode MVP : utiliser uniquement les comptes de test
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

      // En mode MVP, retourner une erreur si ce n'est pas un compte de test
      return { user: null, error: 'Email ou mot de passe incorrect. Utilisez les comptes de test : client@ecotp.test / admin@ecotp.test' };
    } catch (error) {
      return { user: null, error: 'Erreur de connexion' };
    }
  }

  // Inscription avec email/mot de passe (Mode MVP - simulation uniquement)
  static async signUpWithEmail(email: string, password: string, name: string, role: 'client' | 'admin'): Promise<{ user: AuthUser | null, error: string | null }> {
    try {
      // Mode MVP : simuler l'inscription
      if (password.length < 6) {
        return { user: null, error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }

      // Vérifier si l'email existe déjà dans les comptes de test
      const existingAccount = Object.values(TEST_ACCOUNTS).find(account => account.email === email);
      if (existingAccount) {
        return { user: null, error: 'Un compte avec cet email existe déjà' };
      }

      // Simuler la création d'un nouveau compte
      const user: AuthUser = {
        id: `demo-${Date.now()}`,
        email,
        name,
        role
      };

      localStorage.setItem('auth_user', JSON.stringify(user));
      return { user, error: null };
    } catch (error) {
      return { user: null, error: 'Erreur d\'inscription' };
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