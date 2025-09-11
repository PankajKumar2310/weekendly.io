// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ className = '', children, ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;


