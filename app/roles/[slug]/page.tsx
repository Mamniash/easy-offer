'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';

import { useDataContext } from '@/providers/DataProvider';
import { useFreeAccess } from '@/providers/FreeAccessProvider';
import type { QuestionRecord } from '@/types';

const LEVEL_LABELS: Record<string, string> = {
  all: 'All',
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

const TYPE_LABELS: Record<string, string> = {
  all: 'Все типы',
  theory: 'Теория',
  coding: 'Coding',
  behavioral: 'Behavioral',
  system_design: 'System design',
};

const STAGE_LABELS: Record<string, string> = {
  all: 'Все этапы',
  screening: 'Screening',
  technical: 'Technical',
  on_site: 'On-site',
  take_home: 'Take-home',
};

const ITEMS_PER_PAGE = 50;

const formatPercent = (value: number) => `${Math.round(value)}%`;

const buildCsv = (items: QuestionRecord[]) => {
  const headers = [
    'id',
    'roleSlug',
    'roleName',
    'category',
    'title',
    'level',
    'type',
    'interviewStage',
    'tags',
    'sampleAnswer',
    'why',
    'pitfalls',
    'followUps',
    'frequencyScore',
    'chance',
    'companies',
    'weeklyMentions',
  ];
  const rows = items.map((item) =>
    headers
      .map((header) => {
        const value = (item as Record<string, unknown>)[header];
        if (Array.isArray(value)) {
          return `"${value.join('|').replace(/"/g, '""')}"`;
        }
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      })
      .join(','),
  );
  return `${headers.join(',')}\n${rows.join('\n')}`;
};

const downloadCsv = (items: QuestionRecord[], filename: string) => {
  const csv = buildCsv(items);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function RolePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [level, setLevel] = useState<'all' | 'junior' | 'middle' | 'senior'>('all');
  const [type, setType] = useState<'all' | QuestionRecord['type']>('all');
  const [stage, setStage] = useState<'all' | QuestionRecord['interviewStage']>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [lockMessage, setLockMessage] = useState<string | null>(null);

  const { bundle } = useDataContext();
  const { remaining, limit } = useFreeAccess();

  const role = useMemo(() => bundle.roles.find((item) => item.slug === params.slug), [bundle.roles, params.slug]);
  const questions = useMemo(
    () => bundle.questions.filter((question) => question.roleSlug === params.slug),
    [bundle.questions, params.slug],
  );

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === '/' && document.activeElement !== searchRef.current) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!role) {
    notFound();
  }

  const filtered = useMemo(() => {
    return questions
      .filter((question) => (level === 'all' ? true : question.level === level))
      .filter((question) => (type === 'all' ? true : question.type === type))
      .filter((question) => (stage === 'all' ? true : question.interviewStage === stage))
      .filter((question) =>
        query
          ? question.title.toLowerCase().includes(query.toLowerCase()) ||
            question.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
          : true,
      )
      .sort((a, b) => b.frequencyScore - a.frequencyScore);
  }, [questions, level, type, stage, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const popularCompanies = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach((question) => {
      const total = question.weeklyMentions.reduce((acc, value) => acc + value, 0);
      question.companies.forEach((company) => {
        map.set(company, (map.get(company) ?? 0) + total);
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [questions]);

  const navSections = [
    { label: 'Вопросы', href: '#', active: true },
    { label: 'Задачи', href: '#', active: false },
    { label: 'Требования', href: '#', active: false },
  ];

  const handleQuestionClick = (question: QuestionRecord) => {
    if (remaining <= 0) {
      setLockMessage('Лимит 20 раскрытий в сутки исчерпан. Оформите Pro, чтобы смотреть больше вопросов.');
      return;
    }
    router.push(`/questions/${encodeURIComponent(question.id)}`);
  };

  const handleCompanyClick = () => {
    setLockMessage('Фильтр по компаниям доступен в Pro-версии.');
  };

  const handleExport = () => {
    downloadCsv(visible, `${role.slug}-questions-page-${currentPage}.csv`);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          Профессии
        </Link>
        <span>→</span>
        <span className="text-slate-700">{role.name}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-slate-900">Вопросы на собеседовании на {role.name}</h1>
        <p className="text-sm text-slate-500">
          Free-лимит: {limit - remaining}/{limit} использовано · Осталось {remaining}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {navSections.map((section) => (
            <button
              key={section.label}
              type="button"
              disabled={!section.active}
              className={`rounded-full px-4 py-2 text-left text-sm font-medium transition ${
                section.active
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-400 opacity-70'
              }`}
            >
              {section.label}
            </button>
          ))}
          <div className="mt-6 text-xs text-slate-400">
            Остальные разделы появятся в Pro-версии.
          </div>
        </aside>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setLevel(value as typeof level);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    level === value
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex flex-col text-sm text-slate-600">
                Тип собеседования
                <select
                  value={stage}
                  onChange={(event) => {
                    setStage(event.target.value as typeof stage);
                    setPage(1);
                  }}
                  className="mt-1 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                >
                  {Object.entries(STAGE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm text-slate-600">
                Тип вопроса
                <select
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value as typeof type);
                    setPage(1);
                  }}
                  className="mt-1 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                >
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex-1" />
              <div className="flex flex-col gap-2 text-sm text-slate-600">
                <label className="flex flex-col">
                  Поиск
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder="/ — перейти к поиску"
                    className="mt-1 w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Найдено {filtered.length} вопросов</p>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
              >
                Экспорт видимого списка в CSV
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-[120px_140px_1fr] items-center gap-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                <span title="Прогноз шанса услышать вопрос в ближайшее время">Шанс</span>
                <span title="Частота в процентах по собеседованиям">Частота</span>
                <span>Вопрос</span>
              </div>
              <div className="h-px bg-slate-200" />
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse rounded-2xl bg-slate-100 p-4" />
                  ))}
                </div>
              ) : visible.length === 0 ? (
                <div className="flex flex-col items-start gap-3 rounded-2xl bg-slate-50 p-6">
                  <p className="text-sm font-medium text-slate-700">По таким фильтрам ничего не нашли.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLevel('all');
                      setType('all');
                      setStage('all');
                      setQuery('');
                    }}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-400"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {visible.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => handleQuestionClick(question)}
                      className="group grid grid-cols-[120px_140px_1fr] items-center gap-4 rounded-2xl border border-transparent p-4 text-left transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2" title="Прогноз шанса получить вопрос на интервью">
                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-600">
                          {formatPercent(question.chance)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2" title="Частота вопроса в потоке собеседований">
                        <div className="h-2 flex-1 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-slate-500"
                            style={{ width: `${Math.min(question.frequencyScore, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600">{formatPercent(question.frequencyScore)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                          {question.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          {LEVEL_LABELS[question.level]} · {TYPE_LABELS[question.type]} · {STAGE_LABELS[question.interviewStage]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <div>
                  Страница {currentPage} из {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-full border border-slate-300 px-3 py-1 disabled:opacity-40"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-full border border-slate-300 px-3 py-1 disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-2 self-end rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:border-slate-400"
              >
                Наверх
              </button>
            </div>

            <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Популярные компании</h2>
                <span className="text-xs text-slate-400">Pro</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularCompanies.map(([company]) => (
                  <button
                    key={company}
                    type="button"
                    onClick={() => handleCompanyClick()}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
                  >
                    {company}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
                Демо-режим: фильтрация по компаниям будет доступна в Pro. Пока показываем топ-бренды в открытом списке.
              </div>
            </aside>
          </div>

          {lockMessage && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
              <div className="flex flex-col gap-2">
                <strong className="text-base text-slate-900">Доступно в Pro</strong>
                <p>{lockMessage}</p>
                <div className="flex gap-3">
                  <Link
                    href="/pro"
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Посмотреть тариф
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLockMessage(null)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-400"
                  >
                    Понятно
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Горячая клавиша «/» мгновенно фокусирует поиск по вопросам.
      </div>
    </div>
  );
}
