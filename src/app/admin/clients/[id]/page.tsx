'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { getAllClients, getAllProjects } from '@/lib/mockData';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalProjects: number;
  activeProjects: number;
  totalSpent: number;
  avgProgress: number;
}

export default function ClientDetails() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clients = await getAllClients();
        const projects = await getAllProjects();
        
        const foundClient = clients.find(c => c.id === params.id);
        
        if (foundClient) {
          // Filtrer les projets du client
          const projectsForClient = projects.filter(p => p.client_id === foundClient.id);
          
          // Enrichir les données du client
          const enrichedClient: Client = {
            id: foundClient.id,
            name: foundClient.name,
            email: foundClient.email || `${foundClient.name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: '+33 1 23 45 67 89', // Valeur par défaut car non présente dans Profile
            address: 'Paris, France', // Valeur par défaut car non présente dans Profile
            joinDate: foundClient.created_at.split('T')[0], // Utiliser created_at du Profile
            totalProjects: projectsForClient.length,
            activeProjects: projectsForClient.filter(p => p.status === 'in_progress').length,
            totalSpent: projectsForClient.reduce((sum, p) => sum + p.spent, 0),
            avgProgress: Math.round(projectsForClient.reduce((sum, p) => sum + p.progress, 0) / projectsForClient.length) || 0
          };
          
          setClient(enrichedClient);
          setClientProjects(projectsForClient);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du client:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails du client...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Client non trouvé</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600 mt-2">Client depuis le {client.joinDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total dépensé</p>
              <p className="text-2xl font-bold text-green-600">{client.totalSpent.toLocaleString()} €</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Projets totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{client.totalProjects}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Projets actifs</p>
                    <p className="text-2xl font-bold text-gray-900">{client.activeProjects}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progression moy.</p>
                    <p className="text-2xl font-bold text-gray-900">{client.avgProgress}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Projets du client */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Projets du client</h2>
              {clientProjects.length > 0 ? (
                <div className="space-y-4">
                  {clientProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Budget</p>
                          <p className="font-medium">{project.budget.toLocaleString()} €</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Dépensé</p>
                          <p className="font-medium">{project.spent.toLocaleString()} €</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Progression</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => router.push(`/admin/projects/${project.id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Voir le projet →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Aucun projet trouvé pour ce client.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de contact</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-900">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium text-gray-900">{client.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Client depuis</p>
                    <p className="font-medium text-gray-900">{client.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Contacter le client
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                  Créer un nouveau projet
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                  Modifier les informations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}