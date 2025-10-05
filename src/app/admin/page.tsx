import { redirect } from 'next/navigation'

export default function AdminRedirectPage() {
  // Redirige vers le dashboard unifié
  redirect('/dashboard')
  return null
}