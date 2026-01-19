"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import Ratting from "../icon/ratting";
import { Car, Phone } from "lucide-react";
import Link from "next/link";

interface Delivery {
    delivery_id: number;
    pickup: string;
    dropoff: string;
    status: string;
    date: string;
    cost: string;
    action: string;
}

const initialData: Delivery[] = [
    {
        delivery_id: 2472,
        pickup: "Dhanmondi",
        dropoff: "Banani",
        status: "Delivered",
        date: "18 Oct 2025",
        cost: "$5.00",
        action: "See Details",
    },
    {
        delivery_id: 2473,
        pickup: "Gulshan",
        dropoff: "Mirpur",
        status: "In Transit",
        date: "19 Oct 2025",
        cost: "$7.00",
        action: "Track",
    },
    {
        delivery_id: 2474,
        pickup: "Uttara",
        dropoff: "Badda",
        status: "Scheduled",
        date: "20 Oct 2025",
        cost: "$6.00",
        action: "See Details",
    },
];

const RecentDeliveriesTable = ({ title, track }: { title: string, track?: string }) => {
    const [data] = useState<Delivery[]>(initialData);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Delivery | null;
        direction: "asc" | "desc";
    }>({
        key: null,
        direction: "asc",
    });
    

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLTableDataCellElement>(null);

    // Toggle action dropdown menu
    const toggleMenu = (id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // Close dropdown outside click
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

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const key = sortConfig.key as keyof Delivery;
            const aValue = a[key]  ?? "";
            const bValue = b[key] ?? "";

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
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
                                    "delivery_id",
                                    "pickup",
                                    "dropoff",
                                    "status",
                                    "date",
                                    "cost",
                                ].map((key) => (
                                    <th
                                        key={key}
                                        onClick={() => handleSort(key as keyof Delivery)}
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
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((item) => (
                                    <tr
                                        key={item.delivery_id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4">{item.delivery_id}</td>
                                        <td className="px-6 py-4">{item.pickup}</td>
                                        <td className="px-6 py-4">{item.dropoff}</td>
                                        <td className="px-6 py-4">{item.status}</td>
                                        <td className="px-6 py-4">{item.date}</td>
                                        <td className="px-6 py-4">{item.cost}</td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 relative" ref={menuRef}>

                                            {
                                                track === "track" ? (
                                                    <Link href={`/deliveries/${item.delivery_id}`}><Button variant="outline">{track}</Button></Link>

                                                )
                                                :
                                            (<Dialog>
                                                <form>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMenu(item.delivery_id);
                                                        }}>                                                <td className="text-primary">{item.action}</td>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        {/* <DialogHeader>
                                                            <DialogTitle>Edit profile</DialogTitle>
                                                            
                                                        </DialogHeader> */}
                                                        <div className="flex items-center justify-between pt-6">
                                                            <div className="flex items-start gap-4">
                                                                <Image src="/image/user.png" alt="Logo" width={500} className="size-14 rounded-full" height={500}></Image>
                                                                <div>
                                                                    <h1 className="text-xl font-medium text-[#1E1E1C]">Pedro Duarte</h1>
                                                                    <div className="flex items-center gap-2">
                                                                        <Ratting />
                                                                        <p>4.9</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-2xl font-medium text-[#1E1E1C]">$120</p>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <Car />
                                                                <p className="text-lg font-medium text-[#4B5563]">Toyota Hiace • DHK-1243</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Phone />
                                                                <p className="text-lg font-medium text-[#4B5563]">0123654789</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-4 pt-2">
                                                            <div className="grid gap-3">
                                                                <Input id="name-1" name="name" placeholder="message driver" />
                                                            </div>

                                                        </div>
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogClose>
                                                            <Button type="submit">Send</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </form>
                                            </Dialog>)
                                            }

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
