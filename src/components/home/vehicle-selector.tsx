'use client'

import Car from '../icon/car'
import Bike from '../icon/bike'
import Ven from '../icon/ven'
import Wrecker from '../icon/Wrecker'
import Truck from '../icon/Truck'

interface VehicleSelectorProps {
    selectedType: string
    onTypeChange: (type: string) => void
}

export default function VehicleSelector({ selectedType, onTypeChange }: VehicleSelectorProps) {
    const vehicles = [
        { id: 'bike', label: 'Bike', Icon: Bike },
        { id: 'car', label: 'Car', Icon: Car },
        { id: 'van', label: 'Van', Icon: Ven },
        { id: 'wrecker', label: 'Wrecker', Icon: Wrecker }, // or use a more suitable icon like `Caravan` or custom
        { id: 'removal', label: 'Removals\nTruck', Icon: Truck },
    ]

    return (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {vehicles.map(({ id, label, Icon }) => {
                const isSelected = selectedType === id

                return (
                    <button
                        key={id}
                        onClick={() => onTypeChange(id)}
                        className={`flex flex-col items-center justify-center gap-2 py-4 px-8 rounded-xl transition-all duration-200 border-2 ${isSelected
                            ? 'border-blue-500  shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                            }`}
                    >
                        <Icon />
                        <span
                            className={`text-xs sm:text-sm font-medium text-center leading-tight whitespace-pre-line ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-700'
                                }`}
                        >
                            {label}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}