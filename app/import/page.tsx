'use client';

import { InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Upload,
  message,
} from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { ChangeEvent, useState } from 'react';

import { useDataContext } from '@/providers/DataProvider';
import type { AnswerVariant, QuestionRecord } from '@/types';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

const parseList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
      } catch {
        return trimmed.split('|').map((item) => item.trim()).filter(Boolean);
      }
    }
    return trimmed.split('|').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const parseNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const parseWeeklyMentions = (value: unknown): number[] => {
  const raw = parseList(value);
  return raw.map((item) => parseNumber(item));
};

const parseAnswerVariant = (
  input: Partial<AnswerVariant>,
  fallbackIndex: number,
): AnswerVariant | null => {
  if (!input.title && !input.url) {
    return null;
  }

  const allowedSources: AnswerVariant['source'][] = ['youtube', 'article', 'podcast', 'blog'];
  const source = allowedSources.includes(input.source as AnswerVariant['source'])
    ? (input.source as AnswerVariant['source'])
    : 'article';

  return {
    id: input.id ?? `variant-${fallbackIndex}`,
    source,
    title: input.title ?? 'Альтернативный ответ',
    contributor: input.contributor ?? 'community',
    summary: input.summary ?? '',
    url: input.url ?? '#',
    timecode: input.timecode,
    publishedAt: input.publishedAt ?? new Date().toISOString(),
  };
};

const parseAnswerVariants = (value: unknown): AnswerVariant[] => {
  if (!value) return [];

  const normalize = (entry: unknown): Partial<AnswerVariant> | null => {
    if (typeof entry === 'string') {
      try {
        const parsed = JSON.parse(entry);
        return typeof parsed === 'object' && parsed ? (parsed as Partial<AnswerVariant>) : null;
      } catch {
        return null;
      }
    }
    if (typeof entry === 'object' && entry) {
      return entry as Partial<AnswerVariant>;
    }
    return null;
  };

  const items = Array.isArray(value)
    ? value
    : typeof value === 'string'
    ? (() => {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })()
    : [];

  return items
    .map(normalize)
    .map((entry, index) => (entry ? parseAnswerVariant(entry, index) : null))
    .filter((variant): variant is AnswerVariant => Boolean(variant));
};

const toQuestionRecord = (input: Partial<QuestionRecord>): QuestionRecord | null => {
  if (!input.roleSlug || !input.roleName || !input.category || !input.title) {
    return null;
  }
  const id = input.id ?? `${input.roleSlug}-${input.level ?? 'junior'}-${input.title}`;
  const level = (input.level ?? 'junior') as QuestionRecord['level'];
  const type = (input.type ?? 'theory') as QuestionRecord['type'];
  const interviewStage = (input.interviewStage ?? 'screening') as QuestionRecord['interviewStage'];
  return {
    id,
    roleSlug: input.roleSlug,
    roleName: input.roleName,
    category: input.category,
    title: input.title,
    level,
    type,
    interviewStage,
    tags: parseList(input.tags),
    sampleAnswer: input.sampleAnswer ?? 'Ответ не указан',
    why: input.why ?? 'Причина не указана',
    pitfalls: parseList(input.pitfalls),
    followUps: parseList(input.followUps),
    frequencyScore: parseNumber(input.frequencyScore),
    chance: parseNumber(input.chance ?? input.frequencyScore ?? 0),
    companies: parseList(input.companies),
    weeklyMentions: input.weeklyMentions ? parseWeeklyMentions(input.weeklyMentions) : Array(8).fill(0),
    answerVariants: parseAnswerVariants(input.answerVariants),
  };
};

const parseCsv = (text: string): Partial<QuestionRecord>[] => {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map((header) => header.trim());
  const rows: Partial<QuestionRecord>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = [] as string[];
    let current = '';
    let inQuotes = false;
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    const record: Partial<QuestionRecord> = {};
    headers.forEach((header, index) => {
      const key = header as keyof QuestionRecord;
      record[key] = row[index] as never;
    });
    rows.push(record);
  }
  return rows;
};

