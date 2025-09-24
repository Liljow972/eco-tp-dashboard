'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, MapPin, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getAllProjects } from '@/lib/mockData';

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  tasks: Array<{
    id: string;
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    dueDate: string;
  }>;
}

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projects = await getAllProjects();
        const foundProject = projects.find(p => p.id === params.id);
        
        if (foundProject) {
          // Enrichir les données du projet avec des détails supplémentaires
          const enrichedProject: Project = {
            ...foundProject,
            description: foundProject.description || "Description détaillée du projet d'éco-construction.",
            location: foundProject.location || "Paris, France",
            tasks: [
              { id: '1', name: 'Étude de faisabilité', status: 'completed', dueDate: '2024-01-15' },
              { id: '2', name: 'Conception architecturale', status: 'completed', dueDate: '2024-02-01' },
              { id: '3', name: 'Obtention des permis', status: 'in-progress', dueDate: '2024-02-15' },
              { id: '4', name: 'Début des travaux', status: 'pending', dueDate: '2024-03-01' },
              { id: '5', name: 'Installation énergétique', status: 'pending', dueDate: '2024-04-01' },
            ]
          };
          setProject(enrichedProject);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h1>
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

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
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
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-2">Client: {project.client}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du projet</h2>
              <p className="text-gray-600 leading-relaxed">{project.description}</p>
            </div>

            {/* Progression */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progression</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Avancement</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Tâches */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tâches du projet</h2>
              <div className="space-y-3">
                {project.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTaskIcon(task.status)}
                      <span className="font-medium text-gray-900">{task.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{task.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations du projet */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date de début</p>
                    <p className="font-medium text-gray-900">{project.startDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date de fin</p>
                    <p className="font-medium text-gray-900">{project.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium text-gray-900">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium text-gray-900">{project.client}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Budget total</span>
                  <span className="font-semibold text-gray-900">{project.budget.toLocaleString()} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Dépensé</span>
                  <span className="font-semibold text-gray-900">{project.spent.toLocaleString()} €</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-gray-600">Restant</span>
                  <span className="font-semibold text-green-600">
                    {(project.budget - project.spent).toLocaleString()} €
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(project.spent / project.budget) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}