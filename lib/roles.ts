import type { RoleDefinition } from '@/types';

export interface RoleGroup {
  category: string;
  roles: RoleDefinition[];
}

export const roleGroups: RoleGroup[] = [
  {
    category: 'Программирование',
    roles: [
      { slug: 'frontend', name: 'Frontend', category: 'Программирование' },
      { slug: 'backend-nodejs', name: 'Backend (Node.js)', category: 'Программирование' },
      { slug: 'backend-java', name: 'Backend (Java)', category: 'Программирование' },
      { slug: 'backend-php', name: 'Backend (PHP)', category: 'Программирование' },
      { slug: 'backend-python', name: 'Backend (Python)', category: 'Программирование' },
      { slug: 'backend-csharp', name: 'Backend (C#)', category: 'Программирование' },
      { slug: 'backend-cpp', name: 'Backend (C/C++)', category: 'Программирование' },
      { slug: 'flutter', name: 'Flutter', category: 'Программирование' },
      { slug: 'android', name: 'Android', category: 'Программирование' },
      { slug: 'ios', name: 'iOS / Swift', category: 'Программирование' },
      { slug: 'golang', name: 'Golang', category: 'Программирование' },
      { slug: 'devops', name: 'DevOps', category: 'Программирование' },
      { slug: 'data-engineer', name: 'Data Engineer', category: 'Программирование' },
      { slug: 'unity', name: 'Unity', category: 'Программирование' },
      { slug: 'one-c', name: '1C', category: 'Программирование' },
    ],
  },
  {
    category: 'Тестирование',
    roles: [
      { slug: 'qa', name: 'QA', category: 'Тестирование' },
      { slug: 'aqa', name: 'AQA', category: 'Тестирование' },
    ],
  },
  {
    category: 'Аналитика / Data',
    roles: [
      { slug: 'business-analyst', name: 'Business Analyst', category: 'Аналитика / Data' },
      { slug: 'data-analyst', name: 'Data Analyst', category: 'Аналитика / Data' },
      { slug: 'data-scientist', name: 'Data Scientist', category: 'Аналитика / Data' },
      { slug: 'system-analyst', name: 'System Analyst', category: 'Аналитика / Data' },
      { slug: 'product-analyst', name: 'Product Analyst', category: 'Аналитика / Data' },
    ],
  },
  {
    category: 'Управление',
    roles: [
      { slug: 'it-project-manager', name: 'IT Project Manager', category: 'Управление' },
      { slug: 'it-product-manager', name: 'IT Product Manager', category: 'Управление' },
    ],
  },
];

export const allRoles: RoleDefinition[] = roleGroups.flatMap((group) => group.roles);
