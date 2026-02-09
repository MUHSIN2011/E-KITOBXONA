"use client";

import React, { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGetDistrictsQuery, useGetRegionsQuery } from '@/src/api/api';
import { LayoutDashboard, MapPin, School } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });


const MyBarChart = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const isRegionUser = user?.role === 'region';
    const initialRegionId = isRegionUser ? Number(user?.region_id) : 1;

    const [selectedRegionId, setSelectedRegionId] = useState<number>(initialRegionId);

    useEffect(() => {
        if (isRegionUser && user?.region_id) {
            setSelectedRegionId(Number(user.region_id));
        }
    }, [isRegionUser, user]);

    const { data: regions } = useGetRegionsQuery();
    const { data: districtsData, isLoading } = useGetDistrictsQuery(selectedRegionId);

    const chartData = useMemo(() => {
        const data = districtsData as any;
        const items = Array.isArray(data) ? [...data] : [...(data?.items || [])];
        const sortedItems = items
            .filter((d: any) => d.schools_count > 0)
            .sort((a: any, b: any) => b.schools_count - a.schools_count);

        return {
            names: sortedItems.map((d: any) => d.name),
            counts: sortedItems.map((d: any) => d.schools_count)
        };
    }, [districtsData]);

    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                horizontal: true,
                barHeight: '55%',
                distributed: true,
                borderRadiusApplication: 'end',
                dataLabels: { position: 'top' },
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: "horizontal",
                shadeIntensity: 0.5,
                inverseColors: true,
                opacityFrom: 0.9,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'],
        dataLabels: {
            enabled: true,
            offsetX: -15,
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ["#fff"]
            },
            formatter: (val: any) => val,
        },
        grid: {
            borderColor: 'rgba(148, 163, 184, 0.1)',
            strokeDashArray: 4,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: false } }
        },
        xaxis: {
            categories: chartData.names,
            labels: {
                style: { colors: '#94a3b8', fontSize: '12px' }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '13px',
                    fontWeight: 600
                }
            }
        },
        tooltip: {
            theme: 'dark',
            custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                return `
                <div style="background: #0f172a; color: #fff; padding: 8px; border-radius: 8px; border: 1px solid #334155;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${w.config.colors[dataPointIndex]}"></span>
                        <span style="font-weight: bold; font-size: 14px;">${w.globals.labels[dataPointIndex]}</span>
                    </div>
                    <div style="font-size: 12px; color: #cbd5e1;">
                        Шумораи мактабҳо: <span style="color: #fff; font-weight: bold;">${series[seriesIndex][dataPointIndex]}</span>
                    </div>
                </div>
                `;
            }
        }
    };

    return (
        <div className="relative overflow-hidden bg-white dark:bg-[#111111] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800/50 transition-all hover:shadow-blue-500/5">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl">
                        <School className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 tracking-tight">
                            Таҳлили минтақавӣ
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                Миқдори муассисаҳо дар ноҳияҳо
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative group min-w-[180px]">
                    {!isRegionUser ? (
                        <>
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <MapPin className="w-4 h-4 text-blue-500" />
                            </div>
                            <select
                                value={selectedRegionId}
                                onChange={(e) => setSelectedRegionId(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                            >
                                {regions?.map((region: any) => (
                                    <option key={region.id} value={region.id} className="dark:bg-slate-900">
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                {regions?.find((r: any) => r.id === selectedRegionId)?.name || "Вилояти ман"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="min-h-[350px] w-full relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-slate-400">Дар ҳоли боргузорӣ...</span>
                    </div>
                ) : chartData.names.length > 0 ? (
                    <Chart
                        options={chartOptions}
                        series={[{ name: 'Мактабҳо', data: chartData.counts }]}
                        type="bar"
                        height={350}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                            <LayoutDashboard className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                            Дар ин минтақа ягон маълумот ёфт нашуд
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBarChart;