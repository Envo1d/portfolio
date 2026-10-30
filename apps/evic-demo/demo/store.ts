import { covers } from './covers.ts'

type Entity = {
  id: string
  createdAt: string
  updatedAt: string
}

type User = Entity & {
  email: string
  nickname: string
  firstName: string
  lastName: string
  workInterval: number
  breakInterval: number
  intervalsCount: number
}

type Role = Entity & {
  name: string
  rights: string[]
  teamId: string
}

type Member = Entity & {
  user: User
  userId: string
  role: Role
  teamId: string
}

type Team = Entity & {
  name: string
  creator: User
  creatorId: string
  members: Member[]
  roles: Role[]
}

type Task = Entity & {
  name: string
  description: string
  listId: string
  order: number
}

type List = Entity & {
  title: string
  projectId: string
  order: number
  tasks: Task[]
}

type Project = Entity & {
  name: string
  teamId: string
  ownerId: string
  owner: User
  imageId: string
  imageThumbUrl: string
  imageFullUrl: string
  imageUserName: string
  imageLinkHTML: string
  lists: List[]
  members: { id: string; teamMemberId: string }[]
}

type Invitation = Entity & {
  candidate: User
  candidateId: string
  teamId: string
}

type Activity = Entity & {
  teamId: string
  text: string
}

type Timer = Entity & {
  isCompleted?: boolean
  rounds: (Entity & { totalSeconds: number; isCompleted?: boolean })[]
}

type State = {
  version: number
  user: User
  activeTeamId: string
  teams: Team[]
  projects: Project[]
  invitations: Invitation[]
  activity: Activity[]
  timer: Timer | null
}

type Input = {
  name?: string
  title?: string
  imagePath?: string
  description?: string
  listId?: string
  taskId?: string
  ids?: string[]
  tasks?: { id: string; listId: string; order: number }[]
  rights?: string[]
  memberId?: string
  roleId?: string
  candidateEmail?: string
  invitationId?: string
  teamMemberId?: string
  projectMemberId?: string
  projectId?: string
  email?: string
  nickname?: string
  firstName?: string
  lastName?: string
  workInterval?: number
  breakInterval?: number
  intervalsCount?: number
  isCompleted?: boolean
  totalSeconds?: number
}

export const STORAGE_KEY = 'envo1d.evic-demo.v1'

function entity(id: string = crypto.randomUUID()): Entity {
  const now = new Date().toISOString()

  return { id, createdAt: now, updatedAt: now }
}

function user(nickname: string, id: string): User {
  return {
    ...entity(id), email: `${nickname.toLowerCase()}@example.test`, nickname,
    firstName: nickname, lastName: 'Demo', workInterval: 25, breakInterval: 5, intervalsCount: 4,
  }
}

function makeTeam(name: string, id: string, owner: User): Team {
  const admin = { ...entity(`${id}-owner`), name: 'Owner', rights: ['full_access'], teamId: id }
  const editor = { ...entity(`${id}-editor`), name: 'Editor', teamId: id, rights: ['create_project', 'edit_project', 'create_task', 'edit_task'] }

  return {
    ...entity(id), name, creator: owner, creatorId: owner.id, roles: [admin, editor],
    members: [owner, user('Alex', `${id}-alex`), user('Morgan', `${id}-morgan`)].map((person, index) => ({
      ...entity(`${id}-member-${index}`), user: person, userId: person.id,
      role: index === 0 ? admin : editor, teamId: id,
    })),
  }
}

function makeProject(name: string, id: string, team: Team, coverIndex: number): Project {
  const cover = covers[coverIndex % covers.length]

  return {
    ...entity(id), name, teamId: team.id, owner: team.creator, ownerId: team.creatorId,
    imageId: cover.id, imageThumbUrl: cover.url, imageFullUrl: cover.url,
    imageUserName: 'Evic demo', imageLinkHTML: '#/team', lists: [],
    members: team.members.map(member => ({ id: `${id}-${member.id}`, teamMemberId: member.id })),
  }
}

