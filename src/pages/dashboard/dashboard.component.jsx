// src/pages/dashboard/dashboard.component.jsx

import React, { useContext } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import DailyTracker from '../../components/daily-tracker/daily-tracker.component';
import FlamePointsChart from '../../components/flame-points-chart/flame-points-chart.component';
import './dashboard.styles.scss';

const Dashboard = () => {
  const { calculateFlamePoints, isLoading, currentLog, currentDate } = useContext(LifeSystemContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalFP = currentLog ? calculateFlamePoints(currentLog.metrics) : 0;

  const categorySums = currentLog ? currentLog.metrics.reduce((sums, metric) => {
    if (metric.category) {
      sums[metric.category] = (sums[metric.category] || 0) + calculateFlamePoints([metric]);
    }
    return sums;
  }, {}) : {};

  return (
    <div className="dashboard">
      <h1>Life System Dashboard</h1>
      <div className="summary">
        <h2>Today's Summary</h2>
        <p>Total Flame Points: {totalFP.toFixed(2)}</p>
        <h3>Breakdown by Category:</h3>
        <ul>
          {Object.entries(categorySums).map(([category, sum]) => (
            <li key={category}>{category}: {sum.toFixed(2)} FP</li>
          ))}
        </ul>
      </div>
      <div className="chart-container">
        <h2>Flame Points Progress</h2>
        <FlamePointsChart />
      </div>
      <DailyTracker />
    </div>
  );
};

export default Dashboard;