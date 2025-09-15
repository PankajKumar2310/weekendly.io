import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTheme: 'relaxed',
  themes: [
    { id: "relaxed", name: "Relaxed", gradient: "from-teal-300 to-teal-500" },
    { id: "adventurous", name: "Adventurous", gradient: "from-green-300 to-green-500" },
    { id: "social", name: "Social", gradient: "from-blue-300 to-blue-500" },
    { id: "productive", name: "Productive", gradient: "from-amber-300 to-amber-500" },
    { id: "family", name: "Family", gradient: "from-pink-300 to-pink-500" },
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