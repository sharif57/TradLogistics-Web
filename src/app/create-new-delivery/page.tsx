'use client'

import { useState, useEffect } from 'react'
import { MapPin, ArrowLeft, Flame } from 'lucide-react'
import VehicleSelector from '@/components/home/vehicle-selector'
import PaymentSelector from '@/components/home/payment-selector'
import LocationSearch from '@/components/LocationSearch'
import { useRouter } from 'next/navigation'
import { useCreateDeliveryMutation, useSearchDriverAndAssignMutation } from '@/redux/feature/deliverySlice'
import { toast } from 'sonner'
import Truck from '@/components/icon/Truck'
import Gas from '@/components/icon/gas'
import Men from '@/components/icon/men'

type ServiceType = 'pickup_delivery' | 'cooking_gas' | 'removal_truck'

interface FormDataType {
  // Common fields
  service_type: ServiceType;
  pickup_address: string;
  pickup_lat: number | '';
  pickup_lng: number | '';
  payment_method: string;
  scheduled_at: string | null;

  // Pickup Delivery fields
  dropoff_address?: string;
  dropoff_lat?: number | '';
  dropoff_lng?: number | '';
  weight?: string;
  description?: string;
  special_instruction?: string;
  sensitivity_level?: string;
  fragile?: boolean;
  vehicle_type?: string;
  request_driver?: string;

  // Cooking Gas fields
  service_data?: {
    gas?: {
      cylinder_size?: string;
      brand?: string;
      transaction_type?: string;
      delivery_speed?: string;
    };
  };
}

