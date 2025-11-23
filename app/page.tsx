'use client';

import {
  ArrowRightOutlined,
  BulbOutlined,
  CheckCircleTwoTone,
  CompassOutlined,
  DatabaseOutlined,
  PlayCircleFilled,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { formatDate } from '@/lib/date';
import { POPULAR_COMPANIES } from '@/lib/popularCompanies';
import { roleGroups } from '@/lib/roles';
import { useDataContext } from '@/providers/DataProvider';

const { Title, Paragraph, Text } = Typography;

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

const Section = ({
  children,
  background,
  padding = '80px 0',
  id,
}: {
  children: React.ReactNode;
  background?: string;
  padding?: string;
  id?: string;
}) => (
  <div id={id} style={{ background: background ?? 'transparent' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: `0 24px`, paddingBlock: padding }}>
      {children}
    </div>
  </div>
);

const PainCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card
    style={{ borderRadius: 18, height: '100%', boxShadow: '0 16px 32px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}
    bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20 }}
  >
    <Space size={12} align="center">
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: 'rgba(37, 99, 235, 0.12)',
          display: 'grid',
          placeItems: 'center',
          color: '#1d4ed8',
        }}
      >
        {icon}
      </div>
      <Title level={4} style={{ margin: 0 }}>
        {title}
      </Title>
    </Space>
    <Paragraph style={{ margin: 0, color: '#475569' }}>{description}</Paragraph>
  </Card>
);

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <Card
    hoverable
    style={{ borderRadius: 18, height: '100%', border: '1px solid #e2e8f0', background: 'linear-gradient(180deg, #fff, #f8fafc)' }}
    bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}
  >
    <Space size={12} align="center">
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: 'rgba(16, 185, 129, 0.12)',
          display: 'grid',
          placeItems: 'center',
          color: '#16a34a',
        }}
      >
        {icon}
      </div>
      <Title level={4} style={{ margin: 0 }}>
        {title}
      </Title>
    </Space>
    <Paragraph style={{ margin: 0, color: '#475569' }}>{description}</Paragraph>
  </Card>
);

const HighlightStat = ({ label, value }: { label: string; value: string }) => (
  <Card
    bordered={false}
    style={{
      borderRadius: 18,
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.08))',
      boxShadow: '0 16px 40px rgba(37, 99, 235, 0.12)',
      height: '100%',
    }}
    bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}
  >
    <Title level={3} style={{ margin: 0 }}>
      {value}
    </Title>
    <Text style={{ color: '#1e293b' }}>{label}</Text>
  </Card>
);

const ProCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card
    hoverable
    style={{
      borderRadius: 18,
      height: '100%',
      background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.14), rgba(37, 99, 235, 0.06))',
      border: '1px solid #e0e7ff',
    }}
    bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20 }}
  >
    <Space size={12} align="center">
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(245, 158, 11, 0.14)',
          display: 'grid',
          placeItems: 'center',
          color: '#c2410c',
        }}
      >
        {icon}
      </div>
      <Title level={4} style={{ margin: 0 }}>
        {title}
      </Title>
    </Space>
    <Paragraph style={{ margin: 0, color: '#475569' }}>{description}</Paragraph>
  </Card>
);

