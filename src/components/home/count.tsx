import { CheckCircle, CurlyBraces, DollarSign, Truck } from "lucide-react";
import First from "../icon/first";
import Second from "../icon/second";
import Third from "../icon/thrid";
import Four from "../icon/four";

const stats = [
    {
        id: 1,
        label: "Total Deliveries",
        value: "1,284",
        icon: <First />,
    },
    {
        id: 2,
        label: "In Transit",
        value: "42",
        icon: <Second />,
    },
    {
        id: 3,
        label: "Delivered",
        value: "1,195",
        icon: <Third/>,
    },
    {
        id: 4,
        label: "Total Spent",
        value: "$8,450",
        icon: <Four />,
    },
];

export default function Count() {
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
