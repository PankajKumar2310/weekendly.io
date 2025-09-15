import React from 'react';
import ThemeSelector from '../ThemeSelector';
import ExportButton from '../ExportButton';

const Header = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
        Weekendly
      </h1>
      <p className="text-gray-600 mt-2">Plan your perfect weekend</p>
      
      <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
        <ThemeSelector />
        <ExportButton />
      </div>
    </header>
  );
};

export default Header;