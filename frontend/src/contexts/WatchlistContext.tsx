'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MovieTvShow } from '@/types/data/movieTvShowData';

interface WatchlistContextType {
  watchlist: MovieTvShow[];
  addToWatchlist: (item: MovieTvShow) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const WATCHLIST_STORAGE_KEY = 'movieapp_watchlist';

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<MovieTvShow[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWatchlist(parsed);
      }
    } catch (error) {
      console.error('Failed to load watchlist from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error('Failed to save watchlist to localStorage:', error);
      }
    }
  }, [watchlist, isInitialized]);

  const addToWatchlist = (item: MovieTvShow) => {
    setWatchlist((prev) => {
      // Prevent duplicates
      if (prev.some((i) => i.id === item.id && i.type === item.type)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWatchlist = (id: string): boolean => {
    return watchlist.some((item) => item.id === id);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}

