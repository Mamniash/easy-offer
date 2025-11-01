'use client';

import Link from 'next/link';

export default function ProPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-wide text-indigo-500">Pro-заглушка</p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Pro-доступ скоро появится</h1>
        <p className="text-lg text-slate-600">
          Мы собираем обратную связь, чтобы расширенный тариф решал реальные задачи: фильтрация по
          компаниям, безлимитное открытие ответов и подборки похожих вопросов.
        </p>
      </div>
      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Что будет в Pro</h2>
          <ul className="flex flex-col gap-2 text-slate-600">
            <li>— Безлимитные раскрытия вопросов и быстрый просмотр кратких ответов</li>
            <li>— Фильтры по компаниям и динамика спроса по ним</li>
            <li>— Расширенный блок «смотреть похожие вопросы»</li>
            <li>— Экспорт расширенных отчётов и заметок</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Что уже можно делать</h2>
          <ul className="flex flex-col gap-2 text-slate-600">
            <li>— Изучить сетку ролей и список вопросов</li>
            <li>— Посмотреть частоту и тренды по неделям</li>
            <li>— Импортировать собственную базу вопросов</li>
            <li>— Экспортировать текущий список в CSV</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/" className="rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white hover:bg-slate-800">
          Вернуться к профессиям
        </Link>
        <span className="text-sm text-slate-500">Оставьте почту в футере, чтобы узнать о запуске (скоро).</span>
      </div>
    </div>
  );
}
