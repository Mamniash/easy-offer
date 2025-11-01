'use client';

import { LockFilled, PlayCircleFilled, StarFilled } from '@ant-design/icons';
import { Avatar, Button, Modal, Progress, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
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

const MAX_VISIBLE = 50;

const companyPalette = [
  ['#4338CA', '#7C3AED'],
  ['#0EA5E9', '#2563EB'],
  ['#14B8A6', '#0D9488'],
  ['#F97316', '#DB2777'],
  ['#8B5CF6', '#6366F1'],
  ['#F59E0B', '#F97316'],
];

const formatPercent = (value: number) => `${Math.round(value)}%`;

const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(Math.round(value));

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
  const [isLoading, setIsLoading] = useState(true);
  const [proPrompt, setProPrompt] = useState<{ title: string; description: string } | null>(null);

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

  const visible = filtered.slice(0, MAX_VISIBLE);
  const hasMore = filtered.length > MAX_VISIBLE;

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
      setProPrompt({
        title: 'Доступно в Pro',
        description: 'Лимит 20 раскрытий в сутки исчерпан. Оформите Pro, чтобы открывать неограниченно и сохранять ответы.',
      });
      return;
    }
    router.push(`/questions/${encodeURIComponent(question.id)}`);
  };

  const handleCompanyClick = () => {
    setProPrompt({
      title: 'Фильтры по компаниям — в Pro',
      description: 'В подписке появятся детальные фильтры по брендам, тренды вопросов и сравнение форматов интервью.',
    });
  };

  const handleExport = () => {
    downloadCsv(visible, `${role.slug}-questions-top-${visible.length}.csv`);
  };

  const handleShowMore = () => {
    setProPrompt({
      title: 'Весь каталог в Pro',
      description: 'Мы показываем первые 50 вопросов, чтобы ты понял структуру. Подпишись на Pro, чтобы открыть полный список и доступ к задачам.',
    });
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
                    }}
                    placeholder="/ — перейти к поиску"
                    className="mt-1 w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Tag color="geekblue">Найдено {filtered.length}</Tag>
                <Tag color="purple">Показываем {visible.length} из {filtered.length}</Tag>
              </div>
              <Button onClick={handleExport} className="rounded-full border-slate-300">
                Экспорт 50 вопросов
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Топ вопросов по роли</h2>
                <p className="text-sm text-slate-500">Открываем первые 50 карточек, чтобы ты увидел структуру и формат ответов.</p>
              </div>
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-100" />
                  ))}
                </div>
              ) : visible.length === 0 ? (
                <div className="flex flex-col items-start gap-3 rounded-3xl bg-slate-50 p-6">
                  <p className="text-sm font-medium text-slate-700">По таким фильтрам ничего не нашли.</p>
                  <Button
                    onClick={() => {
                      setLevel('all');
                      setType('all');
                      setStage('all');
                      setQuery('');
                    }}
                    className="rounded-full border-slate-300"
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {visible.map((question, index) => {
                    const palette = companyPalette[index % companyPalette.length];
                    const videoCount = question.answerVariants.filter((variant) => variant.source === 'youtube').length;
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => handleQuestionClick(question)}
                        className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 text-left transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50/60 hover:shadow-lg"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={48}
                              style={{
                                background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              icon={<StarFilled />}
                            />
                            <div className="flex flex-col">
                              <span className="text-xs uppercase tracking-wide text-slate-400">Шанс услышать вопрос</span>
                              <span className="text-lg font-semibold text-slate-900">{formatPercent(question.chance)}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Tag color="geekblue">{LEVEL_LABELS[question.level]}</Tag>
                            <Tag color="purple">{TYPE_LABELS[question.type]}</Tag>
                            <Tag color="cyan">{STAGE_LABELS[question.interviewStage]}</Tag>
                          </div>
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 transition group-hover:text-indigo-600">{question.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <div className="flex w-full items-center gap-3 sm:w-1/2">
                            <Tooltip title="Частота вопроса в потоке собеседований">
                              <Progress
                                percent={Math.min(question.frequencyScore, 100)}
                                showInfo={false}
                                strokeColor="#6366F1"
                                className="flex-1"
                              />
                            </Tooltip>
                            <span className="min-w-max text-sm font-medium text-slate-600">
                              Частота {formatPercent(question.frequencyScore)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-indigo-500">
                            <PlayCircleFilled /> {videoCount} видео · {question.answerVariants.length} материалов
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {hasMore && (
                <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/70 p-6 text-sm text-indigo-700">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-indigo-600">Ещё {filtered.length - visible.length} вопросов ждут в Pro</p>
                      <p>Полный каталог, фильтры по компаниям и подборки задач станут доступны сразу после оформления.</p>
                    </div>
                    <Button type="primary" className="rounded-full bg-indigo-500 !px-6" onClick={handleShowMore}>
                      Оформить Pro
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="self-end rounded-full border-slate-300"
              >
                Наверх
              </Button>
            </div>

            <aside className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Популярные компании</h2>
                <Tag icon={<LockFilled />} color="purple" className="px-2 py-1 text-xs">
                  Pro
                </Tag>
              </div>
              <p className="text-sm text-slate-500">Смотрим, какие бренды чаще упоминают такие вопросы на интервью.</p>
              <div className="flex flex-col gap-3">
                {popularCompanies.map(([company, mentions], index) => {
                  const palette = companyPalette[index % companyPalette.length];
                  return (
                    <button
                      key={company}
                      type="button"
                      onClick={handleCompanyClick}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          size={48}
                          style={{
                            background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {company
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900 transition group-hover:text-indigo-600">{company}</span>
                          <span className="text-xs text-slate-400">≈ {formatNumber(mentions)} упоминаний за 4 недели</span>
                        </div>
                      </div>
                      <Tag icon={<LockFilled />} color="purple">
                        Pro
                      </Tag>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
                В подписке появятся фильтры по брендам, графики трендов и подборки вопросов по каждому работодателю.
              </div>
            </aside>
          </div>
        </section>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Горячая клавиша «/» мгновенно фокусирует поиск по вопросам.
      </div>

      <Modal
        open={!!proPrompt}
        title={proPrompt?.title}
        onCancel={() => setProPrompt(null)}
        footer={[
          <Button key="pro" type="primary" className="rounded-full bg-indigo-500" href="/pro">
            Оформить Pro
          </Button>,
          <Button key="close" onClick={() => setProPrompt(null)} className="rounded-full border-slate-300">
            Понятно
          </Button>,
        ]}
      >
        <p className="text-sm text-slate-600">{proPrompt?.description}</p>
      </Modal>
    </div>
  );
}
