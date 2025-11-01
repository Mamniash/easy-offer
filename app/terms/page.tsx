import { Card, List, Space, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function TermsPage() {
  return (
    <div style={{ background: '#f5f5f5' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Title level={1} style={{ margin: 0 }}>
              Публичная оферта сервиса easyOffer
            </Title>
            <Text type="secondary">
              Версия от {new Date().toLocaleDateString('ru-RU')}. Этот документ описывает условия предоставления доступа к демо и
              Pro-тарифам платформы подготовки к собеседованиям.
            </Text>
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              1. Общие положения
            </Title>
            <Paragraph style={{ margin: 0 }}>
              Сервис easyOffer предоставляет пользователям доступ к каталогу вопросов собеседований, аналитике частот и
              дополнительным материалам. Используя сайт, вы подтверждаете согласие с настоящей офертой и обязуетесь соблюдать её
              условия.
            </Paragraph>
            <List
              dataSource={[
                'Владелец сервиса — индивидуальный предприниматель или юридическое лицо, указанное в реквизитах подписки.',
                'Пользователь — физическое лицо, прошедшее регистрацию и/или оплату тарифа.',
                'Оферта распространяется на бесплатную демо-версию и платные тарифы Pro.',
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
              2. Тарифы и оплата
            </Title>
            <Paragraph style={{ margin: 0 }}>
              Актуальные цены и наполнение тарифа указываются на странице «Стать Pro». Стоимость может изменяться, при этом уже
              оплаченное обслуживание действует до окончания оплаченного периода.
            </Paragraph>
            <List
              dataSource={[
                'Оплата производится банковской картой через защищённого платёжного провайдера.',
                'Подписка продлевается автоматически, если пользователь не отключил автопродление в личном кабинете.',
                'Чеки и закрывающие документы отправляются на e-mail, указанный при оформлении.',
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
              3. Права и обязанности пользователя
            </Title>
            <List
              dataSource={[
                'Использовать материалы только для личной подготовки и не передавать доступ третьим лицам.',
                'Не копировать и не распространять контент платформы без письменного разрешения правообладателя.',
                'Сообщать о технических проблемах через службу поддержки.',
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 0' }}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
            <Paragraph style={{ margin: 0 }}>
              В случае нарушения условий оферты доступ может быть ограничен без возврата средств за текущий расчётный период.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              4. Возвраты и отмена подписки
            </Title>
            <Paragraph style={{ margin: 0 }}>
              Пользователь вправе отказаться от подписки в течение 7 календарных дней с момента оплаты, если не использовал более
              20% контента тарифа. Для возврата необходимо направить запрос в поддержку с указанием причины и реквизитов.
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              Отключение автопродления прекращает списания со следующего биллингового периода. Доступ сохраняется до окончания
              оплаченного срока.
            </Paragraph>
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Title level={2} style={{ margin: 0 }}>
              5. Ответственность и ограничения
            </Title>
            <List
              dataSource={[
                'Материалы сервиса предоставляются «как есть» и не являются гарантией получения оффера.',
                'Сервис не несёт ответственности за решения работодателей и результаты собеседований.',
                'В случае технических сбоев доступ к платным материалам будет продлён на время простоя.',
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
              6. Заключительные положения
            </Title>
            <Paragraph style={{ margin: 0 }}>
              Оферта может быть обновлена. Об изменениях мы уведомляем по электронной почте и в личном кабинете минимум за 5 дней
              до вступления новых условий в силу. Продолжая пользоваться сервисом после обновления, вы подтверждаете согласие с
              изменениями.
            </Paragraph>
            <Paragraph style={{ margin: 0 }}>
              По вопросам, связанным с подпиской или юридическими аспектами, пишите на legal@easyoffer.demo.
            </Paragraph>
          </Card>
        </Space>
      </div>
    </div>
  );
}
