const formatTime = (hour) => {
  if (hour === 12) return '12 PM';
  if (hour === 24) return '12 AM';
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
};

export const prepareScheduleForExport = (schedule) => {
  const days = ['friday', 'saturday', 'sunday', 'monday'];
  const result = {};
  days.forEach((day) => {
    const list = schedule[day] || [];
    result[day] = list.map(activity => ({
      title: activity.title,
      time: `${formatTime(activity.startTime)} - ${formatTime(activity.startTime + activity.duration)}`,
      description: activity.description,
      mood: (activity.mood || []).join(', ')
    }));
  });
  return result;
};