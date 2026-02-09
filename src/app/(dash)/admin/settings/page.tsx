'use client'

import { useState } from 'react'
import ModernLayout from '@/components/layout/ModernLayout'
import { Save, User, Bell, Shield, Database, Mail, Globe, Palette, Key, Download, Upload } from 'lucide-react'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: 'Admin EcoTP',
      email: 'admin@ecotp.com',
      phone: '+33 1 23 45 67 89',
      company: 'EcoTP Solutions',
      address: '123 Rue de la Paix, 75001 Paris'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      projectUpdates: true,
      clientMessages: true,
      systemAlerts: true,
      weeklyReports: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      loginAttempts: '5'
    },
    system: {
      language: 'fr',
      timezone: 'Europe/Paris',
      dateFormat: 'DD/MM/YYYY',
      currency: 'EUR',
      backupFrequency: 'daily'
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'system', label: 'Système', icon: Database },
  ]

  const handleSave = () => {
    // Logique de sauvegarde
    console.log('Settings saved:', settings)
    alert('Paramètres sauvegardés avec succès!')
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  return (
    <ModernLayout userRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-gray-600">Configurez votre application et vos préférences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <User className="w-6 h-6 text-blue-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Informations du Profil</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                        <input
                          type="text"
                          value={settings.profile.company}
                          onChange={(e) => handleInputChange('profile', 'company', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                        <input
                          type="text"
                          value={settings.profile.address}
                          onChange={(e) => handleInputChange('profile', 'address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <Bell className="w-6 h-6 text-blue-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Préférences de Notification</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {key === 'emailNotifications' && 'Notifications par email'}
                              {key === 'pushNotifications' && 'Notifications push'}
                              {key === 'projectUpdates' && 'Mises à jour de projets'}
                              {key === 'clientMessages' && 'Messages clients'}
                              {key === 'systemAlerts' && 'Alertes système'}
                              {key === 'weeklyReports' && 'Rapports hebdomadaires'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {key === 'emailNotifications' && 'Recevoir les notifications par email'}
                              {key === 'pushNotifications' && 'Recevoir les notifications push'}
                              {key === 'projectUpdates' && 'Être notifié des mises à jour de projets'}
                              {key === 'clientMessages' && 'Recevoir les messages des clients'}
                              {key === 'systemAlerts' && 'Recevoir les alertes système importantes'}
                              {key === 'weeklyReports' && 'Recevoir un rapport hebdomadaire'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value as boolean}
                              onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Paramètres de Sécurité</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                            <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security.twoFactorAuth}
                              onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timeout de session (minutes)</label>
                          <select
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 heure</option>
                            <option value="120">2 heures</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiration mot de passe (jours)</label>
                          <select
                            value={settings.security.passwordExpiry}
                            onChange={(e) => handleInputChange('security', 'passwordExpiry', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="30">30 jours</option>
                            <option value="60">60 jours</option>
                            <option value="90">90 jours</option>
                            <option value="180">180 jours</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                          <Key className="w-4 h-4" />
                          <span>Changer le mot de passe</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Télécharger les logs de sécurité</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <Database className="w-6 h-6 text-blue-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Paramètres Système</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                        <select
                          value={settings.system.language}
                          onChange={(e) => handleInputChange('system', 'language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
                        <select
                          value={settings.system.timezone}
                          onChange={(e) => handleInputChange('system', 'timezone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Europe/Paris">Europe/Paris</option>
                          <option value="Europe/London">Europe/London</option>
                          <option value="America/New_York">America/New_York</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Format de date</label>
                        <select
                          value={settings.system.dateFormat}
                          onChange={(e) => handleInputChange('system', 'dateFormat', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                        <select
                          value={settings.system.currency}
                          onChange={(e) => handleInputChange('system', 'currency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="EUR">Euro (€)</option>
                          <option value="USD">Dollar ($)</option>
                          <option value="GBP">Livre (£)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence de sauvegarde</label>
                        <select
                          value={settings.system.backupFrequency}
                          onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="daily">Quotidienne</option>
                          <option value="weekly">Hebdomadaire</option>
                          <option value="monthly">Mensuelle</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion des données</h3>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Exporter les données</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Importer les données</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                          <Database className="w-4 h-4" />
                          <span>Sauvegarder maintenant</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Save className="w-5 h-5" />
                    <span>Sauvegarder les modifications</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  )
}