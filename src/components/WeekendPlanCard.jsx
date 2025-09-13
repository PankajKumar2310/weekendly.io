// src/components/WeekendPlanCard.jsx
import React from 'react';
import Icon from './AppIcon';

const WeekendPlanCard = ({ 
  schedule, 
  template, 
  colorScheme, 
  layout = 'timeline',
  showHeader = true,
  showFooter = true,
  className = ''
}) => {

  const formatTime = (startTime) => {
    if (!startTime && startTime !== 0) return '';
    const hours = Math.floor(startTime);
    const minutes = Math.round((startTime - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${period}`;
  };

  const getColorScheme = () => {
    switch (colorScheme) {
      case 'vibrant':
        return 'bg-gradient-to-br from-purple-600 to-pink-600';
      case 'minimal':
        return 'bg-gradient-to-br from-gray-100 to-gray-200';
      case 'nature':
        return 'bg-gradient-to-br from-green-400 to-blue-500';
      case 'sunset':
        return 'bg-gradient-to-br from-orange-400 to-red-500';
      case 'ocean':
        return 'bg-gradient-to-br from-blue-400 to-cyan-500';
      case 'forest':
        return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case 'lavender':
        return 'bg-gradient-to-br from-purple-400 to-indigo-500';
      case 'coral':
        return 'bg-gradient-to-br from-pink-400 to-red-500';
      default:
        return 'bg-gradient-to-br from-indigo-500 to-purple-600';
    }
  };

  const renderTimelineLayout = (activities, day) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Icon name="Calendar" size={20} className="mr-2" />
        {day}
      </h3>
      {activities?.map((activity) => (
        <div key={activity?.id} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-sm font-medium text-white/90 w-16">{formatTime(activity?.startTime)}</div>
          <div className="text-2xl">{activity?.icon}</div>
          <div className="flex-1">
            <div className="text-white font-medium">{activity?.title}</div>
            <div className="text-white/70 text-sm">{activity?.description} • {activity?.duration}h</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridLayout = (activities, day) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Icon name="Calendar" size={20} className="mr-2" />
        {day}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {activities?.map((activity) => (
          <div key={activity?.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-sm font-medium text-white/90 mb-1">{formatTime(activity?.startTime)}</div>
            <div className="text-white font-medium text-sm mb-1 flex items-center gap-2">
              <span className="text-lg">{activity?.icon}</span>
              {activity?.title}
            </div>
            <div className="text-white/70 text-xs">{activity?.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCardLayout = (activities, day) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Icon name="Calendar" size={20} className="mr-2" />
        {day}
      </h3>
      {activities?.map((activity) => (
        <div key={activity?.id} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-start justify-between mb-2">
            <div className="text-white font-semibold flex items-center gap-2">
              <span className="text-2xl">{activity?.icon}</span>
              {activity?.title}
            </div>
            <div className="text-white/80 text-sm">{activity?.duration}h</div>
          </div>
          <div className="text-white/80 text-sm mb-2">{formatTime(activity?.startTime)}</div>
          <div className="text-white/70 text-sm">
            {activity?.description}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLayout = (activities, day) => {
    switch (layout) {
      case 'timeline':
        return renderTimelineLayout(activities, day);
      case 'grid':
        return renderGridLayout(activities, day);
      case 'card':
        return renderCardLayout(activities, day);
      default:
        return renderTimelineLayout(activities, day);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeekendDateRange = () => {
    const today = new Date();
    const currentDay = today.getDay();
    
    // Find the next Saturday
    const daysUntilSaturday = (6 - currentDay) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday));
    
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    
    return {
      saturday: formatDate(saturday),
      sunday: formatDate(sunday),
      range: `${saturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${sunday.toLocaleDateString('en-US', { day: 'numeric' })}`
    };
  };

  const dateInfo = getWeekendDateRange();

  return (
    <div className={`${getColorScheme()} rounded-xl p-6 text-white min-h-[600px] ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {schedule?.title || (schedule?.enabledDays?.length > 2 ? "My Perfect Schedule" : "My Perfect Weekend")}
          </h1>
          <p className="text-white/80">{schedule?.date || dateInfo.range}</p>
          <div className="w-16 h-1 bg-white/30 mx-auto mt-4 rounded-full"></div>
        </div>
      )}

      {/* Content */}
      <div className={layout === 'grid' ? 'space-y-8' : `grid gap-8 ${schedule?.enabledDays?.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {schedule?.enabledDays?.map((day) => {
          const dayName = day.charAt(0).toUpperCase() + day.slice(1);
          const activities = schedule[day] || [];
          return renderLayout(activities, dayName);
        })}
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="text-center mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center justify-center text-white/70 text-sm">
            <Icon name="Calendar" size={16} className="mr-2" />
            Created with Weekendly
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekendPlanCard;
