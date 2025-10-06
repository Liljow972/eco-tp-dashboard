'use client'

import Link from 'next/link'

export default function AuthHeader() {
  return (
    <header className="w-full bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo-ecotp.svg" alt="EcoTP" className="h-8 w-8" />
        <span className="font-semibold text-gray-900">EcoTP</span>
      </Link>
      <Link href="/" className="text-sm text-primary-600 hover:text-primary-500">
        Retour à l'accueil
      </Link>
    </header>
  )
}