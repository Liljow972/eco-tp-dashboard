'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Search, Filter, Calendar, DollarSign, TrendingUp, 
  Clock, FileText, Eye, BarChart3, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import { mockProjects, getCurrentUserDynamic, type Project } from '@/lib/mockData';
import ModernLayout from '@/components/layout/ModernLayout';

export default function ClientProjectsPage() {
  const [currentUser] = useState(getCurrentUserDynamic());
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Filtrer les projets pour le client actuel
    const userProjects = mockProjects.filter(project => 
      project.client_id === currentUser?.id
    );
    setProjects(userProjects);
  }, [currentUser]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModernLayout 
      title="Mes Projets" 
      subtitle="Consultez l'état d'avancement de vos projets"
      userRole="client"
      userName={currentUser?.name}
    >
      <div className="space-y-6">
        {/* Header avec recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="pending">En attente</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        <div className="grid gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span>{getStatusLabel(project.status)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">Projet de terrassement et aménagement</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="text-lg font-bold text-gray-900">{project.budget.toLocaleString()}€</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Progression</p>
                        <p className="text-lg font-bold text-gray-900">{project.progress}%</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Échéance</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(project.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Avancement du projet</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Créé le {new Date(project.start_date).toLocaleDateString('fr-FR')}
                    </div>
                    <Link
                      href={`/client?project=${project.id}`}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Voir les détails</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Aucun projet ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore de projets assignés.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </ModernLayout>
  );
}