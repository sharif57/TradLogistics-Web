
// 'use client'
// import { useEffect, useState } from 'react'
// import { ArrowLeft, AlertCircle, Loader } from 'lucide-react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Label } from '@/components/ui/label'
// import { useUpdateInventoryMutation } from '@/redux/feature/gasCompany/InventorySlice'
// import { useCompanyTrucksQuery } from '@/redux/feature/gasCompany/companySlice'
// import { toast } from 'sonner'

// const validateInventory = (value: string): boolean => {
//     const num = parseInt(value)
//     return !isNaN(num) && num >= 0
// }

// interface FormErrors {
//     [key: string]: string
// }

// interface FormData {
//     truckPublicId: string
//     vehicleType: string
//     operatingZone: string
//     assignDriver: string
//     cylinder12kg: string
//     cylinder25kg: string
//     cylinder12kg_price: string
//     cylinder25kg_price: string

// }

// interface TruckItem {
//     id: number
//     public_id: string
//     truck_id: string
//     vehicle_type: string
//     operating_zone: number
//     operating_zone_name: string
//     driver: number | null
//     driver_name: string | null
//     cylinder_12kg: number
//     cylinder_25kg: number
//     cylinder_12kg_price?: number
//     cylinder_25kg_price?: number
//     cylinder12kg_brand?: string
//     cylinder25kg_brand?: string
// }

// interface TruckApiResponse {
//     data?: TruckItem[]
// }

// const BRANDS = [
//     { value: 'igl', label: 'IGL' },
//     { value: 'gaspro', label: 'GasPro' },
//     { value: 'yaadman', label: 'Yaadman' },
//     { value: 'regency_petroleum', label: 'Regency Petroleum' },
//     { value: 'fesgas', label: 'FESGAS' },
//     { value: 'petcom', label: 'PETCOM' },
//     { value: 'any_available', label: 'Any Available' },
// ];

// export default function AddInventory() {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const preselectedTruckId = searchParams.get('truckId')

//     const [formData, setFormData] = useState<FormData>({
//         truckPublicId: '',
//         vehicleType: '',
//         operatingZone: '',
//         assignDriver: '',
//         cylinder12kg: '',
//         cylinder25kg: '',
//         cylinder12kg_price: '',
//         cylinder25kg_price: '',
//     })

//     const { data: companyData } = useCompanyTrucksQuery(undefined)
//     console.log(companyData,'=============')
//     const [updateInventory] = useUpdateInventoryMutation()

//     const trucks = ((companyData as TruckApiResponse | undefined)?.data) || []

//     const [errors, setErrors] = useState<FormErrors>({})
//     const [loading, setLoading] = useState(false)

//     // Pre-fill form when truck is selected via URL or data loads
//     useEffect(() => {
//         if (!trucks.length) return

//         const matchedTruck = preselectedTruckId
//             ? trucks.find((truck) =>
//                 truck.truck_id === preselectedTruckId || truck.public_id === preselectedTruckId
//             )
//             : null

//         if (matchedTruck) {
//             setFormData({
//                 truckPublicId: matchedTruck.public_id,
//                 vehicleType: matchedTruck.vehicle_type || '',
//                 operatingZone: matchedTruck.operating_zone_name || '',
//                 assignDriver: matchedTruck.driver_name || '',
//                 cylinder12kg: String(matchedTruck.cylinder_12kg ?? 0),
//                 cylinder25kg: String(matchedTruck.cylinder_25kg ?? 0),
//                 cylinder12kg_price: String(matchedTruck.cylinder_12kg_price ?? 0),
//                 cylinder25kg_price: String(matchedTruck.cylinder_25kg_price ?? 0),
//                 cylinder12kg_brand: matchedTruck.cylinder12kg_brand,
//                 cylinder25kg_brand: matchedTruck.cylinder25kg_brand,
//             })
//         }
//     }, [trucks, preselectedTruckId])

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target

//         if (name === 'truckPublicId') {
//             const selectedTruck = trucks.find((truck) => truck.public_id === value)

