<script setup lang="ts">
const visible = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
function finish() { visible.value = false; clearInterval(timer); try { sessionStorage.setItem('envo1d-boot', '1') } catch {} }
function key(e: KeyboardEvent) { if (visible.value && ['Escape', 'Enter'].includes(e.key)) finish() }
onMounted(() => { try { visible.value = !sessionStorage.getItem('envo1d-boot') && !matchMedia('(prefers-reduced-motion: reduce)').matches } catch { visible.value = false }; if (visible.value) timer = setInterval(() => { progress.value += 20; if (progress.value >= 100) finish() }, 260); window.addEventListener('keydown', key) })
onUnmounted(() => { clearInterval(timer); window.removeEventListener('keydown', key) })
</script>
<template><div v-if="visible" class="boot" role="dialog" aria-modal="true" aria-label="System boot"><div class="boot-inner"><span class="eyebrow">ENVO1D // NEURAL INTERFACE</span><h1>Establishing<br><em>neural link.</em></h1><p>> Mounting workspace... OK<br>> Loading independent demo environments... OK<br>> Initializing interface... {{ progress }}%</p><progress :value="progress" max="100" aria-label="Boot progress" /><button class="button primary" autofocus @click="finish">Skip boot ↗</button><small>ENTER / ESC TO SKIP</small></div></div></template>
