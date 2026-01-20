'use client'

import { useState } from 'react'
import { ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

// Validation functions
const validateTruckId = (id: string): boolean => {
    const truckIdRegex = /^[A-Z]{3}-[A-Z0-9]{3,}$/
    return truckIdRegex.test(id.toUpperCase())
}

const validateInventory = (value: string): boolean => {
    const num = parseInt(value)
    return !isNaN(num) && num >= 0
}

interface FormErrors {
    [key: string]: string
}

interface FormData {
    fromAddress: string
    vehicleType: string
    operatingZone: string
    assignDriver: string
    cylinder12kg: string
    cylinder25kg: string
}

export default function AddInventory() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        fromAddress: '',
        vehicleType: '',
        operatingZone: '',
        assignDriver: '',
        cylinder12kg: '',
        cylinder25kg: '',
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

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

        // Truck ID validation
        if (!formData.fromAddress.trim()) {
            newErrors.fromAddress = 'Truck ID is required'
        } else if (!validateTruckId(formData.fromAddress)) {
            newErrors.fromAddress = 'Invalid truck ID format (use format like: ABC-123)'
        }

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
        setSuccessMessage('')

        try {
            // Simulate API call
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        message: 'Truck added successfully!',
                        truckId: formData.fromAddress
                    })
                }, 2000)
            })

            console.log('Form submitted:', formData)
            setSuccessMessage('Truck added successfully! Redirecting...')

            // Reset form
            setFormData({
                fromAddress: '',
                vehicleType: '',
                operatingZone: '',
                assignDriver: '',
                cylinder12kg: '',
                cylinder25kg: '',
            })

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/fleet-drivers')
            }, 2000)

        } catch (error) {
            setErrors({ submit: 'Failed to add truck. Please try again.' })
            console.error('Error:', error)
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
                    <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">Adjust Inventory</h1>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-3 p-4 bg-green-50 border border-green-300 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {errors.submit && (
                    <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{errors.submit}</p>
                    </div>
                )}

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-4">

                    {/* Truck ID */}
                    <div>
                        <Label htmlFor="fromAddress" className='text-[#0F172A] text-lg font-medium mb-2'>Truck ID</Label>
                        <input
                            type="text"
                            id="fromAddress"
                            name="fromAddress"
                            value={formData.fromAddress}
                            onChange={handleInputChange}
                            placeholder="e.g. TRK-A12"
                            className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.fromAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.fromAddress && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.fromAddress}
                            </p>
                        )}
                    </div>


                 

                    {/* Inventory Section */}
                    <div>
                        <p className='text-[#0F172A] text-lg font-medium mb-4'>Set Inventory</p>
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
                                : 'bg-gradient-to-l from-[#0776BD] to-[#51C7E1] hover:shadow-lg'
                            }`}
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        {loading ? 'Loading...' : 'Done'}
                    </button>
                </form>
            </div>
        </div>
    )
}
