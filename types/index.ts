export type ExperienceLevel = 'junior' | 'middle' | 'senior';

export type QuestionType = 'theory' | 'coding' | 'behavioral' | 'system_design';

export type InterviewStage = 'screening' | 'technical' | 'on_site' | 'take_home';

export interface RoleDefinition {
  slug: string;
  name: string;
  category: string;
}

export interface QuestionRecord {
  id: string;
  roleSlug: string;
  roleName: string;
  category: string;
  title: string;
  level: ExperienceLevel;
  type: QuestionType;
  interviewStage: InterviewStage;
  tags: string[];
  sampleAnswer: string;
  why: string;
  pitfalls: string[];
  followUps: string[];
  frequencyScore: number;
  chance: number;
  companies: string[];
  weeklyMentions: number[];
}

export interface DataBundle {
  roles: RoleDefinition[];
  questions: QuestionRecord[];
  companies: string[];
}
