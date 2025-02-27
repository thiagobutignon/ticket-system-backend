
import { isValidDate } from './date';

describe('isValidDate', () => {
  it('should return true for a valid date string', () => {
    expect(isValidDate('2024-01-01')).toBeTruthy();
  });

  it('should return false for an invalid date string', () => {
    expect(isValidDate('invalid-date')).toBeFalsy();
  });

  it('should return false for an empty string', () => {
    expect(isValidDate('')).toBeFalsy();
  });

  it('should return false for null', () => {
    expect(isValidDate(null)).toBeFalsy();
  });

  it('should return false for undefined', () => {
    expect(isValidDate(undefined)).toBeFalsy();
  });
});
