'use client'

import { useState } from 'react'
import { ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

// Validation functions
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
}

const validatePassword = (password: string): { isValid: boolean; strength: string } => {
    if (password.length < 8) {
        return { isValid: false, strength: 'Too short (min 8 characters)' }
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, strength: 'Missing uppercase letter' }
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, strength: 'Missing lowercase letter' }
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, strength: 'Missing number' }
    }
    if (!/[!@#$%^&*]/.test(password)) {
        return { isValid: false, strength: 'Missing special character (!@#$%^&*)' }
    }
    return { isValid: true, strength: 'Strong' }
}

const validateDriverLicense = (license: string): boolean => {
    return license.length >= 5 && /^[A-Za-z0-9]+$/.test(license)
}

const validateDriverId = (id: string): boolean => {
    return id.length >= 3 && /^[A-Za-z0-9]+$/.test(id)
}

interface FormErrors {
    [key: string]: string
}

export default function AddTrack() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        driverName: '',
        phoneNumber: '',
        password: '',
        email: '',
        driverId: '',
        drivingLicense: '',
        assignTruck: '',
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [passwordStrength, setPasswordStrength] = useState('')

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

        // Check password strength in real-time
        if (name === 'password') {
            const { strength } = validatePassword(value)
            setPasswordStrength(strength)
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Driver Name validation
        if (!formData.driverName.trim()) {
            newErrors.driverName = 'Driver name is required'
        } else if (formData.driverName.length < 3) {
            newErrors.driverName = 'Driver name must be at least 3 characters'
        }

        // Phone Number validation
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
        } else if (!validatePhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Enter a valid phone number (10+ digits)'
        }

        // Password validation
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required'
        } else {
            const { isValid, strength } = validatePassword(formData.password)
            if (!isValid) {
                newErrors.password = strength
            }
        }

        // Email validation (optional but must be valid if provided)
        if (formData.email.trim() && !validateEmail(formData.email)) {
            newErrors.email = 'Enter a valid email address'
        }

        // Driver ID validation
        if (!formData.driverId.trim()) {
            newErrors.driverId = 'Driver ID is required'
        } else if (!validateDriverId(formData.driverId)) {
            newErrors.driverId = 'Driver ID must be alphanumeric and at least 3 characters'
        }

        // Driving License validation
        if (!formData.drivingLicense.trim()) {
            newErrors.drivingLicense = 'Driving license number is required'
        } else if (!validateDriverLicense(formData.drivingLicense)) {
            newErrors.drivingLicense = 'Invalid driving license format'
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
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        message: 'Driver added successfully!',
                        driverId: formData.driverId
                    })
                }, 2000)
            })

            console.log('Form submitted:', formData)
            setSuccessMessage('Driver added successfully! Redirecting...')

            // Reset form
            setFormData({
                driverName: '',
                phoneNumber: '',
                password: '',
                email: '',
                driverId: '',
                drivingLicense: '',
                assignTruck: '',
            })
            setPasswordStrength('')

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/fleet-drivers')
            }, 2000)

        } catch (error) {
            setErrors({ submit: 'Failed to add driver. Please try again.' })
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
                    <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">Add New Driver</h1>
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

                    {/* Driver Name */}
                    <div>
                        <Label htmlFor="driverName" className='text-[#0F172A] text-lg font-medium mb-2'>Driver Name</Label>
                        <input
                            type="text"
                            id="driverName"
                            name="driverName"
                            value={formData.driverName}
                            onChange={handleInputChange}
                            placeholder="Enter driver name"
                            className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.driverName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.driverName && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.driverName}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <Label htmlFor="phoneNumber" className='text-[#0F172A] text-lg font-medium mb-2'>Phone Number</Label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.phoneNumber}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <Label htmlFor="password" className='text-[#0F172A] text-lg font-medium mb-2'>Create Password for Driver</Label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create password"
                            className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {passwordStrength && !errors.password && (
                            <p className="text-green-600 text-sm mt-1">✓ {passwordStrength}</p>
                        )}
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.password}
                            </p>
                        )}
                        {!errors.password && !passwordStrength && (
                            <p className="text-gray-500 text-xs mt-1">
                                Minimum 8 characters, uppercase, lowercase, number, and special character (!@#$%^&*)
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email" className='text-[#0F172A] text-lg font-medium mb-2'>Email (Optional)</Label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                            className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Driver ID */}
                    <div>
                        <Label htmlFor="driverId" className='text-[#0F172A] text-lg font-medium mb-2'>Driver ID</Label>
                        <input
                            type="text"
                            id="driverId"
                            name="driverId"
                            value={formData.driverId}
                            onChange={handleInputChange}
                            placeholder="Enter driver id"
                            className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.driverId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.driverId && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.driverId}
                            </p>
                        )}
                    </div>

                    {/* Driving License */}
                    <div>
                        <Label htmlFor="drivingLicense" className='text-[#0F172A] text-lg font-medium mb-2'>Driving License Number</Label>
                        <input
                            type="text"
                            id="drivingLicense"
                            name="drivingLicense"
                            value={formData.drivingLicense}
                            onChange={handleInputChange}
                            placeholder="Enter license number"
                            className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.drivingLicense ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {errors.drivingLicense && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.drivingLicense}
                            </p>
                        )}
                    </div>

                    {/* Assign Truck */}
                    <div>
                        <Label htmlFor="assignTruck" className='text-[#0F172A] text-lg font-medium mb-2'>Assign Truck (Optional)</Label>
                        <select
                            id="assignTruck"
                            name="assignTruck"
                            value={formData.assignTruck}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-[#FFFFFF] bg-no-repeat bg-right"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                            }}
                        >
                            <option value="">Select truck (optional)</option>
                            <option value="small">Small Pickup</option>
                            <option value="medium">Medium Truck</option>
                            <option value="large">Large Truck</option>
                        </select>
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
                        {loading ? 'Adding Driver...' : 'Confirm'}
                    </button>
                </form>
            </div>
        </div>
    )
}
