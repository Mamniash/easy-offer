'use client';

import { CheckCircleFilled, LockFilled, PlayCircleFilled } from '@ant-design/icons';
import type { InputRef } from 'antd/es/input';
import { Breadcrumb, Button, Card, Col, Input, List, Modal, Row, Segmented, Select, Space, Tag, Tooltip, Typography } from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';

import LogoAvatar from '@/components/LogoAvatar';
import { POPULAR_COMPANIES } from '@/lib/popularCompanies';
import { useDataContext } from '@/providers/DataProvider';
import { useFreeAccess } from '@/providers/FreeAccessProvider';
import type { QuestionRecord } from '@/types';

const { Title, Text, Paragraph } = Typography;

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
  const headers: Array<keyof QuestionRecord> = [
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
        const value = item[header];
        if (Array.isArray(value)) {
          return `"${value.join('|').replace(/"/g, '""')}"`;
        }
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (typeof value === 'number') {
          return value.toString();
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
  const searchRef = useRef<InputRef>(null);
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
      if (event.key === '/' && document.activeElement !== searchRef.current?.input) {
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

    const aggregated = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, mentions]) => {
        const preset = POPULAR_COMPANIES.find((company) => company.name === name);
        return {
          name,
          mentions,
          accent: preset?.accent,
          logo: preset?.logo,
        };
      })
      .slice(0, 12);

    if (aggregated.length > 0) {
      return aggregated;
    }

    return POPULAR_COMPANIES.slice(0, 12).map((company) => ({
      name: company.name,
      mentions: company.mentions,
      accent: company.accent,
      logo: company.logo,
    }));
  }, [questions]);