export function seedState(): State {
  const owner = user('Envoid', 'demo-user')
  const teams = [makeTeam('Evic Studio', 'studio', owner), makeTeam('Design Lab', 'design', owner)]
  const projects = [
    makeProject('Evic product launch', 'launch', teams[0], 0),
    makeProject('Website redesign', 'website', teams[0], 1),
    makeProject('Design system', 'system', teams[1], 4),
  ]
  const titles = [
    ['Backlog', 'Map the onboarding flow', 'Prepare launch checklist', 'Explore keyboard shortcuts'],
    ['In progress', 'Build the workspace dashboard', 'Review mobile layouts'],
    ['Review', 'Polish card interactions'],
    ['Done', 'Set up project structure', 'Create brand guidelines'],
  ]

  for (const project of projects) {
    project.lists = titles.map(([title, ...names], order) => {
      const listId = `${project.id}-list-${order}`

      return {
        ...entity(listId), title, projectId: project.id, order,
        tasks: names.map((name, index) => ({
          ...entity(`${listId}-task-${index}`), name, listId, order: index,
          description: 'Sample task: edit the title and description, drag it to another list, or try copying it. Changes stay in this browser.',
        })),
      }
    })
  }

  const community = makeTeam('Community sandbox', 'community', owner)
  community.members = []

  return {
    version: 1, user: owner, activeTeamId: 'studio', teams: [...teams, community], projects,
    invitations: [
      { ...entity('incoming-invite'), candidate: owner, candidateId: owner.id, teamId: 'community' },
      { ...entity('outgoing-invite'), candidate: user('Jamie', 'jamie'), candidateId: 'jamie', teamId: 'studio' },
    ],
    activity: [{ ...entity(), teamId: 'studio', text: 'Demo workspace created with sample boards and tasks.' }],
    timer: null,
  }
}

function loadState(): State {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const value = JSON.parse(saved) as State

      if (value.version === 1 && value.user?.id && Array.isArray(value.teams)
        && Array.isArray(value.projects) && Array.isArray(value.activity)
        && Array.isArray(value.invitations)) {
        return value
      }
    }
  } catch {
    // Storage may be unavailable or contain an older demo.
  }

  return seedState()
}

let state = loadState()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Continue in memory when browser storage is unavailable.
  }
}

export function resetDemo() {
  state = seedState()
  persist()
}

function required<T>(item: T | undefined, name: string): T {
  if (!item) {
    throw new Error(`${name} is no longer available. Return to your boards or reset the demo.`)
  }

  return item
}

function activeTeam() {
  return required(state.teams.find(team => team.id === state.activeTeamId), 'Team')
}

function activeMember() {
  const team = state.teams.find(item => item.id === state.activeTeamId)
  const member = team?.members.find(item => item.userId === state.user.id)

  return {
    ...entity('active-member'), activeTeamId: team?.id || '', activeTeamMemberId: member?.id || '',
    activeRole: member?.role || { id: '', name: '', rights: [] },
  }
}

function taskDetails(task: Task) {
  const project = required(state.projects.find(item => item.lists.some(list => list.id === task.listId)), 'Board')
  const list = required(project.lists.find(item => item.id === task.listId), 'List')

  return { ...task, list: { ...list, tasks: [], project: { ...project, lists: [] } } }
}

