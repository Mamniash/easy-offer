'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { roleGroups } from '@/lib/roles';
import { useDataContext } from '@/providers/DataProvider';

const RolePill = ({ slug, name }: { slug: string; name: string }) => (
  <Link
    href={`/roles/${slug}`}
    className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
  >
    {name}
  </Link>
);

export default function HomePage() {
  const { bundle, isCustom, lastUpdated } = useDataContext();

  const grouped = useMemo(() => {
    const roles = new Map(bundle.roles.map((role) => [role.slug, role]));
    const used = new Set<string>();
    const mapped = roleGroups.map((group) => ({
      category: group.category,
      roles: group.roles.filter((role) => {
        const present = roles.has(role.slug);
        if (present) {
          used.add(role.slug);
        }
        return present;
      }),
    }));
    const extras = bundle.roles.filter((role) => !used.has(role.slug));
    if (extras.length) {
      mapped.push({
        category: 'Другие роли (импорт)',
        roles: extras,
      });
    }
    return mapped;
  }, [bundle.roles]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
      <section className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-wide text-slate-500">Каталог профессий</p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Получить оффер в IT легко
        </h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Выбери свою роль и смотри, какие вопросы звучат на собеседованиях прямо сейчас. Частоты,
          подсказки и похожие кейсы помогут подготовиться точечно.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">Free: доступно {bundle.questions.length} вопросов</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Данные: {isCustom ? 'импортированы' : 'синтетика по умолчанию'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            Обновлено: {lastUpdated.toLocaleDateString('ru-RU')}
          </span>
        </div>
      </section>

      {grouped.map((group) => (
        <section key={group.category} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">{group.category}</h2>
            <div className="h-px flex-1 rounded bg-slate-200" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {group.roles.map((role) => (
              <RolePill key={role.slug} slug={role.slug} name={role.name} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
