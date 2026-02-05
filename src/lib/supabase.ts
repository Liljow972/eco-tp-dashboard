// Fichier Supabase désactivé - Mode développement local
// Ce fichier existe uniquement pour éviter les erreurs d'import

export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase désactivé') }),
    signOut: async () => { },
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => {
      return {
        data: { subscription: { unsubscribe: () => { } } },
      }
    },
  },
  from: () => ({
    select: () => ({
      data: [],
      error: null,
      eq: () => ({
        data: [],
        error: null,
        single: () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null }),
      }),
      order: () => ({
        data: [],
        error: null,
        eq: () => ({ data: [], error: null }),
      }),
      single: () => ({ data: null, error: null }),
    }),
    insert: () => ({
      data: null,
      error: null,
      select: () => ({ data: null, error: null }),
    }),
    update: () => ({
      data: null,
      error: null,
      eq: () => ({ data: null, error: null }),
    }),
    delete: () => ({
      data: null,
      error: null,
      eq: () => ({ data: null, error: null }),
    }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: 'demo-file.pdf' }, error: null }),
      download: async () => ({ data: null, error: null }),
      remove: async () => ({ data: null, error: null }),
      list: async () => ({ data: [], error: null }),
    }),
  },
}

export const createSupabaseClient = () => supabase
export const createSupabaseServiceRoleClient = () => supabase

export type Profile = {
  id: string
  email: string
  name: string
  role: 'admin' | 'client'
}