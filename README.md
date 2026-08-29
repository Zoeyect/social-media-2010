# SOCIAL MEDIA, 2010

Independent Device Layer prototype for a historically controlled reconstruction of a U.S. black GSM iPhone 4 running iOS 4.1 shortly after midnight Pacific Time on October 20, 2010.

## Scope

Implemented: Hero, powered-off device, press-and-hold power gesture, 30-second cold boot, first lock screen, drag-to-unlock, SpringBoard skeleton, absolute-time 15-minute session, deterministic battery curve, warning triggers, badge state, and local session persistence.

Not implemented: social-app interiors. Any visual without sufficient evidence is visibly marked `HOLD`; placeholders are not claims of historical appearance.

## Run

```sh
npm install
npm run dev
```

Use browser storage removal to reset the current prototype session.

## Generated and recoverable files

Runtime source assets under `src/assets/` are version-controlled because a fresh
clone must not depend on a local generation session. The following local outputs
are intentionally excluded from Git:

- `node_modules/`: restore with `npm install` (or `npm ci` for the locked tree).
- `dist/`: rebuild with `npm run build`.
- `*.tsbuildinfo`: rebuilt by the TypeScript step in `npm run build`.
- `tmp/firmware/`: disposable extraction workspace; provenance and extraction
  details for promoted historical assets live in `docs/evidence/`.
- `.DS_Store`: operating-system metadata with no project content.
