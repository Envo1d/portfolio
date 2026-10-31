export interface Project { id: string; name: string; framework: 'React' | 'Vue'; category: string; description: string; github?: string; url: string; tags: string[]; accent: string; index: string }
export const projects: Project[] = [
  { id: 'nexa', name: 'Nexa', framework: 'Vue', category: 'Media management', description: 'A desktop media library built with Tauri, Vue, and Rust. Explore the original client in its browser demo mode with sample media, tags, filters, and collections.', github: 'https://github.com/Envo1d/nexa', url: '/demos/nexa-demo/', tags: ['Vue', 'TypeScript', 'Tauri', 'Rust'], accent: 'cyan', index: '01' },
  { id: 'evic', name: 'Evic App', framework: 'React', category: 'Team collaboration', description: 'A Jira-inspired project management application developed as a diploma project, featuring custom authentication and a Clerk-inspired authorization model with team workspaces, role-based access control, and granular permissions.', url: '/demos/evic-demo/', tags: ['Next.js', 'TypeScript', 'TanStack Query', 'Drag & drop'], accent: 'cyan', index: '02' }
]
export const stack = ['Node.js', 'C#', 'React', 'Vue', 'Next.js', 'Docker', 'Express.js', 'Fastify', 'PostgreSQL', 'Redis', 'Rust', 'Tauri']
// Add only verified public URLs here. Missing contacts remain visibly unconfigured.
export const profile = { name: 'Envoid', github: null as string | null, email: null as string | null }


