/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation } from '@/redux/feature/authSlice';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await forgotPassword({
        email
      }).unwrap();
      console.log('Forgot password response:', response);
      toast.success(response.message || 'OTP sent! Please check your email.');
      router.push(`/auth/forgot-otp?email=${email}`);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send OTP. Please try again.');
      console.error('Forgot password error:', error);
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
                Forgot Password
              </h2>

              {/* Form */}
              <form onSubmit={handleForgot} className="space-y-5">
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



                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>

            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
