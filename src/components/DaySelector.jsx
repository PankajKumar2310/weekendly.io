// src/components/DaySelector.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEnabledDays } from '../redux/slices/scheduleSlice';

const allDays = ['friday', 'saturday', 'sunday', 'monday'];

const DaySelector = () => {
  const dispatch = useDispatch();
  const enabledDays = useSelector(state => state.schedule.enabledDays || ['saturday', 'sunday']);

  const toggleDay = (day) => {
    const isEnabled = enabledDays.includes(day);
    let next;
    if (isEnabled) {
      next = enabledDays.filter(d => d !== day);
    } else {
      next = [...enabledDays, day].sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b));
    }
    // Ensure at least one day remains
    if (next.length === 0) return;
    dispatch(setEnabledDays(next));
  };

  const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="flex items-center gap-2">
      {allDays.map(day => (
        <button
          key={day}
          onClick={() => toggleDay(day)}
          className={`px-2 py-1 rounded-full text-sm font-medium border transition-colors capitalize ${
            enabledDays.includes(day)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          aria-pressed={enabledDays.includes(day)}
          aria-label={`Toggle ${day}`}
        >
          {titleCase(day)}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;


