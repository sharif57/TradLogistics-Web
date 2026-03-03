'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { useUpdateInventoryMutation } from '@/redux/feature/gasCompany/InventorySlice'
import { useCompanyTrucksQuery } from '@/redux/feature/gasCompany/companySlice'
import { toast } from 'sonner'

const validateInventory = (value: string): boolean => {
    const num = parseInt(value)
    return !isNaN(num) && num >= 0
}

interface FormErrors {
    [key: string]: string
}

interface FormData {
    truckPublicId: string
    vehicleType: string
    operatingZone: string
    assignDriver: string
    cylinder12kg: string
    cylinder25kg: string
}

interface TruckItem {
    id: number
    public_id: string
    truck_id: string
    vehicle_type: string
    operating_zone: number
    operating_zone_name: string
    driver: number | null
    driver_name: string | null
    cylinder_12kg: number
    cylinder_25kg: number
}

interface TruckApiResponse {
    data?: TruckItem[]
}

export default function AddInventory() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedTruckId = searchParams.get('truckId')

    const [formData, setFormData] = useState<FormData>({
        truckPublicId: '',
        vehicleType: '',
        operatingZone: '',
        assignDriver: '',
        cylinder12kg: '',
        cylinder25kg: '',
    })
    const { data: companyData } = useCompanyTrucksQuery(undefined);
    const [updateInventory] = useUpdateInventoryMutation();
    const trucks = ((companyData as TruckApiResponse | undefined)?.data) || []

    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!trucks.length) return

        const matchedTruck = preselectedTruckId
            ? trucks.find((truck) => truck.truck_id === preselectedTruckId || truck.public_id === preselectedTruckId)
            : null

        if (matchedTruck) {
            setFormData({
                truckPublicId: matchedTruck.public_id,
                vehicleType: matchedTruck.vehicle_type || '',
                operatingZone: matchedTruck.operating_zone_name || '',
                assignDriver: matchedTruck.driver_name || '',
                cylinder12kg: String(matchedTruck.cylinder_12kg ?? ''),
                cylinder25kg: String(matchedTruck.cylinder_25kg ?? ''),
            })
        }
    }, [trucks, preselectedTruckId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'truckPublicId') {
            const selectedTruck = trucks.find((truck) => truck.public_id === value)

            setFormData((prev) => ({
                ...prev,
                truckPublicId: value,
                vehicleType: selectedTruck?.vehicle_type || '',
                operatingZone: selectedTruck?.operating_zone_name || '',
                assignDriver: selectedTruck?.driver_name || '',
                cylinder12kg: selectedTruck ? String(selectedTruck.cylinder_12kg) : prev.cylinder12kg,
                cylinder25kg: selectedTruck ? String(selectedTruck.cylinder_25kg) : prev.cylinder25kg,
            }))

            if (errors.truckPublicId) {
                setErrors((prev) => {
                    const next = { ...prev }
                    delete next.truckPublicId
                    return next
                })
            }

            return
        }

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

        if (!formData.truckPublicId.trim()) {
            newErrors.truckPublicId = 'Truck selection is required'
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
                mode: "add",
                cylinder_12kg: Number(formData.cylinder12kg),
                cylinder_25kg: Number(formData.cylinder25kg),
            }

            const response = await updateInventory({
                truckId: formData.truckPublicId,
                data: payload,
            }).unwrap()

            toast.success( response.message || 'Inventory updated successfully! Redirecting...')

            const selectedTruck = trucks.find((truck) => truck.public_id === formData.truckPublicId)
            if (selectedTruck) {
                setFormData((prev) => ({
                    ...prev,
                    cylinder12kg: String(payload.cylinder_12kg),
                    cylinder25kg: String(payload.cylinder_25kg),
                }))
            }

            setTimeout(() => {
                router.push('/inventory')
            }, 1200)
        } catch (error: any) {
            const apiData = error?.data
            const backendMessage =
                apiData?.message ||
                apiData?.detail ||
                (typeof apiData === 'string' ? apiData : '')

            const submitMessage = backendMessage || 'Failed to update inventory. Please try again.'
            setErrors({ submit: submitMessage })
            toast.error(submitMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl px-4 sm:px-6 pt-4">
            <div className="bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                    <button onClick={router.back} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">Adjust Inventory</h1>
                </div>

                {errors.submit && (
                    <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{errors.submit}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-4">
                    <div>
                        <Label htmlFor="truckPublicId" className='text-[#0F172A] text-lg font-medium mb-2'>Truck Selector</Label>
                        <select
                            id="truckPublicId"
                            name="truckPublicId"
                            value={formData.truckPublicId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base appearance-none bg-[#FFFFFF] bg-no-repeat bg-right ${errors.truckPublicId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                                color: formData.truckPublicId ? '#666' : '#999',
                            }}
                        >
                            <option value="">Select truck</option>
                            {trucks.map((truck) => (
                                <option key={truck.public_id} value={truck.public_id}>
                                    {truck.truck_id} - {truck.operating_zone_name}
                                </option>
                            ))}
                        </select>
                        {errors.truckPublicId && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.truckPublicId}
                            </p>
                        )}
                    </div>


                    <div>
                        <p className='text-[#0F172A] text-lg font-medium mb-4'>Set Inventory</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                                    className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.cylinder12kg ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                />
                                {errors.cylinder12kg && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.cylinder12kg}
                                    </p>
                                )}
                            </div>

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
                                    className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.cylinder25kg ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                />
                                {errors.cylinder25kg && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.cylinder25kg}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-l from-[#0776BD] to-[#51C7E1] hover:shadow-lg'}`}
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        {loading ? 'Updating...' : 'Update Inventory'}
                    </button>
                </form>
            </div>
        </div>
    )
}
