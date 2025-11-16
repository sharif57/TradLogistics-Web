"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {  MoreVertical } from "lucide-react";

interface Delivery {
    delivery_id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    date: string;
    cost: string;
    action: string;
    pickup: string;
    dropoff: string;
}

const initialData: Delivery[] = [
    {
        "delivery_id": 2472,
        "pickup": "Dhanmondi",
        "dropoff": "Banani",
        "status": "Delivered",
        "date": "18 Oct 2025",
        "cost": "$5.00",
        "action": "See Details"
    },
    {
        "delivery_id": 2472,
        "pickup": "Dhanmondi",
        "dropoff": "Banani",
        "status": "In Transit",
        "date": "18 Oct 2025",
        "cost": "$5.00",
        "action": "Track"
    },
    {
        "delivery_id": 2472,
        "pickup": "Dhanmondi",
        "dropoff": "Banani",
        "status": "Scheduled",
        "date": "18 Oct 2025",
        "cost": "$5.00",
        "action": "See Details"
    }
]


const RecentDeliveriesTable = () => {
    const [data] = useState<Delivery[]>(initialData);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Delivery | null; direction: "asc" | "desc" }>({
        key: null,
        direction: "asc",
    });
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Toggle menu
    const toggleMenu = (id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search filter
    const filteredData = useMemo(() => {
        return data.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [data, search]);

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key!] < b[sortConfig.key!]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key!] > b[sortConfig.key!]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key: keyof Delivery) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getSortIconRotation = (key: keyof Delivery) => {
        if (sortConfig.key !== key) return "rotate-0";
        return sortConfig.direction === "asc" ? "rotate-180" : "rotate-0";
    };

    return (
        <div className="w-full  bg-white rounded-lg ">
            <div className=" mx-auto">
                <h2 className="text-2xl p-4 font-medium text-[#1A1918] dark:text-white">Recent Deliveries</h2>



                {/* Table */}
                <div className="bg- dark:bg-slate-900  overflow-hidden border border-gray-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-primary ">
                            <tr>
                                {["name", "email", "role", "status"].map((key) => (
                                    <th
                                        key={key}
                                        className="px-6  text-left text-lg py-6 font-normal text-white dark:text-gray-200 
                             cursor-pointer  dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6  text-left text-lg py-6 font-normal text-white dark:text-gray-200 
                             cursor-pointer  dark:hover:bg-slate-700 transition-colors">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 
                             dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 
                                     dark:bg-blue-900 dark:text-blue-200">
                                                {item.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === "Active"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 relative" ref={menuRef}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(item.id);
                                                }}
                                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 
                                 transition-colors action-btn"
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {openMenuId === item.id && (
                                                <div
                                                    className="absolute right-4 top-12 mt-2 w-48 bg-white dark:bg-slate-800 
                                   rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 
                                   z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
                                                >
                                                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 
                                           hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3">
                                                        Edit
                                                    </button>
                                                    <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 
                                           hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3">
                                                        View Details
                                                    </button>
                                                    <button className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 
                                           hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
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

export default RecentDeliveriesTable;