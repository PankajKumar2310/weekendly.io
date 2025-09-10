// src/components/EditScheduledActivityModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateScheduledActivity } from '../redux/slices/scheduleSlice';
import { useSelector } from 'react-redux';
import useSchedule from '../hooks/useSchedule';

const EditScheduledActivityModal = ({ isOpen, onClose, activity, day }) => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector(state => state.theme);
  const { formatTime } = useSchedule();
  const [formData, setFormData] = useState({
    startTime: 9,
    duration: 2,
    title: '',
    description: ''
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        startTime: activity.startTime,
        duration: activity.duration,
        title: activity.title,
        description: activity.description || ''
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch(updateScheduledActivity({
      activityId: activity.id,
      day,
      updates: {
        startTime: formData.startTime,
        duration: formData.duration,
        title: formData.title,
        description: formData.description
      }
    }));
    
    onClose();
  };

  const handleTimeChange = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const decimalTime = hours + (minutes / 60);
    setFormData({ ...formData, startTime: decimalTime });
  };

  const formatTimeForInput = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto ${currentTheme}-theme`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Edit Scheduled Activity
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{activity.icon}</span>
              <div>
                <div className="font-semibold text-gray-800">{activity.title}</div>
                <div className="text-sm text-gray-600">{activity.description}</div>
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formatTimeForInput(formData.startTime)}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="text-sm text-gray-500 mt-1">
                Current: {formatTime(formData.startTime)}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                max="8"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="text-sm text-gray-500 mt-1">
                Ends at: {formatTime(formData.startTime + formData.duration)}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Activity title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="2"
                placeholder="Activity description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <span>Update</span>
                <span className="text-lg">{activity.icon}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditScheduledActivityModal;