export default function ImportPage() {
  const { importQuestions, replaceWithSynthetic, isCustom, lastUpdated, bundle } = useDataContext();
  const [status, setStatus] = useState<string>('');

  const processFile = async (file: File) => {
    try {
      const content = await file.text();
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          const records = parsed
            .map((item) => toQuestionRecord(item as Partial<QuestionRecord>))
            .filter((item): item is QuestionRecord => Boolean(item));
          importQuestions(records);
          setStatus(`Импортировано ${records.length} вопросов из JSON.`);
        } else if (parsed?.questions) {
          const records = (parsed.questions as Partial<QuestionRecord>[])
            .map((item) => toQuestionRecord(item))
            .filter((item): item is QuestionRecord => Boolean(item));
          importQuestions(records, Array.isArray(parsed.companies) ? parsed.companies : undefined);
          setStatus(`Импортировано ${records.length} вопросов из JSON-объекта.`);
        } else {
          throw new Error('Неизвестная структура JSON.');
        }
      } else if (file.name.endsWith('.csv')) {
        const rows = parseCsv(content);
        const records = rows
          .map((item) => toQuestionRecord(item))
          .filter((item): item is QuestionRecord => Boolean(item));
        importQuestions(records);
        setStatus(`Импортировано ${records.length} вопросов из CSV.`);
      } else {
        throw new Error('Поддерживаются только файлы CSV или JSON.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Ошибка импорта. Проверьте формат и попробуйте снова.');
      message.error('Не удалось обработать файл.');
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void processFile(file);
  };

  return (
    <div style={{ background: '#f5f5f5' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}>
        <Space direction="vertical" size={32} style={{ width: '100%' }}>
          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Сервисная страница
            </Text>
            <Title level={1} style={{ margin: 0 }}>
              Импорт вопросов
            </Title>
            <Paragraph style={{ margin: 0, color: '#595959' }}>
              Загрузите JSON или CSV со структурой вопроса (title, type, level, tags, sampleAnswer, why, pitfalls, followUps,
              frequencyScore, chance, companies, weeklyMentions). Текущие данные будут заменены без перезапуска приложения.
            </Paragraph>
          </Card>

          <Dragger
            name="file"
            multiple={false}
            showUploadList={false}
            accept=".json,.csv"
            beforeUpload={(file) => {
              void processFile(file as RcFile);
              return false;
            }}
            style={{ borderRadius: 24 }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <InboxOutlined style={{ fontSize: 32, color: '#6366f1' }} />
              <Title level={4} style={{ margin: 0 }}>
                Перетащите файл сюда или нажмите для выбора
              </Title>
              <Text type="secondary">Поддерживаются файлы JSON и CSV</Text>
            </Space>
          </Dragger>
          <input type="file" accept=".json,.csv" onChange={handleInputChange} style={{ display: 'none' }} />
          {status && (
            <Card style={{ borderRadius: 24 }}>
              <Text>{status}</Text>
            </Card>
          )}

          <Card style={{ borderRadius: 24 }} bodyStyle={{ padding: 24 }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Space direction="vertical" size={8}>
                  <Title level={4} style={{ margin: 0 }}>
                    Текущие данные
                  </Title>
                  <Text type="secondary">
                    Источник: {isCustom ? 'импорт пользователя' : 'синтетика easyOffer demo'}
                  </Text>
                  <Text type="secondary">Вопросов: {bundle.questions.length}</Text>
                  <Text type="secondary">Обновлено: {lastUpdated.toLocaleString('ru-RU')}</Text>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space direction="vertical" size={12}>
                  <Title level={4} style={{ margin: 0 }}>
                    Сброс
                  </Title>
                  <Text type="secondary">
                    Вернуться к синтетическим данным easyOffer demo. Полезно, если импорт был неудачным.
                  </Text>
                  <Button
                    onClick={() => {
                      replaceWithSynthetic();
                      setStatus('Восстановлена синтетическая база вопросов.');
                      message.success('Синтетические данные восстановлены');
                    }}
                  >
                    Вернуть синтетику
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card style={{ borderRadius: 24 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Title level={4} style={{ margin: 0 }}>
              Пример структуры JSON
            </Title>
            <Typography.Paragraph
              style={{
                margin: 0,
                background: '#111827',
                color: '#e5e7eb',
                borderRadius: 16,
                padding: 16,
                fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`[
  {
    "roleSlug": "frontend",
    "roleName": "Frontend Developer",
    "category": "Web",
    "title": "Что такое Virtual DOM?",
    "level": "middle",
    "type": "theory",
    "tags": ["react", "performance"],
    "sampleAnswer": "DOM-абстракция, позволяющая минимизировать обращения к реальному DOM.",
    "why": "Понимание производительности UI",
    "pitfalls": ["перепутать diff с reconciliation"],
    "followUps": ["Как работает reconciliation?"],
    "frequencyScore": 78,
    "chance": 65,
    "companies": ["Google", "Yandex"],
    "weeklyMentions": [12, 16, 14, 18]
  }
]`}
            </Typography.Paragraph>
          </Card>
        </Space>
      </div>
    </div>
  );
}
