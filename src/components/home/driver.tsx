"use client";

import Ratting from "../icon/ratting";
import { useAllDriverListQuery } from "@/redux/feature/gasCompany/companySlice";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DriverItem {
    user_id: number
    first_name?: string
    last_name?: string
    email?: string | null
    phone?: string | null
    role?: string
    d_type?: string
    truck_id?: string | null
    today_total_deliveries?: number
    today_total_earnings?: number
    assign_truck?: number | null
    balance?: string | number
    is_online?: boolean
    is_verified?: boolean
    average_rating?: string | number
    availability_status?: boolean | string | null
    truck?: string
    deliveriesToday?: number
    earningsToday?: number | string
    [key: string]: unknown
}

interface DriverApiResponse {
    data?: DriverItem[]
}


const Driver = ({ title }: { title: string }) => {
    const [role] = useState('driver');
    const [selectedDriver, setSelectedDriver] = useState<DriverItem | null>(null)
    const { data } = useAllDriverListQuery(role);
    const driverList = ((data as DriverApiResponse | undefined)?.data) || []

    const getAvailabilityStatus = (availabilityStatus: boolean | string | null | undefined) => {
        if (typeof availabilityStatus === 'boolean') {
            return availabilityStatus ? 'Available' : 'On Delivery'
        }

        if (typeof availabilityStatus === 'string') {
            return availabilityStatus
        }

        return 'On Delivery'
    }

    const statusColor: Record<string, string> = {
        "On Delivery": "bg-yellow-400",
        Available: "bg-green-500",
        Offline: "bg-gray-400",
    };

    return (
        <div className="w-full bg-white rounded-lg">
            <div className="mx-auto">
                <h2 className="text-2xl p-4 font-medium text-[#1A1918]">
                    {title}
                </h2>
                {/* Table */}
                <div className="overflow-hidden border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-primary text-white">
                            <tr>
                                {[
                                    "Driver",
                                    "Truck",
                                    "Status",
                                    "Deliveries Today",
                                    "Rating",
                                    "Earnings (Today)",
                                ].map((key) => (
                                    <th
                                        key={key}
                                        className="px-6 py-6 text-center text-lg font-normal cursor-pointer hover:bg-primary/80 transition"
                                    >
                                        <div className="flex items-center justify-center gap-2 capitalize">
                                            {key.replace("_", " ")}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-6 text-center text-lg font-normal">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {driverList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                driverList.map((item) => {
                                    const driverStatus = getAvailabilityStatus(item?.availability_status)

                                    return (
                                        <tr
                                            key={item.user_id}
                                            className="border-t hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-center">{item?.first_name + " " + item?.last_name}</td>
                                            <td className="px-6 py-4 text-center">{item?.truck_id || "-"}</td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${statusColor[driverStatus]}`} />
                                                    <span>{driverStatus}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center">{item?.today_total_deliveries}</td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {item?.average_rating} <Ratting />
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center">${item?.today_total_earnings}</td>

                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDriver(item)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    View Details
                                                </button>
                                            </td>

                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={!!selectedDriver} onOpenChange={(open) => !open && setSelectedDriver(null)}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Driver Details</DialogTitle>
                    </DialogHeader>

                    {selectedDriver && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Name</p>
                                <p className="font-medium">
                                    {(selectedDriver.first_name || '') + ' ' + (selectedDriver.last_name || '') || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-medium">{selectedDriver.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium break-all">{selectedDriver.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Role</p>
                                <p className="font-medium">{selectedDriver.role || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Driver Type</p>
                                <p className="font-medium">{selectedDriver.d_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium">{getAvailabilityStatus(selectedDriver.availability_status)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Truck ID</p>
                                <p className="font-medium">{selectedDriver.truck_id || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Assigned Truck</p>
                                <p className="font-medium">{selectedDriver.assign_truck ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Today Deliveries</p>
                                <p className="font-medium">{selectedDriver.today_total_deliveries ?? 0}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Today Earnings</p>
                                <p className="font-medium">${selectedDriver.today_total_earnings ?? 0}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Balance</p>
                                <p className="font-medium">${selectedDriver.balance ?? 0}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Verified</p>
                                <p className="font-medium">{selectedDriver.is_verified ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Driver;
