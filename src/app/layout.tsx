import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import DashboardSidebar from "@/components/ui/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/ui/dashboard/DashboardHeader";
import Providers from "@/Provider/Providers";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Admin dashboard built with Next.js and Poppins font",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}  antialiased `}>
        <div className="flex gap- h-screen bg-[#E5E5E5]">
          {/* Sidebar */}

          <Providers>
            <DashboardSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <DashboardHeader />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto ">
                {/* <main className="flex-1 overflow-y-auto "> */}
                <Toaster />
                {children}
              </main>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
