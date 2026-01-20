"use client";

import { useRef } from "react";
import { truckData } from "../mockData/truckData";
import Link from "next/link";


const Truck = ({ title }: { title: string }) => {


    const menuRef = useRef<HTMLTableDataCellElement>(null);

    const statusColor = {
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
                                    "Truck ID",
                                    "Zone",
                                    "Driver",
                                    "Status",
                                    "Inventory",
                                    "Last Updated",
                                ].map((key) => (
                                    <th
                                        key={key}
                                        className="px-6 py-6 text-left text-lg font-normal cursor-pointer hover:bg-primary/80 transition"
                                    >
                                        <div className="flex items-center gap-2 capitalize">
                                            {key.replace("_", " ")}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-6 text-left text-lg font-normal">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {truckData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                truckData.map((item) => (
                                    <tr
                                        key={item.truckId}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4">{item.truckId}</td>
                                        <td className="px-6 py-4">{item.zone}</td>
                                        <td className="px-6 py-4">{item.driver}</td>
                                        <td className="px-6 py-4"> <div className="flex items-center gap-2">
                                            <span
                                                className={`w-2.5 h-2.5 rounded-full ${statusColor[item.status]}`}
                                            />
                                            <span>{item.status}</span>
                                        </div></td>

                                        <td className="px-6 py-4">{item.inventory}</td>
                                        <td className="px-6 py-4">{item.lastUpdated}</td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 relative" ref={menuRef}>

                                            <Link href={`/truck/${item.truckId}`} className="text-blue-600 hover:underline">
                                                View Details
                                            </Link>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Truck;
