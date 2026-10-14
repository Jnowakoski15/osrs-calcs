import React from 'react';
import { Search, Sparkles } from 'lucide-react';
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
  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/50 border border-amber-400/40">
              <Sparkles className="w-5 h-5 text-stone-950 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wide text-amber-400 osrs-heading">
                  OSRS PORTAL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Streamlined
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Ultra-fast, zero-friction Old School calculators
              </p>
            </div>
          </div>

          {/* Center: Command Palette Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-stone-400 bg-stone-900/80 hover:bg-stone-900 rounded-lg border border-stone-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
                <span>Quick jump to calculator or item...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-800 text-stone-400 rounded border border-stone-700">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: RSN slot & external links */}
          <div className="flex items-center gap-3">
            {rsnSlot}

            <a
              href="https://github.com/Jnowakoski15/osrs-calcs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-900 rounded-lg border border-transparent hover:border-stone-800 transition-colors"
              title="View on GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-stone-900/80 text-sm no-scrollbar">
          {[
            { id: 'birdhouse', label: 'Birdhouse Run', category: 'Hunter' },
            { id: 'cannonball', label: 'Cannonball Profit', category: 'Smithing' },
            { id: 'blast-furnace', label: 'Blast Furnace', category: 'Smithing' },
            { id: 'ardy-knight', label: 'Ardy Knights', category: 'Thieving' },
            { id: 'vyres', label: 'Vyre Pickpocketing', category: 'Thieving' },
            { id: 'master-farmer', label: 'Master Farmer', category: 'Thieving' },
          ].map((tab) => {
            const isActive = activeCalc === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCalc(tab.id as CalculatorId)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-stone-800 text-stone-500 font-normal">
                  {tab.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
