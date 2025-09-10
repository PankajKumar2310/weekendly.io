// src/utils/exportHelper.js
const formatTime = (hour) => {
  if (hour === 12) return '12 PM';
  if (hour === 24) return '12 AM';
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
};

export const prepareScheduleForExport = (schedule) => {
  return {
    saturday: schedule.saturday.map(activity => ({
      title: activity.title,
      time: `${formatTime(activity.startTime)} - ${formatTime(activity.startTime + activity.duration)}`,
      description: activity.description,
      mood: activity.mood.join(', ')
    })),
    sunday: schedule.sunday.map(activity => ({
      title: activity.title,
      time: `${formatTime(activity.startTime)} - ${formatTime(activity.startTime + activity.duration)}`,
      description: activity.description,
      mood: activity.mood.join(', ')
    }))
  };
};