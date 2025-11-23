'use client';

import { ArrowRightOutlined, LockFilled, PlayCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Card, Carousel, Col, Divider, List, Row, Space, Tag, Tooltip, Typography } from 'antd';
import Link from 'next/link';
import { useMemo } from 'react';

import { formatDate } from '@/lib/date';
import { POPULAR_COMPANIES } from '@/lib/popularCompanies';
import { roleGroups } from '@/lib/roles';
import { useDataContext } from '@/providers/DataProvider';

const { Title, Paragraph, Text } = Typography;

const statFormatter = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));

const chunkArray = <T,>(items: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
};

const gradients = [
  'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
  'linear-gradient(135deg, #059669 0%, #0f766e 100%)',
];

const videoStats = [
  { value: '2 000+', label: 'видео-ответов с таймкодами' },
  { value: '4 000+', label: 'живых собеседований и вебинаров' },
  { value: '12 000+', label: 'минут насмотренности в подборке' },
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

const CompaniesPreview = () => {
  const slides = useMemo(() => chunkArray(POPULAR_COMPANIES, 18), []);

  return (
    <Carousel dots>
      {slides.map((companies, pageIndex) => (
        <div key={pageIndex}>
          <Space wrap size={[12, 12]} style={{ width: '100%', justifyContent: 'center' }}>
            {companies.map((company) => {
              const initials = company.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <Tooltip key={company.name} title="Фильтры по брендам доступны в Pro">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 999,
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                      position: 'relative',
                      minWidth: 180,
                    }}
                  >
                    <Avatar
                      shape="circle"
                      src={company.logo}
                      style={{
                        background: company.accent,
                        color: '#111827',
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Text style={{ fontWeight: 600 }}>{company.name}</Text>
                    <LockFilled style={{ position: 'absolute', right: 12, color: '#bfbfbf', fontSize: 12 }} />
                  </div>
                </Tooltip>
              );
            })}
          </Space>
        </div>
      ))}
    </Carousel>
  );
};

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
                    easyOffer demo · {isCustom ? 'импортированные данные' : 'реальные вопросы'}
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
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.08)',
                    padding: 12,
                    height: '100%',
                  }}
                  bodyStyle={{ padding: 12 }}
                >
                  <Row gutter={[12, 12]}>
                    {[{
                      label: 'Основано на',
                      value: '2 700+',
                      hint: 'реальных собеседований за последние 6 месяцев',
                    },
                    {
                      label: 'Разобрали',
                      value: '2 120',
                      hint: 'вопросов и ответов уровня Middle/Senior',
                    },
                    {
                      label: 'Следим за',
                      value: `${statFormatter(bundle.companies.length)} брендами`,
                      hint: 'и форматами интервью',
                    },
                    {
                      label: 'Обновляем',
                      value: formatDate(lastUpdated),
                      hint: 'чтобы подсвечивать свежие тренды',
                    }].map((stat) => (
                      <Col key={stat.label} span={12}>
                        <Card
                          bordered={false}
                          style={{
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
                            height: '100%',
                          }}
                          bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 16 }}
                        >
                          <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{stat.label}</Text>
                          <Title level={2} style={{ color: '#fff', margin: 0 }}>
                            {stat.value}
                          </Title>
                          <Text style={{ color: 'rgba(255,255,255,0.75)' }}>{stat.hint}</Text>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
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
            <CompaniesPreview />
          </Space>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Row align="middle" justify="space-between" gutter={[16, 16]}>
              <Col>
                <Space direction="vertical" size={8}>
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      padding: '8px 14px',
                      borderRadius: 999,
                      background: 'linear-gradient(90deg, #f0f4ff 0%, #e6f4ff 100%)',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      fontSize: 14,
                      fontWeight: 600,
                      boxShadow: '0 10px 24px rgba(24, 144, 255, 0.12)',
                    }}
                  >
                    Прокачайте насмотренность
                  </div>
                  <Title level={3} style={{ margin: 0 }}>
                    Видео-ответы и разборы
                  </Title>
                  <Text type="secondary">
                    Библиотека ответов кандидатов и разборов интервью: смотрите, как отвечают другие, и собирайте конспекты
                    по таймкодам.
                  </Text>
                  <Space wrap size={[12, 12]}>
                    {videoStats.map((stat) => (
                      <Card
                        key={stat.label}
                        size="small"
                        style={{ borderRadius: 16, minWidth: 220, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}
                        bodyStyle={{ padding: '12px 16px' }}
                      >
                        <Space direction="vertical" size={4}>
                          <Title level={4} style={{ margin: 0 }}>
                            {stat.value}
                          </Title>
                          <Text type="secondary">{stat.label}</Text>
                        </Space>
                      </Card>
                    ))}
                  </Space>
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
            <Col xs={24}>
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
