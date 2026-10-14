import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PlayerProfileBar } from './components/PlayerProfileBar';
import { BirdhouseCalculator } from './calculators/BirdhouseCalculator';
import { CalculatorId } from './types/osrs';
import { Zap } from 'lucide-react';

export const App: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<CalculatorId>('birdhouse');

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0a09] text-[#f5f5f4] selection:bg-amber-500/30">
      <Header
        activeCalc={activeCalc}
        onSelectCalc={setActiveCalc}
        onOpenCommandPalette={() => {}}
        rsnSlot={<PlayerProfileBar />}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern OSRS Banner */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[#211810] via-[#17130f] to-[#120e0a] border-t border-[#473624] border-b-2 border-[#0d0a08] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/40 text-[11px] font-bold tracking-wider uppercase">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Zero-Click Reactive Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-amber-300 osrs-heading drop-shadow-md">
              Old School RuneScape Calculators
            </h1>
            <p className="text-xs text-[#a39487] leading-relaxed">
              Experience calculators built for speed: 1-click Hiscores level synchronization, live Grand Exchange pricing from the OSRS Wiki, and zero submit button clicks.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center gap-3 text-xs bg-[#0f0d0b]/80 border border-[#2b221a] px-3.5 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="text-[#a39487]">
              <span className="text-stone-300 font-semibold block">Live GE Edge Feed</span>
              <span className="text-[10px] text-[#6d5e53]">Sub-second recalculation</span>
            </div>
          </div>
        </div>

        {/* Calculator Mounting Area */}
        <div className="osrs-stone-card p-6 shadow-2xl">
          {activeCalc === 'birdhouse' && <BirdhouseCalculator />}
          {activeCalc !== 'birdhouse' && (
            <div className="text-sm text-[#8c7e73] py-12 text-center">
              Loading {activeCalc.replace('-', ' ')} calculator...
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
