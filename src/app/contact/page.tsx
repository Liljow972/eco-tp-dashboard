export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">Nous contacter</h1>
        <p className="mt-2 text-gray-600">Une question ? L'équipe EcoTP vous répond rapidement.</p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input className="mt-1 w-full border border-gray-300 rounded px-3 py-2" placeholder="Votre nom" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 w-full border border-gray-300 rounded px-3 py-2" placeholder="vous@exemple.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea className="mt-1 w-full border border-gray-300 rounded px-3 py-2" rows={5} placeholder="Décrivez votre demande" />
          </div>
          <button type="button" className="px-6 py-3 bg-ecotp-green text-white rounded hover:bg-emerald-700">Envoyer</button>
        </form>
      </div>
    </div>
  )
}