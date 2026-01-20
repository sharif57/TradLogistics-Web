"use client";

import Link from "next/link";
import { driverData } from "../mockData/driverData";
import Ratting from "../icon/ratting";


const Driver = ({ title }: { title: string }) => {


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
                                <th className="px-6 py-6 text-left text-lg font-normal">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {driverData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                driverData.map((item) => (
                                    <tr
                                        key={item.driver}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-center">{item.driver}</td>
                                        <td className="px-6 py-4 text-center">{item.truck}</td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${statusColor[item.status]}`} />
                                                <span>{item.status}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">{item.deliveriesToday}</td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {item.rating} <Ratting />
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">${item.earningsToday}</td>

                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/truck/${item.driver}`}
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

export default Driver;
