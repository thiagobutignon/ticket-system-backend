import { isRequired } from './required';

describe('isRequired', () => {
  it('should return true for null', () => {
    expect(isRequired(null)).toBeTruthy();
  });

  it('should return true for undefined', () => {
    expect(isRequired(undefined)).toBeTruthy();
  });

  it('should return true for an empty string', () => {
    expect(isRequired('')).toBeTruthy();
  });

  it('should return false for a non-empty string', () => {
    expect(isRequired('test')).toBeFalsy();
  });

  it('should return false for a number', () => {
    expect(isRequired(123)).toBeFalsy();
  });

  it('should return false for an object', () => {
    expect(isRequired({})).toBeFalsy();
  });

  it('should return false for an array', () => {
    expect(isRequired([])).toBeFalsy();
  });
});
