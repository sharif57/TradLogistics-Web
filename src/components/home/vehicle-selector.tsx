'use client'

import { Bike, Car, Truck, TrendingUp, Wrench } from 'lucide-react'

interface VehicleSelectorProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

export default function VehicleSelector({ selectedType, onTypeChange }: VehicleSelectorProps) {
  const vehicles = [
    { id: 'bike', label: 'Bike', icon: Bike },
    { id: 'car', label: 'Car', icon: Car },
    { id: 'van', label: 'Van', icon: Truck },
    { id: 'wrecker', label: 'Wrecker', icon: TrendingUp },
    { id: 'removal', label: 'Removals\nTruck', icon: Wrench },
  ]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
      {vehicles.map(vehicle => {
        const Icon = vehicle.icon
        const isSelected = selectedType === vehicle.id
        return (
          <button
            key={vehicle.id}
            onClick={() => onTypeChange(vehicle.id)}
            className={`flex flex-col items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-lg transition-all border-2 ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${isSelected ? 'text-blue-500' : 'text-gray-600'}`} />
            <span className={`text-xs sm:text-sm text-center leading-tight ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              {vehicle.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
