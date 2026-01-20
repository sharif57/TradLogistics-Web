import GasLite from "../icon/gasLite";
import Gass from "../icon/gass";
import Error from "../icon/error";
import Pending from "../icon/pendding";

const stats = [
    {
        id: 1,
        label: "Total Full Cylinders",
        value: "12",
        icon: <GasLite />,
    },
    {
        id: 2,
        label: "Total Empty Cylinders",
        value: "42",
        icon: <Gass />,
    },
    {
        id: 3,
        label: "Low Stock Trucks",
        value: "95",
        icon: <Error />,
    },
    {
        id: 4,
        label: "Pending Refills",
        value: "8",
        icon: <Pending />,
    },
];

export default function InventoryCounter() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
            {stats.map((stat) => (
                <div
                    key={stat.id}
                    className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex items-center justify-center rounded-xl  p-4 size-16 `}
                        >
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xl text-[#383838] font-normal">{stat.label}</p>
                            <p className="text-xl lg:text-3xl font-semibold text-[#1E1E1C]"> {stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
