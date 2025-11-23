'use client';

import { Button, Card, Col, Divider, List, Row, Space, Tag, Typography } from 'antd';
import { CalendarOutlined, CheckCircleFilled, ClockCircleOutlined, MailOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ProPage() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f4f6ff 0%, #fdf3ff 40%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '80px 24px' }}>
        <Space direction="vertical" size={40} style={{ width: '100%' }}>
          <Card
            style={{ borderRadius: 28, border: 'none', boxShadow: '0 30px 80px rgba(99, 102, 241, 0.15)' }}
            bodyStyle={{ padding: 36, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff' }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Tag color="gold" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontWeight: 600 }}>
                <ClockCircleOutlined />{' '}
                Скоро запуск
              </Tag>
              <Space size={12} align="center">
                <RocketOutlined style={{ fontSize: 28 }} />
                <div>
                  <Title level={1} style={{ margin: 0, color: '#fff' }}>
                    Pro-доступ скоро появится
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18 }}>
                    Мы собираем обратную связь, чтобы сделать расширенный тариф максимально полезным: глубже фильтруйте,
                    открывайте ответы без ограничений и смотрите подборки похожих вопросов.
                  </Text>
                </div>
              </Space>
              <Space size="middle" wrap>
                <Button type="primary" size="large" href="/" style={{ background: '#fff', color: '#4c51f7' }}>
                  Вернуться к профессиям
                </Button>
                <Button size="large" href="#features" icon={<MailOutlined /> }>
                  Сообщите, чего вам не хватает
                </Button>
              </Space>
            </Space>
          </Card>

          <Card id="features" style={{ borderRadius: 24 }} bodyStyle={{ padding: 32 }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <Space direction="vertical" size={16}>
                  <Title level={3} style={{ margin: 0 }}>
                    Что будет в Pro
                  </Title>
                  <List
                    dataSource={[
                      'Безлимитные раскрытия вопросов и быстрый просмотр кратких ответов',
                      'Фильтры по компаниям, географии и динамике спроса',
                      'Расширенный блок «смотреть похожие вопросы» с подборками',
                      'Экспорт расширенных отчётов и заметок',
                    ]}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Space size={8}>
                          <CheckCircleFilled style={{ color: '#52c41a' }} />
                          <Text>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space direction="vertical" size={16}>
                  <Title level={3} style={{ margin: 0 }}>
                    Что уже можно делать
                  </Title>
                  <List
                    dataSource={[
                      'Изучить сетку ролей и список вопросов',
                      'Посмотреть частоту и тренды по неделям',
                      'Импортировать собственную базу вопросов',
                      'Экспортировать текущий список в CSV',
                    ]}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Space size={8}>
                          <CheckCircleFilled style={{ color: '#52c41a' }} />
                          <Text>{item}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Space>
              </Col>
            </Row>
          </Card>

          <Card style={{ borderRadius: 20, borderColor: '#e0e7ff' }}>
            <Space align="center" wrap size={20}>
              <CalendarOutlined style={{ fontSize: 26, color: '#6366f1' }} />
              <Space direction="vertical" size={4}>
                <Title level={4} style={{ margin: 0 }}>
                  Присоединяйтесь к списку раннего доступа
                </Title>
                <Text type="secondary">
                  Оставьте почту в футере: пришлём первые приглашения, как только Pro появится.
                </Text>
              </Space>
            </Space>
            <Divider style={{ margin: '16px 0' }} />
            <Space size="middle" wrap>
              <Tag icon={<ClockCircleOutlined />} color="processing">
                Оповещение о запуске
              </Tag>
              <Tag icon={<RocketOutlined />} color="purple">
                Закрытая бета в приоритете
              </Tag>
              <Tag icon={<MailOutlined />} color="blue">
                Персональные обновления
              </Tag>
            </Space>
          </Card>
        </Space>
      </div>
    </div>
  );
}
