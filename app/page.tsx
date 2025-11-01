'use client';

import { ArrowRightOutlined, LockFilled, PlayCircleFilled } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import Link from 'next/link';
import { useMemo } from 'react';

import { roleGroups } from '@/lib/roles';
import { useDataContext } from '@/providers/DataProvider';

const { Title, Paragraph, Text } = Typography;

const statFormatter = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));

const gradients = [
  'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
  'linear-gradient(135deg, #059669 0%, #0f766e 100%)',
];

const companyGradients = [
  'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
];

const videoBackgrounds: Record<string, string> = {
  'from-indigo-500 to-violet-500': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'from-amber-500 to-orange-600': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'from-emerald-500 to-cyan-500': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  'from-sky-500 to-blue-600': 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
  'from-rose-500 to-pink-600': 'linear-gradient(135deg, #f43f5e 0%, #db2777 100%)',
};

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
  const background = gradients[index % gradients.length];
  return (
    <Link href={`/roles/${slug}`} style={{ textDecoration: 'none' }}>
      <Card
        hoverable
        style={{ borderRadius: 24, overflow: 'hidden', height: '100%' }}
        bodyStyle={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          minHeight: 210,
          background,
          color: '#fff',
        }}
      >
        <Tag color="rgba(255,255,255,0.25)" style={{ alignSelf: 'flex-start', color: '#fff' }}>
          {category}
        </Tag>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          {name}
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.75)', margin: 0 }}>
          Популярные вопросы, краткие ответы и ловушки. Сгруппировали всё, что нужно для подготовки на {name}.
        </Paragraph>
        <Space size="small" style={{ marginTop: 'auto', color: '#fff' }}>
          <Text strong style={{ color: '#fff' }}>
            Перейти к вопросам
          </Text>
          <ArrowRightOutlined />
        </Space>
      </Card>
    </Link>
  );
};

