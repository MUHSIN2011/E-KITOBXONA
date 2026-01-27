"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { useGetRegionsQuery } from '@/src/api/api';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MyBarChart = () => {
    const { data: regions, isLoading } = useGetRegionsQuery();

    const regionNames = regions?.map((r) => r.name) || [];

    const regionData = regions?.map((r) => r.id) || [];

    const chartOptions: any = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                borderRadius: 12,
                horizontal: true, 
                barHeight: '80%',
            }
        },
        xaxis: {
            categories: regionNames, 
        },
        colors: ['#3B82F6'],
        dataLabels: {
            enabled: true,
        }
    };

    const chartSeries = [{
        name: 'Нишондиҳанда',
        data: [100,50,500,300,250,150],
    }];

    if (isLoading) {
        return (
            <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-gray-500">Дар ҳоли боргузорӣ...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-xl  border border-gray-100">
            <h2 className="text-lg font-bold  text-gray-700">Омори вилоятҳо</h2>
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={300}
            />
        </div>
    );
};

export default MyBarChart;