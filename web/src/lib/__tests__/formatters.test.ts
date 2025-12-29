import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatNumber } from '../formatters';

describe('formatCurrency', () => {
  it('should format positive integers as USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(1)).toBe('$1.00');
  });

  it('should format decimal numbers with 2 decimal places', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(99.99)).toBe('$99.99');
    expect(formatCurrency(0.01)).toBe('$0.01');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(0.0)).toBe('$0.00');
  });

  it('should format large numbers with thousand separators', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });

  it('should format numbers with more than 2 decimal places by rounding', () => {
    expect(formatCurrency(10.999)).toBe('$11.00');
    expect(formatCurrency(10.995)).toBe('$11.00');
    expect(formatCurrency(10.994)).toBe('$10.99');
  });

});

describe('formatDate', () => {
  it('should format valid date strings', () => {
    expect(formatDate('2025-03-10')).toBe('Mar 10, 2025');
    expect(formatDate('2024-12-25')).toBe('Dec 25, 2024');
    expect(formatDate('2023-01-01')).toBe('Jan 01, 2023');
  });

  it('should return "N/A" for null values', () => {
    expect(formatDate(null)).toBe('N/A');
  });

  it('should return "N/A" for empty strings', () => {
    expect(formatDate('')).toBe('N/A');
  });

  it('should return "N/A" for invalid date strings', () => {
    expect(formatDate('invalid-date')).toBe('N/A');
    expect(formatDate('not-a-date')).toBe('N/A');
  });
});

describe('formatNumber', () => {
  it('should format positive integers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(123)).toBe('123');
  });

  it('should format decimal numbers', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
    expect(formatNumber(99.99)).toBe('99.99');
  });

});

