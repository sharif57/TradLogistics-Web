
'use client';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    {
        name: 'January',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'February',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'March',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'April',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'May',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'June',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'July',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];


const Chart = () => {
    return (
        <div className='bg-white p-4 rounded-lg space-y-10'>
            <h1 className='text-3xl font-medium text-[#1E1E1C]'>Delivery Overview</h1>
            <BarChart
                style={{ width: '100%', maxWidth: '100%', maxHeight: '50vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar barSize={60} dataKey="pv" fill="#0A72B9" activeBar={<Rectangle fill="#0A72B9" stroke="blue" />} />
            </BarChart>
        </div>
    );
};

export default Chart;