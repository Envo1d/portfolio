# Evic demo

The UI was copied from the sibling `evic-app/client` project and adapted for static hosting. The original project is unchanged.

Run `npm run dev --workspace=@envo1d/evic-demo` from the repository root. Build all demos with `npm run demos:build`. The portfolio serves this app at `/demos/evic-demo/`; hash routes support GitHub Pages repository base paths.

## Behavior

- Starts as a sample user without registration, cookies, real tokens, or a backend.
- Includes two joined teams, an incoming invitation, members and roles, three boards, and populated kanban lists.
- Supports board creation, renaming, deletion; list creation, renaming, copying, deletion, reordering; card creation, editing, copying, deletion, and dragging between lists.
- Supports team creation, selection, renaming, leaving, deletion; member removal and role changes; role creation and deletion; local invitations, cancellation, acceptance, rejection.
- Profile fields and interval settings are local. The password field is disabled; passwords are never stored.
- Changes persist under `envo1d.evic-demo.v1` in localStorage. Storage failures fall back to memory. **Reset demo** restores sample data.
- Covers are embedded SVG illustrations. No Unsplash, Google Fonts, authentication, mail, or payment requests.
- Activity and Billing were links without implemented pages in the source client. The demo adds a local activity log and an explicitly simulated plan selector. Plan selection lasts until the screen unmounts.

The copied timer repository is mocked for completeness. The original client has no timer page, comments editor, priority editor, or task assignment UI, so the demo does not invent those screens.

## Validation

```sh
npm run typecheck --workspace=@envo1d/evic-demo
npm run test --workspace=@envo1d/evic-demo
npm run build --workspace=@envo1d/evic-demo
```

Workflow tests cover movement and copies, response isolation, separation between teams, team and role lifecycle, invitations, persistence, password exclusion, reset, and absence of network calls.
