import { projects } from '~/data/projects'

// Keep personal copy and featured selection together for easy updates.
export const overview = {
  role: 'Software Developer',
  headline: 'Web & desktop applications.',
  introduction: 'I develop web and desktop applications. My current interests are AI development, systems programming, and blockchain.',

  featuredIds: ['nexa', 'evic'],
  technologies: ['TypeScript', 'Vue', 'React', 'Node.js', 'Rust', 'Tauri'],
  directions: [
    { id: 'interfaces', title: 'Full-stack web', description: 'Developing web applications, from interactive interfaces to server-side logic and data.', technologies: 'Vue / React / TypeScript' },
    { id: 'systems', title: 'Exploring new ground', description: 'Current interests: AI development, systems programming, and blockchain.', technologies: 'AI / Systems / Blockchain' },
    { id: 'desktop', title: 'Desktop applications', description: 'Building desktop applications. Currently learning Rust and exploring systems programming.', technologies: 'Rust / Tauri' },
  ],
  focus: {
    title: 'AI Agent Orchestrator',
    description: 'Currently working on AI Agent Orchestrator, alongside my focus on full-stack web and desktop development.',
    tags: ['AI development', 'In development'],
    learning: 'Rust',

  },
}

export const featuredProjects = overview.featuredIds
  .map(id => projects.find(project => project.id === id))
  .filter((project): project is (typeof projects)[number] => Boolean(project))


