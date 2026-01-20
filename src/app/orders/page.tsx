import OrdersTable from '@/components/home/ordersTable'
import React from 'react'

export default function page() {
    return (
        <div className="space-y-8 mt-6 py-4 px-4 md:px-6 lg:px-8">
            <OrdersTable title="Orders" />
        </div>
    )
}
