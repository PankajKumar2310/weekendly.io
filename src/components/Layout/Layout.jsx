// src/components/Layout/Layout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadSchedule } from '../../redux/slices/scheduleSlice';
import { setTheme } from '../../redux/slices/themeSlice';
import { loadActivities } from '../../redux/slices/activitiesSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import Navbar from './Navbar';
import Footer from './Footer';
import HolidaySuggestions from '../HolidaySuggestions';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
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

  const isHomePage = location.pathname === '/';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme}-theme`}>
      <div className="pt-2">
        <Navbar />
      </div>
      
      {isHomePage && (
        <div className="container mx-auto px-4 pb-2">
          <HolidaySuggestions />
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
      
      {isHomePage && <Footer />}
    </div>
  );
};

export default Layout;
