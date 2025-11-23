import { NextResponse } from 'next/server';

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const threadId = process.env.TELEGRAM_THREAD_ID ? Number(process.env.TELEGRAM_THREAD_ID) : undefined;

const TELEGRAM_URL = botToken ? `https://api.telegram.org/bot${botToken}/sendMessage` : undefined;

const formatTimestamp = () =>
  new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour12: false,
  });

type ContactPayload = {
  name?: string;
  contact: string;
  notes?: string;
  entryPoint: string;
  sessionTime: number;
  url: string;
  timezone?: string | null;
};

export async function POST(request: Request) {
  if (!botToken || !chatId || !TELEGRAM_URL) {
    return NextResponse.json(
      { ok: false, error: 'TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID не настроены' },
      { status: 500 },
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Неверный формат запроса' }, { status: 400 });
  }

  const { contact, entryPoint, sessionTime, url } = payload;
  if (!contact || !entryPoint || typeof sessionTime !== 'number' || !url) {
    return NextResponse.json({ ok: false, error: 'Не хватает данных для отправки' }, { status: 400 });
  }

  const message = [
    '📨 Новый контакт easyOffer',
    `📇 Имя: ${payload.name || 'не указано'}`,
    `✉️ Контакт: ${payload.contact}`,
    payload.notes ? `🗒 Комментарий: ${payload.notes}` : null,
    `📍 Источник: ${payload.entryPoint}`,
    `⏱ На сайте: ${payload.sessionTime} сек.`,
    payload.timezone ? `🕰 Часовой пояс: ${payload.timezone}` : null,
    `🌐 Страница: ${payload.url}`,
    `🗓 МСК: ${formatTimestamp()}`,
  ]
    .filter(Boolean)
    .join('\n');

  const telegramResponse = await fetch(TELEGRAM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      message_thread_id: threadId,
    }),
  });

  const data = await telegramResponse.json();

  if (!telegramResponse.ok || !data?.ok) {
    const errorMessage = data?.description || 'Не удалось отправить сообщение в Telegram';
    console.error('Telegram error:', errorMessage);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
