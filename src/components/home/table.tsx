"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

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

const RecentDeliveriesTable = () => {
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
  const menuRef = useRef<HTMLDivElement>(null);

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
      const aValue = a[ sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

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
          Recent Deliveries
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(item.delivery_id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === item.delivery_id && (
                        <div className="absolute right-4 top-12 w-48 bg-white rounded-lg shadow-xl border z-50">
                          <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100">
                            Edit
                          </button>
                          <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100">
                            View Details
                          </button>
                          <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50">
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
