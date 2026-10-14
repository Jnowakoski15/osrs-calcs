import { describe, it, expect } from 'vitest';
import { levelToXp, xpToLevel, formatGp, formatNumber } from './osrs';

describe('OSRS Utilities', () => {
  it('correctly maps levels to XP values', () => {
    expect(levelToXp(1)).toBe(0);
    expect(levelToXp(2)).toBe(83);
    expect(levelToXp(50)).toBe(101333);
    expect(levelToXp(92)).toBe(6517253);
    expect(levelToXp(99)).toBe(13034431);
  });

  it('correctly maps XP to levels', () => {
    expect(xpToLevel(0)).toBe(1);
    expect(xpToLevel(82)).toBe(1);
    expect(xpToLevel(83)).toBe(2);
    expect(xpToLevel(6517253)).toBe(92);
    expect(xpToLevel(13034431)).toBe(99);
    expect(xpToLevel(200000000)).toBe(99);
  });

  it('formats GP with readable suffixes', () => {
    expect(formatGp(500)).toBe('500');
    expect(formatGp(150000)).toBe('150.0K');
    expect(formatGp(15500000)).toBe('15.50M');
    expect(formatGp(-25000000)).toBe('-25.00M');
  });

  it('formats integer numbers', () => {
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });
});
