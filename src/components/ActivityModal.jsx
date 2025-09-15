
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addActivity, updateActivity } from '../redux/slices/activitiesSlice';

const ActivityModal = ({ isOpen, onClose, editingActivity = null }) => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector(state => state.theme);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'leisure',
    duration: 2,
    mood: [],
    icon: '🎯',
    color: '#3B82F6'
  });

  const categories = ['food', 'outdoor', 'entertainment', 'relaxation', 'wellness', 'cultural', 'leisure'];
  const availableMoods = ['social', 'relaxed', 'active', 'adventurous', 'calm', 'energetic', 'cozy', 'focused', 'creative'];
  const icons = ['🎯', '🍕', '🥾', '🎬', '📚', '🧘', '👨‍🍳', '🎮', '🏖️', '🏛️', '🛍️', '🎨', '🏃‍♂️', '🎵', '🌅'];

  useEffect(() => {
    if (isOpen) {
      if (editingActivity) {
        setFormData({
          title: editingActivity.title || '',
          description: editingActivity.description || '',
          category: editingActivity.category || 'leisure',
          duration: editingActivity.duration || 2,
          mood: editingActivity.mood || [],
          icon: editingActivity.icon || '🎯',
          color: editingActivity.color || '#3B82F6'
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category: 'leisure',
          duration: 2,
          mood: [],
          icon: '🎯',
          color: '#3B82F6'
        });
      }
    }
  }, [editingActivity, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        category: 'leisure',
        duration: 2,
        mood: [],
        icon: '🎯',
        color: '#3B82F6'
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingActivity) {
      dispatch(updateActivity({
        ...editingActivity,
        ...formData
      }));
    } else {
      const newActivity = {
        id: `custom-${Date.now()}`,
        ...formData
      };
      dispatch(addActivity(newActivity));
    }
    
    onClose();
  };

  const handleMoodToggle = (mood) => {
    setFormData(prev => ({
      ...prev,
      mood: prev.mood.includes(mood) 
        ? prev.mood.filter(m => m !== mood)
        : [...prev.mood, mood]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${currentTheme}-theme`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingActivity ? 'Edit Activity' : 'Create New Activity'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Morning Yoga, Brunch with Friends"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="3"
                placeholder="Describe what this activity involves..."
              />
            </div>

            {/* Category and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  max="8"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Icon
              </label>
              <div className="grid grid-cols-8 gap-2">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({...formData, icon})}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                      formData.icon === icon 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood/Vibe (select multiple)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {availableMoods.map(mood => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => handleMoodToggle(mood)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      formData.mood.includes(mood)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Color
              </label>
              <div className="flex gap-2">
                {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <span>{editingActivity ? 'Update Activity' : 'Create Activity'}</span>
                <span className="text-lg">{formData.icon}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
