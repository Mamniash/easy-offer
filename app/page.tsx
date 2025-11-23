'use client';

import { ArrowRightOutlined, LockFilled, PlayCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Card, Carousel, Col, Divider, Modal, Row, Space, Tag, Typography } from 'antd';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { formatDate } from '@/lib/date';
import { POPULAR_COMPANIES } from '@/lib/popularCompanies';
import { roleGroups } from '@/lib/roles';
import { useDataContext } from '@/providers/DataProvider';

const { Title, Paragraph, Text } = Typography;

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

const formatNumber = (value: number) => new Intl.NumberFormat('ru-RU').format(Math.round(value));

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
  const slides = useMemo(() => chunkArray(POPULAR_COMPANIES, 8), []);
  const [selected, setSelected] = useState<typeof POPULAR_COMPANIES[number] | null>(null);

  return (
    <>
      <Carousel dots>
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
                        borderRadius: 20,
                        height: '100%',
                        border: '1px solid #e0e7ff',
                        boxShadow: '0 18px 32px rgba(31, 41, 55, 0.08)',
                        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                      }}
                      bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}
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
                          <Text type="secondary">≈ {formatNumber(company.mentions)} упоминаний за 4 недели</Text>
                        </Space>
                      </Space>
                      <Space align="center" justify="space-between">
                        <Tag color="purple" icon={<LockFilled />}>Pro</Tag>
                        <Text style={{ color: '#6366f1', fontWeight: 600 }}>Смотреть тренды</Text>
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
        title={
          selected
            ? `Фильтры по ${selected.name} — в Pro`
            : 'Фильтры по компаниям — в Pro'
        }
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
              Сравнивайте, что спрашивают в {selected?.name ?? 'компаниях'}, выбирайте формат интервью и отслеживайте, какие
              темы растут быстрее всего. Полные фильтры и подборки доступны после оформления Pro.
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
                <Space direction="vertical" size={20} style={{ width: '100%' }}>
                  <Title level={1} style={{ color: '#fff', margin: 0 }}>
                    Подготовься к собеседованию так, как будто ты уже внутри команды мечты
                  </Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18 }}>
                    Частотные вопросы и реальные ответы по десяткам ролей. Показываем, что спрашивают прямо сейчас,
                    чтобы ты готовился по делу.
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
                      value: '≈\u00a03\u00a0000',
                      hint: 'реальных собеседований',
                    },
                    {
                      label: 'Разобрали',
                      value: '300\u00a0000+',
                      hint: 'вопросов и ответов',
                    },
                    {
                      label: 'Следим за',
                      value: '100+\u00a0компаний',
                      hint: 'и\u00a0форматов интервью',
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
                          <Title level={2} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>
                            {stat.value}
                          </Title>
                          <Text style={{ color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>{stat.hint}</Text>
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
                  <Text type="secondary">
                    Заходите внутрь конкретной компании и смотрите, какие темы спрашивают именно там. В демо — только предпросмотр
                    брендов.
                  </Text>
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
