
import React, { useState, Suspense, lazy } from 'react';

// Lazy load the modal component 
const ActivityModal = lazy(() => import('./ActivityModal'));

// Loading component for modal
const ModalLoader = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
      
      {isModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <ActivityModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            editingActivity={activity}
          />
        </Suspense>
      )}
    </>
  );
};

export default ActivityModalTrigger;
