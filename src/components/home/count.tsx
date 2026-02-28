'use client';
import First from "../icon/first";
import Second from "../icon/second";
import Third from "../icon/thrid";
import Four from "../icon/four";
import { useGetClientDashboardQuery } from "@/redux/feature/deliverySlice";
import { useState } from "react";


export default function Count() {
    const { data } = useGetClientDashboardQuery(undefined);
    const dashboardData = data?.data;

    const stats = [
        {
            id: 1,
            label: "Total Deliveries",
            value: dashboardData?.total_deliveries || "0",
            icon: <First />,
        },
        {
            id: 2,
            label: "In Transit",
            value: dashboardData?.total_in_transit || "0",
            icon: <Second />,
        },
        {
            id: 3,
            label: "Delivered",
            value: dashboardData?.total_delivered || "0",
            icon: <Third />,
        },
        {
            id: 4,
            label: "Total Spent",
            value: dashboardData?.total_spend ? `$${dashboardData.total_spend}` : "$0",
            icon: <Four />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
            {stats.map((stat) => (
                <div
                    key={stat.id}
                    className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex items-center justify-center rounded-xl bg-[#e7f1f8] p-4 size-16 `}
                        >
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xl text-[#383838] font-normal">{stat.label}</p>
                            <p className="text-xl lg:text-5xl font-semibold text-[#1E1E1C]"> {stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
