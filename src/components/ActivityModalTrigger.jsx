// src/components/ActivityModalTrigger.jsx
import React, { useState } from 'react';
import ActivityModal from './ActivityModal';

const ActivityModalTrigger = ({ activity = null, children, className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`className bg-white`}
      >
        {children}
      </button>
      
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingActivity={activity}
      />
    </>
  );
};

export default ActivityModalTrigger;
