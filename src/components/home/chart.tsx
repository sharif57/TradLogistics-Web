
'use client';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useGetClientDashboardQuery } from '@/redux/feature/deliverySlice';
import { useState } from 'react';

const years = [
    { value: 2026, label: '2026' },
    { value: 2025, label: '2027' },
    { value: 2024, label: '2028' },
    { value: 2023, label: '2029' },
    { value: 2022, label: '2030' },
];


const Chart = () => {

    const [year, setYear] = useState(new Date().getFullYear());
    const { data: dashboardData, isFetching } = useGetClientDashboardQuery({
        year,
    });

    const chartData = dashboardData?.data?.delivery_overview?.data?.map((item) => ({
        name: item.label,
        value: item.amount,
        amount: item.amount,
    })) || [];

    const maxValue = Math.max(...chartData.map((item) => item.value), 0);
    const roundedMax = Math.max(100, Math.ceil(maxValue / 100) * 100);
    const yAxisTicks = Array.from({ length: roundedMax / 100 + 1 }, (_, index) => index * 100);

    return (
        <div className='bg-white p-4 rounded-lg space-y-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-medium text-[#1E1E1C]'>Delivery Overview</h1>
                <div>
                    <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {years?.map((year) => (
                                    <SelectItem key={year.value} value={year.value.toString()}>
                                        {year.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <BarChart
                style={{ width: '100%', maxWidth: '100%', maxHeight: '50vh', aspectRatio: 1.618 }}
                responsive
                data={chartData}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" domain={[0, roundedMax]} ticks={yAxisTicks} />
                <Tooltip
                    formatter={(_value, _name, item) => {
                        const amount = Number(item?.payload?.amount || 0);
                        return [`$${amount.toFixed(2)}`, 'Amount'];
                    }}
                />
                {/* <Legend /> */}
                <Bar barSize={60} dataKey="value" fill="#0A72B9" activeBar={<Rectangle fill="#0A72B9" stroke="blue" />} />
            </BarChart>
            {!isFetching && chartData.length === 0 && (
                <p className='text-center text-sm text-gray-500'>No delivery overview data found for {year}.</p>
            )}
        </div>
    );
};

export default Chart;