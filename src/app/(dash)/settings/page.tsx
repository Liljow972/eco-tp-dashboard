'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService, AuthUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Save, Loader2, User, Building, Phone, Mail } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: ''
  })

  // Charger les données utilisateur au montage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (!currentUser) {
          router.push('/login')
          return
        }

        setUser(currentUser)

        // Récupérer les détails complets du profil
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (error) throw error

        if (profile) {
          setFormData({
            name: profile.name || '',
            company: profile.company || '',
            phone: profile.phone || '',
            email: currentUser.email
          })
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error)
        setMessage({ type: 'error', text: 'Impossible de charger les informations du profil.' })
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })

      // Mettre à jour le contexte utilisateur local si nécessaire (optionnel)
      router.refresh()

    } catch (error: any) {
      console.error('Erreur sauvegarde:', error)
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue lors de la sauvegarde.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-ecotp-green-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du compte</h1>
        <p className="mt-1 text-sm text-gray-500">Gérez vos informations personnelles et préférences.</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Informations Personnelles</h3>

          {message && (
            <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

            {/* Email (Lecture seule) */}
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse Email</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  name="email"
                  id="email"
                  disabled
                  value={formData.email}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 bg-gray-100 text-gray-500 focus:ring-ecotp-green-500 focus:border-ecotp-green-500 sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">L'adresse email ne peut pas être modifiée ici.</p>
            </div>

            {/* Nom complet */}
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="focus:ring-ecotp-green-500 focus:border-ecotp-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="focus:ring-ecotp-green-500 focus:border-ecotp-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="06 96 ..."
                />
              </div>
            </div>

            {/* Entreprise */}
            <div className="sm:col-span-4">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Entreprise</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="focus:ring-ecotp-green-500 focus:border-ecotp-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="sm:col-span-6 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ecotp-green-600 hover:bg-ecotp-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ecotp-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Section Rôle (Informatif) */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Rôle et Permissions</h3>
          <p className="text-sm text-gray-500 mb-4">
            Votre rôle détermine les fonctionnalités auxquelles vous avez accès dans l'application.
          </p>
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="flex items-center">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${user?.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {user?.role === 'admin' ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{user?.role}</h4>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin'
                    ? 'Accès complet à la gestion des chantiers, clients et documents.'
                    : 'Accès limité à la consultation de vos projets en cours.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icone ShieldCheck pour l'admin
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}