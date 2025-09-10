// src/redux/slices/scheduleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  saturday: [],
  sunday: [],
};

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    addToSchedule: (state, action) => {
      const { activity, day, timeSlot } = action.payload;
      const newActivity = {
        ...activity,
        id: `${activity.id}-${Date.now()}`,
        startTime: timeSlot
      };
      
      state[day] = [...state[day], newActivity].sort((a, b) => a.startTime - b.startTime);
    },
    removeFromSchedule: (state, action) => {
      const { activityId, day } = action.payload;
      state[day] = state[day].filter(activity => activity.id !== activityId);
    },
    moveActivity: (state, action) => {
      const { fromDay, toDay, activityId, newTimeSlot } = action.payload;
      const activity = state[fromDay].find(a => a.id === activityId);
      
      if (!activity) return;
      
      // Remove from original day
      state[fromDay] = state[fromDay].filter(a => a.id !== activityId);
      
      // Add to new day with new time
      const updatedActivity = {
        ...activity,
        startTime: newTimeSlot
      };
      
      state[toDay] = [...state[toDay], updatedActivity].sort((a, b) => a.startTime - b.startTime);
    },
    clearSchedule: (state) => {
      state.saturday = [];
      state.sunday = [];
    },
    loadSchedule: (state, action) => {
      return action.payload;
    },
    updateScheduledActivity: (state, action) => {
      const { activityId, day, updates } = action.payload;
      const activityIndex = state[day].findIndex(a => a.id === activityId);
      
      if (activityIndex !== -1) {
        state[day][activityIndex] = { ...state[day][activityIndex], ...updates };
        // Re-sort after update
        state[day] = [...state[day]].sort((a, b) => a.startTime - b.startTime);
      }
    },
  },
});

export const {
  addToSchedule,
  removeFromSchedule,
  moveActivity,
  clearSchedule,
  loadSchedule,
  updateScheduledActivity,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;