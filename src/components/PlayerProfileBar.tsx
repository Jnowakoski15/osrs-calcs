import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Swords, Loader2, X, ChevronDown, CheckCircle2 } from 'lucide-react';

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
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14100d] border border-[#3d2e1e] text-xs shadow-md">
        <div className="w-5 h-5 rounded bg-amber-950/80 border border-amber-600/40 text-amber-400 flex items-center justify-center font-bold">
          <Swords className="w-3 h-3 text-amber-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-300 tracking-wide">{profile.rsn}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f1914] text-amber-200/90 border border-[#3b2e21] font-mono">
            Cb {combatLevel}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f1914] text-[#cfc2b6] border border-[#3b2e21] font-mono hidden sm:inline">
            Tot {totalLevel.toLocaleString()}
          </span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-0.5" title="All calculator levels auto-synced">
            <CheckCircle2 className="w-3 h-3" />
            <span className="hidden md:inline font-medium">Synced</span>
          </span>
        </div>
        <button
          onClick={clearProfile}
          className="ml-1 text-[#8c7e73] hover:text-rose-400 p-0.5 rounded hover:bg-[#211a14] transition-colors cursor-pointer"
          title="Disconnect character profile"
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
            placeholder="Sync RSN stats..."
            className="w-32 sm:w-40 px-2.5 py-1 text-xs bg-[#0c0a08] border border-[#2b241d] rounded-md text-[#f5f5f4] placeholder-[#6b5f54] focus:outline-none focus:border-amber-600/80 focus:ring-1 focus:ring-amber-500/30"
          />
          {recentRsns.length > 0 && (
            <button
              type="button"
              onClick={() => setShowRecents(!showRecents)}
              className="absolute right-1 text-[#7a6b5e] hover:text-[#e8ded6] p-0.5"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputRsn.trim()}
          className="osrs-btn px-2.5 py-1 text-xs text-amber-300 disabled:opacity-40 flex items-center gap-1"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin text-amber-400" /> : 'Sync'}
        </button>
      </form>

      {/* Recents Dropdown */}
      {showRecents && recentRsns.length > 0 && (
        <div className="absolute right-0 mt-1 w-44 bg-[#14100d] border border-[#3d2e1e] rounded-md shadow-2xl py-1 z-50 text-xs">
          <div className="px-2.5 py-1 text-[10px] text-[#857466] font-semibold border-b border-[#2b2015] uppercase tracking-wider">
            Recent Profiles
          </div>
          {recentRsns.map((r) => (
            <button
              key={r}
              onClick={() => handleSelectRecent(r)}
              className="w-full text-left px-2.5 py-1.5 text-[#e6ded8] hover:bg-[#261d15] hover:text-amber-300 transition-colors"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="absolute left-0 mt-1 whitespace-nowrap text-[10px] text-rose-300 bg-rose-950/90 border border-rose-800/60 px-2 py-0.5 rounded shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};
