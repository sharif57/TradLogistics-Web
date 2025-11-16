'use client'

import { use, useState } from 'react'
import { ChevronLeft, MapPin, Calendar, Clock, Truck, AlertCircle, ArrowLeft } from 'lucide-react'
import VehicleSelector from '@/components/home/vehicle-selector'
import PaymentSelector from '@/components/home/payment-selector'
import { useRouter } from 'next/navigation'


export default function DeliveryForm() {
    const router= useRouter();
  const [formData, setFormData] = useState({
    fromAddress: '8 South Avenue',
    toAddress: '',
    vehicleType: 'car',
    weight: '',
    specialInstructions: '',
    packageDescription: '',
    sensitivityLevel: '',
    requestDriver: '',
    fragileItem: false,
    date: 'today',
    time: 'new',
    paymentMethod: 'lynk',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({
      ...prev,
      [name]: inputValue,
    }))
  }

  const handleVehicleChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleType: type,
    }))
  }

  const handlePaymentChange = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="max-w-4xl    px-4 sm:px-6 pt-4">
      <div className="bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <button onClick={router.back} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Delivery</h1>
        </div>

        

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-6">
          {/* Address Inputs */}
          <div className="space-y-3">
            {/* From Address */}
            <div className="relative">
              <div className="flex items-center gap-3 border-2 border-blue-400 rounded-lg px-3 py-3 bg-blue-50">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <input
                  type="text"
                  name="fromAddress"
                  value={formData.fromAddress}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent outline-none text-gray-900 text-sm sm:text-base"
                  placeholder="From address"
                />
              </div>
            </div>

            {/* To Address */}
            <div className="relative">
              <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg px-3 py-3 bg-white hover:border-gray-400 transition-colors">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  name="toAddress"
                  value={formData.toAddress}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                  placeholder="Destination"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Choose Vehicle Type</label>
            <VehicleSelector selectedType={formData.vehicleType} onTypeChange={handleVehicleChange} />
          </div>

          {/* Weight Input */}
          <div>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Weight (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              placeholder="Special instructions"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base resize-none"
              rows={3}
            />
          </div>

          {/* Package Description */}
          <div>
            <input
              type="text"
              name="packageDescription"
              value={formData.packageDescription}
              onChange={handleInputChange}
              placeholder="Packages description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          {/* Sensitivity Level */}
          <div>
            <select
              name="sensitivityLevel"
              value={formData.sensitivityLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-white bg-no-repeat bg-right"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="">Select sensitivity level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Request Driver */}
          <div>
            <select
              name="requestDriver"
              value={formData.requestDriver}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-white bg-no-repeat bg-right"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="">Request Driver (Optional)</option>
              <option value="john">John</option>
              <option value="jane">Jane</option>
              <option value="mike">Mike</option>
            </select>
          </div>

          {/* Fragile Item Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="fragileItem"
              id="fragileItem"
              checked={formData.fragileItem}
              onChange={handleInputChange}
              className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="fragileItem" className="text-sm sm:text-base text-gray-700 cursor-pointer">
              Fragile item
            </label>
          </div>

          {/* Date Selector */}
          <div>
            <select
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-white bg-no-repeat bg-right"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="next-week">Next Week</option>
            </select>
          </div>

          {/* Time Selector */}
          <div>
            <select
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-white bg-no-repeat bg-right"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="new">Now</option>
              <option value="morning">Morning (6AM-12PM)</option>
              <option value="afternoon">Afternoon (12PM-6PM)</option>
              <option value="evening">Evening (6PM-9PM)</option>
            </select>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Select Payment method</label>
            <PaymentSelector selectedMethod={formData.paymentMethod} onMethodChange={handlePaymentChange} />
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-l from-[#0776BD] to-[#51C7E1] text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  )
}
