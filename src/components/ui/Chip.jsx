// src/components/ui/Chip.jsx
import React from 'react';

const Chip = ({ selected = false, className = '', children, ...props }) => {
  const classes = selected
    ? 'px-2 py-1 text-xs rounded-full bg-blue-500 text-white'
    : 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200';
  return (
    <button className={`${classes} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Chip;


