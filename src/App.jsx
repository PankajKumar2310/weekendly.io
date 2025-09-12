// src/App.jsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { loadSchedule } from './redux/slices/scheduleSlice';
import { setTheme } from './redux/slices/themeSlice';
import { loadActivities } from './redux/slices/activitiesSlice';
import ActivityLibrary from './components/ActivityLibrary';
import WeekendSchedule from './components/WeekendSchedule';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';
import HolidaySuggestions from './components/HolidaySuggestions';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});


function AppContent() {
  const dispatch = useDispatch();
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const schedule = useSelector(state => state.schedule);
  const activities = useSelector(state => state.activities.activities);
  const [savedSchedule, setSavedSchedule] = useLocalStorage('weekendly-schedule', {
    friday: [],
    saturday: [],
    sunday: [],
    monday: [],
    enabledDays: ['saturday', 'sunday']
  });
  const [savedTheme, setSavedTheme] = useLocalStorage('weekendly-theme', 'relaxed');
  const [savedActivities, setSavedActivities] = useLocalStorage('weekendly-activities', []);

  // Load saved data on initial render
  useEffect(() => {
    dispatch(loadSchedule(savedSchedule));
    dispatch(setTheme(savedTheme));
    if (savedActivities.length > 0) {
      dispatch(loadActivities(savedActivities));
    }
  }, [dispatch, savedSchedule, savedTheme, savedActivities]);

  // Save schedule to local storage whenever it changes
  useEffect(() => {
    setSavedSchedule(schedule);
  }, [schedule, setSavedSchedule]);

  // Save theme to local storage whenever it changes
  useEffect(() => {
    setSavedTheme(currentTheme);
  }, [currentTheme, setSavedTheme]);

  // Save activities to local storage whenever they change
  useEffect(() => {
    setSavedActivities(activities);
  }, [activities, setSavedActivities]);

  return (
    <div className={`min-h-screen  transition-colors duration-300 ${currentTheme}-theme`}>
      <div className="pt-2">   {/* padding inside instead of margin outside */}
    <Navbar />
  </div>
  <div className="container mx-auto px-4 pb-2">
        <HolidaySuggestions />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="lg:col-span-1">
            <ActivityLibrary />
          </div>
      
          <div className="lg:col-span-2">
            <WeekendSchedule />
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </QueryClientProvider>
  );
}

export default App;