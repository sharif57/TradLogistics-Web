import InventoryCounter from '@/components/home/inventoryCounter'
import InventoryTable from '@/components/home/InventoryTable'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function Inventory() {
    return (
        <div className="space-y-8 mt-6 py-4 px-4 md:px-6 lg:px-8">
            <InventoryCounter />
            <Link href="/inventory/add-inventory" className="bg-gradient-to-l from-[#0776BD] to-[#51C7E1] p-4 text-center flex items-center justify-center gap-4 text-2xl font-medium text-white rounded-lg ">
                <Plus size={24} />
                <p>Adjust Inventory</p>
            </Link>
            <InventoryTable title="Inventory" />
        </div>
    )
}
