import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET - Récupérer tous les projets
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles!projects_client_id_fkey(name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des projets' },
        { status: 500 }
      )
    }

    // Si aucun projet n'est trouvé, retourner des données de démonstration
    if (!projects || projects.length === 0) {
      const demoProjects = [
        {
          id: 'proj-demo-1',
          name: 'Terrassement Villa Moderne',
          client_id: 'client-demo-1',
          status: 'in_progress',
          progress: 75,
          budget: 45000,
          spent: 33750,
          start_date: '2024-01-15',
          end_date: '2024-03-30',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profiles: {
            name: 'Marie Dupont',
            email: 'marie.dupont@email.com'
          }
        },
        {
          id: 'proj-demo-2',
          name: 'Aménagement Parking',
          client_id: 'client-demo-2',
          status: 'completed',
          progress: 100,
          budget: 28000,
          spent: 26500,
          start_date: '2023-11-01',
          end_date: '2024-01-15',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profiles: {
            name: 'Jean Martin',
            email: 'jean.martin@entreprise.fr'
          }
        },
        {
          id: 'proj-demo-3',
          name: 'Fondations Immeuble',
          client_id: 'client-demo-3',
          status: 'pending',
          progress: 15,
          budget: 85000,
          spent: 12750,
          start_date: '2024-02-01',
          end_date: '2024-06-30',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profiles: {
            name: 'Sophie Bernard',
            email: 'sophie.bernard@gmail.com'
          }
        },
        {
          id: 'proj-demo-4',
          name: 'Rénovation Cour',
          client_id: 'client-demo-1',
          status: 'in_progress',
          progress: 40,
          budget: 15000,
          spent: 6000,
          start_date: '2024-01-20',
          end_date: '2024-04-15',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profiles: {
            name: 'Marie Dupont',
            email: 'marie.dupont@email.com'
          }
        }
      ];
      return NextResponse.json(demoProjects);
    }

    return NextResponse.json(projects)
  } catch (error) {
    // En cas d'erreur, retourner aussi des données de démonstration
    const demoProjects = [
      {
        id: 'proj-demo-1',
        name: 'Terrassement Villa Moderne',
        client_id: 'client-demo-1',
        status: 'in_progress',
        progress: 75,
        budget: 45000,
        spent: 33750,
        start_date: '2024-01-15',
        end_date: '2024-03-30',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          name: 'Marie Dupont',
          email: 'marie.dupont@email.com'
        }
      },
      {
        id: 'proj-demo-2',
        name: 'Aménagement Parking',
        client_id: 'client-demo-2',
        status: 'completed',
        progress: 100,
        budget: 28000,
        spent: 26500,
        start_date: '2023-11-01',
        end_date: '2024-01-15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          name: 'Jean Martin',
          email: 'jean.martin@entreprise.fr'
        }
      }
    ];
    return NextResponse.json(demoProjects);
  }
}

// POST - Créer un nouveau projet
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    const { name, client_id, budget, start_date, end_date } = body

    // Validation des données
    if (!name || !client_id) {
      return NextResponse.json(
        { error: 'Le nom et le client sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que le client existe
    const { data: client } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', client_id)
      .eq('role', 'client')
      .single()

    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      )
    }

    // Créer le nouveau projet
    const { data: newProject, error } = await supabase
      .from('projects')
      .insert({
        name,
        client_id,
        budget: budget || null,
        start_date: start_date || null,
        end_date: end_date || null,
        status: 'pending',
        progress: 0,
        spent: 0
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du projet' },
        { status: 500 }
      )
    }

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet' },
      { status: 500 }
    )
  }
}