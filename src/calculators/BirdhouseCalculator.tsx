import React, { useState, useMemo, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { usePrices } from '../context/PriceContext';
import { OSRS_ITEMS } from '../services/items';
import { formatGp, formatNumber, levelToXp } from '../utils/osrs';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-amber-400 osrs-heading flex items-center gap-2">
              <Feather className="w-5 h-5 text-amber-500" />
              Birdhouse Run Calculator
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
              Zero-Click Live
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Calculate expected loot, profit, and Hunter XP across all birdhouse types.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-amber-500/30 transition-all cursor-pointer shadow-sm"
          title="Copy shareable calculation link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Share Setup'}</span>
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Birdhouse Tier Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Select Birdhouse Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {BIRDHOUSE_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                const isUnlocked = playerHunterLvl >= tier.level;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-2.5 rounded-lg text-left transition-all cursor-pointer border relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/30'
                        : isUnlocked
                        ? 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850 hover:border-stone-700'
                        : 'bg-stone-950/60 border-stone-900 text-stone-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold truncate">{tier.name.replace(' Birdhouse', '')}</span>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-stone-800 text-stone-400">
                        Lvl {tier.level}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 flex items-center justify-between">
                      <span>{tier.xpPerHouse} XP</span>
                      <span>{tier.baseNests} nests</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Input & 1-Click Quick Chips */}
          <div className="bg-stone-900/50 p-4 rounded-xl border border-stone-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
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
                className="w-full px-3.5 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40"
              />
              <span className="text-xs text-stone-400 whitespace-nowrap font-medium">
                = {results.runsCount} runs
              </span>
            </div>

            <QuickChips options={quickPresets} onSelect={setCount} activeValue={count} />

            {/* Runs per day slider */}
            <div className="pt-2 border-t border-stone-800/60">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                <span>Runs Per Day: <strong className="text-amber-300">{runsPerDay}</strong> (50 min cooldown)</span>
                <span>Est. Time: <strong className="text-stone-200">{results.daysToComplete} days</strong></span>
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
          <div className="osrs-box p-5 rounded-xl border border-stone-800 bg-stone-900/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                Expected Results
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <Coins className="w-3 h-3" />
                {isLive ? 'Live GE Prices' : 'Cached GE Prices'}
              </span>
            </div>

            {/* Net Profit Big Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-stone-950 to-stone-900 border border-stone-800 text-center">
              <span className="text-xs text-stone-400 font-medium">Expected Net Profit</span>
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono mt-1 ${
                results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatGp(results.netProfit)} GP
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                ≈ {formatGp(results.profitPerRun)} GP per 4-house run
              </span>
            </div>

            {/* Stat Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-stone-400 block text-[11px]">Total Hunter XP</span>
                <span className="text-base font-bold text-amber-300 font-mono">
                  {formatNumber(results.totalXp)}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {formatNumber(results.xpPerRun)} XP / run
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-stone-400 block text-[11px]">Bird Nests</span>
                <span className="text-base font-bold text-amber-200 font-mono">
                  ~{results.totalNests.toFixed(1)}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  ~{(results.totalNests * 0.35).toFixed(1)} seed nests
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-stone-400 block text-[11px]">Total Cost</span>
                <span className="text-sm font-semibold text-rose-300 font-mono">
                  {formatGp(results.totalCost)} GP
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {logPrice} GP / log
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800/80">
                <span className="text-stone-400 block text-[11px]">Gross Revenue</span>
                <span className="text-sm font-semibold text-emerald-300 font-mono">
                  {formatGp(results.totalRevenue)} GP
                </span>
                <span className="text-[10px] text-stone-500 block">
                  Nests & seeds value
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 flex items-center gap-1.5 border-t border-stone-800/60">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                At {runsPerDay} runs/day, this will take approximately <strong>{results.daysToComplete} days</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
