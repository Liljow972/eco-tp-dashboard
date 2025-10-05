"use client"

import Card from '@/components/Card'
import { AuthService } from '@/lib/auth'

export default function CollaborationPage() {
  const user = AuthService.getCurrentUser()

  if (user?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <Card className="bg-ecotp-white" title="Accès restreint">
          <p className="text-black">Cette page est réservée aux administrateurs.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-ecotp-white" title="Collaboration">
        <p className="text-black">Espace de collaboration: partage de documents, notifications et commentaires (placeholder).</p>
      </Card>
    </div>
  )
}