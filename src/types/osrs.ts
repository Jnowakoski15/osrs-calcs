export type SkillName =
  | 'overall'
  | 'attack'
  | 'defence'
  | 'strength'
  | 'hitpoints'
  | 'ranged'
  | 'prayer'
  | 'magic'
  | 'cooking'
  | 'woodcutting'
  | 'fletching'
  | 'fishing'
  | 'firemaking'
  | 'crafting'
  | 'smithing'
  | 'mining'
  | 'herblore'
  | 'agility'
  | 'thieving'
  | 'slayer'
  | 'farming'
  | 'runecraft'
  | 'hunter'
  | 'construction';

export interface SkillDetail {
  rank: number;
  level: number;
  xp: number;
}

export type PlayerSkills = Record<SkillName, SkillDetail>;

export interface PlayerProfile {
  rsn: string;
  lastUpdated: number;
  skills: PlayerSkills;
}

export interface GEItemPrice {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
}

export type CalculatorId =
  | 'birdhouse'
  | 'cannonball'
  | 'blast-furnace'
  | 'ardy-knight'
  | 'vyres'
  | 'master-farmer';

export interface CalculatorMeta {
  id: CalculatorId;
  name: string;
  category: 'Hunter' | 'Smithing' | 'Thieving';
  description: string;
  badge?: string;
  icon: string;
}
