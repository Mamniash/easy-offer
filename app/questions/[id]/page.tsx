'use client';

import { LinkOutlined, PlayCircleFilled } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useDataContext } from '@/providers/DataProvider';
import { useFreeAccess } from '@/providers/FreeAccessProvider';
import type { AnswerVariant } from '@/types';

const levelLabel: Record<string, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

const stageLabel: Record<string, string> = {
  screening: 'Screening',
  technical: 'Technical',
  on_site: 'On-site',
  take_home: 'Take-home',
};

const typeLabel: Record<string, string> = {
  theory: 'Теория',
  coding: 'Coding',
  behavioral: 'Behavioral',
  system_design: 'System design',
};

const sourceMeta: Record<AnswerVariant['source'], { label: string; color: string }> = {
  youtube: { label: 'YouTube', color: 'red' },
  article: { label: 'Статья', color: 'blue' },
  podcast: { label: 'Подкаст', color: 'purple' },
  blog: { label: 'Блог', color: 'green' },
};

export default function QuestionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { bundle } = useDataContext();
  const { attemptConsume, remaining } = useFreeAccess();

  const question = useMemo(() => bundle.questions.find((item) => item.id === params.id), [bundle.questions, params.id]);

  const [isLoading, setIsLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [hasConsumed, setHasConsumed] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasRevealedAnswer, setHasRevealedAnswer] = useState(false);
  const [lockMessage, setLockMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [params.id]);

  useEffect(() => {
    setShowAnswer(false);
    setHasRevealedAnswer(false);
    setHasConsumed(false);
    setLocked(false);
  }, [params.id]);

  useEffect(() => {
    if (!question) return;
    if (hasConsumed || locked) return;
    const allowed = attemptConsume();
    if (!allowed) {
      setLocked(true);
    } else {
      setHasConsumed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  if (!question) {
    notFound();
  }

  const role = bundle.roles.find((item) => item.slug === question.roleSlug);

  const related = useMemo(() => {
    return bundle.questions
      .filter((item) => item.roleSlug === question.roleSlug && item.id !== question.id)
      .filter((item) => item.type === question.type || item.tags.some((tag) => question.tags.includes(tag)))
      .sort((a, b) => b.frequencyScore - a.frequencyScore)
      .slice(0, 8);
  }, [bundle.questions, question]);

  const handleToggleAnswer = () => {
    if (!showAnswer && !hasRevealedAnswer) {
      const allowed = attemptConsume();
      if (!allowed) {
        setLockMessage('Лимит исчерпан. Краткие ответы доступны в Pro.');
        return;
      }
      setHasRevealedAnswer(true);
    }
    setShowAnswer((prev) => !prev);
  };

  const handleRelatedClick = (id: string) => {
    if (remaining <= 0) {
      setLockMessage('Лимит исчерпан. Похожие вопросы доступны в Pro.');
      return;
    }
    router.push(`/questions/${encodeURIComponent(id)}`);
  };

  if (locked) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-800">
            Профессии
          </Link>
          <span>→</span>
          <span className="text-slate-700">{role?.name ?? 'Вопрос'}</span>
        </nav>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Демо-лимит исчерпан</h1>
          <p className="mt-3 text-slate-600">
            В бесплатной версии можно раскрыть до 20 карточек вопросов в сутки. Чтобы продолжить, оформите Pro или
            вернитесь завтра.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/pro" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Посмотреть тариф
            </Link>
            <Link href="/" className="rounded-full border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:border-slate-400">
              Вернуться к профессиям
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          Профессии
        </Link>
        <span>→</span>
        {role ? (
          <Link href={`/roles/${role.slug}`} className="hover:text-slate-800">
            {role.name}
          </Link>
        ) : (
          <span className="text-slate-700">Неизвестная роль</span>
        )}
        <span>→</span>
        <span className="text-slate-700">Вопрос</span>
      </nav>

      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-wide text-slate-500">Карточка вопроса</p>
        <h1 className="text-3xl font-semibold text-slate-900">{question.title}</h1>
        <p className="text-sm text-slate-500">
          {levelLabel[question.level]} · {typeLabel[question.type]} · {stageLabel[question.interviewStage]}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Формулировка</h2>
                <p className="text-base text-slate-700">{question.title}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Краткий ответ</h2>
                <button
                  type="button"
                  onClick={handleToggleAnswer}
                  className="w-fit rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
                >
                  {showAnswer ? 'Скрыть краткий ответ' : 'Показать краткий ответ'}
                </button>
                {showAnswer && (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{question.sampleAnswer}</div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Почему спрашивают</h2>
                <p className="text-sm text-slate-700">{question.why}</p>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Частые ловушки</h2>
                <ul className="list-disc pl-5 text-sm text-slate-700">
                  {question.pitfalls.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {question.answerVariants.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Как отвечают другие</h2>
                  <p className="text-sm text-slate-500">
                    Собрали открытые интервью и материалы, где кандидаты разбирают именно этот вопрос. Таймкоды ведут к ключевым моментам.
                  </p>
                  <div className="flex flex-col gap-3">
                    {question.answerVariants.map((variant) => {
                      const meta = sourceMeta[variant.source];
                      const icon = variant.source === 'youtube' ? (
                        <PlayCircleFilled className="text-lg" />
                      ) : (
                        <LinkOutlined className="text-lg" />
                      );
                      return (
                        <a
                          key={variant.id}
                          href={variant.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex flex-col gap-2 rounded-2xl border border-slate-200 px-4 py-3 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                {icon}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">{variant.title}</span>
                                <span className="text-xs text-slate-500">{variant.contributor} · {variant.publishedAt}</span>
                              </div>
                            </div>
                            <Tag color={meta.color}>{meta.label}</Tag>
                          </div>
                          <p className="text-sm text-slate-600">{variant.summary}</p>
                          {variant.timecode && (
                            <Tooltip title="Перейти к таймкоду">
                              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600">
                                <PlayCircleFilled /> Таймкод {variant.timecode}
                              </span>
                            </Tooltip>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Follow-up</h2>
                <ul className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  {question.followUps.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Link
            href={role ? `/roles/${role.slug}` : '/'}
            className="rounded-full border border-slate-300 px-5 py-2 text-center text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            Назад к списку
          </Link>
        </section>

        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Где встречается чаще</h2>
            <div className="flex flex-wrap gap-2">
              {question.companies.map((company) => (
                <span key={company} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {company}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {question.weeklyMentions.map((value, index) => (
                <div key={index} className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="w-12 text-right">W{index + 1}</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-indigo-400" style={{ width: `${Math.min(value * 2, 100)}%` }} />
                  </div>
                  <span className="w-6 text-right text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Похожие вопросы</h2>
            <div className="flex flex-col gap-2">
              {related.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRelatedClick(item.id)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-700 hover:border-slate-300"
                >
                  {item.title}
                </button>
              ))}
            </div>
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
    </div>
  );
}
