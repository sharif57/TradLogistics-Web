'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaFileUpload } from 'react-icons/fa'

export default function SignInPage() {
  const router = useRouter()

  // Form states
  const [businessName, setBusinessName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [licenseFile, setLicenseFile] = useState<File | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLicenseFile(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log({
      businessName,
      contactPerson,
      phoneNumber,
      address,
      licenseFile,
    })

    router.push('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

          {/* Left Side Illustration */}
          <div className="hidden md:flex items-center justify-center">
            <Image
              src="/0.Splash 1.svg"
              alt="Illustration"
              width={500}
              height={500}
            />
          </div>

          {/* Form Section */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">

              {/* Logo */}
              <div className="text-center mb-8 flex items-center justify-center">
                <Image
                  src="/image/logo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="w-[100px]"
                />
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-4xl font-medium text-[#1E1E1C] text-center mb-8">
                Business Information
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="Full name of business representative"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Business Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Upload File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Business License (Optional)
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
                    />
                    <FaFileUpload className="absolute right-4 text-gray-500" />
                  </div>

                  {licenseFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: <span className="font-medium">{licenseFile.name}</span>
                    </p>
                  )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white font-semibold py-3 rounded-lg transition-all hover:opacity-90 active:scale-95"
                >
                  Continue
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
