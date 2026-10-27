<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { projects } from '~/data/projects'
const query = ref(''); const framework = ref('All')
const filtered = computed(() => projects.filter(p => (framework.value === 'All' || p.framework === framework.value) && `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(query.value.toLowerCase())))
useHead({ title: 'Project Explorer // Envo1d' })
</script>
<template><div class="page"><span class="eyebrow">01 / PROJECT EXPLORER</span><h1 class="page-title">Built to be explored<span>.</span></h1><p class="page-description">Browse projects, explore their stack, and choose what to try.<br>Select “Launch in Lab” to open an interactive demo in your workspace.</p><div class="filterbar"><div class="tabs"><button v-for="f in ['All', 'React', 'Vue']" :key="f" :class="{ active: framework === f }" @click="framework = f">{{ f }}<span v-if="f === 'All'">02</span></button></div><label class="search"><Search :size="16" /><input v-model="query" aria-label="Search projects" placeholder="Search projects..." /></label></div><div class="projects-grid"><ProjectCard v-for="project in filtered" :key="project.id" :project="project" /></div><p v-if="!filtered.length" class="empty">No projects match. Try another search or framework.</p></div></template>

