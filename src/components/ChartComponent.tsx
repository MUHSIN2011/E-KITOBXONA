"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useGetDistrictsQuery } from '@/src/api/api';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MyBarChart = ({ regionId = 1 }) => {
    const { data: districts, isLoading } = useGetDistrictsQuery(regionId);

    const chartData = useMemo(() => {
        if (!districts || !Array.isArray(districts)) return { names: [], counts: [] };
        return {
            names: districts.map((d: any) => d.name || "Ноҳия"),
            counts: districts.map((d: any, i: any) => i + 5)
        };
    }, [districts]);

    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Inter, sans-serif',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                horizontal: true,
                barHeight: '70%',
                distributed: true,
            }
        },
        colors: ['#3B82F6'],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
                colors: ['#fff'],
                fontWeight: 600
            },
            formatter: (val: any) => `${val} мактаб`,
            offsetX: 10,
        },
        xaxis: {
            categories: chartData.names,
            labels: { show: true },
            axisBorder: { show: false }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 600,
                    colors: '#475569'
                }
            }
        },
        grid: {
            show: false,
        },
        tooltip: {
            enabled: true,
            theme: 'dark'
        },
        legend: { show: false }
    };

    const chartSeries = [{
        name: 'Миқдори мактабҳо',
        data: chartData.counts
    }];

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center h-[350px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Мактабҳо аз рӯи ноҳияҳо</h2>
                <p className="text-sm text-gray-500">Тақсимоти муассисаҳои таълимӣ дар ноҳияҳои вилоят</p>
            </div>

            <div className="min-h-[250px]">
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={280}
                />
            </div>

        </div>
    );
};

export default MyBarChart;