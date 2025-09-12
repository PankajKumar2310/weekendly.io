// src/components/HolidaySuggestions.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEnabledDays } from '../redux/slices/scheduleSlice';
import { useIndianHolidays } from '../hooks/useIndianHolidays';

// Generate weekend suggestions based on Indian holidays
function getHolidayWeekendSuggestions(holidays = [], today = new Date()) {
  const suggestions = [];
  const currentYear = today.getFullYear();
  
  // Filter holidays for current and next year
  const relevantHolidays = holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date.iso);
    const holidayYear = holidayDate.getFullYear();
    return holidayYear === currentYear || holidayYear === currentYear + 1;
  });

  relevantHolidays.forEach(holiday => {
    const holidayDate = new Date(holiday.date.iso);
    const dayOfWeek = holidayDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Skip if holiday is in the past
    if (holidayDate < today) return;
    
    const formattedDate = holidayDate.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    
    // Show all weekend and long weekend holidays
    if (dayOfWeek === 0) { // Sunday holiday
      suggestions.push({
        key: `holiday-sun-${holiday.date.iso}`,
        label: `${holiday.name} (Sun, ${formattedDate})`,
        days: ['saturday', 'sunday', 'monday'],
        holiday: holiday.name,
        date: holidayDate,
        dayType: 'Sunday Holiday'
      });
    } else if (dayOfWeek === 6) { // Saturday holiday
      suggestions.push({
        key: `holiday-sat-${holiday.date.iso}`,
        label: `${holiday.name} (Sat, ${formattedDate})`,
        days: ['saturday', 'sunday', 'monday'],
        holiday: holiday.name,
        date: holidayDate,
        dayType: 'Saturday Holiday'
      });
    } else if (dayOfWeek === 5) { // Friday holiday
      suggestions.push({
        key: `holiday-fri-${holiday.date.iso}`,
        label: `${holiday.name} (Fri, ${formattedDate})`,
        days: ['friday', 'saturday', 'sunday'],
        holiday: holiday.name,
        date: holidayDate,
        dayType: 'Friday Holiday'
      });
    } else if (dayOfWeek === 1) { // Monday holiday
      suggestions.push({
        key: `holiday-mon-${holiday.date.iso}`,
        label: `${holiday.name} (Mon, ${formattedDate})`,
        days: ['friday', 'saturday', 'sunday'],
        holiday: holiday.name,
        date: holidayDate,
        dayType: 'Monday Holiday'
      });
    }
  });

  // Sort by date and return all (not just top 5)
  return suggestions.sort((a, b) => a.date - b.date);
}

// Fallback function for when API is not available
function getFallbackWeekendSuggestions(today = new Date()) {
  const suggestions = [];
  const base = new Date(today);
  base.setDate(base.getDate() + 1);
  const end = new Date(today);
  end.setMonth(end.getMonth() + 2);

  for (let d = new Date(base); d < end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay(); // 0 Sun .. 6 Sat
    // Fri-Sun block if Friday
    if (day === 5) {
      suggestions.push({ 
        key: `fri-sun-${d.toISOString().slice(0,10)}`, 
        label: `Fri–Sun (${d.toLocaleDateString()})`, 
        days: ['friday', 'saturday', 'sunday'] 
      });
    }
    // Sat-Mon block if Saturday
    if (day === 6) {
      const satLabel = d.toLocaleDateString();
      suggestions.push({ 
        key: `sat-mon-${d.toISOString().slice(0,10)}`, 
        label: `Sat–Mon (${satLabel})`, 
        days: ['saturday', 'sunday', 'monday'] 
      });
    }
  }

  return suggestions.slice(0, 5);
}

const HolidaySuggestions = () => {
  const dispatch = useDispatch();
  const enabledDays = useSelector(state => state.schedule.enabledDays || ['saturday', 'sunday']);
  const currentYear = new Date().getFullYear();
  
  // Use Indian holidays API
  const { data: holidays, isLoading, error } = useIndianHolidays(currentYear);
  
  const suggestions = useMemo(() => {
    if (holidays && holidays.length > 0) {
      return getHolidayWeekendSuggestions(holidays);
    }
    return getFallbackWeekendSuggestions();
  }, [holidays]);

  if (suggestions.length === 0 && !isLoading) return null;

  return (
    <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-2">
          {isLoading ? 'Loading holiday suggestions...' : 
           error ? 'Holiday suggestions (fallback):' : 
           'Weekend & Long Weekend Holidays:'}
        </h3>
        {error && (
          <div className="text-red-500 text-xs mb-2">API unavailable, showing fallback suggestions</div>
        )}
      </div>
      
      {isLoading ? (
        <div className="text-gray-500 text-sm">Loading holiday data...</div>
      ) : (
        <div className="space-y-2">
          {suggestions.length === 0 ? (
            <div className="text-gray-500 text-sm">No weekend holidays found for this year</div>
          ) : (
            suggestions.map(s => (
              <div key={s.key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">{s.holiday}</div>
                  <div className="text-xs text-gray-600">{s.dayType} • {s.date.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</div>
                </div>
                <button
                  onClick={() => dispatch(setEnabledDays(s.days))}
                  className={`px-3 py-1 rounded-full border text-xs whitespace-nowrap transition-colors ${
                    JSON.stringify(enabledDays) === JSON.stringify(s.days)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-emerald-300'
                  }`}
                  title={`Set ${s.days.join(', ')} as enabled days`}
                >
                  {s.days.length === 3 ? '3-Day Weekend' : '2-Day Weekend'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HolidaySuggestions;


