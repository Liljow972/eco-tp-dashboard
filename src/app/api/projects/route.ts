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

    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    )
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