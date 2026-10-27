<script setup lang="ts">
import { Github, Mail, Terminal } from 'lucide-vue-next'
import { profile } from '~/data/projects'
const desktop = useDesktopStore()
useHead({ title: 'Connect // Envo1d' })
</script>
<template><div class="page"><span class="eyebrow">04 / CONNECTION DIRECTORY</span><h1 class="page-title">Start a conversation<span>.</span></h1><p class="page-description">Find me on GitHub or get in touch by email.<br>Contact links are coming soon.</p><div class="lab-grid"><article class="panel contact-card"><Github :size="28" /><h2>GitHub</h2><a v-if="profile.github" :href="profile.github" target="_blank" rel="noopener">Visit GitHub ↗</a><p v-else>Coming soon</p><small>GitHub profile link will be added here.</small></article><article class="panel contact-card"><Mail :size="28" /><h2>Email</h2><a v-if="profile.email" :href="`mailto:${profile.email}`">{{ profile.email }}</a><p v-else>Coming soon</p><small>Public email address will be added here.</small></article></div><button class="button secondary mt-8" @click="desktop.terminalOpen = true"><Terminal :size="16" /> Or say hello to the terminal</button></div></template>

