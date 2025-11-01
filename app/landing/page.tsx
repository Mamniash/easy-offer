'use client';

import { Button, Card, Col, List, Row, Space, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const steps = [
  {
    title: 'Выбери профессию',
    description: 'Собрали ключевые IT-роли в аккуратную сетку. Нужный профиль — в один клик.',
  },
  {
    title: 'Посмотри частые вопросы',
    description: 'Мы ранжируем вопросы по фактической частоте. Вверху — то, что звучит чаще всего.',
  },
  {
    title: 'Открой краткие ответы',
    description: 'Каждый вопрос сопровождаем кратким планом ответа, мотивацией и ловушками.',
  },
  {
    title: 'Подготовься точечно',
    description: 'Фильтры по уровню, типу и поиск по тегам экономят часы подготовки.',
  },
];

const freePerks = [
  'Сетка профессий и быстрый переход к вопросам',
  '20 раскрытий вопросов в сутки',
  'Обзор частот и трендов без разблокировки компаний',
];

const proPerks = [
  'Безлимитные раскрытия и быстрый просмотр ответов',
  'Фильтры по компаниям и их трендам',
  'Расширенный блок похожих вопросов и подборки',
];

export default function LandingPage() {
  return (
    <div style={{ background: '#f5f5f5' }}>
      <Space direction="vertical" size={64} style={{ width: '100%' }}>
        <section
          style={{
            background: '#ffffff',
            padding: '96px 0 80px',
          }}
        >
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                easyOffer demo
              </Text>
              <Title level={1} style={{ margin: 0 }}>
                Получить оффер быстрее: актуальные вопросы собеседований по твоей специальности
              </Title>
              <Paragraph style={{ fontSize: 18, color: '#595959', margin: 0 }}>
                Мы собрали десятки IT-ролей, частотность вопросов и краткие ответы, чтобы подготовка стала точечной. Демо
                ограничено, но уже помогает сфокусироваться на том, что действительно спрашивают.
              </Paragraph>
              <Space size="middle" wrap style={{ justifyContent: 'center' }}>
                <Button type="primary" size="large" href="/">
                  Перейти к профессиям
                </Button>
                <Button type="default" size="large" href="/pro">
                  Стать Pro
                </Button>
              </Space>
            </Space>
          </div>
        </section>

        <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <Card style={{ borderRadius: 24 }} bodyStyle={{ padding: 32 }}>
            <Row gutter={[24, 24]}>
              {steps.map((step) => (
                <Col key={step.title} xs={24} sm={12}>
                  <Space direction="vertical" size={8}>
                    <Title level={4} style={{ margin: 0 }}>
                      {step.title}
                    </Title>
                    <Paragraph style={{ margin: 0, color: '#595959' }}>{step.description}</Paragraph>
                  </Space>
                </Col>
              ))}
            </Row>
          </Card>
        </section>

        <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
          <Card style={{ borderRadius: 24 }} bodyStyle={{ padding: 0 }}>
            <Row gutter={0}>
              <Col xs={24} sm={12} style={{ borderRight: '1px solid #f0f0f0' }}>
                <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Free
                  </Text>
                  <Title level={3} style={{ margin: 0 }}>
                    Для быстрого старта
                  </Title>
                  <List
                    dataSource={freePerks}
                    renderItem={(perk) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Text>{perk}</Text>
                      </List.Item>
                    )}
                  />
                  <Text type="secondary">Никаких карт, просто попробуй демо.</Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1, color: '#6366f1' }}>
                    Pro (скоро)
                  </Text>
                  <Title level={3} style={{ margin: 0 }}>
                    Когда готов расшириться
                  </Title>
                  <List
                    dataSource={proPerks}
                    renderItem={(perk) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Text>{perk}</Text>
                      </List.Item>
                    )}
                  />
                  <Text type="secondary">
                    Мы предупредим, как только полнофункциональный Pro станет доступен.
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </section>
      </Space>
    </div>
  );
}
