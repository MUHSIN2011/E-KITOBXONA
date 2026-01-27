"use client" // Ин муҳим аст, зеро ApexCharts дар Client-side кор мекунад

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DonutChart = () => {
  const series = [44, 55, 41, 17, 15];

  const options: any = {
    chart: {
      type: 'donut',
    },
    labels: ['Вилояти Суғд', 'Хатлон', 'Душанбе', 'ВМКБ', 'НТҶ'],
    
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
    legend: {
        position: 'right',
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl  border border-gray-100">
      <h3 className="text-lg font-semibold  text-gray-700">Тақсимоти буҷет</h3>
      <p className='text-foreground text-sm mb-5'>Истифодаи буҷети миллӣ</p>
      <div className="flex justify-center">
        <Chart
          options={options}
          series={series}
          type="donut"
          width="400"
        />
      </div>
    </div>
  );
};

export default DonutChart;