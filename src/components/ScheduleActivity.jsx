// src/components/ScheduledActivity.jsx
import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { removeFromSchedule } from '../redux/slices/scheduleSlice';

const ScheduledActivity = ({ activity, day }) => {
  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'scheduled-activity',
    item: { activity, day },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = () => {
    dispatch(removeFromSchedule({
      activityId: activity.id,
      day
    }));
  };

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50' : 'hover:shadow-md'
      }`}
      style={{ backgroundColor: activity.color, color: 'white' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{activity.icon}</span>
          <span className="font-semibold">{activity.title}</span>
        </div>
        
        <button
          onClick={handleRemove}
          className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
          aria-label="Remove activity"
        >
          ×
        </button>
      </div>
      
      <div className="text-sm mt-1 opacity-90">
        {activity.duration} hour{activity.duration !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ScheduledActivity;