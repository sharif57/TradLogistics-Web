'use client'

import { useState } from 'react'
import { Eye, EyeOff, Paperclip } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRegisterMutation } from '@/redux/feature/authSlice'
import { toast } from 'sonner'

export default function SignInPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [businessType, setBusinessType] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [businessAddress, setBusinessAddress] = useState('')
    const [businessLicense, setBusinessLicense] = useState<File | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const [register, { isLoading }] = useRegisterMutation();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        try {

            const nextErrors: Record<string, string> = {}
            if (!businessType) nextErrors.businessType = 'Business type is required.'
            if (!businessName) nextErrors.businessName = 'Business name is required.'
            if (!contactPerson) nextErrors.contactPerson = 'Contact person is required.'
            if (!phoneNumber) nextErrors.phoneNumber = 'Phone number is required.'
            if (!businessAddress) nextErrors.businessAddress = 'Business address is required.'
            if (!email) nextErrors.email = 'Email is required.'
            if (!password) nextErrors.password = 'Password is required.'

            if (Object.keys(nextErrors).length > 0) {
                setFieldErrors(nextErrors)
                toast.error('Please fill in all required fields.')
                return
            }

            setFieldErrors({})

            const fromData = new FormData();
            fromData.append('business_type', businessType);
            fromData.append('business_name', businessName);
            fromData.append('first_name', contactPerson);
            fromData.append('phone', phoneNumber);
            fromData.append('role', 'company');
            fromData.append('business_address', businessAddress);
            fromData.append('email', email);
            fromData.append('password', password);

            if (businessLicense) {
                fromData.append('business_license', businessLicense);
            }
            const response = await register(fromData).unwrap();
            toast.success(response.message || 'Registration successful! Please check your email to verify your account.');
            // Store data
            localStorage.setItem('businessType', businessType);
            router.push(`/auth/verify-phone?phone=${encodeURIComponent(phoneNumber)}`);
        } catch (error: any) {
            console.error('Sign up error:', error);
            const apiMessage = error?.data?.message || error?.message
            const phoneExists = typeof apiMessage === 'string' && apiMessage.toLowerCase().includes('phone')
            if (phoneExists) {
                setFieldErrors((prev) => ({
                    ...prev,
                    phoneNumber: 'User with this phone already exists.'
                }))
                toast.error('Phone number already exists.')
            } else {
                toast.error(error?.data?.message || 'Registration failed. Please try again.')
            }
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-8 ">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

                    <div className="hidden md:flex items-center justify-center">
                        <Image src="/0.Splash 1.svg" alt="Delivery Scooter Illustration" width={500} height={500} ></Image>

                    </div>

                    <div className="w-full max-w-md mx-auto md:mx-0 h-full lg:h-[90vh] overflow-y-auto overflow-x-hidden hide-scrollbar">
                        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                            {/* Logo */}
                            <div className="text-center mb-8 flex items-center justify-center">
                                <Image src="/image/logo.png" alt="Logo" width={500} height={500} className="w-[100px]"></Image>
                            </div>

                            {/* Heading */}
                            <h2 className="text-2xl md:text-4xl font-medium text-[#1E1E1C] text-center mb-8">
                                Create Account
                            </h2>

                            {/* Form */}
                            <form onSubmit={handleSignIn} className="space-y-5">
                                {/* Email Input */}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Type
                                    </label>
                                    <Select onValueChange={setBusinessType} >
                                        <SelectTrigger id="businessType" className="w-full px-4 py-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <SelectValue placeholder="Select business type" />
                                        </SelectTrigger>
                                        <SelectContent>

                                            <SelectItem value="ecommerce">Retail Business</SelectItem>
                                            <SelectItem value="gas_company">Gas Company</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldErrors.businessType && (
                                        <p className="text-xs text-red-600 mt-1">{fieldErrors.businessType}</p>
                                    )}

                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="businessName"
                                            type="text"
                                            placeholder="Enter your business name"
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    {fieldErrors.businessName && (
                                        <p className="text-xs text-red-600 mt-1">{fieldErrors.businessName}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Person
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="contactPerson"
                                            type="text"
                                            placeholder="Full name of business representative"
                                            value={contactPerson}
                                            onChange={(e) => setContactPerson(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    {fieldErrors.contactPerson && (
                                        <p className="text-xs text-red-600 mt-1">{fieldErrors.contactPerson}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="phoneNumber"
                                            type="tel"
                                            placeholder="Enter contact number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    {fieldErrors.phoneNumber && (
                                        <p className="text-xs text-red-600 mt-1">{fieldErrors.phoneNumber}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="businessAddress"
                                            type="text"
                                            placeholder="Enter full address"
                                            value={businessAddress}
                                            onChange={(e) => setBusinessAddress(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    {fieldErrors.businessAddress && (
                                        <p className="text-xs text-red-600 mt-1">{fieldErrors.businessAddress}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Business License (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="businessLicense"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <Paperclip className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
                                    </div>
                                    {businessLicense && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Selected: {businessLicense.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    {fieldErrors.email && (
                                        <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
                                    )}
                                </div>
                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
                                    )}
                                </div>



                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <p className="text-center text-gray-600 text-sm mt-6">
                                {"Already have an account? "}
                                <Link href="/auth/login" className="text-blue-500 hover:text-blue-700 font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
} 
