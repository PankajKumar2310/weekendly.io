// src/components/ActivityCard.jsx
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addToSchedule } from '../redux/slices/scheduleSlice';
import ActivityModalTrigger from './ActivityModalTrigger';
import { FiEdit3 } from 'react-icons/fi';
import useSchedule from '../hooks/useSchedule';

const ActivityCard = ({ activity }) => {
  const dispatch = useDispatch();
  const schedule = useSelector(state => state.schedule);
  const { currentTheme } = useSelector(state => state.theme);
  const { formatTime } = useSchedule();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
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
    setShowQuickAdd(true);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirmAdd = () => {
    if (selectedDay && selectedTime) {
      dispatch(addToSchedule({
        activity,
        day: selectedDay,
        timeSlot: parseFloat(selectedTime)
      }));
      setShowQuickAdd(false);
      setSelectedDay('');
      setSelectedTime('');
    }
  };

  const handleCancelAdd = () => {
    setShowQuickAdd(false);
    setSelectedDay('');
    setSelectedTime('');
  };

  // Get available days from enabledDays
  const availableDays = schedule.enabledDays || ['saturday', 'sunday'];
  const dayLabels = {
    friday: 'Friday',
    saturday: 'Saturday', 
    sunday: 'Sunday',
    monday: 'Monday'
  };

  // Generate time options (8 AM to 11 PM)
  const timeOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8;
    return { value: hour, label: formatTime(hour) };
  });

  return (
    <div
      ref={drag}
      className={`p-4 rounded-lg border cursor-grab bg-white duration-200 min-h-[120px] ${
        isDragging ? 'opacity-100 scale-95' : 'hover:shadow-md'
      }`}
      style={{ borderLeft: `4px solid ${activity.color}` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{activity.icon}</span>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{activity.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full">
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
            title="Quick add to schedule"
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

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] overflow-y-auto ${currentTheme}-theme`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Quick Add Activity</h3>
                <button
                  onClick={handleCancelAdd}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Day Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Day</label>
                <div className="grid grid-cols-2 gap-3">
                  {availableDays.map(day => (
                    <button
                      key={day}
                      onClick={() => handleDaySelect(day)}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        selectedDay === day
                          ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-md'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {dayLabels[day]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDay && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => handleTimeSelect(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="">Choose time...</option>
                    {timeOptions.map(time => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelAdd}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAdd}
                  disabled={!selectedDay || !selectedTime}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;