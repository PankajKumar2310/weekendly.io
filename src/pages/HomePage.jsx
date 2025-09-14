// src/pages/HomePage.jsx
import React, { Suspense, lazy } from 'react';

// Lazy load heavy components
const ActivityLibrary = lazy(() => import('../components/ActivityLibrary'));
const WeekendSchedule = lazy(() => import('../components/WeekendSchedule'));

// Loading component for individual components
const ComponentLoader = () => (
  <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px]">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="grid gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="lg:col-span-1 min-h-[400px]">
        <Suspense fallback={<ComponentLoader />}>
          <ActivityLibrary />
        </Suspense>
      </div>
      <div className="lg:col-span-2 min-h-[400px]">
        <Suspense fallback={<ComponentLoader />}>
          <WeekendSchedule />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
