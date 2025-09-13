// src/components/HolidaySuggestions.jsx
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEnabledDays } from '../redux/slices/scheduleSlice';
import { useIndianHolidays } from '../hooks/useIndianHolidays';
import { 
  FiCalendar, 
  FiChevronDown, 
  FiChevronUp, 
  FiStar, 
  FiClock, 
  FiMapPin,
  FiGift,
  FiSun,
  FiMoon
} from 'react-icons/fi';

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
        days: ['friday', 'saturday', 'sunday'],
        date: new Date(d)
      });
    }
    // Sat-Mon block if Saturday
    if (day === 6) {
      const satLabel = d.toLocaleDateString();
      suggestions.push({ 
        key: `sat-mon-${d.toISOString().slice(0,10)}`, 
        label: `Sat–Mon (${satLabel})`, 
        days: ['saturday', 'sunday', 'monday'],
        date: new Date(d)
      });
    }
  }

  return suggestions.slice(0, 5);
}

const HolidaySuggestions = () => {
  const dispatch = useDispatch();
  const enabledDays = useSelector(state => state.schedule.enabledDays || ['saturday', 'sunday']);
  const currentYear = new Date().getFullYear();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Use Indian holidays API
  const { data: holidays, isLoading, error } = useIndianHolidays(currentYear);
  
  const holidaySuggestions = useMemo(() => {
    if (holidays && holidays.length > 0) {
      return getHolidayWeekendSuggestions(holidays);
    }
    return [];
  }, [holidays]);

  const fallbackSuggestions = useMemo(() => {
    return getFallbackWeekendSuggestions();
  }, []);

  // Get all national holidays for expanded view
  const allNationalHolidays = useMemo(() => {
    if (!holidays || holidays.length === 0) return [];
    
    const today = new Date();
    return holidays
      .filter(holiday => {
        const holidayDate = new Date(holiday.date.iso);
        return holidayDate >= today;
      })
      .sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso))
      .slice(0, 10); // Show next 10 holidays
  }, [holidays]);

  const hasHolidaySuggestions = holidaySuggestions.length > 0;
  const hasFallbackSuggestions = fallbackSuggestions.length > 0;
  const hasAllHolidays = allNationalHolidays.length > 0;

  if (!hasHolidaySuggestions && !hasFallbackSuggestions && !isLoading) return null;

  const getHolidayIcon = (dayType) => {
    if (dayType.includes('Sunday')) return <FiSun className="text-yellow-500" />;
    if (dayType.includes('Saturday')) return <FiMoon className="text-blue-500" />;
    if (dayType.includes('Friday')) return <FiGift className="text-purple-500" />;
    if (dayType.includes('Monday')) return <FiStar className="text-green-500" />;
    return <FiCalendar className="text-gray-500" />;
  };

  const getHolidayBadgeColor = (dayType) => {
    if (dayType.includes('Sunday')) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (dayType.includes('Saturday')) return 'bg-gradient-to-r from-blue-400 to-indigo-500';
    if (dayType.includes('Friday')) return 'bg-gradient-to-r from-purple-400 to-pink-500';
    if (dayType.includes('Monday')) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  return (
    <div className="mt-4 relative">
      {/* Main Card with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100 shadow-lg">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 rounded-xl shadow-sm">
                <FiCalendar className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Holiday Suggestions</h3>
                <p className="text-sm text-gray-600">Plan your perfect weekends</p>
              </div>
            </div>
            
            {hasAllHolidays && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                aria-expanded={isExpanded}
                aria-controls="all-holidays-section"
                aria-label={isExpanded ? 'Collapse all holidays view' : 'Expand to view all holidays'}
              >
                <span className="text-sm font-medium text-gray-700">
                  {isExpanded ? 'Show Less' : 'View All Holidays'}
                </span>
                {isExpanded ? <FiChevronUp className="text-gray-600" /> : <FiChevronDown className="text-gray-600" />}
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
                <span className="text-gray-600 font-medium">Loading holiday data...</span>
              </div>
            </div>
          )}

          {/* Weekend Holiday Suggestions */}
          {!isLoading && hasHolidaySuggestions && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FiStar className="text-yellow-500" />
                <h4 className="font-semibold text-gray-800">Weekend & Long Weekend Holidays</h4>
              </div>
              
              <div className="grid gap-3">
                {holidaySuggestions.slice(0, isExpanded ? holidaySuggestions.length : 3).map(s => (
                  <div key={s.key} className="group relative">
                    <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/90">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getHolidayIcon(s.dayType)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-base mb-1">{s.holiday}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getHolidayBadgeColor(s.dayType)}`}>
                              {s.dayType}
                            </span>
                            <FiClock className="text-gray-400" />
                            <span>{s.date ? s.date.toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            }) : 'Date not available'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => dispatch(setEnabledDays(s.days))}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                          JSON.stringify(enabledDays) === JSON.stringify(s.days)
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        aria-label={`Set ${s.days.join(', ')} as enabled days for ${s.holiday}`}
                        aria-pressed={JSON.stringify(enabledDays) === JSON.stringify(s.days)}
                      >
                        {s.days.length === 3 ? '3-Day Weekend' : '2-Day Weekend'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded View - All National Holidays */}
          {isExpanded && hasAllHolidays && (
            <div id="all-holidays-section" className="border-t border-white/50 pt-6" role="region" aria-label="All upcoming national holidays">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-red-500" />
                <h4 className="font-semibold text-gray-800">All Upcoming National Holidays</h4>
              </div>
              
              <div className="grid gap-2">
                {allNationalHolidays.map(holiday => {
                  const holidayDate = new Date(holiday.date.iso);
                  const dayOfWeek = holidayDate.getDay();
                  const isWeekendHoliday = dayOfWeek === 0 || dayOfWeek === 6;
                  
                  return (
                    <div key={holiday.date.iso} className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg">
                          <FiCalendar className={`text-sm ${isWeekendHoliday ? 'text-green-500' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{holiday.name}</div>
                          <div className="text-xs text-gray-600">
                            {holidayDate.toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                            {isWeekendHoliday && <span className="ml-2 text-green-600 font-medium">• Weekend Holiday</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fallback Weekend Suggestions */}
          {!isLoading && !hasHolidaySuggestions && hasFallbackSuggestions && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiClock className="text-blue-500" />
                <h4 className="font-semibold text-gray-800">Weekend Suggestions</h4>
              </div>
              
              <div className="grid gap-3">
                {fallbackSuggestions.map(s => (
                  <div key={s.key} className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/90">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FiCalendar className="text-blue-500" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-base mb-1">{s.label}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-blue-400 to-indigo-500">
                            Weekend
                          </span>
                          <FiClock className="text-gray-400" />
                          <span>{s.date ? s.date.toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          }) : 'Date not available'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => dispatch(setEnabledDays(s.days))}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                        JSON.stringify(enabledDays) === JSON.stringify(s.days)
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      title={`Set ${s.days.join(', ')} as enabled days`}
                    >
                      {s.days.length === 3 ? '3-Day Weekend' : '2-Day Weekend'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-red-500 text-sm mb-2">Unable to load holiday data</div>
                <div className="text-gray-500 text-xs">Showing fallback suggestions</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidaySuggestions;


