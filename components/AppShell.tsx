'use client';

import { Button, Layout, Menu, Space, Typography } from 'antd';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

const { Header, Content, Footer } = Layout;

const navigationItems = [
  { key: 'landing', label: <Link href="/landing">Лендинг</Link> },
  { key: 'pro', label: <Link href="/pro">Стать Pro</Link> },
];

const Navigation = () => (
  <Header
    style={{
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      padding: '0 24px',
      height: 'auto',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
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
        padding: '12px 0',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 20,
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: 0.2,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              background: 'linear-gradient(135deg, #2563eb, #22c55e)',
              borderRadius: 10,
              boxShadow: '0 0 0 6px rgba(37, 99, 235, 0.15)',
            }}
          />
          easyOffer
        </span>
      </Link>
      <Space size={12} align="center">
        <Menu
          mode="horizontal"
          items={navigationItems}
          style={{
            borderBottom: 'none',
            background: 'transparent',
            fontWeight: 500,
          }}
        />
        <Button
          type="primary"
          size="large"
          href="/"
          style={{
            borderRadius: 999,
            paddingInline: 18,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            boxShadow: '0 12px 30px rgba(37, 99, 235, 0.3)',
          }}
        >
          Начать бесплатно
        </Button>
      </Space>
    </div>
  </Header>
);

const AppFooter = () => (
  <Footer
    style={{
      background: '#0f172a',
      borderTop: '1px solid #1e293b',
      padding: '32px 24px',
      color: '#e2e8f0',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 1200,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <Typography.Title level={4} style={{ margin: 0, color: '#e2e8f0' }}>
        easyOffer
      </Typography.Title>
      <Typography.Paragraph style={{ margin: 0, color: '#cbd5e1', maxWidth: 620 }}>
        Подготовка к собеседованию без хаоса: только актуальные вопросы, визуальная карта тем и
        понятный прогресс.
      </Typography.Paragraph>
      <Space size="large" wrap>
        <Link href="/policy" style={{ color: '#cbd5e1' }}>
          Политика
        </Link>
        <Link href="/terms" style={{ color: '#cbd5e1' }}>
          Условия
        </Link>
        <Link href="/landing" style={{ color: '#cbd5e1' }}>
          О продукте
        </Link>
        <Link href="/pro" style={{ color: '#cbd5e1' }}>
          PRO-версия
        </Link>
      </Space>
      <Typography.Text style={{ color: '#94a3b8' }}>
        © {new Date().getFullYear()} easyOffer. Все данные синтетические.
      </Typography.Text>
    </div>
  </Footer>
);

const AppShell = ({ children }: PropsWithChildren) => (
  <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
    <Navigation />
    <Content style={{ flex: 1 }}>{children}</Content>
    <AppFooter />
  </Layout>
);

export default AppShell;
