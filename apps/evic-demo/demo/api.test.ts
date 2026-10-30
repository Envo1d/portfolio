import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { IProjectResponse, IProjectListResponse } from '../types/project.types.ts'
import type { ITaskResponse } from '../types/task.types.ts'
import type { ITeamResponse, ITeamRoleResponse, ITeamInviteResponse, IActiveTeamMemberResponse, IUserTeams } from '../types/team.types.ts'
import type { IUser } from '../types/user.types.ts'
import { demoRequest, resetDemo, STORAGE_KEY } from './store.ts'

async function request<T>(method: string, path: string, body?: object): Promise<T> {
  return await demoRequest(method, path, body) as T
}

test('board workflow: create, edit, copy, reorder, move, delete, and isolate teams', async () => {
  resetDemo()
  const board = await request<IProjectResponse>('POST', '/project', { name: 'Test board' })
  const source = await request<IProjectListResponse>('POST', `/project/${board.id}`, { title: 'Queue' })
  const target = await request<IProjectListResponse>('POST', `/project/${board.id}`, { title: 'Done' })
  const card = await request<ITaskResponse>('POST', `/tasks/${board.id}`, { name: 'Test card', listId: source.id })
  await request('PATCH', `/tasks/update-description/${board.id}`, { taskId: card.id, listId: source.id, description: 'Edited description' })
  await request('PATCH', `/tasks/update-name/${board.id}`, { taskId: card.id, listId: source.id, name: 'Edited card' })
  const copy = await request<ITaskResponse>('PUT', `/tasks/copy/${board.id}`, { taskId: card.id, listId: source.id })
  assert.notEqual(copy.id, card.id)
  await request('PATCH', `/tasks/update-order-list/${board.id}`, { tasks: [{ id: card.id, listId: target.id, order: 0 }] })
  const moved = await request<ITaskResponse>('GET', `/tasks/${card.id}`)
  assert.equal(moved.listId, target.id)
  assert.equal(moved.list.projectId, board.id)
  assert.equal(moved.description, 'Edited description')
  const listCopy = await request<IProjectListResponse>('POST', `/project/copy-list/${board.id}`, { listId: target.id })
  assert.notEqual(listCopy.tasks[0].id, card.id)
  assert.equal(listCopy.tasks[0].listId, listCopy.id)
  await request('PATCH', `/project/list-order/${board.id}`, { ids: [target.id, source.id, listCopy.id] })
  await request('PATCH', `/project/list-title/${board.id}`, { listId: target.id, title: 'Complete' })
  await request('PATCH', `/project/${board.id}`, { name: 'Renamed board' })
  const details = await request<IProjectResponse>('GET', `/project/details/${board.id}`)
  assert.equal(details.name, 'Renamed board')
  assert.equal(details.lists![0].title, 'Complete')
  assert.equal(details.lists![1].tasks.length, 1)
  // Returned query data must not mutate stored demo data.
  details.lists![0].tasks[0].name = 'Accidental query mutation'
  assert.equal((await request<ITaskResponse>('GET', `/tasks/${card.id}`)).name, 'Edited card')
  await request('PUT', '/team/set-active-team/design')
  assert.equal((await request<IProjectResponse[]>('GET', '/project/by-team')).some(item => item.id === board.id), false)
  await assert.rejects(request('GET', `/project/details/${board.id}`), /Board/)
  await request('PUT', '/team/set-active-team/studio')
  await request('PUT', `/tasks/${board.id}`, { listId: target.id, taskId: card.id })
  await assert.rejects(request('GET', `/tasks/${card.id}`), /Task/)
  await request('PUT', `/project/delete-list/${board.id}`, { listId: target.id })
  await request('PUT', `/project/delete/${board.id}`)
  await assert.rejects(request('GET', `/project/details/${board.id}`), /Board/)
})

test('team workflow: roles, members, mock invitations, leaving and deleting teams', async () => {
  resetDemo()
  const role = await request<ITeamRoleResponse>('POST', '/team/create-role', { name: 'Reviewer', rights: ['edit_task'] })
  await request('PATCH', `/team/update-role/${role.id}`, { name: 'Senior reviewer', rights: ['edit_task', 'create_task'] })
  await request('PATCH', '/team/update-member-role', { memberId: 'studio-member-1', roleId: role.id })
  await assert.rejects(request('DELETE', `/team/delete-role/${role.id}`), /Assign another role/)
  await request('PUT', '/team/remove-member', { memberId: 'studio-member-1' })
  await request('DELETE', `/team/delete-role/${role.id}`)
  await assert.rejects(request('PATCH', '/team/update-member-role', { memberId: 'studio-member-0', roleId: 'studio-editor' }), /owner/)
  const invite = await request<ITeamInviteResponse>('POST', '/team/invite-member', { candidateEmail: 'tester@example.test' })
  assert.equal(invite.candidate?.email, 'tester@example.test')
  await assert.rejects(request('POST', '/team/invite-member', { candidateEmail: 'tester@example.test' }), /pending invitation/)
  await request('PUT', '/team/delete-invite', { invitationId: invite.id, candidateId: invite.candidateId })
  await request('PUT', '/team/accept-invite/incoming-invite')
  assert.equal((await request<IUserTeams>('GET', '/team/user-teams')).member.some(team => team.id === 'community'), true)
  const team = await request<ITeamResponse>('POST', '/team/create', { name: 'Temporary team' })
  await request('PUT', `/team/set-active-team/${team.id}`)
  await request('PUT', '/team', { name: 'Updated team' })
  assert.equal((await request<ITeamResponse>('GET', '/team')).name, 'Updated team')
  const active = await request<IActiveTeamMemberResponse>('GET', '/team/get-active-team')
  await request('PUT', '/team/leave-team', { memberId: active.activeTeamMemberId })
  assert.equal((await request<IUserTeams>('GET', '/team/user-teams')).member.some(item => item.id === team.id), false)
  await request('PUT', '/team/set-active-team/design')
  await request('DELETE', '/team')
  assert.equal((await request<IUserTeams>('GET', '/team/user-teams')).member.some(item => item.id === 'design'), false)
})

test('profile persistence, no saved passwords, reset, and no network access', async () => {
  resetDemo()
  const saved = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => saved.set(key, value) },
  })
  const originalFetch = globalThis.fetch
  globalThis.fetch = () => { throw new Error('The demo must never call fetch') }

  try {
    await request('POST', '/auth/register', { email: 'sample@example.test', password: 'do-not-store' })
    await request('PUT', '/user/update', { nickname: 'Visitor', password: 'do-not-store' })
    assert.equal((await request<IUser>('GET', '/user/profile')).nickname, 'Visitor')
    assert.equal(saved.get(STORAGE_KEY)?.includes('do-not-store'), false)
    assert.equal(JSON.parse(saved.get(STORAGE_KEY)!).user.nickname, 'Visitor')
    await request('POST', '/auth/logout')
    resetDemo()
    assert.equal((await request<IUser>('GET', '/user/profile')).nickname, 'Envoid')
    assert.equal((await request<IProjectResponse[]>('GET', '/project/by-team')).length, 2)
  } finally {
    globalThis.fetch = originalFetch
    Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
