import { redirect } from 'next/navigation'

export default function ClientRedirectPage() {
  // Redirige vers le dashboard unifié
  redirect('/dashboard')
  return null
}