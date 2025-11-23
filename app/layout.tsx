import 'antd/dist/reset.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AppShell from '@/components/AppShell';
import AntdRegistry from '@/components/AntdRegistry';
import { DataProvider } from '@/providers/DataProvider';
import { FreeAccessProvider } from '@/providers/FreeAccessProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });

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
      <body className={inter.className}>
        <AntdRegistry>
          <DataProvider>
            <FreeAccessProvider>
              <AppShell>{children}</AppShell>
            </FreeAccessProvider>
          </DataProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
