"use client"

import Card from '@/components/Card'

// Lecture synchrone du rôle depuis localStorage (même pattern que Sidebar)
const getLocalRole = () => {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem('auth_user') || 'null')?.role } catch { return null }
}

export default function AnalyticsPage() {
  const role = getLocalRole()

  if (role !== 'admin') {
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
      <Card className="bg-ecotp-white" title="Analytics">
        <p className="text-black">Indicateurs clés et tendances (placeholder).</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded border border-ecotp-gray-200">
            <p className="text-black font-semibold">Chiffre d&apos;Affaires</p>
            <p className="text-ecotp-green text-2xl">0.2M€</p>
          </div>
          <div className="p-4 rounded border border-ecotp-gray-200">
            <p className="text-black font-semibold">Taux de complétion</p>
            <p className="text-ecotp-green text-2xl">68%</p>
          </div>
          <div className="p-4 rounded border border-ecotp-gray-200">
            <p className="text-black font-semibold">Documents partagés</p>
            <p className="text-ecotp-green text-2xl">164</p>
          </div>
        </div>
      </Card>
    </div>
  )
}