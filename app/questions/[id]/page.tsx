'use client';

import { LinkOutlined, PlayCircleFilled } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Modal, Row, Space, Typography } from 'antd';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useDataContext } from '@/providers/DataProvider';
import { useFreeAccess } from '@/providers/FreeAccessProvider';
import type { AnswerVariant } from '@/types';

const { Title, Text, Paragraph } = Typography;

const levelLabel: Record<string, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

const stageLabel: Record<string, string> = {
  screening: 'Screening',
  technical: 'Technical',
  on_site: 'On-site',
  take_home: 'Take-home',
};

const typeLabel: Record<string, string> = {
  theory: 'Теория',
  coding: 'Coding',
  behavioral: 'Behavioral',
  system_design: 'System design',
};

const sourceMeta: Record<AnswerVariant['source'], { label: string; color: string }> = {
  youtube: { label: 'YouTube', color: 'red' },
  article: { label: 'Статья', color: 'blue' },
  podcast: { label: 'Подкаст', color: 'purple' },
  blog: { label: 'Блог', color: 'green' },
};

export default function QuestionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { bundle } = useDataContext();
  const { attemptConsume, remaining } = useFreeAccess();

  const question = useMemo(() => bundle.questions.find((item) => item.id === params.id), [bundle.questions, params.id]);

  const [isLoading, setIsLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [hasConsumed, setHasConsumed] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasRevealedAnswer, setHasRevealedAnswer] = useState(false);
  const [lockMessage, setLockMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [params.id]);

  useEffect(() => {
    setShowAnswer(false);
    setHasRevealedAnswer(false);
    setHasConsumed(false);
    setLocked(false);
  }, [params.id]);

  useEffect(() => {
    if (!question) return;
    if (hasConsumed || locked) return;
    const allowed = attemptConsume();
    if (!allowed) {
      setLocked(true);
    } else {
      setHasConsumed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  if (!question) {
    notFound();
  }

  const role = bundle.roles.find((item) => item.slug === question.roleSlug);

  const related = useMemo(() => {
    return bundle.questions
      .filter((item) => item.roleSlug === question.roleSlug && item.id !== question.id)
      .filter((item) => item.type === question.type || item.tags.some((tag) => question.tags.includes(tag)))
      .sort((a, b) => b.frequencyScore - a.frequencyScore)
      .slice(0, 8);
  }, [bundle.questions, question]);

  const handleToggleAnswer = () => {
    if (!showAnswer && !hasRevealedAnswer) {
      const allowed = attemptConsume();
      if (!allowed) {
        setLockMessage('Лимит исчерпан. Краткие ответы доступны в Pro.');
        return;
      }
      setHasRevealedAnswer(true);
    }
    setShowAnswer((prev) => !prev);
  };

  const handleRelatedClick = (id: string) => {
    if (remaining <= 0) {
      setLockMessage('Лимит исчерпан. Похожие вопросы доступны в Pro.');
      return;
    }
    router.push(`/questions/${encodeURIComponent(id)}`);
  };

  if (locked) {
    return (
      <div style={{ background: '#f5f5f5' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/">Профессии</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{role?.name ?? 'Вопрос'}</Breadcrumb.Item>
            </Breadcrumb>
            <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Title level={2} style={{ margin: 0 }}>
                Демо-лимит исчерпан
              </Title>
              <Paragraph>
                В бесплатной версии можно раскрыть до 20 карточек вопросов в сутки. Чтобы продолжить, оформите Pro или вернитесь
                завтра.
              </Paragraph>
              <Space size="middle" wrap>
                <Button type="primary" href="/pro">
                  Посмотреть тариф
                </Button>
                <Button href="/">Вернуться к профессиям</Button>
              </Space>
            </Card>
          </Space>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/">Профессии</Link>
            </Breadcrumb.Item>
            {role ? (
              <Breadcrumb.Item>
                <Link href={`/roles/${role.slug}`}>{role.name}</Link>
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item>Неизвестная роль</Breadcrumb.Item>
            )}
            <Breadcrumb.Item>Вопрос</Breadcrumb.Item>
          </Breadcrumb>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12 }}>
              Карточка вопроса
            </Text>
            <Title level={2} style={{ margin: 0 }}>
              {question.title}
            </Title>
            <Text type="secondary">
              {levelLabel[question.level]} · {typeLabel[question.type]} · {stageLabel[question.interviewStage]}
            </Text>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {isLoading ? (
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Card key={index} style={{ borderRadius: 20 }} loading />
                    ))}
                  </Space>
                ) : (
                  <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    <Space direction="vertical" size={8}>
                      <Title level={4} style={{ margin: 0 }}>
                        Формулировка
                      </Title>
                      <Paragraph style={{ margin: 0 }}>{question.title}</Paragraph>
                    </Space>

                    <Space direction="vertical" size={12}>
                      <Title level={4} style={{ margin: 0 }}>
                        Краткий ответ
                      </Title>
                      <Button onClick={handleToggleAnswer}>
                        {showAnswer ? 'Скрыть краткий ответ' : 'Показать краткий ответ'}
                      </Button>
                      {showAnswer && (
                        <Card style={{ borderRadius: 16, background: '#f5f5f5' }}>
                          <Paragraph style={{ margin: 0 }}>{question.sampleAnswer}</Paragraph>
                        </Card>
                      )}
                    </Space>

                    <Space direction="vertical" size={8}>
                      <Title level={4} style={{ margin: 0 }}>
                        Почему спрашивают
                      </Title>
                      <Paragraph style={{ margin: 0 }}>{question.why}</Paragraph>
                    </Space>

                    <Space direction="vertical" size={8}>
                      <Title level={4} style={{ margin: 0 }}>
                        Ловушки
                      </Title>
                      <Paragraph style={{ margin: 0 }}>{question.pitfalls.length ? question.pitfalls.join(', ') : 'Не указаны'}</Paragraph>
                    </Space>

                    <Space direction="vertical" size={8}>
                      <Title level={4} style={{ margin: 0 }}>
                        Follow-up вопросы
                      </Title>
                      <Paragraph style={{ margin: 0 }}>{question.followUps.length ? question.followUps.join(', ') : 'Не указаны'}</Paragraph>
                    </Space>

                    <Space direction="vertical" size={12}>
                      <Title level={4} style={{ margin: 0 }}>
                        Материалы для изучения
                      </Title>
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        {question.answerVariants.map((variant) => (
                          <Card
                            key={variant.id}
                            hoverable
                            onClick={() => window.open(variant.url, '_blank')}
                            style={{ borderRadius: 16 }}
                          >
                            <Space direction="vertical" size={8}>
                              <Space align="center" size={8}>
                                <Text type="secondary" style={{ color: sourceMeta[variant.source].color }}>
                                  {sourceMeta[variant.source].label}
                                </Text>
                                <Text strong>{variant.title}</Text>
                              </Space>
                              <Text type="secondary">{variant.summary}</Text>
                              <Space size={8}>
                                <LinkOutlined />
                                <Text type="secondary">{variant.url}</Text>
                              </Space>
                            </Space>
                          </Card>
                        ))}
                      </Space>
                    </Space>
                  </Space>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Похожие вопросы
                  </Title>
                  <Space direction="vertical" size={12}>
                    {related.map((item) => (
                      <Card
                        key={item.id}
                        hoverable
                        style={{ borderRadius: 16 }}
                        onClick={() => handleRelatedClick(item.id)}
                      >
                        <Space direction="vertical" size={4}>
                          <Text strong>{item.title}</Text>
                          <Text type="secondary">Частота {Math.round(item.frequencyScore)}%</Text>
                        </Space>
                      </Card>
                    ))}
                  </Space>
                </Card>

                <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Видео-ответы
                  </Title>
                  <Space direction="vertical" size={12}>
                    {question.answerVariants
                      .filter((variant) => variant.source === 'youtube')
                      .map((variant) => (
                        <Card
                          key={variant.id}
                          hoverable
                          style={{ borderRadius: 16 }}
                          onClick={() => window.open(variant.url, '_blank')}
                        >
                          <Space align="center" size={12}>
                            <PlayCircleFilled style={{ fontSize: 24, color: '#6366f1' }} />
                            <Space direction="vertical" size={0}>
                              <Text strong>{variant.title}</Text>
                              <Text type="secondary">{variant.summary}</Text>
                            </Space>
                          </Space>
                        </Card>
                      ))}
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </Space>
      </div>

      <Modal open={!!lockMessage} onCancel={() => setLockMessage(null)} footer={null}>
        <Paragraph>{lockMessage}</Paragraph>
      </Modal>
    </div>
  );
}
