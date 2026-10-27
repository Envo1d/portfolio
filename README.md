# ENVO1D // Neural Interface

A responsive developer portfolio with a cyberpunk, sci-fi desktop interface. Built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, and Pinia, with independent React and Vue applications you can launch inside the portfolio.

The interface is in English. Included projects and analytics use demonstration data. Public GitHub and email contacts are currently unconfigured.

## Features

- Personal overview with featured projects, development interests, and a current focus on AI Agent Orchestrator.
- Project explorer with search and React/Vue filters.
- Interactive lab with draggable windows, focus management, minimize/restore, maximize, reload, and links to open demos in a separate tab.
- Desktop, tablet (768 px), and mobile (375 px) demo viewport presets, constrained by the available screen width.
- A simulated terminal with project launch commands and command history.
- A skippable boot sequence shown once per browser tab session, with reduced-motion support.
- Responsive navigation, technology stack, and contact pages.

## Requirements

- Node.js **22.12.0 or newer**, as declared in the root `package.json`.
- pnpm **12.15.0**, pinned by the root `packageManager` field.

If you use Corepack, enable it with `corepack enable` and use the project's pinned package manager version.

## Getting started

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Nuxt, usually `http://127.0.0.1:3000`.

`pnpm dev` first builds both demo applications and copies their output into the portfolio's public directory. The portfolio then runs with hot reload. Embedded demos are served from those built files; after changing a demo, run `pnpm demos:build` and reload its window, or restart `pnpm dev`.

For hot reload while developing a demo independently:

```sh
pnpm --filter @envo1d/react-demo dev
pnpm --filter @envo1d/vue-demo dev
```

Run each command in its own terminal and open the printed URL with the corresponding `/demos/react-demo/` or `/demos/vue-demo/` base path.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Build and copy demos, then start the Nuxt development server. |
| `pnpm demos:build` | Type-check and build both demos, then copy them into the portfolio. |
| `pnpm typecheck` | Run TypeScript checks across all three applications. |
| `pnpm build` | Build the demos and the production Nuxt/Nitro application. |
| `pnpm preview` | Preview an existing portfolio production build locally. |
| `pnpm generate` | Build the demos and generate the static portfolio. |

## Repository structure

```text
apps/
  portfolio/                 # Nuxt portfolio (@envo1d/portfolio)
    app/
      assets/css/            # Tailwind integration and interface styles
      components/            # Boot sequence, terminal, cards, demo windows
      data/                  # Profile, overview, projects, technology stack
      layouts/               # Shared navigation and interface shell
      pages/                 # Portfolio routes
      stores/                # Pinia window and terminal state
    public/
      demos/                 # Generated demo builds; ignored by Git
      images/                # Profile avatar
    nuxt.config.ts           # Nuxt, metadata, and prerender configuration
  react-demo/                # Signal dashboard (@envo1d/react-demo)
  vue-demo/                  # Orbit taskboard (@envo1d/vue-demo)
scripts/
  copy-demos.mjs             # Copies Vite builds into portfolio/public/demos
```

The portfolio uses Nuxt 4, Vue 3, Vue Router 5, Pinia 3, Tailwind CSS 4, and Lucide icons. The demos use Vite 6 with React 19 or Vue 3. Dependency ranges are declared in each application's `package.json`; resolved versions are recorded in `pnpm-lock.yaml`.

## Routes

| Path | Content |
| --- | --- |
| `/` | Personal overview, featured demos, technologies, and current work. |
| `/projects` | Searchable project explorer with framework filters. |
| `/lab` | Demo launcher and interactive application windows. |
| `/stack` | Technology stack. |
| `/contact` | Public contacts and their configuration status. |
| `/demos/react-demo/` | Standalone Signal dashboard. |
| `/demos/vue-demo/` | Standalone Orbit taskboard. |

### Demo applications

**Signal dashboard** is a React analytics interface with 24H, 7D, and 30D datasets, selectable chart bars, summary metrics, and a simulated stream toggle. Data is deterministic; the stream control changes UI state without connecting to a live feed.

**Orbit taskboard** is a Vue task board. Add or delete tasks and advance them through Backlog → In progress → Complete → Backlog, with completion progress displayed above the board.

Both demos run in the browser without accounts or a backend. Demo data and window state are held in memory and reset on a full page refresh.

### Terminal

Toggle the terminal with **Ctrl/Cmd + `**. Use **Enter** to run a command, **↑/↓** to browse history, and **Escape** to close it.

```text
help
whoami
skills
projects
open signal
open orbit
github
contact
clear
```

This is a simulated shell with a fixed set of commands. It does not execute system commands. The `github` and `contact` commands display configured contact values or an unconfigured status.

## Customization

| File | What to change |
| --- | --- |
| `apps/portfolio/app/data/overview.ts` | Role, headline, introduction, featured projects, technologies, interests, and current focus. |
| `apps/portfolio/app/data/projects.ts` | Project registry, stack, profile name, GitHub URL, and email address. |
| `apps/portfolio/app/components/TerminalPanel.vue` | Terminal responses, including the separate `whoami` text. |
| `apps/portfolio/public/images/avatar.png` | Profile avatar. |
| `apps/portfolio/app/assets/css/main.css` | Colors, layout, interface styling, and responsive behavior. |
| `apps/portfolio/nuxt.config.ts` | Page title, description, favicon reference, and prerender routes. |

Set `profile.github` and `profile.email` to your verified public contact details. Both default to `null`.

## Adding a demo

1. Create an application under `apps/` with a unique workspace package name and a production build script.
2. For a Vite application, set `base` to `/demos/your-demo/`.
3. Add its build command to the root `demos:build` script and its directory name to `scripts/copy-demos.mjs`.
4. Register the project in `apps/portfolio/app/data/projects.ts`. Extend the framework type and explorer filters if you introduce another framework.
5. Optionally add its project ID to `overview.featuredIds` in `apps/portfolio/app/data/overview.ts`.

The existing demos are single-page applications without nested routes. For a demo with client-side routes, use hash routing or configure its base path and hosting fallback.

Demo windows use iframes with `sandbox="allow-scripts allow-same-origin allow-forms"`. They are intended for trusted local applications and separate the apps' CSS and JavaScript environments. For untrusted or third-party content, use a separate origin and review sandbox permissions and the provider's embedding policy. The portfolio does not exchange application data with the demos.

## Deployment

The project is configured to run at the root of a domain. Demo asset paths are rooted at `/demos/`.

### Node.js server

```sh
pnpm build
node apps/portfolio/.output/server/index.mjs
```

Configure the server address and port using the `HOST` and `PORT` environment variables.

### Static hosting

```sh
pnpm generate
```

Deploy the contents of `apps/portfolio/.output/public`. Configure the host to resolve generated route directories to their `index.html` files, including `/projects`, `/lab`, `/stack`, and `/contact`. The demo builds are included under `/demos/`.

## Validation

```sh
pnpm typecheck
pnpm build
```

Use `pnpm preview` after building to check the production output. Check navigation, project search and filters, terminal commands, window controls, and both demos at desktop and mobile sizes. The repository currently has no automated test script.
