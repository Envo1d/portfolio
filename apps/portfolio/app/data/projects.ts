export interface Project { id: string; name: string; framework: 'React' | 'Vue'; category: string; description: string; url: string; tags: string[]; accent: string; index: string }
export const projects: Project[] = [
  { id: 'signal', name: 'Signal dashboard', framework: 'React', category: 'Data visualization', description: 'A small interactive analytics workspace. Change the time range and inspect generated signal data.', url: '/demos/react-demo/', tags: ['React', 'TypeScript', 'Vite'], accent: 'cyan', index: '01' },
  { id: 'evic', name: 'Evic App', framework: 'React', category: 'Team collaboration', description: 'A Jira-inspired project management application developed as a diploma project, featuring custom authentication and a Clerk-inspired authorization model with team workspaces, role-based access control, and granular permissions.', url: '/demos/evic-demo/', tags: ['Next.js', 'TypeScript', 'TanStack Query', 'Drag & drop'], accent: 'cyan', index: '02' }
]
export const stack = ['Node.js', 'C#', 'React', 'Vue', 'Next.js', 'Docker', 'Express.js', 'Fastify', 'PostgreSQL', 'Redis', 'Rust', 'Tauri']
// Add only verified public URLs here. Missing contacts remain visibly unconfigured.
export const profile = { name: 'Envoid', github: null as string | null, email: null as string | null }


