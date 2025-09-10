// src/components/ScheduledActivity.jsx
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { removeFromSchedule } from '../redux/slices/scheduleSlice';
import useSchedule from '../hooks/useSchedule';
import EditScheduledActivityModal from './EditScheduledActivityModal';
// import { FiEdit3 } from 'react-icons/fi';

const ScheduledActivity = ({ activity, day }) => {
  const dispatch = useDispatch();
  const { formatTime } = useSchedule();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
            title="Edit activity"
          >
           {/* <FiEdit3 size={12} color="white" /> */}
           ✏️
          </button>
          
          <button
            onClick={handleRemove}
            className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
            aria-label="Remove activity"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="text-sm mt-1 opacity-90">
        {formatTime(activity.startTime)} - {formatTime(activity.startTime + activity.duration)}
      </div>
      
      <EditScheduledActivityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        activity={activity}
        day={day}
      />
    </div>
  );
};

export default ScheduledActivity;