<script setup lang="ts">
import { ArrowUpRight, FolderOpen, Monitor, X } from 'lucide-vue-next'
import { projects } from '~/data/projects'
const desktop = useDesktopStore()
const route = useRoute()
onMounted(() => {
  watch(() => route.query.project, (id) => {
    if (typeof id === 'string' && projects.some(project => project.id === id)) desktop.open(id)
  }, { immediate: true })
})
useHead({ title: 'Project Lab // Envo1d' })
</script>
<template>
  <div class="page lab-page">
    <span class="eyebrow">02 / PROJECT LAB</span>
    <div class="section-heading lab-heading">
      <div><h1 class="page-title">Your demo workspace<span>.</span></h1><p class="page-description">Run projects selected in Explorer. Switch viewports, compare apps, and manage your open sessions here.</p></div>
      <NuxtLink to="/projects" class="button secondary"><FolderOpen :size="16" /> Browse projects</NuxtLink>
    </div>
    <div v-if="!desktop.windows.length" class="panel lab-empty">
      <Monitor :size="40" aria-hidden="true" />
      <h2>Your workspace is ready.</h2>
      <p>Choose a project in Explorer and select “Launch in Lab” to start an interactive demo.</p>
      <NuxtLink to="/projects" class="button primary">Open Project Explorer <ArrowUpRight :size="16" /></NuxtLink>
    </div>
    <div v-else class="panel session-list lab-sessions">
      <h2>Open sessions <span class="muted">/ {{ desktop.windows.length }}</span></h2>
      <div v-for="w in desktop.windows" :key="w.id" class="session-row">
        <button @click="desktop.open(w.id)"><Monitor :size="18" /><span>{{ projects.find(p => p.id === w.id)?.name }}</span><span>{{ w.minimized ? 'RESTORE ↗' : 'FOCUS ↗' }}</span></button>
        <button class="session-close" :aria-label="`Close ${projects.find(p => p.id === w.id)?.name}`" @click="desktop.close(w.id)"><X :size="16" /></button>
      </div>
    </div>
    <p class="data-note">// Sessions stay open while you browse the site. Return here to resume. Refreshing resets the workspace.</p>
  </div>
</template>
