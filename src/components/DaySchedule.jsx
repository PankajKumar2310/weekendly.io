// src/components/DaySchedule.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import TimeSlot from './TimeSlot';

const DaySchedule = ({ day, activities }) => {
  const timeSlots = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM to 11 PM

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'activity',
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      const rect = document.getElementById(`${day}-schedule`).getBoundingClientRect();
      const relativeY = offset.y - rect.top;
      const hourHeight = rect.height / 16;
      const timeSlot = Math.floor(relativeY / hourHeight) + 8;
      
      return {
        day,
        timeSlot
      };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      id={`${day}-schedule`}
      ref={drop} 
      className={`p-4 rounded-lg border-2 border-dashed transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center capitalize">{day}</h3>
      
      <div className="space-y-1">
        {timeSlots.map(time => (
          <TimeSlot 
            key={time} 
            time={time} 
            day={day}
            activities={activities.filter(a => Math.floor(a.startTime) === time)}
          />
        ))}
      </div>
    </div>
  );
};

export default DaySchedule;