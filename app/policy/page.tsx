export default function PolicyPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-slate-900">Политика конфиденциальности easyOffer</h1>
        <p className="text-sm text-slate-500">
          Версия от {new Date().toLocaleDateString('ru-RU')}. Мы объясняем, какие данные собираем, как используем их и как защищаем вашу приватность.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">1. Какие данные мы получаем</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Контактные данные — имя, электронная почта и страна проживания, указанные при регистрации или оплате.</li>
          <li>Технические данные — IP-адрес, версия браузера, cookies, а также идентификаторы устройств для аналитики.</li>
          <li>Данные использования — какие разделы открываете, какие вопросы и фильтры просматриваете.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">2. Как мы используем информацию</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Для предоставления доступа к демо и Pro-тарифам, поддержания подписки и биллинга.</li>
          <li>Для персонализации контента: рекомендации вопросов, напоминания и подборки.</li>
          <li>Для аналитики и улучшения продукта — агрегированные отчёты без идентификации конкретных пользователей.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">3. Передача третьим сторонам</h2>
        <p className="text-sm text-slate-600">
          Мы делимся данными только с проверенными подрядчиками: платёжными провайдерами, сервисами аналитики и службами поддержки. Все поставщики обязаны соблюдать требования GDPR и 152-ФЗ.
        </p>
        <p className="text-sm text-slate-600">
          Мы не продаём персональную информацию. Доступ к данным ограничен сотрудниками, которым это необходимо для работы сервиса.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">4. Сроки хранения и безопасность</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Данные аккаунта и подписки хранятся до удаления аккаунта или по требованию пользователя.</li>
          <li>Логи событий и аналитика обезличиваются и хранятся до 24 месяцев.</li>
          <li>Мы используем шифрование, двухфакторную аутентификацию сотрудников и регулярные аудиты безопасности.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">5. Ваши права</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Запросить копию персональных данных или их исправление.</li>
          <li>Удалить аккаунт и потребовать удаления персональной информации.</li>
          <li>Отозвать согласие на рассылку и отказаться от аналитических cookies.</li>
        </ul>
        <p className="text-sm text-slate-600">
          Запросы обрабатываем на legal@easyoffer.demo в течение 10 рабочих дней.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">6. Обновления политики</h2>
        <p className="text-sm text-slate-600">
          При изменении документов мы уведомляем пользователей по электронной почте и в интерфейсе сервиса минимум за 5 дней до вступления новой версии в силу. Продолжая пользоваться сервисом, вы принимаете обновления.
        </p>
      </section>
    </div>
  );
}
