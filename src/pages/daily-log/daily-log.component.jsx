// src/pages/daily-log/daily-log.component.jsx
import React, { useContext, useState } from 'react';
import { LifeSystemContext } from '../../context/life-system.context';
import './daily-log.styles.scss';

const DailyLog = () => {
  const { habits, updateHabit } = useContext(LifeSystemContext);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the daily log to your backend
    console.log('Saving daily log:', { habits, notes });
    alert('Daily log saved!');
  };

  return (
    <div className="daily-log">
      <h1>Daily Log</h1>
      <form onSubmit={handleSubmit}>
        {habits.map(habit => (
          <div key={habit.id} className="habit-input">
            <label htmlFor={`habit-${habit.id}`}>{habit.name}:</label>
            <input
              id={`habit-${habit.id}`}
              type="number"
              value={habit.value}
              onChange={(e) => updateHabit(habit.id, e.target.value)}
            />
          </div>
        ))}
        <div className="notes-input">
          <label htmlFor="notes">Daily Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
          />
        </div>
        <button type="submit">Save Daily Log</button>
      </form>
    </div>
  );
};

export default DailyLog;