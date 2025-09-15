
import React from 'react';
import { useDrop } from 'react-dnd';
import TimeSlot from './TimeSlot';

const DaySchedule = ({ day, activities }) => {
  const timeSlots = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM to 11 PM

  const [{ isOver, draggedItem, canDrop }, drop] = useDrop(() => ({
    accept: ['activity', 'scheduled-activity'],
    drop: (item, monitor) => {
      try {
        const offset = monitor.getSourceClientOffset();
        const rect = document.getElementById(`${day}-schedule`);
        
        if (!offset || !rect) {
          //default time slot if offset or rect is null
          return {
            day,
            timeSlot: 9,
            targetDay: day,
            targetTimeSlot: 9
          };
        }
        
        const rectBounds = rect.getBoundingClientRect();
        const relativeY = offset.y - rectBounds.top;
        const hourHeight = rectBounds.height / 16;
        const timeSlot = Math.floor(relativeY / hourHeight) + 8;
        
        // validation of time slot is within valid range
        const validTimeSlot = Math.max(8, Math.min(23, timeSlot));
        
        
        return {
          day,
          timeSlot: validTimeSlot,
          targetDay: day,
          targetTimeSlot: validTimeSlot
        };
      } catch (error) {
        console.warn('Drop calculation error:', error);
        // Fallback to a default time slot
        return {
          day,
          timeSlot: 9,
          targetDay: day,
          targetTimeSlot: 9
        };
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
      draggedItem: monitor.getItem(),
    }),
  }));

  return (
    <div 
      id={`${day}-schedule`}
      ref={drop} 
      className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
        isOver && canDrop ? 'border-blue-400 bg-blue-50 scale-[1.02] shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      role="region"
      aria-label={`${day} schedule drop area`}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center capitalize">{day}</h3>
      
      <div className="space-y-1">
        {timeSlots.map(time => (
          <TimeSlot 
            key={time} 
            time={time} 
            day={day}
            activities={activities.filter(a => Math.floor(a.startTime) === time)}
            isDragOver={isOver && canDrop && draggedItem?.type === 'scheduled-activity'}
          />
        ))}
      </div>
    </div>
  );
};

export default DaySchedule;