// src/components/ActivityCard.jsx
import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { addToSchedule } from '../redux/slices/scheduleSlice';
import ActivityModalTrigger from './ActivityModalTrigger';
import { FiEdit3 } from 'react-icons/fi';

const ActivityCard = ({ activity }) => {
  const dispatch = useDispatch();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'activity',
    item: { activity },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dispatch(addToSchedule({
          activity: item.activity,
          day: dropResult.day,
          timeSlot: dropResult.timeSlot
        }));
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleQuickAdd = () => {
    // Add to the next available slot on Saturday
    const now = new Date();
    const nextHour = now.getHours() < 8 ? 8 : now.getHours() + 1;
    dispatch(addToSchedule({
      activity,
      day: 'saturday',
      timeSlot: nextHour
    }));
  };

  return (
    <div
      ref={drag}
      className={`p-4 rounded-lg border cursor-grab transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
      style={{ borderLeft: `4px solid ${activity.color}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{activity.icon}</span>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{activity.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium px-2 py-1 bg-gray-600 rounded-full">
              {activity.duration} hours
            </span>
            
            <div className="flex gap-1">
              {activity.mood.map(m => (
                <span 
                  key={m}
                  className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <button
            onClick={handleQuickAdd}
            className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Quick add to Saturday"
          >
            +
          </button>
          
          <ActivityModalTrigger activity={activity}>
            <button
              className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Edit activity"
            >
              <FiEdit3 size={12} />
            </button>
          </ActivityModalTrigger>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;