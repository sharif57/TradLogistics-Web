import Second from "../icon/second";
import Wifi from "../icon/wifi";
import Five from "../icon/Five";

const stats = [
    {
        id: 1,
        label: "Total Trucks",
        value: "1,284",
        icon: <Second />,
    },
    {
        id: 2,
        label: "Active Drivers",
        value: "42",
        icon: <Wifi />,
    },
    {
        id: 3,
        label: "On Delivery",
        value: "1,195",
        icon: <Second   />,
    },
    {
        id: 4,
        label: "Offline Drivers",
        value: "47",
        icon: <Five />,
    },
];

export default function Fleet() {
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
