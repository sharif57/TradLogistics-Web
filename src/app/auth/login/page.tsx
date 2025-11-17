'use client'

import { useState } from 'react'
import { Mail, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sign in with:', { email, password })
    router.push('/auth/business-information')
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
                Sign In
              </h2>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-5">
                {/* Email Input */}
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
                    <Mail className="absolute right-3 top-3.5 text-gray-400" size={20} />
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

                {/* Forgot Password */}
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600 text-sm mt-6">
                {"Don't have an account? "}
                <a href="#" className="text-blue-500 hover:text-blue-700 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
