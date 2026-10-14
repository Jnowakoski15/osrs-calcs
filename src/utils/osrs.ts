import { SkillName, PlayerSkills } from '../types/osrs';

// OSRS XP table for levels 1 to 99
export const XP_TABLE: number[] = [0];
let points = 0;
for (let lvl = 1; lvl <= 99; lvl++) {
  if (lvl > 1) {
    points += Math.floor(lvl - 1 + 300 * Math.pow(2, (lvl - 1) / 7));
    XP_TABLE.push(Math.floor(points / 4));
  }
}

export function levelToXp(level: number): number {
  const boundedLevel = Math.max(1, Math.min(99, Math.floor(level)));
  return XP_TABLE[boundedLevel - 1] ?? 0;
}

export function xpToLevel(xp: number): number {
  if (xp < 0) return 1;
  for (let lvl = 99; lvl >= 1; lvl--) {
    if (xp >= XP_TABLE[lvl - 1]) {
      return lvl;
    }
  }
  return 1;
}

export function formatGp(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  if (abs >= 10_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 100_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}K`;
  }
  return `${sign}${Math.round(abs).toLocaleString()}`;
}

/**
 * Authentic Old School RuneScape coin stack color coding:
 * - Negative amounts: Red (#f87171)
 * - Under 100,000 GP: Classic OSRS Yellow (#facc15)
 * - 100,000 to 9,999,999 GP: Classic OSRS White (#ffffff)
 * - 10,000,000+ GP: Classic OSRS Green (#00ff80)
 */
export function getGpColorClass(amount: number): string {
  if (amount < 0) return 'text-rose-400';
  if (amount >= 10_000_000) return 'text-[#00ff80] drop-shadow-[0_0_8px_rgba(0,255,128,0.3)]';
  if (amount >= 100_000) return 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]';
  return 'text-amber-400';
}

export function formatNumber(num: number): string {
  return Math.round(num).toLocaleString();
}

export const SKILL_LIST: SkillName[] = [
  'overall',
  'attack',
  'hitpoints',
  'mining',
  'strength',
  'agility',
  'smithing',
  'defence',
  'herblore',
  'fishing',
  'ranged',
  'thieving',
  'cooking',
  'prayer',
  'crafting',
  'firemaking',
  'magic',
  'fletching',
  'woodcutting',
  'runecraft',
  'slayer',
  'farming',
  'construction',
  'hunter',
];

export function getDefaultSkills(): PlayerSkills {
  const result = {} as PlayerSkills;
  for (const skill of SKILL_LIST) {
    result[skill] = {
      rank: 1,
      level: skill === 'hitpoints' ? 10 : 1,
      xp: skill === 'hitpoints' ? 1154 : 0,
    };
  }
  return result;
}
