// src/pages/HomePage.jsx
import React from 'react';
import ActivityLibrary from '../components/ActivityLibrary';
import WeekendSchedule from '../components/WeekendSchedule';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="lg:col-span-1">
        <ActivityLibrary />
      </div>
      <div className="lg:col-span-2">
        <WeekendSchedule />
      </div>
    </div>
  );
};

export default HomePage;
