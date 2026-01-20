import Fleet from '@/components/home/Fleet'
import Truck from '@/components/home/Truck'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className="space-y-8 mt-6 py-4 px-4 md:px-6 lg:px-8">
      <Fleet />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Link href="/create-new-delivery" className="bg-gradient-to-l from-[#0776BD] to-[#51C7E1] p-4 text-center flex items-center justify-center gap-4 text-2xl font-medium text-white rounded-lg ">
          <Plus size={24} />
          <p>Add Truck</p>
        </Link>
        <Link href="/create-new-delivery" className="bg-gradient-to-l from-[#0776BD] to-[#51C7E1] p-4 text-center flex items-center justify-center gap-4 text-2xl font-medium text-white rounded-lg ">
          <Plus size={24} />
          <p>Add Driver</p>
        </Link>
      </div>

      <Truck title="Trucks" />
    </div>
  )
}
