// src/components/__tests__/ActivityCard.simple.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ActivityCard from '../ActivityCard';

// Mock the useSchedule hook
jest.mock('../../hooks/useSchedule', () => ({
  __esModule: true,
  default: () => ({
    formatTime: (hour) => {
      if (hour === 12) return '12 PM';
      if (hour === 24) return '12 AM';
      return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    },
  }),
}));

// Mock ActivityModalTrigger
jest.mock('../ActivityModalTrigger', () => ({ children }) => (
  <div data-testid="activity-modal-trigger">{children}</div>
));

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      schedule: (state = { enabledDays: ['saturday', 'sunday'] }) => state,
      theme: (state = { currentTheme: 'light' }) => state,
    },
    preloadedState: initialState,
  });
};

// Mock activity data
const mockActivity = {
  id: '1',
  title: 'Morning Yoga',
  description: 'Start your day with peaceful yoga',
  duration: 1,
  color: '#4F46E5',
  icon: '🧘‍♀️',
  mood: ['relaxing', 'energizing'],
};

describe('ActivityCard - Simple Tests', () => {
  it('renders activity information correctly', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
    expect(screen.getByText('Start your day with peaceful yoga')).toBeInTheDocument();
    expect(screen.getByText('1 hours')).toBeInTheDocument();
    expect(screen.getByText('relaxing')).toBeInTheDocument();
    expect(screen.getByText('energizing')).toBeInTheDocument();
    expect(screen.getByText('🧘‍♀️')).toBeInTheDocument();
  });

  it('renders quick add and edit buttons', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    expect(screen.getByTitle('Quick add to schedule')).toBeInTheDocument();
    expect(screen.getByTitle('Edit activity')).toBeInTheDocument();
  });

  it('applies correct styling based on activity color', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const card = screen.getByText('Morning Yoga').closest('div');
    expect(card).toHaveStyle('border-left: 4px solid #4F46E5');
  });

  it('renders activity modal trigger', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const modalTrigger = screen.getByTestId('activity-modal-trigger');
    expect(modalTrigger).toBeInTheDocument();
  });
});

