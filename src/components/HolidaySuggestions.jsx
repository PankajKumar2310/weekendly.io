// src/components/HolidaySuggestions.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEnabledDays } from '../redux/slices/scheduleSlice';

// Simple upcoming holiday/weekend suggestion logic (client-only, no APIs)
// Suggest common 3-day weekends around next month (Fri-Sun or Sat-Mon)
function getSuggestedLongWeekends(today = new Date()) {
  const suggestions = [];
  const base = new Date(today);
  base.setDate(base.getDate() + 1);
  const end = new Date(today);
  end.setMonth(end.getMonth() + 2);

  for (let d = new Date(base); d < end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0 Sun .. 6 Sat
    // Fri-Sun block if Friday
    if (day === 5) {
      suggestions.push({ key: `fri-sun-${d.toISOString().slice(0,10)}`, label: `Fri–Sun (${d.toLocaleDateString()})`, days: ['friday', 'saturday', 'sunday'] });
    }
    // Sat-Mon block if Saturday
    if (day === 6) {
      const satLabel = d.toLocaleDateString();
      suggestions.push({ key: `sat-mon-${d.toISOString().slice(0,10)}`, label: `Sat–Mon (${satLabel})`, days: ['saturday', 'sunday', 'monday'] });
    }
  }

  return suggestions.slice(0, 5);
}

const HolidaySuggestions = () => {
  const dispatch = useDispatch();
  const enabledDays = useSelector(state => state.schedule.enabledDays || ['saturday', 'sunday']);
  const suggestions = useMemo(() => getSuggestedLongWeekends(), []);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-lg p-2 overflow-x-auto">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-gray-700 whitespace-nowrap">Suggested long weekends:</span>
        <div className="flex items-center gap-2">
          {suggestions.map(s => (
            <button
              key={s.key}
              onClick={() => dispatch(setEnabledDays(s.days))}
              className={`px-2 py-1 rounded-full border text-xs whitespace-nowrap ${
                JSON.stringify(enabledDays) === JSON.stringify(s.days)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              title={s.label}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolidaySuggestions;


