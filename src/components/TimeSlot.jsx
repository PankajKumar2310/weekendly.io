import React from 'react';
import ScheduleActivity from './ScheduleActivity';
import useSchedule from '../hooks/useSchedule';

const TimeSlot = ({ time, day, activities, isDragOver = false }) => {
  const { formatTime } = useSchedule();

  return (
    <div className="flex">
      <div className="w-16 flex-shrink-0 text-right pr-3 py-2 text-sm text-gray-500 font-medium">
        {formatTime(time)}
      </div>
      
      <div 
        className={`flex-1 border-l pl-3 py-2 relative transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-100 border-solid shadow-inner' 
            : 'border-gray-300 border-solid hover:border-gray-400'
        }`}
        style={{ borderStyle: 'solid' }}
      >
        <div className="absolute -left-1.5 top-3 w-3 h-3 rounded-full bg-gray-300"></div>
        
        {isDragOver && (
          <div className="text-center text-blue-600 text-sm font-medium py-2 opacity-90">
            {activities.length === 0 ? 'Drag activity here' : 'Drop to reorder'}
          </div>
        )}
        
        <div className="space-y-2">
          {activities.map(activity => (
            <ScheduleActivity
              key={activity.id}
              activity={activity}
              day={day}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSlot;