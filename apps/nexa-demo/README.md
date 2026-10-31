# Nexa browser demo

Frontend copied from `E:/Coding/Projects/Rust/nexa` (version 2.13.1).
The original browser demo mode uses sample media whenever Tauri is unavailable.
No Rust sources, native binaries, or Tauri CLI are included. Imported Tauri
JavaScript packages are retained so the original client can compile unchanged.

From the portfolio root:

```sh
npm run dev --workspace=@envo1d/nexa-demo
npm run build --workspace=@envo1d/nexa-demo
npm run typecheck --workspace=@envo1d/nexa-demo
npm run lint --workspace=@envo1d/nexa-demo
```

The portfolio mounts the build at `/demos/nexa-demo/`. Relative asset URLs support
both domain-root and repository-path deployments. Demo changes are session-only;
native filesystem operations and desktop window controls require the desktop app.

The copied client is distributed under the included MIT license.
