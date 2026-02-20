"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Paperclip, MoreVertical, User, Clock, AlertTriangle } from 'lucide-react'

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
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [currentUserRole, setCurrentUserRole] = useState<string>('client')
    const [currentUserName, setCurrentUserName] = useState<string>('Utilisateur')

    // Récupérer user depuis localStorage (non-bloquant)
    const getCurrentUser = () => {
        try {
            const stored = localStorage.getItem('auth_user')
            if (stored) {
                const u = JSON.parse(stored)
                return { id: u.id, name: u.name || u.email || 'Utilisateur', role: u.role || 'client' }
            }
        } catch { }
        return null
    }

    useEffect(() => {
        // Charger user
        const user = getCurrentUser()
        if (user) {
            setCurrentUserId(user.id)
            setCurrentUserRole(user.role)
            setCurrentUserName(user.name)
        } else {
            // Fallback session
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) {
                    const meta = session.user.user_metadata
                    setCurrentUserId(session.user.id)
                    setCurrentUserRole(meta?.role || 'client')
                    setCurrentUserName(meta?.name || meta?.full_name || session.user.email?.split('@')[0] || 'Utilisateur')
                }
            })
        }

        // Charger les messages initiaux
        fetchMessages()

        // Vérifier si projectId est un UUID valide
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)

        if (!isUUID) return

        // Mode production: Realtime
        const channel = supabase
            .channel(`messages:${projectId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `project_id=eq.${projectId}`
                },
                (payload) => {
                    const localUser = getCurrentUser()
                    const newMsg: Message = {
                        id: payload.new.id,
                        sender_id: payload.new.sender_id,
                        sender_name: payload.new.sender_name || 'Utilisateur',
                        content: payload.new.content,
                        created_at: payload.new.created_at,
                        is_own: payload.new.sender_id === (localUser?.id || currentUserId)
                    }

                    setMessages(prev => {
                        if (prev.some(m => m.id === newMsg.id)) return prev
                        return [...prev, newMsg]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [projectId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fetchMessages = async () => {
        try {
            setErrorMsg(null)
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)

            if (!isUUID) {
                setMessages([])
                return
            }

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Erreur chargement messages:', error)
                setMessages([])
                return
            }

            const localUser = getCurrentUser()
            const uid = localUser?.id || currentUserId

            const formattedMessages = (data || []).map(msg => ({
                id: msg.id,
                sender_id: msg.sender_id,
                sender_name: msg.sender_name || 'Utilisateur',
                content: msg.content,
                created_at: msg.created_at,
                is_own: msg.sender_id === uid
            }))
            setMessages(formattedMessages)

        } catch (err: any) {
            console.error('Erreur fetch messages:', err)
            setMessages([])
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return

        setSending(true)
        setErrorMsg(null)

        try {
            const localUser = getCurrentUser()
            const userId = localUser?.id || currentUserId
            const userName = localUser?.name || currentUserName

            if (!userId) {
                setErrorMsg('Vous devez être connecté pour envoyer un message')
                return
            }

            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)

            if (!isUUID) {
                setErrorMsg('Projet invalide')
                return
            }

            const messageData = {
                project_id: projectId,
                sender_id: userId,
                sender_name: userName,
                content: newMessage.trim(),
            }

            const { data: inserted, error } = await supabase
                .from('messages')
                .insert([messageData])
                .select()
                .single()

            if (error) {
                console.error('Erreur envoi message:', error)
                setErrorMsg(`Erreur: ${error.message}`)
                return
            }

            // Mise à jour optimiste de l'UI (le realtime s'en charge aussi)
            const newMsg: Message = {
                id: inserted?.id || `temp-${Date.now()}`,
                sender_id: userId,
                sender_name: userName,
                content: newMessage.trim(),
                created_at: inserted?.created_at || new Date().toISOString(),
                is_own: true
            }
            setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev
                return [...prev, newMsg]
            })
            setNewMessage('')

        } catch (err: any) {
            console.error('Error sending message:', err)
            setErrorMsg(`Erreur: ${err.message}`)
        } finally {
            setSending(false)
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
                            {currentUserRole === 'admin' ? clientName || 'Client' : 'Eco TP'}
                        </h3>
                        <p className="text-xs text-ecotp-green-100">Messagerie du projet</p>
                    </div>
                </div>
                <button
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={fetchMessages}
                    title="Actualiser"
                >
                    <MoreVertical className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* ERROR Display */}
            {errorMsg && (
                <div className="bg-red-50 p-2 text-center text-red-600 text-xs flex items-center justify-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    {errorMsg}
                    <button onClick={() => setErrorMsg(null)} className="ml-2 underline">Fermer</button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
                {messages.length === 0 && !errorMsg && (
                    <div className="text-center text-gray-400 py-10">
                        <p>Aucun message pour le moment.</p>
                        <p className="text-xs">Dites bonjour ! 👋</p>
                    </div>
                )}

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
                                <p className={`text-xs ${message.is_own ? 'text-ecotp-green-100' : 'text-gray-400'}`}>
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
                        title="Joindre un fichier (bientôt disponible)"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <textarea
                        placeholder="Votre message..."
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ecotp-green-500 focus:border-ecotp-green-500 resize-none"
                        rows={1}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="p-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
