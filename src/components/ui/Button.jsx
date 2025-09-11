// src/components/ui/Button.jsx
import React from 'react';

const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
};

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3',
};

const Button = ({ variant = 'primary', size = 'md', className = '', children, as: Tag = 'button', ...props }) => {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Button;


