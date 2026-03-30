'use client';
import RecentDeliveriesTable from '@/components/home/table'

export default function Deliveries() {
   
  
    return (
        <div className='py-4 px-4 md:px-6 lg:px-8'>
           
            <RecentDeliveriesTable title="Deliveries" track="track" />
        </div>
    )
}
