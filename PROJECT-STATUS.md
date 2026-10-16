# Dark Editorial redesign — current, 2026-10-16

Existing Vite code preserved on codex/dark-editorial. Shared dark design system,
four self-hosted fonts, actual rendered-font checks, Home, About, project library,
Experience/year filters, 3 photographic cases, retained 3D carousel/local studio.
Seven records: 3 published cases and 4 hidden candidate drafts. No new Drive
photos introduced. Original Drop production remains separate and preserved.

Local build/lint/types, responsive Chromium, case routes, fonts/images, HMR and
studio tests passed. WebKit download is blocked; not represented as tested.
GitHub CI definitions are prepared; execution and Git-linked Netlify CD require
actual remote verification. Netlify official OAuth succeeded; existing site has
no repository link or GitHub account integration. See docs/DEPLOYMENT.md.

Preview delivery must be based on an actual successful upload and browser check;
no production replacement is authorized before owner review.

---

The following is historical and may describe superseded environment limitations.

# Current status — complete-site build, 2026-10-16

Homepage preserved; three independent case pages, browser-local draft studio,
responsive layout, navigation, reduced motion, subtle parallax and strict content
validation implemented. Build, HMR and production browser/routes/studio suites
passed. See docs/VALIDATION.md for executed checks and limits.

The studio manages this device only. Real photos, shared authenticated CMS and
verified case outcomes are not represented as complete. Netlify deployment is
blocked by environment proxy CONNECT 403 and absent Netlify authorization.
Network/credential requirements are saved as environment draft metadata.
No working external preview URL is available yet; do not report first-version
completion until a deployment and its browser behavior have been verified.

---

The following entries are historical logs and do not describe the current scope.

# Phase 1 — verified implementation

This checkout is the user's uploaded Vite/React starter, repaired in place.
The separate Next.js documents describe unavailable source and are not evidence
that those routes, photos, CMS interfaces or deployments exist here.

## Verified 2026-10-16

- npm install succeeded; package-lock.json generated for the Vite project.
- npm ci succeeded using the lockfile and verified cached packages.
- npm run dev started successfully on port 5173.
- npm run build passed strict TypeScript and Vite production compilation.
- Production preview started on port 4173.
- Chromium checks passed against both dev and built output at widths 1440, 768,
  390, 320. Checks: six main sections plus Contact footer, no horizontal overflow,
  carousel buttons, scoped keyboard arrows, mouse drag, tablet/mobile touch
  events, project-card selection, mobile menu closing, reduced-motion preferences
  and no failed HTTP assets or uncaught JavaScript errors.
- Reusable browser suite: tests/browser.cjs, invoked with npm run test:browser.
  Reports/screenshots: ignored .artifacts/. These are emulated device checks;
  physical-device Safari and full accessibility audits remain untested.

## Retained and repaired

Hero, 3D CSS Showcase, Selected Projects, About, Journey and Contact retained.
Added strict TS config, React Fast Refresh, local bundled fonts, skip link,
keyboard focus, menu accessibility state, reduced-motion initial reveal,
carousel swiping and correct project-to-showcase selection.

## Boundaries and pending work

Artwork and portrait are placeholders, contact address is absent, and project
copy is preliminary. No new personal details or real photos were introduced.
Case-study routes, CMS, real approved imagery and authenticated editing remain
future phases. No GitHub push or Netlify deployment occurred. noindex is not
access protection. Protected Netlify preview must be configured and verified
before sharing; public release still requires user confirmation.

Environment install_script and start_skill drafts were saved; they are not a
published environment snapshot or proof of restoration in another task.

## GitHub main synchronization and refinement

Fetched remote main c9e49c4d900dac2746bc8d86226588811d0e3800; its tree contained
only README.md. Local main now tracks origin/main. Prior workspace files were
fully archived at /workspace/scratch/branden-before-github-sync.tar.gz and checked
byte-for-byte before the branch switch. The supplied Vite source was retained.

Added src/content/projects.ts, editorial project captions/numbering, warm geometric
artwork, refined hero typography and grain, stronger control/focus states, and
pointer-cancellation handling. Removed fixed carousel count assumptions.

Reinstalled dependencies with npm ci, rebuilt successfully, and restarted dev
and production-preview services. Chromium acceptance passed in dev and production
at all four widths, including new keyboard-scope and cancelled-gesture regression
checks. A test-only smooth-scroll race was diagnosed from actual event coordinates
and corrected with deterministic positioning. The portable HTML generator is
scripts/create-preview.mjs; npm run export:preview succeeds. No photos, deployment
or GitHub write occurred.

## Live visual editing workflow

Vite remains running on port 5173. The page component was extracted to
src/App.tsx, keeping src/main.tsx as the bootstrap for a valid Fast Refresh
boundary. Compared with the previous source archive: page markup and behavior
are unchanged after removing bootstrap-only imports.

npm run test:hmr passed real WebSocket + browser checks: CSS changes, component
changes, content changes, retained carousel state, no full navigation, no JS
errors, and restoration of invisible test probes. Watcher probes/restorations
are spaced outside its duplicate-event window. TypeScript and build passed;
source and dist were checked to contain no probes. No static HTML was exported
for this task, no screenshot workflow was used, and no deployment occurred.

The current chat has no port-forwarding or embedded preview capability.
docs/LIVE_PREVIEW.md describes a Mac local-project workflow. AGENTS.md preserves
the user's requested edit scope and persistent dev-server policy. Updated
start_skill was saved as an environment draft, not published.

## Mac + Safari launcher

Added scripts/start-safari.command with macOS platform guard, Node version
check, optional Homebrew Node 24 installation, lockfile-based dependency restore,
project-scoped running-server reuse, loopback-only available-port selection,
Safari opening and foreground Vite logs. bash -n passed. No Mac is attached:
actual Homebrew, macOS permissions, Safari launch and Safari HMR remain untested.
Cloud Node 24.19.0, complete source/dependencies, live HTTP response and the
Chromium CSS/component/content HMR test were revalidated. No GitHub remote change,
Netlify deploy, static HTML regeneration or website-design edit occurred.
