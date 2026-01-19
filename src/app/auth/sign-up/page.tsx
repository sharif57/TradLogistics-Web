'use client'

import { useState } from 'react'
import { Mail, Eye, EyeOff, Paperclip } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Validation
            if (!businessType || !businessName || !contactPerson || !phoneNumber || !businessAddress || !email || !password) {
                alert('Please fill in all required fields');
                return;
            }

            // Store data
            localStorage.setItem('businessType', businessType);
        

            console.log('Sign up with:', {
                businessType,
                businessName,
                contactPerson,
                phoneNumber,
                businessAddress,
                email,
                password,
                businessLicense: businessLicense?.name
            });

            router.push('/');
        } catch (error) {
            console.error('Sign up error:', error);
            alert('An error occurred during sign up. Please try again.');
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

                    <div className="hidden md:flex items-center justify-center">
                        <Image src="/0.Splash 1.svg" alt="Delivery Scooter Illustration" width={500} height={500} ></Image>

                    </div>

                    <div className="w-full max-w-md mx-auto md:mx-0">
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
                                            <SelectItem value="retail">Retail Business</SelectItem>
                                            <SelectItem value="gas">Gas Company</SelectItem>
                                        </SelectContent>
                                    </Select>

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
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                                </div>



                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                                >
                                    Sign Up
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
