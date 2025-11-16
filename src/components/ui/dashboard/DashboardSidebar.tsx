// components/DashboardSidebar.tsx
"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Settings,
    BarChart3,
    Menu,
    X,
    Home,
    FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white  transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-6 ">
                    {/* <h2 className="text-2xl font-bold text-gray-800">MyApp</h2> */}
                    <Image src="/image/logo.png" alt="Logo" width={500} className="" height={500}></Image>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-gray-600 hover:text-gray-900"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <div   key={item.href} className="px-4 rounded-lg ">
                                <Link
                                  
                                    href={item.href}
                                    className={`flex items-center gap-4 px-6 py-3 text-gray-700 mb-2     rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition ${isActive
                                            ? "bg-gradient-to-l from-[#0776BD] to-[#51C7E1] text-white "
                                            : ""
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg lg:hidden"
            >
                <Menu size={24} />
            </button>
        </>
    );
}