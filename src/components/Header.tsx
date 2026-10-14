import React from 'react';
import { Search, Shield, Feather, Hammer, Flame, Skull, Sprout } from 'lucide-react';
import { CalculatorId } from '../types/osrs';

interface HeaderProps {
  activeCalc: CalculatorId;
  onSelectCalc: (id: CalculatorId) => void;
  onOpenCommandPalette: () => void;
  rsnSlot?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  activeCalc,
  onSelectCalc,
  onOpenCommandPalette,
  rsnSlot,
}) => {
  const tabs: { id: CalculatorId; label: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'birdhouse', label: 'Birdhouse Run', icon: <Feather className="w-3.5 h-3.5" />, badge: 'Hunter' },
    { id: 'cannonball', label: 'Cannonball Profit', icon: <Hammer className="w-3.5 h-3.5" />, badge: 'Smithing' },
    { id: 'blast-furnace', label: 'Blast Furnace', icon: <Flame className="w-3.5 h-3.5" />, badge: 'Smithing' },
    { id: 'ardy-knight', label: 'Ardy Knights', icon: <Shield className="w-3.5 h-3.5" />, badge: 'Thieving' },
    { id: 'vyres', label: 'Vyre Pickpocketing', icon: <Skull className="w-3.5 h-3.5" />, badge: 'Thieving' },
    { id: 'master-farmer', label: 'Master Farmer', icon: <Sprout className="w-3.5 h-3.5" />, badge: 'Thieving' },
  ];

  return (
    <header className="border-b border-[#2a221b] bg-[#120f0d]/95 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & OSRS Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-[#4a3b2c] via-[#2c2014] to-[#1a130b] flex items-center justify-center shadow-lg border-t border-[#785b3a] border-b border-[#0d0906]">
              <Shield className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-amber-400 osrs-heading drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  OSRS PORTAL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-700/40">
                  Calculators
                </span>
              </div>
              <p className="text-[11px] text-[#9c8e82] hidden sm:block">
                Ultra-fast, zero-friction Old School RuneScape utilities
              </p>
            </div>
          </div>

          {/* Center: Recessed Command Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[#a89b91] bg-[#0c0a08] hover:bg-[#15120f] rounded-lg border border-[#2b241d] hover:border-amber-600/50 transition-all cursor-pointer group shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#736558] group-hover:text-amber-400 transition-colors" />
                <span>Search calculators, items, or skills...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1c1814] text-[#bdafa4] rounded border border-[#3b322a]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: RSN slot & GitHub */}
          <div className="flex items-center gap-3">
            {rsnSlot}

            <a
              href="https://github.com/Jnowakoski15/osrs-calcs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#a89b91] hover:text-amber-400 hover:bg-[#1f1a15] rounded-lg border border-transparent hover:border-[#382f27] transition-colors"
              title="View Source on GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Authentic OSRS Inventory/Skill Tab Navigation */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-[#241c16] text-xs no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeCalc === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCalc(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'osrs-active-tab font-bold text-amber-300'
                    : 'text-[#9c8e82] hover:text-[#f3eae3] hover:bg-[#1a1511]'
                }`}
              >
                <span className={isActive ? 'text-amber-400' : 'text-[#736558]'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                  isActive ? 'bg-[#3b2b1a] text-amber-400' : 'bg-[#1a1512] text-[#6d5e53]'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
