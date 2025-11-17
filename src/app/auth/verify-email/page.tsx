'use client'

import { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
    const router = useRouter();
  // State: array of 6 strings (one for each digit)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])

  // Refs: array of HTMLInputElement or null
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const OTP_LENGTH = 6

  // Handle single digit input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const value = e.target.value

    // Allow only single digit (0-9)
    if (!/^[0-9]$/.test(value) && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next field
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle Backspace → go to previous field
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle Paste (full 6-digit code)
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '') // Remove non-digits
      .slice(0, OTP_LENGTH)

    if (pasted.length === 0) return

    const pastedArray = pasted.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH)
    setOtp(pastedArray)

    // Update DOM inputs
    pastedArray.forEach((digit, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit
      }
    })

    // Focus last filled input or last one
    const focusIndex = pasted.length >= OTP_LENGTH ? OTP_LENGTH - 1 : pasted.length - 1
    inputRefs.current[focusIndex]?.focus()
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

          {/* Left Illustration */}
          <div className="hidden md:flex items-center justify-center">
            <Image
              src="/0.Splash 1.svg"
              alt="Delivery Illustration"
              width={500}
              height={500}
              priority
            />
          </div>

          {/* Right Form */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">

              {/* Logo */}
              <div className="mb-10">
                <Image
                  src="/image/logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-medium text-[#1E1E1C] mb-3">
                Verify Your Email
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-10">
                Enter the 6-digit code we sent to your email
              </p>

              {/* 6 OTP Input Boxes */}
              <div className="flex justify-center gap-3 md:gap-4 mb-8">
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                    className="w-12 h-12 md:w-14 md:h-14 text-2xl font-medium text-center border-2 border-gray-300 rounded-xl focus:border-[#51C7E1] focus:outline-none focus:ring-4 focus:ring-[#51C7E1]/20 transition-all duration-200"
                    placeholder="0"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={() => {

                  if (isOtpComplete) {
                    alert(`Verified! OTP: ${otp.join('')}`)
                    router.push('/auth/reset-password')

                  }
                }}
                disabled={!isOtpComplete}
                  className="w-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Verify & Continue
              </button>

           

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}