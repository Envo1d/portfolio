<script setup lang="ts">
import { Terminal, X } from 'lucide-vue-next'
import { projects, profile, stack } from '~/data/projects'
const desktop = useDesktopStore()
const input = ref(''); const field = ref<HTMLInputElement>(); const scroll = ref<HTMLElement>()
const lines = ref(['ENVO1D NEURAL SHELL [Version 1.0]', 'Type help to see available commands. Demo environment.'])
const history: string[] = []; let cursor = 0
watch(() => desktop.terminalOpen, async (open) => { if (open) { await nextTick(); field.value?.focus() } })
async function run() {
  const raw = input.value.trim(); if (!raw) return
  history.push(raw); cursor = history.length; input.value = ''; lines.value.push(`envo1d@neural:~$ ${raw}`)
  const [command, argument] = raw.split(/\s+/)
  switch (command?.toLowerCase()) {
    case 'help': lines.value.push('help · whoami · skills · projects · open <signal|orbit> · github · contact · clear'); break
    case 'whoami': lines.value.push('Envoid // Software Developer. Web and desktop applications. Interested in AI development, systems programming, and blockchain.'); break
    case 'skills': lines.value.push(stack.join(' / ')); break
    case 'projects': lines.value.push(...projects.map(p => `${p.id} — ${p.name} [${p.framework}, DEMO]`)); break
    case 'open': { const project = projects.find(p => p.id === argument?.toLowerCase()); if (project) { await navigateTo({ path: '/lab', query: { project: project.id } }); desktop.open(project.id); lines.value.push(`Launched ${project.name}.`); desktop.terminalOpen = false } else lines.value.push('Usage: open signal | open orbit'); break }
    case 'github': lines.value.push(profile.github || 'GitHub is not configured. A verified profile URL has not been supplied.'); break
    case 'contact': lines.value.push(profile.email || 'Contact is not configured. No public email has been supplied.'); break
    case 'clear': lines.value = []; break
    default: lines.value.push(`Command not found: ${command}. Type help.`)
  }
  await nextTick(); scroll.value?.scrollTo({ top: scroll.value.scrollHeight })
}
function key(e: KeyboardEvent) { if (e.key === 'ArrowUp') { e.preventDefault(); cursor = Math.max(0, cursor - 1); input.value = history[cursor] || '' } if (e.key === 'ArrowDown') { e.preventDefault(); cursor = Math.min(history.length, cursor + 1); input.value = history[cursor] || '' } if (e.key === 'Escape') desktop.terminalOpen = false }
</script>
<template><div v-if="desktop.terminalOpen" class="terminal-backdrop" @click.self="desktop.terminalOpen = false"><section class="terminal-window" role="dialog" aria-modal="true" aria-label="Neural terminal" @keydown="key"><header><span><Terminal :size="16" /> NEURAL TERMINAL <small> / bash-inspired shell</small></span><button aria-label="Close terminal" @click="desktop.terminalOpen = false"><X :size="20" /></button></header><div ref="scroll" class="terminal-output" role="log" aria-live="polite"><p v-for="(line, index) in lines" :key="index" :class="{ prompt: line.startsWith('envo1d@') }">{{ line }}</p></div><form @submit.prevent="run"><label for="command">envo1d@neural:~$</label><input id="command" ref="field" v-model="input" autocomplete="off" spellcheck="false" aria-label="Terminal command" /><button class="terminal-submit" type="submit">↵</button></form><footer>ENTER TO RUN <span>↑ ↓ HISTORY / ESC TO CLOSE</span></footer></section></div></template>


