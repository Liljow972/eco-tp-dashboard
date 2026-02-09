'use client';

import { useState } from 'react';
import { 
  MessageCircle, Phone, Mail, Clock, CheckCircle, AlertCircle, 
  Send, Paperclip, Search, Filter, Plus, HelpCircle, Book, 
  ExternalLink, ChevronRight, Star
} from 'lucide-react';
import { getCurrentUserDynamic } from '@/lib/mockData';
import ModernLayout from '@/components/layout/ModernLayout';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  messages: {
    id: string;
    content: string;
    sender: 'client' | 'support';
    timestamp: string;
  }[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'ticket-1',
    subject: 'Question sur l\'avancement du projet',
    status: 'resolved',
    priority: 'medium',
    created_at: '2024-01-20T10:30:00Z',
    updated_at: '2024-01-21T14:15:00Z',
    messages: [
      {
        id: 'msg-1',
        content: 'Bonjour, j\'aimerais avoir des informations sur l\'avancement de mon projet de terrassement.',
        sender: 'client',
        timestamp: '2024-01-20T10:30:00Z'
      },
      {
        id: 'msg-2',
        content: 'Bonjour, votre projet avance bien. Nous avons terminé 65% des travaux. Je vous envoie un rapport détaillé par email.',
        sender: 'support',
        timestamp: '2024-01-21T14:15:00Z'
      }
    ]
  },
  {
    id: 'ticket-2',
    subject: 'Problème d\'accès aux documents',
    status: 'open',
    priority: 'high',
    created_at: '2024-01-25T09:15:00Z',
    updated_at: '2024-01-25T09:15:00Z',
    messages: [
      {
        id: 'msg-3',
        content: 'Je n\'arrive pas à télécharger les documents de mon projet. Pouvez-vous m\'aider ?',
        sender: 'client',
        timestamp: '2024-01-25T09:15:00Z'
      }
    ]
  }
];

const mockFAQ: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Comment puis-je suivre l\'avancement de mon projet ?',
    answer: 'Vous pouvez suivre l\'avancement de votre projet en temps réel depuis votre tableau de bord. Rendez-vous dans la section "Mes Projets" pour voir le pourcentage d\'avancement, les étapes terminées et les prochaines échéances.',
    category: 'Projets',
    helpful: 15
  },
  {
    id: 'faq-2',
    question: 'Comment télécharger mes documents ?',
    answer: 'Pour télécharger vos documents, allez dans la section "Documents" de votre tableau de bord. Cliquez sur l\'icône de téléchargement à côté du document souhaité. Tous vos contrats, factures et livrables y sont disponibles.',
    category: 'Documents',
    helpful: 12
  },
  {
    id: 'faq-3',
    question: 'Que faire en cas de retard sur mon projet ?',
    answer: 'En cas de retard, nous vous informons immédiatement par email et via votre tableau de bord. Nous proposons toujours des solutions alternatives et un nouveau planning. N\'hésitez pas à nous contacter pour discuter des options.',
    category: 'Projets',
    helpful: 8
  },
  {
    id: 'faq-4',
    question: 'Comment modifier les détails de mon projet ?',
    answer: 'Pour modifier les détails de votre projet, contactez notre équipe support. Certaines modifications peuvent impacter le planning et le budget, nous vous fournirons un devis actualisé si nécessaire.',
    category: 'Projets',
    helpful: 6
  }
];

export default function ClientSupportPage() {
  const [currentUser] = useState(getCurrentUserDynamic());
  const [activeTab, setActiveTab] = useState<'tickets' | 'new-ticket' | 'faq' | 'contact'>('tickets');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'medium' as const,
    message: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'open':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'closed':
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Résolu';
      case 'in_progress':
        return 'En cours';
      case 'open':
        return 'Ouvert';
      case 'closed':
        return 'Fermé';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFAQ = mockFAQ.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, on enverrait le ticket au backend
    console.log('Nouveau ticket:', newTicket);
    setNewTicket({ subject: '', priority: 'medium', message: '' });
    setActiveTab('tickets');
  };

  return (
    <ModernLayout 
      title="Support Client" 
      subtitle="Obtenez de l'aide et contactez notre équipe"
      userRole="client"
      userName={currentUser?.name}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <nav className="flex space-x-1">
            {[
              { id: 'tickets', label: 'Mes Tickets', icon: MessageCircle },
              { id: 'new-ticket', label: 'Nouveau Ticket', icon: Plus },
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
              { id: 'contact', label: 'Contact', icon: Phone }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span>{getStatusLabel(ticket.status)}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')} • 
                      Mis à jour le {new Date(ticket.updated_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {ticket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md p-4 rounded-2xl ${
                          message.sender === 'client'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`text-xs mt-2 ${
                          message.sender === 'client' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {ticket.status === 'open' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="Tapez votre réponse..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New Ticket Tab */}
        {activeTab === 'new-ticket' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Créer un nouveau ticket</h3>
            <form onSubmit={handleSubmitTicket} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Décrivez brièvement votre problème..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorité
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Décrivez votre problème en détail..."
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                  <span>Joindre un fichier</span>
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  Envoyer le ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans la FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredFAQ.map((faq) => (
                <div key={faq.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-3">
                        {faq.category}
                      </div>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="w-4 h-4" />
                      <span>{faq.helpful} personnes ont trouvé cela utile</span>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Utile ?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contactez-nous</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Téléphone</h4>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                    <p className="text-sm text-gray-500">Lun-Ven 8h-18h</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">support@ecotp.fr</p>
                    <p className="text-sm text-gray-500">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Chat en direct</h4>
                    <p className="text-gray-600">Disponible maintenant</p>
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      Démarrer une conversation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Ressources utiles</h3>
              <div className="space-y-4">
                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Book className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Guide utilisateur</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </a>

                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Tutoriels vidéo</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </a>

                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Centre d'aide</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}