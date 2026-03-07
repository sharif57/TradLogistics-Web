
import First from "../icon/first";
import Second from "../icon/second";
import Third from "../icon/thrid";
import Doller from "../icon/doller";
import { useGetClientDashboardQuery } from "@/redux/feature/deliverySlice";
import { useDashboardQuery } from "@/redux/feature/gasCompany/dashboardSlice";



export default function GasCounter() {

    const { data } = useDashboardQuery(undefined);
    console.log(data?.data, '======gas')

    const counterData = data?.data

    const stats = [
        {
            id: 1,
            label: "Total Orders (Today)",
            value: counterData?.today_total_order || "0",
            icon: <First />,
        },
        {
            id: 2,
            label: "In Transit",
            value: counterData?.in_transit || "0",
            icon: <Second />,
        },
        {
            id: 3,
            label: "Completed Deliveries",
            value: counterData?.completed_deliveries || "0",
            icon: <Third />,
        },
        {
            id: 4,
            label: "Revenue (Today)",
            value: `$${counterData?.today_total_revenue}`,
            icon: <Doller />,
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
