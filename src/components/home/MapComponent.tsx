"use client";
import Wifi from "../icon/wifi";
import Offline from "../icon/Offline";
import Track from "../icon/Track";

import { useDashboardQuery } from "@/redux/feature/gasCompany/dashboardSlice";
import LiveMap from "../Map";


export default function MapComponent() {

    const { data } = useDashboardQuery(undefined);

    const counterData = data?.data

    const stats = [
        {
            id: 1,
            label: "Online",
            value: `${counterData?.drivers?.online || 0} Drivers`,
            icon: <Wifi />,
        },
        {
            id: 2,
            label: "On Delivery",
            value: `${counterData?.drivers?.on_delivery || 0} Drivers`,
            icon: <Track />,
        },
        {
            id: 3,
            label: "Offline",
            value: `${counterData?.drivers?.offline || 0} Drivers`,
            icon: <Offline />,
        },
    ];



    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">

            {/* Map Section */}
            <div className="lg:col-span-2 w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                <LiveMap />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-md"
                    >
                        <div className="flex items-center justify-center rounded-xl  p-4 size-14">
                            {stat.icon}
                        </div>

                        <div className="space-y-2">
                            <p className="text-xl font-medium text-[#383838]">{stat.label}</p>
                            <p className="text-2xl lg:text-4xl font-semibold text-[#1E1E1C]">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
