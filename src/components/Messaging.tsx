"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthService } from '@/lib/auth'
import { Send, Paperclip, MoreVertical, User, Clock } from 'lucide-react'

interface Message {
    id: string
    sender_id: string
    sender_name: string
    content: string
    created_at: string
    is_own: boolean
}

interface MessagingProps {
    projectId: string
    clientId?: string
    clientName?: string
}

export default function Messaging({ projectId, clientId, clientName }: MessagingProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const currentUser = AuthService.getCurrentUser()

    useEffect(() => {
        fetchMessages()
        // Simuler un refresh toutes les 5 secondes
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
    }, [projectId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true })

            if (error) throw error

            // Fallback avec messages de démo
            if (!data || data.length === 0) {
                const demoMessages: Message[] = [
                    {
                        id: 'demo-1',
                        sender_id: clientId || 'client-1',
                        sender_name: clientName || 'Jean Dupont',
                        content: 'Bonjour, pouvez-vous me confirmer la date de début des travaux ?',
                        created_at: new Date(Date.now() - 3600000).toISOString(),
                        is_own: currentUser?.role === 'client'
                    },
                    {
                        id: 'demo-2',
                        sender_id: currentUser?.id || 'admin-1',
                        sender_name: currentUser?.name || 'Admin EcoTP',
                        content: 'Bonjour Jean, les travaux débuteront le 15 janvier comme prévu.',
                        created_at: new Date(Date.now() - 3000000).toISOString(),
                        is_own: currentUser?.role === 'admin'
                    },
                    {
                        id: 'demo-3',
                        sender_id: clientId || 'client-1',
                        sender_name: clientName || 'Jean Dupont',
                        content: 'Parfait ! Et pour le terrassement, vous pensez que ça prendra combien de temps ?',
                        created_at: new Date(Date.now() - 2400000).toISOString(),
                        is_own: currentUser?.role === 'client'
                    },
                    {
                        id: 'demo-4',
                        sender_id: currentUser?.id || 'admin-1',
                        sender_name: currentUser?.name || 'Admin EcoTP',
                        content: 'Environ 2 semaines selon les conditions météo. Je vous tiens informé de l\'avancement.',
                        created_at: new Date(Date.now() - 1800000).toISOString(),
                        is_own: currentUser?.role === 'admin'
                    }
                ]
                setMessages(demoMessages)
            } else {
                const formattedMessages = data.map(msg => ({
                    ...msg,
                    is_own: msg.sender_id === currentUser?.id
                }))
                setMessages(formattedMessages)
            }
        } catch (err) {
            console.error('Error fetching messages:', err)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return

        setSending(true)
        try {
            const messageData = {
                project_id: projectId,
                sender_id: currentUser?.id,
                sender_name: currentUser?.name,
                content: newMessage.trim(),
                created_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('messages')
                .insert([messageData])

            if (error) throw error

            // Ajouter le message localement en attendant le refresh
            const newMsg: Message = {
                id: `temp-${Date.now()}`,
                ...messageData,
                is_own: true
            }
            setMessages([...messages, newMsg])
            setNewMessage('')

            // Créer une notification pour le destinataire
            await createNotification()

            // Refresh après 1 seconde
            setTimeout(fetchMessages, 1000)
        } catch (err) {
            console.error('Error sending message:', err)
            alert('Erreur lors de l\'envoi du message')
        } finally {
            setSending(false)
        }
    }

    const createNotification = async () => {
        try {
            // Déterminer le destinataire (si admin envoie → client, si client envoie → admin)
            const recipientId = currentUser?.role === 'admin' ? clientId : 'admin'

            await supabase
                .from('notifications')
                .insert([{
                    user_id: recipientId,
                    type: 'message',
                    title: 'Nouveau message',
                    message: `${currentUser?.name} vous a envoyé un message`,
                    project_id: projectId,
                    read: false,
                    created_at: new Date().toISOString()
                }])
        } catch (err) {
            console.error('Error creating notification:', err)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Chargement des messages...</div>
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-[600px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-ecotp-green-600 to-ecotp-green-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">
                            {currentUser?.role === 'admin' ? clientName || 'Client' : 'Eco TP'}
                        </h3>
                        <p className="text-xs text-ecotp-green-100">Messagerie du projet</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.is_own
                                    ? 'bg-ecotp-green-600 text-white rounded-br-sm'
                                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm'
                                }`}
                        >
                            {!message.is_own && (
                                <p className="text-xs font-semibold mb-1 text-gray-500">{message.sender_name}</p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock className={`w-3 h-3 ${message.is_own ? 'text-ecotp-green-100' : 'text-gray-400'}`} />
                                <p
                                    className={`text-xs ${message.is_own ? 'text-ecotp-green-100' : 'text-gray-400'
                                        }`}
                                >
                                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-center gap-3">
                    <button
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Joindre un fichier"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea
                        placeholder="Votre message..."
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ecotp-green-500 focus:border-ecotp-green-500 resize-none"
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="p-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Appuyez sur Entrée pour envoyer</p>
            </div>
        </div>
    )
}
