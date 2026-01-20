import Driver from '@/components/home/driver'
import Fleet from '@/components/home/Fleet'
import Truck from '@/components/home/Truck'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className="space-y-8 mt-6 py-4 px-4 md:px-6 lg:px-8">
      <Fleet />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Link href="/fleet-drivers/add-track" className="bg-gradient-to-l from-[#0776BD] to-[#51C7E1] p-4 text-center flex items-center justify-center gap-4 text-2xl font-medium text-white rounded-lg ">
          <Plus size={24} />
          <p>Add Truck</p>
        </Link>
        <Link href="/fleet-drivers/add-new-driver" className="bg-gradient-to-l from-[#0776BD] to-[#51C7E1] p-4 text-center flex items-center justify-center gap-4 text-2xl font-medium text-white rounded-lg ">
          <Plus size={24} />
          <p>Add Driver</p>
        </Link>
      </div>

      <Tabs defaultValue="track" className="w-full">
        <TabsList className="grid grid-cols-2 gap-3 bg-transparent">
          <TabsTrigger
            value="track"
            className="
        py-4 text-base font-medium rounded-lg
        data-[state=active]:bg-gradient-to-r
        data-[state=active]:from-[#51C7E1]
        data-[state=active]:to-[#0776BD]
        data-[state=active]:text-white
        data-[state=inactive]:bg-[#F2F2F2]
        transition-all w-[200px]
      "
          >
            Track
          </TabsTrigger>

          <TabsTrigger
            value="driver"
            className="
        py-4 text-base font-medium rounded-lg
        data-[state=active]:bg-gradient-to-r
           data-[state=active]:from-[#51C7E1]
        data-[state=active]:to-[#0776BD]
        data-[state=active]:text-white
        data-[state=inactive]:bg-[#F2F2F2]
        data-[state=inactive]:text-gray-600
        transition-all
      "
          >
            Driver
          </TabsTrigger>
        </TabsList>

        <TabsContent value="track" className="mt-6">
          <Truck title="Trucks" />
        </TabsContent>

        <TabsContent value="driver" className="mt-6">
          <Driver title="Drivers" />
        </TabsContent>
      </Tabs>


    </div>
  )
}
