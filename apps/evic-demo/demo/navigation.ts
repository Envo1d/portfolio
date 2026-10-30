import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)

  return () => window.removeEventListener('hashchange', callback)
}

export function usePathname() {
  return useSyncExternalStore(subscribe, () => window.location.hash.slice(1) || '/team')
}

function push(path: string) {
  window.location.hash = path === '/' ? '/team' : path
}

const router = {
  push,
  replace: push,
  refresh: () => window.dispatchEvent(new HashChangeEvent('hashchange')),
  back: () => window.history.back(),
}

export function useRouter() {
  return router
}
