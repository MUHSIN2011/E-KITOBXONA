"use client"

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MyLineChart = () => {
  // Танзимотҳои чарт
  const options: any = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth', 
      width: 3
    },
    title: {
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#374151'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
    },
    colors: ['#10B981'], // Ранги сабз
  };

  // Маълумот барои нишон додан
  const series = [{
    name: "Китобҳои додашуда",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }];

  return (
      <Chart 
        options={options} 
        series={series} 
        type="line" 
        height={300} 
      />
  );
};

export default MyLineChart;