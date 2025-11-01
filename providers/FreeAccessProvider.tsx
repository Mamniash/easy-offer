'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';

const LIMIT = 20;
const STORAGE_KEY = 'easy-offer-free-usage';

interface UsageState {
  date: string;
  count: number;
}

interface FreeAccessContextValue {
  limit: number;
  remaining: number;
  totalUsed: number;
  attemptConsume: () => boolean;
  reset: () => void;
}

const FreeAccessContext = createContext<FreeAccessContextValue | undefined>(undefined);

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const parseStored = (raw: string | null): UsageState => {
  if (!raw) {
    return { date: getTodayKey(), count: 0 };
  }
  try {
    const parsed = JSON.parse(raw) as UsageState;
    if (!parsed?.date || typeof parsed.count !== 'number') {
      return { date: getTodayKey(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
};

export const FreeAccessProvider = ({ children }: { children: React.ReactNode }) => {
  const initial = parseStored(typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null);
  const [usage, setUsage] = useState<UsageState>(initial);

  const persist = useCallback((next: UsageState) => {
    setUsage(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Не удалось сохранить лимит', err);
    }
  }, []);

  const today = getTodayKey();
  const normalized = usage.date === today ? usage : { date: today, count: 0 };

  const attemptConsume = useCallback(() => {
    const current = usage.date === today ? usage : { date: today, count: 0 };
    if (current.count >= LIMIT) {
      return false;
    }
    const next = { date: today, count: current.count + 1 };
    persist(next);
    return true;
  }, [persist, today, usage]);

  const reset = useCallback(() => {
    const base = { date: today, count: 0 };
    persist(base);
  }, [persist, today]);

  const remaining = Math.max(LIMIT - normalized.count, 0);
  const totalUsed = normalized.count;

  return (
    <FreeAccessContext.Provider value={{ limit: LIMIT, remaining, totalUsed, attemptConsume, reset }}>
      {children}
    </FreeAccessContext.Provider>
  );
};

export const useFreeAccess = () => {
  const ctx = useContext(FreeAccessContext);
  if (!ctx) {
    throw new Error('useFreeAccess нужно использовать внутри FreeAccessProvider');
  }
  return ctx;
};
