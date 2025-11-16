// components/DashboardHeader.tsx
"use client";

import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="bg-white mt-4 shadow-sm border border-primary rounded-lg px-4 md:px-6 py-4 lg:mr-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={22} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}