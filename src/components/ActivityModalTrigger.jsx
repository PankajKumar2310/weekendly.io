// src/components/ActivityModalTrigger.jsx
import React, { useState } from 'react';
import ActivityModal from './ActivityModal';

const ActivityModalTrigger = ({ activity = null, children, className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`cursor-pointer ${className}`}
      >
        {children}
      </div>
      
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingActivity={activity}
      />
    </>
  );
};

export default ActivityModalTrigger;
