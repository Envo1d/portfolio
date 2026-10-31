<script setup lang="ts">
import { ArrowUpRight, Play } from 'lucide-vue-next'

import nexaLake from '../../../nexa-demo/src/assets/previews/scene-0.webp'
import nexaCity from '../../../nexa-demo/src/assets/previews/scene-1.webp'
import nexaWaterfall from '../../../nexa-demo/src/assets/previews/scene-2.webp'

import type { Project } from '~/data/projects'

defineProps<{ project: Project }>()

const nexaPreviews = [nexaLake, nexaCity, nexaWaterfall]
</script>
<template><article class="project-card"><NuxtLink :to="{ path: '/lab', query: { project: project.id } }" :class="['project-visual', project.accent]" :aria-label="`Launch ${project.name} in Lab`"><div class="mini-title"><span>{{ project.id === 'nexa' ? 'NEXA / MEDIA LIBRARY' : 'EVIC / TEAM WORKSPACE' }}</span><span>•••</span></div><div v-if="project.id === 'nexa'" class="mini-media" aria-hidden="true"><img v-for="preview in nexaPreviews" :key="preview" :src="preview" alt="" loading="lazy" /><span>LIBRARY / STAGE / TAGS</span></div><div v-else class="mini-board"><div v-for="(label, index) in ['BACKLOG', 'IN PROGRESS', 'COMPLETE']" :key="label"><small>{{ label }}</small><i v-for="n in 3 - index" :key="n"><span :style="{ width: `${45 + n * 12}%` }" /><span /><b :class="{ pink: n === 2 }" /></i></div></div><span class="visual-launch"><Play :size="12" /> LAUNCH IN LAB</span></NuxtLink><div class="project-body"><div class="project-heading"><h3>{{ project.name }}</h3><span class="demo-tag">DEMO</span></div><p>{{ project.description }}<template v-if="project.github"> <a :href="project.github" target="_blank" rel="noopener noreferrer" class="project-source">GitHub ↗</a></template></p><div class="project-bottom"><div class="tags"><span v-for="tag in project.tags" :key="tag">{{ tag }}</span></div><NuxtLink :to="{ path: '/lab', query: { project: project.id } }" class="project-launch" :aria-label="`Launch ${project.name} in Lab`">Launch in Lab <ArrowUpRight :size="16" /></NuxtLink></div></div></article></template>

<style scoped>
.project-source {
  margin-inline-start: 8px;
  color: var(--cyan);
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.mini-media {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 18px;
}

.mini-media img {
  width: 100%;
  height: 95px;
  object-fit: cover;
  border: 1px solid var(--line);
  border-radius: 4px;
}

.mini-media > span {
  grid-column: 1 / -1;
  color: var(--muted);
  font: 8px var(--font-mono);
  letter-spacing: 1px;
}
</style>
