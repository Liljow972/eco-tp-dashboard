import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Pour les composants client
export const createSupabaseClient = () => createClientComponentClient()

// Types pour la base de données
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
  budget?: number
  spent?: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
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
  file_size?: number
  mime_type?: string
  created_at: string
}