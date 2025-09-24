'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Chrome, AlertCircle } from 'lucide-react';
import { AuthService, TEST_ACCOUNTS } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client' as 'client' | 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setIsLoading(false);
          return;
        }

        const { user, error } = await AuthService.signUpWithEmail(
          formData.email,
          formData.password,
          formData.name,
          formData.userType
        );

        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }

        if (user) {
          onClose();
          window.location.href = user.role === 'admin' ? '/admin' : '/client';
        }
      } else {
        const { user, error } = await AuthService.signInWithEmail(
          formData.email,
          formData.password
        );

        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }

        if (user) {
          onClose();
          window.location.href = user.role === 'admin' ? '/admin' : '/client';
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, error } = await AuthService.signInWithGoogle();

      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }

      if (user) {
        onClose();
        window.location.href = user.role === 'admin' ? '/admin' : '/client';
      }
    } catch (err) {
      setError('Erreur de connexion Google');
      setIsLoading(false);
    }
  };

  const fillTestAccount = (type: 'client' | 'admin') => {
    const account = TEST_ACCOUNTS[type];
    setFormData({
      ...formData,
      email: account.email,
      password: account.password,
      name: account.name,
      userType: account.role
    });
    setMode('login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-scale-in">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' 
                ? 'Accédez à votre espace EcoTP' 
                : 'Créez votre compte EcoTP'
              }
            </p>
          </div>
        </div>

        {/* Test Accounts Section */}
        <div className="px-6 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">🧪 Comptes de test disponibles :</h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillTestAccount('client')}
                className="w-full text-left text-xs bg-white border border-blue-200 rounded-lg p-2 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-900">👤 Client Test</div>
                <div className="text-blue-700">{TEST_ACCOUNTS.client.email}</div>
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount('admin')}
                className="w-full text-left text-xs bg-white border border-blue-200 rounded-lg p-2 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-900">⚡ Admin Test</div>
                <div className="text-blue-700">{TEST_ACCOUNTS.admin.email}</div>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de compte
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="input-modern w-full"
                required
              >
                <option value="client">Client</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            {/* Name Field (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    className="input-modern pl-11 w-full"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre@email.com"
                  className="input-modern pl-11 w-full"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input-modern pl-11 pr-11 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="input-modern pl-11 w-full"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  {mode === 'login' ? 'Connexion...' : 'Création...'}
                </div>
              ) : (
                mode === 'login' ? 'Se connecter' : 'Créer le compte'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="btn-secondary w-full"
            >
              <Chrome className="w-5 h-5 mr-2" />
              {mode === 'login' ? 'Continuer avec Google' : 'S\'inscrire avec Google'}
            </button>

            {/* Mode Switch */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="ml-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
                </button>
              </p>
            </div>

            {/* Terms (Register only) */}
            {mode === 'register' && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  En créant un compte, vous acceptez nos{' '}
                  <a href="/terms" className="text-green-600 hover:text-green-700">
                    Conditions d'utilisation
                  </a>{' '}
                  et notre{' '}
                  <a href="/privacy" className="text-green-600 hover:text-green-700">
                    Politique de confidentialité
                  </a>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}