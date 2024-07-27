// src/components/flame-points-chart/flame-points-chart.component.jsx

import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { LifeSystemContext } from '../../context/life-system.context';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FlamePointsChart = () => {
  const { dailyLogs, calculateFlamePoints } = useContext(LifeSystemContext);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Flame Points',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const sortedLogs = [...dailyLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedLogs.map(log => log.date);
    const data = sortedLogs.map(log => calculateFlamePoints(log));

    setChartData({
      labels,
      datasets: [
        {
          label: 'Flame Points',
          data,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, [dailyLogs, calculateFlamePoints]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Flame Points Over Time',
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default FlamePointsChart;