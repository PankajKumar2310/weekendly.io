// src/App.jsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { loadSchedule } from './redux/slices/scheduleSlice';
import { setTheme } from './redux/slices/themeSlice';
import ActivityLibrary from './components/ActivityLibrary';
import WeekendSchedule from './components/WeekendSchedule';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const [savedSchedule] = useLocalStorage('weekendly-schedule', {
    saturday: [],
    sunday: []
  });
  const [savedTheme] = useLocalStorage('weekendly-theme', 'relaxed');

  // Load saved data on initial render
  useEffect(() => {
    dispatch(loadSchedule(savedSchedule));
    dispatch(setTheme(savedTheme));
  }, [dispatch, savedSchedule, savedTheme]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme}-theme`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ActivityLibrary />
          </div>
          
          <div className="lg:col-span-2">
            <WeekendSchedule />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;