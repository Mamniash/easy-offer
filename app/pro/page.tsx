'use client';

import { Button, Card, Col, Divider, Form, Input, List, Modal, Row, Space, Tag, Typography, message } from 'antd';
import { CalendarOutlined, CheckCircleFilled, ClockCircleOutlined, MailOutlined, RocketOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

const { Title, Text } = Typography;

const RATE_LIMIT_TIMEOUT = 60 * 1000;

const canSendMessage = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  const lastSent = window.localStorage.getItem('easy-offer-last-message');
  const now = Date.now();

  if (lastSent && now - Number(lastSent) < RATE_LIMIT_TIMEOUT) {
    return false;
  }

  window.localStorage.setItem('easy-offer-last-message', now.toString());
  return true;
};

export default function ProPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const sessionStartRef = useRef(Date.now());

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz || null);
    } catch {
      setTimezone(null);
    }
  }, []);

  const handleSubmit = async (values: { contact: string; note?: string }) => {
    if (!canSendMessage()) {
      message.warning('Можно отправить сообщение раз в минуту.');
      return false;
    }

    const payload = {
      ...values,
      entryPoint: 'Pro страница',
      sessionTime: Math.max(Math.round((Date.now() - sessionStartRef.current) / 1000), 0),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timezone,
    };

    setSubmitting(true);
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Ошибка отправки');
      }

      message.success('Спасибо! Как только Pro появится, пришлём приглашение.');
      form.resetFields();
      return true;
    } catch (error) {
      console.error('Ошибка при отправке сообщения', error);
      message.error('Не удалось отправить заявку. Попробуйте позже.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
		<div
			style={{
				background:
					'linear-gradient(135deg, #f4f6ff 0%, #fdf3ff 40%, #ffffff 100%)',
				minHeight: '100vh'
			}}
		>
			<div
				style={{ maxWidth: 1040, margin: '0 auto', padding: '80px 24px' }}
			>
				<Space direction='vertical' size={40} style={{ width: '100%' }}>
					<Card
						style={{
							borderRadius: 28,
							border: 'none',
							boxShadow: '0 30px 80px rgba(99, 102, 241, 0.15)'
						}}
						bodyStyle={{
							padding: 36,
							background:
								'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
							color: '#fff'
						}}
					>
						<Space
							direction='vertical'
							size={16}
							style={{ width: '100%' }}
						>
							<Space size={12} align='center'>
								<RocketOutlined style={{ fontSize: 28 }} />
								<div>
									<Title
										level={1}
										style={{ margin: 0, color: '#fff' }}
									>
										Pro-доступ скоро появится
									</Title>
									<Text
										style={{
											color: 'rgba(255,255,255,0.85)',
											fontSize: 18
										}}
									>
										Мы собираем обратную связь, чтобы сделать
										расширенный тариф максимально полезным: глубже
										фильтруйте, открывайте ответы без ограничений и
										смотрите подборки похожих вопросов.
									</Text>
								</div>
							</Space>
							<Space size='middle' wrap>
								<Button
									type='primary'
									size='large'
									href='/'
									style={{ background: '#fff', color: '#4c51f7' }}
								>
									Вернуться к профессиям
								</Button>
								<Button
									size='large'
									href='#features'
									icon={<MailOutlined />}
								>
									Сообщите, чего вам не хватает
								</Button>
							</Space>
						</Space>
					</Card>

					<Card
						id='features'
						style={{ borderRadius: 24 }}
						bodyStyle={{ padding: 32 }}
					>
						<Row gutter={[32, 32]}>
							<Col xs={24} md={12}>
								<Space direction='vertical' size={16}>
									<Title level={3} style={{ margin: 0 }}>
										Что будет в Pro
									</Title>
									<List
										dataSource={[
											'Безлимитные раскрытия вопросов и быстрый просмотр кратких ответов',
											'Фильтры по компаниям, географии и динамике спроса',
											'Расширенный блок «смотреть похожие вопросы» с подборками',
											'Экспорт расширенных отчётов и заметок'
										]}
										renderItem={(item) => (
											<List.Item style={{ padding: '4px 0' }}>
												<Space size={8}>
													<CheckCircleFilled
														style={{ color: '#52c41a' }}
													/>
													<Text>{item}</Text>
												</Space>
											</List.Item>
										)}
									/>
								</Space>
							</Col>
							<Col xs={24} md={12}>
								<Space direction='vertical' size={16}>
									<Title level={3} style={{ margin: 0 }}>
										Что уже можно делать
									</Title>
									<List
										dataSource={[
											'Изучить сетку ролей и список вопросов',
											'Посмотреть частоту и тренды по неделям',
											'Импортировать собственную базу вопросов',
											'Экспортировать текущий список в CSV'
										]}
										renderItem={(item) => (
											<List.Item style={{ padding: '4px 0' }}>
												<Space size={8}>
													<CheckCircleFilled
														style={{ color: '#52c41a' }}
													/>
													<Text>{item}</Text>
												</Space>
											</List.Item>
										)}
									/>
								</Space>
							</Col>
						</Row>
					</Card>

					<Card style={{ borderRadius: 20, borderColor: '#e0e7ff' }}>
						<Space align='center' wrap size={20}>
							<CalendarOutlined
								style={{ fontSize: 26, color: '#6366f1' }}
							/>
							<Space direction='vertical' size={4}>
								<Title level={4} style={{ margin: 0 }}>
									Присоединяйтесь к списку раннего доступа
								</Title>
								<Text type='secondary'>
									Оставьте контакт: пришлём первые приглашения, как
									только Pro появится.
								</Text>
							</Space>
						</Space>
						<Divider style={{ margin: '16px 0' }} />
					</Card>

					<Card
						style={{
							borderRadius: 24,
							border: '1px solid rgba(99, 102, 241, 0.18)',
							background:
								'linear-gradient(135deg, rgba(99, 102, 241, 0.07) 0%, rgba(236, 72, 153, 0.08) 40%, #ffffff 100%)',
							boxShadow: '0 20px 60px rgba(99, 102, 241, 0.08)'
						}}
						bodyStyle={{ padding: 24 }}
					>
						<Space
							direction='vertical'
							size={14}
							style={{ width: '100%' }}
						>
							<Space align='center' size={12} wrap>
								<SendOutlined
									style={{ fontSize: 22, color: '#ec4899' }}
								/>
								<div>
									<Title level={4} style={{ margin: 0 }}>
										Как с вами связаться?
									</Title>
									<Text type='secondary'>
										Оставьте удобный контакт, и отправим приглашение в
										первую волну.
									</Text>
								</div>
							</Space>
							<Card
								size='small'
								style={{
									borderRadius: 16,
									background: 'rgba(255, 255, 255, 0.7)',
									borderColor: 'rgba(99, 102, 241, 0.12)'
								}}
								bodyStyle={{
									display: 'flex',
									gap: 12,
									alignItems: 'center',
									padding: 14
								}}
							>
								<div style={{ flex: 1 }}>
									<Title level={5} style={{ margin: 0 }}>
										Присоединитесь к списку раннего доступа
									</Title>
									<Text type='secondary'>
										Мы напишем, когда Pro готов — без спама и лишних
										писем.
									</Text>
								</div>
								<Space size={8} wrap>
									<Button
										onClick={() => setContactModalOpen(true)}
										icon={<SendOutlined />}
										type='primary'
									>
										Оставить контакт
									</Button>
									<Button
										type='link'
										onClick={() => setContactModalOpen(true)}
									>
										Заполнить быстро
									</Button>
								</Space>
							</Card>
						</Space>
					</Card>

					<Modal
						title='Оставьте контакт'
						open={contactModalOpen}
						onCancel={() => setContactModalOpen(false)}
						footer={null}
						destroyOnClose
						centered
					>
						<Text type='secondary'>
							Пара строк: куда написать и чем помочь. Это займёт меньше
							минуты.
						</Text>
						<Form
							form={form}
							layout='vertical'
							requiredMark={false}
							onFinish={async (values) => {
								const isSent = await handleSubmit(values)
								if (isSent) {
									setContactModalOpen(false)
								}
							}}
							style={{ marginTop: 16 }}
						>
							<Form.Item
								name='contact'
								label='Контакт'
								rules={[
									{
										required: true,
										message: 'Укажите почту или Telegram'
									}
								]}
							>
								<Input
									size='large'
									prefix={<MailOutlined />}
									placeholder='example@email.com или @username'
									autoComplete='email'
									allowClear
								/>
							</Form.Item>
							<Form.Item name='note' label='Пару слов о задачах'>
								<Input.TextArea
									size='large'
									placeholder='Что хотите улучшить в Pro?'
									autoSize={{ minRows: 2, maxRows: 3 }}
									allowClear
								/>
							</Form.Item>
							<Space
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}
							>
								<Text type='secondary'>Ответим в рабочие часы.</Text>
								<Button
									type='primary'
									htmlType='submit'
									loading={submitting}
									icon={<SendOutlined />}
								>
									Отправить
								</Button>
							</Space>
						</Form>
					</Modal>
				</Space>
			</div>
		</div>
  )
}
