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
        data: regionData,
    }];

    if (isLoading) {
        return (
            <div className="flex h-[85vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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