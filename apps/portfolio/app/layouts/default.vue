<script setup lang="ts">
import { Activity, ArrowUpRight, Box, Command, Cpu, FolderOpen, Github, Hexagon, Mail, Terminal, X } from 'lucide-vue-next'
const desktop = useDesktopStore()
const route = useRoute()
const nav = [{ to: '/', label: 'Overview', icon: Command, n: '01' }, { to: '/projects', label: 'Project Explorer', icon: FolderOpen, n: '02' }, { to: '/lab', label: 'Project Lab', icon: Box, n: '03' }, { to: '/stack', label: 'Tech Stack', icon: Cpu, n: '04' }, { to: '/contact', label: 'Connect', icon: Mail, n: '05' }]
const clock = ref('--:--:--')
let timer: ReturnType<typeof setInterval>
function shortcuts(event: KeyboardEvent) { if ((event.ctrlKey || event.metaKey) && event.key === '`') { event.preventDefault(); desktop.terminalOpen = !desktop.terminalOpen } }
onMounted(() => { timer = setInterval(() => { clock.value = new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC' }) }, 1000); window.addEventListener('keydown', shortcuts) })
onUnmounted(() => { clearInterval(timer); window.removeEventListener('keydown', shortcuts) })
</script>
<template>
  <div class="os-shell">
    <a class="skip-link" href="#main">Skip to content</a>
    <aside class="sidebar">
      <NuxtLink class="brand" to="/" aria-label="Envo1d overview"><Hexagon :size="32" /><span>ENVO1D<span class="brand-sub">NEURAL INTERFACE</span></span></NuxtLink>
      <div class="side-label">WORKSPACE <span>v1.0</span></div>
      <nav aria-label="Main navigation"><NuxtLink v-for="item in nav" :key="item.to" :to="item.to" :aria-label="item.label" :class="['nav-item', { selected: route.path === item.to }]"><component :is="item.icon" :size="18" /><span>{{ item.label }}</span><small>{{ item.n }}</small></NuxtLink></nav>
      <div class="side-label tools-label">SYSTEM TOOLS</div>
      <button class="nav-item terminal-nav" @click="desktop.terminalOpen = true"><Terminal :size="18" /><span>Terminal</span><kbd>⌃ `</kbd></button>
      <div class="side-card"><span class="eyebrow"><span class="status-dot" /> SYSTEM ONLINE</span><p>Ideas into interfaces.<br>Code into experiences.</p><div class="side-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><small>LOCAL SESSION / ENVO1D</small></div>
      <NuxtLink to="/contact" class="side-bottom"><Github :size="16" /> Connection directory <ArrowUpRight :size="15" /></NuxtLink>
    </aside>
    <div class="workspace">
      <header class="topbar"><div><span class="muted">SYSTEM</span><span class="slash">/</span><span>{{ nav.find(n => n.to === route.path)?.label.toUpperCase() || 'WORKSPACE' }}</span></div><div class="top-meta"><span class="status-dot" /> ALL SYSTEMS NOMINAL <span class="divider" /> <span>{{ clock }} UTC</span><span class="user-badge">E</span></div></header>
      <main id="main" tabindex="-1"><slot /></main>
      <footer class="statusbar"><span><Activity :size="12" /> NEURAL LINK ESTABLISHED</span><span>ENVO1D_OS <b>·</b> DEMONSTRATION ENVIRONMENT <b>·</b> v1.0.0</span><button @click="desktop.terminalOpen = true"><Terminal :size="13" /> OPEN TERMINAL</button></footer>
    </div>
    <ClientOnly><BootSequence /><TerminalPanel /><div v-show="route.path === '/lab'"><LabWindows /></div></ClientOnly>
  </div>
</template>