const proMorePerks = [
  'Полный список вопросов и задач по роли',
  'Фильтры по компаниям, трендам и уровням',
  'Подборки follow-up и заметки экспертов',
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

  return (
    <div style={{ background: '#f5f5f5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/">Профессии</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{role.name}</Breadcrumb.Item>
          </Breadcrumb>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Title level={2} style={{ margin: 0 }}>
              Вопросы на собеседовании на {role.name}
            </Title>
            <Text type="secondary">Free-лимит: {limit - remaining}/{limit} использовано · Осталось {remaining}</Text>
          </Card>

          <Row gutter={[24, 24]} align="start">
            <Col xs={24} lg={16}>
              <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Space direction="vertical" size={8}>
                  <Title level={4} style={{ margin: 0 }}>
                    Топ вопросов по роли
                  </Title>
                  <Text type="secondary">
                    Открываем первые 50 карточек, чтобы ты увидел структуру и формат ответов.
                  </Text>
                </Space>
                {isLoading ? (
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} style={{ borderRadius: 20 }} loading />
                    ))}
                  </Space>
                ) : visible.length === 0 ? (
                  <Card style={{ borderRadius: 20, background: '#f5f5f5' }}>
                    <Space direction="vertical" size={12}>
                      <Text strong>По таким фильтрам ничего не нашли.</Text>
                      <Button
                        onClick={() => {
                          setLevel('all');
                          setType('all');
                          setStage('all');
                          setQuery('');
                        }}
                      >
                        Сбросить фильтры
                      </Button>
                    </Space>
                  </Card>
                ) : (
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {visible.map((question, index) => {
                      const palette = companyPalette[index % companyPalette.length];
                      const videoCount = question.answerVariants.filter((variant) => variant.source === 'youtube').length;
                      const totalMentions = question.weeklyMentions.reduce((acc, value) => acc + value, 0);
                      const frequencyPercent = Math.min(Math.round(question.frequencyScore), 100);
                      return (
                        <Card
                          key={question.id}
                          hoverable
                          style={{
                            borderRadius: 24,
                            border: '1px solid #e0e7ff',
                            boxShadow: '0 18px 40px rgba(99, 102, 241, 0.08)',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleQuestionClick(question)}
                          bodyStyle={{ padding: 20 }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 24,
                              alignItems: 'stretch',
                            }}
                          >
                            <Space size={16} align="center">
                              <Tooltip title={`Частота ${formatPercent(question.frequencyScore)}`}>
                                <div
                                  style={{
                                    width: 14,
                                    height: 64,
                                    borderRadius: 999,
                                    background: '#e0e7ff',
                                    position: 'relative',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      height: `${frequencyPercent}%`,
                                      background: `linear-gradient(180deg, ${palette[0]}, ${palette[1]})`,
                                    }}
                                  />
                                </div>
                              </Tooltip>
                              <Space direction="vertical" size={0}>
                                <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>
                                  Шанс услышать
                                </Text>
                                <Text style={{ fontSize: 28, fontWeight: 600 }}>
                                  {formatPercent(question.chance)}
                                </Text>
                              </Space>
                            </Space>

                            <div
                              style={{
                                flex: '1 1 320px',
                                minWidth: 240,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                              }}
                            >
                              <Text strong style={{ fontSize: 18, lineHeight: 1.3 }}>
                                {question.title}
                              </Text>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                <Tag bordered={false} color="geekblue">
                                  {LEVEL_LABELS[question.level]}
                                </Tag>
                                <Tag bordered={false} color="purple">
                                  {TYPE_LABELS[question.type]}
                                </Tag>
                                <Tag bordered={false} color="cyan">
                                  {STAGE_LABELS[question.interviewStage]}
                                </Tag>
                                {question.tags.slice(0, 3).map((tag) => (
                                  <Tag key={tag} bordered={false}>
                                    #{tag}
                                  </Tag>
                                ))}
                              </div>
                              <Text type="secondary">
                                Follow-up: {question.followUps.length ? question.followUps.slice(0, 2).join(', ') : 'не указаны'}
                              </Text>
                            </div>

                            <Space
                              direction="vertical"
                              size={8}
                              style={{ minWidth: 200, flex: '0 1 200px', marginLeft: 'auto', alignItems: 'flex-end' }}
                            >
                              <Space size={8} align="center">
                                <PlayCircleFilled style={{ color: '#6366f1' }} />
                                <Text type="secondary">
                                  {videoCount} видео · {question.answerVariants.length} материалов
                                </Text>
                              </Space>
                              <Text type="secondary">≈ {formatNumber(totalMentions)} упоминаний за 4 недели</Text>
                            </Space>
                          </div>
                        </Card>
                      );
                    })}
                  </Space>
                )}

                {hasMore && (
                  <Card
                    style={{
                      borderRadius: 28,
                      border: '1px solid #c7d2fe',
                      background: '#eef2ff',
                    }}
                    bodyStyle={{ padding: 28 }}
                  >
                    <Row gutter={[24, 24]} align="middle">
                      <Col xs={24} md={16}>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                          <Title level={4} style={{ margin: 0, color: '#312e81' }}>
                            Доступно {visible.length} вопросов из {filtered.length}
                          </Title>
                          <Text type="secondary" style={{ color: '#4338ca' }}>
                            Оформи Pro, чтобы раскрыть весь каталог, получить задачи и сохранить любимые карточки.
                          </Text>
                          <List
                            dataSource={proMorePerks}
                            split={false}
                            renderItem={(perk) => (
                              <List.Item style={{ padding: 0, border: 'none' }}>
                                <Space size={12}>
                                  <CheckCircleFilled style={{ color: '#10b981' }} />
                                  <Text style={{ color: '#312e81' }}>{perk}</Text>
                                </Space>
                              </List.Item>
                            )}
                          />
                        </Space>
                      </Col>
                      <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                          <Text type="secondary" style={{ color: '#4338ca' }}>
                            Ещё {filtered.length - visible.length} вопросов ждут тебя внутри.
                          </Text>
                          <Button type="primary" size="large" href="/pro">
                            Оформить Pro
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                )}

                <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Наверх</Button>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Space direction="vertical" size={0}>
                      <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>
                        Фильтры
                      </Text>
                      <Title level={4} style={{ margin: 0 }}>
                        Найди вопросы быстрее
                      </Title>
                    </Space>
                    <Segmented
                      options={Object.entries(LEVEL_LABELS).map(([value, label]) => ({ value, label }))}
                      value={level}
                      onChange={(value) => setLevel(value as typeof level)}
                    />
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Text type="secondary">Тип собеседования</Text>
                      <Select
                        value={stage}
                        onChange={(value) => setStage(value as typeof stage)}
                        options={Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label }))}
                        style={{ width: '100%' }}
                      />
                    </Space>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Text type="secondary">Тип вопроса</Text>
                      <Select
                        value={type}
                        onChange={(value) => setType(value as typeof type)}
                        options={Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))}
                        style={{ width: '100%' }}
                      />
                    </Space>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Text type="secondary">Поиск</Text>
                      <Input
                        ref={searchRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="/ — перейти к поиску"
                      />
                    </Space>
                  </Space>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        <Tag color="geekblue">Найдено {filtered.length}</Tag>
                        <Tag color="purple">Показываем {visible.length} из {filtered.length}</Tag>
                      </Space>
                    </Col>
                    <Col>
                      <Button onClick={handleExport}>Экспорт 50 вопросов</Button>
                    </Col>
                  </Row>
                </Card>

                <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>
                        Популярные компании
                      </Text>
                    </Col>
                    <Col>
                      <Tag icon={<LockFilled />} color="purple">
                        Pro
                      </Tag>
                    </Col>
                  </Row>
                  <Text type="secondary">
                    Смотрим, какие бренды чаще упоминают такие вопросы на интервью.
                  </Text>
                  <Space direction="vertical" size={12}>
                    {popularCompanies.map((company, index) => {
                      const palette = company.accent
                        ? [company.accent, company.accent]
                        : companyPalette[index % companyPalette.length];
                      return (
                        <Card
                          key={company.name}
                          hoverable
                          onClick={handleCompanyClick}
                          style={{ borderRadius: 20 }}
                          bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                        >
                          <Space size={12}>
                            <LogoAvatar
                              name={company.name}
                              logo={company.logo}
                              background={`linear-gradient(135deg, ${palette[0]}, ${palette[1]})`}
                              size={48}
                              textColor="#fff"
                            />
                            <Space direction="vertical" size={0}>
                              <Text strong>{company.name}</Text>
                              <Text type="secondary">≈ {formatNumber(company.mentions)} упоминаний за 4 недели</Text>
                            </Space>
                          </Space>
                          <Tag icon={<LockFilled />} color="purple">
                            Pro
                          </Tag>
                        </Card>
                      );
                    })}
                  </Space>
                  <Card style={{ borderRadius: 16, background: '#f8fafc' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      В подписке появятся фильтры по брендам, графики трендов и подборки вопросов по каждому работодателю.
                    </Text>
                  </Card>
                </Card>
              </Space>
            </Col>
          </Row>

          <Card style={{ borderRadius: 24 }}>
            <Text type="secondary">Горячая клавиша «/» мгновенно фокусирует поиск по вопросам.</Text>
          </Card>
        </Space>
      </div>

      <Modal
        open={!!proPrompt}
        title={proPrompt?.title}
        onCancel={() => setProPrompt(null)}
        footer={[
          <Button key="pro" type="primary" href="/pro">
            Оформить Pro
          </Button>,
          <Button key="close" onClick={() => setProPrompt(null)}>
            Понятно
          </Button>,
        ]}
      >
        <Paragraph>{proPrompt?.description}</Paragraph>
      </Modal>
    </div>
  );
}
