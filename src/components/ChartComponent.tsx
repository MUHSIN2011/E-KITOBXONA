"use client";

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGetDistrictsQuery, useGetRegionsQuery } from '@/src/api/api';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MyBarChart = () => {
    const [selectedRegionId, setSelectedRegionId] = useState<number>(1);

    const { data: regions } = useGetRegionsQuery();
    const { data: districtsData, isLoading } = useGetDistrictsQuery(selectedRegionId);

    const chartData = useMemo(() => {
        const data = districtsData as any;
        const items = Array.isArray(data) ? [...data] : [...(data?.items || [])];

        items.sort((a: any, b: any) => b.schools_count - a.schools_count);

        return {
            names: items.map((d: any) => d.name),
            counts: items.map((d: any) => d.schools_count)
        };
    }, [districtsData]);

    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Inter, sans-serif',
            // Ин қисм барои мутобиқшавӣ ба Dark Mode муҳим аст
            background: 'transparent',
            foreColor: '#94a3b8',
        },
        theme: {
            mode: 'dark', // Ин автоматикӣ эффектҳои торикро илова мекунад
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                horizontal: true,
                barHeight: '60%',
                distributed: true,
            }
        },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F43F5E'],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
                fontSize: '12px',
                fontWeight: 700,
                colors: ['#fff']
            },
            formatter: (val: any) => `${val}`,
            offsetX: 5,
            dropShadow: { enabled: true }
        },
        xaxis: {
            categories: chartData.names,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#94a3b8', fontSize: '12px' }
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '11px',
                    fontWeight: 600,
                    colors: '#f8fafc' // Ранги номи ноҳияҳо дар режими торик
                }
            }
        },
        grid: {
            borderColor: '#334155', // Ранги хатҳои сетка дар Dark Mode
            strokeDashArray: 4,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: false } }
        },
        tooltip: {
            theme: 'dark', // Тоолтип ҳам бояд торик бошад
            y: {
                formatter: (val: number) => `${val} адад мактаб`
            }
        },
        legend: { show: false }
    };

    return (
        <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 tracking-tight">Мактабҳо аз рӯи ноҳияҳо</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Омори умумии муассисаҳо</p>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/50 p-1 px-3 rounded-lg border border-gray-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-500">Минтақа:</span>
                    <select
                        value={selectedRegionId}
                        onChange={(e) => setSelectedRegionId(Number(e.target.value))}
                        className="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-slate-200 focus:ring-0 outline-none cursor-pointer"
                    >
                        {regions?.map((region: any) => (
                            <option key={region.id} value={region.id} className="dark:bg-[#1a1a1a]">
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="min-h-[300px] flex items-center justify-center">
                {isLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : chartData.names.length > 0 ? (
                    <div className="w-full">
                        <Chart
                            options={chartOptions}
                            series={[{ name: 'Миқдори мактабҳо', data: chartData.counts }]}
                            type="bar"
                            height={320}
                        />
                    </div>
                ) : (
                    <p className="text-gray-400 dark:text-slate-500 text-sm italic">Маълумот дар ин минтақа ёфт нашуд</p>
                )}
            </div>
        </div>
    );
};

export default MyBarChart;