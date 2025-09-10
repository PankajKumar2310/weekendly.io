// src/redux/slices/activitiesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { activitiesData } from '../../data/activitiesData';

const initialState = {
  activities: activitiesData,
  searchTerm: '',
  selectedCategory: 'all',
  selectedMood: 'all',
};

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedMood: (state, action) => {
      state.selectedMood = action.payload;
    },
    addActivity: (state, action) => {
      state.activities.push(action.payload);
    },
    updateActivity: (state, action) => {
      const index = state.activities.findIndex(
        activity => activity.id === action.payload.id
      );
      if (index !== -1) {
        state.activities[index] = action.payload;
      }
    },
    removeActivity: (state, action) => {
      state.activities = state.activities.filter(
        activity => activity.id !== action.payload
      );
    },
    loadActivities: (state, action) => {
      state.activities = action.payload;
    },
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSelectedMood,
  addActivity,
  updateActivity,
  removeActivity,
  loadActivities,
} = activitiesSlice.actions;

export const selectFilteredActivities = state => {
  const { activities, searchTerm, selectedCategory, selectedMood } = state.activities;
  
  return activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesMood = selectedMood === 'all' || activity.mood.includes(selectedMood);
    
    return matchesSearch && matchesCategory && matchesMood;
  });
};

export default activitiesSlice.reducer;