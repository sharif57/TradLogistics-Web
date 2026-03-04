'use client'

import { useEffect, useState } from 'react'
import { MapPin, Clock, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LocationSearch from '@/components/LocationSearch'
import { useCreateDeliveryOrderMutation } from '@/redux/feature/gasCompany/companySlice'

type DeliverySpeed = 'standard' | 'express' | 'urgent'

interface OrderData {
    pickupAddress: string
    pickupLat: number | null
    pickupLng: number | null
    destination: string
    cylinderSize: string
    brand: string
    transactionType: string
    deliverySpeed: DeliverySpeed
    paymentMethod: 'cash' | 'card'
}

type BackendPayload = {
    service_type: 'cooking_gas'
    pickup_address: string
    pickup_lat: number
    pickup_lng: number
    scheduled_at: null
    payment_method: 'cash' | 'card'
    service_data: {
        gas: {
            cylinder_size: string
            brand: string
            transaction_type: string
            delivery_speed: DeliverySpeed
        }
    }
}

const loadGooglePlacesScript = (apiKey: string) => {
    if (typeof window === 'undefined') return Promise.resolve()
    if ((window as Window & { google?: unknown }).google) return Promise.resolve()

    return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector('script[data-google-places="true"]')
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve())
            existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')))
            return
        }

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.dataset.googlePlaces = 'true'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Google Maps failed to load'))
        document.head.appendChild(script)
    })
}

export default function CreateManualOrder() {
    const router = useRouter()
    const [createDeliveryOrder, { isLoading: isSubmitting }] = useCreateDeliveryOrderMutation()

    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

    const [orderData, setOrderData] = useState<OrderData>({
        pickupAddress: '',
        pickupLat: null,
        pickupLng: null,
        destination: '',
        cylinderSize: '',
        brand: '',
        transactionType: '',
        deliverySpeed: 'express',
        paymentMethod: 'cash',
    })

    const [errors, setErrors] = useState<Partial<OrderData>>({})
    const [submitError, setSubmitError] = useState('')
    const [scriptError, setScriptError] = useState('')

    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setScriptError('Google Maps API key not found. Set NEXT_PUBLIC_GOOGLE_API_KEY.')
            return
        }

        loadGooglePlacesScript(GOOGLE_MAPS_API_KEY).catch((error: Error) => {
            setScriptError(error.message)
        })
    }, [GOOGLE_MAPS_API_KEY])

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

        if (!orderData.pickupAddress.trim() || orderData.pickupLat === null || orderData.pickupLng === null) {
            newErrors.pickupAddress = 'Pickup location is required'
        }
        if (!orderData.cylinderSize) newErrors.cylinderSize = 'Cylinder size is required'
        if (!orderData.brand) newErrors.brand = 'Brand is required'
        if (!orderData.transactionType) newErrors.transactionType = 'Transaction type is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handlePickupLocationSelect = (address: string, lat: number, lng: number) => {
        setOrderData(prev => ({
            ...prev,
            pickupAddress: address,
            pickupLat: lat,
            pickupLng: lng,
        }))

        if (errors.pickupAddress) {
            setErrors(prev => ({
                ...prev,
                pickupAddress: undefined,
            }))
        }
    }

    const handleContinue = async () => {
        if (!validateForm()) return

        if (orderData.pickupLat === null || orderData.pickupLng === null) return

        setSubmitError('')

        const payload: BackendPayload = {
            service_type: 'cooking_gas',
            pickup_address: orderData.pickupAddress,
            pickup_lat: orderData.pickupLat,
            pickup_lng: orderData.pickupLng,
            scheduled_at: null,
            payment_method: orderData.paymentMethod,
            service_data: {
                gas: {
                    cylinder_size: orderData.cylinderSize,
                    brand: orderData.brand,
                    transaction_type: orderData.transactionType,
                    delivery_speed: orderData.deliverySpeed,
                },
            },
        }

        try {
            await createDeliveryOrder(payload).unwrap()
            router.push('/create-manual-order/price-summary')
        } catch (error) {
            const errorMessage =
                (error as { data?: { message?: string } })?.data?.message ||
                'Failed to create manual order. Please try again.'
            setSubmitError(errorMessage)
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
                        <div className="flex flex-col items-center shrink-0">
                            {/* From Location Icon */}
                            <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center bg-white shrink-0 relative z-10">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>

                            {/* Vertical Connector Line */}
                            <div className="w-0.5 bg-blue-500 grow my-2"></div>

                            {/* To Destination Icon */}
                            <div className="w-6 h-6 border-2 border-blue-500 rounded-md flex items-center justify-center bg-white shrink-0 relative z-10"></div>
                        </div>

                        {/* Input Fields */}
                        <div className="flex-1 flex flex-col justify-between min-h-[100px]">
                            {/* From Location */}
                            <div className="flex items-center gap-2 relative z-20">
                                <div className="flex-1">
                                    <LocationSearch
                                        initialValue={orderData.pickupAddress}
                                        initialLat={orderData.pickupLat ?? undefined}
                                        initialLng={orderData.pickupLng ?? undefined}
                                        placeholder="Pickup location"
                                        onLocationSelect={handlePickupLocationSelect}
                                    />
                                </div>
                                <Clock size={18} strokeWidth={1.5} className="text-gray-400" />
                            </div>

                            {/* To Destination */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    disabled
                                    placeholder="cooking_gas"
                                    value={orderData.destination}
                                    onChange={(e) => handleInputChange('destination', e.target.value)}
                                    className="flex-1 text-gray-700 text-sm sm:text-base placeholder-gray-400 focus:outline-none bg-transparent"
                                />
                                <button
                                    type="button"
                                    className="shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Destination options"
                                >
                                    <MapPin size={18} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {errors.pickupAddress && (
                        <p className="text-red-500 text-xs px-5 sm:px-6 pb-1">{errors.pickupAddress}</p>
                    )}
                    {scriptError && (
                        <p className="text-red-500 text-xs px-5 sm:px-6 pb-1">{scriptError}</p>
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
                            <option value="20">20 lb</option>
                            <option value="25">25 lb</option>
                            <option value="30">30 lb</option>
                            <option value="100">100 lb</option>
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
                            <option value="IGL">IGL</option>
                            <option value="GasPro">GasPro</option>
                            <option value="Yaadman">Yaadman</option>
                            <option value="Regency Petroleum">Regency Petroleum</option>
                            <option value="FESGAS">FESGAS</option>
                            <option value="PETCOM">PETCOM</option>
                            <option value="Any Available">Any Available</option>
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
                            <option value="refill">Refill/Exchange</option>
                            <option value="new_cylinder">New Cylinder</option>
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
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-l from-[#0776BD] to-[#51C7E1] active:bg-blue-700 text-white font-semibold py-4 sm:py-3.5 rounded-lg transition-colors duration-200 text-base sm:text-lg"
                >
                    {isSubmitting ? 'Submitting...' : 'Continue'}
                </button>
                {submitError && <p className="text-red-500 text-sm mt-3">{submitError}</p>}
            </div>
        </div>
    )
}
