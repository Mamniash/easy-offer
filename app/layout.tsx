import 'antd/dist/reset.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';

import { DataProvider } from '@/providers/DataProvider';
import { FreeAccessProvider } from '@/providers/FreeAccessProvider';

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

const Navigation = () => (
  <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-bold uppercase text-white">demo</span>
        easyOffer
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
        <Link href="/landing" className="transition hover:text-slate-900">
          Лендинг
        </Link>
        <Link href="/pro" className="transition hover:text-slate-900">
          Стать Pro
        </Link>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} easyOffer demo. Все данные синтетические.</p>
      <div className="flex items-center gap-4">
        <Link href="/policy" className="hover:text-slate-800">
          Policy
        </Link>
        <Link href="/terms" className="hover:text-slate-800">
          Terms
        </Link>
      </div>
    </div>
  </footer>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 font-sans text-slate-900`}>
        <DataProvider>
          <FreeAccessProvider>
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1 bg-slate-50">{children}</main>
              <Footer />
            </div>
          </FreeAccessProvider>
        </DataProvider>
      </body>
    </html>
  );
}
