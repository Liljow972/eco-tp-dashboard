import Card from '@/components/Card'
import { AuthService } from '@/lib/auth'

export default function SettingsPage() {
  const user = AuthService.getCurrentUser()
  const isClient = user?.role === 'client'

  return (
    <div className="space-y-6">
      <Card className="bg-ecotp-white" title="Profil">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-black font-medium">Nom</label>
            <input className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" defaultValue={user?.name ?? ''} />
          </div>
          <div>
            <label className="text-black font-medium">Email</label>
            <input className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" defaultValue={user?.email ?? ''} />
          </div>
        </div>
      </Card>

      <Card className="bg-ecotp-white" title="Préférences">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-black">
            <input type="checkbox" className="accent-ecotp-green" />
            Thème sombre (optionnel)
          </label>
          <label className="flex items-center gap-2 text-black">
            <input type="checkbox" className="accent-ecotp-green" />
            Notifications par email
          </label>
        </div>
      </Card>

      <Card className="bg-ecotp-white" title="Rôle">
        <p className="text-black">Rôle actuel : <span className="font-semibold">{user?.role ?? 'invité'}</span></p>
        <div className="mt-3">
          <label className="text-black font-medium">Changer de rôle</label>
          <select className="mt-1 w-full border border-ecotp-gray-200 rounded px-3 py-2" disabled={isClient}>
            <option>client</option>
            <option>admin</option>
          </select>
          {isClient && <p className="text-ecotp-gray-400 text-sm mt-1">Lecture seule pour les clients.</p>}
        </div>
      </Card>
    </div>
  )
}