//             setFormData((prev) => ({
//                 ...prev,
//                 truckPublicId: value,
//                 vehicleType: selectedTruck?.vehicle_type || '',
//                 operatingZone: selectedTruck?.operating_zone_name || '',
//                 assignDriver: selectedTruck?.driver_name || '',
//                 cylinder12kg: selectedTruck ? String(selectedTruck.cylinder_12kg) : prev.cylinder12kg,
//                 cylinder25kg: selectedTruck ? String(selectedTruck.cylinder_25kg) : prev.cylinder25kg,
//                 cylinder12kg_price: selectedTruck ? String(selectedTruck.cylinder_12kg_price ?? 0) : prev.cylinder12kg_price,
//                 cylinder25kg_price: selectedTruck ? String(selectedTruck.cylinder_25kg_price ?? 0) : prev.cylinder25kg_price,
//             }))

//             if (errors.truckPublicId) {
//                 setErrors((prev) => {
//                     const next = { ...prev }
//                     delete next.truckPublicId
//                     return next
//                 })
//             }
//             return
//         }

//         setFormData((prev) => ({ ...prev, [name]: value }))

//         // Clear error on input
//         if (errors[name]) {
//             setErrors((prev) => {
//                 const newErrors = { ...prev }
//                 delete newErrors[name]
//                 return newErrors
//             })
//         }
//     }

//     const validateForm = (): boolean => {
//         const newErrors: FormErrors = {}

//         if (!formData.truckPublicId.trim()) {
//             newErrors.truckPublicId = 'Truck selection is required'
//         }
//         if (!formData.cylinder12kg.trim()) {
//             newErrors.cylinder12kg = 'Please enter a value'
//         } else if (!validateInventory(formData.cylinder12kg) || parseInt(formData.cylinder12kg) > 999) {
//             newErrors.cylinder12kg = 'Enter a valid number between 0 and 999'
//         }

//         if (!formData.cylinder25kg.trim()) {
//             newErrors.cylinder25kg = 'Please enter a value'
//         } else if (!validateInventory(formData.cylinder25kg) || parseInt(formData.cylinder25kg) > 999) {
//             newErrors.cylinder25kg = 'Enter a valid number between 0 and 999'
//         }

//         setErrors(newErrors)
//         return Object.keys(newErrors).length === 0
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!validateForm()) return

//         setLoading(true)
//         setErrors({})

//         try {
//             const payload = {
//                 mode: "add",
//                 cylinder_12kg: Number(formData.cylinder12kg),
//                 cylinder_25kg: Number(formData.cylinder25kg),
//                 // Only send prices if you want to update them as well
//                 cylinder_12kg_price: formData.cylinder12kg_price ? Number(formData.cylinder12kg_price) : undefined,
//                 cylinder_25kg_price: formData.cylinder25kg_price ? Number(formData.cylinder25kg_price) : undefined,
//             }

//             const response = await updateInventory({
//                 truckId: formData.truckPublicId,
//                 data: payload,
//             }).unwrap()

//             toast.success(response.message || 'Inventory updated successfully!')

//             // Update local state with new values
//             setFormData((prev) => ({
//                 ...prev,
//                 cylinder12kg: String(payload.cylinder_12kg),
//                 cylinder25kg: String(payload.cylinder_25kg),
//                 cylinder12kg_price: payload.cylinder_12kg_price !== undefined
//                     ? String(payload.cylinder_12kg_price)
//                     : prev.cylinder12kg_price,
//                 cylinder25kg_price: payload.cylinder_25kg_price !== undefined
//                     ? String(payload.cylinder_25kg_price)
//                     : prev.cylinder25kg_price,
//             }))

//             setTimeout(() => router.push('/inventory'), 1200)
//         } catch (error: any) {
//             const message = error?.data?.message || error?.data?.detail || 'Failed to update inventory'
//             setErrors({ submit: message })
//             toast.error(message)
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className="max-w-4xl px-4 sm:px-6 pt-4">
//             <div className="bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
//                 <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
//                     <button onClick={router.back} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                         <ArrowLeft className="w-5 h-5 text-gray-700" />
//                     </button>
//                     <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">Adjust Inventory</h1>
//                 </div>

//                 {errors.submit && (
//                     <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
//                         <AlertCircle className="w-5 h-5 text-red-600" />
//                         <p className="text-red-800">{errors.submit}</p>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-6">
//                     {/* Truck Selector */}
//                     <div>
//                         <Label htmlFor="truckPublicId" className="text-[#0F172A] text-lg font-medium mb-2">
//                             Truck Selector
//                         </Label>
//                         <select
//                             id="truckPublicId"
//                             name="truckPublicId"
//                             value={formData.truckPublicId}
//                             onChange={handleInputChange}
//                             className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base appearance-none bg-white ${errors.truckPublicId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                                 }`}
//                             style={{
//                                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
//                                 backgroundPosition: 'right 12px center',
//                                 backgroundRepeat: 'no-repeat',
//                                 paddingRight: '36px',
//                                 color: formData.truckPublicId ? '#666' : '#999',
//                             }}
//                         >
//                             <option value="">Select truck</option>
//                             {trucks.map((truck) => (
//                                 <option key={truck.public_id} value={truck.public_id}>
//                                     {truck.truck_id} - {truck.operating_zone_name}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.truckPublicId && (
//                             <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                 <AlertCircle className="w-4 h-4" /> {errors.truckPublicId}
//                             </p>
//                         )}
//                     </div>

//                     {/* ==================== SET INVENTORY SECTION ==================== */}
//                     <div>
//                         <p className="text-[#0F172A] text-lg font-medium mb-4">Set Inventory</p>

//                         <div className="space-y-6">
//                             {/* 12kg Cylinder Group */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <Label htmlFor="cylinder12kg" className="text-[#0F172A] text-lg font-medium mb-2">
//                                         12 kg Cylinder
//                                     </Label>
//                                     <input
//                                         type="number"
//                                         id="cylinder12kg"
//                                         name="cylinder12kg"
//                                         value={formData.cylinder12kg}
//                                         onChange={handleInputChange}
//                                         placeholder="0"
//                                         min="0"
//                                         max="999"
//                                         className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${errors.cylinder12kg ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                                             }`}
//                                     />
//                                     {errors.cylinder12kg && (
//                                         <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                             <AlertCircle className="w-4 h-4" /> {errors.cylinder12kg}
//                                         </p>
//                                     )}
//                                 </div>
//                                 {/* Brand field kept but not required */}
//                                 <div>
//                                     <Label htmlFor="cylinder12kg_brand" className="text-[#0F172A] text-lg font-medium mb-2">
//                                         Brand
//                                     </Label>
//                                     <select
//                                         id="cylinder12kg_brand"
//                                         name="cylinder12kg_brand"
//                                         value={formData.cylinder12kg_brand || ''}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"

//                                     >
//                                         <option value="">Select brand</option>
//                                         {BRANDS.map((b) => (
//                                             <option key={b.value} value={b.value}>
//                                                 {b.label}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="cylinder12kg_price" className="text-[#0F172A] text-lg font-medium mb-2">
//                                         Price per Cylinder
//                                     </Label>
//                                     <input
//                                         type="number"
//                                         id="cylinder12kg_price"
//                                         name="cylinder12kg_price"
//                                         value={formData.cylinder12kg_price}
//                                         onChange={handleInputChange}
//                                         placeholder="0"
//                                         min="0"
//                                         className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${errors.cylinder12kg_price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                                             }`}
//                                     />
//                                 </div>


//                             </div>

//                             <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//                                 {/* 25kg Cylinder */}
//                                 <div>
//                                     <Label htmlFor="cylinder25kg" className="text-[#0F172A] text-lg font-medium mb-2">
//                                         25 kg Cylinder
//                                     </Label>
//                                     <input
//                                         type="number"
//                                         id="cylinder25kg"
//                                         name="cylinder25kg"
//                                         value={formData.cylinder25kg}
//                                         onChange={handleInputChange}
//                                         placeholder="0"
//                                         min="0"
//                                         max="999"
//                                         className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${errors.cylinder25kg ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//                                             }`}
//                                     />
//                                     {errors.cylinder25kg && (
//                                         <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                             <AlertCircle className="w-4 h-4" /> {errors.cylinder25kg}
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="cylinder25kg_brand" className="text-[#0F172A] text-lg font-medium mb-2">
//                                         Brand
//                                     </Label>
//                                     <select
//                                         id="cylinder25kg_brand"
//                                         name="cylinder25kg_brand"
//                                         value={formData.cylinder25kg_brand || ''}
//                                         onChange={handleInputChange}
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"

//                                     >
//                                         <option value="">Select brand</option>
//                                         {BRANDS.map((b) => (
//                                             <option key={b.value} value={b.value}>
//                                                 {b.label}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 {/* 25kg Price */}
//                                 <div>
//                                     <Label htmlFor="cylinder25kg_price" className="text-[#0F172A] text-lg font-medium mb-2">
//                                         Price per Cylinder
//                                     </Label>
//                                     <input
//                                         type="number"
//                                         id="cylinder25kg_price"
//                                         name="cylinder25kg_price"
//                                         value={formData.cylinder25kg_price}
//                                         onChange={handleInputChange}
//                                         placeholder="0"
//                                         min="0"
//                                         className="w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border-gray-300 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2 ${loading
//                             ? 'bg-gray-400 cursor-not-allowed'
//                             : 'bg-gradient-to-l from-[#0776BD] to-[#51C7E1] hover:shadow-lg'
//                             }`}
//                     >
//                         {loading && <Loader className="w-4 h-4 animate-spin" />}
//                         {loading ? 'Updating...' : 'Update Inventory'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     )
// }

'use client'
import { Suspense, useEffect, useState } from 'react'
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { useUpdateInventoryMutation } from '@/redux/feature/gasCompany/InventorySlice'
import { useCompanyTrucksQuery } from '@/redux/feature/gasCompany/companySlice'
import { toast } from 'sonner'

const validateInventory = (value: string): boolean => {
    const num = parseInt(value)
    return !isNaN(num) && num >= 0
}

interface FormErrors {
    [key: string]: string
}

// ✅ Brand fields added to FormData interface
interface FormData {
    truckPublicId: string
    vehicleType: string
    operatingZone: string
    assignDriver: string
    cylinder12kg: string
    cylinder25kg: string
    cylinder12kg_price: string
    cylinder25kg_price: string
    cylinder12kg_brand: string
    cylinder25kg_brand: string
}

interface TruckItem {
    id: number
    public_id: string
    truck_id: string
    vehicle_type: string
    operating_zone: number
    operating_zone_name: string
    driver: number | null
    driver_name: string | null
    cylinder_12kg: number
    cylinder_25kg: number
    cylinder_12kg_price?: number
    cylinder_25kg_price?: number
    cylinder12kg_brand?: string | null
    cylinder25kg_brand?: string | null
}

interface TruckApiResponse {
    data?: TruckItem[]
}

const BRANDS = [
    { value: 'igl', label: 'IGL' },
    { value: 'gaspro', label: 'GasPro' },
    { value: 'yaadman', label: 'Yaadman' },
    { value: 'regency_petroleum', label: 'Regency Petroleum' },
    { value: 'fesgas', label: 'FESGAS' },
    { value: 'petcom', label: 'PETCOM' },
    { value: 'bm_lpg', label: 'BM LPG' },
    { value: 'jamuna_lpg', label: 'Jamuna LPG' },
    { value: 'any_available', label: 'Any Available' },
]

// ✅ Helper to get brand label from value
const getBrandLabel = (value: string | null | undefined): string => {
    if (!value) return ''
    return BRANDS.find((b) => b.value === value)?.label || value
}

