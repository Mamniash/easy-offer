import 'antd/dist/reset.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { DataProvider } from '@/providers/DataProvider';
import { FreeAccessProvider } from '@/providers/FreeAccessProvider';
import AppShell from '@/components/AppShell';

import './globals.css';

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
            <AppShell>{children}</AppShell>
          </FreeAccessProvider>
        </DataProvider>
      </body>
    </html>
  );
}
