import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { User, Loader2, X, ChevronDown, CheckCircle2 } from 'lucide-react';

export const PlayerProfileBar: React.FC = () => {
  const { profile, isLoading, error, combatLevel, totalLevel, recentRsns, fetchProfile, clearProfile } =
    usePlayer();
  const [inputRsn, setInputRsn] = useState('');
  const [showRecents, setShowRecents] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRsn.trim()) return;
    await fetchProfile(inputRsn);
    setShowRecents(false);
  };

  const handleSelectRecent = async (name: string) => {
    setInputRsn(name);
    await fetchProfile(name);
    setShowRecents(false);
  };

  if (profile) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-amber-500/30 text-xs shadow-sm">
        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
          <User className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">{profile.rsn}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
            Cb {combatLevel}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700 hidden sm:inline">
            Total {totalLevel.toLocaleString()}
          </span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-0.5" title="Stats auto-synced across all calculators">
            <CheckCircle2 className="w-3 h-3" />
            <span className="hidden md:inline">Synced</span>
          </span>
        </div>
        <button
          onClick={clearProfile}
          className="ml-1 text-stone-400 hover:text-red-400 p-0.5 rounded hover:bg-stone-800 transition-colors cursor-pointer"
          title="Clear player profile"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputRsn}
            onChange={(e) => setInputRsn(e.target.value)}
            placeholder="Sync RSN..."
            className="w-32 sm:w-40 px-2.5 py-1 text-xs bg-stone-900 border border-stone-800 rounded-md text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40"
          />
          {recentRsns.length > 0 && (
            <button
              type="button"
              onClick={() => setShowRecents(!showRecents)}
              className="absolute right-1 text-stone-500 hover:text-stone-300 p-0.5"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputRsn.trim()}
          className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold transition-all flex items-center gap-1 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Sync'}
        </button>
      </form>

      {/* Recents Dropdown */}
      {showRecents && recentRsns.length > 0 && (
        <div className="absolute right-0 mt-1 w-44 bg-stone-900 border border-stone-800 rounded-md shadow-xl py-1 z-50 text-xs">
          <div className="px-2 py-1 text-[10px] text-stone-400 font-medium border-b border-stone-800">
            Recent Profiles
          </div>
          {recentRsns.map((r) => (
            <button
              key={r}
              onClick={() => handleSelectRecent(r)}
              className="w-full text-left px-2.5 py-1 text-stone-200 hover:bg-stone-800 transition-colors"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="absolute left-0 mt-1 whitespace-nowrap text-[10px] text-rose-400 bg-rose-950/80 border border-rose-800/40 px-2 py-0.5 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};