function AddInventory() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedTruckId = searchParams.get('truckId')

    // ✅ Initial state now includes brand fields
    const [formData, setFormData] = useState<FormData>({
        truckPublicId: '',
        vehicleType: '',
        operatingZone: '',
        assignDriver: '',
        cylinder12kg: '',
        cylinder25kg: '',
        cylinder12kg_price: '',
        cylinder25kg_price: '',
        cylinder12kg_brand: '',
        cylinder25kg_brand: '',
    })

    const { data: companyData } = useCompanyTrucksQuery(undefined)
    const [updateInventory] = useUpdateInventoryMutation()

    const trucks = ((companyData as TruckApiResponse | undefined)?.data) || []

    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)

    // ✅ Pre-fill form including brand fields
    useEffect(() => {
        if (!trucks.length) return

        const matchedTruck = preselectedTruckId
            ? trucks.find(
                (truck) =>
                    truck.truck_id === preselectedTruckId ||
                    truck.public_id === preselectedTruckId
            )
            : null

        if (matchedTruck) {
            setFormData({
                truckPublicId: matchedTruck.public_id,
                vehicleType: matchedTruck.vehicle_type || '',
                operatingZone: matchedTruck.operating_zone_name || '',
                assignDriver: matchedTruck.driver_name || '',
                cylinder12kg: String(matchedTruck.cylinder_12kg ?? 0),
                cylinder25kg: String(matchedTruck.cylinder_25kg ?? 0),
                cylinder12kg_price: String(matchedTruck.cylinder_12kg_price ?? 0),
                cylinder25kg_price: String(matchedTruck.cylinder_25kg_price ?? 0),
                cylinder12kg_brand: matchedTruck.cylinder12kg_brand || '',
                cylinder25kg_brand: matchedTruck.cylinder25kg_brand || '',
            })
        }
    }, [trucks, preselectedTruckId])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        if (name === 'truckPublicId') {
            const selectedTruck = trucks.find((truck) => truck.public_id === value)

            setFormData((prev) => ({
                ...prev,
                truckPublicId: value,
                vehicleType: selectedTruck?.vehicle_type || '',
                operatingZone: selectedTruck?.operating_zone_name || '',
                assignDriver: selectedTruck?.driver_name || '',
                cylinder12kg: selectedTruck
                    ? String(selectedTruck.cylinder_12kg)
                    : prev.cylinder12kg,
                cylinder25kg: selectedTruck
                    ? String(selectedTruck.cylinder_25kg)
                    : prev.cylinder25kg,
                cylinder12kg_price: selectedTruck
                    ? String(selectedTruck.cylinder_12kg_price ?? 0)
                    : prev.cylinder12kg_price,
                cylinder25kg_price: selectedTruck
                    ? String(selectedTruck.cylinder_25kg_price ?? 0)
                    : prev.cylinder25kg_price,
                // ✅ Auto-fill brand when truck is selected
                cylinder12kg_brand: selectedTruck?.cylinder12kg_brand || '',
                cylinder25kg_brand: selectedTruck?.cylinder25kg_brand || '',
            }))

            if (errors.truckPublicId) {
                setErrors((prev) => {
                    const next = { ...prev }
                    delete next.truckPublicId
                    return next
                })
            }
            return
        }

        setFormData((prev) => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.truckPublicId.trim()) {
            newErrors.truckPublicId = 'Truck selection is required'
        }
        if (!formData.cylinder12kg.trim()) {
            newErrors.cylinder12kg = 'Please enter a value'
        } else if (
            !validateInventory(formData.cylinder12kg) ||
            parseInt(formData.cylinder12kg) > 999
        ) {
            newErrors.cylinder12kg = 'Enter a valid number between 0 and 999'
        }

        if (!formData.cylinder25kg.trim()) {
            newErrors.cylinder25kg = 'Please enter a value'
        } else if (
            !validateInventory(formData.cylinder25kg) ||
            parseInt(formData.cylinder25kg) > 999
        ) {
            newErrors.cylinder25kg = 'Enter a valid number between 0 and 999'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setErrors({})

        try {
            const payload = {
                mode: 'add',
                cylinder_12kg: Number(formData.cylinder12kg),
                cylinder_25kg: Number(formData.cylinder25kg),
                cylinder_12kg_price: formData.cylinder12kg_price
                    ? Number(formData.cylinder12kg_price)
                    : undefined,
                cylinder_25kg_price: formData.cylinder25kg_price
                    ? Number(formData.cylinder25kg_price)
                    : undefined,
                // ✅ Brand fields included in payload (send null if empty to clear brand)
                cylinder12kg_brand: formData.cylinder12kg_brand || null,
                cylinder25kg_brand: formData.cylinder25kg_brand || null,
            }

            const response = await updateInventory({
                truckId: formData.truckPublicId,
                data: payload,
            }).unwrap()

            toast.success(response.message || 'Inventory updated successfully!')

            // ✅ Update local state with all new values including brands
            setFormData((prev) => ({
                ...prev,
                cylinder12kg: String(payload.cylinder_12kg),
                cylinder25kg: String(payload.cylinder_25kg),
                cylinder12kg_price:
                    payload.cylinder_12kg_price !== undefined
                        ? String(payload.cylinder_12kg_price)
                        : prev.cylinder12kg_price,
                cylinder25kg_price:
                    payload.cylinder_25kg_price !== undefined
                        ? String(payload.cylinder_25kg_price)
                        : prev.cylinder25kg_price,
                cylinder12kg_brand: payload.cylinder12kg_brand || '',
                cylinder25kg_brand: payload.cylinder25kg_brand || '',
            }))

            setTimeout(() => router.push('/inventory'), 1200)
        } catch (error: any) {
            const message =
                error?.data?.message ||
                error?.data?.detail ||
                'Failed to update inventory'
            setErrors({ submit: message })
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl px-4 sm:px-6 pt-4">
            <div className="bg-[#F2F2F2] rounded-2xl shadow-lg overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                    <button
                        onClick={router.back}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg sm:text-xl font-medium text-[#1E1E1C]">
                        Adjust Inventory
                    </h1>
                </div>

                {errors.submit && (
                    <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{errors.submit}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-6">
                    {/* Truck Selector */}
                    <div>
                        <Label
                            htmlFor="truckPublicId"
                            className="text-[#0F172A] text-lg font-medium mb-2"
                        >
                            Truck Selector
                        </Label>
                        <select
                            id="truckPublicId"
                            name="truckPublicId"
                            value={formData.truckPublicId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base appearance-none bg-white ${errors.truckPublicId
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 12px center',
                                backgroundRepeat: 'no-repeat',
                                paddingRight: '36px',
                                color: formData.truckPublicId ? '#666' : '#999',
                            }}
                        >
                            <option value="">Select truck</option>
                            {trucks.map((truck) => (
                                <option key={truck.public_id} value={truck.public_id}>
                                    {truck.truck_id} - {truck.operating_zone_name}
                                </option>
                            ))}
                        </select>
                        {errors.truckPublicId && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" /> {errors.truckPublicId}
                            </p>
                        )}
                    </div>

                    {/* ==================== SET INVENTORY SECTION ==================== */}
                    <div>
                        <p className="text-[#0F172A] text-lg font-medium mb-4">
                            Set Inventory
                        </p>

                        <div className="space-y-6">
                            {/* 12kg Cylinder Group */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 12kg Quantity */}
                                <div>
                                    <Label
                                        htmlFor="cylinder12kg"
                                        className="text-[#0F172A] text-lg font-medium mb-2"
                                    >
                                        12 kg Cylinder
                                    </Label>
                                    <input
                                        type="number"
                                        id="cylinder12kg"
                                        name="cylinder12kg"
                                        value={formData.cylinder12kg}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        max="999"
                                        className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${errors.cylinder12kg
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                    />
                                    {errors.cylinder12kg && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />{' '}
                                            {errors.cylinder12kg}
                                        </p>
                                    )}
                                </div>

                                {/* ✅ 12kg Brand — pre-fills from API & updates on change */}
                                <div>
                                    <Label
                                        htmlFor="cylinder12kg_brand"
                                        className="text-[#0F172A] text-lg font-medium mb-2"
                                    >
                                        Brand
                                    </Label>
                                    <select
                                        id="cylinder12kg_brand"
                                        name="cylinder12kg_brand"
                                        value={formData.cylinder12kg_brand}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                            backgroundPosition: 'right 12px center',
                                            backgroundRepeat: 'no-repeat',
                                            paddingRight: '36px',
                                        }}
                                    >
                                        <option value="">Select brand</option>
                                        {BRANDS.map((b) => (
                                            <option key={b.value} value={b.value}>
                                                {b.label}
                                            </option>
                                        ))}
                                    </select>
                                    {/* ✅ Shows current saved brand as hint */}
                                    {formData.cylinder12kg_brand && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Current:{' '}
                                            <span className="font-medium text-gray-700">
                                                {getBrandLabel(formData.cylinder12kg_brand)}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {/* 12kg Price */}
                                <div>
                                    <Label
                                        htmlFor="cylinder12kg_price"
                                        className="text-[#0F172A] text-lg font-medium mb-2"
                                    >
                                        Price per Cylinder
                                    </Label>
                                    <input
                                        type="number"
                                        id="cylinder12kg_price"
                                        name="cylinder12kg_price"
                                        value={formData.cylinder12kg_price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${errors.cylinder12kg_price
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* 25kg Cylinder Group */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 25kg Quantity */}
                                <div>
                                    <Label
                                        htmlFor="cylinder25kg"
                                        className="text-[#0F172A] text-lg font-medium mb-2"
                                    >
                                        25 kg Cylinder
                                    </Label>
                                    <input
                                        type="number"
                                        id="cylinder25kg"
                                        name="cylinder25kg"
                                        value={formData.cylinder25kg}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        max="999"
                                        className={`w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${errors.cylinder25kg
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                    />
                                    {errors.cylinder25kg && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />{' '}
                                            {errors.cylinder25kg}
                                        </p>
                                    )}
                                </div>

                                {/* ✅ 25kg Brand — pre-fills from API & updates on change */}
                                <div>
                                    <Label
                                        htmlFor="cylinder25kg_brand"
                                        className="text-[#0F172A] text-lg font-medium mb-2"
                                    >
                                        Brand
                                    </Label>
                                    <select
                                        id="cylinder25kg_brand"
                                        name="cylinder25kg_brand"
                                        value={formData.cylinder25kg_brand}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                            backgroundPosition: 'right 12px center',
                                            backgroundRepeat: 'no-repeat',
                                            paddingRight: '36px',
                                        }}
                                    >
                                        <option value="">Select brand</option>
                                        {BRANDS.map((b) => (
                                            <option key={b.value} value={b.value}>
                                                {b.label}
                                            </option>
                                        ))}
                                    </select>
                                    {/* ✅ Shows current saved brand as hint */}
                                    {formData.cylinder25kg_brand && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Current:{' '}
                                            <span className="font-medium text-gray-700">
                                                {getBrandLabel(formData.cylinder25kg_brand)}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {/* 25kg Price */}
                                <div>
                                    <Label
                                        htmlFor="cylinder25kg_price"
                                        className="text-[#0F172A] text-lg font-medium mb-2"
                                    >
                                        Price per Cylinder
                                    </Label>
                                    <input
                                        type="number"
                                        id="cylinder25kg_price"
                                        name="cylinder25kg_price"
                                        value={formData.cylinder25kg_price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-3 border bg-white rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border-gray-300 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-l from-[#0776BD] to-[#51C7E1] hover:shadow-lg'
                            }`}
                    >
                        {loading && <Loader className="w-4 h-4 animate-spin" />}
                        {loading ? 'Updating...' : 'Update Inventory'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function AddInventoryPage() {
    return (
        <Suspense fallback={<div className='text-center'>loading</div>}>
            <AddInventory />
        </Suspense>
    )
}