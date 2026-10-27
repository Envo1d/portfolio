<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Braces, Code2, FolderOpen, Mail, Server } from 'lucide-vue-next'
import { profile } from '~/data/projects'
import { featuredProjects, overview } from '~/data/overview'
const directionIcons = { interfaces: Code2, systems: Server, desktop: Braces }
useHead({ title: 'Envoid // Software Developer' })
</script>
<template>
  <div class="page overview">
    <div class="page-kicker"><span><span class="status-dot" /> PERSONAL PORTFOLIO</span><span>ENVO1D / NEURAL INTERFACE</span></div>
    <section class="hero" aria-labelledby="intro-title">
      <div class="hero-copy">
        <div class="eyebrow">HELLO, WORLD. I'M</div>
        <h1 id="intro-title">{{ profile.name }}<span class="cursor-block" /></h1>
        <div class="intro-role">{{ overview.role }}</div>
        <h2>{{ overview.headline }}</h2>
        <p>{{ overview.introduction }}</p>
        <div class="hero-actions">
          <NuxtLink class="button primary" to="/projects">View projects <ArrowUpRight :size="17" /></NuxtLink>
          <NuxtLink class="button secondary" to="/contact"><Mail :size="16" /> Get in touch</NuxtLink>
        </div>
        <div class="hero-meta"><span><FolderOpen :size="14" /> EXPLORE THE WORK</span><span><Code2 :size="14" /> TRY THE DEMOS</span></div>
      </div>
      <div class="identity-visual">
        <img src="/images/avatar.png" alt="Envoid cyberpunk character in a neon circle" width="1254" height="1254" fetchpriority="high" />
        <span class="image-top">IDENTITY MODULE <span>● LIVE</span></span>
        <div class="crosshair top-left" /><div class="crosshair bottom-right" />
        <div class="portrait-caption"><span>DEVELOPER PROFILE</span><strong>{{ profile.name.toUpperCase() }}</strong><small>HUMAN INPUT. DIGITAL OUTPUT.</small></div>
        <span class="image-side">NEURAL SYNC // ESTABLISHED</span>
      </div>
    </section>

    <section class="overview-section" aria-labelledby="featured-title">
      <div class="section-heading"><div><span class="eyebrow">01 / SELECTED WORK</span><h2 id="featured-title">A few things to explore<span>.</span></h2></div><NuxtLink to="/projects">All projects <ArrowRight :size="16" /></NuxtLink></div>
      <div class="projects-grid"><ProjectCard v-for="project in featuredProjects" :key="project.id" :project="project" /></div>
      <p class="data-note">// Interactive sample projects built for this portfolio. Metrics and tasks use demo data.</p>
    </section>

    <section class="overview-section" aria-labelledby="directions-title">
      <div class="section-heading"><div><span class="eyebrow">02 / DEVELOPMENT DIRECTIONS</span><h2 id="directions-title">From interaction to implementation<span>.</span></h2></div></div>
      <div class="direction-grid">
        <article v-for="direction in overview.directions" :key="direction.id" class="panel direction-card">
          <component :is="directionIcons[direction.id as keyof typeof directionIcons]" :size="23" aria-hidden="true" />
          <h3>{{ direction.title }}</h3><p>{{ direction.description }}</p><span class="direction-technologies">{{ direction.technologies }}</span>
        </article>
      </div>
    </section>

    <section class="stack-strip overview-stack" aria-labelledby="stack-title">
      <div><span class="eyebrow">03 / CORE TOOLKIT</span><h2 id="stack-title">Tools behind the work.</h2></div>
      <div class="stack-chips"><span v-for="tech in overview.technologies" :key="tech">{{ tech }}</span><NuxtLink to="/stack">Full stack <ArrowUpRight :size="14" /></NuxtLink></div>
    </section>

    <section class="panel focus-panel overview-section" aria-labelledby="focus-title">
      <div class="focus-copy"><span class="eyebrow"><span class="status-dot" /> 04 / CURRENT FOCUS</span><h2 id="focus-title">{{ overview.focus.title }}<span>.</span></h2><p>{{ overview.focus.description }}</p><div class="tags"><span v-for="tag in overview.focus.tags" :key="tag">{{ tag }}</span></div></div>
      <div class="focus-learning"><Braces :size="24" aria-hidden="true" /><span class="eyebrow">CURRENTLY LEARNING</span><strong>{{ overview.focus.learning }}</strong></div>
    </section>
  </div>
</template>

