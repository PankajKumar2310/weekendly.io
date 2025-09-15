
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ActivityCard from '../ActivityCard';
import useSchedule from '../../hooks/useSchedule';

// Mock the useSchedule hook
jest.mock('../../hooks/useSchedule');
jest.mock('../ActivityModalTrigger', () => ({ children, activity }) => (
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

describe('ActivityCard', () => {
  const mockFormatTime = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useSchedule.mockReturnValue({
      formatTime: mockFormatTime,
    });
    
    mockFormatTime.mockImplementation((hour) => {
      if (hour === 12) return '12 PM';
      if (hour === 24) return '12 AM';
      return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    });

    // Mock useSelector to return different values
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      const state = {
        schedule: { enabledDays: ['saturday', 'sunday'] },
        theme: { currentTheme: 'light' }
      };
      return selector(state);
    });

    // Mock useDispatch
    const { useDispatch } = require('react-redux');
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('opens quick add modal when quick add button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    expect(screen.getByText('Quick Add Activity')).toBeInTheDocument();
    expect(screen.getByText('Select Day')).toBeInTheDocument();
  });

  it('shows day selection buttons in quick add modal', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    expect(screen.getByText('Saturday')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
  });

  it('shows time selection after day is selected', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    const saturdayButton = screen.getByText('Saturday');
    await user.click(saturdayButton);

    expect(screen.getByText('Select Time')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Choose time...')).toBeInTheDocument();
  });

  it('populates time options correctly', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    const saturdayButton = screen.getByText('Saturday');
    await user.click(saturdayButton);

    // Check if time options are generated (8 AM to 11 PM = 16 options)
    const timeSelect = screen.getByDisplayValue('Choose time...');
    const options = timeSelect.querySelectorAll('option');
    expect(options).toHaveLength(17); // 16 time options + 1 placeholder
  });

  it('calls formatTime for each time option', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    const saturdayButton = screen.getByText('Saturday');
    await user.click(saturdayButton);

    // formatTime should be called for each hour from 8 to 23 (16 times)
    expect(mockFormatTime).toHaveBeenCalledTimes(16);
  });

  it('disables add button when day or time is not selected', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    const addButton = screen.getByText('Add Activity');
    expect(addButton).toBeDisabled();
  });

  it('enables add button when both day and time are selected', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    const saturdayButton = screen.getByText('Saturday');
    await user.click(saturdayButton);

    const timeSelect = screen.getByDisplayValue('Choose time...');
    await user.selectOptions(timeSelect, '8');

    const addButton = screen.getByText('Add Activity');
    expect(addButton).not.toBeDisabled();
  });

  it('dispatches addToSchedule action when add button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    const saturdayButton = screen.getByText('Saturday');
    await user.click(saturdayButton);

    const timeSelect = screen.getByDisplayValue('Choose time...');
    await user.selectOptions(timeSelect, '8');

    const addButton = screen.getByText('Add Activity');
    await user.click(addButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'schedule/addToSchedule',
      payload: {
        activity: mockActivity,
        day: 'saturday',
        timeSlot: 8
      }
    });
  });

  it('closes modal and resets state when cancel is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    expect(screen.getByText('Quick Add Activity')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(screen.queryByText('Quick Add Activity')).not.toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <ActivityCard activity={mockActivity} />
      </Provider>
    );

    const quickAddButton = screen.getByTitle('Quick add to schedule');
    await user.click(quickAddButton);

    expect(screen.getByText('Quick Add Activity')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: '' }); // Close button has no text
    await user.click(closeButton);

    expect(screen.queryByText('Quick Add Activity')).not.toBeInTheDocument();
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

  it('renders activity modal trigger with correct props', () => {
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
