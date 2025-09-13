// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setTheme } from '../../redux/slices/themeSlice';
// import ExportButton from '../ExportButton';
import DaySelector from '../DaySelector';
// import HolidaySuggestions from '../HolidaySuggestions';
import { clearSchedule } from '../../redux/slices/scheduleSlice';
import Button from '../ui/Button';
import AppIcon from '../AppIcon';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, themes } = useSelector(state => state.theme);
  const schedule = useSelector(state => state.schedule);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasActivities = schedule.saturday?.length > 0 || schedule.sunday?.length > 0;
  const isPreviewPage = location.pathname === '/preview';

  const currentThemeData = themes.find(theme => theme.id === currentTheme);

  return (
    <nav className="bg-white min-w-[10px] shadow-md border-b border-gray-200 p-2 rounded-full m-2 md:m-5">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-12 md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
              Weekendly
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <DaySelector />
            {/* Theme Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                aria-expanded={isThemeDropdownOpen}
                aria-haspopup="true"
                aria-label={`Current theme: ${currentThemeData?.name}. Click to change theme`}
              >
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentThemeData?.gradient}`}></div>
                <span>{currentThemeData?.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isThemeDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  role="menu"
                  aria-label="Theme selection menu"
                >
                  <div className="py-1">
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          dispatch(setTheme(theme.id));
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`w-full bg-white flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                          currentTheme === theme.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                        role="menuitem"
                        aria-label={`Select ${theme.name} theme`}
                        aria-current={currentTheme === theme.id ? 'true' : 'false'}
                      >
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
                        <span>{theme.name}</span>
                        {currentTheme === theme.id && (
                          <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Share/Export Button */}
            {isPreviewPage ? (
              <Button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <AppIcon name="Home" size={16} />
                Home
              </Button>
            ) : (
              <>
                {hasActivities && (
                  <Button 
                    onClick={() => navigate('/preview')}
                    className="flex items-center gap-2"
                  >
                    <AppIcon name="Share2" size={16} />
                    Share
                  </Button>
                )}
                {/* <ExportButton /> */}
              </>
            )}
            <Button variant="danger" size="md" onClick={() => dispatch(clearSchedule())} aria-label="Clear entire schedule">Clear</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              
              {/* Mobile Day Selector */}
              <div className="w-full">
                <DaySelector />
              </div>
              
              {/* Mobile Theme Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${currentThemeData?.gradient}`}></div>
                    <span>{currentThemeData?.name}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Dropdown Menu */}
                {isThemeDropdownOpen && (
                  <div className="mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="py-1">
                      {themes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            dispatch(setTheme(theme.id));
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`w-full bg-white flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                            currentTheme === theme.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
                          <span>{theme.name}</span>
                          {currentTheme === theme.id && (
                            <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-2">
                {isPreviewPage ? (
                  <Button 
                    onClick={() => {
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <AppIcon name="Home" size={16} />
                    Home
                  </Button>
                ) : (
                  <>
                    {hasActivities && (
                      <Button 
                        onClick={() => {
                          navigate('/preview');
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 w-full"
                      >
                        <AppIcon name="Share2" size={16} />
                        Share
                      </Button>
                    )}
                  </>
                )}
                <Button 
                  variant="danger" 
                  size="md" 
                  onClick={() => {
                    dispatch(clearSchedule());
                    setIsMobileMenuOpen(false);
                  }} 
                  className="w-full"
                  aria-label="Clear entire schedule"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isThemeDropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsThemeDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
