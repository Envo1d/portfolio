import { defineStore } from 'pinia'
import { projects } from '~/data/projects'
export interface LabWindow { id: string; x: number; y: number; z: number; minimized: boolean; maximized: boolean; device: 'desktop' | 'tablet' | 'mobile' }
export const useDesktopStore = defineStore('desktop', () => {
  const terminalOpen = ref(false)
  const windows = ref<LabWindow[]>([])
  let layer = 20
  function open(id: string) {
    if (!projects.some(project => project.id === id)) return
    const existing = windows.value.find(w => w.id === id)
    if (existing) { existing.minimized = false; existing.z = ++layer; return }
    const viewport = import.meta.client ? window.innerWidth : 1280
    const sidebar = viewport <= 640 ? 0 : viewport <= 900 ? 74 : viewport <= 1150 ? 200 : 234
    const offset = (windows.value.length % 3) * 24
    windows.value.push({ id, x: sidebar + 24 + offset, y: 240 + offset, z: ++layer, minimized: false, maximized: false, device: 'desktop' })
  }
  function focus(id: string) { const w = windows.value.find(w => w.id === id); if (w) w.z = ++layer }
  function close(id: string) { windows.value = windows.value.filter(w => w.id !== id) }
  return { terminalOpen, windows, open, focus, close }
})