function teamRequest(method: string, action: string, id: string | undefined, data: Input): unknown {
  if (method === 'GET') {
    switch (action) {
      case 'user-teams': return { member: state.teams.filter(team => team.members.some(member => member.userId === state.user.id)) }
      case 'get-active-team': return activeMember()
      case 'roles': return activeTeam().roles
      case 'invitations':
      case 'user-invitations': return state.invitations
        .filter(invite => action === 'invitations' ? invite.teamId === state.activeTeamId : invite.candidateId === state.user.id)
        .map(invite => ({ ...invite, team: state.teams.find(team => team.id === invite.teamId) }))
      default: return activeTeam()
    }
  }

  if (action === 'create') {
    const team = makeTeam(data.name || 'New team', crypto.randomUUID(), state.user)
    team.members = team.members.slice(0, 1)
    state.teams.push(team)

    return team
  }

  if (action === 'set-active-team') {
    const team = required(state.teams.find(item => item.id === id), 'Team')
    required(team.members.find(item => item.userId === state.user.id), 'Membership')
    state.activeTeamId = team.id

    return activeMember()
  }

  if (action === 'accept-invite' || action === 'decline-invite') {
    const invite = required(state.invitations.find(item => item.id === id && item.candidateId === state.user.id), 'Invitation')

    if (action === 'accept-invite') {
      const team = required(state.teams.find(item => item.id === invite.teamId), 'Team')
      team.members.push({ ...entity(), user: state.user, userId: state.user.id, role: team.roles[1], teamId: team.id })
    }

    state.invitations = state.invitations.filter(item => item.id !== invite.id)

    return true
  }

  const team = activeTeam()

  switch (action) {
    case 'create-role': {
      const role = { ...entity(), name: data.name || 'New role', rights: data.rights || [], teamId: team.id }
      team.roles.push(role)

      return role
    }
    case 'update-role': {
      const role = required(team.roles.find(item => item.id === id), 'Role')
      Object.assign(role, { name: data.name, rights: data.rights })
      team.members.filter(member => member.role.id === id).forEach(member => { member.role = role })

      return role
    }
    case 'delete-role':
      if (team.members.some(member => member.role.id === id)) {
        throw new Error('Assign another role to these members before deleting this role.')
      }

      team.roles = team.roles.filter(role => role.id !== id)

      return true
    case 'update-member-role': {
      const member = required(team.members.find(item => item.id === data.memberId), 'Member')

      if (member.userId === team.creatorId) {
        throw new Error('The demo owner keeps full access to the workspace.')
      }

      member.role = required(team.roles.find(item => item.id === data.roleId), 'Role')

      return member
    }
    case 'invite-member': {
      const email = data.candidateEmail?.trim().toLowerCase() || ''

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Enter a valid sample email address.')
      }

      if (team.members.some(member => member.user.email === email)
        || state.invitations.some(invite => invite.teamId === team.id && invite.candidate.email === email)) {
        throw new Error('This person is already a member or has a pending invitation.')
      }

      const candidate = { ...user(email.split('@')[0], crypto.randomUUID()), email }
      const invite = { ...entity(), candidate, candidateId: candidate.id, teamId: team.id }
      state.invitations.push(invite)

      return invite
    }
    case 'delete-invite':
      state.invitations = state.invitations.filter(item => item.id !== data.invitationId || item.teamId !== team.id)

      return true
    case 'remove-member':
    case 'leave-team': {
      const member = required(team.members.find(item => item.id === data.memberId), 'Member')

      if (member.userId === team.creatorId && action === 'remove-member') {
        throw new Error('The workspace owner cannot be removed.')
      }

      team.members = team.members.filter(item => item.id !== member.id)
      state.projects.filter(project => project.teamId === team.id).forEach(project => {
        project.members = project.members.filter(item => item.teamMemberId !== member.id)
      })

      if (member.userId === state.user.id) {
        state.activeTeamId = state.teams.find(item => item.members.some(person => person.userId === state.user.id))?.id || ''
      }

      return true
    }
    case '':
      if (method === 'DELETE') {
        state.teams = state.teams.filter(item => item.id !== team.id)
        state.projects = state.projects.filter(item => item.teamId !== team.id)
        state.invitations = state.invitations.filter(item => item.teamId !== team.id)
        state.activeTeamId = state.teams.find(item => item.members.some(member => member.userId === state.user.id))?.id || ''

        return true
      }

      team.name = data.name || team.name

      return team
    default: throw new Error(`Unsupported demo team action: ${action}`)
  }
}

function projectRequest(method: string, action: string, id: string | undefined, data: Input): unknown {
  if (method === 'GET') {
    return action === 'by-team' ? state.projects.filter(item => item.teamId === state.activeTeamId)
      : required(state.projects.find(item => item.id === id && item.teamId === state.activeTeamId), 'Board')
  }

  if (!action && method === 'POST') {
    const project = makeProject(data.name || 'New board', crypto.randomUUID(), activeTeam(), 0)
    const cover = covers.find(item => item.id === data.imagePath?.split('|')[0])

    if (cover) {
      Object.assign(project, { imageId: cover.id, imageThumbUrl: cover.url, imageFullUrl: cover.url })
    }

    state.projects.push(project)

    return project
  }

  const project = required(state.projects.find(item => item.id === (id || data.projectId || action) && item.teamId === state.activeTeamId), 'Board')
  const list = () => required(project.lists.find(item => item.id === data.listId), 'List')

  switch (action) {
    case 'delete':
      state.projects = state.projects.filter(item => item.id !== project.id)

      return project
    case 'add-member': {
      required(activeTeam().members.find(item => item.id === data.teamMemberId), 'Member')
      const member = { ...entity(), teamMemberId: data.teamMemberId! }
      project.members.push(member)

      return member
    }
    case 'delete-member':
      project.members = project.members.filter(item => item.id !== data.projectMemberId)

      return project
    case 'copy-list': {
      const original = list()
      const copy = { ...structuredClone(original), ...entity(), title: `${original.title} (copy)`, order: project.lists.length }
      copy.tasks = copy.tasks.map(task => ({ ...task, ...entity(), listId: copy.id }))
      project.lists.push(copy)

      return copy
    }
    case 'list-title':
      list().title = data.title || list().title

      return list()
    case 'list-order':
      project.lists = (data.ids || []).map((listId, order) => ({ ...required(project.lists.find(item => item.id === listId), 'List'), order }))

      return project.lists
    case 'delete-list': {
      const removed = list()
      project.lists = project.lists.filter(item => item.id !== removed.id)

      return removed
    }
    default:
      if (method === 'PATCH') {
        project.name = data.name || project.name

        return project
      }

      if (method === 'POST') {
        const created = { ...entity(), title: data.title || 'New list', order: project.lists.length, projectId: project.id, tasks: [] }
        project.lists.push(created)

        return created
      }

      throw new Error(`Unsupported demo project action: ${action}`)
  }
}

