'use client';

import { ArrowRightOutlined, CheckCircleFilled, PlayCircleFilled } from '@ant-design/icons';
import { Badge, Button, Card, Col, Divider, List, Row, Space, Tag, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const stats = [
  { value: '35+', label: 'IT-профессий с готовой структурой вопросов' },
  { value: '12 000+', label: 'проверенных формулировок из свежих интервью' },
  { value: '200+', label: 'кратких ответов и источников для углубления' },
];

const journeySteps = [
  {
    title: 'Выбери роль',
    description: 'Собрали весь рынок: от Android до продуктовых аналитиков. Нужный профиль — в один клик.',
  },
  {
    title: 'Отсортируй важное',
    description: 'Поиск, фильтры по уровню, типу вопроса и этапу собеседования экономят часы подготовки.',
  },
  {
    title: 'Открой ответы',
    description: 'Каждый вопрос сопровождаем кратким планом ответа, мотивацией и ловушками.',
  },
  {
    title: 'Закрепи знания',
    description: 'Подборки follow-up вопросов, материалы для изучения и видео с реальными интервью.',
  },
];

const productHighlights = [
  {
    title: 'Готовая структура интервью',
    description:
      'Фактические формулировки, сгруппированные по этапам собеседования. Ты заранее знаешь, чего ждать на каждом шаге.',
  },
  {
    title: 'Частотность и шанс услышать',
    description:
      'Для каждого вопроса считаем актуальный шанс появления и динамику по неделям. Помогаем отбросить второстепенное.',
  },
  {
    title: 'Материалы для углубления',
    description:
      'Видео, статьи, блоги — в одном месте. Никаких бесконечных вкладок и поиска ответов на форумах.',
  },
];

const freePerks = [
  'Сетка профессий и быстрый переход к вопросам',
  '50 карточек вопросов на каждую роль',
  'Обзор частот и трендов без фильтров по компаниям',
];

const proPerks = [
  'Полный каталог вопросов и задач без ограничений',
  'Фильтры по компаниям, трендам и форматам интервью',
  'Доступ к подборкам для подготовки по уровням и темам',
  'Видеоответы и заметки экспертов в один клик',
];

const audiences = [
  {
    badge: 'Junior → Middle',
    title: 'Готовишься к первому переходу',
    description: 'Сфокусируйся на частых вопросах и собери уверенный план ответа.',
  },
  {
    badge: 'Middle → Senior',
    title: 'Выровнять софт и системный дизайн',
    description: 'Смотри follow-up вопросы и материалы, чтобы прокачать глубину и лидерские кейсы.',
  },
  {
    badge: 'Senior+',
    title: 'Хочешь больше офферов',
    description: 'Сравнивай требования компаний, готовься по сценариям и обновляй знания точечно.',
  },
];

const checklist = [
  'Профилируем роли по рынку СНГ и Европы',
  'Регулярно обновляем формулировки вопросов',
  'Добавляем свежие видео с интервью и разборы',
];

export default function LandingPage() {
  return (
    <div style={{ background: '#0f172a' }}>
      <Space direction="vertical" size={96} style={{ width: '100%' }}>
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.35), transparent 55%), #0f172a',
          }}
        >
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '120px 24px 100px' }}>
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={14}>
                <Space direction="vertical" size={32} style={{ width: '100%' }}>
                  <Tag color="purple" style={{ alignSelf: 'flex-start' }}>
                    Демодоступ уже открыт
                  </Tag>
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Title level={1} style={{ color: '#f8fafc', marginBottom: 0 }}>
                      Подготовься к собеседованию в IT быстрее, чем потратят вопрос
                    </Title>
                    <Paragraph style={{ color: '#cbd5f5', fontSize: 18, margin: 0 }}>
                      easyOffer собирает реальные вопросы из интервью, считает их частотность и подсказывает краткие ответы.
                      Ты видишь, что действительно спрашивают компании, и готовишься точечно.
                    </Paragraph>
                  </Space>
                  <Space size="middle" wrap>
                    <Button type="primary" size="large" href="/" icon={<ArrowRightOutlined />}>
                      Перейти к профессиям
                    </Button>
                    <Button size="large" href="/pro">
                      Узнать про Pro
                    </Button>
                  </Space>
                  <Space size={32} wrap>
                    {stats.map((item) => (
                      <Space key={item.label} direction="vertical" size={4} style={{ minWidth: 160 }}>
                        <Title level={3} style={{ margin: 0, color: '#f8fafc' }}>
                          {item.value}
                        </Title>
                        <Text style={{ color: '#cbd5f5' }}>{item.label}</Text>
                      </Space>
                    ))}
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={10}>
                <Card
                  style={{
                    borderRadius: 28,
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                  bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 24 }}
                >
                  <Space direction="vertical" size={8}>
                    <Text type="secondary" style={{ color: '#cbd5f5' }}>
                      Что увидишь в демо сегодня
                    </Text>
                    <Title level={3} style={{ margin: 0, color: '#f8fafc' }}>
                      50 топовых вопросов по каждой роли
                    </Title>
                  </Space>
                  <List
                    dataSource={checklist}
                    split={false}
                    renderItem={(item) => (
                      <List.Item style={{ padding: 0, border: 'none' }}>
                        <Space size={12} align="start">
                          <CheckCircleFilled style={{ color: '#34d399', marginTop: 4 }} />
                          <Text style={{ color: '#e2e8f0' }}>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                  <Card style={{ borderRadius: 20, background: 'rgba(99, 102, 241, 0.18)', border: 'none' }}>
                    <Space direction="vertical" size={8}>
                      <Text style={{ color: '#e0e7ff' }}>Не теряешь время на поиск формулировок</Text>
                      <Text type="secondary" style={{ color: '#cbd5f5' }}>
                        easyOffer обновляет базу каждую неделю и показывает свежие вопросы, которые звучали у кандидатов.
                      </Text>
                    </Space>
                  </Card>
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section style={{ background: '#f8fafc' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 24px' }}>
            <Space direction="vertical" size={32} style={{ width: '100%' }}>
              <Space direction="vertical" size={12} style={{ textAlign: 'center', width: '100%' }}>
                <Title level={2} style={{ margin: 0 }}>
                  Как easyOffer проводит через подготовку
                </Title>
                <Paragraph style={{ margin: 0, color: '#475569', fontSize: 18 }}>
                  От выбора роли до закрепления знаний — все шаги собраны в одном месте.
                </Paragraph>
              </Space>
              <Row gutter={[24, 24]}>
                {journeySteps.map((step, index) => (
                  <Col key={step.title} xs={24} sm={12} lg={6}>
                    <Card
                      style={{ borderRadius: 24, height: '100%', border: '1px solid #e2e8f0' }}
                      bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                    >
                      <Badge count={index + 1} style={{ backgroundColor: '#6366f1' }}>
                        <div />
                      </Badge>
                      <Space direction="vertical" size={8}>
                        <Title level={4} style={{ margin: 0 }}>
                          {step.title}
                        </Title>
                        <Paragraph style={{ margin: 0, color: '#475569' }}>{step.description}</Paragraph>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </div>
        </section>

        <section style={{ background: '#ffffff' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 24px' }}>
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={10}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Title level={2} style={{ margin: 0 }}>
                    Внутри уже собрано всё, чтобы приходить на интервью подготовленным
                  </Title>
                  <Paragraph style={{ color: '#475569', fontSize: 18, margin: 0 }}>
                    Сразу видишь частотность, шанс услышать вопрос, follow-up сценарии и материалы для повторения. Никаких
                    табличек и нескончаемых вкладок — только актуальные данные.
                  </Paragraph>
                  <Button type="primary" size="large" href="/">
                    Посмотреть демо роли
                  </Button>
                </Space>
              </Col>
              <Col xs={24} lg={14}>
                <Row gutter={[24, 24]}>
                  {productHighlights.map((feature) => (
                    <Col key={feature.title} xs={24} sm={12}>
                      <Card
                        style={{ borderRadius: 24, height: '100%', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                      >
                        <PlayCircleFilled style={{ fontSize: 28, color: '#6366f1' }} />
                        <Title level={4} style={{ margin: 0 }}>
                          {feature.title}
                        </Title>
                        <Paragraph style={{ margin: 0, color: '#475569' }}>{feature.description}</Paragraph>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </section>

        <section style={{ background: '#f1f5f9' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 24px' }}>
            <Space direction="vertical" size={32} style={{ width: '100%' }}>
              <Space direction="vertical" size={12} style={{ textAlign: 'center', width: '100%' }}>
                <Title level={2} style={{ margin: 0 }}>
                  Free или Pro — решаешь ты
                </Title>
                <Paragraph style={{ margin: 0, color: '#475569', fontSize: 18 }}>
                  Начни с демо и переходи на Pro, когда понадобится полный доступ.
                </Paragraph>
              </Space>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card
                    style={{ borderRadius: 28, height: '100%', border: '1px solid #cbd5f5', background: '#ffffff' }}
                    bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    <Space direction="vertical" size={8}>
                      <Tag color="geekblue">Free</Tag>
                      <Title level={3} style={{ margin: 0 }}>
                        Попробуй easyOffer без привязки карты
                      </Title>
                      <Text type="secondary">Открой структуру ролей и первые 50 вопросов на каждую.</Text>
                    </Space>
                    <List
                      dataSource={freePerks}
                      split={false}
                      renderItem={(perk) => (
                        <List.Item style={{ padding: 0, border: 'none' }}>
                          <Space size={12}>
                            <CheckCircleFilled style={{ color: '#22c55e' }} />
                            <Text>{perk}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                    <Button size="large" href="/">
                      Перейти к профессиям
                    </Button>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card
                    style={{
                      borderRadius: 28,
                      height: '100%',
                      border: '1px solid #6366f1',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    }}
                    bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    <Space direction="vertical" size={8}>
                      <Tag color="purple" style={{ alignSelf: 'flex-start' }}>
                        Pro (скоро)
                      </Tag>
                      <Title level={3} style={{ margin: 0, color: '#f8fafc' }}>
                        Подготовка без ограничений
                      </Title>
                      <Text type="secondary" style={{ color: '#e0e7ff' }}>
                        Сохраняй любимые вопросы, смотри тренды компаний и получай свежие подборки каждую неделю.
                      </Text>
                    </Space>
                    <List
                      dataSource={proPerks}
                      split={false}
                      renderItem={(perk) => (
                        <List.Item style={{ padding: 0, border: 'none' }}>
                          <Space size={12}>
                            <CheckCircleFilled style={{ color: '#bbf7d0' }} />
                            <Text style={{ color: '#f8fafc' }}>{perk}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                    <Button type="primary" size="large" href="/pro">
                      Стать первым в очереди
                    </Button>
                  </Card>
                </Col>
              </Row>
            </Space>
          </div>
        </section>

        <section style={{ background: '#ffffff' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 24px' }}>
            <Space direction="vertical" size={32} style={{ width: '100%' }}>
              <Space direction="vertical" size={12} style={{ textAlign: 'center', width: '100%' }}>
                <Title level={2} style={{ margin: 0 }}>
                  Кому особенно подходит easyOffer
                </Title>
                <Paragraph style={{ margin: 0, color: '#475569', fontSize: 18 }}>
                  Платформа помогает на каждом уровне карьеры.
                </Paragraph>
              </Space>
              <Row gutter={[24, 24]}>
                {audiences.map((persona) => (
                  <Col key={persona.title} xs={24} md={8}>
                    <Card
                      style={{ borderRadius: 24, height: '100%', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                      bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                    >
                      <Tag color="cyan" style={{ alignSelf: 'flex-start' }}>
                        {persona.badge}
                      </Tag>
                      <Title level={4} style={{ margin: 0 }}>
                        {persona.title}
                      </Title>
                      <Paragraph style={{ margin: 0, color: '#475569' }}>{persona.description}</Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </div>
        </section>

        <section style={{ background: '#0f172a' }}>
          <div style={{ maxWidth: 980, margin: '0 auto', padding: '96px 24px' }}>
            <Card
              style={{ borderRadius: 32, border: '1px solid rgba(148, 163, 184, 0.35)', background: 'rgba(15, 23, 42, 0.75)' }}
              bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'center' }}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Title level={2} style={{ margin: 0, color: '#f8fafc' }}>
                  Хочешь узнать, что спрашивают в твоей компании мечты?
                </Title>
                <Paragraph style={{ margin: 0, color: '#cbd5f5', fontSize: 18 }}>
                  Открой демо сегодня, а когда будешь готов — переходи на Pro и получай свежие подборки каждую неделю.
                </Paragraph>
              </Space>
              <Divider style={{ borderColor: 'rgba(148, 163, 184, 0.35)' }} />
              <Space size="middle" wrap style={{ justifyContent: 'center' }}>
                <Button type="primary" size="large" href="/" icon={<ArrowRightOutlined />}>
                  Перейти к профессиям
                </Button>
                <Button size="large" href="/pro">
                  Оформить Pro
                </Button>
              </Space>
            </Card>
          </div>
        </section>
      </Space>
    </div>
  );
}
