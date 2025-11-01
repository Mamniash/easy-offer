'use client';

import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';

import { generateSyntheticBundle } from '@/lib/dataGenerator';
import type { DataBundle, QuestionRecord, RoleDefinition } from '@/types';

interface DataContextValue {
  bundle: DataBundle;
  isCustom: boolean;
  lastUpdated: Date;
  replaceWithSynthetic: () => void;
  importQuestions: (questions: QuestionRecord[], companies?: string[]) => void;
}

const STORAGE_KEY = 'easy-offer-data';

const DataContext = createContext<DataContextValue | undefined>(undefined);

const computeRoles = (questions: QuestionRecord[]): RoleDefinition[] => {
  const rolesMap = new Map<string, RoleDefinition>();
  questions.forEach((question) => {
    if (!rolesMap.has(question.roleSlug)) {
      rolesMap.set(question.roleSlug, {
        slug: question.roleSlug,
        name: question.roleName,
        category: question.category,
      });
    }
  });
  return Array.from(rolesMap.values());
};

const normalizeBundle = (
  questions: QuestionRecord[],
  companies?: string[],
): DataBundle => {
  const sanitizedQuestions = questions.map((q) => ({
    ...q,
    tags: q.tags ?? [],
    pitfalls: q.pitfalls ?? [],
    followUps: q.followUps ?? [],
    companies: q.companies ?? [],
    weeklyMentions: q.weeklyMentions ?? [],
  }));
  const normalizedCompanies = companies && companies.length > 0 ? companies : Array.from(
    new Set(sanitizedQuestions.flatMap((q) => q.companies)),
  );
  return {
    roles: computeRoles(sanitizedQuestions),
    questions: sanitizedQuestions,
    companies: normalizedCompanies,
  };
};

const readInitialState = () => {
  const fallback = generateSyntheticBundle();
  if (typeof window === 'undefined') {
    return { bundle: fallback, isCustom: false, lastUpdated: new Date() };
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { bundle: DataBundle; timestamp: string };
      if (parsed?.bundle?.questions?.length) {
        return {
          bundle: parsed.bundle,
          isCustom: true,
          lastUpdated: parsed.timestamp ? new Date(parsed.timestamp) : new Date(),
        };
      }
    }
  } catch (error) {
    console.warn('Не удалось прочитать сохранённые данные', error);
  }
  return { bundle: fallback, isCustom: false, lastUpdated: new Date() };
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const initial = readInitialState();
  const [state, setState] = useState(initial);

  const persist = useCallback((nextBundle: DataBundle, custom: boolean) => {
    const now = new Date();
    setState({ bundle: nextBundle, isCustom: custom, lastUpdated: now });
    try {
      if (custom) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ bundle: nextBundle, timestamp: now.toISOString() }),
        );
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Не удалось сохранить данные', error);
    }
  }, []);

  const replaceWithSynthetic = useCallback(() => {
    const synthetic = generateSyntheticBundle();
    persist(synthetic, false);
  }, [persist]);

  const importQuestions = useCallback(
    (questions: QuestionRecord[], companies?: string[]) => {
      const normalized = normalizeBundle(questions, companies);
      persist(normalized, true);
    },
    [persist],
  );

  const value = useMemo(
    () => ({ bundle: state.bundle, isCustom: state.isCustom, lastUpdated: state.lastUpdated, replaceWithSynthetic, importQuestions }),
    [state.bundle, state.isCustom, state.lastUpdated, replaceWithSynthetic, importQuestions],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useDataContext должен использоваться внутри DataProvider');
  }
  return ctx;
};
