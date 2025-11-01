'use client';

import { ArrowRightOutlined, LockFilled, PlayCircleFilled } from '@ant-design/icons';
import { Button, Card, Carousel, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { useMemo } from 'react';

import { roleGroups } from '@/lib/roles';
import { useDataContext } from '@/providers/DataProvider';

const gradientBackgrounds = [
  'from-indigo-500/90 via-purple-500/80 to-slate-900/90',
  'from-sky-500/80 via-cyan-500/80 to-blue-600/90',
  'from-emerald-500/80 via-teal-500/80 to-slate-900/90',
];

const previewGradients = [
  'from-indigo-500 to-purple-500',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-500',
];

const statFormatter = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));

const RoleCard = ({
  slug,
  name,
  category,
  index,
}: {
  slug: string;
  name: string;
  category: string;
  index: number;
}) => {
  const accent = gradientBackgrounds[index % gradientBackgrounds.length];
  return (
    <Link href={`/roles/${slug}`} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`} />
      <div className="relative flex h-full flex-col gap-4 p-6">
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">{category}</span>
        <h3 className="text-xl font-semibold text-slate-900 transition group-hover:text-white">{name}</h3>
        <p className="text-sm text-slate-500 transition group-hover:text-indigo-50">
          Популярные вопросы и ответы для интервью на позицию {name}. Частоты, ловушки и видео-разборы.
        </p>
        <span className="mt-auto flex items-center gap-2 text-sm font-medium text-slate-600 transition group-hover:text-indigo-50">
          Перейти к вопросам <ArrowRightOutlined />
        </span>
      </div>
    </Link>
  );
};

const CompaniesPreview = ({ companies }: { companies: string[] }) => {
  const limited = companies.slice(0, 12);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {limited.map((company, index) => (
        <div
          key={company}
          className="group relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${previewGradients[index % previewGradients.length]} text-sm font-semibold text-white`}
          >
            {company
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{company}</span>
          <span className="absolute right-3 top-3 text-xs text-slate-400">
            <LockFilled />
          </span>
        </div>
      ))}
    </div>
  );
};

