'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
    const router = useRouter();
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (!password || !confirmPassword) {
      alert('Please fill in both fields')
      return 
    }
    router.push('/auth/login')
    // Add your password reset logic here
    console.log('Password reset successful!')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 ">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

          {/* Left Side - Illustration (Hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center">
            <Image
              src="/0.Splash 1.svg"
              alt="Delivery Scooter Illustration"
              width={500}
              height={500}
              priority
            />
          </div>

          {/* Right Side - Reset Form */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">

              {/* Logo */}
              <div className="text-center mb-8">
                <Image
                  src="/image/logo.png"
                  alt="Logo"
                  width={500}
                  height={500}
                  className="w-[100px] mx-auto"
                />
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-medium text-[#1E1E1C] text-center mb-10">
                Reset Password
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
               <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                                >
                                    Confirm
                                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}