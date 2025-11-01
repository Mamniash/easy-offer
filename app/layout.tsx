import 'antd/dist/reset.css';

import { Layout, Menu, Space, Typography } from 'antd';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { DataProvider } from '@/providers/DataProvider';
import { FreeAccessProvider } from '@/providers/FreeAccessProvider';
import AppShell from '@/components/AppShell';

import './globals.css';

const { Header, Content, Footer } = Layout;
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'easyOffer demo',
  description:
    'Демо-платформа вопросов на собеседовании: роли, частоты, краткие ответы и Pro-гейтинг.',
};

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
        items={[
          { key: 'landing', label: <Link href="/landing">Лендинг</Link> },
          { key: 'pro', label: <Link href="/pro">Стать Pro</Link> },
        ]}
        style={{
          borderBottom: 'none',
          background: 'transparent',
          fontWeight: 500,
        }}
      />
    </div>
  </Header>
);

const AppFooter = () => (
  <Footer
    style={{
      background: '#ffffff',
      borderTop: '1px solid #f0f0f0',
      padding: '24px 24px',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 1200,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Typography.Text type="secondary">
        © {new Date().getFullYear()} easyOffer demo. Все данные синтетические.
      </Typography.Text>
      <Space size="large">
        <Link href="/policy">Policy</Link>
        <Link href="/terms">Terms</Link>
      </Space>
    </div>
  </Footer>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ background: '#f5f5f5', color: '#1f1f1f' }}
      >
        <DataProvider>
          <FreeAccessProvider>
            <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
              <Navigation />
              <Content style={{ flex: 1 }}>{children}</Content>
              <AppFooter />
            </Layout>
          </FreeAccessProvider>
        </DataProvider>
      </body>
    </html>
  );
}
