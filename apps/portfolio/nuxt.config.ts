import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2026-10-27',
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  devtools: { enabled: false },
  app: { head: { title: 'Envo1d // Neural Interface', htmlAttrs: { lang: 'en' }, meta: [{ name: 'description', content: 'Envo1d — an interactive developer portfolio. Explore the stack and run independent React and Vue demo applications.' }], link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2' }] } },
  nitro: { prerender: { routes: ['/', '/projects', '/lab', '/stack', '/contact'] } },
  typescript: { strict: true }
})

