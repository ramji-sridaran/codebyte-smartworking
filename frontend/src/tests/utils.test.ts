import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatDate, formatDateTime, isOverdue, validateTitle, validateDueDate } from '../utils';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-02-23T10:00:00';
      const result = formatDate(date);
      expect(result).toContain('Feb');
      expect(result).toContain('23');
    });

    it('should return "No due date" for undefined', () => {
      const result = formatDate(undefined);
      expect(result).toBe('No due date');
    });
  });

  describe('validateTitle', () => {
    it('should return error for empty title', () => {
      const errors = validateTitle('');
      expect(errors).toContain('Title is required');
    });

    it('should return error for title exceeding max length', () => {
      const longTitle = 'a'.repeat(101);
      const errors = validateTitle(longTitle);
      expect(errors).toContain('Title must be 100 characters or less');
    });

    it('should return no errors for valid title', () => {
      const errors = validateTitle('Valid Task Title');
      expect(errors).toHaveLength(0);
    });
  });

  describe('isOverdue', () => {
    it('should return true for past date', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
      const result = isOverdue(pastDate);
      expect(result).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString(); // 1 day later
      const result = isOverdue(futureDate);
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = isOverdue(undefined);
      expect(result).toBe(false);
    });
  });
});

