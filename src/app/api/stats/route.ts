import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    if (!projectId) {
      return NextResponse.json({ error: 'ID du projet manquant' }, { status: 400 })
    }

    // Vérifier l'accès au projet
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let projectQuery = supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)

    if (profile?.role !== 'admin') {
      // Si ce n'est pas un admin, vérifier que c'est son projet
      projectQuery = projectQuery.eq('client_id', user.id)
    }

    const { data: project, error: projectError } = await projectQuery.single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Projet non trouvé ou accès refusé' }, { status: 404 })
    }

    // Récupérer les statistiques du projet
    const stats = {
      budget: project.budget || 0,
      spent: project.spent || 0,
      remaining: Math.max(0, (project.budget || 0) - (project.spent || 0)),
      progress: project.progress || 0,
      status: project.status,
      start_date: project.start_date,
      end_date: project.end_date,
      name: project.name
    }

    // Récupérer le nombre de documents
    const { count: documentsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)

    // Récupérer le nombre de mises à jour
    const { count: updatesCount } = await supabase
      .from('project_updates')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)

    const response = {
      ...stats,
      documents_count: documentsCount || 0,
      updates_count: updatesCount || 0
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}