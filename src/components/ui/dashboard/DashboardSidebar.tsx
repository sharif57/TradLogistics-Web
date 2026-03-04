// /* eslint-disable react-hooks/set-state-in-effect */


'use client';

import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  CarFront,
  Menu,
  X,
  LogOut,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { MdOutlineSupportAgent, MdPayment } from "react-icons/md";
import { useUserProfileQuery } from "@/redux/feature/userSlice";
import { logout } from "@/service/authService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Box from "@/components/icon/sidebar/box";
import Car from "@/components/icon/sidebar/car";
import Order from "@/components/icon/sidebar/order";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BarChart3, label: "Deliveries", href: "/deliveries" },
  { icon: MdPayment, label: "Payment", href: "/payment" },
  { icon: MdOutlineSupportAgent, label: "Support", href: "/support" },
  { icon: Inbox, label: "Inbox", href: "/inbox" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const gasCompanyMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Car, label: "Fleet & Drivers", href: "/fleet-drivers" },
  { icon: Box, label: "Inventory", href: "/inventory" },
  { icon: Order, label: "Orders", href: "/orders" },
  { icon: Settings, label: "Payments", href: "/payments" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const businessTypeMenuMap = {
  ecommerce: menuItems,
  gas_company: gasCompanyMenuItems,
} as const;

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);


  const { data } = useUserProfileQuery(undefined);

  // Hide sidebar on auth pages
  if (
    [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/verify-email",
      "/auth/business-information",
      "/auth/sign-up",
      "/auth/forgot-otp"
    ].includes(pathname)
  ) {
    return null;
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const businessType = data?.data?.business_type as keyof typeof businessTypeMenuMap | undefined;
  const activeMenuItems = businessType ? businessTypeMenuMap[businessType] ?? menuItems : menuItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-blue-500/50 bg-opacity-50 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo + close btn (mobile) */}
        <div>
          <div className="flex items-center justify-between lg:justify-center p-6 mt-8">
            <Image src="/image/logo.png" alt="Logo" width={120} height={50} priority />
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="mt-6 space-y-2 px-3">
            {activeMenuItems.map((item) => {
              const Icon = item.icon;
              // Highlight if exact match OR if we're inside that section
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              const itemClassName = cn(
                "group relative isolate overflow-hidden flex items-center gap-3.5 rounded-xl px-5 py-3 text-sm font-medium",
                "transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                isActive
                  ? "bg-gradient-to-l from-[#0776BD] to-[#51C7E1] text-white shadow-sm"
                  : "text-gray-700 hover:text-primary"
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={itemClassName}
                  onClick={() => setIsOpen(false)}
                >
                  {!isActive ? (
                    <>
                      <span className="absolute inset-0 -z-10 -translate-x-full bg-primary/10 transition-transform duration-300 ease-out group-hover:translate-x-0" />
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-primary/70 origin-center scale-y-0 transition-transform duration-200 ease-out group-hover:scale-y-100" />
                    </>
                  ) : (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-white/80" />
                  )}
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    <Icon size={20} />
                  </span>
                  <span className="transition-transform text-lg font-normal duration-200 group-hover:translate-x-0.5">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>
    </>
  );
}