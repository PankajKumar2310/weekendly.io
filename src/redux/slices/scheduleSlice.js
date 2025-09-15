import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  friday: [],
  saturday: [],
  sunday: [],
  monday: [],
  enabledDays: ['saturday', 'sunday'],
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
      
      if (!state[day]) state[day] = [];
      state[day] = [...state[day], newActivity].sort((a, b) => a.startTime - b.startTime);
    },
    removeFromSchedule: (state, action) => {
      const { activityId, day } = action.payload;
      if (!state[day]) return;
      state[day] = state[day].filter(activity => activity.id !== activityId);
    },
    moveActivity: (state, action) => {
      const { fromDay, toDay, activityId, newTimeSlot } = action.payload;
      if (!state[fromDay]) return;
      const activity = state[fromDay].find(a => a.id === activityId);
      
      if (!activity) return;
      
      // Remove from original day
      state[fromDay] = state[fromDay].filter(a => a.id !== activityId);
      
      // Add to new day with new time
      const updatedActivity = {
        ...activity,
        startTime: newTimeSlot
      };
      
      if (!state[toDay]) state[toDay] = [];
      state[toDay] = [...state[toDay], updatedActivity].sort((a, b) => a.startTime - b.startTime);
    },
    clearSchedule: (state) => {
      state.friday = [];
      state.saturday = [];
      state.sunday = [];
      state.monday = [];
    },
    loadSchedule: (state, action) => {
      const loaded = action.payload || {};
      return {
        friday: loaded.friday || [],
        saturday: loaded.saturday || [],
        sunday: loaded.sunday || [],
        monday: loaded.monday || [],
        enabledDays: loaded.enabledDays || state.enabledDays,
      };
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
    setEnabledDays: (state, action) => {
      const next = action.payload;
      // Ensure at least one day enabled
      state.enabledDays = Array.isArray(next) && next.length > 0 ? next : state.enabledDays;
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
  setEnabledDays,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;