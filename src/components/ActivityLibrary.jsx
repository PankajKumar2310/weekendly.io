import React, { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchTerm,
  setSelectedCategory,
  setSelectedMood,
  selectFilteredActivities
} from '../redux/slices/activitiesSlice';
import ActivityCard from './ActivityCard';
import ActivityModalTrigger from './ActivityModalTrigger';
// import ThemeSelector from './ThemeSelector';

const ActivityLibrary = memo(() => {
  const dispatch = useDispatch();
  const activities = useSelector(selectFilteredActivities);
  const { searchTerm, selectedCategory, selectedMood } = useSelector(state => state.activities);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Debounce search from redux state
  useEffect(() => {
    const id = setTimeout(() => {
      if (localSearch !== searchTerm) {
        dispatch(setSearchTerm(localSearch));
      }
    }, 250);
    return () => clearTimeout(id);
  }, [localSearch, searchTerm, dispatch]);

  const categories = ['all', 'food', 'outdoor', 'entertainment', 'relaxation', 'wellness', 'cultural', 'leisure'];
  const moods = ['all', 'social', 'relaxed', 'active', 'adventurous', 'calm', 'energetic', 'cozy', 'focused', 'creative'];

  return (
    <div className="relative min-h-[400px]">
      {/* Main Card with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100 shadow-lg min-h-[400px]">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-indigo-200/10 to-blue-200/10 rounded-full -translate-x-12 -translate-y-12"></div>
        
        <div className="relative p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Activity Library</h2>
        <ActivityModalTrigger>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            + Add Activity
          </button>
        </ActivityModalTrigger>
      </div>
      
      <div className="space-y-4 mb-6" role="search">
        <div>
          <input
            type="text"
            placeholder="Search activities..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-white text-black  px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search activities"
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

        {/* <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Theme</span>
          <ThemeSelector />
        </div> */}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>{activities.length} activities</span>
      </div>

      {/* Optimized Grid for Performance */}
      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Activity results">
        {activities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
            No activities found. Try different filters or clear the search.
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
});

ActivityLibrary.displayName = 'ActivityLibrary';

export default ActivityLibrary;