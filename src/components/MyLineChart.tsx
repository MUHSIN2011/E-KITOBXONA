"use client"

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, BookOpen, RotateCcw } from 'lucide-react';
import { useGetAcademicYearsSummaryQuery } from '@/api/api';
import { useTranslations } from 'next-intl';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MyLineChart = () => {
  const { data: summary, isLoading } = useGetAcademicYearsSummaryQuery();
  const t = useTranslations('MultiyearAnalysis')

  const chartData = useMemo(() => {
    if (!summary) return { labels: [], rentals: [], returnRates: [] };

    const sorted = [...summary].sort((a, b) => a.year_id - b.year_id);

    return {
      labels: sorted.map(s => s.year_name),
      rentals: sorted.map(s => s.total_rentals),
      returnRates: sorted.map(s => s.return_rate)
    };
  }, [summary]);

  const options: any = {
    chart: {
      type: 'line', // Мо навъи Mixed (Line + Area) истифода мебарем
      toolbar: { show: false },
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    },
    stroke: {
      width: [4, 3], // Хатти якум ғафс, дуюм борикттар
      curve: 'smooth'
    },
    plotOptions: {
      bar: { columnWidth: '20%' }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: [0.4, 0.2],
        opacityTo: [0.1, 0.1],
        stops: [0, 90, 100]
      }
    },
    colors: ['#3b82f6', '#10B981'],
    labels: chartData.labels,
    markers: { size: 5, hover: { size: 7 } },
    yaxis: [
      {
        title: { text: 'Миқдори иҷора', style: { color: '#3b82f6' } },
        labels: { style: { colors: '#3b82f6' } }
      },
      {
        opposite: true,
        title: { text: 'Фоизи бозгашт (%)', style: { color: '#10B981' } },
        labels: { style: { colors: '#10B981' } }
      }
    ],
    xaxis: {
      axisBorder: { show: false },
      labels: { style: { colors: '#94a3b8', fontWeight: 600 } }
    },
    grid: { borderColor: 'rgba(148, 163, 184, 0.1)' },
    tooltip: { theme: 'dark', shared: true, intersect: false },
    legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#94a3b8' } }
  };

  const series = [
    {
      name: 'Умумии иҷора',
      type: 'area',
      data: chartData.rentals
    },
    {
      name: 'Фоизи бозгашт (%)',
      type: 'line',
      data: chartData.returnRates
    }
  ];

  if (isLoading) return <div className="flex h-[85vh] items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>;

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-[#111111] p-2 rounded-[15px] border border-slate-100 dark:border-slate-800/50 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {t('title')}
          </h3>
          <p className="text-sm text-slate-500 font-medium">{t('subtitle')}</p>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-3 py-2 rounded-2xl">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{t('legend.rental')}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-2xl">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{t('legend.return')}</span>
          </div>
        </div>
      </div>

      <Chart options={options} series={series} height={320} type="line" width="99%" />

      {summary && summary.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('stats.bestRate')}</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">
              {t('stats.bestRateValue', { value: Math.max(...summary.map(s => s.return_rate)) })}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('stats.averageBooks')}</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">
              {t('stats.averageBooksValue', { value: summary[summary.length - 1].avg_books_per_student })}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t('stats.yearStatus')}</p>
            <p className="text-lg font-bold text-blue-600">
              {summary[0]?.year_name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLineChart;