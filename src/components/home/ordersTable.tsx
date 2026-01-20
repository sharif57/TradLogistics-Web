"use client";

import Link from "next/link";
import { inventoryData } from "../mockData/inventoryData";
import SearchInput from "./SearchInput";
import { useState } from "react";


const OrdersTable = ({ title }: { title: string }) => {


    const [searchValue, setSearchValue] = useState("");
    const placeholders = [
        "Search by Truck ID...",
        "Search by Zone...",
        "Search by Status...",
        "Search by 12 kg (Full)...",
        "Search by 25 kg (Full)...",
        "Search by Empty Cylinders...",
    ];

    return (
        <div className="w-full bg-white rounded-lg">
            <div className="mx-auto">
                <div  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 pt-4">
                    <h2 className="text-2xl p-4 font-medium text-[#1A1918]">
                        {title}
                    </h2>
                    <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} placeholders={placeholders} />
                </div>

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
                                <th className="px-6 py-6 text-left text-lg font-normal">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {inventoryData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                inventoryData.map((item) => (
                                    <tr
                                        key={item.truckId}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-center">{item.truckId}</td>
                                        <td className="px-6 py-4 text-center">{item.zone}</td>
                                        <td className="px-6 py-4 text-center">{item.full12kg}</td>
                                        <td className="px-6 py-4 text-center">{item.full25kg}</td>
                                        <td className="px-6 py-4 text-center">{item.emptyCylinders}</td>
                                        <td className="px-6 py-4 text-center">{item.status}</td>

                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/truck/${item.truckId}`}
                                                className="text-blue-600 hover:underline"
                                            >
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

export default OrdersTable;
