"use client"

import { useState, useEffect } from 'react'
import { Bell, X, Check, MessageSquare, Calendar, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Notification {
    id: string
    type: 'message' | 'project' | 'alert'
    title: string
    message: string
    read: boolean
    created_at: string
    project_id?: string
}

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        // Lire user depuis localStorage (non-bloquant)
        const getLocalUser = () => {
            try {
                const stored = localStorage.getItem('auth_user')
                if (stored) return JSON.parse(stored)
            } catch { }
            return null
        }

        const user = getLocalUser()
        setCurrentUser(user)
        if (user?.id) fetchNotifications(user.id)

        // Refresh toutes les 60 secondes
        const interval = setInterval(() => {
            const u = getLocalUser()
            if (u?.id) fetchNotifications(u.id)
        }, 60000)
        return () => clearInterval(interval)
    }, [])

    const fetchNotifications = async (userId?: string) => {
        // Ne pas faire de requête si pas d'userId
        if (!userId) {
            // Utiliser les notifications de démo
            const demoNotifications: Notification[] = [
                {
                    id: 'demo-1',
                    type: 'message',
                    title: 'Nouveau message',
                    message: 'Admin EcoTP vous a envoyé un message concernant votre projet',
                    read: false,
                    created_at: new Date(Date.now() - 600000).toISOString()
                },
                {
                    id: 'demo-2',
                    type: 'project',
                    title: 'Mise à jour du projet',
                    message: 'Le terrassement de votre projet est terminé',
                    read: false,
                    created_at: new Date(Date.now() - 3600000).toISOString()
                }
            ]
            setNotifications(demoNotifications)
            setUnreadCount(demoNotifications.filter(n => !n.read).length)
            return
        }

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(10)

            if (error) {
                console.error('Erreur chargement notifications:', error);
                // Générer des notifications basées sur l'activité réelle
                await generateRealNotifications(userId);
                return;
            }

            // Si pas de notifications, générer à partir de l'activité réelle
            if (!data || data.length === 0) {
                await generateRealNotifications(userId);
            } else {
                setNotifications(data)
                setUnreadCount(data.filter(n => !n.read).length)
            }
        } catch (err) {
            console.error('Erreur notifications:', err);
            // Générer des notifications basées sur l'activité réelle
            await generateRealNotifications(userId);
        }
    }

    // Générer des notifications réelles basées sur l'activité
    // Sécurité : admin voit tout, client ne voit que son activité
    const generateRealNotifications = async (userId: string) => {
        try {
            const realNotifications: Notification[] = []

            // Lire le rôle depuis localStorage (sync, non bloquant)
            const localUser = (() => {
                try { return JSON.parse(localStorage.getItem('auth_user') || 'null') } catch { return null }
            })()
            const isAdmin = localUser?.role === 'admin'

            if (isAdmin) {
                // ── ADMIN : voit toute l'activité globale ──────────────────

                // Messages récents de toute l'appli
                const { data: messages } = await supabase
                    .from('messages')
                    .select('id, content, created_at, project_id, sender_name')
                    .neq('sender_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(5)

                messages?.forEach((msg: any) => {
                    realNotifications.push({
                        id: `msg-${msg.id}`,
                        type: 'message',
                        title: 'Nouveau message client',
                        message: msg.sender_name
                            ? `${msg.sender_name}: ${msg.content?.slice(0, 60)}...`
                            : 'Nouveau message sur un projet',
                        read: false,
                        created_at: msg.created_at,
                        project_id: msg.project_id
                    })
                })

                // Documents récents uploadés par les clients
                const { data: documents } = await supabase
                    .from('documents')
                    .select('id, name, label, created_at')
                    .neq('uploaded_by', userId)
                    .order('created_at', { ascending: false })
                    .limit(3)

                documents?.forEach((doc: any) => {
                    realNotifications.push({
                        id: `doc-${doc.id}`,
                        type: 'project',
                        title: 'Nouveau document',
                        message: `${doc.label || doc.name} a été ajouté`,
                        read: false,
                        created_at: doc.created_at
                    })
                })

            } else {
                // ── CLIENT : uniquement son activité ──────────────────────

                // 1. Récupérer les project_ids du client
                const { data: clientProjects } = await supabase
                    .from('projects')
                    .select('id')
                    .eq('client_id', userId)

                const projectIds = clientProjects?.map((p: any) => p.id) ?? []

                // 2. Messages sur SES projets uniquement (par d'autres que lui)
                if (projectIds.length > 0) {
                    const { data: messages } = await supabase
                        .from('messages')
                        .select('id, content, created_at, project_id, sender_name')
                        .in('project_id', projectIds)
                        .neq('sender_id', userId)
                        .order('created_at', { ascending: false })
                        .limit(5)

                    messages?.forEach((msg: any) => {
                        realNotifications.push({
                            id: `msg-${msg.id}`,
                            type: 'message',
                            title: 'Nouveau message',
                            message: msg.sender_name
                                ? `${msg.sender_name}: ${msg.content?.slice(0, 60)}...`
                                : 'Nouveau message sur votre projet',
                            read: false,
                            created_at: msg.created_at,
                            project_id: msg.project_id
                        })
                    })
                }

                // 3. Documents uploadés par l'admin pour ce client (par project_id)
                if (projectIds.length > 0) {
                    const { data: documents } = await supabase
                        .from('documents')
                        .select('id, name, label, created_at, project_id')
                        .in('project_id', projectIds)
                        .neq('uploaded_by', userId)
                        .order('created_at', { ascending: false })
                        .limit(3)

                    documents?.forEach((doc: any) => {
                        realNotifications.push({
                            id: `doc-${doc.id}`,
                            type: 'project',
                            title: 'Nouveau document partagé',
                            message: `${doc.label || doc.name} a été ajouté à votre projet`,
                            read: false,
                            created_at: doc.created_at
                        })
                    })
                }
            }

            // Trier par date et limiter à 10
            realNotifications.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            const limitedNotifications = realNotifications.slice(0, 10)

            setNotifications(limitedNotifications)
            setUnreadCount(limitedNotifications.filter(n => !n.read).length)

        } catch (err) {
            console.error('Erreur génération notifications:', err)
            setNotifications([])
            setUnreadCount(0)
        }
    }


    const markAsRead = async (notificationId: string) => {
        try {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId)

            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            ))
            setUnreadCount(Math.max(0, unreadCount - 1))
        } catch (err) {
            console.error('Error marking notification as read:', err)
        }
    }

    const markAllAsRead = async () => {
        if (!currentUser?.id) return;

        try {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', currentUser.id)
                .eq('read', false)

            setNotifications(notifications.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (err) {
            console.error('Error marking all as read:', err)
        }
    }

    const deleteNotification = async (notificationId: string) => {
        try {
            await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId)

            setNotifications(notifications.filter(n => n.id !== notificationId))
            const deletedNotif = notifications.find(n => n.id === notificationId)
            if (deletedNotif && !deletedNotif.read) {
                setUnreadCount(Math.max(0, unreadCount - 1))
            }
        } catch (err) {
            console.error('Error deleting notification:', err)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'message':
                return <MessageSquare className="w-5 h-5 text-blue-600" />
            case 'project':
                return <Calendar className="w-5 h-5 text-green-600" />
            case 'alert':
                return <AlertCircle className="w-5 h-5 text-orange-600" />
            default:
                return <Bell className="w-5 h-5 text-gray-600" />
        }
    }

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

        if (seconds < 60) return 'À l\'instant'
        if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`
        if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`
        return `Il y a ${Math.floor(seconds / 86400)} j`
    }

    return (
        <div className="relative">
            {/* Bouton Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel — fixe sur mobile, absolu sur desktop */}
                    <div className="fixed sm:absolute inset-x-2 top-20 sm:top-12 sm:inset-x-auto sm:right-0 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fade-in-down max-h-[80vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium transition-opacity hover:opacity-70"
                                    style={{ color: '#524f3d' }}
                                >
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>

                        {/* Liste */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm">Aucune notification</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 mt-1">
                                                {getIcon(notif.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="text-sm font-semibold text-gray-900">
                                                        {notif.title}
                                                    </h4>
                                                    {!notif.read && (
                                                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400">
                                                        {getTimeAgo(notif.created_at)}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {!notif.read && (
                                                            <button
                                                                onClick={() => markAsRead(notif.id)}
                                                                className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                                                                title="Marquer comme lu"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(notif.id)}
                                                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-gray-100 text-center shrink-0">
                                <button className="text-sm font-medium transition-opacity hover:opacity-70"
                                    style={{ color: '#524f3d' }}>
                                    Voir toutes les notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
