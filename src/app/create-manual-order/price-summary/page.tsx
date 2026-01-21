'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Case from '@/components/icon/payment/case'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'cash' | 'stripe' | 'lynk' | 'jnmoney'

interface PriceData {
  cylinderCost: number
  deliveryFee: number
  speedFee: number
  totalAmount: number
}

const paymentMethods = [
  {
    id: 'cash',
    name: 'Cash',
    icon: null,
    bgColor: 'bg-green-50',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '/image/image 4.svg',
    bgColor: 'bg-purple-50',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'lynk',
    name: 'Lynk',
    icon: '/image/image 2.svg',
    bgColor: 'bg-emerald-50',
    badgeColor: 'bg-emerald-500'
  },
  {
    id: 'jnmoney',
    name: 'JN Money',
    icon: '/image/Frame 2147227121.svg',
    bgColor: 'bg-yellow-50',
    badgeColor: 'bg-yellow-600'
  }
]

export default function PriceSummary() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash')
  const [isLoading, setIsLoading] = useState(false)

  const priceData: PriceData = {
    cylinderCost: 2500,
    deliveryFee: 500,
    speedFee: 300,
    totalAmount: 3300
  }

  const handleConfirmOrder = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert(`Order confirmed with ${selectedPayment} payment method!`)
      router.push('/create-manual-order/price-summary/nearby-driver');
      console.log('[v0] Order confirmed:', { selectedPayment, totalAmount: priceData.totalAmount })
    } catch (error) {
      console.error('[v0] Error confirming order:', error)
      alert('Error confirming order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen  py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl ">
        {/* Container */}
        <div className="bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className=" px-5 sm:px-6 py-4 flex items-center gap-3 border-b border-gray-200">
            <div
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={24} className="text-[#1F2937]" strokeWidth={2} />
            </div>
            <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">Price Summary</h1>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* Price Breakdown */}
            <div className="space-y-4">
              {/* Cylinder Cost */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-[#1F2937] text-sm sm:text-lg font-medium">Cylinder Cost</span>
                <span className="text-gray-900 text-sm sm:text-lg font-semibold">{priceData.cylinderCost.toLocaleString()}</span>
              </div>

              {/* Delivery Fee */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-[#1F2937] text-sm sm:text-lg font-medium">Delivery Fee</span>
                <span className="text-gray-900 text-sm sm:text-lg font-semibold">{priceData.deliveryFee.toLocaleString()}</span>
              </div>

              {/* Speed Fee */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-[#1F2937] text-sm sm:text-lg font-medium">Speed Fee</span>
                <span className="text-gray-900 text-sm sm:text-lg font-semibold">{priceData.speedFee.toLocaleString()}</span>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[#1F2937] text-lg sm:text-lg font-medium">Total Amount</span>
                <span className="text-[#1F2937] text-lg sm:text-xl font-semibold">{priceData.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <h2 className="text-[#1F2937] text-lg sm:text-lg font-medium">Select Payment method</h2>

              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    {/* Icon Badge */}
                    {method.id === 'cash' && <Case />}
                    {method.icon && (
                      <Image
                        src={method.icon}
                        alt={method.name}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    )}

                    {/* Method Name */}
                    <span className="text-gray-900 text-sm sm:text-lg font-medium">{method.name}</span>

                    {/* Radio Button */}
                    <div className="ml-auto flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300">
                      {selectedPayment === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2">
            <button
              onClick={handleConfirmOrder}
              disabled={isLoading}
              className="w-full bg-gradient-to-l from-[#0776BD] to-[#51C7E1] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-lg sm:text-lg"
            >
              {isLoading ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
