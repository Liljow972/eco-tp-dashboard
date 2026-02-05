"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Search, Mail, Phone, MapPin, Plus, Edit, Trash2, MessageSquare, User, Calendar, ExternalLink } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  created_at: string
  projects?: number
}

export default function ClientManagementPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredClients(filtered)
    }
  }, [searchQuery, clients])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fallback avec clients de démo
      if (!data || data.length === 0) {
        const demoClients: Client[] = [
          {
            id: 'demo-1',
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            phone: '+33 6 12 34 56 78',
            company: 'Dupont Construction',
            address: '123 Rue de la Paix, 75001 Paris',
            created_at: '2024-01-15',
            projects: 2
          },
          {
            id: 'demo-2',
            name: 'Marie Martin',
            email: 'marie.martin@example.com',
            phone: '+33 6 98 76 54 32',
            company: 'Martin Immobilier',
            address: '45 Avenue des Champs, 69001 Lyon',
            created_at: '2024-02-01',
            projects: 1
          },
          {
            id: 'demo-3',
            name: 'Pierre Bernard',
            email: 'pierre.bernard@example.com',
            phone: '+33 6 55 44 33 22',
            company: 'Bernard & Fils',
            address: '78 Boulevard Victor Hugo, 33000 Bordeaux',
            created_at: '2024-02-10',
            projects: 3
          }
        ]
        setClients(demoClients)
        setFilteredClients(demoClients)
      } else {
        setClients(data)
        setFilteredClients(data)
      }
    } catch (err) {
      console.error('Error fetching clients:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (client: Client) => {
    setSelectedClient(client)
    setIsMessageModalOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', clientId)

      if (error) throw error

      setClients(clients.filter(c => c.id !== clientId))
      alert('Client supprimé avec succès !')
    } catch (err) {
      console.error('Error deleting client:', err)
      alert('Erreur lors de la suppression')
    }
  }

  const handleViewProjects = (clientId: string) => {
    router.push(`/avancement?client=${clientId}`)
  }

  const sendMessage = () => {
    // Logique d'envoi de message (à implémenter avec Supabase)
    console.log('Message envoyé à', selectedClient?.name, ':', messageContent)
    setIsMessageModalOpen(false)
    setMessageContent('')
    setSelectedClient(null)

    // Afficher une notification de succès
    alert(`Message envoyé à ${selectedClient?.name} !`)
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Chargement...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos clients et communiquez avec eux</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ecotp-green-600 text-white rounded-lg text-sm font-medium hover:bg-ecotp-green-700 transition-colors shadow-lg shadow-ecotp-green-900/20"
        >
          <Plus className="w-4 h-4" />
          Nouveau Client
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un client (nom, email, entreprise)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ecotp-green-500 focus:border-ecotp-green-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Clients Actifs</p>
          <p className="text-2xl font-bold text-gray-900">{clients.filter(c => (c.projects || 0) > 0).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Projets Totaux</p>
          <p className="text-2xl font-bold text-gray-900">{clients.reduce((acc, c) => acc + (c.projects || 0), 0)}</p>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entreprise</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Projets</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Inscription</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ecotp-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-ecotp-green-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {client.address}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{client.company || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {client.projects || 0} projet(s)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(client.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSendMessage(client)}
                        className="p-2 text-ecotp-green-600 hover:bg-ecotp-green-50 rounded-lg transition-colors"
                        title="Envoyer un message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewProjects(client.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Voir les projets"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun client trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Message */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false)
          setMessageContent('')
          setSelectedClient(null)
        }}
        title={`Message à ${selectedClient?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sujet du projet
            </label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none">
              <option>Sélectionner un projet</option>
              <option>Terrassement Villa Moderne</option>
              <option>Fondations Maison Écologique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none resize-none"
              rows={6}
              placeholder="Votre message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setIsMessageModalOpen(false)
                setMessageContent('')
                setSelectedClient(null)
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={sendMessage}
              disabled={!messageContent.trim()}
              className="px-4 py-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Nouveau Client */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouveau Client"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              placeholder="jean.dupont@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              placeholder="Dupont Construction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none resize-none"
              rows={2}
              placeholder="123 Rue de la Paix, 75001 Paris"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              className="px-4 py-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors"
            >
              Créer le client
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Édition Client */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedClient(null)
        }}
        title="Modifier le client"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              defaultValue={selectedClient?.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              defaultValue={selectedClient?.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              defaultValue={selectedClient?.phone}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none"
              defaultValue={selectedClient?.company}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500 outline-none resize-none"
              rows={2}
              defaultValue={selectedClient?.address}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setIsEditModalOpen(false)
                setSelectedClient(null)
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                // Logique de sauvegarde (à implémenter avec Supabase)
                alert(`Client ${selectedClient?.name} modifié avec succès !`)
                setIsEditModalOpen(false)
                setSelectedClient(null)
              }}
              className="px-4 py-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}