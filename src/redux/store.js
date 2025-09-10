// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import activitiesReducer from './slices/activitiesSlice';
import scheduleReducer from './slices/scheduleSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    activities: activitiesReducer,
    schedule: scheduleReducer,
    theme: themeReducer,
  },
});

export default store;