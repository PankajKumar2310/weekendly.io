import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
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

const selectActivitiesState = (state) => state.activities;

export const selectFilteredActivities = createSelector(
  [selectActivitiesState],
  ({ activities, searchTerm, selectedCategory, selectedMood }) => {
    const term = searchTerm.trim().toLowerCase();
    const bySearch = term
      ? activities.filter(a =>
          a.title.toLowerCase().includes(term) ||
          a.description.toLowerCase().includes(term)
        )
      : activities;
    const byCategory = selectedCategory === 'all'
      ? bySearch
      : bySearch.filter(a => a.category === selectedCategory);
    const byMood = selectedMood === 'all'
      ? byCategory
      : byCategory.filter(a => (a.mood || []).includes(selectedMood));
    return byMood;
  }
);

export default activitiesSlice.reducer;