const CompaniesPreview = () => {
  const slides = useMemo(() => {
    const result: (typeof POPULAR_COMPANIES)[] = [];
    for (let i = 0; i < POPULAR_COMPANIES.length; i += 8) {
      result.push(POPULAR_COMPANIES.slice(i, i + 8));
    }
    return result;
  }, []);
  const [selected, setSelected] = useState<(typeof POPULAR_COMPANIES)[number] | null>(null);

  return (
    <>
      <Carousel dots autoplay>
        {slides.map((companies, pageIndex) => (
          <div key={pageIndex}>
            <Row gutter={[16, 16]}>
              {companies.map((company, index) => {
                const initials = company.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();
                const accent = company.accent ?? gradients[index % gradients.length];

                return (
                  <Col key={company.name} xs={24} sm={12} lg={6}>
                    <Card
                      hoverable
                      onClick={() => setSelected(company)}
                      style={{
                        borderRadius: 18,
                        height: '100%',
                        border: '1px solid #e0e7ff',
                        boxShadow: '0 18px 32px rgba(31, 41, 55, 0.08)',
                        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                      }}
                      bodyStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        padding: 16,
                      }}
                    >
                      <Space size={14} align="center">
                        <Avatar
                          size={64}
                          src={company.logo}
                          style={{
                            background: accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Space direction="vertical" size={2} style={{ flex: 1 }}>
                          <Text strong style={{ fontSize: 18, lineHeight: 1.2 }}>
                            {company.name}
                          </Text>
                          <Text type="secondary">Предпросмотр бренда</Text>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        ))}
      </Carousel>

      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        title={selected ? `Фильтры по ${selected.name} — в Pro` : 'Фильтры по компаниям — в Pro'}
        footer={[
          <Button key="pro" type="primary" href="/pro">
            Оформить Pro
          </Button>,
          <Button key="close" onClick={() => setSelected(null)}>
            Закрыть
          </Button>,
        ]}
      >
        <Space size={16} align="start">
          <Avatar
            size={56}
            src={selected?.logo}
            style={{
              background: selected?.accent ?? gradients[0],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {selected?.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </Avatar>
          <Space direction="vertical" size={8} style={{ maxWidth: 420 }}>
            <Paragraph style={{ margin: 0 }}>
              Сравнивайте, что спрашивают в {selected?.name ?? 'компаниях'}, выбирайте формат интервью и отслеживайте,
              какие темы растут быстрее всего. Полные фильтры и подборки доступны после оформления Pro.
            </Paragraph>
            <Text type="secondary">Демо-версия показывает только предпросмотр брендов без переходов внутрь.</Text>
          </Space>
        </Space>
      </Modal>
    </>
  );
};

export default function HomePage() {
  const { bundle, lastUpdated } = useDataContext();

  const grouped = useMemo(() => {
    const roles = new Map(bundle.roles.map((role) => [role.slug, role]));
    const used = new Set<string>();
    const mapped = roleGroups.map((group) => ({
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
        roles: extras,
      });
    }
    return mapped;
  }, [bundle.roles]);

  return (
    <div style={{ background: 'transparent' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #0ea5e9 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 32%)',
          }}
        />
        <Section padding="88px 0 72px">
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} lg={14}>
              <Space direction="vertical" size={22} style={{ width: '100%' }}>
                <Badge color="#fbbf24" text="Собеседования перестают быть лотереей" style={{ background: '#111827' }} />
                <Title level={1} style={{ color: '#fff', margin: 0, lineHeight: 1.2 }}>
                  Подготовься к 80% вероятных вопросов и получи оффер быстрее
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.78)', fontSize: 18, margin: 0 }}>
                  Easy Offer собирает реальные вопросы из свежих собеседований и показывает, что спросит интервьюер
                  именно по твоей роли. Получай карту подготовки вместо хаотичных списков.
                </Paragraph>
                <Space size={[12, 12]} wrap>
                  <Button
                    type="primary"
                    size="large"
                    href="/landing"
                    style={{
                      borderRadius: 999,
                      paddingInline: 20,
                      height: 48,
                      background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                      border: 'none',
                      boxShadow: '0 20px 40px rgba(249, 115, 22, 0.4)',
                    }}
                    icon={<ArrowRightOutlined />}
                  >
                    Начать подготовку
                  </Button>
                  <Button
                    size="large"
                    href="/pro"
                    icon={<PlayCircleFilled />}
                    style={{
                      borderRadius: 999,
                      height: 48,
                      paddingInline: 18,
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: '#fff',
                      background: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    Посмотреть PRO
                  </Button>
                </Space>
                <Space direction="vertical" size={12}>
                  <Space size={10} wrap>
                    <CheckCircleTwoTone twoToneColor="#22c55e" />
                    <Text style={{ color: '#e2e8f0' }}>80% вероятных вопросов — в одном месте</Text>
                  </Space>
                  <Space size={10} wrap>
                    <CheckCircleTwoTone twoToneColor="#22c55e" />
                    <Text style={{ color: '#e2e8f0' }}>Фокус на топ-темах без устаревших материалов</Text>
                  </Space>
                  <Space size={10} wrap>
                    <CheckCircleTwoTone twoToneColor="#22c55e" />
                    <Text style={{ color: '#e2e8f0' }}>Видео-разборы и AI-интервьюер в PRO</Text>
                  </Space>
                </Space>
              </Space>
            </Col>
            <Col xs={24} lg={10}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.08)',
                  padding: 12,
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                }}
                bodyStyle={{ padding: 12 }}
              >
                <Row gutter={[12, 12]}>
                  {[
                    { value: '≈\u00a03\u00a0000', hint: 'Реальных собеседований' },
                    { value: '300\u00a0000+', hint: 'Вопросов и ответов' },
                    { value: '100+', hint: 'Компаний' },
                    { value: formatDate(lastUpdated), hint: 'Обновили' },
                  ].map((stat) => (
                    <Col key={stat.value} span={12}>
                      <Card
                        bordered={false}
                        style={{
                          borderRadius: 16,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                          height: '100%',
                        }}
                        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 16 }}
                      >
                        <Title level={2} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>
                          {stat.value}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>{stat.hint}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </Section>
      </div>

      <Section>
        <Space direction="vertical" size={32} style={{ width: '100%' }}>
          <Space direction="vertical" size={12} style={{ maxWidth: 720 }}>
            <Title level={2} style={{ margin: 0 }}>
              Почему подготовка к интервью кажется хаосом
            </Title>
            <Paragraph style={{ margin: 0 }}>
              Мы собрали главные боли кандидатов и превратили их в четкие сценарии подготовки. Каждый пункт —
              акцентированный, понятный и с визуальным маркером.
            </Paragraph>
          </Space>
          <Row gutter={[20, 20]}>
            <Col xs={24} md={12} lg={8}>
              <PainCard
                title="Хаос материалов"
                description="Десятки вкладок, курсов и GitHub-списков. В итоге — разрозненные конспекты и ощущение лотереи."
                icon={<CompassOutlined />}
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <PainCard
                title="Неясно, что важнее"
                description="Тратишь недели на редкие темы, а на интервью спрашивают другое. Нет карты приоритетов и частот."
                icon={<DatabaseOutlined />}
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <PainCard
                title="Сложно держать фокус"
                description="Без системы теряется мотивация: непонятно, сколько осталось и какие пробелы закрыть первыми."
                icon={<ThunderboltOutlined />}
              />
            </Col>
          </Row>
        </Space>
      </Section>

      <Section background="#ffffff">
        <Space direction="vertical" size={28} style={{ width: '100%' }}>
          <Space direction="vertical" size={10} style={{ maxWidth: 760 }}>
            <Title level={2} style={{ margin: 0 }}>
              Easy Offer превращает подготовку в систему
            </Title>
            <Paragraph style={{ margin: 0 }}>
              Актуальные вопросы, визуальная карта тем и тренажеры — всё в едином интерфейсе, чтобы вы готовились к
              тому, что действительно спросят.
            </Paragraph>
          </Space>
          <Row gutter={[20, 20]}>
            <Col xs={24} md={12} lg={6}>
              <FeatureCard
                title="Актуальные вопросы"
                description="Собираем реальные вопросы по ролям, грейдам и компаниям за последние месяцы."
                icon={<BulbOutlined />}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <FeatureCard
                title="Анализ частоты"
                description="Вы видите, что спрашивают чаще всего: фокус на 20% тем, дающих 80% результата."
                icon={<DatabaseOutlined />}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <FeatureCard
                title="Практика с AI"
                description="PRO-режим включает симуляцию интервью с AI и видео-разборы ответов кандидатов."
                icon={<PlayCircleFilled />}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <FeatureCard
                title="Личная карта"
                description="Готовая карта подготовки: видны пробелы, прогресс и темы, которые нужно повторить."
                icon={<TrophyOutlined />}
              />
            </Col>
          </Row>
        </Space>
      </Section>

      <Section>
        <Space direction="vertical" size={28} style={{ width: '100%' }}>
          <Space direction="vertical" size={12}>
            <Title level={2} style={{ margin: 0 }}>
              Роли и дорожные карты
            </Title>
            <Paragraph style={{ margin: 0, maxWidth: 720 }}>
              Выбирайте роль и сразу переходите к вопросам с наибольшей вероятностью на интервью.
            </Paragraph>
          </Space>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {grouped.map((group, key) => (
              <Space key={key} direction="vertical" size={16} style={{ width: '100%' }}>
                <Divider style={{ margin: 0 }} />
                <Row gutter={[20, 20]}>
                  {group.roles.map((role, index) => (
                    <Col key={role.slug} xs={24} sm={12} lg={8}>
                      <Link href={`/roles/${role.slug}`} style={{ textDecoration: 'none' }}>
                        <Card
                          hoverable
                          style={{ borderRadius: 20, overflow: 'hidden', height: '100%', border: '1px solid #e2e8f0' }}
                          bodyStyle={{
                            padding: 24,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            minHeight: 210,
                            background: gradients[index % gradients.length],
                            color: '#fff',
                          }}
                        >
                          <Title level={4} style={{ color: '#fff', margin: 0 }}>
                            {role.name}
                          </Title>
                          <Text style={{ color: 'rgba(255,255,255,0.82)' }}>
                            Топ вопросов, свежие частоты и краткие ответы по роли
                          </Text>
                          <Space size="small" style={{ marginTop: 'auto', color: '#fff' }}>
                            <Text strong style={{ color: '#fff' }}>
                              Перейти к вопросам
                            </Text>
                            <ArrowRightOutlined />
                          </Space>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Space>
            ))}
          </Space>
        </Space>
      </Section>

      <Section background="#ffffff">
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col>
              <Space direction="vertical" size={8}>
                <Title level={3} style={{ margin: 0 }}>
                  Популярные компании
                </Title>
                <Text type="secondary">
                  Фильтруйте вопросы по компаниям и сравнивайте тренды. В демо — предпросмотр брендов.
                </Text>
              </Space>
            </Col>
            <Col>
              <Tag color="blue" style={{ borderRadius: 999, paddingInline: 12 }}>
                Обновлено {formatDate(lastUpdated)}
              </Tag>
            </Col>
          </Row>
          <CompaniesPreview />
        </Space>
      </Section>

      <Section>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col>
              <Space direction="vertical" size={8}>
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
                      style={{
                        borderRadius: 16,
                        minWidth: 220,
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                      }}
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
                            <Card
                              hoverable
                              style={{ borderRadius: 24, height: '100%' }}
                              bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0 }}
                            >
                              <div
                                style={{
                                  height: 160,
                                  borderRadius: 16,
                                  background: video.background
                                    ? videoBackgrounds[video.background]
                                    : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                  display: 'grid',
                                  placeItems: 'center',
                                  color: '#fff',
                                }}
                              >
                                <PlayCircleFilled style={{ fontSize: 32 }} />
                              </div>
                              <Space direction="vertical" size={8} style={{ padding: 16, width: '100%' }}>
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
      </Section>

      <Section background="#0f172a">
        <Space direction="vertical" size={26} style={{ width: '100%' }}>
          <Space direction="vertical" size={10} align="center" style={{ width: '100%', textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0, color: '#fff' }}>
              Что даёт PRO-версия
            </Title>
            <Paragraph style={{ margin: 0, color: 'rgba(226, 232, 240, 0.85)', maxWidth: 760 }}>
              Усильте подготовку: открывайте все частоты, тренируйтесь с AI-интервьюером и смотрите видео-ответы.
            </Paragraph>
          </Space>
          <Row gutter={[20, 20]}>
            <Col xs={24} md={12} lg={6}>
              <ProCard
                title="Полная база вопросов"
                description=">1000 вопросов с фильтрами по компаниям, ролям, грейдам и свежести."
                icon={<DatabaseOutlined />}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <ProCard
                title="Видео-разборы"
                description="Подробные видео-ответы и таймкоды, чтобы быстро собрать шпаргалку."
                icon={<PlayCircleFilled />}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <ProCard
                title="AI-интервьюер"
                description="Практика в формате реального диалога: вопросы, уточнения и обратная связь."
                icon={<ThunderboltOutlined />}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <ProCard
                title="Прогресс и теги"
                description="Отмечайте изученное, собирайте избранное и следите за готовностью по темам."
                icon={<TrophyOutlined />}
              />
            </Col>
          </Row>
          <Space align="center" direction="vertical" style={{ width: '100%', marginTop: 12 }}>
            <Space size={12} wrap align="center" justify="center">
              <HighlightStat value="7 дней" label="Бесплатный тест-драйв PRO" />
              <HighlightStat value="80%" label="вероятных вопросов собраны в одном месте" />
              <HighlightStat value="20 мин" label="на готовый план подготовки" />
            </Space>
            <Button
              type="primary"
              size="large"
              href="/pro"
              style={{
                borderRadius: 999,
                paddingInline: 24,
                height: 50,
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                border: 'none',
              }}
            >
              Перейти на PRO
            </Button>
          </Space>
        </Space>
      </Section>

      <Section background="#ffffff">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={14}>
            <Space direction="vertical" size={16}>
              <Badge color="#22c55e" text="Прозрачно и безопасно" />
              <Title level={3} style={{ margin: 0 }}>
                Юридическая прозрачность и поддержка
              </Title>
              <Paragraph style={{ margin: 0, color: '#475569' }}>
                Перед стартом убедитесь, что понимаете условия использования и как мы бережно работаем с данными.
                Наши документы доступны всегда, а команда поддержки отвечает в течение одного рабочего дня.
              </Paragraph>
              <Space direction="vertical" size={8}>
                <Link href="/terms">Документ об оферте</Link>
                <Link href="/policy">Политика конфиденциальности</Link>
              </Space>
            </Space>
          </Col>
          <Col xs={24} lg={10}>
            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                background: 'linear-gradient(135deg, #2563eb0f, #22c55e0f)',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
              }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Нужна помощь?
              </Title>
              <Paragraph style={{ margin: 0, color: '#475569' }}>
                Напишите нам о своих целях подготовки — подскажем, с чего начать и как использовать PRO-версии на
                максимум.
              </Paragraph>
              <Button type="primary" href="/landing" icon={<ArrowRightOutlined />} style={{ borderRadius: 12 }}>
                Связаться
              </Button>
            </Card>
          </Col>
        </Row>
      </Section>
    </div>
  );
}
