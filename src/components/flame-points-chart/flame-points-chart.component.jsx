// src/components/flame-points-chart/flame-points-chart.component.jsx

import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { LifeSystemContext } from '../../context/life-system.context';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FlamePointsChart = () => {
  const { dailyLogs, calculateFlamePoints, currentDate } = useContext(LifeSystemContext);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const sortedLogs = dailyLogs.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : a.date.toDate();
      const dateB = b.date instanceof Date ? b.date : b.date.toDate();
      return dateA - dateB;
    });
    const labels = sortedLogs.map(log => {
      const logDate = log.date instanceof Date ? log.date : log.date.toDate();
      return logDate.toLocaleDateString();
    });
    const data = sortedLogs.map(log => calculateFlamePoints(log.metrics || []));

    const currentDateIndex = labels.findIndex(date => date === new Date(currentDate).toLocaleDateString());

    setChartData({
      labels,
      datasets: [
        {
          label: 'Flame Points',
          data,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          pointBackgroundColor: labels.map((_, index) => 
            index === currentDateIndex ? 'rgb(255, 255, 0)' : 'rgba(255, 99, 132, 0.5)'
          ),
          pointRadius: labels.map((_, index) => 
            index === currentDateIndex ? 8 : 4
          ),
        },
      ],
    });
  }, [dailyLogs, calculateFlamePoints, currentDate]);

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