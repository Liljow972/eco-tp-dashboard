"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

import { Loader2, Plus, Save } from 'lucide-react'

// Types
interface Profile {
    id: string
    name: string
    email: string
}

interface ProjectData {
    id?: string
    name: string
    client_id: string
    status: 'pending' | 'in_progress' | 'completed'
    progress: number
    budget: number
    spent: number
    start_date: string
    end_date: string
}

interface ProjectFormProps {
    initialData?: ProjectData
    onSuccess: () => void
    onCancel: () => void
}

export default function ProjectForm({ initialData, onSuccess, onCancel }: ProjectFormProps) {
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<Profile[]>([])
    const [formData, setFormData] = useState<ProjectData>(
        initialData || {
            name: '',
            client_id: '',
            status: 'pending',
            progress: 0,
            budget: 0,
            spent: 0,
            start_date: '',
            end_date: ''
        }
    )

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        // Fetch profiles where role is 'client'
        // Assuming 'profiles' table has 'role' field as per schema.sql
        const { data } = await supabase
            .from('profiles')
            .select('id, name, email')
            .eq('role', 'client')

        if (data) setClients(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (formData.id) {
                // Update
                const { error } = await supabase
                    .from('projects')
                    .update({
                        name: formData.name,
                        client_id: formData.client_id,
                        status: formData.status,
                        progress: formData.progress,
                        budget: formData.budget,
                        spent: formData.spent,
                        start_date: formData.start_date || null,
                        end_date: formData.end_date || null
                    })
                    .eq('id', formData.id)

                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('projects')
                    .insert([{
                        name: formData.name,
                        client_id: formData.client_id,
                        status: formData.status,
                        progress: formData.progress,
                        budget: formData.budget,
                        spent: formData.spent,
                        start_date: formData.start_date || null,
                        end_date: formData.end_date || null
                    }])

                if (error) throw error
            }

            onSuccess()
        } catch (error) {
            console.error('Error saving project:', error)
            alert("Erreur lors de l'enregistrement")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom du Projet */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du chantier</label>
                    <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-ecotp-green-500 focus:border-ecotp-green-500 outline-none transition-all"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Terrassement Villa Bel Air"
                    />
                </div>

                {/* Client */}
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-ecotp-green-500 outline-none"
                        value={formData.client_id}
                        onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                    >
                        <option value="">Sélectionner un client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name || client.email}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Statut */}
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-ecotp-green-500 outline-none"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    >
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminé</option>
                    </select>
                </div>

                {/* Progression */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Avancement Global ({formData.progress}%)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ecotp-green-600"
                        value={formData.progress}
                        onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Démarrage</span>
                        <span>Mi-parcours</span>
                        <span>Livraison</span>
                    </div>
                </div>

                {/* Budget & Dépensé */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Total (€)</label>
                    <div className="relative">
                        <input
                            type="number"
                            className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-ecotp-green-500 outline-none"
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                        />
                        <span className="absolute left-3 top-2 text-gray-400">€</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Consommé (€)</label>
                    <div className="relative">
                        <input
                            type="number"
                            className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-ecotp-green-500 outline-none"
                            value={formData.spent}
                            onChange={e => setFormData({ ...formData, spent: parseFloat(e.target.value) })}
                        />
                        <span className="absolute left-3 top-2 text-gray-400">€</span>
                    </div>
                </div>

                {/* Dates */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                    <input
                        type="date"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-ecotp-green-500 outline-none"
                        value={formData.start_date || ''}
                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin prév.</label>
                    <input
                        type="date"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-ecotp-green-500 outline-none"
                        value={formData.end_date || ''}
                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-ecotp-green-600 rounded-lg hover:bg-ecotp-green-700 focus:outline-none focus:ring-2 focus:ring-ecotp-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {formData.id ? 'Mettre à jour' : 'Créer le chantier'}
                </button>
            </div>
        </form>
    )
}
