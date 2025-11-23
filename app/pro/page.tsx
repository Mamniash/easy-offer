'use client';

import { Button, Card, Col, Divider, Form, Input, List, Row, Space, Typography, message } from 'antd';
import { CalendarOutlined, CheckCircleFilled, ClockCircleOutlined, MailOutlined, RocketOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

const { Title, Text } = Typography;

const RATE_LIMIT_TIMEOUT = 60 * 1000;

const canSendMessage = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  const lastSent = window.localStorage.getItem('easy-offer-last-message');
  const now = Date.now();

  if (lastSent && now - Number(lastSent) < RATE_LIMIT_TIMEOUT) {
    return false;
  }

  window.localStorage.setItem('easy-offer-last-message', now.toString());
  return true;
};

export default function ProPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [timezone, setTimezone] = useState<string | null>(null);
  const sessionStartRef = useRef(Date.now());

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz || null);
    } catch {
      setTimezone(null);
    }
  }, []);

  const handleSubmit = async (values: { contact: string; note?: string }) => {
    if (!canSendMessage()) {
      message.warning('Можно отправить сообщение раз в минуту.');
      return;
    }

    const payload = {
      ...values,
      entryPoint: 'Pro страница',
      sessionTime: Math.max(Math.round((Date.now() - sessionStartRef.current) / 1000), 0),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timezone,
    };

    setSubmitting(true);
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Ошибка отправки');
      }

      message.success('Спасибо! Как только Pro появится, пришлём приглашение.');
      form.resetFields();
    } catch (error) {
      console.error('Ошибка при отправке сообщения', error);
      message.error('Не удалось отправить заявку. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

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
                  Оставьте контакт: пришлём первые приглашения, как только Pro появится.
                </Text>
              </Space>
            </Space>
            <Divider style={{ margin: '16px 0' }} />
            <Space size="middle" wrap>
              <Space size={8} align="center">
                <ClockCircleOutlined style={{ color: '#595959' }} />
                <Text>Оповещение о запуске</Text>
              </Space>
              <Space size={8} align="center">
                <RocketOutlined style={{ color: '#595959' }} />
                <Text>Закрытая бета в приоритете</Text>
              </Space>
              <Space size={8} align="center">
                <MailOutlined style={{ color: '#595959' }} />
                <Text>Персональные обновления</Text>
              </Space>
            </Space>
          </Card>

          <Card
            style={{
              borderRadius: 20,
              border: '1px solid rgba(236, 72, 153, 0.2)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(236, 72, 153, 0.08) 45%, #ffffff 100%)',
              boxShadow: '0 20px 60px rgba(99, 102, 241, 0.08)',
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Space align="center" size={12} wrap>
                <SendOutlined style={{ fontSize: 22, color: '#ec4899' }} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    Получите приглашение в Pro
                  </Title>
                  <Text type="secondary">Сделали форму компактной: оставьте способ связи и пару слов о задачах.</Text>
                </div>
              </Space>
              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleSubmit}
                style={{ marginTop: 4 }}
              >
                <div
                  style={{
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns: '1fr',
                  }}
                >
                  <Form.Item
                    name="contact"
                    label="Как с вами связаться"
                    rules={[{ required: true, message: 'Укажите почту или Telegram' }]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="example@email.com или @username"
                      autoComplete="email"
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item name="note" label="Пару слов о ваших задачах">
                    <Input.TextArea
                      placeholder="Например: хочу видеть тренды по компаниям или выгрузку вопросов"
                      autoSize={{ minRows: 2, maxRows: 3 }}
                      allowClear
                    />
                  </Form.Item>
                </div>
                <Space
                  size={12}
                  wrap
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}
                >
                  <Button type="primary" htmlType="submit" loading={submitting} icon={<SendOutlined />}>
                    Отправить контакт
                  </Button>
                  <Text type="secondary" style={{ marginLeft: 'auto' }}>
                    Ответим в рабочие часы и пришлём свежие новости.
                  </Text>
                </Space>
              </Form>
            </Space>
          </Card>
        </Space>
      </div>
    </div>
  );
}
