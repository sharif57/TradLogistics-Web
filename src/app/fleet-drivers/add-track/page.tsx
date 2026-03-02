'use client'

import { useState } from 'react'
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAllZoneListQuery } from '@/redux/feature/gasCompany/zoneSlice'
import { useAllDriverListQuery, useCreateTruckMutation } from '@/redux/feature/gasCompany/companySlice'

const validateInventory = (value: string): boolean => {
    const num = parseInt(value)
    return !isNaN(num) && num >= 0
}

interface FormErrors {
    [key: string]: string
}

interface FormData {
    vehicleType: string
    operatingZone: string
    assignDriver: string
    cylinder12kg: string
    cylinder25kg: string
}

export default function AddTrack() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        vehicleType: '',
        operatingZone: '',
        assignDriver: '',
        cylinder12kg: '',
        cylinder25kg: '',
    })

    const { data } = useAllZoneListQuery(undefined);
    const { data: driverData } = useAllDriverListQuery('driver');
    const [createTruck] = useCreateTruckMutation();

    const zones = ((data as { data?: Array<{ id: number; name: string; is_active: boolean }> })?.data || []).filter((zone) => zone.is_active)
    const drivers = (driverData as { data?: Array<{ user_id: number; first_name?: string; last_name?: string; phone?: string; role?: string }> } | undefined)?.data || []

    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Vehicle Type validation
        if (!formData.vehicleType.trim()) {
            newErrors.vehicleType = 'Vehicle type is required'
        }

        // Operating Zone validation
        if (!formData.operatingZone.trim()) {
            newErrors.operatingZone = 'Operating zone is required'
        }

        // 12 kg Cylinder validation
        if (!formData.cylinder12kg.trim()) {
            newErrors.cylinder12kg = 'Please enter a value'
        } else if (!validateInventory(formData.cylinder12kg)) {
            newErrors.cylinder12kg = 'Enter a valid non-negative number'
        } else if (parseInt(formData.cylinder12kg) > 999) {
            newErrors.cylinder12kg = 'Value too high (max 999)'
        }

        // 25 kg Cylinder validation
        if (!formData.cylinder25kg.trim()) {
            newErrors.cylinder25kg = 'Please enter a value'
        } else if (!validateInventory(formData.cylinder25kg)) {
            newErrors.cylinder25kg = 'Enter a valid non-negative number'
        } else if (parseInt(formData.cylinder25kg) > 999) {
            newErrors.cylinder25kg = 'Value too high (max 999)'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setErrors({})

        try {
            const payload = {
                vehicle_type: formData.vehicleType,
                operating_zone: Number(formData.operatingZone),
                driver: formData.assignDriver ? Number(formData.assignDriver) : '',
                cylinder_12kg: Number(formData.cylinder12kg),
                cylinder_25kg: Number(formData.cylinder25kg),
            }

            await createTruck(payload).unwrap()
            toast.success('Truck added successfully! Redirecting...')

            // Redirect after 2 seconds
            router.push('/fleet-drivers')

        } catch (error: any) {
            const apiData = error?.data
            const backendMessage =
                apiData?.message ||
                apiData?.detail ||
                (typeof apiData === 'string' ? apiData : '')

            const submitMessage = backendMessage || 'Failed to add truck. Please try again.'
            setErrors({ submit: submitMessage })
            toast.error(submitMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl px-4 sm:px-6 pt-4">
            <div className="bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                    <button onClick={router.back} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">Add New Truck</h1>
                </div>



                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-4">

                    {/* Vehicle Type */}
                    <div>
                        <Label htmlFor="vehicleType" className='text-[#0F172A] text-lg font-medium mb-2'>Vehicle Type</Label>
                        <select
                            id="vehicleType"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base appearance-none bg-[#FFFFFF] bg-no-repeat bg-right ${errors.vehicleType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                                color: formData.vehicleType ? '#666' : '#999',
                            }}
                        >
                            <option value="">Select vehicle type</option>
                            <option value="small_pickup">Small Pickup</option>
                            <option value="medium_truck">Medium Truck</option>
                            <option value="large_truck">Large Truck</option>
                        </select>
                        {errors.vehicleType && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.vehicleType}
                            </p>
                        )}
                    </div>

                    {/* Operating Zone */}
                    <div>
                        <Label htmlFor="operatingZone" className='text-[#0F172A] text-lg font-medium mb-2'>Operating Zone</Label>
                        <select
                            id="operatingZone"
                            name="operatingZone"
                            value={formData.operatingZone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base appearance-none bg-[#FFFFFF] bg-no-repeat bg-right ${errors.operatingZone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                                color: formData.operatingZone ? '#666' : '#999',
                            }}
                        >
                            <option value="">Select delivery zone</option>
                            {zones.map((zone) => (
                                <option key={zone.id} value={zone.id}>{zone.name}</option>
                            ))}
                        </select>
                        {errors.operatingZone && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.operatingZone}
                            </p>
                        )}
                    </div>

                    {/* Assign Driver */}
                    <div>
                        <Label htmlFor="assignDriver" className='text-[#0F172A] text-lg font-medium mb-2'>Assign Driver (Optional)</Label>
                        <select
                            id="assignDriver"
                            name="assignDriver"
                            value={formData.assignDriver}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-[#FFFFFF] bg-no-repeat bg-right"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                                color: formData.assignDriver ? '#666' : '#999',
                            }}
                        >
                            <option value="">You can assign a driver now or later</option>
                            {drivers.map((driver) => (
                                <option key={driver.user_id} value={driver.user_id}>
                                    {driver.first_name || driver.last_name
                                        ? `${driver.first_name || ''} ${driver.last_name || ''}`.trim()
                                        : `Driver #${driver.user_id}`} ({driver.phone || 'No phone'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Inventory Section */}
                    <div>
                        <p className='text-[#0F172A] text-lg font-medium mb-4'>Set Initial Inventory</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* 12 kg Cylinder */}
                            <div>
                                <Label htmlFor="cylinder12kg" className='text-[#0F172A] text-lg font-medium mb-2'>12 kg Cylinder</Label>
                                <input
                                    type="number"
                                    id="cylinder12kg"
                                    name="cylinder12kg"
                                    value={formData.cylinder12kg}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    max="999"
                                    className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.cylinder12kg ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                />
                                {errors.cylinder12kg && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.cylinder12kg}
                                    </p>
                                )}
                            </div>

                            {/* 25 kg Cylinder */}
                            <div>
                                <Label htmlFor="cylinder25kg" className='text-[#0F172A] text-lg font-medium mb-2'>25 kg Cylinder</Label>
                                <input
                                    type="number"
                                    id="cylinder25kg"
                                    name="cylinder25kg"
                                    value={formData.cylinder25kg}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    max="999"
                                    className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.cylinder25kg ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                />
                                {errors.cylinder25kg && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.cylinder25kg}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-linear-to-l from-[#0776BD] to-[#51C7E1] hover:shadow-lg'
                            }`}
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        {loading ? 'Adding Truck...' : 'Confirm'}
                    </button>
                </form>
            </div>
        </div>
    )
}
