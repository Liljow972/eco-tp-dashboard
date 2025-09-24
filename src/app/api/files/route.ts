import { NextRequest, NextResponse } from 'next/server'

// Interface pour les fichiers
interface FileItem {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'image' | 'archive' | 'other'
  size: string
  uploadDate: string
  uploadedBy: string
  category: 'contract' | 'invoice' | 'report' | 'photo' | 'other'
  projectId?: string
  clientId?: string
  url?: string
}

// Stockage temporaire en mémoire (en production, utiliser une vraie base de données)
let files: FileItem[] = [
  {
    id: '1',
    name: 'Contrat_Terrassement_2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    uploadedBy: 'Admin',
    category: 'contract',
    projectId: '1'
  },
  {
    id: '2',
    name: 'Devis_Projet_Eco.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadDate: '2024-01-12',
    uploadedBy: 'Admin',
    category: 'invoice',
    projectId: '1'
  }
]

// GET - Récupérer les fichiers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const clientId = searchParams.get('clientId')

    let filteredFiles = files

    if (projectId) {
      filteredFiles = files.filter(file => file.projectId === projectId)
    }

    if (clientId) {
      filteredFiles = files.filter(file => file.clientId === clientId)
    }

    return NextResponse.json({
      success: true,
      files: filteredFiles
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des fichiers' },
      { status: 500 }
    )
  }
}

// POST - Uploader un nouveau fichier
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const clientId = formData.get('clientId') as string
    const category = formData.get('category') as string
    const uploadedBy = formData.get('uploadedBy') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Déterminer le type de fichier
    const getFileType = (fileName: string): FileItem['type'] => {
      const extension = fileName.split('.').pop()?.toLowerCase()
      switch (extension) {
        case 'pdf':
          return 'pdf'
        case 'doc':
        case 'docx':
          return 'doc'
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'image'
        case 'zip':
        case 'rar':
          return 'archive'
        default:
          return 'other'
      }
    }

    // Créer le nouvel objet fichier
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: file.name,
      type: getFileType(file.name),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: uploadedBy || 'Admin',
      category: (category as FileItem['category']) || 'other',
      projectId: projectId || undefined,
      clientId: clientId || undefined
    }

    // Ajouter le fichier à la liste
    files.push(newFile)

    return NextResponse.json({
      success: true,
      file: newFile,
      message: 'Fichier uploadé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un fichier
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'ID du fichier requis' },
        { status: 400 }
      )
    }

    const fileIndex = files.findIndex(file => file.id === fileId)
    
    if (fileIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fichier non trouvé' },
        { status: 404 }
      )
    }

    files.splice(fileIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du fichier' },
      { status: 500 }
    )
  }
}