"use client"

import { Check, Zap, Umbrella, BarChart3, Shield } from 'lucide-react'
import Card from '@/components/Card'

export default function PremiumPage() {
    return (
        <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Passez au niveau supérieur</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Débloquez la puissance de l'IA et de la Data pour sécuriser vos marges et impressionner vos clients.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center bg-gradient-to-br from-ecotp-green-900 to-black rounded-3xl p-8 text-white shadow-2xl">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                        <Zap className="w-4 h-4" />
                        Pack Innovation
                    </div>
                    <h2 className="text-3xl font-bold">Eco TP <span className="text-green-400">Pro</span></h2>
                    <p className="text-gray-300 text-lg">
                        Une suite d'outils connectés pour anticiper les aléas climatiques, rassurer vos clients avec des photos HD et centraliser vos échanges.
                    </p>
                    <button className="bg-white text-ecotp-green-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                        Activer l'essai gratuit (14 jours)
                    </button>
                    <p className="text-sm text-gray-500">Aucune carte bancaire requise pour la démo.</p>
                </div>

                {/* Feature Grid Visual */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                        <Umbrella className="w-8 h-8 text-blue-400 mb-3" />
                        <h3 className="font-bold mb-1">Météo Prédictive</h3>
                        <p className="text-sm text-gray-300">Anticipez les arrêts chantiers à J+5 avec alertes automatiques.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                        <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
                        <h3 className="font-bold mb-1">Reporting IA</h3>
                        <p className="text-sm text-gray-300">Analysez la rentabilité de chaque étape en temps réel.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                        <Shield className="w-8 h-8 text-green-400 mb-3" />
                        <h3 className="font-bold mb-1">GED Sécurisée</h3>
                        <p className="text-sm text-gray-300">Stockage illimité et signature électronique intégrée.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                        <Check className="w-8 h-8 text-yellow-400 mb-3" />
                        <h3 className="font-bold mb-1">Portail Client</h3>
                        <p className="text-sm text-gray-300">Offrez une expérience "Transparence Totale" à vos maîtres d'ouvrage.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Comparatif des offres</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-4 pl-4 text-gray-500 font-medium">Fonctionnalités</th>
                                <th className="py-4 text-center font-bold text-gray-700">Standard</th>
                                <th className="py-4 text-center font-bold text-ecotp-green-600 text-lg">Premium</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-600">
                            <tr>
                                <td className="py-4 pl-4">Suivi de chantier (Timeline)</td>
                                <td className="text-center text-green-500"><Check className="w-5 h-5 mx-auto" /></td>
                                <td className="text-center text-green-500"><Check className="w-5 h-5 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-4 pl-4">Upload Fichiers</td>
                                <td className="text-center">Max 50Mo</td>
                                <td className="text-center font-bold text-gray-900">Illimité</td>
                            </tr>
                            <tr>
                                <td className="py-4 pl-4">Météo Chantiers</td>
                                <td className="text-center text-gray-300">—</td>
                                <td className="text-center text-green-500"><Check className="w-5 h-5 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-4 pl-4">Galerie Photos Client</td>
                                <td className="text-center text-gray-300">—</td>
                                <td className="text-center text-green-500"><Check className="w-5 h-5 mx-auto" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
