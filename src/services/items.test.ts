import { describe, it, expect } from 'vitest';
import { OSRS_ITEMS, FALLBACK_PRICES } from './items';

describe('Items and Pricing Service', () => {
  it('has valid item IDs for core items', () => {
    expect(OSRS_ITEMS.CANNONBALL).toBe(2);
    expect(OSRS_ITEMS.STEEL_BAR).toBe(2353);
    expect(OSRS_ITEMS.BLOOD_SHARD).toBe(24777);
    expect(OSRS_ITEMS.BIRD_NEST_SEEDS).toBe(5073);
  });

  it('provides valid non-negative fallback prices for all tracked items', () => {
    for (const [key, id] of Object.entries(OSRS_ITEMS)) {
      const price = FALLBACK_PRICES[id];
      expect(price, `Price for ${key} (${id}) should be defined`).toBeGreaterThanOrEqual(0);
    }
  });
});
