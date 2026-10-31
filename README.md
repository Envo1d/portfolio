# ENVO1D // Neural Interface

A responsive developer portfolio with a cyberpunk, sci-fi desktop interface. Built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, and Pinia, with independent Vue and React applications you can launch inside the portfolio.

The interface is in English. Included projects and analytics use demonstration data. Public GitHub and email contacts are currently unconfigured.

## Features

- Personal overview with featured projects, development interests, and a current focus on AI Agent Orchestrator.
- Project explorer with search and framework filters.
- Interactive lab with draggable windows, focus management, minimize/restore, maximize, reload, and links to open demos in a separate tab.
- Desktop, tablet (768 px), and mobile (375 px) demo viewport presets, constrained by the available screen width.
- A simulated terminal with project launch commands and command history.
- A skippable boot sequence shown once per browser tab session, with reduced-motion support.
- Responsive navigation, technology stack, and contact pages.

## Requirements

- Node.js **22.12.0 or newer**, as declared in the root `package.json`.
- npm (included with Node.js); CI uses Node.js 24.

If you use Corepack, enable it with `corepack enable` and use the project's pinned package manager version.

## Getting started

Run from the repository root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Nuxt, usually `http://127.0.0.1:3000`.

`npm run dev` first builds both demo applications and copies their output into the portfolio's public directory. The portfolio then runs with hot reload. Embedded demos are served from those built files; after changing a demo, run `npm run demos:build` and reload its window, or restart `npm run dev`.

For hot reload while developing a demo independently:

```sh
npm run dev --workspace=@envo1d/nexa-demo
npm run dev --workspace=@envo1d/evic-demo
```

Run each command in its own terminal and open its printed local URL.
## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Build and copy all demos, then start the Nuxt development server. |
| `npm run demos:build` | Type-check and build both demos, then copy them into the portfolio. |
| `npm run typecheck` | Run TypeScript checks across all three applications. |
| `npm run build` | Build the demos and the production Nuxt/Nitro application. |
| `npm run preview` | Preview an existing portfolio production build locally. |
| `npm run generate` | Build the demos and generate the static portfolio. |

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
  nexa-demo/                 # Nexa media library (@envo1d/nexa-demo)
  evic-demo/                 # Evic workspace (@envo1d/evic-demo)
scripts/
  copy-demos.mjs             # Copies Vite builds into portfolio/public/demos
```

The portfolio uses Nuxt 4, Vue 3, Vue Router 5, Pinia 3, Tailwind CSS 4, and Lucide icons. Nexa uses Vue 3 and Vite 8; Evic uses React 18 and Vite 6 from the source client. Dependency ranges are declared in each application's `package.json`; resolved versions are recorded in `package-lock.json`.

## Routes

| Path | Content |
| --- | --- |
| `/` | Personal overview, featured demos, technologies, and current work. |
| `/projects` | Searchable project explorer with framework filters. |
| `/lab` | Demo launcher and interactive application windows. |
| `/stack` | Technology stack. |
| `/contact` | Public contacts and their configuration status. |
| `/demos/nexa-demo/` | Nexa media library in browser demo mode. |
| `/demos/evic-demo/` | Evic teams and kanban workspace with local mock data. |

### Demo applications

**Nexa** copies the frontend from the Nexa desktop project, including its existing browser demo mode: sample media, library and Stage views, tags, filters, and collections. Rust sources, native executables, and the Tauri build toolchain are excluded. The Tauri JavaScript libraries remain because the original client imports them and guards native operations.

Both demos run in the browser without accounts or a backend. Nexa demo data and portfolio window state reset on a full page refresh; Evic changes persist locally until reset.

**Evic workspace** preserves the client UI from `evic-app`: teams, roles, members, invitations, boards, lists, draggable cards, and profile settings. It opens without registration. All operations are mocked in the browser, covers are embedded locally, and changes persist in localStorage until **Reset demo**. Activity and Billing are simulated demo screens. See [the Evic demo README](apps/evic-demo/README.md) for scope and checks.

### Terminal

Toggle the terminal with **Ctrl/Cmd + `**. Use **Enter** to run a command, **↑/↓** to browse history, and **Escape** to close it.

```text
help
whoami
skills
projects
open nexa
open evic
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

Nexa is a single-page application without nested routes; Evic uses hash routing. For a demo with client-side routes, use hash routing or configure its base path and hosting fallback.

Demo windows use iframes with `sandbox="allow-scripts allow-same-origin allow-forms"`. They are intended for trusted local applications and separate the apps' CSS and JavaScript environments. For untrusted or third-party content, use a separate origin and review sandbox permissions and the provider's embedding policy. The portfolio does not exchange application data with the demos.

## Deployment

The project is configured to run at the root of a domain. Demo asset paths are rooted at `/demos/`.

### Node.js server

```sh
npm run build
node apps/portfolio/.output/server/index.mjs
```

Configure the server address and port using the `HOST` and `PORT` environment variables.

### Static hosting

```sh
npm run generate
```

Deploy the contents of `apps/portfolio/.output/public`. Configure the host to resolve generated route directories to their `index.html` files, including `/projects`, `/lab`, `/stack`, and `/contact`. The demo builds are included under `/demos/`.

## Validation

```sh
npm run typecheck
npm run build
```

Use `npm run preview` after building to check the production output. Check navigation, project search and filters, terminal commands, window controls, and both demos at desktop and mobile sizes. Run `npm run test --workspace=@envo1d/evic-demo` for Evic mock workflow tests.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` собирает сайт и оба демо при push в `main` или ручном запуске через Actions. В GitHub откройте Settings → Pages → Build and deployment и выберите Source: GitHub Actions. Затем отправьте workflow и изменения путей в `main`. Адрес опубликованного сайта появится в Settings → Pages и в результате deployment.

Базовый путь определяется автоматически через `actions/configure-pages`: поддерживаются адрес репозитория `/portfolio/`, корень `username.github.io` и настроенный собственный домен. Публикуется только `apps/portfolio/.output/public` после `npm run generate`.
