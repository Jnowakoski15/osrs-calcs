import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PlayerProfile, SkillName } from '../types/osrs';

interface PlayerContextType {
  profile: PlayerProfile | null;
  isLoading: boolean;
  error: string | null;
  combatLevel: number;
  totalLevel: number;
  recentRsns: string[];
  fetchProfile: (rsn: string) => Promise<boolean>;
  clearProfile: () => void;
  getSkillLevel: (skill: SkillName, fallback?: number) => number;
  getSkillXp: (skill: SkillName, fallback?: number) => number;
}

const STORAGE_KEY_PROFILE = 'osrs_portal_profile';
const STORAGE_KEY_RECENTS = 'osrs_portal_recent_rsns';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function calculateCombatLevel(skills: Record<string, { level: number }>): number {
  const def = skills.defence?.level || 1;
  const hp = skills.hitpoints?.level || 10;
  const pray = skills.prayer?.level || 1;
  const att = skills.attack?.level || 1;
  const str = skills.strength?.level || 1;
  const range = skills.ranged?.level || 1;
  const mage = skills.magic?.level || 1;

  const base = 0.25 * (def + hp + Math.floor(pray / 2));
  const melee = 0.325 * (att + str);
  const ranged = 0.325 * Math.floor((3 * range) / 2);
  const magic = 0.325 * Math.floor((3 * mage) / 2);

  return Math.floor(base + Math.max(melee, ranged, magic));
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [recentRsns, setRecentRsns] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      } catch {
        // ignore storage quota issues
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_PROFILE);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENTS, JSON.stringify(recentRsns));
    } catch {
      // ignore
    }
  }, [recentRsns]);

  const fetchProfile = useCallback(async (rsn: string): Promise<boolean> => {
    const clean = rsn.trim();
    if (!clean) return false;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/hiscores?player=${encodeURIComponent(clean)}`);
      const data = (await res.json()) as any;

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch player stats');
      }

      setProfile(data);
      setRecentRsns((prev) => {
        const filtered = prev.filter((name) => name.toLowerCase() !== clean.toLowerCase());
        return [clean, ...filtered].slice(0, 5);
      });
      return true;
    } catch (err: any) {
      setError(err?.message || 'Error loading hiscores');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  const getSkillLevel = useCallback(
    (skill: SkillName, fallback: number = 1): number => {
      if (!profile || !profile.skills || !profile.skills[skill]) {
        return fallback;
      }
      return profile.skills[skill].level || fallback;
    },
    [profile]
  );

  const getSkillXp = useCallback(
    (skill: SkillName, fallback: number = 0): number => {
      if (!profile || !profile.skills || !profile.skills[skill]) {
        return fallback;
      }
      return profile.skills[skill].xp || fallback;
    },
    [profile]
  );

  const combatLevel = profile?.skills ? calculateCombatLevel(profile.skills) : 3;
  const totalLevel = profile?.skills?.overall?.level || 32;

  return (
    <PlayerContext.Provider
      value={{
        profile,
        isLoading,
        error,
        combatLevel,
        totalLevel,
        recentRsns,
        fetchProfile,
        clearProfile,
        getSkillLevel,
        getSkillXp,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
