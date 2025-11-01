'use client';

import { Button, Card, Col, List, Row, Space, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function ProPage() {
  return (
    <div style={{ background: '#f5f5f5' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}>
        <Space direction="vertical" size={40} style={{ width: '100%' }}>
          <Space direction="vertical" size={16}>
            <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1, color: '#6366f1' }}>
              Pro-заглушка
            </Text>
            <Title level={1} style={{ margin: 0 }}>
              Pro-доступ скоро появится
            </Title>
            <Paragraph style={{ fontSize: 18, color: '#595959', margin: 0 }}>
              Мы собираем обратную связь, чтобы расширенный тариф решал реальные задачи: фильтрация по компаниям,
              безлимитное открытие ответов и подборки похожих вопросов.
            </Paragraph>
          </Space>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ padding: 32 }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <Space direction="vertical" size={16}>
                  <Title level={3} style={{ margin: 0 }}>
                    Что будет в Pro
                  </Title>
                  <List
                    dataSource={[
                      'Безлимитные раскрытия вопросов и быстрый просмотр кратких ответов',
                      'Фильтры по компаниям и динамика спроса по ним',
                      'Расширенный блок «смотреть похожие вопросы»',
                      'Экспорт расширенных отчётов и заметок',
                    ]}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '4px 0' }}>
                        <Text>{item}</Text>
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
                        <Text>{item}</Text>
                      </List.Item>
                    )}
                  />
                </Space>
              </Col>
            </Row>
          </Card>

          <Space size="middle" wrap>
            <Button type="primary" href="/">
              Вернуться к профессиям
            </Button>
            <Text type="secondary">Оставьте почту в футере, чтобы узнать о запуске (скоро).</Text>
          </Space>
        </Space>
      </div>
    </div>
  );
}