export default function DeliveryForm() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<ServiceType>('pickup_delivery');
  const [formData, setFormData] = useState<FormDataType>({
    service_type: 'pickup_delivery',
    pickup_address: '9 South Avenue, Kingston',
    pickup_lat: 18.0123,
    pickup_lng: -76.8055,
    payment_method: 'cash',
    scheduled_at: null,
    // Pickup Delivery defaults
    dropoff_address: '',
    dropoff_lat: '',
    dropoff_lng: 0,
    weight: '',
    description: '',
    special_instruction: '',
    sensitivity_level: '',
    fragile: false,
    vehicle_type: 'car',
    request_driver: '',
    // Cooking Gas defaults
    service_data: {
      gas: {
        cylinder_size: '20',
        brand: '',
        transaction_type: 'refill',
        delivery_speed: 'standard',
      },
    },
  })

  const [createDelivery, { isLoading }] = useCreateDeliveryMutation();
  const [searchDriverAndAssign] = useSearchDriverAndAssignMutation();
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  // Load Google Maps API Script
  useEffect(() => {
    if (!googleApiKey) {
      console.error('Google API key not configured');
      return;
    }

    // Check if Google Maps API is already loaded
    if ((window as any).google?.maps) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places,geocoding`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    document.head.appendChild(script);

    return () => {
      // Note: We don't remove the script as it may be used by other components
    };
  }, [googleApiKey]);

  // Handle service type change
  const handleServiceTypeChange = (type: ServiceType) => {
    setServiceType(type);
    setFormData(prev => ({
      ...prev,
      service_type: type,
    }))
  }

  // Handle pickup location selection from Google Places
  const handlePickupLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      pickup_address: address,
      pickup_lat: lat,
      pickup_lng: lng,
    }))
    console.log('Pickup Location Selected:', { address, lat, lng });
  }


  // Handle dropoff location selection from Google Places
  const handleDropoffLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      dropoff_address: address,
      dropoff_lat: lat,
      dropoff_lng: lng,
    }))
    console.log('Dropoff Location Selected:', { address, lat, lng });
  }

  // Handle input change for common fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData(prev => ({
      ...prev,
      [name]: inputValue,
    }))
  }

  // Handle lat/lng inputs
  const handleCoordinateChange = (field: 'pickup_lat' | 'pickup_lng' | 'dropoff_lat' | 'dropoff_lng', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : parseFloat(value),
    }))
  }

  // Handle gas service data
  const handleGasDataChange = (field: 'cylinder_size' | 'brand' | 'transaction_type' | 'delivery_speed', value: string) => {
    setFormData(prev => ({
      ...prev,
      service_data: {
        gas: {
          ...(prev.service_data?.gas || {}),
          [field]: value,
        } as any,
      },
    }))
  }

  // Handle vehicle change
  const handleVehicleChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_type: type,
    }))
  }

  // Handle payment change
  const handlePaymentChange = (method: string) => {
    setFormData(prev => ({
      ...prev,
      payment_method: method,
    }))
  }

  // Handle scheduled date/time
  const handleScheduleChange = (dateString: string, timeString?: string) => {
    if (!dateString) {
      setFormData(prev => ({
        ...prev,
        scheduled_at: null,
      }))
      return;
    }

    const time = timeString || '12:00';
    const isoString = `${dateString}T${time}:00Z`;
    setFormData(prev => ({
      ...prev,
      scheduled_at: isoString,
    }))
  }

  // Format data based on service type
  const formatSubmitData = () => {
    const baseData = {
      service_type: formData.service_type,
      pickup_address: formData.pickup_address,
      pickup_lat: formData.pickup_lat,
      pickup_lng: formData.pickup_lng,
      payment_method: formData.payment_method,
      // scheduled_at: formData.scheduled_at,
    };

    if (formData.service_type === 'pickup_delivery') {
      return {
        ...baseData,
        vehicle_type: formData.vehicle_type,
        dropoff_address: formData.dropoff_address,
        dropoff_lat: formData.dropoff_lat,
        dropoff_lng: formData.dropoff_lng,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        description: formData.description,
        special_instruction: formData.special_instruction,
        sensitivity_level: formData.sensitivity_level,
        fragile: formData.fragile,
      };
    } else if (formData.service_type === 'cooking_gas') {
      return {
        ...baseData,
        service_data: formData.service_data,
      };
    } else if (formData.service_type === 'removal_truck') {
      return {
        ...baseData,
        dropoff_address: formData.dropoff_address,
        dropoff_lat: formData.dropoff_lat,
        dropoff_lng: formData.dropoff_lng,
      };
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // console.log('Form submitted:', submittedData)
    // console.log('Full form data:', JSON.stringify(submittedData, null, 2))
    // Dispatch to API
    try {
      const submittedData = formatSubmitData();
      const result = await createDelivery(submittedData).unwrap();
      toast.success(result.message || 'Delivery created successfully!');
      console.log('Delivery created:', result);
      if (result?.data?.id){
        await searchDriverAndAssign({ deliveryId: result.data.id, }).unwrap();
        router.push(`/create-new-delivery/find-rider?deliveryId=${result?.data?.id}`);
      }
    } catch (error: any) {
      toast.error(error.data?.detail || 'Failed to create delivery. Please try again.');
      console.error('Error creating delivery:', error);
    }
  }

  return (
    <div className="max-w-4xl px-4 sm:px-6 pt-4">
      <div className="bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <button onClick={router.back} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Service Request</h1>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-4">
          {/* Service Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Select Service Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleServiceTypeChange('pickup_delivery')}
                className={`flex flex-col items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all duration-200 border-2 ${serviceType === 'pickup_delivery'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                {/* < */}
                <div className={`w-6 h-6 ${serviceType === 'pickup_delivery' ? 'text-blue-600' : 'text-gray-600'}`}>
                  <Men />
                </div>
                <span className={`text-xs sm:text-sm font-medium text-center ${serviceType === 'pickup_delivery' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                  Pickup Delivery
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleServiceTypeChange('cooking_gas')}
                className={`flex flex-col items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all duration-200 border-2 ${serviceType === 'cooking_gas'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className={`w-6 h-6 ${serviceType === 'cooking_gas' ? 'text-blue-600' : 'text-gray-600'}`}>
                  <Gas />
                </div>
                <span className={`text-xs sm:text-sm font-medium text-center ${serviceType === 'cooking_gas' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                  Cooking Gas
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleServiceTypeChange('removal_truck')}
                className={`flex flex-col items-center justify-center gap-2 py-4 px-6 rounded-xl transition-all duration-200 border-2 ${serviceType === 'removal_truck'
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className={`w-6 h-6 ${serviceType === 'removal_truck' ? 'text-blue-600' : 'text-gray-600'}`}>
                  <Truck />
                </div>
                <span className={`text-xs sm:text-sm font-medium text-center ${serviceType === 'removal_truck' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
                  Removal Truck
                </span>
              </button>


            </div>
          </div>

          {/* Common Fields */}
          {/* Pickup Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Pickup Location</label>
            <LocationSearch
              onLocationSelect={handlePickupLocationSelect}
              placeholder="Search pickup address..."
              initialValue={formData.pickup_address}
              initialLat={formData.pickup_lat as number}
              initialLng={formData.pickup_lng as number}
            />
            {/* Display selected coordinates */}
            {formData.pickup_lat && formData.pickup_lng && (
              <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                📍 Lat: {Number(formData.pickup_lat).toFixed(4)}, Lng: {Number(formData.pickup_lng).toFixed(4)}
              </div>
            )}
          </div>
          {/* Conditional fields based on service type */}
          {(serviceType === 'pickup_delivery' || serviceType === 'removal_truck') && (
            <>
              {/* Dropoff Address */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {serviceType === 'pickup_delivery' ? 'Delivery Location' : 'Dropoff Location'}
                </label>
                <LocationSearch
                  onLocationSelect={handleDropoffLocationSelect}
                  placeholder="Search destination address..."
                  initialValue={formData.dropoff_address || ''}
                  initialLat={formData.dropoff_lat as number}
                  initialLng={formData.dropoff_lng as number}
                />
                {/* Display selected coordinates */}
                {formData.dropoff_lat && formData.dropoff_lng && (
                  <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    📍 Lat: {Number(formData.dropoff_lat).toFixed(4)}, Lng: {Number(formData.dropoff_lng).toFixed(4)}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Pickup Delivery Specific Fields */}
          {serviceType === 'pickup_delivery' && (
            <>
              {/* Vehicle Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Choose Vehicle Type</label>
                <VehicleSelector selectedType={formData.vehicle_type || 'car'} onTypeChange={handleVehicleChange} />
              </div>

              {/* Weight Input */}
              <div>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                  placeholder="Weight (kg) - Optional"
                  className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Package Description */}
              <div>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Package description"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <input
                  name="special_instruction"
                  value={formData.special_instruction || ''}
                  onChange={handleInputChange}
                  placeholder="Special instructions (e.g., Call on arrival)"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Sensitivity Level */}
              <div>
                <select
                  name="sensitivity_level"
                  value={formData.sensitivity_level || ''}
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
                  name="request_driver"
                  value={formData.request_driver || ''}
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
                  name="fragile"
                  id="fragile"
                  checked={formData.fragile || false}
                  onChange={handleInputChange}
                  className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="fragile" className="text-sm sm:text-base text-gray-700 cursor-pointer">
                  This is a fragile item
                </label>
              </div>
            </>
          )}

          {/* Cooking Gas Specific Fields */}
          {serviceType === 'cooking_gas' && (
            <>
              {/* Cylinder Size */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Cylinder Size</label>
                <select
                  value={formData.service_data?.gas?.cylinder_size || '20'}
                  onChange={(e) => handleGasDataChange('cylinder_size', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-white bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="10">10 kg</option>
                  <option value="20">20 kg</option>
                  <option value="30">30 kg</option>
                  <option value="50">50 kg</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <input
                  type="text"
                  value={formData.service_data?.gas?.brand || ''}
                  onChange={(e) => handleGasDataChange('brand', e.target.value)}
                  placeholder="Gas Brand (e.g., GasPro)"
                  className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Transaction Type</label>
                <select
                  value={formData.service_data?.gas?.transaction_type || 'refill'}
                  onChange={(e) => handleGasDataChange('transaction_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-white bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="refill">Refill</option>
                  <option value="new">New</option>
                  <option value="exchange">Exchange</option>
                </select>
              </div>

              {/* Delivery Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Delivery Speed</label>
                <select
                  value={formData.service_data?.gas?.delivery_speed || 'standard'}
                  onChange={(e) => handleGasDataChange('delivery_speed', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 text-sm sm:text-base appearance-none bg-white bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                </select>
              </div>
            </>
          )}

          {/* Schedule Date/Time (optional for all) */}
          <div className="bg-white p-4 rounded-lg border border-gray-300">
            <label className="block text-sm font-medium text-gray-900 mb-3">Schedule Delivery (Optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                onChange={(e) => handleScheduleChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
              />
              <input
                type="time"
                onChange={(e) => {
                  const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                  if (dateInput) {
                    handleScheduleChange(dateInput.value, e.target.value);
                  }
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base"
              />
            </div>
          </div>



          {/* Payment Method Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Select Payment Method</label>
            <PaymentSelector selectedMethod={formData.payment_method} onMethodChange={handlePaymentChange} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-l from-[#0776BD] to-[#51C7E1] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#056199] hover:to-[#4ab5cf] transition-colors text-sm sm:text-base"
          >
            {isLoading ? 'Creating...' : 'Create Service Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
