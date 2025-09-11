// src/components/WeekendSchedule.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import DaySchedule from './DaySchedule';

const WeekendSchedule = () => {
  const schedule = useSelector(state => state.schedule);
  const enabledDays = schedule.enabledDays || ['saturday', 'sunday'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Your Weekend Plan</h2>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </div>
      
      <div className={`grid grid-cols-1 ${enabledDays.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {enabledDays.map((day) => (
          <DaySchedule key={day} day={day} activities={schedule[day] || []} />
        ))}
      </div>
    </div>
  );
};

export default WeekendSchedule;