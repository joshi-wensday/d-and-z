// src/pages/dashboard/dashboard.component.jsx

import React, { useContext } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import DailyTracker from '../../components/daily-tracker/daily-tracker.component';
import FlamePointsChart from '../../components/flame-points-chart/flame-points-chart.component';
import './dashboard.styles.scss';

const Dashboard = () => {
  const { habits } = useContext(LifeSystemContext);

  const totalFP = habits.reduce((sum, habit) => sum + (habit.value * habit.fpPerUnit), 0);
  const categorySums = habits.reduce((sums, habit) => {
    sums[habit.category] = (sums[habit.category] || 0) + (habit.value * habit.fpPerUnit);
    return sums;
  }, {});

  return (
    <div className="dashboard">
      <h1>Life System Dashboard</h1>
      <div className="summary">
        <h2>Today's Summary</h2>
        <p>Total Flame Points: {totalFP}</p>
        <h3>Breakdown by Category:</h3>
        <ul>
          {Object.entries(categorySums).map(([category, sum]) => (
            <li key={category}>{category}: {sum} FP</li>
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