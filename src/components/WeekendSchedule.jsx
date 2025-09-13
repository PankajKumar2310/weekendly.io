// src/components/WeekendSchedule.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import DaySchedule from './DaySchedule';

const WeekendSchedule = () => {
  const schedule = useSelector(state => state.schedule);
  const enabledDays = schedule.enabledDays || ['saturday', 'sunday'];

  return (
    <section className="relative" aria-label="Weekend schedule planning">
      {/* Main Card with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100 shadow-lg">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-indigo-200/10 to-blue-200/10 rounded-full -translate-x-12 -translate-y-12"></div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/30">
            <h2 className="text-2xl font-bold text-gray-800">Make Your Perfect Weekend Plan</h2>
            <span className="text-sm text-gray-600 px-3 py-1 bg-white/50 rounded-lg font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <div 
            className={`grid grid-cols-1 ${enabledDays.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}
            role="grid"
            aria-label="Weekend schedule grid"
          >
            {enabledDays.map((day) => (
              <DaySchedule key={day} day={day} activities={schedule[day] || []} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeekendSchedule;