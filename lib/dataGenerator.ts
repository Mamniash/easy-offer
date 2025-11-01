import { allRoles } from '@/lib/roles';
import type {
  DataBundle,
  ExperienceLevel,
  InterviewStage,
  QuestionRecord,
  QuestionType,
  RoleDefinition,
} from '@/types';

interface RoleTopicSeed {
  subject: string;
  focus: string;
  scenario: string;
  type: QuestionType;
  interviewStage: InterviewStage;
  tags: string[];
}

const levelDescriptors: Record<ExperienceLevel, { label: string; tone: string }> = {
  junior: {
    label: 'джуниор',
    tone: 'я аккуратно проверяю основы и прошу наставника подтвердить подход',
  },
  middle: {
    label: 'мидл',
    tone: 'я предлагаю сбалансированное решение и беру ответственность за результат',
  },
  senior: {
    label: 'сеньор',
    tone: 'я объясняю стратегию, учитывая риски, метрики и влияние на команду',
  },
};

const questionOpeners = [
  'Представь, что ты {level} {role}. Как бы ты подошёл к {subject}?',
  'Как {level} {role} объяснит {subject} на собеседовании?',
  'Расскажи, как {level} {role} проектирует {subject}.',
  'Что для тебя значит {subject} как для {level} {role}?',
];

const companiesCatalog = [
  'TechNova',
  'BrightWorks',
  'CloudRidge',
  'DataPulse',
  'HyperCraft',
  'FutureLoop',
  'CodeOrbit',
  'MetricFox',
  'SkyForge',
  'QuantumWay',
  'PixelSmith',
  'SignalPeak',
  'OceanByte',
  'BoldMind',
  'CivicSoft',
  'Lighthouse Labs',
  'Aurora Systems',
  'CoreDynamics',
  'Trailblaze',
  'CortexBeam',
  'Northwind Apps',
  'Siberia Digital',
  'Atlas Robotics',
  'Finpeak',
  'OrbitID',
  'SenseCraft',
  'DeepPath',
  'Insightify',
  'VectorHive',
  'Everlight',
];

interface SeededRandom {
  next: () => number;
}

const createRandom = (seed: number): SeededRandom => {
  let value = seed;
  return {
    next: () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    },
  };
};

const pickQuestionOpener = (topicIndex: number, levelIndex: number) => {
  const template = questionOpeners[(topicIndex + levelIndex) % questionOpeners.length];
  return template;
};

const roleTopicSeeds: Record<string, RoleTopicSeed[]> = {
  frontend: [
    {
      subject: 'архитектуру компонентов для SPA с несколькими dashboards',
      focus: 'начинаю с декомпозиции состояний и границ ответственности',
      scenario: 'команда параллельно развивает несколько продуктовых потоков',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['react', 'архитектура', 'spa'],
    },
    {
      subject: 'оптимизацию загрузки и работу с code splitting',
      focus: 'взвешиваю критический путь и упрощаю бандлы',
      scenario: 'маркетинговые кампании дают всплески трафика',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['performance', 'webpack'],
    },
    {
      subject: 'настройку доступности интерфейса и ARIA',
      focus: 'составляю чек-лист контентных и интерактивных элементов',
      scenario: 'проект выходит на рынки с жёсткими требованиями доступности',
      type: 'theory',
      interviewStage: 'on_site',
      tags: ['a11y', 'ui'],
    },
    {
      subject: 'обработку сложных форм и валидации',
      focus: 'использую управляемые компоненты и кэширование черновиков',
      scenario: 'пользователи часто возвращаются к незавершённым формам',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['forms', 'state'],
    },
    {
      subject: 'интеграцию SSR и hydration в React',
      focus: 'разделяю данные для initial props и последующих запросов',
      scenario: 'нужно удерживать SEO при динамическом контенте',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['ssr', 'react'],
    },
    {
      subject: 'план мониторинга ошибок и перехвата Edge-сценариев',
      focus: 'разворачиваю клиентские логгеры и связываю события с метриками',
      scenario: 'бизнес требует видеть влияние ошибок на конверсию',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['observability', 'slo'],
    },
    {
      subject: 'организацию дизайн-системы и токенов',
      focus: 'описываю принципы наследования, слежу за масштабируемостью',
      scenario: 'несколько продуктовых команд делят общий UI-kit',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['design-system', 'ui'],
    },
    {
      subject: 'диагностику проблем с состоянием в React Query или Redux',
      focus: 'смотрю на консистентность кэша и политику инвалидации',
      scenario: 'продукт активно использует real-time обновления',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['state', 'cache'],
    },
  ],
  'backend-nodejs': [
    {
      subject: 'проектирование REST API для биллинга в Node.js',
      focus: 'разделяю слои, продумываю идемпотентность и ретраи',
      scenario: 'финтех-платформа обслуживает несколько стран',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['rest', 'nodejs'],
    },
    {
      subject: 'организацию фоновых задач через очереди',
      focus: 'выбираю брокер и настраиваю idempotency ключи',
      scenario: 'нужно надёжно отправлять уведомления и рассылки',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['queues', 'async'],
    },
    {
      subject: 'управление конфигурацией и секретами',
      focus: 'делю конфиги по средам и использую secret manager',
      scenario: 'команда деплоит несколько микросервисов',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['security', 'devops'],
    },
    {
      subject: 'оптимизацию Node.js под высокую нагрузку',
      focus: 'анализирую event loop, кластеризацию и профилирую горячие точки',
      scenario: 'продукт получает пиковые нагрузки по вечерам',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['performance', 'nodejs'],
    },
    {
      subject: 'работу с транзакциями в PostgreSQL',
      focus: 'использую уровни изоляции и транзакционные шаблоны',
      scenario: 'сервисы конкурируют за одни и те же ресурсы',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['postgres', 'transactions'],
    },
    {
      subject: 'отладку утечек памяти в Node.js',
      focus: 'снимаю heap snapshots и анализирую долгоживущие ссылки',
      scenario: 'сервер постепенно замедляется после релизов',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['memory', 'profiling'],
    },
    {
      subject: 'построение GraphQL gateway поверх legacy API',
      focus: 'планирую схему, кеш и границы BFF',
      scenario: 'нужно единообразить данные для фронтенда и мобильных команд',
      type: 'system_design',
      interviewStage: 'on_site',
      tags: ['graphql', 'bff'],
    },
    {
      subject: 'организацию наблюдаемости и alerting',
      focus: 'настраиваю корреляцию логов, метрик и трейсинга',
      scenario: 'SLA строги, важны быстрые отклики на инциденты',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['observability', 'slo'],
    },
  ],
  'backend-java': [
    {
      subject: 'проектирование микросервисов на Spring Boot',
      focus: 'определяю границы сервисов и контрактов',
      scenario: 'платформа разделена на домены с независимыми командами',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['spring', 'microservices'],
    },
    {
      subject: 'работу с потоками и конкурентностью',
      focus: 'использую executors и контролирую contention',
      scenario: 'высокая нагрузка на сервис расчёта тарифов',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['concurrency', 'java'],
    },
    {
      subject: 'оптимизацию Hibernate и JPA',
      focus: 'управляю lazy loading, батчами и кэшами второго уровня',
      scenario: 'репорты тормозят из-за тяжелых запросов',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['hibernate', 'sql'],
    },
    {
      subject: 'построение resilient архитектуры с Circuit Breaker',
      focus: 'описываю fallback, таймауты и ретраи',
      scenario: 'интеграции с внешними API часто деградируют',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['resilience', 'spring'],
    },
    {
      subject: 'профилирование JVM и GC',
      focus: 'анализирую heap dump, настраиваю параметры GC под сервис',
      scenario: 'паузы GC влияют на SLA',
      type: 'theory',
      interviewStage: 'on_site',
      tags: ['jvm', 'gc'],
    },
    {
      subject: 'организацию тестирования на уровне сервисов',
      focus: 'строю pyramid, использую Testcontainers и контрактные тесты',
      scenario: 'микросервисы быстро эволюционируют',
      type: 'behavioral',
      interviewStage: 'technical',
      tags: ['testing', 'qa'],
    },
    {
      subject: 'управление конфигурацией через Spring Cloud Config',
      focus: 'ввожу версионирование и feature toggles',
      scenario: 'нужно безопасно выкатывать фичи в нескольких регионах',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['config', 'spring'],
    },
    {
      subject: 'проектирование API для потоковой обработки',
      focus: 'использую Kafka Streams и schema registry',
      scenario: 'событийная платформа обслуживает аналитику',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['streaming', 'kafka'],
    },
  ],
  'backend-php': [
    {
      subject: 'проектирование модульной архитектуры в Symfony или Laravel',
      focus: 'разбиваю домены, использую dependency injection',
      scenario: 'монолит вырос и требует поддерживаемости',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['architecture', 'php'],
    },
    {
      subject: 'оптимизацию запросов к MySQL',
      focus: 'использую индексы, профилировщики и мемкеш',
      scenario: 'интернет-магазин переживает акции и пиковые нагрузки',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['mysql', 'performance'],
    },
    {
      subject: 'построение очередей и задач на PHP',
      focus: 'использую очереди, работаю с ретраями и мониторингом',
      scenario: 'нужно гарантированно отправлять уведомления',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['queues', 'background'],
    },
    {
      subject: 'борьбу с Legacy-кодом и рефакторинг',
      focus: 'ввожу стратегии strangler и покрываю тестами',
      scenario: 'исторический проект мешает внедрять новые фичи',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['legacy', 'refactoring'],
    },
    {
      subject: 'построение API для мобильных приложений',
      focus: 'готовлю версионирование и ограничение трафика',
      scenario: 'несколько клиентских приложений используют один бэкенд',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['api', 'mobile'],
    },
    {
      subject: 'безопасность PHP-приложений',
      focus: 'использую prepared statements, валидацию и защиту от CSRF',
      scenario: 'продукт хранит личные данные клиентов',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['security', 'php'],
    },
    {
      subject: 'интеграцию с платёжными системами',
      focus: 'обрабатываю webhooks и ошибки авторизации',
      scenario: 'сервис принимает подписки из разных стран',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['payments', 'integration'],
    },
    {
      subject: 'планирование миграций схемы',
      focus: 'подготавливаю обратимые миграции и тестирую downtime',
      scenario: 'обновления базы не должны останавливать сервис',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['migrations', 'mysql'],
    },
  ],
  'backend-python': [
    {
      subject: 'строительство REST и GraphQL API на FastAPI или Django',
      focus: 'организую слои, валидацию Pydantic и тестирую контракты',
      scenario: 'продукт комбинирует синхронные и асинхронные вызовы',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['fastapi', 'django'],
    },
    {
      subject: 'оптимизацию асинхронных задач и event loop',
      focus: 'использую asyncio, контролирую блокировки и пулы',
      scenario: 'сервис обрабатывает много внешних интеграций',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['asyncio', 'python'],
    },
    {
      subject: 'упаковку и деплой Python-сервисов',
      focus: 'создаю reproducible окружения и контролирую зависимости',
      scenario: 'команда работает с microservice-ландшафтом',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['deployment', 'containers'],
    },
    {
      subject: 'работу с обработкой данных и pandas pipelines',
      focus: 'оптимизирую использование памяти, выношу тяжёлые операции в background',
      scenario: 'аналитические отчёты строятся на лету',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['pandas', 'data'],
    },
    {
      subject: 'интеграцию Celery или RQ для фоновых задач',
      focus: 'проектирую idempotency и мониторинг очередей',
      scenario: 'нужно стабильно генерировать отчёты и уведомления',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['celery', 'queues'],
    },
    {
      subject: 'подход к тестированию Python-кода',
      focus: 'строю слоистую стратегию, добавляю property-based тесты',
      scenario: 'проект растёт, важно сохранить качество',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['testing', 'python'],
    },
    {
      subject: 'управление конфигурацией через pydantic settings',
      focus: 'разделяю переменные окружения и файлы секретов',
      scenario: 'один сервис крутится в нескольких регионах',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['config', 'python'],
    },
    {
      subject: 'обработку очередей Kafka или RabbitMQ',
      focus: 'управляю партициями и порядком сообщений',
      scenario: 'система объединяет потоковые и пакетные обработки',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['kafka', 'rabbitmq'],
    },
  ],
  'backend-cpp': [
    {
      subject: 'проектирование высоконагруженного сервиса на C++',
      focus: 'выделяю критические пути и управляю памятью вручную',
      scenario: 'продукт обслуживает миллионы запросов в минуту',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['c++', 'highload'],
    },
    {
      subject: 'работу с многопоточностью и синхронизацией',
      focus: 'использую std::thread, атомарные операции и lock-free структуры',
      scenario: 'платформа делает realtime обработку событий',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['multithreading', 'c++'],
    },
    {
      subject: 'настройку и профилирование производительности',
      focus: 'собираю perf-traces, использую valgrind и perf',
      scenario: 'нужно отловить микрозадержки в ядре сервиса',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['profiling', 'performance'],
    },
    {
      subject: 'управление памятью и smart pointers',
      focus: 'анализирую владение, избегаю циклических ссылок',
      scenario: 'legacy код содержит утечки и double free',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['memory', 'smart-pointer'],
    },
    {
      subject: 'организацию сборочного процесса с CMake',
      focus: 'структурирую таргеты, делаю кэшируемые сборки',
      scenario: 'большой монорепозиторий должен собираться быстро',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['cmake', 'build'],
    },
    {
      subject: 'безопасность и работу с пользовательскими данными',
      focus: 'проверяю границы буферов и защищаюсь от UB',
      scenario: 'сервис работает с критичными пользовательскими запросами',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['security', 'c++'],
    },
    {
      subject: 'обработку сетевых протоколов на низком уровне',
      focus: 'использую epoll/kqueue и проектирую неблокирующие сокеты',
      scenario: 'система поддерживает тысячи постоянных соединений',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['networking', 'c++'],
    },
    {
      subject: 'подход к тестированию и CI',
      focus: 'выстраиваю unit/integration тесты и code review чек-листы',
      scenario: 'важно не допускать регрессий в базовой библиотеке',
      type: 'behavioral',
      interviewStage: 'technical',
      tags: ['testing', 'ci'],
    },
  ],
  android: [
    {
      subject: 'архитектуру приложения на Kotlin с использованием Jetpack',
      focus: 'применяю MVVM, разделяю слои и работаю с coroutines',
      scenario: 'несколько команд развивают общий код',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['android', 'architecture'],
    },
    {
      subject: 'работу с offline-first синхронизацией',
      focus: 'проектирую локальное хранилище и очереди синхронизации',
      scenario: 'пользователи часто без сети',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['offline', 'synchronization'],
    },
    {
      subject: 'оптимизацию батареи и производительности',
      focus: 'использую профилировщики, слежу за wake locks',
      scenario: 'приложение работает на бюджетных устройствах',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['performance', 'battery'],
    },
    {
      subject: 'построение CI/CD пайплайна для мобильной команды',
      focus: 'автоматизирую сборку, тесты и distribution',
      scenario: 'релизы выходят еженедельно',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['ci', 'mobile'],
    },
    {
      subject: 'обеспечение безопасности хранения данных',
      focus: 'использую encryption, SafetyNet и проверяю бэкенд-контракты',
      scenario: 'приложение работает с платежами и персональными данными',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['security', 'mobile'],
    },
    {
      subject: 'модульное тестирование и UI-тесты',
      focus: 'применяю Espresso, MockK и разделяю зависимости',
      scenario: 'команда держит высокую регрессионную нагрузку',
      type: 'behavioral',
      interviewStage: 'technical',
      tags: ['testing', 'mobile'],
    },
    {
      subject: 'интеграцию с Android Compose',
      focus: 'мигрирую экран за экраном и использую state hoisting',
      scenario: 'нужно поддержать дизайн-систему в новом стеке',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['compose', 'ui'],
    },
    {
      subject: 'управление зависимостями через Gradle',
      focus: 'разношу конфигурацию по модулям и кеширую артефакты',
      scenario: 'проект содержит десятки модулей',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['gradle', 'build'],
    },
  ],
  ios: [
    {
      subject: 'архитектуру приложения на Swift с Combine',
      focus: 'использую unidirectional data flow и отделяю бизнес-слой',
      scenario: 'продукт работает на iPhone и iPad',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['swift', 'architecture'],
    },
    {
      subject: 'миграцию на SwiftUI и работу с UIKit',
      focus: 'интегрирую через UIHostingController и поддерживаю переиспользование',
      scenario: 'команда постепенно обновляет экраны',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['swiftui', 'uikit'],
    },
    {
      subject: 'управление памятью и ARC',
      focus: 'контролирую retain cycles и использую weak references',
      scenario: 'приложение активно работает с медиаданными',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['memory', 'ios'],
    },
    {
      subject: 'сборку CI/CD пайплайна на Xcode Cloud или Fastlane',
      focus: 'автоматизирую тесты, подписи и поставку в TestFlight',
      scenario: 'релизы выходят еженедельно',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['ci', 'ios'],
    },
    {
      subject: 'работу с Core Data и синхронизацию',
      focus: 'проектирую модели, следую best practices по производительности',
      scenario: 'нужно офлайн-хранилище с конфликт-резолвом',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['core-data', 'sync'],
    },
    {
      subject: 'обеспечение безопасности и хранение секретов',
      focus: 'использую Keychain, защищаю сетевые запросы и логи',
      scenario: 'продукт проходит аудит банков',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['security', 'ios'],
    },
    {
      subject: 'оптимизацию загрузки изображений',
      focus: 'использую кеш, background fetch и приоритизацию',
      scenario: 'лента контента с большим количеством медиа',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['images', 'performance'],
    },
    {
      subject: 'отладку сложных багов через инструменты Xcode',
      focus: 'применяю Instruments, анализирую логи и краши',
      scenario: 'в production возникают трудноуловимые проблемы',
      type: 'behavioral',
      interviewStage: 'technical',
      tags: ['debug', 'ios'],
    },
  ],
  golang: [
    {
      subject: 'архитектуру сервисов на Go с clean architecture',
      focus: 'разделяю домены, использую interfaces для абстракций',
      scenario: 'несколько микросервисов обслуживают критичные операции',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['architecture', 'golang'],
    },
    {
      subject: 'работу с горутинами и каналами',
      focus: 'проектирую паттерны fan-in/fan-out и избегаю гонок',
      scenario: 'сервис обрабатывает большое количество событий',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['goroutines', 'concurrency'],
    },
    {
      subject: 'проектирование REST и gRPC API',
      focus: 'выбираю подходящие контракты и стратегии версионирования',
      scenario: 'сервисы должны быть совместимы между командами',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['grpc', 'rest'],
    },
    {
      subject: 'работу с профилировщиками Go',
      focus: 'использую pprof, анализирую CPU и heap',
      scenario: 'нагрузка растёт, нужно устранить узкие места',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['profiling', 'golang'],
    },
    {
      subject: 'организацию работы с БД',
      focus: 'применяю context, пулы и транзакции',
      scenario: 'нужно гарантировать целостность финансовых операций',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['database', 'golang'],
    },
    {
      subject: 'построение пайплайна тестирования',
      focus: 'использую table-driven тесты и линтеры',
      scenario: 'команда держит высокий стандарт качества',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['testing', 'golang'],
    },
    {
      subject: 'работу с k8s и деплоем',
      focus: 'готовлю Helm чарты и healthchecks',
      scenario: 'микросервисы крутятся в облаке',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['kubernetes', 'devops'],
    },
    {
      subject: 'обработку очередей и событий',
      focus: 'использую NATS/Kafka, контролирую backpressure',
      scenario: 'поток заказов должен обрабатываться в реальном времени',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['events', 'golang'],
    },
  ],
  devops: [
    {
      subject: 'построение инфраструктуры как кода',
      focus: 'использую Terraform, описываю модули и review процесс',
      scenario: 'компания масштабируется в нескольких регионах',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['terraform', 'iac'],
    },
    {
      subject: 'наблюдаемость и алертинг в k8s',
      focus: 'настраиваю Prometheus/Grafana и SLO',
      scenario: 'важно быстро реагировать на деградацию',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['monitoring', 'kubernetes'],
    },
    {
      subject: 'CI/CD пайплайны и стратегии деплоя',
      focus: 'описываю blue-green, canary и rollback',
      scenario: 'несколько команд деплоятся ежедневно',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['ci', 'cd'],
    },
    {
      subject: 'безопасность секретов и доступов',
      focus: 'использую Vault, минимальные права и аудит',
      scenario: 'инфраструктура проходит внешний аудит',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['security', 'devops'],
    },
    {
      subject: 'оптимизацию затрат в облаке',
      focus: 'анализирую метрики, резервирую мощности и автоматизирую shutdown',
      scenario: 'компания выросла и ищет баланс стоимости',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['cost', 'cloud'],
    },
    {
      subject: 'систему логирования и трассировки',
      focus: 'строю централизованный сбор и политики retention',
      scenario: 'нужно расследовать инциденты за минуты',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['logging', 'observability'],
    },
    {
      subject: 'обработку инцидентов и postmortem',
      focus: 'выстраиваю on-call, документирую RCA',
      scenario: 'команда поддерживает 24/7 сервисы',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['oncall', 'process'],
    },
    {
      subject: 'работу с сетями и балансировкой',
      focus: 'конфигурирую ingress, сети VPC и firewall',
      scenario: 'нужно обеспечить безопасность и отказоустойчивость',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['networking', 'kubernetes'],
    },
  ],
  'data-engineer': [
    {
      subject: 'построение ETL пайплайна для событийных данных',
      focus: 'проектирую слои хранения и SLA на доставку',
      scenario: 'аналитика зависит от свежести данных',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['etl', 'data'],
    },
    {
      subject: 'работу с потоковой обработкой',
      focus: 'использую Kafka, Flink и слежу за порядком событий',
      scenario: 'продукт должен реагировать в реальном времени',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['streaming', 'kafka'],
    },
    {
      subject: 'управление качеством данных',
      focus: 'настраиваю тесты, проверяю схемы и аномалии',
      scenario: 'несколько команд пишут в один data lake',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['data-quality', 'monitoring'],
    },
    {
      subject: 'оркестрацию пайплайнов',
      focus: 'использую Airflow/Prefect, контролирую зависимости',
      scenario: 'много взаимосвязанных задач',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['airflow', 'orchestration'],
    },
    {
      subject: 'оптимизацию хранения в DWH',
      focus: 'выбираю форматы, кластеризацию и партиционирование',
      scenario: 'отчёты тормозят на больших объёмах',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['dwh', 'storage'],
    },
    {
      subject: 'управление доступом к данным',
      focus: 'ввожу роли, каталоги данных и аудит',
      scenario: 'нужно соблюсти требования безопасности',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['security', 'data'],
    },
    {
      subject: 'миграцию данных между системами',
      focus: 'планирую cut-over, репликацию и валидацию',
      scenario: 'компания переходит на новую платформу',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['migration', 'data'],
    },
    {
      subject: 'построение self-service аналитики',
      focus: 'создаю слой метрических витрин и документацию',
      scenario: 'продуктовые команды хотят автономии',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['analytics', 'product'],
    },
  ],
  unity: [
    {
      subject: 'архитектуру игровой сцены в Unity',
      focus: 'разделяю объекты, управляю жизненным циклом и событиями',
      scenario: 'команда работает над мобильной игрой',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['unity', 'architecture'],
    },
    {
      subject: 'оптимизацию производительности на мобильных устройствах',
      focus: 'профилирую draw calls, текстуры и память',
      scenario: 'устройство ограничено ресурсами',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['performance', 'unity'],
    },
    {
      subject: 'работу с physics и столкновениями',
      focus: 'управляю collider-ами и расчётом столкновений',
      scenario: 'геймплей зависит от точности физики',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['physics', 'unity'],
    },
    {
      subject: 'организацию asset pipeline',
      focus: 'строю процессы импорта, оптимизации и версионирования',
      scenario: 'несколько художников работают параллельно',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['assets', 'process'],
    },
    {
      subject: 'скриптование поведения AI',
      focus: 'использую state machines и события',
      scenario: 'игроки ожидают живой отклик персонажей',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['ai', 'unity'],
    },
    {
      subject: 'работу с мультиплеером',
      focus: 'проектирую синхронизацию, лаг-компенсацию и безопасность',
      scenario: 'игра должна поддерживать PvP режим',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['multiplayer', 'unity'],
    },
    {
      subject: 'тестирование и автоматизация',
      focus: 'ввожу unit-тесты, скриншотные проверки и CI',
      scenario: 'релизы выходят каждую неделю',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['testing', 'unity'],
    },
    {
      subject: 'монетизацию и аналитические события',
      focus: 'интегрирую аналитику, A/B тесты и баланс экономики',
      scenario: 'продукт живёт на free-to-play модели',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['analytics', 'monetization'],
    },
  ],
  'one-c': [
    {
      subject: 'построение конфигурации 1C под уникальные бизнес-процессы',
      focus: 'анализирую процессы, адаптирую типовую конфигурацию',
      scenario: 'компания с несколькими юридическими лицами',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['1c', 'configuration'],
    },
    {
      subject: 'оптимизацию запросов 1C',
      focus: 'использую планы запросов, временные таблицы',
      scenario: 'отчёты формируются слишком долго',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['sql', '1c'],
    },
    {
      subject: 'организацию обмена с внешними системами',
      focus: 'строю регламентные задания и контролирую ошибки',
      scenario: 'интеграции с сайтом и CRM',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['integration', '1c'],
    },
    {
      subject: 'управление доступом и ролями',
      focus: 'настраиваю профили, веду аудит изменений',
      scenario: 'необходимо разграничить финансовые права',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['security', '1c'],
    },
    {
      subject: 'подготовку к обновлению конфигурации',
      focus: 'веду ветки, тестирую и планирую откаты',
      scenario: 'бизнес не может простаивать во время релиза',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['release', 'process'],
    },
    {
      subject: 'разбор нетиповой ошибки пользователя',
      focus: 'собираю лог, воспроизвожу и документирую решение',
      scenario: 'пользователь не может закрыть период',
      type: 'behavioral',
      interviewStage: 'technical',
      tags: ['support', '1c'],
    },
    {
      subject: 'работу с распределёнными базами 1C',
      focus: 'строю синхронизацию и проверяю конфликты',
      scenario: 'филиалы компании работают офлайн',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['replication', '1c'],
    },
    {
      subject: 'создание отчётов и печатных форм',
      focus: 'использую СКД, делаю гибкие настройки',
      scenario: 'руководство хочет видеть показатели в разных разрезах',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['reports', '1c'],
    },
  ],
  qa: [
    {
      subject: 'построение стратегии тестирования нового продукта',
      focus: 'оцениваю риски, составляю карту тестов и тест-дизайн',
      scenario: 'стартап запускает MVP за месяц',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['strategy', 'qa'],
    },
    {
      subject: 'планирование регрессионного тестирования',
      focus: 'определяю критичный функционал и автоматизацию',
      scenario: 'релизы проходят каждые две недели',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['regression', 'qa'],
    },
    {
      subject: 'управление баг-репортами и приоритизацией',
      focus: 'использую матрицу приоритетов, коммуницирую с командой',
      scenario: 'несколько продуктовых команд вносят изменения одновременно',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['bugtracking', 'qa'],
    },
    {
      subject: 'тестирование API и интеграций',
      focus: 'строю коллекции, мокирую внешние сервисы',
      scenario: 'бэкэнд активно меняется',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['api', 'qa'],
    },
    {
      subject: 'работу с тестовой документацией',
      focus: 'поддерживаю актуальные чек-листы и mind maps',
      scenario: 'команда быстро растёт',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['documentation', 'qa'],
    },
    {
      subject: 'тестирование мобильных приложений',
      focus: 'использую реальные устройства и фермы',
      scenario: 'нужно покрыть разные платформы',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['mobile', 'qa'],
    },
    {
      subject: 'работу с аналитикой дефектов',
      focus: 'собираю метрики, выделяю тренды и ретроспективы',
      scenario: 'компания хочет снизить количество регрессий',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['metrics', 'qa'],
    },
    {
      subject: 'коммуникацию с разработчиками',
      focus: 'строю партнёрские отношения и даю аргументированную обратную связь',
      scenario: 'в команде напряжённый релиз',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['communication', 'qa'],
    },
  ],
  aqa: [
    {
      subject: 'архитектуру автотестов для web-приложения',
      focus: 'использую многослойную структуру и PageObject',
      scenario: 'команда поддерживает тысячи сценариев',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['automation', 'qa'],
    },
    {
      subject: 'стратегию выбора тестовых данных',
      focus: 'создаю фабрики, маскирую чувствительные данные',
      scenario: 'интеграции зависят от корректных данных',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['data', 'qa'],
    },
    {
      subject: 'настройку CI для автотестов',
      focus: 'оптимизирую параллельный запуск и отчётность',
      scenario: 'нужно получать обратную связь в течение часа',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['ci', 'qa'],
    },
    {
      subject: 'работу с нестабильными тестами (flaky)',
      focus: 'логирую, анализирую и группирую по причинам',
      scenario: 'регресс тормозит релизы',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['flaky', 'qa'],
    },
    {
      subject: 'выбор инструментов и стеков',
      focus: 'оцениваю затраты, поддержку и интеграцию',
      scenario: 'нужно поддерживать web и mobile',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['tools', 'qa'],
    },
    {
      subject: 'написание UI автотестов',
      focus: 'использую устойчивые селекторы, жду готовность DOM',
      scenario: 'приложение активно развивается',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['ui-tests', 'qa'],
    },
    {
      subject: 'интеграцию автотестов в DevOps цикл',
      focus: 'согласую с разработкой, формирую критерии quality gate',
      scenario: 'компания движется к continuous delivery',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['devops', 'qa'],
    },
    {
      subject: 'метрики и отчётность по автоматизации',
      focus: 'рассказываю о покрытии, ROI и экономии времени',
      scenario: 'стейкхолдеры хотят видеть эффект',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['metrics', 'qa'],
    },
  ],
  'data-analyst': [
    {
      subject: 'построение продуктовой воронки и ключевых метрик',
      focus: 'определяю события, считаю конверсию и влияние на цели',
      scenario: 'команда запускает новую фичу',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['metrics', 'product'],
    },
    {
      subject: 'анализ когорт пользователей',
      focus: 'строю когортные таблицы, выделяю retention',
      scenario: 'продукт хочет оценить удержание',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['sql', 'analytics'],
    },
    {
      subject: 'работу с A/B тестами',
      focus: 'формулирую гипотезу, проверяю значимость и эффекты',
      scenario: 'нужно защитить выводы перед продуктом',
      type: 'theory',
      interviewStage: 'on_site',
      tags: ['experiment', 'statistics'],
    },
    {
      subject: 'визуализацию и представление результатов',
      focus: 'подбираю формат, рассказываю историю и ограничения',
      scenario: 'стейкхолдеры не технические',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['storytelling', 'analytics'],
    },
    {
      subject: 'оптимизацию SQL запросов',
      focus: 'использую CTE, индексы и объясняю планы',
      scenario: 'данных становится много',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['sql', 'performance'],
    },
    {
      subject: 'построение dashboards',
      focus: 'определяю целевую аудиторию, поддерживаю актуальность',
      scenario: 'руководство смотрит метрики ежедневно',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['dashboard', 'analytics'],
    },
    {
      subject: 'работу с пользовательскими исследованиями',
      focus: 'совмещаю количественные и качественные данные',
      scenario: 'нужно объяснить изменение метрик',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['research', 'analytics'],
    },
    {
      subject: 'подготовку данных для машинного обучения',
      focus: 'проверяю корректность, очищаю и документирую',
      scenario: 'data science команда использует мой датасет',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['ml', 'data-prep'],
    },
  ],
  'data-scientist': [
    {
      subject: 'формирование гипотез и постановку ML-задачи',
      focus: 'проверяю бизнес-контекст и метрики успеха',
      scenario: 'команда хочет повысить конверсию',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['ml', 'business'],
    },
    {
      subject: 'подготовку признаков и фич инженеринг',
      focus: 'разделяю train/test, избегаю утечек информации',
      scenario: 'данные приходят из разных источников',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['features', 'ml'],
    },
    {
      subject: 'выбор и оценку моделей',
      focus: 'сравниваю baseline, проверяю метрики и интерпретируемость',
      scenario: 'нужно объяснить результаты бизнесу',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['metrics', 'ml'],
    },
    {
      subject: 'деплой и мониторинг моделей',
      focus: 'строю пайплайн, контролирую drift и алерты',
      scenario: 'модель работает в real-time',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['mlops', 'deployment'],
    },
    {
      subject: 'работу с экспериментами',
      focus: 'подбираю дизайн, проверяю гипотезы и коррелирующие метрики',
      scenario: 'нужно доказать ценность ML решения',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['experiments', 'ml'],
    },
    {
      subject: 'объяснимость моделей',
      focus: 'использую SHAP, PDP и общаюсь со стейкхолдерами',
      scenario: 'домен регулируется законом',
      type: 'theory',
      interviewStage: 'on_site',
      tags: ['explainability', 'ml'],
    },
    {
      subject: 'работу с pipeline данных',
      focus: 'обеспечиваю воспроизводимость и версионирование',
      scenario: 'команда делит датасеты между проектами',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['pipeline', 'mlops'],
    },
    {
      subject: 'коммуникацию с продуктом',
      focus: 'перевожу результаты моделей в бизнес-решения',
      scenario: 'руководство оценивает ROI',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['communication', 'ml'],
    },
  ],
  'system-analyst': [
    {
      subject: 'сбор и формализацию требований',
      focus: 'использую интервью, диаграммы и критерии приёмки',
      scenario: 'нужно описать сложную интеграцию',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['requirements', 'analysis'],
    },
    {
      subject: 'моделирование бизнес-процессов',
      focus: 'применяю BPMN/UML, согласую с владельцами',
      scenario: 'компания автоматизирует новый процесс',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['bpmn', 'uml'],
    },
    {
      subject: 'управление изменениями требований',
      focus: 'ввожу backlog, приоритизацию и трассировку',
      scenario: 'проект длится несколько кварталов',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['change-management', 'analysis'],
    },
    {
      subject: 'описание интеграций и контрактов',
      focus: 'прорабатываю схемы, ошибки и SLA',
      scenario: 'несколько команд разрабатывают сервисы',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['integration', 'analysis'],
    },
    {
      subject: 'работу с документацией и артефактами',
      focus: 'поддерживаю актуальность, делаю knowledge base',
      scenario: 'команда распределена по регионам',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['documentation', 'analysis'],
    },
    {
      subject: 'анализ влияния на смежные системы',
      focus: 'строю матрицы зависимостей и рисков',
      scenario: 'внедрение затрагивает CRM и биллинг',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['impact', 'analysis'],
    },
    {
      subject: 'проверку результатов внедрения',
      focus: 'формирую критерии, участвую в UAT',
      scenario: 'команда готовит релиз',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['uat', 'analysis'],
    },
    {
      subject: 'коммуникацию с разработкой и бизнесом',
      focus: 'выстраиваю прозрачные договорённости и ожидания',
      scenario: 'много заинтересованных сторон',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['communication', 'analysis'],
    },
  ],
  'product-analyst': [
    {
      subject: 'формирование продуктовых гипотез',
      focus: 'использую исследования, данные и обратную связь',
      scenario: 'команда ищет точки роста',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['hypothesis', 'product'],
    },
    {
      subject: 'оценку влияния фичи на метрики',
      focus: 'строю модель, проверяю допущения и риски',
      scenario: 'нужно защитить roadmap',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['metrics', 'product'],
    },
    {
      subject: 'управление продуктовыми экспериментами',
      focus: 'определяю сегменты, перформанс и выводы',
      scenario: 'несколько параллельных экспериментов',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['experiments', 'product'],
    },
    {
      subject: 'построение аналитической инфраструктуры',
      focus: 'выстраиваю трекинг, схемы и governance',
      scenario: 'стартап быстро растёт',
      type: 'system_design',
      interviewStage: 'technical',
      tags: ['tracking', 'product'],
    },
    {
      subject: 'работу с SQL и витринами данных',
      focus: 'создаю устойчивые запросы и reusable сегменты',
      scenario: 'продуктовая команда хочет автономии',
      type: 'coding',
      interviewStage: 'technical',
      tags: ['sql', 'product'],
    },
    {
      subject: 'коммуникацию с продуктом и дизайном',
      focus: 'согласую цели, задаю вопросы и уточняю контекст',
      scenario: 'готовится крупный релиз',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['communication', 'product'],
    },
    {
      subject: 'приоритизацию продуктового backlog',
      focus: 'использую RICE, оцениваю влияние и трудозатраты',
      scenario: 'ресурсов меньше, чем идей',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['prioritization', 'product'],
    },
    {
      subject: 'подготовку презентаций для стейкхолдеров',
      focus: 'рассказываю про результаты, инсайты и next steps',
      scenario: 'нужно получить согласование инициативы',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['presentation', 'product'],
    },
  ],
  'it-project-manager': [
    {
      subject: 'планирование проекта и декомпозицию задач',
      focus: 'использую roadmap, таймбоксы и критический путь',
      scenario: 'команда стартует новый продукт',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['planning', 'project'],
    },
    {
      subject: 'управление рисками и зависимостями',
      focus: 'веду реестр рисков, согласую mitigation-планы',
      scenario: 'несколько команд работают параллельно',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['risks', 'project'],
    },
    {
      subject: 'коммуникацию со стейкхолдерами',
      focus: 'готовлю апдейты, управляем ожиданиями и эскалациями',
      scenario: 'проект заметен руководству',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['communication', 'project'],
    },
    {
      subject: 'управление бюджетом и ресурсами',
      focus: 'прогнозирую burn rate, синхронизирую план закупок',
      scenario: 'проект с фиксированным бюджетом',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['budget', 'project'],
    },
    {
      subject: 'организацию процессов delivery',
      focus: 'выбираю гибридные подходы, контролирую качество и сроки',
      scenario: 'команда распределена географически',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['process', 'project'],
    },
    {
      subject: 'работу с изменениями требований',
      focus: 'ввожу change board, оцениваю влияние и обновляю план',
      scenario: 'бизнес регулярно меняет приоритеты',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['change', 'project'],
    },
    {
      subject: 'управление подрядчиками',
      focus: 'строю SLA, контролирую результаты и оплату',
      scenario: 'часть разработки на аутсорсе',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['vendors', 'project'],
    },
    {
      subject: 'ретроспективы и непрерывное улучшение',
      focus: 'собираю обратную связь, фиксирую action items',
      scenario: 'нужно повысить прозрачность команды',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['retro', 'project'],
    },
  ],
  'it-product-manager': [
    {
      subject: 'формирование продуктового видения и стратегии',
      focus: 'опираюсь на исследования, аналитику и цели бизнеса',
      scenario: 'компания выходит на новый рынок',
      type: 'theory',
      interviewStage: 'screening',
      tags: ['vision', 'product'],
    },
    {
      subject: 'управление roadmap и приоритизацией',
      focus: 'использую OKR, синхронизирую команды и ожидания',
      scenario: 'ресурсы ограничены, нужно выбирать',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['roadmap', 'product'],
    },
    {
      subject: 'постановку целей команде разработки',
      focus: 'перевожу стратегию в измеримые результаты',
      scenario: 'несколько команд работают над одной платформой',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['goals', 'product'],
    },
    {
      subject: 'работу с метриками продукта',
      focus: 'определяю north star, auxiliary и guardrail метрики',
      scenario: 'нужно оценить прогресс и влияние фич',
      type: 'theory',
      interviewStage: 'technical',
      tags: ['metrics', 'product'],
    },
    {
      subject: 'запуск discovery и customer development',
      focus: 'планирую интервью, сегментацию и анализ инсайтов',
      scenario: 'готовим новый продуктовый трек',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['discovery', 'product'],
    },
    {
      subject: 'координацию кросс-функциональных команд',
      focus: 'создаю общие ритуалы, прозрачные решения и каналы связи',
      scenario: 'участвуют маркетинг, поддержка и разработка',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['communication', 'product'],
    },
    {
      subject: 'подготовку go-to-market плана',
      focus: 'согласую маркетинг, продажи и поддержку',
      scenario: 'компания выпускает крупное обновление',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['gtm', 'product'],
    },
    {
      subject: 'работу с обратной связью пользователей',
      focus: 'систематизирую сигналы, измеряю эффект и быстро реагирую',
      scenario: 'продукт находится в активном росте',
      type: 'behavioral',
      interviewStage: 'on_site',
      tags: ['feedback', 'product'],
    },
  ],
};
const weeklyMentionCount = 8;

const formatTitle = (
  role: RoleDefinition,
  level: ExperienceLevel,
  subject: string,
  topicIndex: number,
): string => {
  const opener = pickQuestionOpener(topicIndex, ['junior', 'middle', 'senior'].indexOf(level));
  return opener
    .replace('{level}', levelDescriptors[level].label)
    .replace('{role}', role.name)
    .replace('{subject}', subject);
};

const buildSampleAnswer = (
  roleName: string,
  subject: string,
  level: ExperienceLevel,
  focus: string,
): string => {
  const descriptor = levelDescriptors[level];
  return `Как ${descriptor.label} ${roleName} ${descriptor.tone}. Сначала ${focus}, затем проверяю, что решение покрывает ${subject}, и фиксирую договорённости для команды.`;
};

const buildWhy = (roleName: string, subject: string): string =>
  `Интервьюеру важно услышать, как кандидат структурирует ${subject} и привязывает решения к целям роли ${roleName}. Это показывает зрелость мышления и способность объяснять сложные решения.`;

const buildPitfalls = (subject: string, scenario: string): string[] => [
  `Игнорировать контекст задачи и рассматривать ${subject} в вакууме`,
  `Переоценить технические детали и забыть про влияние на пользователей`,
  `Не учесть ограничения сценария: ${scenario}`,
  `Не предложить план проверки и наблюдения после внедрения`,
];

const buildFollowUps = (subject: string): string[] => [
  `Как бы ты адаптировал подход, если масштабы ${subject} удвоятся?`,
  `Что будешь делать, если ключевые предположения по ${subject} не подтвердятся?`,
  `Кого подключишь к решению, чтобы ускорить внедрение?`,
];

const pickCompanies = (random: SeededRandom): string[] => {
  const count = 3 + Math.floor(random.next() * 4);
  const selected: string[] = [];
  for (let i = 0; i < companiesCatalog.length && selected.length < count; i++) {
    if (random.next() > 0.5) {
      selected.push(companiesCatalog[i]);
    }
  }
  while (selected.length < count) {
    const index = Math.floor(random.next() * companiesCatalog.length);
    if (!selected.includes(companiesCatalog[index])) {
      selected.push(companiesCatalog[index]);
    }
  }
  return selected;
};

const buildWeeklyMentions = (random: SeededRandom): number[] => {
  return Array.from({ length: weeklyMentionCount }, () => Math.round(random.next() * 50));
};

const frequencyFromRandom = (random: SeededRandom): number => Math.round(40 + random.next() * 55);

const chanceFromFrequency = (frequency: number, random: SeededRandom): number => {
  const noise = Math.round(random.next() * 10);
  return Math.min(98, Math.max(35, Math.round(frequency * 0.8 + noise)));
};

const levels: ExperienceLevel[] = ['junior', 'middle', 'senior'];

const interviewStages: InterviewStage[] = ['screening', 'technical', 'on_site', 'take_home'];

const ensureInterviewStage = (seed: RoleTopicSeed, index: number): InterviewStage => {
  if (seed.interviewStage) return seed.interviewStage;
  return interviewStages[index % interviewStages.length];
};

const generateQuestionsForRole = (
  role: RoleDefinition,
  topics: RoleTopicSeed[],
  random: SeededRandom,
): QuestionRecord[] => {
  const questions: QuestionRecord[] = [];
  topics.forEach((topic, topicIndex) => {
    levels.forEach((level) => {
      const title = formatTitle(role, level, topic.subject, topicIndex);
      const sampleAnswer = buildSampleAnswer(role.name, topic.subject, level, topic.focus);
      const why = buildWhy(role.name, topic.subject);
      const pitfalls = buildPitfalls(topic.subject, topic.scenario);
      const followUps = buildFollowUps(topic.subject);
      const companies = pickCompanies(random);
      const weeklyMentions = buildWeeklyMentions(random);
      const frequencyScore = frequencyFromRandom(random);
      const chance = chanceFromFrequency(frequencyScore, random);
      const id = `${role.slug}-${topicIndex}-${level}`;
      questions.push({
        id,
        roleSlug: role.slug,
        roleName: role.name,
        category: role.category,
        title,
        level,
        type: topic.type,
        interviewStage: ensureInterviewStage(topic, topicIndex),
        tags: topic.tags,
        sampleAnswer,
        why,
        pitfalls,
        followUps,
        frequencyScore,
        chance,
        companies,
        weeklyMentions,
      });
    });
  });
  return questions;
};

const computeRoles = (questions: QuestionRecord[]): RoleDefinition[] => {
  const map = new Map<string, RoleDefinition>();
  questions.forEach((question) => {
    if (!map.has(question.roleSlug)) {
      map.set(question.roleSlug, {
        slug: question.roleSlug,
        name: question.roleName,
        category: question.category,
      });
    }
  });
  return Array.from(map.values());
};

export const generateSyntheticBundle = (): DataBundle => {
  const random = createRandom(2025);
  const generatedQuestions = allRoles.flatMap((role) => {
    const topics = roleTopicSeeds[role.slug];
    if (!topics || topics.length === 0) {
      return [] as QuestionRecord[];
    }
    return generateQuestionsForRole(role, topics, random);
  });

  const roles = computeRoles(generatedQuestions);
  return {
    roles,
    questions: generatedQuestions,
    companies: companiesCatalog,
  };
};
