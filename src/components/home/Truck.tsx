"use client";

import { useMemo, useState } from "react";
import { useCompanyTrucksQuery } from "@/redux/feature/gasCompany/companySlice";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface TruckItem {
    public_id: string;
    truck_id: string;
    vehicle_type: string;
    operating_zone: string;
    owner: number;
    owner_id: number;
    driver: number | null;
    driver_name: string | null;
    cylinder_12kg: number;
    cylinder_25kg: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface TrucksApiResponse {
    status?: string;
    data?: TruckItem[];
}

const getStatusColor = (status: string) => {
    const normalized = status?.toLowerCase();
    if (normalized === "active") return "bg-green-500";
    if (normalized === "on_delivery") return "bg-yellow-400";
    return "bg-gray-400";
};

const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
};

const Truck = ({ title }: { title: string }) => {
    const { data, isLoading, isError } = useCompanyTrucksQuery(undefined);
    const [selectedTruck, setSelectedTruck] = useState<TruckItem | null>(null);

    const trucks = useMemo(() => {
        const response = data as TrucksApiResponse | undefined;
        return response?.data ?? [];
    }, [data]);

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
                                    "Truck ID",
                                    "Zone",
                                    "Driver",
                                    "Status",
                                    "Inventory",
                                    "Last Updated",
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
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        Loading trucks...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-red-500"
                                    >
                                        Failed to load trucks
                                    </td>
                                </tr>
                            ) : trucks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                trucks.map((item) => (
                                    <tr
                                        key={item.public_id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-center">{item.truck_id || "N/A"}</td>
                                        <td className="px-6 py-4 text-center">{item.operating_zone || "N/A"}</td>
                                        <td className="px-6 py-4 text-center">{item.driver_name || "Not Assigned"}</td>
                                        <td className="px-6 py-4"> <div className="flex items-center justify-center gap-2">
                                            <span
                                                className={`w-2.5 h-2.5 rounded-full ${getStatusColor(item.status)}`}
                                            />
                                            <span>{formatStatus(item.status)}</span>
                                        </div></td>

                                        <td className="px-6 py-4 text-center">12kg: {item.cylinder_12kg} | 25kg: {item.cylinder_25kg}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(item.updated_at)}</td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-center">

                                            <button
                                                type="button"
                                                onClick={() => setSelectedTruck(item)}
                                                className="text-blue-600 hover:underline"
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

            <Dialog open={!!selectedTruck} onOpenChange={(open) => !open && setSelectedTruck(null)}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Truck Details</DialogTitle>
                    </DialogHeader>

                    {selectedTruck && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Truck ID</p>
                                <p className="font-medium">{selectedTruck.truck_id || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Public ID</p>
                                <p className="font-medium break-all">{selectedTruck.public_id || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Vehicle Type</p>
                                <p className="font-medium">{formatStatus(selectedTruck.vehicle_type)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Operating Zone</p>
                                <p className="font-medium">{selectedTruck.operating_zone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Driver</p>
                                <p className="font-medium">{selectedTruck.driver_name || "Not Assigned"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium">{formatStatus(selectedTruck.status)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">12kg Cylinders</p>
                                <p className="font-medium">{selectedTruck.cylinder_12kg}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">25kg Cylinders</p>
                                <p className="font-medium">{selectedTruck.cylinder_25kg}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Created At</p>
                                <p className="font-medium">{formatDate(selectedTruck.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Last Updated</p>
                                <p className="font-medium">{formatDate(selectedTruck.updated_at)}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Truck;
