// src/hooks/useSchedule.js
import { useCallback } from 'react';

function useSchedule() {
  const validateTimeSlot = useCallback((timeSlot) => {
    return timeSlot >= 8 && timeSlot <= 23;
  }, []);

  const hasTimeConflict = useCallback((schedule, day, newStartTime, duration, excludeId = null) => {
    const newEndTime = newStartTime + duration;
    
    return schedule[day].some(activity => {
      if (excludeId && activity.id === excludeId) return false;
      
      const activityEndTime = activity.startTime + activity.duration;
      return (newStartTime >= activity.startTime && newStartTime < activityEndTime) ||
             (newEndTime > activity.startTime && newEndTime <= activityEndTime) ||
             (newStartTime <= activity.startTime && newEndTime >= activityEndTime);
    });
  }, []);

  const formatTime = useCallback((hour) => {
    if (hour === 12) return '12 PM';
    if (hour === 24) return '12 AM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  }, []);

  return {
    validateTimeSlot,
    hasTimeConflict,
    formatTime
  };
}

export default useSchedule;