const QuestionPreview = ({
  questions,
}: {
  questions: {
    id: string;
    title: string;
    frequencyScore: number;
    chance: number;
  }[];
}) => (
  <div className="flex flex-col gap-3">
    {questions.map((question) => (
      <div key={question.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-base font-semibold text-slate-900">{question.title}</h4>
          <div className="flex items-center gap-2">
            <Tooltip title="Вероятность услышать вопрос при ближайшем интервью">
              <Tag color="geekblue" className="px-3 py-1 text-sm">
                Шанс {Math.round(question.chance)}%
              </Tag>
            </Tooltip>
            <Tooltip title="Частота упоминаний в собеседованиях за последние недели">
              <Tag color="cyan" className="px-3 py-1 text-sm">
                Частота {Math.round(question.frequencyScore)}%
              </Tag>
            </Tooltip>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${Math.min(question.frequencyScore, 100)}%` }}
          />
        </div>
      </div>
    ))}
  </div>
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

  const topQuestions = useMemo(
    () =>
      [...bundle.questions]
        .sort((a, b) => b.frequencyScore - a.frequencyScore)
        .slice(0, 6)
        .map((question) => ({
          id: question.id,
          title: question.title,
          frequencyScore: question.frequencyScore,
          chance: question.chance,
        })),
    [bundle.questions],
  );

  const proPerks = [
    'Полные библиотеки вопросов без лимитов',
    'Фильтрация по компаниям и форматам интервью',
    'Видео-ответы и стенограммы от кандидатов уровня Middle/Senior',
    'Пакеты задач и чек-листы подготовки',
  ];

  return (
    <div className="flex flex-col gap-20 bg-gradient-to-b from-slate-100 via-white to-slate-100">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.45),_transparent_60%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-3xl flex-col gap-4">
              <span className="w-fit rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/80">
                easyOffer demo · {isCustom ? 'импортированные данные' : 'синтетический набор'}
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Подготовься к собеседованию так, как будто ты уже внутри команды мечты
              </h1>
              <p className="text-lg text-white/80">
                Десятки ролей, частотные вопросы и реальные ответы кандидатов. Мы подсвечиваем, что спрашивают прямо сейчас, чтобы ты фокусировался на важном.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="primary" size="large" className="rounded-full bg-white !px-6 !text-slate-900 hover:!bg-slate-100" href="/roles/frontend">
                  Начать с Frontend
                </Button>
                <Button size="large" className="rounded-full border-white/40 !bg-transparent !px-6 text-white hover:!border-white hover:!text-white" href="/pro">
                  Узнать про Pro
                </Button>
              </div>
            </div>
            <div className="grid w-full max-w-md grid-cols-2 gap-4 text-left text-white/80">
              <Card bordered={false} className="!bg-white/10 !backdrop-blur">
                <p className="text-sm text-white/60">Вопросов в демо</p>
                <p className="text-3xl font-semibold text-white">{statFormatter(bundle.questions.length)}</p>
              </Card>
              <Card bordered={false} className="!bg-white/10 !backdrop-blur">
                <p className="text-sm text-white/60">Компаний отслеживаем</p>
                <p className="text-3xl font-semibold text-white">{statFormatter(bundle.companies.length)}</p>
              </Card>
              <Card bordered={false} className="!bg-white/10 !backdrop-blur">
                <p className="text-sm text-white/60">Обновлено</p>
                <p className="text-3xl font-semibold text-white">{lastUpdated.toLocaleDateString('ru-RU')}</p>
              </Card>
              <Card bordered={false} className="!bg-white/10 !backdrop-blur">
                <p className="text-sm text-white/60">Средняя вероятность</p>
                <p className="text-3xl font-semibold text-white">
                  {statFormatter(
                    bundle.questions.reduce((acc, item) => acc + item.chance, 0) / Math.max(bundle.questions.length, 1),
                  )}%
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold text-slate-900">Каталог ролей</h2>
            <p className="text-lg text-slate-600">
              Выбери профессию и изучи частотные вопросы. Мы ограничили Free-доступ 50 карточками на роль, но показали структуру и силу Pro-тарифа.
            </p>
          </div>
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Что внутри</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <li>— Частоты вопросов и прогноз шанса</li>
              <li>— Краткие ответы и ловушки</li>
              <li>— Видео- и текстовые ответы кандидатов</li>
              <li>— Популярные компании и фильтры (в Pro)</li>
            </ul>
          </Card>
        </div>

        {grouped.map((group) => (
          <section key={group.category} className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{group.category}</h3>
              <div className="h-px flex-1 rounded bg-slate-200" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.roles.map((role, index) => (
                <RoleCard key={role.slug} slug={role.slug} name={role.name} category={group.category} index={index} />
              ))}
            </div>
          </section>
        ))}
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Популярные компании</h2>
            <p className="text-sm text-slate-500">В демо только предпросмотр. Полные фильтры доступны в Pro.</p>
          </div>
          <Button type="default" className="rounded-full border-slate-300" href="/pro">
            Открыть Pro <ArrowRightOutlined />
          </Button>
        </div>
        <CompaniesPreview companies={bundle.companies} />
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">Как выглядят вопросы</h2>
          <p className="text-sm text-slate-500">
            Мы ранжируем список по частоте, подсвечиваем шанс и даём краткое описание. Пролистай три примера ниже.
          </p>
        </div>
        <QuestionPreview questions={topQuestions} />
        <Card className="rounded-3xl border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-indigo-500">Ограничение демо</p>
              <h3 className="text-xl font-semibold text-slate-900">
                Доступно 50 карточек на роль. Остальное откроется в Pro-подписке.
              </h3>
            </div>
            <Button type="primary" className="rounded-full bg-indigo-500 !px-6" href="/pro">
              Оформить Pro
            </Button>
          </div>
        </Card>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Видео-ответы</h2>
            <p className="text-sm text-slate-500">Собрали открытые интервью и вебинары. Таймкоды ведут прямо к интересному моменту.</p>
          </div>
          <Button type="link" href="/pro">
            Смотреть всё <ArrowRightOutlined />
          </Button>
        </div>
        <Carousel dots className="rounded-3xl bg-white p-6 shadow-sm">
          {[0, 1].map((page) => {
            const chunk = bundle.videoHighlights.slice(page * 3, page * 3 + 3);
            if (!chunk.length) return null;
            return (
              <div key={page} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {chunk.map((video) => (
                  <Link
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    className="group relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={`h-40 w-full bg-gradient-to-br ${video.thumbnail} relative flex items-center justify-center text-white`}>
                      <PlayCircleFilled className="text-4xl drop-shadow-lg" />
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                        <span>{video.platform}</span>
                        <span>•</span>
                        <span>{video.publishedAt}</span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600">{video.title}</h3>
                      <p className="text-sm text-slate-500">{video.interviewers} · {video.level}</p>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })}
        </Carousel>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">Pro подписка</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Разблокируй весь контент</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              {proPerks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Button type="primary" className="mt-6 rounded-full bg-indigo-500 !px-6" href="/pro">
              Оформить Pro
            </Button>
          </Card>
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">Документы</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Юридическая прозрачность</h3>
            <p className="mt-2 text-sm text-slate-600">
              Перед стартом убедись, что понимаешь условия использования и как мы бережно работаем с данными.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-indigo-600">
              <Link href="/terms" className="flex items-center gap-2 hover:text-indigo-500">
                Документ об оферте <ArrowRightOutlined />
              </Link>
              <Link href="/policy" className="flex items-center gap-2 hover:text-indigo-500">
                Политика конфиденциальности <ArrowRightOutlined />
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
