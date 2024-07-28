// src/components/daily-tracker/daily-tracker.component.jsx

import React, { useContext, useState, useEffect } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import './daily-tracker.styles.scss';
import { auth, addMetricToDailyLog, addUserDailyLog } from '../../utils/firebase/firebase.utils';

const DailyTracker = () => {
  const { currentLog, updateMetric, currentDate, setDate, calculateFlamePoints, lifeSystemData } = useContext(LifeSystemContext);
  const [showNewMetricsDropdown, setShowNewMetricsDropdown] = useState(false);

  useEffect(() => {
    // This effect will run whenever lifeSystemData or currentLog changes
  }, [lifeSystemData, currentLog]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleAttributeChange = (metricId, attrName, value) => {
    if (currentLog) {
      const metric = currentLog.metrics.find(m => m.id === metricId);
      if (metric) {
        updateMetric(metricId, metric.value, { [attrName]: parseInt(value) || 0 });
      }
    }
  };

  const totalFP = currentLog ? calculateFlamePoints(currentLog.metrics) : 0;

  const newMetrics = lifeSystemData.filter(metric => 
    !currentLog?.metrics.some(logMetric => logMetric.id === metric.id)
  );

  const handleAddNewMetric = async (metricId) => {
    console.log('handleAddNewMetric called with metricId:', metricId);
    const newMetric = lifeSystemData.find(m => m.id === metricId);
    console.log('newMetric:', newMetric);
    console.log('currentLog:', currentLog);
    console.log('currentDate:', currentDate);
    if (newMetric) {
      try {
        if (currentLog && currentLog.id) {
          console.log('Adding metric to existing log');
          await addMetricToDailyLog(auth.currentUser.uid, currentLog.id, { ...newMetric, value: 0 });
        } else {
          console.log('Creating new log');
          const newLog = {
            date: new Date(currentDate),
            metrics: [{ ...newMetric, value: 0 }]
          };
          console.log('New log:', newLog);
          await addUserDailyLog(auth.currentUser.uid, newLog);
        }
        console.log('Updating metric');
        updateMetric(metricId, 0);
      } catch (error) {
        console.error("Error adding new metric to daily log:", error);
      }
    } else {
      console.log('New metric not found in lifeSystemData');
    }
    setShowNewMetricsDropdown(false);
  };

  return (
    <div className="daily-tracker">
      <h2>Daily Habit Tracker</h2>
      <input type="date" value={currentDate} onChange={handleDateChange} />
      {currentLog ? currentLog.metrics.map(metric => (
        <div key={metric.id} className="habit-input">
          <label>
            {metric.name}:
          </label>
          <input
            type="number"
            value={metric.value || 0}
            onChange={(e) => updateMetric(metric.id, e.target.value)}
          />
          {metric.attributes && metric.attributes.map(attr => (
            <div key={attr.name}>
              <label>{attr.name}:</label>
              <input
                type="number"
                value={metric.attributeValues?.[attr.name] || 0}
                onChange={(e) => handleAttributeChange(metric.id, attr.name, e.target.value)}
              />
            </div>
          ))}
        </div>
      )) : null}
      <div className="total-fp">
        Total Flame Points: {totalFP.toFixed(2)}
      </div>
      {newMetrics.length > 0 && (
        <div className="new-metrics-dropdown">
          <button onClick={() => setShowNewMetricsDropdown(!showNewMetricsDropdown)}>
            Add New Metrics
          </button>
          {showNewMetricsDropdown && (
            <ul>
              {newMetrics.map(metric => (
                <li key={metric.id}>
                  <button onClick={() => handleAddNewMetric(metric.id)}>
                    {metric.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyTracker;