// src/components/Layout/Footer.jsx
import React from 'react';
import { FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="relative mt-16" role="contentinfo" aria-label="Website footer">
      {/* Simple Footer with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-200/20 to-blue-200/20 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative px-6 py-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500 mb-3">
              Weekendly
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Plan your perfect weekends with ease
            </p>
            <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>Created with</span>
              <FiHeart className="text-red-500" size={14} />
              <span>using React, Redux, and Tailwind CSS</span>
            </div>
            <div className="text-xs text-gray-400 mt-3">
              © 2024 Weekendly. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;