import OrdersTable from '@/components/home/ordersTable'

export default function OrderPage() {
    return (
        <div className="space-y-8 mt-6 py-4 px-4 md:px-6 lg:px-8">
            <OrdersTable title="Orders" />
        </div>
    )
}
