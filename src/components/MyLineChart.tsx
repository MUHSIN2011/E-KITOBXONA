"use client"

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MyLineChart = () => {
  const options: any = {
    chart: {
      height: 350,
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#94a3b8', // Ранги текстҳо дар Dark Mode
    },
    theme: {
      mode: 'dark', // Режими торики ApexCharts
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth', 
      width: 4,
      colors: ['#10B981'], // Ранги сабзи дурахшон
    },
    markers: {
      size: 4,
      colors: ['#10B981'],
      strokeColors: '#1a1a1a',
      strokeWidth: 2,
      hover: { size: 6 }
    },
    grid: {
      borderColor: '#334155', // Ранги хатҳои сетка (Slate-700)
      strokeDashArray: 3,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      row: {
        colors: ['transparent', 'transparent'], // Рангҳои қаториро тоза кардем барои Dark Mode
        opacity: 0.1
      },
    },
    xaxis: {
      categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#94a3b8' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8' }
      }
    },
    tooltip: {
      theme: 'dark',
      x: { show: true },
      y: {
        formatter: (val: number) => `${val} адад`
      }
    },
    colors: ['#10B981'],
  };

  const series = [{
    name: "Китобҳои додашуда",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }];

  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="mb-4">
        <h3 className="text-md font-bold text-gray-800 dark:text-slate-100">Динамикаи тақсимот</h3>
        <p className="text-xs text-gray-500 dark:text-slate-500">Миқдори китобҳо дар моҳҳои охир</p>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="line" 
        height={300} 
      />
    </div>
  );
};

export default MyLineChart;