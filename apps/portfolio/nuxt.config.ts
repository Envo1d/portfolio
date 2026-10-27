import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
const baseURL = process.env.NUXT_APP_BASE_URL || '/'
export default defineNuxtConfig({
  compatibilityDate: '2026-10-27',
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  devtools: { enabled: false },
  app: { baseURL, head: { title: 'Envo1d // Neural Interface', htmlAttrs: { lang: 'en' }, meta: [{ name: 'description', content: 'Envo1d — an interactive developer portfolio. Explore the stack and run independent React and Vue demo applications.' }], link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg?v=2` }] } },
  nitro: { prerender: { routes: ['/', '/projects', '/lab', '/stack', '/contact'] } },
  typescript: { strict: true }
})