const CompaniesPreview = ({ companies }: { companies: string[] }) => {
  const limited = companies.slice(0, 12);
  return (
    <List
      grid={{ gutter: 16, column: 6, xs: 2, sm: 3, md: 4, lg: 6 }}
      dataSource={limited}
      renderItem={(company, index) => {
        const initials = company
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        return (
          <List.Item>
              <Card
                size="small"
                hoverable
                style={{ borderRadius: 16, position: 'relative' }}
                bodyStyle={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}
              >
              <Avatar
                style={{
                  background: companyGradients[index % companyGradients.length],
                  fontWeight: 600,
                }}
              >
                {initials}
              </Avatar>
              <Text style={{ fontWeight: 500 }}>{company}</Text>
              <LockFilled style={{ position: 'absolute', right: 12, top: 12, color: '#bfbfbf', fontSize: 12 }} />
            </Card>
          </List.Item>
        );
      }}
    />
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
  <List
    dataSource={questions}
    renderItem={(question) => (
      <List.Item key={question.id}>
        <Card
          style={{ width: '100%', borderRadius: 20 }}
          bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col flex="auto">
              <Title level={5} style={{ margin: 0 }}>
                {question.title}
              </Title>
            </Col>
            <Col>
              <Space size="small">
                <Tooltip title="Вероятность услышать вопрос на ближайшем интервью">
                  <Tag color="geekblue">Шанс {Math.round(question.chance)}%</Tag>
                </Tooltip>
                <Tooltip title="Частота упоминаний за последние недели">
                  <Tag color="cyan">Частота {Math.round(question.frequencyScore)}%</Tag>
                </Tooltip>
              </Space>
            </Col>
          </Row>
          <Progress
            percent={Math.min(question.frequencyScore, 100)}
            showInfo={false}
            strokeColor={{ from: '#6366f1', to: '#a855f7' }}
            strokeWidth={12}
            style={{ marginBottom: 0 }}
          />
        </Card>
      </List.Item>
    )}
  />
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
    <div style={{ background: '#f5f5f5' }}>
      <Space direction="vertical" size={64} style={{ width: '100%' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #1f2937 100%)',
            color: '#fff',
            padding: '80px 0',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <Row gutter={[48, 32]} align="bottom">
              <Col xs={24} lg={14}>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                  <Tag color="rgba(255,255,255,0.25)" style={{ alignSelf: 'flex-start', color: '#fff' }}>
                    easyOffer demo · {isCustom ? 'импортированные данные' : 'синтетический набор'}
                  </Tag>
                  <Title level={1} style={{ color: '#fff', margin: 0 }}>
                    Подготовься к собеседованию так, как будто ты уже внутри команды мечты
                  </Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18 }}>
                    Десятки ролей, частотные вопросы и реальные ответы кандидатов. Мы подсвечиваем, что спрашивают прямо
                    сейчас, чтобы ты фокусировался на важном.
                  </Paragraph>
                  <Space size="middle" wrap>
                    <Button type="primary" size="large" href="/roles/frontend">
                      Начать с Frontend
                    </Button>
                    <Button type="default" size="large" href="/pro">
                      Узнать про Pro
                    </Button>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={10}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card bordered={false} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.1)' }}>
                      <Space direction="vertical" size={8}>
                        <Text style={{ color: 'rgba(255,255,255,0.75)' }}>Вопросов в демо</Text>
                        <Title level={2} style={{ color: '#fff', margin: 0 }}>
                          {statFormatter(bundle.questions.length)}
                        </Title>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card bordered={false} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.1)' }}>
                      <Space direction="vertical" size={8}>
                        <Text style={{ color: 'rgba(255,255,255,0.75)' }}>Компаний отслеживаем</Text>
                        <Title level={2} style={{ color: '#fff', margin: 0 }}>
                          {statFormatter(bundle.companies.length)}
                        </Title>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card bordered={false} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.1)' }}>
                      <Space direction="vertical" size={8}>
                        <Text style={{ color: 'rgba(255,255,255,0.75)' }}>Обновлено</Text>
                        <Title level={2} style={{ color: '#fff', margin: 0 }}>
                          {lastUpdated.toLocaleDateString('ru-RU')}
                        </Title>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card bordered={false} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.1)' }}>
                      <Space direction="vertical" size={8}>
                        <Text style={{ color: 'rgba(255,255,255,0.75)' }}>Средняя вероятность</Text>
                        <Title level={2} style={{ color: '#fff', margin: 0 }}>
                          {statFormatter(
                            bundle.questions.reduce((acc, item) => acc + item.chance, 0) /
                              Math.max(bundle.questions.length, 1),
                          )}%
                        </Title>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Space direction="vertical" size={40} style={{ width: '100%' }}>
            <Row gutter={[48, 32]} align="middle">
              <Col xs={24} lg={16}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Title level={2} style={{ margin: 0 }}>
                    Каталог ролей
                  </Title>
                  <Paragraph style={{ fontSize: 18, color: '#595959', margin: 0 }}>
                    Выбери профессию и изучи частотные вопросы. В демо — до 50 карточек на роль, остальное откроется в Pro.
                  </Paragraph>
                </Space>
              </Col>
              <Col xs={24} lg={8}>
                <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                    Что внутри
                  </Text>
                  <ul style={{ paddingLeft: 16, margin: 0, color: '#595959', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <li>Частоты вопросов и прогноз шанса</li>
                    <li>Краткие ответы и ловушки</li>
                    <li>Видео- и текстовые ответы кандидатов</li>
                    <li>Популярные компании и фильтры (в Pro)</li>
                  </ul>
                </Card>
              </Col>
            </Row>

            <Space direction="vertical" size={32} style={{ width: '100%' }}>
              {grouped.map((group) => (
                <Space key={group.category} direction="vertical" size={24} style={{ width: '100%' }}>
                  <Divider orientation="left" style={{ margin: 0 }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {group.category}
                    </Title>
                  </Divider>
                  <Row gutter={[24, 24]}>
                    {group.roles.map((role, index) => (
                      <Col key={role.slug} xs={24} sm={12} lg={8}>
                        <RoleCard slug={role.slug} name={role.name} category={group.category} index={index} />
                      </Col>
                    ))}
                  </Row>
                </Space>
              ))}
            </Space>
          </Space>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Row align="middle" justify="space-between" gutter={[16, 16]}>
              <Col>
                <Space direction="vertical" size={8}>
                  <Title level={3} style={{ margin: 0 }}>
                    Популярные компании
                  </Title>
                  <Text type="secondary">В демо только предпросмотр. Полные фильтры — в Pro.</Text>
                </Space>
              </Col>
              <Col>
                <Button type="default" href="/pro">
                  Открыть Pro <ArrowRightOutlined />
                </Button>
              </Col>
            </Row>
            <CompaniesPreview companies={bundle.companies} />
          </Space>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Space direction="vertical" size={8}>
              <Title level={3} style={{ margin: 0 }}>
                Как выглядят вопросы
              </Title>
              <Text type="secondary">
                Ранжируем по частоте, подсвечиваем шанс и даём краткое описание. Ниже — шесть примеров.
              </Text>
            </Space>
            <QuestionPreview questions={topQuestions} />
            <Card
              style={{
                borderRadius: 24,
                background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}
            >
              <Text strong style={{ textTransform: 'uppercase', color: '#4f46e5', letterSpacing: 1 }}>
                Ограничение демо
              </Text>
              <Title level={4} style={{ margin: 0 }}>
                Доступно 50 карточек на роль. Остальное откроется в Pro-подписке.
              </Title>
              <Button type="primary" href="/pro">
                Оформить Pro
              </Button>
            </Card>
          </Space>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Row align="middle" justify="space-between" gutter={[16, 16]}>
              <Col>
                <Space direction="vertical" size={4}>
                  <Title level={3} style={{ margin: 0 }}>
                    Видео-ответы
                  </Title>
                  <Text type="secondary">Открытые интервью и вебинары. Таймкоды ведут к важным моментам.</Text>
                </Space>
              </Col>
              <Col>
                <Button type="link" href="/pro">
                  Смотреть всё <ArrowRightOutlined />
                </Button>
              </Col>
            </Row>
            <Card style={{ borderRadius: 24 }} bodyStyle={{ padding: 0 }}>
              <Carousel dots>
                {[0, 1].map((page) => {
                  const chunk = bundle.videoHighlights.slice(page * 3, page * 3 + 3);
                  if (!chunk.length) return null;
                  return (
                    <div key={page}>
                      <Row gutter={[24, 24]} style={{ padding: 32 }}>
                        {chunk.map((video) => (
                          <Col key={video.id} xs={24} md={12} lg={8}>
                            <Link href={video.url} target="_blank" style={{ textDecoration: 'none' }}>
                              <Card hoverable style={{ borderRadius: 24, height: '100%' }}>
                                <div
                                  style={{
                                    height: 160,
                                    borderRadius: 16,
                                    background: videoBackgrounds[video.thumbnail] ?? 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    marginBottom: 16,
                                  }}
                                >
                                  <PlayCircleFilled style={{ fontSize: 32 }} />
                                </div>
                                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                  <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {video.platform} · {video.publishedAt}
                                  </Text>
                                  <Title level={4} style={{ margin: 0 }}>
                                    {video.title}
                                  </Title>
                                  <Text type="secondary">
                                    {video.interviewers} · {video.level}
                                  </Text>
                                </Space>
                              </Card>
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  );
                })}
              </Carousel>
            </Card>
          </Space>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card style={{ borderRadius: 24, height: '100%' }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Pro подписка
                </Text>
                <Title level={3} style={{ margin: 0 }}>
                  Разблокируй весь контент
                </Title>
                <List
                  dataSource={proPerks}
                  renderItem={(perk) => (
                    <List.Item style={{ padding: '4px 0' }}>
                      <Space>
                        <span style={{ width: 8, height: 8, background: '#6366f1', borderRadius: '50%' }} />
                        <Text>{perk}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
                <Button type="primary" href="/pro">
                  Оформить Pro
                </Button>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card style={{ borderRadius: 24, height: '100%' }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Документы
                </Text>
                <Title level={3} style={{ margin: 0 }}>
                  Юридическая прозрачность
                </Title>
                <Paragraph style={{ margin: 0, color: '#595959' }}>
                  Перед стартом убедись, что понимаешь условия использования и как мы бережно работаем с данными.
                </Paragraph>
                <Space direction="vertical" size={8}>
                  <Link href="/terms">Документ об оферте</Link>
                  <Link href="/policy">Политика конфиденциальности</Link>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </Space>
    </div>
  );
}
