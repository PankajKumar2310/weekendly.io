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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { 
        ignoredPaths: ['schedule.friday', 'schedule.saturday', 'schedule.sunday', 'schedule.monday'] 
      },
      serializableCheck: { 
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'] 
      }
    }),
});

export default store;