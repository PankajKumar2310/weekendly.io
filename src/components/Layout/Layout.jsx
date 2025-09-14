// src/components/Layout/Layout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadSchedule } from '../../redux/slices/scheduleSlice';
import { setTheme } from '../../redux/slices/themeSlice';
import useLocalStorage from '../../hooks/useLocalStorage';
import Navbar from './Navbar';
import Footer from './Footer';
import HolidaySuggestions from '../HolidaySuggestions';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const schedule = useSelector(state => state.schedule);
  
  const [savedSchedule, setSavedSchedule] = useLocalStorage('weekendly-schedule', {
    friday: [],
    saturday: [],
    sunday: [],
    monday: [],
    enabledDays: ['saturday', 'sunday']
  });
  const [savedTheme, setSavedTheme] = useLocalStorage('weekendly-theme', 'relaxed');

  // Load saved data on initial render only
  useEffect(() => {
    dispatch(loadSchedule(savedSchedule));
    dispatch(setTheme(savedTheme));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Only depend on dispatch, not the localStorage values

  // Save schedule to local storage whenever it changes (weekend plan activities only)
  useEffect(() => {
    setSavedSchedule(schedule);
  }, [schedule, setSavedSchedule]);

  // Save theme to local storage whenever it changes
  useEffect(() => {
    setSavedTheme(currentTheme);
  }, [currentTheme, setSavedTheme]);

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
      
     <Footer />
    </div>
  );
};

export default Layout;
