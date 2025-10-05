export type Client = { id: string; name: string; email: string }
export type ProjectStatus = 'pending' | 'in_progress' | 'completed'
export type Project = {
  id: string
  name: string
  status: ProjectStatus
  progress: number
  startDate: string
  endDate?: string
  clientId: string
}
export type FileItem = {
  id: string
  name: string
  size: number
  date: string
  owner: string
}

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

const clients: Client[] = [
  { id: 'c1', name: 'Marie Dupont', email: 'marie.dupont@email.com' },
  { id: 'c2', name: 'Jean Martin', email: 'jean.martin@entreprise.fr' },
  { id: 'c3', name: 'Sophie Bernard', email: 'sophie.bernard@gmail.com' },
]

const projects: Project[] = [
  { id: 'p1', name: 'Terrassement Villa Moderne', status: 'in_progress', progress: 72, startDate: '2024-01-05', clientId: 'c1' },
  { id: 'p2', name: 'Aménagement Parking', status: 'completed', progress: 100, startDate: '2023-11-01', endDate: '2024-01-15', clientId: 'c2' },
  { id: 'p3', name: 'Fondations Immeuble', status: 'pending', progress: 20, startDate: '2024-02-01', clientId: 'c3' },
]

let files: FileItem[] = [
  { id: 'f1', name: 'Devis_Villa.pdf', size: 245000, date: '2024-02-10', owner: 'Marie Dupont' },
  { id: 'f2', name: 'Plan_Parking.dwg', size: 1024000, date: '2024-01-22', owner: 'Jean Martin' },
  { id: 'f3', name: 'Rapport_Fondations.docx', size: 580000, date: '2024-03-05', owner: 'Sophie Bernard' },
]

export async function getClients(): Promise<Client[]> {
  await delay()
  return clients
}

export async function getProjects(filter?: { status?: ProjectStatus; dateFrom?: string; dateTo?: string; clientId?: string; role?: 'admin' | 'client'; currentClientId?: string }): Promise<Project[]> {
  await delay()
  let result = [...projects]
  if (filter?.role === 'client' && filter.currentClientId) {
    result = result.filter((p) => p.clientId === filter.currentClientId)
  }
  if (filter?.clientId) result = result.filter((p) => p.clientId === filter.clientId)
  if (filter?.status) result = result.filter((p) => p.status === filter.status)
  if (filter?.dateFrom) result = result.filter((p) => p.startDate >= filter.dateFrom!)
  if (filter?.dateTo) result = result.filter((p) => (p.endDate ?? p.startDate) <= filter.dateTo!)
  return result
}

export async function getFiles(): Promise<FileItem[]> {
  await delay()
  return files
}

export async function uploadFileMock(name: string, size: number, owner: string): Promise<FileItem> {
  await delay(800)
  const item: FileItem = { id: `f${Date.now()}`, name, size, date: new Date().toISOString().slice(0, 10), owner }
  files = [item, ...files]
  return item
}

export async function deleteFileMock(id: string): Promise<void> {
  await delay(400)
  files = files.filter((f) => f.id !== id)
}

export async function downloadFileMock(id: string): Promise<string> {
  await delay(300)
  const file = files.find((f) => f.id === id)
  return `https://example.com/download/${file?.name ?? id}`
}