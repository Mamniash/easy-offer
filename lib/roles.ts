import type { RoleDefinition } from '@/types';

export interface RoleGroup {
	roles: RoleDefinition[]
}

export const roleGroups: RoleGroup[] = [
	{
		roles: [
			{ slug: 'frontend', name: 'Frontend' },
			{ slug: 'backend-nodejs', name: 'Backend (Node.js)' },
			{ slug: 'backend-java', name: 'Backend (Java)' },
			{ slug: 'backend-php', name: 'Backend (PHP)' },
			{ slug: 'backend-python', name: 'Backend (Python)' },
			{ slug: 'backend-csharp', name: 'Backend (C#)' },
			{ slug: 'backend-cpp', name: 'Backend (C/C++)' },
			{ slug: 'flutter', name: 'Flutter' },
			{ slug: 'android', name: 'Android' },
			{ slug: 'ios', name: 'iOS / Swift' },
			{ slug: 'golang', name: 'Golang' },
			{ slug: 'devops', name: 'DevOps' },
			{
				slug: 'data-engineer',
				name: 'Data Engineer'
			},
			{ slug: 'unity', name: 'Unity' },
			{ slug: 'one-c', name: '1C' }
		]
	},
	{
		roles: [
			{ slug: 'qa', name: 'QA' },
			{ slug: 'aqa', name: 'AQA' }
		]
	},
	{
		roles: [
			{
				slug: 'business-analyst',
				name: 'Business Analyst'
			},
			{
				slug: 'data-analyst',
				name: 'Data Analyst'
			},
			{
				slug: 'data-scientist',
				name: 'Data Scientist'
			},
			{
				slug: 'system-analyst',
				name: 'System Analyst'
			},
			{
				slug: 'product-analyst',
				name: 'Product Analyst'
			}
		]
	},
	{
		roles: [
			{
				slug: 'it-project-manager',
				name: 'IT Project Manager'
			},
			{
				slug: 'it-product-manager',
				name: 'IT Product Manager'
			}
		]
	}
]

export const allRoles: RoleDefinition[] = roleGroups.flatMap((group) => group.roles);
