"use client";

import { useState } from "react";
import { useCompanyTrucksQuery } from "@/redux/feature/gasCompany/companySlice";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface InventoryItem {
    id: number;
    public_id: string;
    truck_id: string;
    vehicle_type: string;
    operating_zone: number;
    operating_zone_name: string;
    owner_name?: string;
    driver?: number | null;
    driver_name?: string | null;
    cylinder_12kg: number;
    cylinder_25kg: number;
    status: string;
    created_at: string;
    updated_at: string;
}


const InventoryTable = ({ title }: { title: string }) => {
    const { data } = useCompanyTrucksQuery(undefined);
    const inventoryData: InventoryItem[] = data?.data || [];
    const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);

    const getInventoryStatus = (count12kg: number, count25kg: number) => {
        const minStock = Math.min(Number(count12kg) || 0, Number(count25kg) || 0);

        if (minStock < 2) return "Critical";
        if (minStock <= 5) return "Low";
        return "Normal";
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
                                    "Truck ID",
                                    "Zone",
                                    "12 kg (Full)",
                                    "25 kg (Full)",
                                    "Empty Cylinders",
                                    "Status",
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
                            {inventoryData?.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                inventoryData?.map((item) => {
                                    const status = getInventoryStatus(item?.cylinder_12kg, item?.cylinder_25kg);

                                    return (
                                        <tr
                                            key={item?.truck_id}
                                            className="border-t hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 text-center">{item?.truck_id}</td>
                                            <td className="px-6 py-4 text-center">{item?.operating_zone_name}</td>
                                            <td className="px-6 py-4 text-center">{item?.cylinder_12kg}</td>
                                            <td className="px-6 py-4 text-center">{item?.cylinder_25kg}</td>
                                            <td className="px-6 py-4 text-center">-</td>
                                            <td className="px-6 py-4 text-center">{status}</td>

                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedInventory(item)}
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

            <Dialog open={!!selectedInventory} onOpenChange={(open) => !open && setSelectedInventory(null)}>
                <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                        <DialogTitle>Inventory Details</DialogTitle>
                    </DialogHeader>

                    {selectedInventory && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Truck ID</p>
                                <p className="font-medium">{selectedInventory.truck_id || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Public ID</p>
                                <p className="font-medium break-all">{selectedInventory.public_id || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Vehicle Type</p>
                                <p className="font-medium">{selectedInventory.vehicle_type || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Zone</p>
                                <p className="font-medium">{selectedInventory.operating_zone_name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Driver</p>
                                <p className="font-medium">{selectedInventory.driver_name || "Not Assigned"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Owner</p>
                                <p className="font-medium">{selectedInventory.owner_name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">12kg Cylinders</p>
                                <p className="font-medium">{selectedInventory.cylinder_12kg}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">25kg Cylinders</p>
                                <p className="font-medium">{selectedInventory.cylinder_25kg}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Stock Status</p>
                                <p className="font-medium">{getInventoryStatus(selectedInventory.cylinder_12kg, selectedInventory.cylinder_25kg)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Truck Status</p>
                                <p className="font-medium">{selectedInventory.status || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Created At</p>
                                <p className="font-medium">{new Date(selectedInventory.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Updated At</p>
                                <p className="font-medium">{new Date(selectedInventory.updated_at).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InventoryTable;
