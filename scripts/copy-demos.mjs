import { cp, mkdir } from 'node:fs/promises'
const root = new URL('../', import.meta.url)
for (const app of ['react-demo', 'vue-demo']) {
  const target = new URL(`apps/portfolio/public/demos/${app}/`, root)
  await mkdir(target, { recursive: true })
  await cp(new URL(`apps/${app}/dist/`, root), target, { recursive: true })
}
console.log('Independent demos mounted at /demos/react-demo/ and /demos/vue-demo/')
