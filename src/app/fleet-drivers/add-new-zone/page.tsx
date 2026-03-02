'use client';

import { useMemo, useState } from 'react'
import { ArrowLeft, AlertCircle, Check, Loader, Pencil, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { useAllZoneListQuery, useCreateZoneMutation, useDeleteZoneMutation, useUpdateZoneMutation } from '@/redux/feature/gasCompany/zoneSlice';

interface FormErrors {
    [key: string]: string
}

interface ZoneItem {
    id: number
    name: string
    is_active: boolean
    created_at: string
}

export default function AddZone() {
    const router = useRouter()
    const [createZone] = useCreateZoneMutation();
    const [updateZone] = useUpdateZoneMutation();
    const [deleteZone] = useDeleteZoneMutation();
    const { data, isLoading: isZoneLoading, isError: isZoneError } = useAllZoneListQuery(undefined);
    const [formData, setFormData] = useState({
        name: '',
        is_active: true,
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [editingZoneId, setEditingZoneId] = useState<number | null>(null)
    const [processingZoneId, setProcessingZoneId] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const zones = ((data as { data?: ZoneItem[] })?.data) || []

    const filteredZones = useMemo(() => {
        if (!searchTerm.trim()) return zones
        return zones.filter((zone) => zone.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [zones, searchTerm])

    const resetForm = () => {
        setFormData({
            name: '',
            is_active: true,
        })
        setErrors({})
        setEditingZoneId(null)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))

        if (errors[name]) {
            setErrors((prev) => {
                const nextErrors = { ...prev }
                delete nextErrors[name]
                return nextErrors
            })
        }
    }

    const validateForm = () => {
        const nextErrors: FormErrors = {}

        if (!formData.name.trim()) {
            nextErrors.name = 'Zone name is required'
        } else if (formData.name.trim().length < 3) {
            nextErrors.name = 'Zone name must be at least 3 characters'
        }

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setErrors({})

        try {
            const payload = {
                name: formData.name.trim(),
                is_active: formData.is_active,
            }

            if (editingZoneId) {
                await updateZone({ id: editingZoneId, data: payload }).unwrap()
                toast.success('Zone updated successfully!')
            } else {
                await createZone(payload).unwrap()
                toast.success('Zone created successfully!')
            }

            resetForm()
        } catch (error: any) {
            const apiData = error?.data
            const backendMessage =
                apiData?.message ||
                apiData?.detail ||
                (typeof apiData === 'string' ? apiData : '')

            const nameError = Array.isArray(apiData?.name)
                ? String(apiData.name[0])
                : (typeof apiData?.name === 'string' ? apiData.name : '')

            const submitMessage = nameError || backendMessage || 'Failed to create zone. Please try again.'

            setErrors({
                ...(nameError ? { name: nameError } : {}),
                submit: submitMessage,
            })
            toast.error(submitMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (zone: ZoneItem) => {
        setEditingZoneId(zone.id)
        setFormData({
            name: zone.name,
            is_active: zone.is_active,
        })
        setErrors({})
    }

    const handleToggleStatus = async (zone: ZoneItem) => {
        setProcessingZoneId(zone.id)
        try {
            await updateZone({
                id: zone.id,
                data: {
                    is_active: !zone.is_active,
                },
            }).unwrap()
            toast.success(`Zone ${!zone.is_active ? 'activated' : 'deactivated'} successfully!`)
        } catch (error: any) {
            const message =
                error?.data?.message ||
                error?.data?.detail ||
                'Failed to update zone status.'
            toast.error(message)
        } finally {
            setProcessingZoneId(null)
        }
    }

    const handleDelete = async (zone: ZoneItem) => {
        const confirmed = window.confirm(`Delete ${zone.name}? This action cannot be undone.`)
        if (!confirmed) return

        setProcessingZoneId(zone.id)
        try {
            await deleteZone(zone.id).unwrap()
            toast.success('Zone deleted successfully!')
            if (editingZoneId === zone.id) {
                resetForm()
            }
        } catch (error: any) {
            const message =
                error?.data?.message ||
                error?.data?.detail ||
                'Failed to delete zone.'
            toast.error(message)
        } finally {
            setProcessingZoneId(null)
        }
    }

    return (
        <div className="px-4 sm:px-6 pt-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-2 bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                        <button onClick={router.back} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">{editingZoneId ? 'Edit Zone' : 'Add New Zone'}</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-5">
                        <div>
                            <Label htmlFor="name" className="text-[#0F172A] text-base sm:text-lg font-medium mb-2">Zone Name</Label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Savar Zone"
                                className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[#0F172A] text-sm sm:text-base font-medium">Zone Status</p>
                                <p className="text-gray-500 text-xs sm:text-sm">Set whether this zone is active now</p>
                            </div>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                            </label>
                        </div>

                        {errors.submit && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-300">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <p className="text-sm text-red-700">{errors.submit}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-l from-[#0776BD] to-[#51C7E1] hover:shadow-lg'}`}
                        >
                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                            {loading ? (editingZoneId ? 'Updating Zone...' : 'Creating Zone...') : (editingZoneId ? 'Update Zone' : 'Create Zone')}
                        </button>

                        {editingZoneId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-full border border-gray-300 bg-white text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-semibold text-[#1E1E1C]">All Zones</h2>
                        <span className="text-xs sm:text-sm text-gray-500">{filteredZones.length}</span>
                    </div>

                    <div className="p-4 sm:p-5 border-b border-gray-100">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search zone by name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="max-h-[520px] overflow-y-auto">
                        {isZoneLoading ? (
                            <p className="px-4 sm:px-5 py-6 text-sm text-gray-500">Loading zones...</p>
                        ) : isZoneError ? (
                            <p className="px-4 sm:px-5 py-6 text-sm text-red-500">Failed to load zones</p>
                        ) : filteredZones.length === 0 ? (
                            <p className="px-4 sm:px-5 py-6 text-sm text-gray-500">No zones found</p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredZones.map((zone) => (
                                    <div key={zone.id} className="px-4 sm:px-5 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm sm:text-base font-medium text-[#1E1E1C]">{zone.name}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${zone.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {zone.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Created: {new Date(zone.created_at).toLocaleDateString()}</p>

                                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(zone)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            >
                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                            </button>

                                            <button
                                                type="button"
                                                disabled={processingZoneId === zone.id}
                                                onClick={() => handleToggleStatus(zone)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border ${zone.is_active ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'} disabled:opacity-50`}
                                            >
                                                {zone.is_active ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                                {zone.is_active ? 'Deactivate' : 'Activate'}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={processingZoneId === zone.id}
                                                onClick={() => handleDelete(zone)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
