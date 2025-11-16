'use client'

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"


interface Payment {
    transactionId: string
    deliveryId: string
    dateTime: string
    paymentMethod: string
    status: "Paid" | "Pending" | "Failed"
    amount: string
    driver?: {
        name: string
        rating: number
        image: string
        vehicle: string
        plate: string
        phone: string
    }
    
}

const paymentsData: Payment[] = [
    {
        transactionId: "#TRX-7852",
        deliveryId: "#DL-2054",
        dateTime: "09 Nov 2025 — 10:30 AM",
        paymentMethod: "Stripe",
        status: "Paid",
        amount: "$45.00",
        driver: {
            name: "Rahim Khan",
            rating: 4.9,
            image: "/driver1.jpg",
            vehicle: "Toyota Hiace",
            plate: "DHK-1243",
            phone: "+880 123 456 789",
        },
    },
    // Add more entries or duplicate for testing
    ...Array(9).fill(null).map((_, i) => ({
        transactionId: `#TRX-785${2 + i}`,
        deliveryId: "#DL-2054",
        dateTime: "09 Nov 2025 — 10:30 AM",
        paymentMethod: "Stripe",
        status: "Paid" as const,
        amount: "$45.00",
        driver: {
            name: "Rahim Khan",
            rating: 4.9,
            image: "/driver1.jpg",
            vehicle: "Toyota Hiace",
            plate: "DHK-1243",
            phone: "+880 123 456 789",
        },
    })),
]

export default function PaymentHistory() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filteredData = paymentsData.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const openDetails = (payment: Payment) => {
        setSelectedPayment(payment)
        setIsModalOpen(true)
    }

    return (
        <>
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">Payment History</h2>

                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="">
                            <tr className="bg-primary text-white text-left text-sm " >
                                <th className="px-6 py-6 font-medium">Transaction ID</th>
                                <th className="px-6 py-6 font-medium">Delivery ID</th>
                                <th className="px-6 py-6 font-medium">Date & Time</th>
                                <th className="px-6 py-6 font-medium">Payment Method</th>
                                <th className="px-6 py-6 font-medium">Status</th>
                                <th className="px-6 py-6 font-medium">Amount</th>
                                <th className="px-6 py-6 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map((payment, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-700 font-medium">{payment.transactionId}</td>
                                    <td className="px-6 py-4 text-gray-600">{payment.deliveryId}</td>
                                    <td className="px-6 py-4 text-gray-600">{payment.dateTime}</td>
                                    <td className="px-6 py-4 text-gray-600">{payment.paymentMethod}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="success" className="bg-green-100 text-green-800">
                                            {payment.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">{payment.amount}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openDetails(payment)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm underline-offset-4 hover:underline transition"
                                        >
                                            See Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                    {/* Custom Header with Red X */}
                    <div className="flex items-center justify-between p-6 pb-4 border-b">
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            Payment Details
                        </DialogTitle>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-red-600 hover:bg-red-50 rounded-full p-2 transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {selectedPayment && (
                        <div className="p-6 space-y-5 text-gray-700">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Transaction ID</span>
                                <span className="font-medium">{selectedPayment.transactionId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery ID</span>
                                <span className="font-medium">{selectedPayment.deliveryId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Method</span>
                                <span className="font-medium">{selectedPayment.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment Date</span>
                                <span className="font-medium">{selectedPayment.paymentDate}</span>
                            </div>

                            <div className="border-t pt-5 space-y-4">
                                <div className="flex justify-between">
                                    <span>Amount</span>
                                    <span className="font-semibold text-xl">{selectedPayment.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee</span>
                                    <span className="font-medium">{selectedPayment.platformFee}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total Charged</span>
                                    <span>{selectedPayment.totalCharged}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-gray-500">Status</span>
                                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-1">
                                    Completed
                                </Badge>
                            </div>

                            {/* Download Button */}
                            <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-6 text-lg rounded-xl shadow-lg">
                                Download Receipt
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}