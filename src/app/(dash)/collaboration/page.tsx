"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, CheckCircle, Circle, Clock, MoreVertical, User as UserIcon } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

// Types
interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  profiles?: { name: string }
}

export default function CollaborationPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
  *,
  profiles: assignee_id(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const createTask = async () => {
    if (!newTaskTitle.trim()) return
    const { data: { user } } = await supabase.auth.getUser()

    try {
      const newTask = {
        title: newTaskTitle,
        status: 'todo',
        assignee_id: user?.id // Assign to creator by default
      }

      const { error } = await supabase
        .from('tasks')
        .insert(newTask)

      if (error) throw error

      setNewTaskTitle('')
      setIsModalOpen(false)
      fetchTasks() // Refresh to get the full object with profile
    } catch (err: any) {
      console.error('Error creating task', err)
      alert('Erreur lors de la création : ' + err.message)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error("Error updating", err)
      // Revert handling would go here in a full app
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId as Task['status']

    // Optimistic Update
    const updatedTasks = tasks.map(t =>
      t.id === draggableId ? { ...t, status: newStatus } : t
    )
    setTasks(updatedTasks)

    // Supabase Update
    updateStatus(draggableId, newStatus)
  }

  // --- Render Components for DnD ---

  const TaskCard = ({ task, index }: { task: Task, index: number }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          className={`bg - white p - 4 rounded - xl shadow - sm border border - gray - 100 mb - 3 hover: shadow - md transition - all group ${snapshot.isDragging ? 'shadow-lg ring-2 ring-ecotp-green-500/20 rotate-2' : ''} `}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`px - 2 py - 0.5 rounded text - [10px] font - bold uppercase tracking - wider
                        ${task.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}
`}>
              {task.priority || 'Normal'}
            </span>
          </div>
          <h4 className="font-medium text-gray-900 mb-3">{task.title}</h4>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              {task.profiles?.name || 'Non assigné'}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )

  const Column = ({ title, status, icon: Icon, colorClass }: any) => {
    const columnTasks = tasks.filter(t => t.status === status)

    return (
      <div className="flex-1 min-w-[300px] flex flex-col h-full">
        <div className={`flex items - center justify - between mb - 4 p - 3 rounded - lg ${colorClass} `}>
          <div className="flex items-center gap-2 font-semibold">
            <Icon className="w-4 h-4" />
            {title}
          </div>
          <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold">{columnTasks.length}</span>
        </div>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex - 1 min - h - [150px] transition - colors rounded - xl p - 1 ${snapshot.isDraggingOver ? 'bg-gray-50/80 border-2 border-dashed border-gray-200' : ''} `}
            >
              {columnTasks.map((t, index) => <TaskCard key={t.id} task={t} index={index} />)}
              {provided.placeholder}

              {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-sm">
                  Aucun ticket
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collaboration</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des tâches et tickets internes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ecotp-green-600 text-white rounded-lg text-sm font-medium hover:bg-ecotp-green-700 transition-colors shadow-lg shadow-ecotp-green-900/20"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Tâche
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-200px)]">
          <Column title="À Faire" status="todo" icon={Circle} colorClass="bg-gray-100 text-gray-700" />
          <Column title="En Cours" status="in_progress" icon={Clock} colorClass="bg-blue-50 text-blue-700" />
          <Column title="Terminé" status="done" icon={CheckCircle} colorClass="bg-green-50 text-green-700" />
        </div>
      </DragDropContext>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Tâche">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la tâche</label>
            <label className="sr-only">Titre de la tâche</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ecotp-green-500/20 focus:border-ecotp-green-500 outline-none transition-all"
              placeholder="Ex: Commander le sable..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Annuler</button>
            <button onClick={createTask} className="px-4 py-2 bg-ecotp-green-600 text-white rounded-lg hover:bg-ecotp-green-700 transition-colors">Créer</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}