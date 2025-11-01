import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center',
        padding: '48px 16px',
      }}
    >
      <h1 style={{ fontSize: '2rem', margin: 0 }}>Страница не найдена</h1>
      <p style={{ margin: 0, maxWidth: '480px' }}>
        Кажется, вы попали на несуществующий маршрут. Проверьте адрес или вернитесь на главную страницу.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 20px',
          backgroundColor: '#1677ff',
          color: '#ffffff',
          borderRadius: '999px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        На главную
      </Link>
    </div>
  );
}
