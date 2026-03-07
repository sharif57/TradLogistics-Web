"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetDeliveryOrdersQuery } from "@/redux/feature/gasCompany/companySlice";
import SearchInput from "./SearchInput";

type DeliveryOrder = {
    id: number;
    public_id?: string | null;
    status?: string | null;
    service_type?: string | null;
    vehicle_type?: string | null;
    pickup_address?: string | null;
    dropoff_address?: string | null;
    scheduled_at?: string | null;
    payment_method?: string | null;
    price?: string | null;
    customer?: {
        user_id?: number;
        name?: string | null;
        phone?: string | null;
        profile_image?: string | null;
    } | null;
    driver?: {
        user_id?: number;
        name?: string | null;
        phone?: string | null;
        profile_image?: string | null;
        rating_count?: number | null;
        average_rating?: number | null;
        vehicle_type?: string | null;
        brand?: string | null;
        model?: string | null;
        color?: string | null;
        registration_number?: string | null;
    } | null;
    service_data?: {
        gas?: {
            cylinder_size?: string | null;
            brand?: string | null;
            transaction_type?: string | null;
            delivery_speed?: string | null;
        };
    } | null;
    driver_last_lat?: number | null;
    driver_last_lng?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
};

type DeliveryOrdersResponse = {
    status: string;
    data: DeliveryOrder[];
};

const safeValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string" && value.trim() === "") return "-";
    return value;
};

const formatDate = (value: string | null | undefined) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
};

const formatLabel = (value: string | null | undefined) => {
    if (!value) return "-";
    return value
        .split("_")
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(" ");
};

const OrdersTable = ({ title }: { title: string }) => {
    const { data, isLoading, isError } = useGetDeliveryOrdersQuery(undefined);

    const [searchValue, setSearchValue] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);

    const orders = ((data as DeliveryOrdersResponse | undefined)?.data ?? []) as DeliveryOrder[];

    const filteredOrders = orders.filter((order) => {
        const query = searchValue.toLowerCase().trim();
        if (!query) return true;

        return [
            String(order.id),
            order.public_id ?? "",
            order.customer?.name ?? "",
            order.customer?.phone ?? "",
            order.pickup_address ?? "",
            order.status ?? "",
            order.payment_method ?? "",
        ]
            .join(" ")
            .toLowerCase()
            .includes(query);
    });

    const placeholders = [
        "Search by Order ID...",
        "Search by Customer...",
        "Search by Status...",
        "Search by Phone...",
        "Search by Pickup Address...",
    ];

    return (
        <div className="w-full bg-white rounded-lg">
            <div className="mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 pt-4">
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
                                    "Order ID",
                                    "Customer",
                                    "Pickup",
                                    "Cylinder",
                                    "Driver",
                                    "Status",
                                    "Payment",
                                    "Price",
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
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="text-center py-12 text-red-500"
                                    >
                                        Failed to load orders
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="text-center py-12 text-gray-500"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-center">#{order.id}</td>
                                        <td className="px-6 py-4 text-center">{safeValue(order.customer?.name)}</td>
                                        <td className="px-6 py-4 text-center">{safeValue(order.pickup_address)}</td>
                                        <td className="px-6 py-4 text-center">
                                            {safeValue(order.service_data?.gas?.cylinder_size)}
                                        </td>
                                        <td className="px-6 py-4 text-center">{safeValue(order.driver?.name)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline">{formatLabel(order.status)}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">{formatLabel(order.payment_method)}</td>
                                        <td className="px-6 py-4 text-center">৳ {safeValue(order.price)}</td>

                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                variant="link"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                Details
                                            </Button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                                Full details for order {selectedOrder ? `#${selectedOrder.id}` : "-"}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedOrder && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Public ID</p>
                                    <p>{safeValue(selectedOrder.public_id)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Status</p>
                                    <p>{formatLabel(selectedOrder.status)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Service Type</p>
                                    <p>{formatLabel(selectedOrder.service_type)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Payment Method</p>
                                    <p>{formatLabel(selectedOrder.payment_method)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Price</p>
                                    <p>৳ {safeValue(selectedOrder.price)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Scheduled At</p>
                                    <p>{formatDate(selectedOrder.scheduled_at)}</p>
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-muted-foreground">Pickup Address</p>
                                    <p>{safeValue(selectedOrder.pickup_address)}</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-muted-foreground">Dropoff Address</p>
                                    <p>{safeValue(selectedOrder.dropoff_address)}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Customer Name</p>
                                    <p>{safeValue(selectedOrder.customer?.name)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Customer Phone</p>
                                    <p>{safeValue(selectedOrder.customer?.phone)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Driver Name</p>
                                    <p>{safeValue(selectedOrder.driver?.name)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Driver Phone</p>
                                    <p>{safeValue(selectedOrder.driver?.phone)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Driver Location (Lat)</p>
                                    <p>{safeValue(selectedOrder.driver_last_lat)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Driver Location (Lng)</p>
                                    <p>{safeValue(selectedOrder.driver_last_lng)}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Gas Cylinder Size</p>
                                    <p>{safeValue(selectedOrder.service_data?.gas?.cylinder_size)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Gas Brand</p>
                                    <p>{safeValue(selectedOrder.service_data?.gas?.brand)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Transaction Type</p>
                                    <p>{formatLabel(selectedOrder.service_data?.gas?.transaction_type)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Delivery Speed</p>
                                    <p>{formatLabel(selectedOrder.service_data?.gas?.delivery_speed)}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Created At</p>
                                    <p>{formatDate(selectedOrder.created_at)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Updated At</p>
                                    <p>{formatDate(selectedOrder.updated_at)}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default OrdersTable;
