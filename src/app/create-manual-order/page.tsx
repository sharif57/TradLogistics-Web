'use client'

import { useState } from 'react'
import {  MapPin, Clock, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type DeliverySpeed = 'standard' | 'express' | 'urgent'

interface OrderData {
    location: string
    destination: string
    cylinderSize: string
    brand: string
    transactionType: string
    deliverySpeed: DeliverySpeed
}

export default function CreateManualOrder() {

    const router = useRouter();

    const [orderData, setOrderData] = useState<OrderData>({
        location: '9 South Avenue',
        destination: '',
        cylinderSize: '',
        brand: '',
        transactionType: '',
        deliverySpeed: 'express'
    })

    const [errors, setErrors] = useState<Partial<OrderData>>({})

    const handleInputChange = (field: keyof OrderData, value: string) => {
        setOrderData(prev => ({
            ...prev,
            [field]: value
        }))
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<OrderData> = {}

        if (!orderData.destination.trim()) newErrors.destination = 'Destination is required'
        if (!orderData.cylinderSize) newErrors.cylinderSize = 'Cylinder size is required'
        if (!orderData.brand) newErrors.brand = 'Brand is required'
        if (!orderData.transactionType) newErrors.transactionType = 'Transaction type is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleContinue = () => {
        if (validateForm()) {
            console.log('Order data:', orderData)
            alert(`Order created successfully!\n\nLocation: ${orderData.location}\nDestination: ${orderData.destination}\nCylinder Size: ${orderData.cylinderSize}\nBrand: ${orderData.brand}\nTransaction Type: ${orderData.transactionType}\nDelivery Speed: ${orderData.deliverySpeed}`)
        }
    }

   

    return (
        <div className="max-w-4xl px-4 sm:px-6 pt-4 max-h-screen ">
            <div className="     px-4 sm:px-6 pt-4 pb-8 bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden ">
                <div className="border-b py-4 border-gray-200 flex items-center gap-3">
                    <button onClick={router.back} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg sm:text-2xl font-medium text-[#1E1E1C]">Create Manual Order</h1>
                </div>

                {/* Location & Destination */}
                <div className="bg-white rounded-xl border-2 border-blue-500 mb-6 relative">
                    <div className="p-5 sm:p-6 flex gap-4">
                        {/* Icons and Connector Line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            {/* From Location Icon */}
                            <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center bg-white flex-shrink-0 relative z-10">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>

                            {/* Vertical Connector Line */}
                            <div className="w-0.5 bg-blue-500 flex-grow my-2"></div>

                            {/* To Destination Icon */}
                            <div className="w-6 h-6 border-2 border-blue-500 rounded-md flex items-center justify-center bg-white flex-shrink-0 relative z-10"></div>
                        </div>

                        {/* Input Fields */}
                        <div className="flex-1 flex flex-col justify-between min-h-[100px]">
                            {/* From Location */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={orderData.location}
                                    readOnly
                                    className="flex-1 text-gray-900 text-sm sm:text-base font-medium focus:outline-none bg-transparent cursor-default"
                                />
                                <button
                                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Location options"
                                >
                                    <Clock size={18} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* To Destination */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Where to?"
                                    value={orderData.destination}
                                    onChange={(e) => handleInputChange('destination', e.target.value)}
                                    className="flex-1 text-gray-700 text-sm sm:text-base placeholder-gray-400 focus:outline-none bg-transparent"
                                />
                                <button
                                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Destination options"
                                >
                                    <MapPin size={18} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {errors.destination && (
                        <p className="text-red-500 text-xs px-5 sm:px-6 pb-3">{errors.destination}</p>
                    )}
                </div>

                {/* Choose Gas Section */}
                <div className="mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Choose Gas</h2>

                    {/* Cylinder Size Dropdown */}
                    <div className="mb-4">
                        <select
                            value={orderData.cylinderSize}
                            onChange={(e) => handleInputChange('cylinderSize', e.target.value)}
                            className={`w-full px-4 py-3 text-sm sm:text-base bg-gray-50 border-2 rounded-lg focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')] bg-no-repeat bg-right-4 pr-10 ${errors.cylinderSize
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-200 focus:border-blue-500 text-gray-700'
                                }`}
                            style={{
                                backgroundSize: '20px 20px',
                                backgroundPosition: 'right 12px center'
                            }}
                        >
                            <option value="">Selects Cylinder Size</option>
                            <option value="5kg">20 lb</option>
                            <option value="12kg">25 lb</option>
                            <option value="19kg">30 lb</option>
                            <option value="35kg">100 lb</option>
                        </select>
                        {errors.cylinderSize && (
                            <p className="text-red-500 text-xs mt-1">{errors.cylinderSize}</p>
                        )}
                    </div>

                    {/* Brand Dropdown */}
                    <div className="mb-4">
                        <select
                            value={orderData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            className={`w-full px-4 py-3 text-sm sm:text-base bg-gray-50 border-2 rounded-lg focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')] bg-no-repeat bg-right-4 pr-10 ${errors.brand
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-200 focus:border-blue-500 text-gray-700'
                                }`}
                            style={{
                                backgroundSize: '20px 20px',
                                backgroundPosition: 'right 12px center'
                            }}
                        >
                            <option value="">Selects Brand</option>
                            <option value="bharat">IGL</option>
                            <option value="indane">GasPro</option>
                            <option value="hp">Yaadman</option>
                            <option value="igl">Regency Petroleum</option>
                            <option value="igl">FESGAS</option>
                            <option value="igl">PETCOM</option>
                            <option value="igl">Any Available</option>
                        </select>
                        {errors.brand && (
                            <p className="text-red-500 text-xs mt-1">{errors.brand}</p>
                        )}
                    </div>

                    {/* Transaction Type Dropdown */}
                    <div>
                        <select
                            value={orderData.transactionType}
                            onChange={(e) => handleInputChange('transactionType', e.target.value)}
                            className={`w-full px-4 py-3 text-sm sm:text-base bg-gray-50 border-2 rounded-lg focus:outline-none transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')] bg-no-repeat bg-right-4 pr-10 ${errors.transactionType
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-200 focus:border-blue-500 text-gray-700'
                                }`}
                            style={{
                                backgroundSize: '20px 20px',
                                backgroundPosition: 'right 12px center'
                            }}
                        >
                            <option value="">Transaction Type</option>
                            <option value="cash">Refill/Exchange</option>
                            <option value="card">New Cylinder</option>
                        </select>
                        {errors.transactionType && (
                            <p className="text-red-500 text-xs mt-1">{errors.transactionType}</p>
                        )}
                    </div>
                </div>

                {/* Delivery Speed Section */}
                <div className="mb-8">
                    <h2 className="text-base sm:text-lg font-medium text-[#0F172A] mb-4">Delivery Speed</h2>

                    {/* Standard */}
                    <div className="mb-4">
                        <label className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                            <input
                                type="radio"
                                name="delivery"
                                value="standard"
                                checked={orderData.deliverySpeed === 'standard'}
                                onChange={(e) => handleInputChange('deliverySpeed', e.target.value as DeliverySpeed)}
                                className="mt-1.5 w-5 h-5 cursor-pointer accent-blue-500"
                            />
                            <div className="flex-1">
                                <p className="text-sm sm:text-base font-semibold text-gray-900">Standard</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Affordable & reliable</p>
                            </div>
                        </label>
                    </div>

                    {/* Express */}
                    <div className="mb-4">
                        <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${orderData.deliverySpeed === 'express'
                                ? 'bg-blue-50 border-blue-500'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="delivery"
                                value="express"
                                checked={orderData.deliverySpeed === 'express'}
                                onChange={(e) => handleInputChange('deliverySpeed', e.target.value as DeliverySpeed)}
                                className="mt-1.5 w-5 h-5 cursor-pointer accent-blue-500"
                            />
                            <div className="flex-1">
                                <p className="text-sm sm:text-base font-semibold text-gray-900">Express</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Faster delivery</p>
                            </div>
                        </label>
                    </div>

                    {/* Urgent */}
                    <div>
                        <label className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                            <input
                                type="radio"
                                name="delivery"
                                value="urgent"
                                checked={orderData.deliverySpeed === 'urgent'}
                                onChange={(e) => handleInputChange('deliverySpeed', e.target.value as DeliverySpeed)}
                                className="mt-1.5 w-5 h-5 cursor-pointer accent-blue-500"
                            />
                            <div className="flex-1">
                                <p className="text-sm sm:text-base font-semibold text-gray-900">Urgent</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Highest priority dispatch</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-l from-[#0776BD] to-[#51C7E1] active:bg-blue-700 text-white font-semibold py-4 sm:py-3.5 rounded-lg transition-colors duration-200 text-base sm:text-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}
