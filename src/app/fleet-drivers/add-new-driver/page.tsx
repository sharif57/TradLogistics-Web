'use client'

import { useState } from 'react'
import { ArrowLeft, AlertCircle, Eye, EyeOff, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { useRegisterMutation } from '@/redux/feature/authSlice'
import { useCompanyListQuery } from '@/redux/feature/gasCompany/companySlice'
import { toast } from 'sonner'

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

    if (!/[0-9]/.test(password)) {
        return { isValid: false, strength: 'Missing number' }
    }

    return { isValid: true, strength: 'Strong' }
}

const validateDriverLicense = (license: string): boolean => {
    return license.length >= 5 && /^[A-Za-z0-9]+$/.test(license)
}

interface FormErrors {
    [key: string]: string
}

const fieldKeyMap: Record<string, string> = {
    phone: 'phoneNumber',
    first_name: 'driverFirstName',
    last_name: 'driverLastName',
    driving_license_number: 'drivingLicense',
    assign_truck: 'assignTruck',
    email: 'email',
    password: 'password',
}

const normalizeBackendMessage = (message: string): string => {
    if (/phone/i.test(message) && /already exists/i.test(message)) {
        return 'This phone number is already registered.'
    }
    return message
}

export default function AddTrack() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        driverFirstName: '',
        driverLastName: '',
        phoneNumber: '',
        password: '',
        email: '',
        drivingLicense: '',
        assignTruck: '',
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const { data: companyData } = useCompanyListQuery(undefined);
    const trucks = companyData?.data || [];


    const [createDriver] = useRegisterMutation();

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

        // Driver First Name validation
        if (!formData.driverFirstName.trim()) {
            newErrors.driverFirstName = 'Driver first name is required'
        }

        // Driver Last Name validation
        if (!formData.driverLastName.trim()) {
            newErrors.driverLastName = 'Driver last name is required'
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
        setErrors({})

        try {
            const payload = {
                d_type: 'gas',
                first_name: formData.driverFirstName.trim(),
                last_name: formData.driverLastName.trim(),
                email: formData.email.trim(),
                phone: formData.phoneNumber.trim(),
                driving_license_number: formData.drivingLicense.trim(),
                role: 'driver',
                password: formData.password,
                assign_truck: formData.assignTruck || null,
            }

            await createDriver(payload).unwrap()
            toast.success('Driver added successfully! Redirecting...')

            setPasswordStrength('')
            setErrors({})

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/fleet-drivers')
            }, 2000)

        } catch (error: any) {
            const apiData = error?.data
            const message =
                apiData?.message ||
                apiData?.detail ||
                (typeof apiData === 'string' ? apiData : '')

            const backendFieldErrors: FormErrors = {}

            if (apiData && typeof apiData === 'object') {
                Object.entries(apiData).forEach(([key, value]) => {
                    if (key === 'status' || key === 'message' || key === 'detail') return
                    const fieldName = fieldKeyMap[key] || key
                    const valueText = Array.isArray(value) ? String(value[0]) : String(value)
                    backendFieldErrors[fieldName] = normalizeBackendMessage(valueText)
                })
            }

            if (message && /phone/i.test(message) && /already exists/i.test(message)) {
                backendFieldErrors.phoneNumber = 'This phone number is already registered.'
            }

            const submitMessage =
                Object.values(backendFieldErrors)[0] ||
                (message ? normalizeBackendMessage(message) : 'Failed to add driver. Please try again.')

            toast.error(submitMessage)
            setErrors({
                ...backendFieldErrors,
                submit: submitMessage,
            })
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


                {/* Form Content */}
                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-4">

                    {/* Driver Name */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label htmlFor="driverFirstName" className='text-[#0F172A] text-lg font-medium mb-2'>First Name</Label>
                            <input
                                type="text"
                                id="driverFirstName"
                                name="driverFirstName"
                                value={formData.driverFirstName}
                                onChange={handleInputChange}
                                placeholder="Enter driver first name"
                                className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.driverFirstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.driverFirstName && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {errors.driverFirstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="driverLastName" className='text-[#0F172A] text-lg font-medium mb-2'>Last Name</Label>
                            <input
                                type="text"
                                id="driverLastName"
                                name="driverLastName"
                                value={formData.driverLastName}
                                onChange={handleInputChange}
                                placeholder="Enter driver last name"
                                className={`w-full px-4 py-3 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.driverLastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {errors.driverLastName && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {errors.driverLastName}
                                </p>
                            )}
                        </div>
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
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create password"
                                className={`w-full px-4 py-3 pr-12 border bg-[#FFFFFF] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 text-sm sm:text-base ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
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
                            {
                                trucks.map((truck: any) => (
                                    <option key={truck?.public_id} value={truck?.public_id}>{truck?.truck_id} ({truck?.vehicle_type})</option>
                                ))
                            }

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
