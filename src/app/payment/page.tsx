
'use client'

import { useMemo, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"
import { usePaymentListQuery } from "@/redux/feature/transation"
import { Input } from "@/components/ui/input"

export default function PaymentHistory() {
    const [selectedPayment, setSelectedPayment] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [search, setSearch] = useState("")

    const { data, isLoading, isError } = usePaymentListQuery(undefined)

    // ✅ Properly handle your exact API structure
    const payments = useMemo(() => {
        if (!data?.data || !Array.isArray(data.data)) return []

        return data.data.map((item: any) => ({
            id: item.id,
            transactionId: `#TRX-${item.id}`,
            deliveryId: `#DL-${item.id}`,
            dateTime: item.updated_at 
                ? new Date(item.updated_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : "N/A",
            paymentMethod: item.payment_method ? item.payment_method.toUpperCase() : "CASH",
            status: item.status || "Paid",
            amount: item.price ? `$${parseFloat(item.price).toFixed(2)}` : "$0.00",
            rawData: item, // Full original data for modal
        }))
    }, [data])

    // Search functionality
    const filteredPayments = useMemo(() => {
        if (!search.trim()) return payments

        const term = search.toLowerCase()
        return payments.filter((payment: any) =>
            payment.deliveryId.toLowerCase().includes(term) ||
            payment.transactionId.toLowerCase().includes(term)
        )
    }, [payments, search])

    const openDetails = (payment: any) => {
        setSelectedPayment(payment)
        setIsModalOpen(true)
    }

    return (
        <div className="py-4 px-4 md:px-6 lg:px-8">
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Payment History</h2>
                    
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by Delivery ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-gray-50"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-primary text-white text-left text-sm">
                                <th className="px-6 py-6 font-medium">Delivery ID</th>
                                <th className="px-6 py-6 font-medium">Date & Time</th>
                                <th className="px-6 py-6 font-medium">Payment Method</th>
                                <th className="px-6 py-6 font-medium">Status</th>
                                <th className="px-6 py-6 font-medium text-right">Amount</th>
                                <th className="px-6 py-6 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-gray-500">
                                        Loading payment history...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-red-500">
                                        Failed to load payments
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-gray-500">
                                        {search ? "No matching payments found" : "No payments found"}
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment: any) => (
                                    <tr 
                                        key={payment.id} 
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            # {payment.id}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {payment.dateTime}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 capitalize">
                                            {payment.paymentMethod}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge 
                                                className="bg-green-100 text-green-700 hover:bg-green-200"
                                            >
                                                {payment.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-right text-gray-900">
                                            {payment.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => openDetails(payment)}
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                            >
                                                See Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==================== DETAILS MODAL ==================== */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b">
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            Payment Details
                        </DialogTitle>
                       
                    </div>

                    {selectedPayment && (
                        <div className="p-6 space-y-6">
                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-6 text-sm">
                                
                                <div>
                                    <p className="text-gray-500">Delivery ID</p>
                                    <p className="font-medium mt-1"># {selectedPayment.id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Payment Method</p>
                                    <p className="font-medium mt-1 capitalize">{selectedPayment.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Date & Time</p>
                                    <p className="font-medium mt-1">{selectedPayment.dateTime}</p>
                                </div>
                            </div>

                            {/* Amount & Status */}
                            <div className="border-t border-b py-8">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-500">Amount</p>
                                        <p className="text-4xl font-bold text-gray-900 mt-1">
                                            {selectedPayment.amount}
                                        </p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 text-lg px-6 ">
                                        {selectedPayment.status}
                                    </Badge>
                                </div>
                            </div>

                            

                            <Button onClick={() => setIsModalOpen(false)} className="w-full py-6 text-lg font-medium ">
                                Close
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}