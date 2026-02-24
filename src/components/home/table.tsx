"use client";

import { useMemo, useState } from "react";
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
import { useGetDeliveriesQuery } from "@/redux/feature/deliverySlice";

interface DeliveryRow {
    delivery_id: number;
    pickup: string;
    dropoff: string;
    status: string;
    date: string;
    cost: string;
    action: string;
}

interface DeliveryApiItem {
    id: number;
    pickup_address: string;
    dropoff_address: string;
    status: string;
    created_at: string;
    price: string;
}

interface DeliveriesApiResponse {
    status?: string;
    data?: DeliveryApiItem[];
}

const RecentDeliveriesTable = ({ title, track }: { title: string, track?: string }) => {
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof DeliveryRow | null;
        direction: "asc" | "desc";
    }>({
        key: null,
        direction: "asc",
    });
    const { data, isLoading, isError } = useGetDeliveriesQuery(undefined);

    const deliveries = useMemo(() => {
        const response = data as DeliveriesApiResponse | undefined;
        const items = response?.data ?? [];

        return items.map((item) => ({
            delivery_id: item.id,
            pickup: item.pickup_address || "N/A",
            dropoff: item.dropoff_address || "N/A",
            status: item.status || "pending",
            date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
            cost: item.price ? `$${item.price}` : "$0.00",
            action: "See Details",
        }));
    }, [data]);

    // Search filter
    const filteredData = useMemo(() => {
        return deliveries.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [deliveries, search]);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const key = sortConfig.key as keyof DeliveryRow;
            const aValue = a[key] ?? "";
            const bValue = b[key] ?? "";

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key: keyof DeliveryRow) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="w-full bg-white rounded-lg">
            <div className="mx-auto">
                <div className="flex items-center justify-between border-b border-gray-200">
                    <h2 className="text-2xl p-4 font-medium text-[#1A1918]">
                        {title}
                    </h2>
                </div>



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
                                        onClick={() => handleSort(key as keyof DeliveryRow)}
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
                                        Loading deliveries...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-red-500"
                                    >
                                        Failed to load deliveries
                                    </td>
                                </tr>
                            ) : sortedData.length === 0 ? (
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
                                        <td className="px-6 py-4 text-center">{item.delivery_id}</td>
                                        <td className="px-6 py-4 text-center">{item.pickup}</td>
                                        <td className="px-6 py-4 text-center">{item.dropoff}</td>
                                        <td className="px-6 py-4 text-center">{item.status}</td>
                                        <td className="px-6 py-4 text-center">{item.date}</td>
                                        <td className="px-6 py-4 text-center">{item.cost}</td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 relative text-center">

                                            {
                                                track === "track" ? (
                                                    <Link href={`/deliveries/${item.delivery_id}`} className="inline-flex justify-center"><Button variant="outline">{track}</Button></Link>

                                                )
                                                    :
                                                    (<Dialog>
                                                        <form>
                                                            <DialogTrigger asChild>
                                                                <Link href={`/create-new-delivery/find-rider?deliveryId=${item.delivery_id}`}>
                                                                    <Button variant="outline">
                                                                        <span className="text-primary">{item.action}</span>
                                                                    </Button>
                                                                </Link>
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
