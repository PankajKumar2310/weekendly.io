// src/components/ScheduledActivity.jsx
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { removeFromSchedule, addToSchedule, moveActivity } from '../redux/slices/scheduleSlice';
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
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        const { targetDay, targetTimeSlot } = dropResult;
        
        
        // If moving to a different day
        if (targetDay !== day) {
          dispatch(moveActivity({
            fromDay: day,
            toDay: targetDay,
            activityId: activity.id,
            newTimeSlot: targetTimeSlot
          }));
        } else {
          // If reordering within the same day, just update the time
          dispatch(moveActivity({
            fromDay: day,
            toDay: day,
            activityId: activity.id,
            newTimeSlot: targetTimeSlot
          }));
        }
      }
    },
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

  const handleDuplicate = () => {
    const nextSlot = Math.ceil((activity.startTime + activity.duration) * 2) / 2;
    const timeSlot = Math.min(Math.max(nextSlot, 8), 23);
    dispatch(addToSchedule({ activity, day, timeSlot }));
  };

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95 rotate-2 shadow-lg' : 'hover:shadow-md hover:scale-[1.02]'
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
            aria-label="Edit scheduled activity"
          >
           {/* <FiEdit3 size={12} color="white" /> */}
           ✏️
          </button>

          <button
            onClick={handleDuplicate}
            className="w-6 h-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
            title="Duplicate activity"
            aria-label="Duplicate scheduled activity"
          >
            ⧉
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