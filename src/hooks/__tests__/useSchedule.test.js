
import { renderHook, act } from '@testing-library/react';
import useSchedule from '../useSchedule';

describe('useSchedule', () => {
  describe('validateTimeSlot', () => {
    it('returns true for valid time slots between 8 and 23', () => {
      const { result } = renderHook(() => useSchedule());
      const { validateTimeSlot } = result.current;

      expect(validateTimeSlot(8)).toBe(true);
      expect(validateTimeSlot(12)).toBe(true);
      expect(validateTimeSlot(18)).toBe(true);
      expect(validateTimeSlot(23)).toBe(true);
    });

    it('returns false for time slots outside valid range', () => {
      const { result } = renderHook(() => useSchedule());
      const { validateTimeSlot } = result.current;

      expect(validateTimeSlot(0)).toBe(false);
      expect(validateTimeSlot(7)).toBe(false);
      expect(validateTimeSlot(24)).toBe(false);
      expect(validateTimeSlot(25)).toBe(false);
      expect(validateTimeSlot(-1)).toBe(false);
    });

    it('returns true for decimal values within range', () => {
      const { result } = renderHook(() => useSchedule());
      const { validateTimeSlot } = result.current;

      expect(validateTimeSlot(8.5)).toBe(true);
      expect(validateTimeSlot(12.7)).toBe(true);
    });

    it('returns true for string values that can be converted to numbers', () => {
      const { result } = renderHook(() => useSchedule());
      const { validateTimeSlot } = result.current;

      expect(validateTimeSlot('8')).toBe(true);
      expect(validateTimeSlot('12')).toBe(true);
    });
  });

  describe('hasTimeConflict', () => {
    it('returns false when there are no conflicts', () => {
      const { result } = renderHook(() => useSchedule());
      const { hasTimeConflict } = result.current;

      const schedule = {
        saturday: [
          { id: '1', startTime: 9, duration: 1 },
          { id: '2', startTime: 14, duration: 2 }
        ]
      };

      expect(hasTimeConflict(schedule, 'saturday', 11, 1)).toBe(false);
      expect(hasTimeConflict(schedule, 'saturday', 16, 1)).toBe(false);
    });

    it('returns true when there is a time conflict', () => {
      const { result } = renderHook(() => useSchedule());
      const { hasTimeConflict } = result.current;

      const schedule = {
        saturday: [
          { id: '1', startTime: 9, duration: 1 },
          { id: '2', startTime: 14, duration: 2 }
        ]
      };

      // Conflict with first activity (9-10)
      expect(hasTimeConflict(schedule, 'saturday', 9, 1)).toBe(true);
      expect(hasTimeConflict(schedule, 'saturday', 9.5, 1)).toBe(true);
      expect(hasTimeConflict(schedule, 'saturday', 8.5, 1)).toBe(true);

      
      expect(hasTimeConflict(schedule, 'saturday', 14, 1)).toBe(true);
      expect(hasTimeConflict(schedule, 'saturday', 15, 1)).toBe(true);
      expect(hasTimeConflict(schedule, 'saturday', 13.5, 1)).toBe(true);
    });

    it('returns true when new activity completely overlaps existing activity', () => {
      const { result } = renderHook(() => useSchedule());
      const { hasTimeConflict } = result.current;

      const schedule = {
        saturday: [
          { id: '1', startTime: 10, duration: 2 }
        ]
      };

      
      expect(hasTimeConflict(schedule, 'saturday', 9, 3)).toBe(true);
    });

    it('returns true when existing activity completely overlaps new activity', () => {
      const { result } = renderHook(() => useSchedule());
      const { hasTimeConflict } = result.current;

      const schedule = {
        saturday: [
          { id: '1', startTime: 9, duration: 4 }
        ]
      };

      
      expect(hasTimeConflict(schedule, 'saturday', 10, 2)).toBe(true);
    });

    it('excludes activity by id when provided', () => {
      const { result } = renderHook(() => useSchedule());
      const { hasTimeConflict } = result.current;

      const schedule = {
        saturday: [
          { id: '1', startTime: 9, duration: 1 },
          { id: '2', startTime: 14, duration: 2 }
        ]
      };

      // Should not conflict with activity '1' when excluding it
      expect(hasTimeConflict(schedule, 'saturday', 9, 1, '1')).toBe(false);
      expect(hasTimeConflict(schedule, 'saturday', 9, 1, '2')).toBe(true);
    });

    it('handles empty schedule', () => {
      const { result } = renderHook(() => useSchedule());
      const { hasTimeConflict } = result.current;

      const schedule = {
        saturday: []
      };

      expect(hasTimeConflict(schedule, 'saturday', 9, 1)).toBe(false);
    });

    it('handles different days', () => {
      const { result } = renderHook(() => useSchedule());
      const { hasTimeConflict } = result.current;

      const schedule = {
        saturday: [{ id: '1', startTime: 9, duration: 1 }],
        sunday: [{ id: '2', startTime: 14, duration: 2 }]
      };

     
      expect(hasTimeConflict(schedule, 'sunday', 9, 1)).toBe(false);
      expect(hasTimeConflict(schedule, 'saturday', 14, 2)).toBe(false);
    });
  });

  describe('formatTime', () => {
    it('formats 12-hour time correctly', () => {
      const { result } = renderHook(() => useSchedule());
      const { formatTime } = result.current;

      // AM times
      expect(formatTime(1)).toBe('1 AM');
      expect(formatTime(8)).toBe('8 AM');
      expect(formatTime(11)).toBe('11 AM');
      expect(formatTime(12)).toBe('12 PM');

      // PM times
      expect(formatTime(13)).toBe('1 PM');
      expect(formatTime(14)).toBe('2 PM');
      expect(formatTime(18)).toBe('6 PM');
      expect(formatTime(23)).toBe('11 PM');
    });

    it('handles edge cases correctly', () => {
      const { result } = renderHook(() => useSchedule());
      const { formatTime } = result.current;

      expect(formatTime(0)).toBe('0 AM');
      expect(formatTime(24)).toBe('12 AM');
    });

    it('handles boundary values', () => {
      const { result } = renderHook(() => useSchedule());
      const { formatTime } = result.current;

      expect(formatTime(12)).toBe('12 PM');
      expect(formatTime(13)).toBe('1 PM');
      expect(formatTime(24)).toBe('12 AM');
    });
  });

  describe('hook stability', () => {
    it('returns the same function references on re-renders', () => {
      const { result, rerender } = renderHook(() => useSchedule());
      const firstRender = result.current;

      rerender();
      const secondRender = result.current;

      expect(firstRender.validateTimeSlot).toBe(secondRender.validateTimeSlot);
      expect(firstRender.hasTimeConflict).toBe(secondRender.hasTimeConflict);
      expect(firstRender.formatTime).toBe(secondRender.formatTime);
    });

    it('functions work correctly after re-renders', () => {
      const { result, rerender } = renderHook(() => useSchedule());
      
      // Test after first render
      expect(result.current.validateTimeSlot(10)).toBe(true);
      expect(result.current.formatTime(10)).toBe('10 AM');

      rerender();

      // Test after re-render
      expect(result.current.validateTimeSlot(10)).toBe(true);
      expect(result.current.formatTime(10)).toBe('10 AM');
    });
  });

  describe('integration tests', () => {
    it('can be used together for complete time slot validation', () => {
      const { result } = renderHook(() => useSchedule());
      const { validateTimeSlot, hasTimeConflict, formatTime } = result.current;

      const schedule = {
        saturday: [
          { id: '1', startTime: 9, duration: 1 },
          { id: '2', startTime: 14, duration: 2 }
        ]
      };

      // Valid time slot with no conflict
      const newTimeSlot = 11;
      const isValid = validateTimeSlot(newTimeSlot);
      const hasConflict = hasTimeConflict(schedule, 'saturday', newTimeSlot, 1);
      const formattedTime = formatTime(newTimeSlot);

      expect(isValid).toBe(true);
      expect(hasConflict).toBe(false);
      expect(formattedTime).toBe('11 AM');
    });

    it('can be used together for invalid time slot', () => {
      const { result } = renderHook(() => useSchedule());
      const { validateTimeSlot, hasTimeConflict, formatTime } = result.current;

      const schedule = {
        saturday: [
          { id: '1', startTime: 9, duration: 1 }
        ]
      };

      // Invalid time slot
      const newTimeSlot = 25;
      const isValid = validateTimeSlot(newTimeSlot);
      const hasConflict = hasTimeConflict(schedule, 'saturday', newTimeSlot, 1);
      const formattedTime = formatTime(newTimeSlot);

      expect(isValid).toBe(false);
      expect(hasConflict).toBe(false); // No conflict check for invalid time
      expect(formattedTime).toBe('13 PM'); // Still formats correctly
    });
  });
});
