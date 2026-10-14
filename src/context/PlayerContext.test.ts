import { describe, it, expect } from 'vitest';
import { calculateCombatLevel } from './PlayerContext';

describe('Player Combat Calculation', () => {
  it('calculates combat level 3 for base stats', () => {
    const baseStats = {
      attack: { level: 1 },
      defence: { level: 1 },
      strength: { level: 1 },
      hitpoints: { level: 10 },
      ranged: { level: 1 },
      prayer: { level: 1 },
      magic: { level: 1 },
    };
    expect(calculateCombatLevel(baseStats)).toBe(3);
  });

  it('calculates max combat level 126 for 99 in all combat stats', () => {
    const maxStats = {
      attack: { level: 99 },
      defence: { level: 99 },
      strength: { level: 99 },
      hitpoints: { level: 99 },
      ranged: { level: 99 },
      prayer: { level: 99 },
      magic: { level: 99 },
    };
    expect(calculateCombatLevel(maxStats)).toBe(126);
  });
});
