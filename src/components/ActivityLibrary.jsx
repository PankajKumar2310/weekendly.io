// src/components/ActivityLibrary.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchTerm,
  setSelectedCategory,
  setSelectedMood,
  selectFilteredActivities
} from '../redux/slices/activitiesSlice';
import ActivityCard from './ActivityCard';
import ActivityModalTrigger from './ActivityModalTrigger';

const ActivityLibrary = () => {
  const dispatch = useDispatch();
  const activities = useSelector(selectFilteredActivities);
  const { searchTerm, selectedCategory, selectedMood } = useSelector(state => state.activities);

  const categories = ['all', 'food', 'outdoor', 'entertainment', 'relaxation', 'wellness', 'cultural', 'leisure'];
  const moods = ['all', 'social', 'relaxed', 'active', 'adventurous', 'calm', 'energetic', 'cozy', 'focused', 'creative'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-fit">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Activity Library</h2>
        <ActivityModalTrigger>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            + Add Activity
          </button>
        </ActivityModalTrigger>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full bg-white text-black  px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 ">
          <div >
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
              className="w-full bg-white text-black  px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
            <select 
              value={selectedMood} 
              onChange={(e) => dispatch(setSelectedMood(e.target.value))}
              className="w-full bg-white text-black  px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {moods.map(mood => (
                <option  key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No activities found. Try different filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLibrary;