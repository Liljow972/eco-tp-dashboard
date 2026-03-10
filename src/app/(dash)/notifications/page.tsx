"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Card from '@/components/Card'
import { Bell, Check, Trash2, Loader2, MessageSquare, Calendar, AlertCircle } from 'lucide-react'

// Interface copiee de NotificationCenter
interface Notification {
    id: string
    type: 'message' | 'project' | 'alert'
    title: string
    message: string
    read: boolean
    created_at: string
    project_id?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const dbNotifs: Notification[] = []
      
      const localUser = (() => {
          try { return JSON.parse(localStorage.getItem('auth_user') || 'null') } catch { return null }
      })()
      
      const isAdmin = localUser?.role === 'admin'
      const userId = localUser?.id

      if (userId) {
          const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
          if (data) dbNotifs.push(...data)
      }

      // Recreer les notifications reelles (messages & files) pour que la page "Toutes les notifications" affiche la meme chose
      const realNotifications: Notification[] = []
      
      if (userId) {
         if (isAdmin) {
            // Admin: messages recents
            const { data: messages } = await supabase.from('messages').select('id, content, created_at, project_id, sender_name').neq('sender_id', userId).order('created_at', { ascending: false }).limit(20)
            messages?.forEach((msg: any) => {
                realNotifications.push({ id: `msg-${msg.id}`, type: 'message', title: 'Nouveau message client', message: msg.sender_name ? `${msg.sender_name}: ${msg.content?.slice(0, 60)}...` : 'Nouveau message sur un projet', read: false, created_at: msg.created_at, project_id: msg.project_id })
            })
            // Admin: documents uploades par clients
            const { data: documents } = await supabase.from('documents').select('id, name, label, created_at').neq('uploaded_by', userId).order('created_at', { ascending: false }).limit(20)
            documents?.forEach((doc: any) => {
                realNotifications.push({ id: `doc-${doc.id}`, type: 'project', title: 'Nouveau document', message: `${doc.label || doc.name} a été ajouté`, read: false, created_at: doc.created_at })
            })
         } else {
            // Client: messages sur ses projets (par admin)
            const { data: clientProjects } = await supabase.from('projects').select('id').eq('client_id', userId)
            const projectIds = clientProjects?.map((p: any) => p.id) ?? []
            if (projectIds.length > 0) {
               const { data: messages } = await supabase.from('messages').select('id, content, created_at, project_id, sender_name').in('project_id', projectIds).neq('sender_id', userId).order('created_at', { ascending: false }).limit(20)
               messages?.forEach((msg: any) => {
                   realNotifications.push({ id: `msg-${msg.id}`, type: 'message', title: 'Nouveau message', message: msg.sender_name ? `${msg.sender_name}: ${msg.content?.slice(0, 60)}...` : 'Nouveau message sur votre projet', read: false, created_at: msg.created_at, project_id: msg.project_id })
               })
               // Client: documents ajoutes par admin
               const { data: documents } = await supabase.from('documents').select('id, name, label, created_at, project_id').in('project_id', projectIds).neq('uploaded_by', userId).order('created_at', { ascending: false }).limit(20)
               documents?.forEach((doc: any) => {
                   realNotifications.push({ id: `doc-${doc.id}`, type: 'project', title: 'Nouveau document partagé', message: `${doc.label || doc.name} a été ajouté à votre projet`, read: false, created_at: doc.created_at })
               })
            }
         }
      }

      // Appliquer l'etat read/hidden du localStorage
      const hiddenNotifs: string[] = JSON.parse(localStorage.getItem('hidden_notifs') || '[]')
      const readNotifs: string[] = JSON.parse(localStorage.getItem('read_notifs') || '[]')
      
      const filteredRealNotifications = realNotifications
          .filter(n => !hiddenNotifs.includes(n.id))
          .map(n => ({...n, read: readNotifs.includes(n.id) ? true : n.read }))

      // Merge & Sort
      const allNotifications = [...dbNotifs.filter(n => !hiddenNotifs.includes(n.id)), ...filteredRealNotifications]
      allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setNotifications(allNotifications)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string, isFake: boolean) => {
      if (isFake) {
          const readNotifs = JSON.parse(localStorage.getItem('read_notifs') || '[]')
          if (!readNotifs.includes(id)) localStorage.setItem('read_notifs', JSON.stringify([...readNotifs, id]))
      } else {
          await supabase.from('notifications').update({ read: true }).eq('id', id)
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotif = async (id: string, isFake: boolean) => {
      if (isFake) {
          const hiddenNotifs = JSON.parse(localStorage.getItem('hidden_notifs') || '[]')
          if (!hiddenNotifs.includes(id)) localStorage.setItem('hidden_notifs', JSON.stringify([...hiddenNotifs, id]))
      } else {
          await supabase.from('notifications').delete().eq('id', id)
      }
      setNotifications(prev => prev.filter(n => n.id !== id))
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

  return (
    <div className="space-y-6">
      <Card className="bg-white" title="Toutes les notifications" subtitle="Gérez toutes vos alertes, messages et mises à jour de documents ici.">
        {loading ? (
           <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : notifications.length === 0 ? (
           <div className="text-center p-8 text-gray-500">
               <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
               <p>Aucune notification</p>
           </div>
        ) : (
           <div className="space-y-4">
              {notifications.map(n => {
                 const isFake = n.id.startsWith('msg-') || n.id.startsWith('doc-') || n.id.startsWith('demo-');
                 return (
                 <div key={n.id} className={`p-4 border rounded-xl flex gap-4 transition-colors ${!n.read ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
                    <div className="mt-1">{getIcon(n.type)}</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                {n.title}
                                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                            </h4>
                            <span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString('fr-FR', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'
                            })}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{n.message}</p>
                        <div className="flex justify-end gap-2">
                            {!n.read && (
                                <button onClick={() => markAsRead(n.id, isFake)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded transition-colors shadow-sm">
                                    <Check className="w-3.5 h-3.5" /> Marquer lu
                                </button>
                            )}
                            <button onClick={() => deleteNotif(n.id, isFake)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors shadow-sm">
                                <Trash2 className="w-3.5 h-3.5" /> Supprimer
                            </button>
                        </div>
                    </div>
                 </div>
              )})}
           </div>
        )}
      </Card>
    </div>
  )
}
