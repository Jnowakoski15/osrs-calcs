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
