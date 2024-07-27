// src/components/daily-tracker/daily-tracker.component.jsx

import React, { useContext } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import './daily-tracker.styles.scss';

const DailyTracker = () => {
  const { habits, updateHabit, currentDate, setDate, calculateFlamePoints } = useContext(LifeSystemContext);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const totalFP = calculateFlamePoints(habits.reduce((log, habit) => {
    log[habit.name] = habit.value;
    return log;
  }, {}));

  return (
    <div className="daily-tracker">
      <h2>Daily Habit Tracker</h2>
      <input type="date" value={currentDate} onChange={handleDateChange} />
      {habits.map(habit => (
        <div key={habit.id} className="habit-input">
          <label>
            {habit.name} ({habit.fpPerUnit > 0 ? '+' : ''}{habit.fpPerUnit} FP per unit):
          </label>
          <input
            type="number"
            value={habit.value}
            onChange={(e) => updateHabit(habit.id, e.target.value)}
          />
        </div>
      ))}
      <div className="total-fp">
        Total Flame Points: {totalFP}
      </div>
    </div>
  );
};

export default DailyTracker;