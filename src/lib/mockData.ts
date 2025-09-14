// Données statiques pour le MVP - Remplace Supabase temporairement

export interface Profile {
  id: string
  email: string
  name: string
  role: 'client' | 'admin'
  created_at: string
}

export interface Project {
  id: string
  client_id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  budget: number
  spent: number
  start_date: string
  end_date: string
  created_at: string
}

export interface ProjectUpdate {
  id: string
  project_id: string
  title: string
  body: string
  created_at: string
}

export interface Document {
  id: string
  project_id: string
  label: string
  type: 'contract' | 'invoice' | 'deliverable' | 'other'
  file_path: string
  file_size: number
  mime_type: string
  created_at: string
}

// Données de test
export const mockProfiles: Profile[] = [
  {
    id: 'admin-1',
    email: 'admin@ecotp-demo.com',
    name: 'Admin EcoTP',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'client-1',
    email: 'client@ecotp-demo.com',
    name: 'Jean Dupont',
    role: 'client',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: 'client-2',
    email: 'client2@ecotp-demo.com',
    name: 'Marie Martin',
    role: 'client',
    created_at: '2024-01-03T00:00:00Z'
  }
]

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    client_id: 'client-1',
    name: 'Terrassement Villa Moderne',
    status: 'in_progress',
    progress: 65,
    budget: 45000,
    spent: 29250,
    start_date: '2024-01-15',
    end_date: '2024-03-30',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'proj-2',
    client_id: 'client-1',
    name: 'Aménagement Jardin',
    status: 'completed',
    progress: 100,
    budget: 12000,
    spent: 11800,
    start_date: '2023-11-01',
    end_date: '2023-12-15',
    created_at: '2023-10-25T00:00:00Z'
  },
  {
    id: 'proj-3',
    client_id: 'client-2',
    name: 'Extension Maison',
    status: 'pending',
    progress: 15,
    budget: 85000,
    spent: 12750,
    start_date: '2024-02-01',
    end_date: '2024-06-30',
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 'proj-4',
    client_id: 'client-2',
    name: 'Rénovation Cour',
    status: 'in_progress',
    progress: 40,
    budget: 25000,
    spent: 10000,
    start_date: '2024-01-08',
    end_date: '2024-04-15',
    created_at: '2024-01-05T00:00:00Z'
  }
]

export const mockProjectUpdates: ProjectUpdate[] = [
  {
    id: 'update-1',
    project_id: 'proj-1',
    title: 'Début des travaux de terrassement',
    body: 'Les travaux de terrassement ont commencé ce matin. L\'équipe a procédé au décapage de la terre végétale sur une superficie de 200m². Les conditions météorologiques sont favorables.',
    created_at: '2024-01-15T08:30:00Z'
  },
  {
    id: 'update-2',
    project_id: 'proj-1',
    title: 'Excavation terminée',
    body: 'L\'excavation principale est terminée. Profondeur atteinte : 1,2m. Prochaine étape : pose du géotextile et remblaiement avec du tout-venant.',
    created_at: '2024-01-22T16:45:00Z'
  },
  {
    id: 'update-3',
    project_id: 'proj-1',
    title: 'Remblaiement en cours',
    body: 'Le remblaiement avec du tout-venant 0/31.5 est en cours. 60% du volume nécessaire a été mis en place. Compactage effectué par couches de 30cm.',
    created_at: '2024-02-05T14:20:00Z'
  },
  {
    id: 'update-4',
    project_id: 'proj-2',
    title: 'Projet terminé avec succès',
    body: 'L\'aménagement du jardin est terminé. Plantation des végétaux effectuée, système d\'arrosage automatique installé. Le client est très satisfait du résultat.',
    created_at: '2023-12-15T17:00:00Z'
  },
  {
    id: 'update-5',
    project_id: 'proj-3',
    title: 'Obtention du permis de construire',
    body: 'Le permis de construire a été obtenu. Les plans ont été validés par la mairie. Nous pouvons maintenant programmer le début des travaux.',
    created_at: '2024-01-25T10:15:00Z'
  },
  {
    id: 'update-6',
    project_id: 'proj-4',
    title: 'Démolition de l\'ancien revêtement',
    body: 'La démolition de l\'ancien carrelage de la cour est terminée. Évacuation des gravats effectuée. Préparation du support pour le nouveau revêtement.',
    created_at: '2024-01-12T11:30:00Z'
  }
]

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    project_id: 'proj-1',
    label: 'Contrat de terrassement',
    type: 'contract',
    file_path: '/documents/contrat-terrassement-villa.pdf',
    file_size: 245760,
    mime_type: 'application/pdf',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'doc-2',
    project_id: 'proj-1',
    label: 'Facture matériaux - Janvier',
    type: 'invoice',
    file_path: '/documents/facture-materiaux-jan.pdf',
    file_size: 156432,
    mime_type: 'application/pdf',
    created_at: '2024-01-31T00:00:00Z'
  },
  {
    id: 'doc-3',
    project_id: 'proj-1',
    label: 'Plan de terrassement',
    type: 'deliverable',
    file_path: '/documents/plan-terrassement.pdf',
    file_size: 892156,
    mime_type: 'application/pdf',
    created_at: '2024-01-08T00:00:00Z'
  },
  {
    id: 'doc-4',
    project_id: 'proj-2',
    label: 'Photos avant/après',
    type: 'deliverable',
    file_path: '/documents/photos-jardin.zip',
    file_size: 15728640,
    mime_type: 'application/zip',
    created_at: '2023-12-15T00:00:00Z'
  },
  {
    id: 'doc-5',
    project_id: 'proj-2',
    label: 'Facture finale',
    type: 'invoice',
    file_path: '/documents/facture-finale-jardin.pdf',
    file_size: 198432,
    mime_type: 'application/pdf',
    created_at: '2023-12-20T00:00:00Z'
  },
  {
    id: 'doc-6',
    project_id: 'proj-3',
    label: 'Permis de construire',
    type: 'other',
    file_path: '/documents/permis-construire.pdf',
    file_size: 1245760,
    mime_type: 'application/pdf',
    created_at: '2024-01-25T00:00:00Z'
  },
  {
    id: 'doc-7',
    project_id: 'proj-4',
    label: 'Devis rénovation cour',
    type: 'contract',
    file_path: '/documents/devis-renovation-cour.pdf',
    file_size: 187392,
    mime_type: 'application/pdf',
    created_at: '2024-01-05T00:00:00Z'
  },
  {
    id: 'doc-8',
    project_id: 'proj-4',
    label: 'Bon de livraison matériaux',
    type: 'other',
    file_path: '/documents/bon-livraison-materiaux.pdf',
    file_size: 98765,
    mime_type: 'application/pdf',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'doc-9',
    project_id: 'proj-1',
    label: 'Rapport géotechnique',
    type: 'other',
    file_path: '/documents/rapport-geotechnique.pdf',
    file_size: 567890,
    mime_type: 'application/pdf',
    created_at: '2024-01-05T00:00:00Z'
  }
]

// Fonctions utilitaires pour simuler les requêtes
export const getCurrentUser = () => {
  // Pour le MVP, on simule un utilisateur connecté
  // On peut changer cette valeur pour tester différents rôles
  return mockProfiles[0] // Admin par défaut
}

export const getProjectsByClientId = (clientId: string) => {
  return mockProjects.filter(project => project.client_id === clientId)
}

export const getProjectUpdatesByProjectId = (projectId: string) => {
  return mockProjectUpdates.filter(update => update.project_id === projectId)
}

export const getDocumentsByProjectId = (projectId: string) => {
  return mockDocuments.filter(doc => doc.project_id === projectId)
}

export const getAllProjects = () => {
  return mockProjects
}

export const getAllClients = () => {
  return mockProfiles.filter(profile => profile.role === 'client')
}

// Fonction pour changer l'utilisateur actuel (pour tester)
export let currentUserIndex = 0
export const switchUser = (index: number) => {
  if (index >= 0 && index < mockProfiles.length) {
    currentUserIndex = index
  }
}

export const getCurrentUserDynamic = () => {
  return mockProfiles[currentUserIndex]
}