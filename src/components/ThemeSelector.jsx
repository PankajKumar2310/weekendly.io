// src/components/ThemeSelector.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../redux/slices/themeSlice';

const ThemeSelector = () => {
  const dispatch = useDispatch();
  const { currentTheme, themes } = useSelector(state => state.theme);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Theme:</span>
      <div className="flex gap-2">
        {themes.map(theme => (
          <button
            key={theme.id}
            className={`w-8 h-8 rounded-full transition-all ${
              currentTheme === theme.id ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: theme.color }}
            onClick={() => dispatch(setTheme(theme.id))}
            aria-label={`Select ${theme.name} theme`}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;