function taskRequest(method: string, action: string, id: string | undefined, data: Input): unknown {
  if (method === 'GET') {
    const task = state.projects.filter(project => project.teamId === state.activeTeamId)
      .flatMap(project => project.lists).flatMap(list => list.tasks).find(item => item.id === action)

    return taskDetails(required(task, 'Task'))
  }

  const project = required(state.projects.find(item => item.id === (id || action) && item.teamId === state.activeTeamId), 'Board')

  if (action === 'update-order-list') {
    const moved = (data.tasks || []).map(change => {
      const task = required(project.lists.flatMap(list => list.tasks).find(item => item.id === change.id), 'Task')
      required(project.lists.find(list => list.id === change.listId), 'List')

      return { ...task, ...change }
    })

    for (const list of project.lists) {
      list.tasks = list.tasks.filter(task => !moved.some(item => item.id === task.id))
      list.tasks.push(...moved.filter(task => task.listId === list.id))
      list.tasks.sort((a, b) => a.order - b.order).forEach((task, order) => { task.order = order })
    }

    return moved
  }

  const list = required(project.lists.find(item => item.id === data.listId), 'List')

  if (method === 'POST') {
    const task = { ...entity(), name: data.name || 'New card', description: '', listId: list.id, order: list.tasks.length }
    list.tasks.push(task)

    return taskDetails(task)
  }

  const task = required(list.tasks.find(item => item.id === data.taskId), 'Task')

  switch (action) {
    case 'update-name': task.name = data.name || task.name; break
    case 'update-description': task.description = data.description || ''; break
    case 'copy': {
      const copy = { ...structuredClone(task), ...entity(), name: `${task.name} (copy)`, order: list.tasks.length }
      list.tasks.push(copy)

      return taskDetails(copy)
    }
    default: list.tasks = list.tasks.filter(item => item.id !== task.id)
  }

  return taskDetails(task)
}

export async function demoRequest(method: string, url: string, body: object = {}): Promise<unknown> {
  const [, resource, action = '', id] = url.split('/')
  const data = body as Input
  let result: unknown

  if (resource === 'auth') {
    // No credentials, cookies, tokens, or accounts are created in the demo.
    return action === 'logout' ? true : { accessToken: 'demo-only', user: structuredClone(state.user) }
  }

  if (resource === 'user') {
    if (method !== 'GET') {
      for (const key of ['email', 'nickname', 'firstName', 'lastName', 'workInterval', 'breakInterval', 'intervalsCount'] as const) {
        if (data[key] !== undefined) {
          Object.assign(state.user, { [key]: data[key] })
        }
      }

      state.teams.forEach(team => {
        team.members.filter(member => member.userId === state.user.id).forEach(member => { member.user = state.user })
      })
    }

    result = state.user
  } else if (resource === 'team') {
    result = teamRequest(method, action, id, data)
  } else if (resource === 'project') {
    result = projectRequest(method, action, id, data)
  } else if (resource === 'tasks') {
    result = taskRequest(method, action, id, data)
  } else if (resource === 'timer') {
    if (method === 'POST') {
      state.timer = { ...entity(), rounds: Array.from({ length: state.user.intervalsCount }, () => ({ ...entity(), totalSeconds: 0 })) }
    } else if (method === 'DELETE') {
      state.timer = null
    } else if (method === 'PUT') {
      const target = action === 'round' ? state.timer?.rounds.find(round => round.id === id) : state.timer
      Object.assign(required(target || undefined, 'Timer'), data)
    }

    result = state.timer
  } else {
    throw new Error(`Unsupported demo resource: ${resource}`)
  }

  if (method !== 'GET') {
    state.activity.unshift({ ...entity(), teamId: state.activeTeamId, text: `${resource}: ${action || method.toLowerCase()}${data.name ? ` — ${data.name}` : ''}` })
    persist()
  }

  return structuredClone(result)
}

export function getActivity() {
  return structuredClone(state.activity.filter(item => item.teamId === state.activeTeamId))
}
