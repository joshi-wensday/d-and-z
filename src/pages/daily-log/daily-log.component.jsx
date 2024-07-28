// src/pages/daily-log/daily-log.component.jsx

import React, { useContext, useState, useEffect } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import './daily-log.styles.scss';

const DailyLog = () => {
  const { dailyLogs, updateMetric, currentDate, setDate, calculateFlamePoints, isLoading } = useContext(LifeSystemContext);
  const currentLog = dailyLogs.find(log => {
    const logDate = log.date instanceof Date ? log.date : log.date.toDate();
    return logDate.toDateString() === new Date(currentDate).toDateString();
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Reset notes when date changes
    setNotes('');
  }, [currentDate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the daily log to your backend
    console.log('Saving daily log:', { date: currentDate, metrics: currentLog ? currentLog.metrics : [], notes });
    alert('Daily log saved!');
  };

  const totalFP = calculateFlamePoints(currentLog ? currentLog.metrics : []);

  return (
    <div className="daily-log">
      <h1>Daily Log</h1>
      <form onSubmit={handleSubmit}>
        <div className="date-input">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={currentDate}
            onChange={handleDateChange}
          />
        </div>
        {currentLog ? currentLog.metrics.map(metric => (
          <div key={metric.id} className="metric-input">
            <label htmlFor={`metric-${metric.id}`}>{metric.name}:</label>
            <input
              id={`metric-${metric.id}`}
              type="number"
              value={metric.value}
              onChange={(e) => updateMetric(metric.id, e.target.value)}
            />
            {metric.attributes && metric.attributes.map(attr => (
              <div key={attr.name} className="attribute-input">
                <label htmlFor={`attr-${metric.id}-${attr.name}`}>{attr.name}:</label>
                <input
                  id={`attr-${metric.id}-${attr.name}`}
                  type="number"
                  value={metric.attributeValues?.[attr.name] || 0}
                  onChange={(e) => updateMetric(metric.id, metric.value, { [attr.name]: parseInt(e.target.value) || 0 })}
                />
              </div>
            ))}
          </div>
        )) : null}
        <div className="notes-input">
          <label htmlFor="notes">Daily Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
          />
        </div>
        <div className="total-fp">
          Total Flame Points: {totalFP}
        </div>
        <button type="submit">Save Daily Log</button>
      </form>
    </div>
  );
};

export default DailyLog;