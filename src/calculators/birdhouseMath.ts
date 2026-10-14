export interface BirdhouseTier {
  id: string;
  name: string;
  level: number;
  logId: number;
  xpPerHouse: number;
  baseNests: number; // avg nests per house
}

export const BIRDHOUSE_TIERS: BirdhouseTier[] = [
  { id: 'regular', name: 'Regular Birdhouse', level: 5, logId: 1511, xpPerHouse: 280, baseNests: 0.5 },
  { id: 'oak', name: 'Oak Birdhouse', level: 14, logId: 1521, xpPerHouse: 420, baseNests: 0.75 },
  { id: 'willow', name: 'Willow Birdhouse', level: 24, logId: 1519, xpPerHouse: 560, baseNests: 1.0 },
  { id: 'teak', name: 'Teak Birdhouse', level: 34, logId: 6333, xpPerHouse: 700, baseNests: 1.25 },
  { id: 'maple', name: 'Maple Birdhouse', level: 44, logId: 1517, xpPerHouse: 820, baseNests: 1.5 },
  { id: 'mahogany', name: 'Mahogany Birdhouse', level: 59, logId: 6332, xpPerHouse: 960, baseNests: 1.75 },
  { id: 'yew', name: 'Yew Birdhouse', level: 74, logId: 1515, xpPerHouse: 1020, baseNests: 2.0 },
  { id: 'magic', name: 'Magic Birdhouse', level: 89, logId: 1513, xpPerHouse: 1140, baseNests: 2.25 },
  { id: 'redwood', name: 'Redwood Birdhouse', level: 95, logId: 19669, xpPerHouse: 1200, baseNests: 2.5 },
];

export interface BirdhouseCalculationResult {
  totalXp: number;
  totalNests: number;
  totalCost: number;
  totalRevenue: number;
  netProfit: number;
  profitPerRun: number;
  xpPerRun: number;
  runsCount: number;
  daysToComplete: number;
}

export function calculateBirdhouseResults(params: {
  tierId: string;
  count: number;
  logPrice: number;
  emptyNestPrice: number;
  seedNestPrice: number;
  seedCostPerHouse?: number; // default 100gp (10 hop seeds)
  runsPerDay?: number; // default 4
}): BirdhouseCalculationResult {
  const {
    tierId,
    count,
    logPrice,
    emptyNestPrice,
    seedNestPrice,
    seedCostPerHouse = 100,
    runsPerDay = 4,
  } = params;

  const tier = BIRDHOUSE_TIERS.find((t) => t.id === tierId) || BIRDHOUSE_TIERS[0];
  const safeCount = Math.max(0, count);

  const totalXp = safeCount * tier.xpPerHouse;
  const totalNests = safeCount * tier.baseNests;

  // Cost: log cost + 10 hop seeds (100gp) per house
  const totalCost = safeCount * (logPrice + seedCostPerHouse);

  // Nest revenue distribution: ~65% empty nests, ~35% seed nests
  const emptyNests = totalNests * 0.65;
  const seedNests = totalNests * 0.35;
  const totalRevenue = emptyNests * emptyNestPrice + seedNests * seedNestPrice;

  const netProfit = totalRevenue - totalCost;
  const runsCount = Math.ceil(safeCount / 4);
  const profitPerRun = runsCount > 0 ? netProfit / runsCount : 0;
  const xpPerRun = runsCount > 0 ? totalXp / runsCount : 0;
  const daysToComplete = runsPerDay > 0 ? Math.ceil(runsCount / runsPerDay) : 0;

  return {
    totalXp,
    totalNests,
    totalCost,
    totalRevenue,
    netProfit,
    profitPerRun,
    xpPerRun,
    runsCount,
    daysToComplete,
  };
}

export function getBestBirdhouseTierForLevel(hunterLevel: number): BirdhouseTier {
  const eligible = BIRDHOUSE_TIERS.filter((t) => hunterLevel >= t.level);
  return eligible[eligible.length - 1] || BIRDHOUSE_TIERS[0];
}
