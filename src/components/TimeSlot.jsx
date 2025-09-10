// src/components/TimeSlot.jsx
import React from 'react';
import ScheduleActivity from './ScheduleActivity';
import useSchedule from '../hooks/useSchedule';

const TimeSlot = ({ time, day, activities }) => {
  const { formatTime } = useSchedule();

  return (
    <div className="flex">
      <div className="w-16 flex-shrink-0 text-right pr-3 py-2 text-sm text-gray-500 font-medium">
        {formatTime(time)}
      </div>
      
      <div className="flex-1 border-l border-gray-200 pl-3 py-2 relative">
        <div className="absolute -left-1.5 top-3 w-3 h-3 rounded-full bg-gray-300"></div>
        
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