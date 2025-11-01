'use client';

import { ChangeEvent, useState } from 'react';

import { useDataContext } from '@/providers/DataProvider';
import type { QuestionRecord } from '@/types';

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

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result as string;
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
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-slate-500">Сервисная страница</p>
        <h1 className="text-3xl font-semibold text-slate-900">Импорт вопросов</h1>
        <p className="text-slate-600">
          Загрузите JSON или CSV со структурой вопроса (title, type, level, tags, sampleAnswer, why,
          pitfalls, followUps, frequencyScore, chance, companies, weeklyMentions). Текущие данные будут
          заменены без перезапуска приложения.
        </p>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500">Перетащите файл сюда или выберите вручную.</p>
        <input
          type="file"
          accept=".json,.csv"
          onChange={handleFile}
          className="mt-4 block w-full cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-sm"
        />
        {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
      </div>

      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Текущие данные</h2>
          <p className="text-sm text-slate-500">
            Источник: {isCustom ? 'импорт пользователя' : 'синтетика easyOffer demo'}
          </p>
          <p className="text-sm text-slate-500">Вопросов: {bundle.questions.length}</p>
          <p className="text-sm text-slate-500">Обновлено: {lastUpdated.toLocaleString('ru-RU')}</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Сброс</h2>
          <p className="text-sm text-slate-500">
            Вернуться к синтетическим данным easyOffer demo. Полезно, если импорт был неудачным.
          </p>
          <button
            type="button"
            onClick={() => {
              replaceWithSynthetic();
              setStatus('Восстановлена синтетическая база вопросов.');
            }}
            className="w-fit rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            Вернуть синтетику
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Пример структуры JSON</h2>
        <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-left text-xs text-slate-100">
{`{
  "questions": [
    {
      "id": "frontend-architecture-junior",
      "roleSlug": "frontend",
      "roleName": "Frontend",
      "category": "Программирование",
      "title": "Как джуниор Frontend объяснит архитектуру компонентов?",
      "level": "junior",
      "type": "system_design",
      "interviewStage": "technical",
      "tags": ["react", "architecture"],
      "sampleAnswer": "...",
      "why": "...",
      "pitfalls": ["..."] ,
      "followUps": ["..."],
      "frequencyScore": 82,
      "chance": 65,
      "companies": ["TechNova"],
      "weeklyMentions": [12, 14, 16, 11, 9, 18, 22, 20]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}
