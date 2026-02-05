"use client"

import { Lock, Send, Paperclip, MoreVertical, User } from 'lucide-react'

interface Message {
    id: string
    sender: string
    content: string
    time: string
    isOwn: boolean
}

export default function MessagingDemo() {
    const demoMessages: Message[] = [
        {
            id: '1',
            sender: 'Jean Dupont',
            content: 'Bonjour, pouvez-vous me confirmer la date de début des travaux ?',
            time: '10:30',
            isOwn: false
        },
        {
            id: '2',
            sender: 'Vous',
            content: 'Bonjour Jean, les travaux débuteront le 15 janvier comme prévu.',
            time: '10:35',
            isOwn: true
        },
        {
            id: '3',
            sender: 'Jean Dupont',
            content: 'Parfait ! Et pour le terrassement, vous pensez que ça prendra combien de temps ?',
            time: '10:37',
            isOwn: false
        },
        {
            id: '4',
            sender: 'Vous',
            content: 'Environ 2 semaines selon les conditions météo. Je vous tiens informé de l\'avancement.',
            time: '10:40',
            isOwn: true
        }
    ]

    return (
        <div className="relative">
            {/* Interface de messagerie (preview) */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-ecotp-green-600 to-ecotp-green-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Jean Dupont</h3>
                            <p className="text-xs text-ecotp-green-100">Client - Terrassement Villa Moderne</p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Messages */}
                <div className="p-6 space-y-4 h-96 overflow-y-auto bg-gray-50">
                    {demoMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.isOwn
                                        ? 'bg-ecotp-green-600 text-white rounded-br-sm'
                                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                                    }`}
                            >
                                {!message.isOwn && (
                                    <p className="text-xs font-semibold mb-1 text-gray-500">{message.sender}</p>
                                )}
                                <p className="text-sm">{message.content}</p>
                                <p
                                    className={`text-xs mt-1 ${message.isOwn ? 'text-ecotp-green-100' : 'text-gray-400'
                                        }`}
                                >
                                    {message.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input (désactivé) */}
                <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="flex items-center gap-3">
                        <button
                            disabled
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            disabled
                            placeholder="Fonctionnalité Premium - Débloquée uniquement pour les abonnés"
                            className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ecotp-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            disabled
                            className="p-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay de blocage */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-center px-6 py-8 bg-white/95 rounded-2xl shadow-2xl max-w-md mx-4 border border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Fonctionnalité Premium</h3>
                    <p className="text-gray-600 mb-6">
                        La messagerie contextuelle est réservée aux abonnés Premium.
                        Centralisez tous vos échanges et gardez une trace professionnelle de chaque décision.
                    </p>

                    <div className="space-y-3 mb-6 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-ecotp-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-ecotp-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-700">Messagerie illimitée par projet</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-ecotp-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-ecotp-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-700">Pièces jointes (photos, documents)</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-ecotp-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-ecotp-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-700">Historique complet et recherche</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-ecotp-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-ecotp-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-700">Notifications en temps réel</p>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-ecotp-green-600 to-ecotp-green-700 text-white font-semibold rounded-xl hover:from-ecotp-green-700 hover:to-ecotp-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Passer à Premium
                    </button>

                    <p className="text-xs text-gray-500 mt-4">
                        Ou <a href="mailto:contact@ecotp.fr" className="text-ecotp-green-600 hover:underline font-medium">contactez-nous</a> pour plus d'informations
                    </p>
                </div>
            </div>
        </div>
    )
}
