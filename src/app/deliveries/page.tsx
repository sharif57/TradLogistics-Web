import RecentDeliveriesTable from '@/components/home/table'

export default function Deliveries() {
    const items = [
        {
            title: 'In Transit',
            count: 42
        },
        {
            title: 'Scheduled',
            count: 95
        },
        {
            title: 'Completed',
            count: 40
        }
    ]
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl py-4">
                {items?.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-[#F2F2F2] px-4 py-3 cursor-pointer rounded-lg"
                    >
                        {/* Title */}
                        <p className="text-lg font-medium text-[#1E1E1C]">
                            {item.title}
                        </p>

                        {/* Count Badge */}
                        <span className="flex items-center justify-center bg-secondary text-black w-8 h-8 rounded-full text-sm font-semibold">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>

            <RecentDeliveriesTable title="Deliveries" track="track" />
        </div>
    )
}
