'use client';

import Link from 'next/link';

const steps = [
  {
    title: 'Выбери профессию',
    description: 'Собрали ключевые IT-роли в аккуратную сетку. Нужный профиль — в один клик.',
  },
  {
    title: 'Посмотри частые вопросы',
    description: 'Мы ранжируем вопросы по фактической частоте. Вверху — то, что звучит чаще всего.',
  },
  {
    title: 'Открой краткие ответы',
    description: 'Каждый вопрос сопровождаем кратким планом ответа, мотивацией и ловушками.',
  },
  {
    title: 'Подготовься точечно',
    description: 'Фильтры по уровню, типу и поиск по тегам экономят часы подготовки.',
  },
];

const freePerks = [
  'Сетка профессий и быстрый переход к вопросам',
  '20 раскрытий вопросов в сутки',
  'Обзор частот и трендов без разблокировки компаний',
];

const proPerks = [
  'Безлимитные раскрытия и быстрый просмотр ответов',
  'Фильтры по компаниям и их трендам',
  'Расширенный блок похожих вопросов и подборки',
];

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-widest text-slate-500">easyOffer demo</p>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
          Получить оффер быстрее: актуальные вопросы собеседований по твоей специальности
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-600">
          Мы собрали десятки IT-ролей, частотность вопросов и краткие ответы, чтобы подготовка стала
          точечной. Демо ограничено, но уже помогает сфокусироваться на том, что действительно спрашивают.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Перейти к профессиям
          </Link>
          <Link href="/pro" className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 hover:border-slate-400">
            Стать Pro
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:grid-cols-2">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col gap-2 text-left">
              <h3 className="text-lg font-semibold text-slate-800">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex flex-col gap-4 p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Free</p>
              <h3 className="text-2xl font-semibold text-slate-900">Для быстрого старта</h3>
              <ul className="flex flex-col gap-2 text-slate-600">
                {freePerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500">Никаких карт, просто попробуй демо.</p>
            </div>
            <div className="flex flex-col gap-4 p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Pro (скоро)</p>
              <h3 className="text-2xl font-semibold text-slate-900">Когда готов расшириться</h3>
              <ul className="flex flex-col gap-2 text-slate-600">
                {proPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500">Мы предупредим, как только полнофункциональный Pro станет доступен.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
