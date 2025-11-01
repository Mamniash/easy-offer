import { Card, List, Space, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function PolicyPage() {
  return (
    <div style={{ background: '#f5f5f5' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Title level={1} style={{ margin: 0 }}>
              Политика конфиденциальности easyOffer
            </Title>
            <Text type="secondary">
              Версия от {new Date().toLocaleDateString('ru-RU')}. Мы объясняем, какие данные собираем, как используем их и как
              защищаем вашу приватность.
            </Text>
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              1. Какие данные мы получаем
            </Title>
            <List
              dataSource={[
                'Контактные данные — имя, электронная почта и страна проживания, указанные при регистрации или оплате.',
                'Технические данные — IP-адрес, версия браузера, cookies, а также идентификаторы устройств для аналитики.',
                'Данные использования — какие разделы открываете, какие вопросы и фильтры просматриваете.',
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 0' }}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              2. Как мы используем информацию
            </Title>
            <List
              dataSource={[
                'Для предоставления доступа к демо и Pro-тарифам, поддержания подписки и биллинга.',
                'Для персонализации контента: рекомендации вопросов, напоминания и подборки.',
                'Для аналитики и улучшения продукта — агрегированные отчёты без идентификации конкретных пользователей.',
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 0' }}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              3. Передача третьим сторонам
            </Title>
            <Paragraph style={{ margin: 0 }}>
              Мы делимся данными только с проверенными подрядчиками: платёжными провайдерами, сервисами аналитики и службами
              поддержки. Все поставщики обязаны соблюдать требования GDPR и 152-ФЗ.
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              Мы не продаём персональную информацию. Доступ к данным ограничен сотрудниками, которым это необходимо для работы
              сервиса.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              4. Сроки хранения и безопасность
            </Title>
            <List
              dataSource={[
                'Данные аккаунта и подписки хранятся до удаления аккаунта или по требованию пользователя.',
                'Логи событий и аналитика обезличиваются и хранятся до 24 месяцев.',
                'Мы используем шифрование, двухфакторную аутентификацию сотрудников и регулярные аудиты безопасности.',
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 0' }}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              5. Ваши права
            </Title>
            <List
              dataSource={[
                'Запросить копию персональных данных или их исправление.',
                'Удалить аккаунт и потребовать удаления персональной информации.',
                'Отозвать согласие на рассылку и отказаться от аналитических cookies.',
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 0' }}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
            <Paragraph style={{ margin: 0 }}>
              Запросы обрабатываем на legal@easyoffer.demo в течение 10 рабочих дней.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              6. Обновления политики
            </Title>
            <Paragraph style={{ margin: 0 }}>
              При изменении документов мы уведомляем пользователей по электронной почте и в интерфейсе сервиса минимум за 5 дней
              до вступления новой версии в силу. Продолжая пользоваться сервисом, вы принимаете обновления.
            </Paragraph>
          </Card>
        </Space>
      </div>
    </div>
  );
}
