import React, { useState, useMemo, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { usePrices } from '../context/PriceContext';
import { OSRS_ITEMS } from '../services/items';
import { formatGp, formatNumber, levelToXp, getGpColorClass } from '../utils/osrs';
import { QuickChips } from '../components/QuickChips';
import {
  BIRDHOUSE_TIERS,
  calculateBirdhouseResults,
  getBestBirdhouseTierForLevel,
} from './birdhouseMath';
import { Share2, Clock, Coins, Sparkles, Feather, Check } from 'lucide-react';

export const BirdhouseCalculator: React.FC = () => {
  const { getSkillLevel, getSkillXp, profile } = usePlayer();
  const { getPrice, isLive } = usePrices();

  // URL state initialization if available
  const initialParams = useMemo(() => {
    const search = new URLSearchParams(window.location.search);
    return {
      tier: search.get('bh_tier'),
      count: search.get('bh_count') ? parseInt(search.get('bh_count')!, 10) : null,
      runsPerDay: search.get('bh_rpd') ? parseInt(search.get('bh_rpd')!, 10) : 4,
    };
  }, []);

  const playerHunterLvl = getSkillLevel('hunter', 1);
  const playerHunterXp = getSkillXp('hunter', 0);

  const [selectedTierId, setSelectedTierId] = useState<string>(() => {
    if (initialParams.tier) return initialParams.tier;
    return getBestBirdhouseTierForLevel(playerHunterLvl).id;
  });

  const [count, setCount] = useState<number>(initialParams.count ?? 16);
  const [runsPerDay, setRunsPerDay] = useState<number>(initialParams.runsPerDay ?? 4);
  const [copied, setCopied] = useState(false);

  // Auto-sync best tier when player profile loads, if user hasn't overridden
  useEffect(() => {
    if (profile && !initialParams.tier) {
      setSelectedTierId(getBestBirdhouseTierForLevel(playerHunterLvl).id);
    }
  }, [profile, playerHunterLvl, initialParams.tier]);

  const selectedTier = useMemo(
    () => BIRDHOUSE_TIERS.find((t) => t.id === selectedTierId) || BIRDHOUSE_TIERS[0],
    [selectedTierId]
  );

  // Live GE prices for log and nests
  const logPrice = getPrice(selectedTier.logId);
  const emptyNestPrice = getPrice(OSRS_ITEMS.BIRD_NEST_EMPTY, 5800);
  const seedNestPrice = getPrice(OSRS_ITEMS.BIRD_NEST_SEEDS, 9200);

  // Instant reactive calculation
  const results = useMemo(() => {
    return calculateBirdhouseResults({
      tierId: selectedTier.id,
      count,
      logPrice,
      emptyNestPrice,
      seedNestPrice,
      runsPerDay,
    });
  }, [selectedTier.id, count, logPrice, emptyNestPrice, seedNestPrice, runsPerDay]);

  // One-click target 99 calculation
  const handleTarget99 = () => {
    const targetXp = levelToXp(99);
    const xpNeeded = Math.max(0, targetXp - playerHunterXp);
    const housesNeeded = Math.ceil(xpNeeded / selectedTier.xpPerHouse);
    setCount(housesNeeded);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('calc', 'birdhouse');
    url.searchParams.set('bh_tier', selectedTier.id);
    url.searchParams.set('bh_count', count.toString());
    url.searchParams.set('bh_rpd', runsPerDay.toString());
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPresets = [
    { label: '1 Run (4)', value: 4 },
    { label: '1 Day (16)', value: 16 },
    { label: '1 Week (112)', value: 112 },
    { label: '500 Houses', value: 500 },
    { label: '1,000 Houses', value: 1000 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#292019]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-amber-300 osrs-heading flex items-center gap-2">
              <Feather className="w-5 h-5 text-amber-400 drop-shadow" />
              Birdhouse Run Calculator
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-700/40 font-semibold tracking-wide">
              Zero-Click Live
            </span>
          </div>
          <p className="text-xs text-[#9c8e82] mt-1">
            Calculate expected loot, profit, and Hunter XP across all birdhouse types.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="osrs-btn flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300"
          title="Copy shareable calculation link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
          <span>{copied ? 'Link Copied!' : 'Share Setup'}</span>
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Birdhouse Tier Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#b8aaa0] uppercase tracking-wider">
                Select Birdhouse Type
              </label>
              <span className="text-[11px] text-[#8c7e73]">
                Your Hunter Level: <strong className="text-amber-300">{playerHunterLvl}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {BIRDHOUSE_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                const isUnlocked = playerHunterLvl >= tier.level;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-2.5 rounded-md text-left transition-all cursor-pointer border relative flex flex-col justify-between ${
                      isSelected
                        ? 'osrs-active-tab border-amber-500 text-amber-200'
                        : isUnlocked
                        ? 'bg-[#181411] border-[#29211a] text-[#c4b7ad] hover:bg-[#211a15] hover:border-[#423429]'
                        : 'bg-[#0f0d0b] border-[#1f1915] text-[#594d43] opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold truncate">{tier.name.replace(' Birdhouse', '')}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                        isUnlocked ? 'bg-[#292018] text-amber-300/80' : 'bg-[#151210] text-[#594d43]'
                      }`}>
                        Lvl {tier.level}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8a7b6f] flex items-center justify-between font-mono">
                      <span>{tier.xpPerHouse} XP</span>
                      <span>{tier.baseNests} nests</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Input & 1-Click Quick Chips */}
          <div className="osrs-well p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#b8aaa0] uppercase tracking-wider">
                Number of Birdhouses
              </label>
              <button
                type="button"
                onClick={handleTarget99}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Calculate exact birdhouses needed from your current Hunter XP to level 99"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                Target 99 Hunter ({formatNumber(Math.max(0, levelToXp(99) - playerHunterXp))} XP left)
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="100000"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2 text-sm bg-[#080605] border border-[#2b221a] rounded-md text-[#f5f5f4] font-mono focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/30"
              />
              <span className="text-xs text-[#8c7e73] whitespace-nowrap font-medium">
                = {results.runsCount} runs
              </span>
            </div>

            <QuickChips options={quickPresets} onSelect={setCount} activeValue={count} />

            {/* Runs per day slider */}
            <div className="pt-2 border-t border-[#211a14]">
              <div className="flex items-center justify-between text-xs text-[#8c7e73] mb-1.5">
                <span>Runs Per Day: <strong className="text-amber-300">{runsPerDay}</strong> (50 min cooldown)</span>
                <span>Est. Time: <strong className="text-[#cfc2b6]">{results.daysToComplete} days</strong></span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={runsPerDay}
                onChange={(e) => setRunsPerDay(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Outputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="osrs-stone-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#292019]">
              <span className="text-xs uppercase tracking-wider font-bold text-[#b8aaa0]">
                Expected Loot & Profit
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {isLive ? 'Live OSRS GE Prices' : 'Cached GE Prices'}
              </span>
            </div>

            {/* Net Profit Banner with Authentic OSRS Coin Stack Coloring */}
            <div className="p-4 rounded-lg bg-[#0d0a08] border border-[#292019] text-center shadow-inner">
              <span className="text-xs text-[#8a7b6f] font-semibold uppercase tracking-wider">
                Expected Net Profit
              </span>
              <div className={`text-3xl sm:text-4xl font-extrabold font-mono mt-1 ${getGpColorClass(results.netProfit)}`}>
                {formatGp(results.netProfit)} GP
              </div>
              <span className="text-[11px] text-[#736558] mt-1 block font-mono">
                ≈ {formatGp(results.profitPerRun)} GP per 4-house run
              </span>
            </div>

            {/* Stat Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="osrs-well p-3">
                <span className="text-[#8a7b6f] block text-[10px] uppercase font-bold tracking-wider">Total Hunter XP</span>
                <span className="text-base font-bold text-amber-300 font-mono">
                  {formatNumber(results.totalXp)}
                </span>
                <span className="text-[10px] text-[#6d5e53] block font-mono">
                  {formatNumber(results.xpPerRun)} XP / run
                </span>
              </div>

              <div className="osrs-well p-3">
                <span className="text-[#8a7b6f] block text-[10px] uppercase font-bold tracking-wider">Bird Nests</span>
                <span className="text-base font-bold text-amber-200 font-mono">
                  ~{results.totalNests.toFixed(1)}
                </span>
                <span className="text-[10px] text-[#6d5e53] block font-mono">
                  ~{(results.totalNests * 0.35).toFixed(1)} seed nests
                </span>
              </div>

              <div className="osrs-well p-3">
                <span className="text-[#8a7b6f] block text-[10px] uppercase font-bold tracking-wider">Total Cost</span>
                <span className="text-sm font-semibold text-rose-300 font-mono">
                  {formatGp(results.totalCost)} GP
                </span>
                <span className="text-[10px] text-[#6d5e53] block font-mono">
                  {logPrice} GP / log
                </span>
              </div>

              <div className="osrs-well p-3">
                <span className="text-[#8a7b6f] block text-[10px] uppercase font-bold tracking-wider">Gross Revenue</span>
                <span className="text-sm font-semibold text-emerald-300 font-mono">
                  {formatGp(results.totalRevenue)} GP
                </span>
                <span className="text-[10px] text-[#6d5e53] block font-mono">
                  Nests & seeds value
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#8a7b6f] flex items-center gap-1.5 border-t border-[#292019]">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                At {runsPerDay} runs/day, this will take approximately <strong className="text-amber-300">{results.daysToComplete} days</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
