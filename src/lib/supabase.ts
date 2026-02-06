import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ ERREUR: Variables Supabase manquantes dans .env.local')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const createSupabaseClient = () => supabase
export const createSupabaseServiceRoleClient = () => supabase

// Types
export type Profile = {
  id: string
  email: string
  name: string
  role: 'admin' | 'client'
  company?: string
  phone?: string
  avatar_url?: string
  created_at?: string
}

export type Project = {
  id: string
  name: string
  client_id: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  budget: number
  spent: number
  start_date: string
  end_date: string
  created_at?: string
}

export type Document = {
  id: string
  project_id: string
  label: string
  type: string
  file_path: string
  file_size: number
  mime_type: string
  created_at: string
}

export type ProjectPhoto = {
  id: string
  project_id: string
  url: string
  title?: string
  type: 'before' | 'progress' | 'after'
  created_at: string
}

export type Message = {
  id: string
  project_id: string
  sender_id: string
  content: string
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  type: string
  title: string
  message?: string
  read: boolean
  created_at: string
}