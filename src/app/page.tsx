import Chart from "@/components/home/chart";
import Count from "@/components/home/count";
import RecentDeliveriesTable from "@/components/home/table";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8 mt-6 py-4 px-4 md:px-6 lg:px-8">
      <Count />
      <Link href="/create-new-delivery" className="bg-gradient-to-l from-[#0776BD] to-[#51C7E1] p-4 text-center flex items-center justify-center gap-4 text-2xl font-medium text-white rounded-lg ">
        <Plus size={24} />
        <p>New Delivery</p>
      </Link>
      <Chart />
      <RecentDeliveriesTable title="Recent Deliveries" />
    </div>
  );
}
