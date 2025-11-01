'use client';

import { LockFilled, PlayCircleFilled, StarFilled } from '@ant-design/icons';
import type { InputRef } from 'antd/es/input';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Input,
  Modal,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';

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
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [questions]);

  const navSections = [
    { label: 'Вопросы', active: true },
    { label: 'Задачи', active: false },
    { label: 'Требования', active: false },
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

  const handleShowMore = () => {
    setProPrompt({
      title: 'Весь каталог в Pro',
      description: 'Мы показываем первые 50 вопросов, чтобы ты понял структуру. Подпишись на Pro, чтобы открыть полный список и доступ к задачам.',
    });
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

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {navSections.map((section) => (
                  <Button key={section.label} type={section.active ? 'primary' : 'default'} block disabled={!section.active}>
                    {section.label}
                  </Button>
                ))}
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Остальные разделы появятся в Pro-версии.
                </Text>
              </Card>
            </Col>
            <Col xs={24} lg={18}>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Segmented
                    options={Object.entries(LEVEL_LABELS).map(([value, label]) => ({ value, label }))}
                    value={level}
                    onChange={(value) => setLevel(value as typeof level)}
                  />
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={8}>
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Text type="secondary">Тип собеседования</Text>
                        <Select
                          value={stage}
                          onChange={(value) => setStage(value as typeof stage)}
                          options={Object.entries(STAGE_LABELS).map(([value, label]) => ({ value, label }))}
                          style={{ width: '100%' }}
                        />
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Text type="secondary">Тип вопроса</Text>
                        <Select
                          value={type}
                          onChange={(value) => setType(value as typeof type)}
                          options={Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))}
                          style={{ width: '100%' }}
                        />
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Text type="secondary">Поиск</Text>
                        <Input
                          ref={searchRef}
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="/ — перейти к поиску"
                        />
                      </Space>
                    </Col>
                  </Row>
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

                <Row gutter={[24, 24]}>
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
                            <Button onClick={() => {
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
                            return (
                              <Card
                                key={question.id}
                                hoverable
                                style={{ borderRadius: 24 }}
                                onClick={() => handleQuestionClick(question)}
                                bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                              >
                                <Row align="middle" justify="space-between" gutter={[12, 12]}>
                                  <Col>
                                    <Space align="center" size={16}>
                                      <Avatar
                                        size={48}
                                        style={{
                                          background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                        icon={<StarFilled />}
                                      />
                                      <Space direction="vertical" size={0}>
                                        <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>
                                          Шанс услышать вопрос
                                        </Text>
                                        <Title level={4} style={{ margin: 0 }}>
                                          {formatPercent(question.chance)}
                                        </Title>
                                      </Space>
                                    </Space>
                                  </Col>
                                  <Col>
                                    <Space size={8} wrap>
                                      <Tag color="geekblue">{LEVEL_LABELS[question.level]}</Tag>
                                      <Tag color="purple">{TYPE_LABELS[question.type]}</Tag>
                                      <Tag color="cyan">{STAGE_LABELS[question.interviewStage]}</Tag>
                                    </Space>
                                  </Col>
                                </Row>
                                <Title level={5} style={{ margin: 0 }}>
                                  {question.title}
                                </Title>
                                <Row align="middle" gutter={[16, 16]}>
                                  <Col xs={24} md={12}>
                                    <Space align="center" size={12} style={{ width: '100%' }}>
                                      <Tooltip title="Частота вопроса в потоке собеседований">
                                        <Progress
                                          percent={Math.min(question.frequencyScore, 100)}
                                          showInfo={false}
                                          strokeColor="#6366F1"
                                          style={{ flex: 1 }}
                                        />
                                      </Tooltip>
                                      <Text strong>Частота {formatPercent(question.frequencyScore)}</Text>
                                    </Space>
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <Space size={8} align="center">
                                      <PlayCircleFilled style={{ color: '#6366f1' }} />
                                      <Text type="secondary">
                                        {videoCount} видео · {question.answerVariants.length} материалов
                                      </Text>
                                    </Space>
                                  </Col>
                                </Row>
                              </Card>
                            );
                          })}
                        </Space>
                      )}

                      {hasMore && (
                        <Card
                          style={{
                            borderRadius: 24,
                            borderStyle: 'dashed',
                            borderColor: '#c7d2fe',
                            background: '#eef2ff',
                          }}
                        >
                          <Row align="middle" gutter={[16, 16]}>
                            <Col flex="auto">
                              <Space direction="vertical" size={4}>
                                <Title level={5} style={{ margin: 0, color: '#4c1d95' }}>
                                  Ещё {filtered.length - visible.length} вопросов ждут в Pro
                                </Title>
                                <Text type="secondary">
                                  Полный каталог, фильтры по компаниям и подборки задач станут доступны сразу после оформления.
                                </Text>
                              </Space>
                            </Col>
                            <Col>
                              <Button type="primary" onClick={handleShowMore}>
                                Оформить Pro
                              </Button>
                            </Col>
                          </Row>
                        </Card>
                      )}

                      <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Наверх</Button>
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
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
                        {popularCompanies.map(([company, mentions], index) => {
                          const palette = companyPalette[index % companyPalette.length];
                          return (
                            <Card
                              key={company}
                              hoverable
                              onClick={handleCompanyClick}
                              style={{ borderRadius: 20 }}
                              bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                            >
                              <Space size={12}>
                                <Avatar
                                  size={48}
                                  style={{
                                    background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {company
                                    .split(' ')
                                    .map((part) => part[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </Avatar>
                                <Space direction="vertical" size={0}>
                                  <Text strong>{company}</Text>
                                  <Text type="secondary">≈ {formatNumber(mentions)} упоминаний за 4 недели</Text>
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
                  </Col>
                </Row>
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
