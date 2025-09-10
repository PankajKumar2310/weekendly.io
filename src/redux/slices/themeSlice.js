// src/redux/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTheme: 'relaxed',
  themes: [
    { id: 'relaxed', name: 'Relaxed', color: '#80CBC4' },
    { id: 'adventurous', name: 'Adventurous', color: '#A5D6A7' },
    { id: 'social', name: 'Social', color: '#90CAF9' },
    { id: 'productive', name: 'Productive', color: '#FFCC80' },
    { id: 'family', name: 'Family', color: '#F48FB1' }
  ],
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;