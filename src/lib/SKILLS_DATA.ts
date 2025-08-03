export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Programming Languages',
    description: 'Core languages for software development',
    skills: [
      {
        name: 'JavaScript',
        level: 'expert',
        description: 'ES6+, TypeScript, modern frameworks',
      },
      {
        name: 'Python',
        level: 'intermediate',
        description: 'Web development, data analysis, automation',
      },
      {
        name: 'TypeScript',
        level: 'advanced',
        description: 'Type-safe JavaScript development',
      },
      {
        name: 'Go',
        level: 'beginner',
        description: 'Backend services and APIs',
      },
      {
        name: 'Java',
        level: 'intermediate',
        description: 'Enterprise applications',
      },
    ],
  },
  {
    id: 'frameworks',
    name: 'Web Frameworks',
    description: 'Modern frameworks for building web applications',
    skills: [
      {
        name: 'React',
        level: 'advanced',
        description: 'Component-based UI development',
      },
      {
        name: 'Next.js',
        level: 'advanced',
        description: 'Full-stack React framework',
      },
      {
        name: 'Node.js',
        level: 'advanced',
        description: 'Server-side JavaScript',
      },
      {
        name: 'Express',
        level: 'advanced',
        description: 'Web application framework',
      },
    ],
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Data storage and management solutions',
    skills: [
      {
        name: 'PostgreSQL',
        level: 'advanced',
        description: 'Relational database management',
      },
      {
        name: 'SQLite',
        level: 'advanced',
        description: 'Lightweight relational database',
      },
      {
        name: 'MySQL',
        level: 'intermediate',
        description: 'Open-source relational database',
      },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    description: 'Cloud platforms and deployment tools',
    skills: [
      {
        name: 'AWS',
        level: 'intermediate',
        description: 'Cloud computing platform',
      },
      {
        name: 'Docker',
        level: 'intermediate',
        description: 'Containerization platform',
      },
      {
        name: 'Kubernetes',
        level: 'intermediate',
        description: 'Container orchestration',
      },
      { name: 'Git', level: 'advanced', description: 'Version control system' },
      {
        name: 'CI/CD',
        level: 'intermediate',
        description: 'Continuous integration/deployment',
      },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Technologies',
    description: 'Modern frontend development tools',
    skills: [
      {
        name: 'Tailwind CSS',
        level: 'advanced',
        description: 'Utility-first CSS framework',
      },
      {
        name: 'Next.js',
        level: 'advanced',
        description: 'React framework for building web applications',
      },
      {
        name: 'React',
        level: 'advanced',
        description: 'React framework for building web applications',
      },
      {
        name: 'Shadcn UI',
        level: 'advanced',
        description: 'Component library for React',
      },
      {
        name: 'HTML5',
        level: 'advanced',
        description: 'Semantic markup and structure',
      },
      {
        name: 'CSS3',
        level: 'advanced',
        description: 'Styling and animations',
      },
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    description: 'Cross-platform mobile development',
    skills: [
      {
        name: 'Flutter',
        level: 'intermediate',
        description: "Google's UI toolkit",
      },
    ],
  },
  {
    id: 'testing',
    name: 'Testing & Quality',
    description: 'Testing frameworks and quality assurance',
    skills: [
      {
        name: 'Jest',
        level: 'advanced',
        description: 'JavaScript testing framework',
      },
      {
        name: 'Mocha & Chai',
        level: 'intermediate',
        description: 'TypeScript testing framework',
      },
      {
        name: 'ESLint',
        level: 'intermediate',
        description: 'Code linting and formatting',
      },
    ],
  },
  {
    id: 'tools',
    name: 'Development Tools',
    description: 'Essential development and productivity tools',
    skills: [
      {
        name: 'VS Code || Cursor',
        level: 'expert',
        description: 'Code editor and IDE',
      },
      {
        name: 'Figma',
        level: 'intermediate',
        description: 'Design and prototyping',
      },
      {
        name: 'Postman',
        level: 'advanced',
        description: 'API development and testing',
      },
      {
        name: 'Chrome DevTools',
        level: 'advanced',
        description: 'Web debugging and profiling',
      },
      { name: 'Git', level: 'expert', description: 'Version control system' },
    ],
  },
  {
    id: 'soft-skills',
    name: 'Soft Skills',
    description: 'Professional and interpersonal skills',
    skills: [
      {
        name: 'Team Leadership',
        level: 'advanced',
        description: 'Leading development teams',
      },
      {
        name: 'Agile/Scrum',
        level: 'advanced',
        description: 'Project management methodologies',
      },
      {
        name: 'Technical Writing',
        level: 'intermediate',
        description: 'Documentation and communication',
      },
      {
        name: 'Problem Solving',
        level: 'advanced',
        description: 'Analytical and creative thinking',
      },
      {
        name: 'Communication',
        level: 'advanced',
        description: 'Effective communication',
      },
      { name: 'Adaptability', level: 'advanced', description: 'Adaptability' },
    ],
  },
  {
    id: 'emerging',
    name: 'Emerging Technologies',
    description: 'Cutting-edge technologies and trends',
    skills: [
      {
        name: 'AI/ML',
        level: 'intermediate',
        description: 'Machine learning basics',
      },
      {
        name: 'Blockchain',
        level: 'beginner',
        description: 'Distributed ledger technology',
      },
      {
        name: 'Web3',
        level: 'beginner',
        description: 'Decentralized web applications',
      },
      {
        name: 'GraphQL',
        level: 'intermediate',
        description: 'Query language for APIs',
      },
    ],
  },
];
