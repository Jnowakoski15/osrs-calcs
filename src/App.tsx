import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PlayerProfileBar } from './components/PlayerProfileBar';
import { BirdhouseCalculator } from './calculators/BirdhouseCalculator';
import { CalculatorId } from './types/osrs';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<CalculatorId>('birdhouse');

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 selection:bg-amber-500/30">
      <Header
        activeCalc={activeCalc}
        onSelectCalc={setActiveCalc}
        onOpenCommandPalette={() => {}}
        rsnSlot={<PlayerProfileBar />}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero banner highlighting zero-click efficiency */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Click Reactive Calculators</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white osrs-heading">
              Old School RuneScape Calculators, Reimagined.
            </h1>
            <p className="text-sm text-stone-400">
              Instant outputs as you type or adjust sliders. Zero submit button clicks. 1-click Hiscores level syncing and live Grand Exchange prices.
            </p>
          </div>
        </div>

        {/* Calculator Mounting Area */}
        <div className="osrs-box p-6 border border-stone-800 rounded-xl bg-stone-900/60 shadow-xl">
          {activeCalc === 'birdhouse' && <BirdhouseCalculator />}
          {activeCalc !== 'birdhouse' && (
            <div className="text-sm text-stone-400 py-8 text-center">
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
