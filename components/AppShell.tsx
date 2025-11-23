'use client';

import { SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, Menu, Space, Typography, message } from 'antd';
import Link from 'next/link';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

const { Header, Content, Footer } = Layout;

const navigationItems = [
  { key: 'landing', label: <Link href="/landing">Лендинг</Link> },
  { key: 'pro', label: <Link href="/pro">Стать Pro</Link> },
];

const Navigation = () => (
  <Header
    style={{
      background: '#ffffff',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      padding: '0 24px',
      height: 'auto',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 1200,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 18,
          fontWeight: 600,
          color: '#1f1f1f',
        }}
      >
        <span
          style={{
            background: '#1f1f1f',
            color: '#ffffff',
            borderRadius: 999,
            padding: '4px 12px',
            textTransform: 'uppercase',
            fontSize: 12,
            letterSpacing: 1.2,
          }}
        >
          demo
        </span>
        easyOffer
      </Link>
      <Menu
        mode="horizontal"
        items={navigationItems}
        style={{
          borderBottom: 'none',
          background: 'transparent',
          fontWeight: 500,
        }}
      />
    </div>
  </Header>
);

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

const AppFooter = () => {
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

  const handleSubmit = async (values: { name?: string; contact: string; notes?: string }) => {
    if (!canSendMessage()) {
      message.warning('Можно отправить сообщение раз в минуту.');
      return;
    }

    const payload = {
      ...values,
      entryPoint: 'Футер сайта',
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

      message.success('Спасибо! Мы свяжемся с вами в ближайшее время.');
      form.resetFields();
    } catch (error) {
      console.error('Ошибка при отправке сообщения', error);
      message.error('Не удалось отправить заявку. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid #f0f0f0',
        padding: '32px 24px',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: 1200,
          width: '100%',
          display: 'grid',
          gap: 24,
          gridTemplateColumns: '1fr',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: '1fr',
          }}
        >
          <div
            style={{
              background: '#f8f8fb',
              border: '1px solid #f0f0f5',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Оставьте контакт — мы ответим и отправим приглашение на Pro
              </Typography.Title>
              <Typography.Text type="secondary">
                Напишите почту или Telegram. При необходимости добавьте комментарий: так мы быстрее поможем.
              </Typography.Text>
            </Space>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{ marginTop: 16 }}
              requiredMark={false}
            >
              <Form.Item name="name" label="Имя">
                <Input placeholder="Как к вам обращаться" />
              </Form.Item>
              <Form.Item
                name="contact"
                label="Почта или Telegram"
                rules={[{ required: true, message: 'Оставьте способ связи' }]}
              >
                <Input prefix={<SendOutlined />} placeholder="example@email.com или @username" />
              </Form.Item>
              <Form.Item name="notes" label="Комментарий">
                <Input.TextArea placeholder="Что важно учесть или какие вопросы есть" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button type="primary" htmlType="submit" loading={submitting} icon={<SendOutlined />}>
                  Отправить
                </Button>
                <Typography.Text type="secondary">
                  Можно отправлять не чаще раза в минуту.
                </Typography.Text>
              </Space>
            </Form>
          </div>

          <Space direction="vertical" size={12}>
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} easyOffer demo. Все данные синтетические.
            </Typography.Text>
            <Space size="large" wrap>
              <Link href="/policy">Policy</Link>
              <Link href="/terms">Terms</Link>
            </Space>
          </Space>
        </div>
      </div>
    </Footer>
  );
};

const AppShell = ({ children }: PropsWithChildren) => (
  <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
    <Navigation />
    <Content style={{ flex: 1 }}>{children}</Content>
    <AppFooter />
  </Layout>
);

export default AppShell;
