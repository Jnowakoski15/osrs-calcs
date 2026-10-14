import { describe, it, expect } from 'vitest';
import {
  calculateBirdhouseResults,
  getBestBirdhouseTierForLevel,
} from './birdhouseMath';

describe('Birdhouse Math Calculations', () => {
  it('selects correct tier based on hunter level', () => {
    expect(getBestBirdhouseTierForLevel(1).id).toBe('regular');
    expect(getBestBirdhouseTierForLevel(14).id).toBe('oak');
    expect(getBestBirdhouseTierForLevel(50).id).toBe('maple');
    expect(getBestBirdhouseTierForLevel(74).id).toBe('yew');
    expect(getBestBirdhouseTierForLevel(89).id).toBe('magic');
    expect(getBestBirdhouseTierForLevel(99).id).toBe('redwood');
  });

  it('calculates expected XP, nests, and profit for Yew Birdhouses', () => {
    // 4 Yew Birdhouses (1 run)
    const result = calculateBirdhouseResults({
      tierId: 'yew',
      count: 4,
      logPrice: 200,
      emptyNestPrice: 5000,
      seedNestPrice: 10000,
      seedCostPerHouse: 100,
      runsPerDay: 4,
    });

    // 4 houses * 1020 xp = 4080 XP
    expect(result.totalXp).toBe(4080);
    // 4 houses * 2.0 nests = 8 nests
    expect(result.totalNests).toBe(8);
    // Cost: 4 * (200 + 100) = 1200 GP
    expect(result.totalCost).toBe(1200);
    // Runs count: 1 run
    expect(result.runsCount).toBe(1);
    expect(result.netProfit).toBeGreaterThan(0);
  });
});
